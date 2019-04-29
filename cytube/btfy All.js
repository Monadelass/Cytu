/*************************************************************/
/*********************  WHQ Btfy  ****************************/
/*************************************************************/
function changeCinemaChatSize(offset){
	let main = document.getElementById("main");
	let mainprop = main.style.getPropertyValue("--cinema-chatvid-width");
	if (!mainprop){
		mainprop = "400px";
	}
	let newmainprop = (parseInt(mainprop) + offset) + "px";
	main.style.setProperty("--cinema-chatvid-width", newmainprop);
}

function btfyCinemamode(){
	let btfytag = document.createElement("style");
	btfytag.type = "text/css";
	btfytag.innerHTML = getBtfyStyle();
	document.body.prepend(btfytag);
	
	//add minus and plus resize buttons to cinemamode
	$("#chatheader").append('<span id="chat-minus" class="label label-default pointer cinemashow chatheaderbtn" onclick="changeCinemaChatSize(-50)">-</span>');
	$("#chatheader").append('<span id="chat-plus" class="label label-default pointer cinemashow chatheaderbtn" onclick="changeCinemaChatSize(50)">+</span>');
	
	//add config menu cog
	$("#chatheader").append(`<span id="whq-config" class="label label-default pointer chatheaderbtn"">&#9881;</span>`);
	$("#chatwrap").append(`<div id="whq-config-box1" style="display:none;" class="whq-config-box"></div>`);
	$("#whq-config").on("click", function(){$("#whq-config-box1").toggle()});
	
	//TODO don't do it like that
	window.changeCinemaChatSize = changeCinemaChatSize;
	
	//add emote button to cinemamode
	$("#chatline").after('<div id="chatline-wrapper"></div>');
	$("#chatline-wrapper").append($("#chatline"));
	$("#chatline-wrapper").append($('<button id="cinema-emotes" class="cinemashow" onclick="" ><div id="cinema-emote-smiley">☺</div></button>'));
	let emotebtnfun = jQuery._data($("#emotelistbtn")[0], "events" ).click[0].handler;
	$("#cinema-emotes").click(emotebtnfun);
	
	//make emotelist search input autofocus (both cinemamode and standard)
	$('#emotelist').on('shown.bs.modal', function () {
		$('.emotelist-search')[0].focus();
	});
	
	function getBtfyStyle(){
	return `
		.cinemachat{
			overflow: hidden;
		}
		.cinemachat .cinemashow{
			display: initial !important;
		}
		.cinemashow{
			display: none;
		}
		body.cinemachat #chatwrap{
			width: var(--cinema-chatvid-width,400px) !important;
		}
		body.cinemachat #videowrap{
			width: calc(100% - var(--cinema-chatvid-width,400px)) !important;
		}
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
		.cinemachat #emotelist{
			z-index: 3000;
		}
		.chatheaderbtn{
			vertical-align: top;
			line-height: 1.6;
		}
		.whq-config-box{
			position: absolute;
			top: 20px;
			max-width: 90%;
			max-height: 80%;
			background-color: #2b382d;
		}
	`;
	}
}

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
		
		//add options to configbox options
		WHQbtfyELS.setupConfigboxOptions();
		
		//add Events *****************************************************************************
		//key input
		this.textbox.addEventListener("keyup", WHQbtfyELS.emotelistSlimLookupExpansionHotkeyEvent);
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
			let emotelist;
			if (elsHotkeyPressed){
				emotelist = els.allEmotes;
			} else {
				emotelist = els.currentEmotes;
			}
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
				}
				if (els.isRandomizeemotesOn){ 
					//shuffle emotes
					els.currentEmotes = WHQbtfyELS.shuffle(els.currentEmotes);
				}
				
				WHQbtfyELS._popupEmoteslistslim();
			} else {
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
	
	
	static setupConfigboxOptions(){
		$("#whq-config-box1").append(`<div id="config-els-cat">
			<div><input type="checkbox" id="els-option-randomize" name="randomize ELS emotes"><label for="els-option-randomize">randomize ELS emotes</label></div>
			<div><input type="checkbox" id="els-option-fullsearch" name="fullsearch ELS emotes"><label for="els-option-fullsearch">fullsearch ELS emotes</label></div>
			<div><input type="checkbox" id="els-option-emotecaption" name="show ELS caption"checked><label for="els-option-emotecaption">show ELS caption</label></div>
			<div><input type="checkbox" id="els-option-autohide" name="autohide ELS"checked><label for="els-option-autohide">autohide ELS</label></div>
			<div><input type="checkbox" id="els-option-overridetab" name="override [Tab]"><label for="els-option-overridetab">override [Tab]</label></div>
		</div>`);

		$("#els-option-randomize").on("click", function(e){
			if (e.target.checked){
				WHQbtfyELS.getInstance().isRandomizeemotesOn = true;
			} else {
				WHQbtfyELS.getInstance().isRandomizeemotesOn = false;
			}
		});
		$("#els-option-emotecaption").on("click", function(e){
			if (e.target.checked){
				WHQbtfyELS.getInstance().isShowEmoteCaptionOn = true;
			} else {
				WHQbtfyELS.getInstance().isShowEmoteCaptionOn = false;
			}
		});
		$("#els-option-autohide").on("click", function(e){
			if (e.target.checked){
				WHQbtfyELS.getInstance().isAutohideOn = true;
			} else {
				WHQbtfyELS.getInstance().isAutohideOn = false;
			}
		});
		$("#els-option-fullsearch").on("click", function(e){
			if (e.target.checked){
				WHQbtfyELS.getInstance().isFullsearchOn = true;
			} else {
				WHQbtfyELS.getInstance().isFullsearchOn = false;
			}
		});
		$("#els-option-overridetab").on("click", function(e){
			if (e.target.checked){
				WHQbtfyELS.getInstance().isOverridetabOn = true;
				
				//override default event for #chatline (the chat input box)
				$("#chatline").off("keydown");
				$("#chatline").on("keydown", function(e){
					if (e.keyCode == 9){
						e.preventDefault()
					} else {
						window.defaultChatlineKeydownEvent(e);
					}
				});
			} else {
				WHQbtfyELS.getInstance().isOverridetabOn = false;
				
				//reset to old event
				$("#chatline").off("keydown");
				$("#chatline").on("keydown", window.defaultChatlineKeydownEvent);
			}
		});

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
	z-index: 900;
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

btfyCinemamode();
WHQbtfyELS.getInstance();
