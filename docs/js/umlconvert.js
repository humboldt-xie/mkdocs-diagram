function EachTag(arr,tag,callback){
	var i=0,maxItem=arr.length;
	for (; i < maxItem; i++) {
		if(arr[i].tagName.toLowerCase() == tag.toLowerCase()){
			callback(arr[i])
		}
	}
}
(function (document) {
	function convertUML(className, converter, settings) {
		var charts = document.querySelectorAll("pre." + className + ',div.' + className),
			arr = [],
			i, j, maxItem, diagaram, text, curNode,
			isPre;

		// Is there a settings object?
		if (settings === void 0) {
			settings = {};
		}
		i=0;
		EachTag(charts,"pre",function(pre){
			i+=1;
			EachTag(pre.childNodes,"code",function(code){
				childEl =code
				parentEl = childEl.parentNode;
			});
			text = "";
			for (j = 0; j < childEl.childNodes.length; j++) {
				curNode = childEl.childNodes[j];
				whitespace = /^\s*$/;
				if (curNode.nodeName === "#text" && !(whitespace.test(curNode.nodeValue))) {
					text = curNode.nodeValue;
					break;
				}
			}
			// Do UML conversion and replace source
			el = document.createElement('div');
			el.className = className;
			parentEl.parentNode.insertBefore(el, parentEl);
			parentEl.parentNode.removeChild(parentEl);

			converter(i,text,el)
		})
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

	onReady(function(){
		mermaid.initialize({startOnLoad:true});
		convertUML('uml-flowchart', function(index,text,el){
			diagram=flowchart.parse(text)	
			diagram.drawSVG(el,{});
		});
		convertUML('uml-sequence-diagram', function(index,text,el){
			diagram=Diagram.parse(text)	
			diagram.drawSVG(el,{theme: 'simple'});
		});
		convertUML('uml-mermaid',function(index,text,el){
			var insertSvg = function(svgCode) {
				el.innerHTML = svgCode;
			};
			mermaid.render('mermaid-' + index.toString(), text, insertSvg);
		})
	});
})(document);
