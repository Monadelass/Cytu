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
	
	//add plus and minus resize buttons to cinemamode
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
btfyCinemamode();
