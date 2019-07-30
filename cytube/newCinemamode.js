//TODO make resize slider beautiful
//TODO make ELS work in whisper chat too
//TODO Hide Chat
//		create a minimize bar with new/unread chat messages/polls/whisper label
//		Optional: popup messaging
//TODO Tabs
//		make chats appear in Tabs
//		make polls appear in Tabs
//		Optional: make the playlist appear in Tabs
//TODO Sound
//		make sounds (alarm someone function) and toggle sound
//		make it possible to post audio snips (like pics)
//TODO anime MAL reflink Graph
//#################################################################################################

//make emotelist search input autofocus (both cinemamode and standard)
$('#emotelist').on('shown.bs.modal', function () {
	$('.emotelist-search')[0].focus();
});

//add config menu cog *********************************************************************
$("#chatheader").append(`<span id="config-cog1" class="label label-default pointer chatheaderbtn"">&#9881;</span>`);
$("#chatwrap").append(`<div id="config-cog-box1" style="display:none;" class="config-cog-box"></div>`);

$("#config-cog1").on("click", function(e){
	e.stopPropagation();
	$("#config-cog-box1").toggle();
	$("#config-cog1").toggleClass("chatheaderbtn-active");
	//autohide after clicking elsewhere
	if ($("#config-cog-box1").is(":visible")){
		document.addEventListener("click", function autoremovefun(e){
			e.stopPropagation();
			if (!$(e.target).is("#config-cog-box1 *")){
				$("#config-cog-box1").hide();
				$("#config-cog1").removeClass("chatheaderbtn-active");
				document.removeEventListener('click', autoremovefun);
			}
		});
	}
});

let miscCSS = `

/************************************/
/*	 fix Chatheader alignment		*/
/************************************/
#chatheader{
	display: flex !important;
}
.chat-right #chatheader{
	flex-direction: row-reverse;
}
#chatheader span{
	user-select: none;
}
#userlisttoggle{
	order: 10;
}
#usercount{
	order: 20;
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
}
/************************************/
/*	 Chatheader Config Cog			*/
/************************************/
#config-cog1{
	order: 30;
}
.config-cog-box{
	position: absolute;
	z-index: 950;
	top: 20px;
	max-width: 90%;
	max-height: 80%;
	background-color: #2b382d;
}
.chatheaderbtn-active{
	color: #d25a5a;
}
`;

this.style = $("<style>").attr("type", "text/css").attr("id", "cinemaStyle").html(miscCSS).appendTo("head");


//*************************************************************************************************
//*************************************************************************************************
//*************************************************************************************************

class Cinemamode {
	
	constructor() {
		//singleton
		if (CLIENT.cinemaMode){
			return CLIENT.cinemaMode;
		}
		
		//fix Chat Position (Left/Right), make depending Elements properly align by adding 'conditional' CSS classes
		if ($("#videowrap").nextAll().filter("#chatwrap").length !== 0){
			$("body").addClass("chat-right");
		} else {
			$("body").addClass("chat-left");
		}
		
		Cinemamode.createButtons();
		//Cinemamode.registerCinemaCommand()
		
		let cinemaCSS = Cinemamode.getCinemamodeStyle();
		this.style = $("<style>").attr("type", "text/css").attr("id", "cinemaStyle").html(cinemaCSS).appendTo("head");
		
		Cinemamode.addHideScrollbarWhileHoveringEle($("#chatwrap"), 1200);
		

		
		CLIENT.cinemaMode = this;
	}
	
	/*
	registerCinemaCommand() {
		$("#chatline").trigger("registerCommand", ["cinema", this.handleCinemaCommand.bind(this)])
	}
	
	handleCinemaCommand(message, target) {
		var params = message.substring(1).replace(/cinema ?/, "").trim();
		if (!params.length) {
			$("#cinematoggle").click()
		}
		//hide polls
		if (params === "nopolls") {
			$("body").addClass("cinema-nopoll");
			$("#messagebuffer").trigger("whisper", `Cinema: Poll overlay disabled`);
			localStorage.setItem(`${CHANNEL.name}_cinemaHidePolls`, 1)
		}
		//show polls
		if (params === "polls") {
			$("body").removeClass("cinema-nopoll");
			$("#messagebuffer").trigger("whisper", `Cinema: Poll overlay enabled`);
			localStorage.setItem(`${CHANNEL.name}_cinemaHidePolls`, 0)
		}
	}
	*/
	
