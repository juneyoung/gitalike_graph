const NAMESPACE = 'http://www.w3.org/2000/svg';
const strokeColor = '#FFFFFF';
const MONTHSTR = ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];

/**
************************************
************************************
************************************
************************************
***************** DataCell Object...
************************************
************************************
************************************
************************************
************************************
*/

//각 셀을 표현할 수 있는 데이터 구조 설정 
function Cell(){
	this.x = 0;
	this.y = 0;
	this.count = 0;
	this.date = null;
	this.text = '';
}

Cell.prototype.setCoordinates = function(x, y){
	this.x = x;
	this.y = y;
	return this;
}

Cell.prototype.setData = function(count, date, text){
	this.count = count;
	this.date = date;
	this.text = text;
	return this;
}

/**
************************************
************************************
************************************
************************************
***************** GitALike Object...
************************************
************************************
************************************
************************************
************************************
*/

var GITALIKE = GITALIKE || new gitALike();

function gitALike(){
	this.dataset = {};
	this.colorset = ['#ededed','#ACD5F2', '#7FA8D1', '#49729B', '#254E77'];

	this.monthgrid_top = 25;

	this.rectWidth = 15;
	this.rectHeight = 15;
	this.xPadPercentage = .2;
	this.yPadPercentage = .2;
	this.rectPaddingX = 0;
	this.rectPaddingY = 0;
	this.startX = 0;
	this.rectDefaultColor = '#ededed';

	//by this unit, color of grid will be more darker;
	this.gridColorUnit = 20;

	//HTML Elements
	this.div = null;
	this.outer_svg = null;
	this.inner_svg = null;
	this.tooltip_svg = null;
}

// Optional Uses...
gitALike.prototype.setGridOptions = function(options){
	this.rectWidth = options.width;
	this.rectHeight = options.height;
	this.xPadPercentage = options.paddingX;
	this.yPadPercentage = options.paddingY;
	this.rectDefaultColor = options.defaultColor;
}


gitALike.prototype.setDataOptions = function(options){
	this.gridColorUnit = options.dataLevel;
	this.colorset = options.dataColorSet;
}

//init objects

gitALike.prototype.initWithElem = function(elem){
	if(typeof elem == '$'){
		this.div = elem[0];
	}else{
		this.div = elem;
	}
	this.createSVGLayers();
}

gitALike.prototype.initWithId = function(id){
	this.div = document.getElementById(id);
	this.createSVGLayers();
}

//Internal :: create SVG Layers
gitALike.prototype.createSVGLayers = function(){
	this.rectPaddingX = this.rectWidth * this.xPadPercentage;
	this.rectPaddingY = this.rectHeight * this.yPadPercentage;

	this.outer_svg = createVectorElement('svg');
	this.inner_svg = createVectorElement('svg');
	this.tooltip_svg = createVectorElement('svg');

	this.outer_svg.id = 'outer_svg';
	this.inner_svg.id = 'inner_svg';
	this.tooltip_svg.id = 'tooltip_svg';
	this.drawTicks();

	this.outer_svg.setAttribute('width', window.innerWidth);
	this.addMonthRect(new Date(), this.inner_svg);
	this.outer_svg.appendChild(this.inner_svg);
	this.div.appendChild(this.outer_svg);
	this.div.appendChild(this.tooltip_svg);

	var rects = this.inner_svg.getElementsByTagName('rect');
	for(var i = 0; i < rects.length; i++){
		var eachRect = rects[i];
		eachRect.addEventListener('mouseover',function(){
			var datasetId = this.parentNode.parentNode.id + this.getAttribute('day');
		},false);

		eachRect.addEventListener('mouseout',function(){
			//do something
		},false);
	}

	//this.displayMonths();
}

gitALike.prototype.drawTicks = function(){
	for(var i = 1; i <= this.colorset.length; i++){
		var grid = createVectorElement('g');
		var rect = createVectorElement('rect');

		rect.setAttribute('width', this.rectWidth);
		rect.setAttribute('height', this.rectHeight);

		//
		rect.setAttribute('x', (i - 1) * (this.rectWidth + this.rectPaddingX));
		rect.setAttribute('y', this.rectPaddingY);
		rect.style.fill = this.colorset[i - 1];

		var title = createVectorElement('title');
		title.textContent = 'over ' + (i * this.gridColorUnit);
		rect.appendChild(title);
		grid.appendChild(rect);
		this.tooltip_svg.appendChild(grid);
	}
}

gitALike.prototype.displayMonths = function(){
	var monthGrids = document.getElementById('inner_svg').getElementsByTagName('svg');
	for(var i = 0; i < monthGrids.length; i++){
		var monthInStr = monthGrids[i].id;
		monthInStr = monthInStr.substring(monthInStr.length - 2, monthInStr.length);
		var strValue = MONTHSTR[(monthInStr * 1) % 12];
		console.log(strValue);
		var text = createVectorElement('text');
		text.textContent = strValue;
		this.div.appendChild(text);

	}
}

//Internal :: grouping MonthGrids
gitALike.prototype.addMonthRect = function (date, monthGroupSvg){
	var dateMapObj = calcDays();
	var i = 0;
	for(var singleMonth in dateMapObj){
		var month_svg = createVectorElement('svg');
		month_svg.setAttribute('x', i * (this.rectPaddingX + this.rectWidth) * 6);
		this.drawSingleDateGrid(dateMapObj[singleMonth], month_svg);
		monthGroupSvg.appendChild(month_svg);
		month_svg.id = singleMonth;
		i++;
	}
}

