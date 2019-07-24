class Cinemamode {
	
	constructor() {
		if (CLIENT.cinemaMode){
			return CLIENT.cinemaMode;
		}
		
		Cinemamode.createButtons();
		//Cinemamode.registerCinemaCommand()
		
		let cinemaCSS = Cinemamode.getCinemamodeStyle();
		this.style = $("<style>").attr("type", "text/css").attr("id", "cinemaStyle").html(cinemaCSS).appendTo("head");
		
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
		//add Button to [Layout] > Cinemamode
		$('a[onclick*="removeVideo"]').parent().parent().append(
		`<li><a href='javascript:void(0)' onclick='javascript:$("#cinematoggle").click()'>Cinema Mode</a></li>`
		);
		
		//add toggle Cinemamode Button to top right corner of window
//		$('<div id="cinematoggle"><span class="glyphicon glyphicon-new-window "></span></div>').appendTo("body").click(Cinemamode.toggleCinemamode);
		$('<div id="cinematoggle"><span class="glyphicon glyphicon-new-window "></span></div>').insertAfter("#nav-collapsible .navbar-nav").click(Cinemamode.toggleCinemamode);
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
	
	static getCinemamodeStyle(){
		return `
		body.cinemachat #motdwrap     { display: none; }
body.cinemachat #queue        { display: none; }
body.cinemachat #footer       { display: none; }
body.cinemachat #currenttitle { display: none; }
body.cinemachat .toggle-label { display: none; }
body.cinemachat .dropLabel    { display: none; }
body.cinemachat #videowrap-header { display: none; }

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

body.cinemachat #cinematoggle {
    text-shadow: 0 0 3px white;
}
body.cinemachat.synchtube #cinematoggle {
    right: 402px;
}

body.cinemachat #chatwrap {
    position:fixed !important;
    top:0 !important;
    padding:0px !important;
    width:400px !important;
    height:100% !important;
    z-index:3001 !important;
    background-color:#222222 !important;
}
body.cinemachat:not(.synchtube) #chatwrap { left:0 !important; }
body.cinemachat.synchtube #chatwrap { right:0 !important; }

body.cinemachat #chatwrap #messagebuffer,
body.cinemachat #chatwrap #userlist {
    height: calc(100% - 59px) !important;
}

body.cinemachat #chatline {
    width:calc(100% - 1px) !important;
    position: relative !important;
}
body.cinemachat:not(.synchtube) #chatline { left: 0px !important; }
body.cinemachat.synchtube #chatline { right: 0px !important; }



body.cinemachat #videowrap .embed-responsive {
    height:100% !important;
    width: 100% !important;
    top: 0 !important;
}
body.cinemachat:not(.synchtube) #videowrap .embed-responsive { right: 0 !important; }
body.cinemachat.synchtube #videowrap .embed-responsive { left: 0 !important; }

body.cinemachat #videowrap {
    position: fixed !important;
    top: 0 !important;
    padding:0 !important;
    z-index: 3000 !important;
    background-color:black;
    height:100% !important;
    width: calc(100% - 400px) !important;
}
body.cinemachat:not(.synchtube) #videowrap { right: 0 !important; }
body.cinemachat.synchtube #videowrap { left: 0 !important; }


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
    display: none!important;
}
/***************/
/***************/
/***************/
.cinemachat .navbar{
	z-index: 3500;
    left: calc(var( --cinema-chatvid-width));
    opacity: 0.0;
    transition-delay: 2.0s;
    transition-duration: 1.5s;
	background-image: linear-gradient(#3c3c3c, #323232 60%, #242528) !important;
}
.cinemachat .navbar:hover {
    opacity: 1.0;
    transition: 0.5s;
}

		`;
	}
}

new Cinemamode();