	static createButtons(){
		//add Button to navbar Layout > Cinemamode ************************************************
		$('a[onclick*="removeVideo"]').parent().parent().append(
		`<li><a href='javascript:void(0)' onclick='javascript:$("#cinematoggle").click()'>Cinema Mode</a></li>`
		);
		
		//add toggle Cinemamode Button to top right corner of window ******************************
		$('<div id="cinematoggle"><span class="glyphicon glyphicon-new-window "></span></div>').insertAfter("#nav-collapsible .navbar-nav").click(Cinemamode.toggleCinemamode);
		
		//resize slider bar
		Cinemamode.addResizeSlider();
		
		//add emote button to cinemamode (next to chat input) *************************************
		$("#chatline").after('<div id="chatline-wrapper"></div>');
		$("#chatline-wrapper").append($("#chatline"));
		$("#chatline-wrapper").append($('<button id="cinema-emotes" class="cinemashow hide" onclick="" ><div id="cinema-emote-smiley">☺</div></button>'));
		let emotebtnfun = jQuery._data($("#emotelistbtn")[0], "events" ).click[0].handler;
		$("#cinema-emotes").click(emotebtnfun);
		
	}
	
	static toggleCinemamode(){
		//when entering cinemamode
		if (!$("body").hasClass("cinemachat")) {
			//hide userlist on entering cinemamode
			if ($("#userlist").is(":visible")) {
				$("#userlisttoggle").click();
			}
			
			$("html, body").animate({ scrollTop: 0 }, "slow");
		}
		$("body").toggleClass("cinemachat");
		if ($("iframe[src*=livestream]").length) {
			PLAYER.mediaType = "";
			PLAYER.mediaId = "";
			socket.emit("playerReady");
		}
		handleWindowResize();
	}
	
	static addHideScrollbarWhileHoveringEle(ele, delay){
		ele.mouseout(function(e){
			//this is the original element the event handler was assigned to
			let hoveredele = e.toElement || e.relatedTarget;

			if ( this.contains(hoveredele) ) {
			   return;	//we dont want the event do anything when it is triggered by a child element
			}
			//let ele = $(this);
			if (ele.data('timeoutId')){
				clearTimeout(ele.data('timeoutId'));
				ele.removeData('timeoutId'); 
			}
			document.body.classList.remove("hidescrollbar");
		});
		ele.mouseover(function(){
			//let ele = $(this);
			if (ele.data('timeoutId') ){
				return;	//if timeout function already set nothing todo here
			}
			let timeoutId = setTimeout(function(){
				document.body.classList.add("hidescrollbar");
			}, delay)
			ele.data('timeoutId', timeoutId); 
		});
	}
	
