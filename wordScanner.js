/*
var script = document.createElement('script');
script.src = 'http://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);*/


$(document).ready(function(){
	totalText = "";
	wordArray = [];
	posArray = [];
	var xPos, yPos;
	var firstTextNode;
	var repeat;

	function timeStamp(time, xCoord, yCoord){
		this.currentTime = time;
		this.xCoord = xCoord;
		this.yCoord = yCoord;
	}



	//updating mouse position (source: Stack Overflow)

	function getMousePosition(timeoutMilliSeconds) {
    // "one" attaches the handler to the event and removes it after it has executed once 
    $(document).one("mousemove", function (event) {
        window.mouseXPos = event.pageX;
        window.mouseYPos = event.pageY;
        xPos = window.mouseXPos;
        yPos = window.mouseYPos;


        //update location
        var d = new Date();
		var t = d.toLocaleTimeString();
		var x = new timeStamp(t, window.mouseXPos, window.mouseYPos);
		posArray.push(x);

        // set a timeout so the handler will be attached again after a little while
        setTimeout(function() { getMousePosition(timeoutMilliSeconds) }, timeoutMilliSeconds);
    	});
	}

	// start storing the mouse position every 100 milliseconds
	getMousePosition(10);




	$(document).mouseover(function(event){
		//stop bubbling
		$(event.stopPropagation());


		var elementText = $(event.target).contents().filter(function() {
		//Make sure to change back to t-h-i-s here!
  		return this.nodeType == 3;
		}).text();
	
		var element = $(event.target)[0];
		var spanRect = addSpan(element);
		var elemRect = element.getBoundingClientRect();
		removeSpan(element);
		/*console.log(elementText);
		console.log("top: " + spanRect.top);
		console.log("bottom: " + spanRect.bottom);
		console.log("left: " + spanRect.left);
		console.log("right: " + spanRect.right);*/


		var hit = Boolean((xPos <= spanRect.right + 10)&&(xPos >= spanRect.left - 10)&&(yPos <= spanRect.bottom + 10)&&(yPos >= spanRect.top - 10));
		


		//All event happens within IF(mouse is within bounds of spanRect)
		//function that repeatedly checks whether hit. If hit, hit=true +  exit repeat. repeat ends on Mouseout()
		if(hit){
			hitDo(elementText);
		}

		if(!hit){
			repeat = setInterval(function(){
				var h = Boolean((xPos <= spanRect.right + 10)&&(xPos >= spanRect.left - 10)&&(yPos <= spanRect.bottom + 10)&&(yPos >= spanRect.top - 10));
				if(h){
					hit = true;
					
					clearInterval(repeat);
					hitDo(elementText);
				}
			}, 10);


		}
		
	});


	function hitDo(eText){
		//console.log("Hit!");
			totalText += eText;
			//Need to add individual words into the word array
			var elementArray = eText.split(" ");
			for(var i = 0; i < elementArray.length; i++){
				var s = elementArray[i];
				s = s.replace(/[\r\t\n]+/g, ''); // remove all non space whitespace
				s = s.replace(/^\s+/, ''); // remove all space from the front
				s = s.replace(/\s+$/, ''); // remove all space at the end :)
				if(s){
					wordArray.push(s);
				}	
			}
			return;
	}


	$(document).mouseout(function(event){
		//stop bubbling
		$(event.stopPropagation());
		//console.log("exit");
		clearInterval(repeat);
	});

function update(span, elem){
	//returns false - outOfBounds, true - hit
	var outOfBounds = Boolean((xPos > elem.right)||(xPos < elem.left)||(yPos >elem.bottom)||(yPos < elem.top));
	var h = Boolean((xPos <= span.right + 10)&&(xPos >= span.left - 10)&&(yPos <= span.bottom + 10)&&(yPos >= span.top - 10));

	if(outOfBounds){
		return false;
		console.log("outOfBounds");
	}

	if (h) {
		return true;
		console.log("hit");
	}

	else if ((!h)&&(!outOfBounds)) {
		setTimeout(update(span, elem), 1000);
	}
	
}



/*$("#show").click(function(){
	document.getElementById("results").innerHTML = JSON.stringify(wordArray);

});*/

function addSpan(elem) {

	var rect = elem.getBoundingClientRect();


	firstTextNode = elem.firstChild;
	var newSpan = document.createElement('span');

	elem.normalize();

	// Append "Lorem Ipsum" text to new span:
	newSpan.appendChild( document.createTextNode(firstTextNode.nodeValue) );

	// Replace old text node with new span:
	elem.replaceChild( newSpan, firstTextNode );

	var span = elem.firstChild;
	var spanRect = span.getBoundingClientRect();

	return spanRect;

}

function removeSpan(elem) {
	oldChild = elem.firstChild;
	elem.replaceChild(firstTextNode, oldChild);
}




//***sending to host site***

setTimeout(sendData, 10000);

function sendData() {
	var URL = prompt("Please enter a url to send JSON data", "http://posttestserver.com/post.php");
		if(URL != null){
			$.post(URL, JSON.stringify(wordArray), function(data, status){
				alert("data: " + data + "\nstatus: " + status);
		});
		}
}


});