//Internal :: create single MonthGrid
gitALike.prototype.drawSingleDateGrid = function(singleMonth, bgSvg){
	var weeksPerMonth = Math.ceil(singleMonth.days/7);
	//var weeksPerMonth = 5;
	var totalCnt = 0;
	//console.log(weeksPerMonth);
	for(var i = 0; i < weeksPerMonth; i++) {
		for(var j = 0; j < 7; j++) {
			
			if(i == 0){
				if(singleMonth.st_day > j) continue;
			}else if(i == weeksPerMonth - 1 ) {
				//since it starts with 0, plus 1
				if(totalCnt > singleMonth.days - 1) continue;
			}

			var grid = createVectorElement('g');;
			var rect = createVectorElement('rect');

			rect.setAttribute('width', this.rectWidth);
			rect.setAttribute('height', this.rectHeight);

			//x 와 y 의 위치 px
			rect.setAttribute('x', i * (this.rectWidth + this.rectPaddingX));
			rect.setAttribute('y', this.monthgrid_top + j * (this.rectHeight + this.rectPaddingY));
			rect.style.fill = this.rectDefaultColor;

			var digit2Day = ((totalCnt + 1 < 10) ? '0' + (totalCnt + 1) : totalCnt + 1);
			rect.setAttribute('class','rect_' + i + '_' + j);
			rect.setAttribute('day', digit2Day);

			grid.appendChild(rect);
			bgSvg.appendChild(grid);
			var dsKey = singleMonth['yyyymm'] + digit2Day;
			var cell = new Cell();
			cell.x = i; cell.y = j;
			cell.date = dsKey;
			cell.count = 0;
			this.dataset[dsKey] = cell; 
			this.addToolTips(rect, this.dataset[dsKey]);
			//console.log('coordinates : ', i, ', ', j);
			totalCnt++;
		}
	}
}

gitALike.prototype.pushData = function (dataArr) {
	try{
		for(var i = 0; i < dataArr.length; i++){
			var single = dataArr[i];
			this.dataset[single.date].count = single.count;
			this.dataset[single.date].text = single.text;
			this.fillColor(single.date, this.dataset[single.date]);
		}
	}catch(exception){		
		console.error('got some error : ' + exception);
		console.log('FYI, data structure must be something like {date: "yyyyMMdd", count : n, text: "blah"} or check date range\ndate must within a year!');
	}
}

gitALike.prototype.fillColor = function(yyyyMMdd, dataset){
	var monthSvgId = yyyyMMdd.substring(0, yyyyMMdd.length - 2);
	var monthSvg = document.getElementById(monthSvgId);
	var target = monthSvg.getElementsByClassName('rect_'+ dataset.x + '_' + dataset.y)[0];
	var colorIndex = Math.floor(dataset.count / this.gridColorUnit);
	colorIndex = (colorIndex > this.colorset.length - 1) ? this.colorset.length - 1 : colorIndex;
	target.style.fill = this.colorset[colorIndex];
	this.addToolTips(target, dataset);
}

gitALike.prototype.addToolTips = function(rect, dataset){
	//adding tooltips
	while(rect.firstChild){
		rect.removeChild(rect.firstChild);
	}
	var title = createVectorElement('title');
	title.textContent = dataset.date + ' : ' + dataset.count;
	rect.appendChild(title);
}


/**
************************************
************************************
************************************
************************************
*************** Utility Functions...
************************************
************************************
************************************
************************************
************************************
*/

// Referring to SVG format
function createVectorElement(tag){
	return document.createElementNS(NAMESPACE, tag);
}

// Referring to Date function

function calcDays(){
	// {'201511' : {days: 30, st_day : 'MON'}, ...}
	var ret = {};
	var today = new Date();
	for(var i = 12; i >= 0; i--){
		var objDate = new Date();
		objDate.setMonth(today.getMonth() - i);
		var lastDay = new Date(objDate.getFullYear(), objDate.getMonth() + 1, 0);
		var firstDay = new Date(objDate.getFullYear(), objDate.getMonth(), 1);

		// check Start date and End date via
		// console.log(firstDay, ' ~~ ', lastDay);
		var key = getFormatMonth(objDate);
		ret[key] = {};
		ret[key]['days'] = lastDay.getDate();
		ret[key]['st_day'] = firstDay.getDay();
		ret[key]['yyyymm'] = getFormatMonth(objDate);
	}
	return ret;
}

function getStdDates(){
	var ret = {startDate : '', endDate : ''};
	ret.endDate = new Date();
	ret.startDate = new Date();
	ret.startDate.setFullYear(ret.endDate.getFullYear() - 1);
	return ret;
}

function getFormatMonth(date){
	var yyyy = date.getFullYear().toString();
	var mm = (date.getMonth()+1).toString();
	return yyyy + (mm[1]?mm:"0"+mm[0]);
}

function getFormatDate(date){
	var yyyy = date.getFullYear().toString();
	var mm = (date.getMonth() + 1).toString(); // getMonth() is zero-based
	var dd  = date.getDate().toString();
	return yyyy + (mm[1]?mm:"0"+mm[0]) + (dd[1]?dd:"0"+dd[0]); // padding
}

function isEmpty(val) {
	return (val == null || typeof val == 'undefined') ? true : false;
}