	static addResizeSlider(){
		
		let wrapper = $("#main");
		wrapper.append('<div id="chat-resizeslider" class="cinemashow" slidervar="--cinema-chatvid-width" draggable="true"></div>');
		
		let rslidertop = document.createElement("div");
		let rsliderbottom = document.createElement("div");
		rslidertop.id = "rslidertop";
		rsliderbottom.id = "rsliderbottom";
		rslidertop.className = "resizeslider";
		rsliderbottom.className = "resizeslider";
		
		wrapper.append(rslidertop);
		wrapper.append(rsliderbottom);
		
		$("#chat-resizeslider").on("dragstart", function(e){
			let img = new Image();
			img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
			e.originalEvent.dataTransfer.setDragImage(img, 0, 0);
			
			let mouseX = e.originalEvent.pageX - this.offsetLeft;
			let mouseY = e.originalEvent.pageY - this.offsetTop;
			
			rslidertop.style.display = "block";
			rsliderbottom.style.display = "block";
			
			rslidertop.style.left = mouseX + "px";
			rslidertop.style.height = (mouseY - 10) + "px";
			rsliderbottom.style.left = mouseX + "px";
			rsliderbottom.style.height = (this.clientHeight - mouseY - 10) + "px";
		});

		wrapper.on('dragover', function(e){
			let mouseX = e.originalEvent.pageX - this.offsetLeft;
			let mouseY = e.originalEvent.pageY - this.offsetTop;
			
			let minX = this.clientWidth * 0.1; //10%
			let maxX = this.clientWidth * 0.2; //20%
			
			if (document.body.classList.contains("chat-right")){
				[minX, maxX] = [maxX, minX]; //swap values
			} 
			
			let newmouseX = mouseX;
			if (mouseX < minX) {
					newmouseX = minX;
			} else if (mouseX > (this.clientWidth - maxX) ) {
					newmouseX = this.clientWidth - maxX;
			} 
			rslidertop.style.left = newmouseX + "px";
			rsliderbottom.style.left = newmouseX + "px";
			
			rslidertop.style.height = (mouseY - 10) + "px";
			rsliderbottom.style.height = (this.clientHeight - mouseY - 10) + "px";
		});
		
		$("#chat-resizeslider").on("dragend", function(e){
			e.preventDefault();

			let slidervar = this.getAttribute("slidervar");
			let vid
			let newX;
			if (document.body.classList.contains("chat-right")){
				newX = window.innerWidth - e.originalEvent.pageX;
			} else {
				newX = e.originalEvent.pageX;
			}
			let limit_min = window.innerWidth * 0.1;	//10%
			let limit_max = window.innerWidth * 0.8;	//20%
			if (newX < limit_min){newX = limit_min;}
			else if (newX > limit_max){newX = limit_max;}

			document.documentElement.style.setProperty(slidervar ,  newX + "px");


			rsliderbottom.style.display = "none";
			rslidertop.style.display = "none";
			
			//TODO set slider limits

		});
		
	}
	
