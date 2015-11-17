
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


//============================================================
//============================================================
//====================== core func ===========================
//============================================================
//============================================================


var GRIDMANAGER = GRIDMANAGER || new GridManager();
const DEFAULT_SVG_ID = 'gb_id';

function GridManager(){
	this.dataset = [];
	this.colorset = [];
	this.singleGridWidth = 10;
	this.singleGridHeight = 10;
	this.div = null;
	this.svg = null;
} 

GridManager.prototype.setSvgByElem = function(elem){
	if(typeof elem == '$'){
		this.svg = elem[0];
	}else{
		this.svg = elem;
	}
	if(elem.id == null || typeof elem.id == 'undefined'){
		this.svg.id = DEFAULT_SVG_ID;
	}
}

GridManager.prototype.setSvgById = function(id){
	this.svg = document.getElementById(id);
}

GridManager.prototype.setGridOptions = function(objOpt){
	this.singleGridWidth = objOpt.gridWidth;
	this.singleGridHeight = objOpt.gridHeight;
}

//UI Padding
GridManager.prototype.getGridLocation = function(idx){
	var xPad = this.singleGridWidth * 0.2;
	var yPad = this.singleGridHeight * 0.2;
	return {
		x : (idx * (this.singleGridWidth + xPad) + xPad)
		, y : (idx * (this.singleGridHeight + yPad) + yPad)
	}
}

//get Data from X, Y Grid
GridManager.prototype.getInfos = function(x, y){
	var cell = this.dataset[x][y];
	return cell;
}

GridManager.prototype.buildGraph = function(){
	var dateObj = getStdDates();
	var dateSummay = countDaysPerMonth(dateObj);
	this.generateDateGrid(dateSummay.totalDays);
}

GridManager.prototype.generateDateGrid = function(totalCnt){
	var totalWeeks = Math.floor(totalCnt/7);
	var lastDays = totalCnt%7;
	var curDate = new Date();


	//역순 뒤집기
	var i = 0;
	for(i = 0; i < totalWeeks; i++) {

		this.dataset[i] = [];
		this.colorset[i] = [];
		for(var j = 0; j < 7; j++){
			//현재 날짜에서 뺀다고 가정을 해보자.
			var newCell = new Cell();
			var tmpDate =  new Date();
			tmpDate.setDate(curDate.getDate() - ((7-j) + (totalWeeks - i - 1) * 7));

			this.dataset[i][j] = newCell.setCoordinates(i, j).setData(0, tmpDate);
			this.colorset[i][j] = this.dataset[i][j].count;
		}
	}
	//쩌리 
	var lastArr = [];
	for(var j = 0; j < lastDays; j++){
		var newCell = new Cell();
		var tmpDate =  new Date();
		tmpDate.setDate(curDate.getDate() - ((7-j) + (totalWeeks - i - 1) * 7));
		this.dataset[i] = [];
		this.colorset[i] = [];
		this.dataset[i][j] = newCell.setCoordinates(i, j).setData(0, tmpDate);
		this.colorset[i][j] = this.dataset[i][j].count;
	} 
}

//Working on...
/*
GridManager.prototype.setData = function(dataArr){
	//dataArr looks like...
	//[{date: 'YYYYMMDD', count: 'n', text: 'some text'}]
	for(var i = 0; i < dataArr.length, i++){
		for(var j = 0; j < this.dataset) 
	}
}
*/

//============================================================
//============================================================
//====================== outer func ==========================
//============================================================
//============================================================

function getIndexFromParent(elem){
	var candidateNodes = elem.parentNode.childNodes;
	for(var i = 0; i < candidateNodes.length; i++){
		if(candidateNodes[i] == elem){
			//console.log(typeof candidateNodes[i]);
			return i;
		}
	}
}


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

function getStdDates(){
	var ret = {startDate : '', endDate : ''};
	ret.endDate = new Date();
	ret.startDate = new Date();
	ret.startDate.setFullYear(ret.endDate.getFullYear() - 1);
	return ret;
}

function getFormatDate(date){
	var yyyy = date.getFullYear().toString();
	var mm = (date.getMonth()+1).toString(); // getMonth() is zero-based
	var dd  = date.getDate().toString();
	return yyyy + (mm[1]?mm:"0"+mm[0]) + (dd[1]?dd:"0"+dd[0]); // padding
}


//============================================================
//============================================================
//======================= test func ==========================
//============================================================
//============================================================

/*
window.addEventListener('load', 
	function(){
		console.log("I'm in !");
		var cell = new Cell();
		console.log(cell);
	}, 
false);
*/