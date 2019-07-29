//make emotelist search input autofocus (both cinemamode and standard)
$('#emotelist').on('shown.bs.modal', function () {
	$('.emotelist-search')[0].focus();
});


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
		//add Button to navbar Layout > Cinemamode
		$('a[onclick*="removeVideo"]').parent().parent().append(
		`<li><a href='javascript:void(0)' onclick='javascript:$("#cinematoggle").click()'>Cinema Mode</a></li>`
		);
		
		//add toggle Cinemamode Button to top right corner of window
//		$('<div id="cinematoggle"><span class="glyphicon glyphicon-new-window "></span></div>').appendTo("body").click(Cinemamode.toggleCinemamode);
		$('<div id="cinematoggle"><span class="glyphicon glyphicon-new-window "></span></div>').insertAfter("#nav-collapsible .navbar-nav").click(Cinemamode.toggleCinemamode);
		
		//resize slider bar
		Cinemamode.addResizeSlider();
		
		//add emote button to cinemamode (next to chat input)
		$("#chatline").after('<div id="chatline-wrapper"></div>');
		$("#chatline-wrapper").append($("#chatline"));
		$("#chatline-wrapper").append($('<button id="cinema-emotes" class="cinemashow hide" onclick="" ><div id="cinema-emote-smiley">☺</div></button>'));
		let emotebtnfun = jQuery._data($("#emotelistbtn")[0], "events" ).click[0].handler;
		$("#cinema-emotes").click(emotebtnfun);
		
	}
	
	static toggleCinemamode(){
		//hide userlist on entering cinemamode
		if (!$("body").hasClass("cinemachat")) {
			if ($("#userlist").is(":visible")) {
				$("#userlisttoggle").click();
			}
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
    z-index:3000;
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
	z-index:3001 !important;
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

.resizeslider{
	position: absolute;
	z-index: 3400;
    display: block;
    background-color:black;
    left: 0;
    margin-left:1px;
    width: 4px;
}
#rslidertop{top:0;}
#rsliderbottom{bottom:0;}
		`;
	}
}

new Cinemamode();