	static getCinemamodeStyle(){
		return `
	
body.cinemachat #motdwrap     { display: none; }
body.cinemachat #currenttitle { display: none; }
body.cinemachat .toggle-label { display: none; }
body.cinemachat .dropLabel    { display: none; }
body.cinemachat #videowrap-header { display: none; }

.col-lg-1, .col-lg-10, .col-lg-11, .col-lg-12, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, .col-lg-7, .col-lg-8, .col-lg-9, .col-md-1, .col-md-10, .col-md-11, .col-md-12, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-sm-1, .col-sm-10, .col-sm-11, .col-sm-12, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-xs-1, .col-xs-10, .col-xs-11, .col-xs-12, .col-xs-2, .col-xs-3, .col-xs-4, .col-xs-5, .col-xs-6, .col-xs-7, .col-xs-8, .col-xs-9 {
	min-height: 0px;
}

body.cinemachat #mainpage > .container{
	width: auto !important;
}




body.cinemachat #chatline {
    width:calc(100% - 1px) !important;
    position: relative !important;
}
body.cinemachat:not(.synchtube) #chatline { left: 0px !important; }
body.cinemachat.synchtube #chatline { right: 0px !important; }






body.cinemachat #pmbar {
    width: calc(100% - 400px) !important;
    bottom: 42px;
}
body.cinemachat:not(.synchtube) #pmbar { left: 400px; }



body.cinemachat #pmbar .panel-heading {
    opacity: 0.8;
    background-color: rgba(0,0,0,0.5);
}

body.cinemachat #pmbar .panel {
    opacity: 0.8;
    background-color: rgba(0,0,0,0.5);
}

body.cinemachat .pm-panel:hover {
    border-color: #bbb;
}
body.cinemachat #pmbar .panel:hover {
    opacity: 0.9;
    background-color: rgba(0,0,0,0.77);
}

/* Active poll atop the video  */
body.cinemachat #pollwrap div.active:not(.dismissed) {
    position:fixed !important;
    top:  12px !important;
    z-index:9999 !important;
    min-width: 400px;
    opacity: 0.8;
    background-color: rgba(0,0,0,0.77);
}

body.cinemachat:not(.synchtube) #pollwrap div.active:not(.dismissed) {
    left: 432px !important;
}
body.cinemachat.synchtube #pollwrap div.active:not(.dismissed) {
    left: 32px !important;
}

body:not(.cinemachat) #pollwrap .dismiss {
    display: none;
}

body.cinemachat.cinema-nopoll #pollwrap {
    display: none !important;
}


/************************************************************/
/************************************************************/

#cinematoggle {
    right: 2px;
    top: 0 !important;
    font-size: 16px !important;
    padding: 1px 5px !important;
    border: 2px solid rgba(255,255,255,0.5) !important;
    cursor:pointer;
	float:right;
}


/************************************************************/
/************************************************************/

:root{
	--cinema-chatvid-width: 400px;
}

.cinemachat #mainpage{
	padding-top: 0 !important;
}
.cinemachat #main{
	display: flex !important;
	height: 100vh;
    padding-bottom: 2px;
	margin-bottom: 15px;
}

.cinemachat.chat-left #chatwrap{
	order: 10 !important;
}
.cinemachat.chat-left #videowrap{
	order: 30 !important;
}
.cinemachat.chat-right #chatwrap{
	order: 30 !important;
}
.cinemachat.chat-right #videowrap{
	order: 10 !important;
}
.cinemachat #videowrap{
	display: flex;
	width: calc(100% - var(--cinema-chatvid-width, 400px));
	height: 100vh;
	margin: 0 !important;
	padding: 0 !important;
}
.cinemachat #chatwrap{
	display: flex;
    flex-direction: column;
	width: var(--cinema-chatvid-width, 400px);
	height: 100vh;
	margin: 0 !important;
	padding: 0 !important;
	background-color:#222222 !important;
}

/*chat and video height fix*/
.cinemachat .embed-responsive{
	position: unset !important;
}
.cinemachat .linewrap{
	height: 100% !important;
}


.cinemachat.chat-right .navbar{
	right: var(--cinema-chatvid-width, 400px) !important;
}
.cinemachat.chat-left .navbar{
	left: var(--cinema-chatvid-width, 400px) !important;
}
.cinemachat .navbar{
	z-index: 3500;
    opacity: 0.0;
    transition-delay: 2.0s;
    transition-duration: 1.5s;
	background-image: linear-gradient(#3c3c3c, #323232 60%, #242528) !important;
}
.cinemachat .navbar:hover {
    opacity: 1.0;
    transition: 0.5s;
}

.cinemachat #chat-resizeslider{
	background-color: red;
	width: 5px;
	height: 100%;
	order: 20;
	cursor: col-resize;
}


body.cinemachat.hidescrollbar{
	overflow: hidden;
	
}

/*  */
/************************************/
/*	 		Resize Slider		 	*/
/************************************/
.resizeslider{
	position: absolute;
	z-index: 3250;
    display: block;
    background-color:black;
    left: 0;
    margin-left:1px;
    width: 4px;
}
#rslidertop{top:0;}
#rsliderbottom{bottom:0;}

/************************************/
/*	 Cinema Emote Button (Smiley)	*/
/************************************/
body.cinemchat #chatline{
	width: calc(100% - 41px) !important;
	display: inline-block;
}
#chatline-wrapper{
	display: flex;
}
.cinemachat #cinema-emotes{
	width: 40px;
	background-color: #161a20;
	color: #c8c8c8;
	font-size: 3em;
	line-height: 0;
	padding: 0;
	margin: 0;
	border: none;
	display: flex !important;
	justify-content: center;
}
#cinema-emote-smiley{
	margin-top:auto;
	margin-bottom: 23px;
	-webkit-margin-after:7px;
}

		`;
	}
}

new Cinemamode();


//TODO load ELS in an extra script
//***********************************************************
//***********************************************************
//***********************************************************
//***********************************************************



