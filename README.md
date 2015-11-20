# GITALIKE
by <b>Juneyoung Oh</b><br>
Writen in 17.NOV.15<br>
<!--
<a href='README.kr.md'>KOR</a>
-->

![what does it looks like](/sample/screenshot_1120.png)

Easy github commit graph like graph with no dependencies.<br>
I did test on Chrome :-)<br>

## How to Use
### Initializing
import `gitalike.js`, then 
``` javascript
	GITALIKE.initWithElem(document.getElementById('your Div Id'));
```
### Pushing Data
``` javascript
  var data = [
		{date: "20141214", count : "5", text: "20141214"}
		,{date: "20150224", count : "15", text: "20150224"}
		,{date: "20150815", count : "25", text: "20150815"}
		,{date: "20141225", count : "50", text: "20151225"} 
		,{date: "20150527", count : "500", text: "20141027"}
	];

	GITALIKE.pushData(data);
```
Data must follow standard format like `{date: 'yyyyMMdd', count : n, text : ''}`.<br>
Currently text value does not work.(I am working on it :D)<br>

## References
Not Yet

## Message
Fork and use free and let us develop together! 

## History
<ul>
  <li>17.NOV.15 - Very first distribution by Juneyoung Oh</li>
  <li>20.NOV.15 - re-touching data structure and remove d3 dependencies by Juneyoung Oh</li>
</ul>
