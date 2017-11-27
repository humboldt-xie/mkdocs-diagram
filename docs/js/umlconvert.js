function EachTag(arr,tag,callback){
	var i=0,maxItem=arr.length;
	for (; i < maxItem; i++) {
		if(arr[i].tagName.toLowerCase() == tag.toLowerCase()){
			callback(arr[i])
		}
	}
}

function code2Text(codeEl){
	var text = "",j;
	for (j = 0; j < codeEl.childNodes.length; j++) {
		var curNode = codeEl.childNodes[j];
		whitespace = /^\s*$/;
		if (curNode.nodeName === "#text" && !(whitespace.test(curNode.nodeValue))) {
			text = curNode.nodeValue;
			break;
		}
	}
	return text
}
function mermaidConvert(index,text,el){
	var insertSvg = function(svgCode) {
		el.innerHTML = svgCode;
	};
	mermaid.parse(text)
	mermaid.render('mermaid-' + index.toString(), text, insertSvg);
	return null
}

function flowchartConvert(index,text,el){
	diagram=flowchart.parse(text)	
	diagram.drawSVG(el,{});
	return null
}
function sequenceConvert(index,text,el){
	diagram=Diagram.parse(text)	
	diagram.drawSVG(el,{theme: 'simple'});
	return null
}
var diagramType={
	"gantt":mermaidConvert,
	"uml-flowchart":flowchartConvert,
	"uml-sequence-diagram":sequenceConvert
}
function convertUML() {
	var codes = document.querySelectorAll("code")
	for (var i=0; i<codes.length; i++){
		var codeEl=codes[i];
		var parentEl = codeEl.parentNode;
		var text=code2Text(codes[i]);
		var type=text.substr(0,text.indexOf("\n"));
		var conv=diagramType[type];
		var pclass=parentEl.classList
		for(var j=0;!conv && j<parentEl.classList.length;j++){
			conv=diagramType[parentEl.classList[j]]
			if(conv){
				break;
			}
		}
		if(conv){
			el = document.createElement('div');
			el.className = type;
			try {
				parentEl.parentNode.insertBefore(el, parentEl);
				conv(i,text,el)
				parentEl.parentNode.removeChild(parentEl);
			}catch(err){
				codeEl.title=err.str;
			}
		}
		
	}
};

function onReady(fn) {
	if (document.addEventListener) {
		document.addEventListener('DOMContentLoaded', fn);
	} else {
		document.attachEvent('onreadystatechange', function() {
			if (document.readyState === 'interactive')
				fn();
		});
	}
}
(function (document) {
	onReady(function(){
		convertUML();
	});
})(document);