class WHQbtfyELS{
	constructor(id){
		//create EmoteslistSlim Div
		let elsparentdiv = document.getElementById("chatwrap");
		let elslim = document.createElement('div');
		elslim.id = id || "emoteslist-slim1";
		elslim.classList.add("emoteslist-slim");
		elsparentdiv.appendChild(elslim);
		//noticebox
		$("#chatwrap").append(`<div id="elsnoticebox"></div>`)
		
		//create CSS rules for EmoteslistSlim
		if (!document.getElementById("emoteslist-slim-style1")){
			let elslimstyle = document.createElement("style");
			elslimstyle.id = "emoteslist-slim-style1";
			elslimstyle.type = "text/css";
			elslimstyle.innerHTML = WHQbtfyELS.getElslimstyle();
			document.body.prepend(elslimstyle);
		}
		
		//set object attributes
		this.elsdiv = elslim;
		this.textbox = document.getElementById("chatline");
		this.elsparentdiv = elsparentdiv;
		this.isOn = false;
		this.isRandomizeemotesOn = false;
		this.isFullsearchOn = false;
		this.isShowEmoteCaptionOn = true;
		this.isAutohideOn = true;
		this.isOverridetabOn = false;
		this.allEmotes = [...EMOTELIST.emotes];		//clone EMOTElist because it can be filtered by the normal emotelist
		this.currentEmotes = [];
		
		//remember #chatline event for (reset) overriding that event
		window.defaultChatlineKeydownEvent = jQuery._data($("#chatline")[0], "events" ).keydown[0].handler;
		
		//load options (configbox)
		this.retrieveConfig();
		
		//add options to configbox options
		this.setupConfigboxOptions();
		
		//add Events *****************************************************************************
		//key input
		this.textbox.addEventListener("keyup", WHQbtfyELS.emotelistSlimLookupExpansionHotkeyEvent);
		this.textbox.addEventListener("keydown", WHQbtfyELS.overrideCtrlB);
		
		//click on emote
		$(this.elsdiv).on("click", "> div", function(e){
			let emote = e.currentTarget.getAttribute("emotestr");
			WHQbtfyELS.addEmoteToTextbox(emote);
		});
		//fade out after loosing chatinput focus
		$(this.textbox).focusout(function(){
			if (WHQbtfyELS.getInstance().isOn && WHQbtfyELS.getInstance().isAutohideOn){
				$(WHQbtfyELS.getInstance().elsdiv).fadeOut();
				setTimeout(function(){WHQbtfyELS.getInstance().hide()}, 1000);
			}
		});
		
	}
	
	static getInstance(id){
		if (!window.whqBtfyELSInstance){
			window.whqBtfyELSInstance = new WHQbtfyELS(id);
			return window.whqBtfyELSInstance;
		} else {
			return window.whqBtfyELSInstance;
		}
	}
	
	hide(){
		$(this.elsdiv).hide();
		this.isOn = false;
	}
	show(){
		$(this.elsdiv).show();
	}
	showNotice(msg){
		$("#elsnoticebox").append(`<p>${msg}</p>`);
		let notice = $("#elsnoticebox").children().last();
		notice.delay(2000).fadeOut();
		setTimeout(function(){notice.remove()}, 3000);
	}
	
	static overrideCtrlB(e){
		if (e.ctrlKey && e.keyCode == 66){
			e.preventDefault();
			e.stopPropagation();
		}
	}
	
