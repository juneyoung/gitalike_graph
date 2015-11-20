const NAMESPACE = 'http://www.w3.org/2000/svg';
const strokeColor = '#FFFFFF';


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
	this.dataset = [];
	this.colorset = [];

	this.rectWidth = 15;
	this.rectHeight = 15;
	this.xPadPercentage = .2;
	this.yPadPercentage = .2;
	this.rectPaddingX = 0;
	this.rectPaddingY = 0;
	this.startX = 0;
	this.rectDefaultColor = '#ededed';

	//HTML Elements
	this.div = null;
	this.outer_svg = null;
	this.inner_svg = null;
}

//init objects

gitALike.prototype.initWithElem = function(elem){
	console.log(this);
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

	this.outer_svg.id = 'outer_svg';
	this.inner_svg.id = 'inner_svg';

	this.outer_svg.setAttribute('width', window.innerWidth);
	this.addMonthRect(new Date(), this.inner_svg);
	this.outer_svg.appendChild(this.inner_svg);
	this.div.appendChild(this.outer_svg);
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
			rect.setAttribute('y', j * (this.rectHeight + this.rectPaddingY));
			rect.style.fill = this.rectDefaultColor;

			rect.addEventListener('mouseover', function(){
				this.style.stroke = strokeColor;
			}, false);

			rect.addEventListener('mouseout', function(){
				this.style.stroke = '';
			}, false)

			grid.appendChild(rect);
			bgSvg.appendChild(grid);
			//console.log('coordinates : ', i, ', ', j);
			totalCnt++;
			var dsKey = singleMonth['yyyymm'] + ((totalCnt < 10) ? '0' + totalCnt : totalCnt);
			//this.dataset[dsKey] = {};
			//this.dataset[dsKey].x = i;
			//this.dataset[dsKey].y = j; 
			var cell = new Cell();
			cell.x = i; cell.y = j;
			cell.date = dsKey;
			cell.cnt = 0;
			this.dataset[dsKey] = cell; 

		}
	}
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

/*
function countDaysPerMonth(dateObj){
	var obj = {daysArr: [], totalDays : 0};
	var startCountDate = dateObj.startDate;
	for(var i = 0; i < 12; i++){
		var targetDate = new Date();
		targetDate.setMonth(startCountDate.getMonth() - i);
		var year = targetDate.getFullYear();
		var month = targetDate.getMonth();

		var days = new Date(year, month, 0).getDate();
		obj.daysArr.push(days);
		obj.totalDays += days;
	}
	return obj;
}
*/

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