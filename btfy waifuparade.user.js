// ==UserScript==
// @name         waifupara beautify
// @namespace    vvv.sylph
// @version      1.0.4
// @description  none
// @author       nobody
// @updateURL    https://github.com/Monadelass/WHQ/raw/master/btfy%20waifuparade.user.js
// @match        https://videos.waifupara.de/*
// @match        https://emotes.waifupara.de/*
// @exclude      /^https:\/\/videos\.waifupara\.de\/.*\.[^\.\/]+$/
// @exclude      /^https:\/\/emotes\.waifupara\.de\/.*\.[^\.\/]+$/
// @grant        none
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @run-at       document-start
// ==/UserScript==
(function(){

'use strict';
(document.head || document.documentElement).insertAdjacentHTML("beforeend","<style id='hidepre'>pre {display:none;}</style>");

if ($('pre').length > 0){
    //add logo
    (function(){
        let logo = document.createElement('img');
        logo.id = 'waifupara-logo';
        let deflogosrc = 'https://' + location.hostname + '/logo.jpg';
        $.get(deflogosrc)
            .done(function() {
            // image on server exists
            logo.src = deflogosrc;

        }).fail(function() {
            // image doesn't exist - use fallback logo
            logo.src = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEBLAEsAAD/4QkgaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA1LjUuMCI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiLz4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8P3hwYWNrZXQgZW5kPSJ3Ij8+/+0ALFBob3Rvc2hvcCAzLjAAOEJJTQQlAAAAAAAQ1B2M2Y8AsgTpgAmY7PhCfv/iAmRJQ0NfUFJPRklMRQABAQAAAlRsY21zBDAAAG1udHJSR0IgWFlaIAfjAAIAEAAMABMAGGFjc3BNU0ZUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD21gABAAAAANMtbGNtcwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC2Rlc2MAAAEIAAAAPmNwcnQAAAFIAAAATHd0cHQAAAGUAAAAFGNoYWQAAAGoAAAALHJYWVoAAAHUAAAAFGJYWVoAAAHoAAAAFGdYWVoAAAH8AAAAFHJUUkMAAAIQAAAAIGdUUkMAAAIQAAAAIGJUUkMAAAIQAAAAIGNocm0AAAIwAAAAJG1sdWMAAAAAAAAAAQAA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';
        });

        document.body.prepend(logo);
    })();
    overwriteOnloadFunction();
} else {
    var _0x59d9=["\x64\x69\x76","\x63\x72\x65\x61\x74\x65\x45\x6C\x65\x6D\x65\x6E\x74","\x69\x6E\x6E\x65\x72\x48\x54\x4D\x4C","\x3C\x69\x6D\x67\x20\x73\x72\x63\x3D\x22\x68\x74\x74\x70\x73\x3A\x2F\x2F\x65\x6D\x6F\x74\x65\x73\x2E\x77\x61\x69\x66\x75\x70\x61\x72\x61\x2E\x64\x65\x2F\x65\x6D\x6F\x74\x65\x73\x2F\x5A\x41\x57\x41\x52\x55\x44\x4F\x2E\x67\x69\x66\x22\x3E\x3C\x62\x72\x3E\x48\x69\x65\x72\x20\x6B\xF6\x6E\x6E\x74\x65\x20\x49\x68\x72\x65\x20\x4A\x6F\x4A\x6F\x20\x52\x65\x66\x65\x72\x65\x6E\x7A\x20\x73\x74\x65\x68\x65\x6E","\x70\x72\x65\x70\x65\x6E\x64","\x62\x6F\x64\x79"];let dio=document[_0x59d9[1]](_0x59d9[0]);dio[_0x59d9[2]]= _0x59d9[3];document[_0x59d9[5]][_0x59d9[4]](dio)
}



function overwriteOnloadFunction(){
window.onload = function(){
//(function() {
    console.log('fired waifupara btfy');
    window.btfy = true;

class LLink{

	constructor(){
		this.regextxtnode = /(\d\d\d\d-\d\d-\d\d \d\d:\d\d)\s+((?:-)|(?:\d+\.?\d?[KMGT]?))/gm;
		this.textnodestxt = '';
	}

	setImgtag(imgtag){this.imgtag = imgtag;}
    setHreftag(hreftag){this.hreftag = hreftag;}
    setTextnodestxt(textnodestxt){this.textnodestxt = textnodestxt;}

	setName(name){this.name = name;}
    setHref(href){this.href = href;}
	setLastmodified(lastmodified){this.lastmodified = lastmodified;}
    setDescription(description){this.description = description;}
	setSize(size){
        if (isNaN(size)){
            let psize = /(\d+(?:\.\d+)?)([KMGT])/.exec(size);
            if (psize == null) {this.size = 0; return;}
            switch(psize[2]){
                case 'T':
                    this.size = +psize[1] *1000000000000;
                    break;
                case 'G':
                    this.size = +psize[1] * 1000000000;
                    break;
                case 'M':
                    this.size = +psize[1] * 1000000;
                    break;
                case 'K':
                    this.size = +psize[1] * 1000;
                    break;
                default:
                    this.size = 0;
            }
        } else {
            this.size = +size;
        }
    }
    getSizeToString(){
        if (this.size == 0) {return '-';}
        else if (this.size >= 1000000000000) {return (this.size / 1000000000) + ' TB';}
        else if (this.size >= 1000000000) {return (this.size / 1000000000) + ' GB';}
        else if (this.size >= 1000000) {return (this.size / 1000000) + ' MB';}
        else if (this.size >= 1000) {return (this.size / 1000) + ' KB';}
        else if (this.size < 1000) {return this.size + ' Byte';}
    }

	extractAttributesFromTextnodestxt(){
        this.name = decodeURIComponent(this.hreftag.attributes.href.textContent);
        this.href = this.hreftag.href;
        let res = this.regextxtnode.exec(this.textnodestxt);
		this.setLastmodified(res[1]);
        this.setSize(res[2]);
	}

}

function createAllLLinks(){
	let pre = document.getElementsByTagName("pre")[0];
	let tw = document.createTreeWalker(pre);
	tw.firstChild();

	let llinknum = -1;
	let llinks = [];

	while(tw.nextSibling()){
		let n = tw.currentNode;

		//lets just ignore the "parent directory" link for now
		if (n.nodeName === "IMG" && n.alt === "[PARENTDIR]"){
			continue;
		}

		//use IMG tags as link separators
		if (n.nodeName === "IMG" && n.hasAttribute("alt")){
			let llink = new LLink();
			llink.setImgtag(n);
			llinks.push(llink);
			llinknum++;
		} else if (n.nodeName === "A"){
            if (llinknum < 0){continue;}
			llinks[llinknum].setHreftag(n);
		} else if (n.nodeName === "#text"){
            if (llinknum < 0){continue;}
			llinks[llinknum].textnodestxt += n.textContent.trim();
		}

	}
	//finalize all llinks
	return llinks;
}

function sortTable(colnum, sortby){
    let headrow = $("#filestable .files-t-row:first-child");
    let head = headrow[0].children[colnum];
    let rows = $("#filestable .files-t-row:not(:first-child)");

    if(head.classList.contains("row-sort-down")){
        head.classList.remove("row-sort-down");
        head.classList.add("row-sort-up");

        //reverse table
        for (var i = rows.length -1; i>= 0; i--){
            rows[i].parentNode.appendChild(rows[i]);
        }
    } else if(head.classList.contains("row-sort-up")) {
        head.classList.remove("row-sort-up");
        head.classList.add("row-sort-down");

        //reverse table
        for (let i = rows.length -1; i>= 0; i--){
            rows[i].parentNode.appendChild(rows[i]);
        }
    } else {
        let compfun;
        let compfuns = {
            name:(a,b) => {if (a[colnum].textContent >= b[colnum].textContent){return 1;}else{return -1;}},
            size:(a,b) => {return /^\d+(?:.\d+)?/.exec(a[colnum].textContent) - /^\d+(?:.\d+)?/.exec(b[colnum].textContent);},
            sizeint:(a,b) => {return a[colnum].sizeint - b[colnum].sizeint;},
            filetype:(a,b) => {if (a[colnum].firstElementChild.alt >= b[colnum].firstElementChild.alt){return 1;}else{return -1;}},
            fileANDname:(a,b) => {
                let at = a[colnum].firstElementChild.alt;
                let bt = b[colnum].firstElementChild.alt;
                if (at == bt){
                    if (a[1].textContent >= b[1].textContent){return 1;}else{return -1;}
                } else{
                    if (at == '[DIR]'){return -1;}
                    if (bt == '[DIR]'){return 1;}
                    else { if (at >= bt){return 1;}else{return -1;} }
                }
            }
        };
        if (sortby == null){
            compfun = compfuns['name'];
        } else {
            compfun = compfuns[sortby];
        }

        let sorted = rows.sort((a,b) => {
            let aa = $(".files-t-cell",a);
            let bb = $(".files-t-cell",b);
            return compfun(aa,bb);
        });

        let frag = document.createDocumentFragment();
        let parentdiv = sorted[0].parentNode;
        for (let i = 0; i < sorted.length; i++) {
            //sorted[i].parentNode.appendChild(sorted[i]);
            frag.appendChild(sorted[i]);
        }
        parentdiv.appendChild(frag);
        headrow.children().removeClass("row-sort-up");
        headrow.children().removeClass("row-sort-down");
        head.classList.add("row-sort-down");
    }
}

    function addLLinksToDOM(targetdiv, llinks){
        let documentFragment = document.createDocumentFragment();
        for(let llink of llinks){
            let imgtag = document.createElement("div");
            imgtag.classList.add("files-t-cell");
            imgtag.classList.add("col-filetype");
            imgtag.appendChild(llink.imgtag.cloneNode());

            let nametag = document.createElement("div");
            nametag.classList.add("files-t-cell");
            nametag.classList.add("col-name");
            let anchor = document.createElement("a");
            anchor.href = llink.href;
            anchor.textContent = llink.name;
            nametag.appendChild(anchor);

            let lastmodifiedtag = document.createElement("div");
            lastmodifiedtag.classList.add("files-t-cell");
            lastmodifiedtag.classList.add("col-lastmodified");
            lastmodifiedtag.textContent = llink.lastmodified;

            let sizetag = document.createElement("div");
            sizetag.classList.add("files-t-cell");
            sizetag.classList.add("col-size");
            sizetag.textContent = llink.getSizeToString();
            sizetag.sizeint = llink.size; //cheap trick to make sorting easier

            let descriptiontag = document.createElement("div");
            descriptiontag.classList.add("files-t-cell");
            descriptiontag.classList.add("col-description");
            descriptiontag.textContent = llink.description;

            let row = document.createElement("div");
            row.classList.add("files-t-row");
            row.appendChild(imgtag);
            row.appendChild(nametag);
            row.appendChild(lastmodifiedtag);
            row.appendChild(sizetag);
            row.appendChild(descriptiontag);

            documentFragment.append(row);
        }
        targetdiv.append(documentFragment);
    }

    function createPathLinks(){
        let pathfrag = document.createDocumentFragment();

        //let linkparse = /(\w+:\/{2,})((?:\w+\.)\w+(?:\.\w+)+)(\/.+)/.exec(window.location.href);
        let linkparse = /(\w+:\/{2,})((?:\w+\.)\w+(?:\.\w+)+)(\/.+)?/.exec(window.location.href);

        let protocol = linkparse[1];
        let domain = linkparse[2];

        let roota = document.createElement('a');
        roota.href = protocol + domain;
        roota.textContent = domain;
        pathfrag.appendChild(roota);

        if (typeof(linkparse[3]) !== 'undefined'){
            let path = linkparse[3];
            let splitpath = path.match(/\/[^\/]+/g);

            for(let i = 0; i < splitpath.length; i++){
                let a = document.createElement('a');
                a.href = protocol + domain + splitpath.slice(0,i+1);
                a.textContent = splitpath[i];
                pathfrag.appendChild(a);
            }
        }

        document.getElementById("pathlinks").append(pathfrag);

    }

    function toggleOldTable(){
        let collapser = document.getElementById("collapseold");
        collapser.classList.toggle("hidenext");
        if (collapser.classList.contains("hidenext")){
            collapser.firstChild.innerText = "[+]";
        } else {
            collapser.firstChild.innerText = "[-]";
        }
    }


function gettableHTML(){
return `
<div id="pathlinks"></div>
<hr>
<div id="filestable">
    <div class="files-t-row">
        <div class="files-t-cell files-t-head col-filetype" onclick="sortTable(0,'fileANDname')">T</div>
    	<div class="files-t-cell files-t-head col-name" onclick="sortTable(1)">Name</div>
        <div class="files-t-cell files-t-head col-lastmodified" onclick="sortTable(2)">Last modified</div>
        <div class="files-t-cell files-t-head col-size" onclick="sortTable(3,'sizeint')">Size</div>
        <div class="files-t-cell files-t-head col-description" onclick="sortTable(4)">Description</div>
    </div>
</div>`;
}

function gettableCSS(){
return `
#filestable {
    display: table;
    min-width: 70%;
    margin-right: auto;
    margin-left: -10px;
    font-size: 1.3em;
    border-spacing: 1.2em 0;
    overflow-x: auto;
    font-family: monospace;
}
.files-t-caption {
    display: table-row;
}
.files-t-cell {
    display: table-cell;
    line-height: 1.7;
    vertical-align: middle;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
}
.files-t-row {
    display: table-row;
}
.files-t-row:hover {
    background-color: whitesmoke;
}
.files-t-head {
    background-color: #e4e4e4;
    cursor: pointer;
}
.row-sort-down:after {
    content: "\\25BC";
}
.row-sort-up:after {
    content: "\\25B2";
}

#filestable .col-name {
    min-width: 600px;
}
#filestable .col-lastmodified {
    width: 160px;
}
#filestable .col-size:not(.files-t-head){
    text-align: right;
}

.hidenext + pre {
    display: none;
}
#pathlinks a {
    text-decoration: none;
    box-shadow: inset -2px -4px 10px -2px #dbd2db;
    background:linear-gradient(to bottom, #ededed 5%, #dfdfdf 100%);
    background-color:#ededed;
    border-radius:2px;
    display:inline-block;
    cursor:pointer;
    color:#777777;
    font-family:Verdana;
    font-size: 1.2em;
    font-weight:bold;
    padding: 6px 5px;
    text-decoration:none;
    text-shadow:-1px 1px 1px #ffffff;
    margin-right: 5px;
    margin-top: 5px;
}
#pathlinks a:hover {
    background:linear-gradient(to bottom, #dfdfdf 5%, #ededed 100%);
    background-color:#dfdfdf;
}
#pathlinks a:last-of-type {
    color: yellowgreen;
}

#waifupara-logo{
    max-height:100px;
}
`;
}

 function init(){
    $('body > h1').remove();

    let collapseolddiv = document.createElement('div');
    collapseolddiv.id = "collapseold";
    collapseolddiv.style = "flex-direction: row;display: flex;";
    collapseolddiv.classList.add("hidenext");
    collapseolddiv.innerHTML = `<span onclick="toggleOldTable()" style="cursor:pointer;font-family: monospace;">[+]</span><div style="border-bottom: solid 1px #9E9E9E;width: 100%;"></div>`;
    document.body.insertBefore(collapseolddiv, document.getElementsByTagName("pre")[0]);
    document.getElementById('hidepre').remove();

    var tableHTML = document.createElement("div");
    tableHTML.id = "tablecontent1";
    tableHTML.innerHTML = gettableHTML();
    document.body.appendChild(tableHTML);
    createPathLinks();

    var tableCSS = document.createElement("style");
    tableCSS.type = "text/css";
    tableCSS.innerHTML = gettableCSS();
    document.body.appendChild(tableCSS);

    let llinks = createAllLLinks();
    llinks.forEach(e => {e.extractAttributesFromTextnodestxt()});

    window.llinks = llinks;

    //add (l)links to new table
    let filetabletag = document.getElementById("filestable");
	addLLinksToDOM(filetabletag, llinks);

    window.sortTable = sortTable;
    window.toggleOldTable = toggleOldTable;
    sortTable(0,'fileANDname');
 }

init();

} //onload function end

if (document.readyState === "complete" && !window.btfy) {
    window.onload();
    console.log("late fire btfy");
}

} //overriteonloadfunction end
})();