	static emotelistSlimLookupExpansionHotkeyEvent(e){
		let els = WHQbtfyELS.getInstance();
		
		if ([13,8,46,27,32,33,34,35,36].indexOf(e.keyCode) > -1){
			//console.log(`debug: els stopped through key=${e.keyCode}`);
			if (els.isOn){
				//console.log("debug: elsOFF");
				els.isOn = false;
				els.hide();
			}
			return;
		}
		
		let iscontinuetyping = false;
		//continue ELS lookup if user is typing (input is a typeable character but not a number (alphabetic key or special character key))
		if (els.isOn){ 
			if ( (e.keyCode >= 65 && e.keyCode <= 90) || [192, 189, 187, 219, 221, 186, 222, 220, 226, 188, 190].indexOf(e.keyCode) > -1 ) {
				iscontinuetyping = true;
			}
			if (els.currentEmotes.length < 1){
				els.hide();
				els.showNotice("0 matches - current Emotelist empty");
				return;
			}
		}
		
		// ctrl + b
		let elsHotkeyPressed = (e.ctrlKey && e.keyCode == 66);
		
		if (els.isOverridetabOn){
			elsHotkeyPressed = Boolean(e.keyCode == 9);
		}
		
		if (elsHotkeyPressed || iscontinuetyping) {
			//console.log(`debug: keycode=${e.keyCode} ### iscontinuetyping=${iscontinuetyping} ### elsison=${els.isOn}`);
			
			let textbox = e.target;
			let txt = textbox.value.substring(0, textbox.selectionStart).toLowerCase();
			let cursorpos = textbox.selectionStart;
			let slashpos;

			for (let i = cursorpos; i >= 0; i--){
				let c = txt.charAt(i-1);
				if (c === '/'){
					slashpos = i;
					break;
				}
				if (/[^0-zäöüÄÖÜß]/.test(c)){
					break;
				}
			}

			if (slashpos){
				let emotestr = txt.substring(slashpos-1, cursorpos);
				let emotelist;
				if (elsHotkeyPressed){
					emotelist = els.allEmotes;
				} else {
					emotelist = els.currentEmotes;
				}
				//console.log(`debug: emotestr=${emotestr}`);
				if (emotestr != '/'){
					if (els.isFullsearchOn){
						els.currentEmotes = emotelist.filter((e) => {return e.name.includes(emotestr.substr(1));});
					} else {
						els.currentEmotes = emotelist.filter((e) => {return e.name.startsWith(emotestr);});
					}
					if (!els.isRandomizeemotesOn){
						els.currentEmotes = els.currentEmotes.sort();	//sort emotes to bring the most relevant ones to the front
					}
				} else{
					els.currentEmotes = emotelist;
				}
				if (els.isRandomizeemotesOn){ 
					//shuffle emotes
					els.currentEmotes = WHQbtfyELS.shuffle(els.currentEmotes);
				}
				
				WHQbtfyELS._popupEmoteslistslim();
			} else {
				//fallback for default Tab behaviour (user name completion)
				if (els.isOverridetabOn){
					window.defaultChatlineKeydownEvent(e);
				}
				els.hide();
			}

		//number key 1-9
		} else if (e.keyCode >= 49 && e.keyCode <= 57){
			if (els.isOn){
				//human readable emotenum and cursoroffset is one because of typed input ()
				let num = e.keyCode - 48;
				if (num > els.currentEmotes.length){
					els.showNotice("wrong number");
					return;
				}
				let emote = els.currentEmotes[num - 1].name;
				WHQbtfyELS.addEmoteToTextbox(emote, 1); 
			}
		}
	}
	
	//Inserts emotestring into textbox at last slash before cursor
	static addEmoteToTextbox(emote, cursoroffset=0){
		let els = WHQbtfyELS.getInstance();
		let cursorpos = els.textbox.selectionStart - cursoroffset;
		let txt = els.textbox.value;
		let leadingspace = " ";
		let slashpos = null;
		for (let i = cursorpos; i >= 0; i--){
			let c = txt.charAt(i-1);
			if (c === '/'){
				slashpos = i;
				break;
			}
			if (/[^0-zäöüÄÖÜß]/.test(c)){
				break;
			}
		}
		if (slashpos == 1 || txt.charAt(slashpos-2) == " "){
			leadingspace = "";
		}
		//console.log(`debug: txt="${txt}"\nemote=${emote};cursorpos=${cursorpos};slashpos=${slashpos};leadingspace="${leadingspace}"`);
		let frontstr = txt.slice(0,slashpos-1) + leadingspace + emote + " ";
		els.textbox.value = frontstr + txt.slice(cursorpos + cursoroffset);
		els.textbox.setSelectionRange(frontstr.length, frontstr.length);
		els.hide();
	}
	
	static _popupEmoteslistslim(){
		let els = WHQbtfyELS.getInstance();
		let matchingemotes = els.currentEmotes;
		$("#emoteslist-slim1").empty();
		if (matchingemotes.length < 1){
			//Show nomatch notice
			els.showNotice("0 matches");
		}

		let elslim = document.getElementById("emoteslist-slim1");
		let range = 9;
		if (matchingemotes.length < 9){
			range = matchingemotes.length;
		}
		let dfrag = document.createDocumentFragment();
		
		for(let i = 0; i < range; i++){
			let img = document.createElement("img");
			img.src = matchingemotes[i].image;
			img.alt = matchingemotes[i].name;
			img.id = "elsemote-" + (i+1);
			let containerdiv = document.createElement("div");
			containerdiv.setAttribute("emotestr",matchingemotes[i].name);
			let numdiv = document.createElement("div");
			numdiv.classList.add("elsemote-num");
			numdiv.textContent = i + 1;
			if (els.isShowEmoteCaptionOn){
				let caption = document.createElement("span");
				caption.textContent = matchingemotes[i].name;
				containerdiv.appendChild(caption);
			}
			containerdiv.appendChild(numdiv);
			containerdiv.appendChild(img);
			dfrag.appendChild(containerdiv);
		}
		elslim.appendChild(dfrag);
		els.isOn = true;
		els.show()
	}
	
	setupConfigboxOptions(){
		//pre checked checkboxes
		const [a,b,c,d,e] = [this.isRandomizeemotesOn, this.isFullsearchOn, this.isShowEmoteCaptionOn, this.isAutohideOn, this.isOverridetabOn
			].map((x) => {if (x){return "checked";} else {return "";} });
	
		$("#config-cog-box1").append(`<div id="config-els-cat">
			<div><input type="checkbox" id="els-option-randomize" name="randomize ELS emotes" ${a}><label for="els-option-randomize">randomize ELS emotes</label></div>
			<div><input type="checkbox" id="els-option-fullsearch" name="fullsearch ELS emotes" ${b}><label for="els-option-fullsearch">fullsearch ELS emotes</label></div>
			<div><input type="checkbox" id="els-option-emotecaption" name="show ELS caption" ${c}><label for="els-option-emotecaption">show ELS caption</label></div>
			<div><input type="checkbox" id="els-option-autohide" name="autohide ELS"${d}><label for="els-option-autohide">autohide ELS</label></div>
			<div><input type="checkbox" id="els-option-overridetab" name="override [Tab]" ${e}><label for="els-option-overridetab">override [Tab]</label></div>
			<button id="whq-config-els-save" class="whq-config-savebtn">Save</button>
		</div>`);

		$("#els-option-randomize").on("click", function(e){
			if (e.target.checked){
				WHQbtfyELS.getInstance().setON_Randomizeemotes();
			} else {
				WHQbtfyELS.getInstance().isRandomizeemotesOn = false;
			}
		});
		$("#els-option-emotecaption").on("click", function(e){
			if (e.target.checked){
				WHQbtfyELS.getInstance().setON_ShowEmoteCaption();
			} else {
				WHQbtfyELS.getInstance().isShowEmoteCaptionOn = false;
			}
		});
		$("#els-option-autohide").on("click", function(e){
			if (e.target.checked){
				WHQbtfyELS.getInstance().setON_Autohide();
			} else {
				WHQbtfyELS.getInstance().isAutohideOn = false;
			}
		});
		$("#els-option-fullsearch").on("click", function(e){
			if (e.target.checked){
				WHQbtfyELS.getInstance().setON_Fullsearch();
			} else {
				WHQbtfyELS.getInstance().isFullsearchOn = false;
			}
		});
		$("#els-option-overridetab").on("click", function(e){
			if (e.target.checked){
				WHQbtfyELS.getInstance().setON_Overridetab();
			} else {
				WHQbtfyELS.getInstance().isOverridetabOn = false;
				
				//reset to old event
				$("#chatline").off("keydown");
				$("#chatline").on("keydown", window.defaultChatlineKeydownEvent);
			}
		});
		$("#whq-config-els-save").on("click", function(e){
			WHQbtfyELS.getInstance().setConfig();
		});
		

	}
	
	setON_Randomizeemotes(){
		this.isRandomizeemotesOn = true;
	}
	setON_ShowEmoteCaption(){
		this.isShowEmoteCaptionOn = true;
	}
	setON_Autohide(){
		this.isAutohideOn = true;
	}
	setON_Fullsearch(){
		this.isFullsearchOn = true;
	}
	setON_Overridetab(){
		this.isOverridetabOn = true;
		
		//override default event for #chatline (the chat input box)
		$("#chatline").off("keydown");
		$("#chatline").on("keydown", function(e){
			if (e.keyCode == 9){
				e.preventDefault()
			} else {
				window.defaultChatlineKeydownEvent(e);
			}
		});
	}
	
	setConfig(){
		let optionarr = [this.isRandomizeemotesOn, this.isFullsearchOn, this.isShowEmoteCaptionOn, this.isAutohideOn, this.isOverridetabOn];
		let optionint = WHQbtfyELS.bitarrToInt(optionarr);
		document.cookie = `whqconfigels=${optionint}`;
	}
	
	retrieveConfig(){
		let optionint = document.cookie.replace(/(?:(?:^|.*;\s*)whqconfigels\s*\=\s*([^;]*).*$)|^.*$/, "$1");
		if(!optionint){
			return;
		}
		let optionarr = WHQbtfyELS.intToBitarr(optionint, 5);
		[this.isRandomizeemotesOn, this.isFullsearchOn, this.isShowEmoteCaptionOn, this.isAutohideOn, this.isOverridetabOn] = optionarr;
		
		if (this.isRandomizeemotesOn){
			this.setON_Randomizeemotes();
		}
		if (this.isFullsearchOn){
			this.setON_Fullsearch();
		}
		if (this.isShowEmoteCaptionOn){
			this.setON_ShowEmoteCaption();
		}
		if (this.isAutohideOn){
			this.setON_Autohide();
		}
		if (this.isOverridetabOn){
			this.setON_Overridetab();
		}
	}
	
	static bitarrToInt(arr){
		let res = 0;
		for (let i = 0; i < arr.length; i++){
			res += arr[i] << i;
		}
		return res;
	}
	
	//intToBitarr(num, n) -> 
	static intToBitarr(inta, n){
		let res = [];
        for (let i = 0; i < n; i++){
			res.push(1 & inta >> i);
		}
        return res;
	}
	
	static getElslimstyle(){
return `
.emoteslist-slim {
	position: absolute;
	display:grid;
	top: 0;
	max-height: calc(100% - 80px);
	height: auto;
	width: 90%;
	margin: 30px 10px;
	/*background-color: #605763d6;*/
	z-index: 4000;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    grid-gap: 0.3rem;
    /*overflow: auto;*/
    /*resize: horizontal;*/
}
.emoteslist-slim > div {
    display: flex;
	align-items: center;
    justify-content: center;
	/*background: #132324ed;*/
	background: #EDE7F6;
    padding: 0.3rem;
    border-radius: 0.5rem;
	position: relative;
    line-height: 1em;
	cursor: pointer;
}
.emoteslist-slim img {
	max-height: 100px;
	max-width: 100px;
	background-color: #00000040;
	object-fit: contain;
}
.emoteslist-slim span {
	color: #e3eaef;
    position: absolute;
    align-self: flex-end;
    font-weight: bold;
    font-size: 0.7em;
    text-shadow: 2px 2px 2px #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
	word-break: break-all;
}
#elsnoticebox{
	position:absolute; 
	color:red; 
	font-size:2em; 
	top:0; 
	margin: 30px 10px; 
	line-height:0.5em;
	z-index: 910;
}
.elsemote-num {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    font-size: 15px;
    font-weight: bold;
    color: #fff;
    line-height: 16px;
    text-align: center;
    background: #c6cbdd;
    border: 3px solid #ffffff;
    position: absolute;
    left: 0;
    top: 0;
}
#config-els-cat{
	display: flex;
	flex-direction: column;
}
.whq-config-savebtn{
	float: right;
	color: black;
}
`;
}

static shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;
	
	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		
		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}
	return array;
}

}

WHQbtfyELS.getInstance();