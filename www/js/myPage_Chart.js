//최근갱신일 버튼 눌렀을 경우
function refresh(kind, gu, admin_code,Ger_code)
{
	switch (kind)
	{
		case "chart1" : kind = "meaip_jem"; break;
		case "chart2" : kind = "meachul_jem"; break;
		case "chart3" : kind = "brand_top5"; break;
		case "chart4" : kind = "meachul_top5"; break;
		case "chart5" : kind = "scm"; break;
		case "chart6" : kind = "Meachul_ik"; break;
		case "chart7" : kind = "meachul_7"; break;
		case "chart8" : kind = "meaip_7"; break;
		case "chart9" : kind = "beasonga"; break;
		case "chart10" : kind = "beasong_gu"; break;
		case "chart11" : kind = "meachul_onoff"; break;
		case "chart12" : kind = "banpum"; break;
		case "chart13" : kind = "banpum_top5"; break;
		case "chart14" : kind = "meachul_cs"; break;
		case "chart15" : kind = "meaip_commgoods"; break;
		case "chart16" : kind = "JeGo_TurnOver"; break;
		case "chart17" : kind = "beasongb"; break;
		default : kind = ""; break;

	}
	AmCharts.loadJSON("http://www.erpia.net/include/graph_DataUpdate.asp?admin_code="+ admin_code +"&kind="+ kind +"&swm_gu="+ gu +"&Ger_code="+ Ger_code, "refresh");
	makeCharts(kind, gu, admin_code,Ger_code);
}


// 처음 로딩 할때
function renewalDay(kind, gu, admin_code, Ger_code)  
{
	//로딩중처리
	//document.getElementById("loading").innerHTML = "로딩중....";
	//alert("로딩중");	
	gu = $("#gu_hidden").val();

	$("#loading").css("display","block");

	switch (kind)
	{
		case "chart1" : kind = "meaip_jem"; break;
		case "chart2" : kind = "meachul_jem"; break;
		case "chart3" : kind = "brand_top5"; break;
		case "chart4" : kind = "meachul_top5"; break;
		case "chart5" : kind = "scm"; break;
		case "chart6" : kind = "Meachul_ik"; break;
		case "chart7" : kind = "meachul_7"; break;
		case "chart8" : kind = "meaip_7"; break;
		case "chart9" : kind = "beasonga"; break;
		case "chart10" : kind = "beasong_gu"; break;
		case "chart11" : kind = "meachul_onoff"; break;
		case "chart12" : kind = "banpum"; break;
		case "chart13" : kind = "banpum_top5"; break;
		case "chart14" : kind = "meachul_cs"; break;
		case "chart15" : kind = "meaip_commgoods"; break;
		case "chart16" : kind = "JeGo_TurnOver"; break;
		case "chart17" : kind = "beasongb"; break;
		default : kind = ""; break;
	}
	AmCharts.loadJSON("http://www.erpia.net/include/renewalDay.asp?admin_code="+ admin_code +"&kind="+ kind +"&swm_gu="+ gu +"&Ger_code="+ Ger_code, "refresh"); //최근갱신일 로딩		
}


function makeCharts(kind, gu, admin_code,Ger_code){
	$("#gu_hidden").val(gu);

	$("#btnW").removeClass();
	$("#btnM").removeClass();
	$("#btnY").removeClass();

	$("#btnW").addClass("btn bg-purple btn-xs");
	$("#btnM").addClass("btn bg-purple btn-xs");
	$("#btnY").addClass("btn bg-purple btn-xs");

	$('#gridBody').hide();		//gigler추가
	$("#<%=kind%>").show();

	if (gu == 1) {
		$("#btnW").removeClass();
		$("#btnW").addClass("btn btn-warning btn-xs");
		sDate = '<%=DateAdd("D", -7, Date())%>';
		eDate = '<%=Date()%>';
		temp ="주간 - "
	} else if (gu == 2) {
		$("#btnM").removeClass();
		$("#btnM").addClass("btn btn-warning btn-xs");
		sDate = '<%=DateAdd("M", -1, Date())%>';
		eDate = '<%=Date()%>';
		temp = "월간 - "
	} else if (gu == 3) {
		$("#btnY").removeClass();
		$("#btnY").addClass("btn btn-warning btn-xs");
		sDate = '<%=DateAdd("YYYY", -1, Date())%>';
		eDate = '<%=Date()%>';
		temp ="년간 - "
	}

	if (kind == "chart2" || kind == "chart1" || kind == "chart9" || kind == "chart11" || kind == "chart14")
	{
		AmCharts.addInitHandler(function(kind) {
		  if (kind.legend === undefined || kind.legend.truncateLabels === undefined)
			return;			  

		 var titleField =""
		 var legendTitleField=""
		  // init fields
		  titleField = kind.titleField;
		  legendTitleField = kind.titleField+"Legend";			  
		  // iterate through the data and create truncated label properties
		  for(var i = 0; i < kind.dataProvider.length; i++) {
			var label = kind.dataProvider[i][kind.titleField];
			if (label.length > kind.legend.truncateLabels)
			  label = label.substr(0, kind.legend.truncateLabels-1)+'...'
			  kind.dataProvider[i][legendTitleField] = label;
		  }			  
		  // replace chart.titleField to show our own truncated field
		  kind.titleField = legendTitleField;			  
		  // make the balloonText use full title instead
		  kind.balloonText = kind.balloonText.replace(/\[\[title\]\]/, "[["+titleField+"]]");			  
		}, ["pie"]);
	}

	switch (kind)
	{
		case "chart1" :			//거래처별 매입 점유율

			var chart = AmCharts.makeChart("chart1", {
				"type": "pie",
 			    "balloonText": "<span style='font-size:12px;'>[[title]] in [[category]]:<br><span style='font-size:20px;'>[[value]]</span> ([[percents]]%)</span>",
				"minRadius": 100,
				"maxLabelWidth":100,
				"titleField": "name",
				"valueField": "value",
				"fontSize": 12,
				"theme": "dark",
			    "labelsEnabled": true,
			    "legend": {
			      "enabled": false,
				  "truncateLabels": 10 // custom parameter
			    },
				"allLabels": [
					{
						"id": "Label-1",
						"text": temp + sDate + " ~ " + eDate,
						"x": 6,
						"y": 280
					}
				],
				"balloon": {},
				"labelRadius": 1,
				"dataProvider": AmCharts.loadJSON("http://www.erpia.net/include/JSon_Proc_graph.asp?kind=meaip_jem&value_kind=meaip_jem&admin_code=" + admin_code + "&swm_gu=" + gu)
			});

			break;

		case "chart2" :			//사이트별 매출 점유율
			var chart = AmCharts.makeChart("chart2", {
				"type": "pie",
 			    "balloonText": "<span style='font-size:12px;'>[[title]] in [[category]]:<span style='font-size:20px;'>[[value]]</span> ([[percents]]%)</span>",
				"minRadius": 100,
				"maxLabelWidth":100,
				"titleField": "name",
				"valueField": "value",
				"fontSize": 12,
				"theme": "dark",
			    "labelsEnabled": true,
			    "legend": {
			      "enabled": false,
				  "truncateLabels": 10 // custom parameter
			    },
				"allLabels": [
					{
						"id": "Label-1",
						"text": temp + sDate + " ~ " + eDate,
						"x": 6,
						"y": 280
					}
				],
				"balloon": {},
				"labelRadius": 1,
				 "dataProvider": AmCharts.loadJSON("http://www.erpia.net/include/JSon_Proc_graph.asp?kind=meachul_jem&value_kind=meachul_jem&admin_code=" + admin_code + "&swm_gu=" + gu)
			});

			break;

		case "chart3" :			//브랜드별 매출 Top 5

			var chart = AmCharts.makeChart("chart3", {
				"type": "serial",
				 "theme": "dark",
				"categoryField": "name",
				"rotate": true,
				"startDuration": 1,
				"autoMarginOffset": 40,
				"autoMargins": false,
				"marginBottom": 40,
				"marginRight": 40,
				"marginTop": 40,
				"marginLeft": 20,
				"categoryAxis": {
					"gridPosition": "middle",
					"position": "left",
					"inside": true,
					"labelFunction": function(label) {
					  if (label.length > 10)
						return label.substr(0, 10) + '...';
					  return label;
					}
				},
				"trendLines": [],
				"graphs": [
					{
					"fillAlphas": 0.9,
					"lineAlpha": 0.2,
					"title": "금액",
					"type": "column",
					"valueAxis": "ValueAxis-1",
					"balloonText": "<span style='font-size:12px;'>[[title]] in [[category]]:<br><span style='font-size:20px;'>[[value]]</span> 원</span>",
					"valueField": "value"
				},{
					"bullet": "square",
					"bulletBorderAlpha": 1,
					"bulletBorderThickness": 1,
					"bulletSize": 16,
//					"id": "AmGraph-2",
					"valueAxis": "ValueAxis-2",
					"lineThickness": 3,
					"title": "수량",
					"balloonText": "<span style='font-size:12px;'>[[title]] in [[category]]:<br><span style='font-size:20px;'>[[value]]</span> 개</span>",
					"valueField": "su"
				}],

				"guides": [],
				"prefixesOfBigNumbers": [
					{
						"number": 10000,
						"prefix": ""
					}
				],
				"valueAxes": [
					{
						"id": "ValueAxis-1",
						"position": "top",
						"title": "",
						"axisAlpha": 0,
						"usePrefixes": true
					},
					{
						"id": "ValueAxis-2",
						"title": "",
						"usePrefixes": true,
						"axisAlpha": 0,
						"position": "bottom"
					}
				],
				"allLabels": [
					{
						"id": "ValueAxis-1",
						"text": "금액(원)",
						"bold": true,
						"size": 12,
						"x": 20,
						"y": 0
					},
					{
						"id": "ValueAxis-2",
						"text": "수량(개)",
						"bold": true,
						"size": 12,
						"align": "right",
						"x": 80,
						"y": "95%"
					}
				],
				"balloon": {},
				"titles": [],
				"dataProvider": AmCharts.loadJSON("http://www.erpia.net/include/JSon_Proc_graph.asp?kind=brand_top5&value_kind=brand_top5&admin_code=" + admin_code + "&swm_gu=" + gu),
				"export": {
					"enabled": true
				 },
                "legend": {
					"enabled": true,
					"autoMargins": false,
					"bottom": 0,
					"top": 0,
					"left": 0,
					"right": 0,
					"verticalGap": 0,
                    "align": "center",
                    "markerType": "circle",
					"balloonText" : "[[title]]<br><span style='font-size:14px'><b>[[value]]</b> ([[percents]]%)</span>"
                }
			});

			break;

		case "chart4" :			//상품별 매출 TOP5

			var chart = AmCharts.makeChart("chart4", {
				"type": "serial",
				 "theme": "dark",
				"categoryField": "name",
				"rotate": true,
				"startDuration": 1,
				"autoMarginOffset": 40,
				"autoMargins": false,
				"marginBottom": 40,
				"marginRight": 40,
				"marginTop": 40,
				"marginLeft": 20,
				"categoryAxis": {
					"gridPosition": "middle",
					"position": "left",
					"inside": true,
					"labelFunction": function(label) {
					  if (label.length > 10)
						return label.substr(0, 10) + '...';
					  return label;
					}
				},
				"graphs": [
					{
					"fillAlphas": 0.9,
					"lineAlpha": 0.2,
					"title": "금액", //금액
					"type": "column",
					"valueAxis": "ValueAxis-1",
					"balloonText": "<span style='font-size:12px;'>[[title]] in [[category]]:<br><span style='font-size:20px;'>[[value]]</span> 원</span>",
					"valueField": "value"
				},{
					"bullet": "square",
					"bulletBorderAlpha": 1,
					"bulletBorderThickness": 1,
					"bulletSize": 16,
//					"id": "AmGraph-2",
					"valueAxis": "ValueAxis-2",
					"lineThickness": 3,
					"title": "수량", //수량
					"balloonText": "<span style='font-size:12px;'>[[title]] in [[category]]:<br><span style='font-size:20px;'>[[value]]</span> 개</span>",
					"valueField": "su"
				}],
				"prefixesOfBigNumbers": [
					{
						"number": 10000,
						"prefix": ""
					}
				],
				"allLabels": [
					{
						"id": "ValueAxis-1",
						"text": "금액(원)",
						"bold": true,
						"size": 12,
						"x": 20,
						"y": 0
					},
					{
						"id": "ValueAxis-2",
						"text": "수량(개)",
						"bold": true,
						"size": 12,
						"align": "right",
						"x": 80,
						"y": "95%"
					}
				],
				"valueAxes": [
					{
						"id": "ValueAxis-1",
						"position": "top",
						"title": "",
						"axisAlpha": 0,
						"usePrefixes": true
					},
					{
						"id": "ValueAxis-2",
						"title": "",
						"usePrefixes": true,
						"axisAlpha": 0,
						"position": "bottom"
					}
				],
				"dataProvider": AmCharts.loadJSON("http://www.erpia.net/include/JSon_Proc_graph.asp?kind=meachul_top5&value_kind=meachul_top5&admin_code=" + admin_code + "&swm_gu=" + gu),
				"export": {
					"enabled": true
				 },
                "legend": {
					"enabled": true,
					"autoMargins": false,
					"bottom": 0,
					"top": 0,
					"left": 0,
					"right": 0,
					"verticalGap": 0,
                    "align": "center",
                    "markerType": "circle",
					"balloonText" : "[[title]]<br><span style='font-size:14px'><b>[[value]]</b> ([[percents]]%)</span>"
                }
			});

			break;

		case "chart5" :		//scm

			var chart = AmCharts.makeChart("chart5", {
			   "theme": "dark",
				"type": "serial",
				//"dataProvider": AmCharts.loadJSON("http://www.erpia.net/include/JSon_Proc_graph.asp?kind=scm&value_kind=scm&admin_code=" + admin_code + "&swm_gu=" + gu + "&Ger_code=" + Ger_code),
				"dataProvider": AmCharts.loadJSON("http://www.erpia.net/include/JSon_Proc_graph.asp?Kind=scm&Value_Kind=scm&admin_code=" + admin_code + "&swm_gu=" + gu + "&Ger_code=" + Ger_code),
				"startDuration": 1,
				"prefixesOfBigNumbers": [
					{
						"number": 10000,
						"prefix": ""
					}
				],
				"valueAxes": [
					{
						"id": "ValueAxis-1",
						"title": "금액",
						"titleRotation": 0,
						"usePrefixes": true
					},
					{
						"id": "ValueAxis-2",
						"title": "수량",
						"titleRotation": 0,
						"position": "right"
					}
				],
				"graphs": [{
//					"balloonText": "수량: <b>[[value]]</b>",
					"balloonText": "<span style='font-size:12px;'>[[title]] in [[category]]:<br><span style='font-size:20px;'>[[value]]</span> 개</span>",
					"fillAlphas": 0.9,
					"lineAlpha": 0.2,
					"title": "수량",
					"type": "column",
					"valueAxis": "ValueAxis-2",
					"valueField": "su"
				}, {
//					"balloonText": "금액: <b>[[value]]</b>",
					"balloonText": "<span style='font-size:12px;'>[[title]] in [[category]]:<br><span style='font-size:20px;'>[[value]]</span> 원</span>",
					"fillAlphas": 0.9,
					"lineAlpha": 0.2,
					"title": "금액",
					"type": "column",
					"clustered":false,
					"columnWidth":0.5,
					"valueAxis": "ValueAxis-1",
					"valueField": "value"
				}],
				"plotAreaFillAlphas": 0.1,
				"categoryField": "name",
				"categoryAxis": {
					"gridPosition": "start",
					"autoRotateAngle" : 0,
					"autoRotateCount": 1,
				},
				"export": {
					"enabled": true
				 },
                "legend": {
                    "align": "center",
                    "markerType": "circle",
					"balloonText" : "[[title]]<br><span style='font-size:14px'><b>[[value]]</b> ([[percents]]%)</span>"
                }
			});

			break;

		case "chart6" :			//월간 매출 이익

			var chart = AmCharts.makeChart("chart6", {
			   "theme": "dark",
				"type": "serial",
				"dataProvider": AmCharts.loadJSON("http://www.erpia.net/include/JSon_Proc_graph.asp?kind=Meachul_ik&value_kind=Meachul_ik&admin_code=" + admin_code + "&swm_gu=" + gu),
				"startDuration": 1,
				"marginTop": 30,
				"prefixesOfBigNumbers": [
					{
						"number": 10000,
						"prefix": ""
					}
				],
				"valueAxes": [
					{
						"id": "ValueAxis-1",
						//"title": "매출이익",
						//"title": "이익액",
						"titleRotation": 0,
						//"position": "t",
						"usePrefixes": true
					},
					{
						"id": "ValueAxis-2",
						//"title": "공급이익",
						"usePrefixes": true
						//"position": "right"
					},
					{
						"id": "ValueAxis-3",
						//"title": "공급이익 증감율",
						//"title": "증감율(%)",
						"titleRotation": 0,
						//"recalculateToPercents": true,
						//"usePrefixes": true,
						"position": "right"
					},
					{
						"id": "ValueAxis-4",
						//"title": "매출이익 증감율",
						//"recalculateToPercents": true,
						//"usePrefixes": true,
						"position": "right"
					}
				],
				"allLabels": [
					{
						"id": "ValueAxis-1",
						"text": "이익액(원)",
						"bold": true,
						"size": 12,
						"x": 20,
						"y": 0
					},
					{
						"id": "ValueAxis-3",
						"text": "증감율(%)",
						"bold": true,
						"size": 12,
						"align": "right",
						"x": "98%",
						"y": 0
					}
				],
				"graphs": [{
					"balloonText": "[[category]]: <b>[[value]]</b>",
					"fillAlphas": 0.9,
					"lineAlpha": 0.2,
					"title": "공급이익",
					"type": "column",
					"valueAxis": "ValueAxis-2",
					"valueField": "value1"
				}, {
					"balloonText": "[[category]]: <b>[[value]]</b>",
					"fillAlphas": 0.9,
					"lineAlpha": 0.2,
					"title": "매출이익",
					"type": "column",
					"clustered":false,
					"columnWidth":0.5,
					"valueAxis": "ValueAxis-1",
					"valueField": "value2"
				}, {
					"id": "graph3",
					"balloonText": "<span style='font-size:12px;'>[[title]] in [[category]]:<br><span style='font-size:20px;'>[[value]]</span> %</span>",
					"bullet": "round",
					"lineThickness": 3,
					"bulletSize": 7,
					"bulletBorderAlpha": 1,
					"bulletColor": "#FFFFFF",
					"useLineColorForBulletBorder": true,
					"bulletBorderThickness": 3,
					"fillAlphas": 0,
					"lineAlpha": 1,
					"title": "공급이익율",
					"valueField": "su1",
					"valueAxis": "ValueAxis-3",
					"position" : "right"
				}, {
					"id": "graph4",
					"balloonText": "<span style='font-size:12px;'>[[title]] in [[category]]:<br><span style='font-size:20px;'>[[value]]</span> %</span>",
					"bullet": "round",
					"lineThickness": 3,
					"bulletSize": 7,
					"bulletBorderAlpha": 1,
					"bulletColor": "#FFFFFF",
					"useLineColorForBulletBorder": true,
					"bulletBorderThickness": 3,
					"fillAlphas": 0,
					"lineAlpha": 1,
					"title": "매출이익율",
					"valueField": "su2",
					"valueAxis": "ValueAxis-4",
					"position" : "right"
				  }
				],
				"plotAreaFillAlphas": 0.1,
				"categoryField": "name",
				"categoryAxis": {
					"gridPosition": "start",
					//"autoRotateAngle" : -50.4,
					//"autoRotateCount": 1,
				},
				"export": {
					"enabled": true
				 },				 
                "legend": {
					"enabled": true,
					"autoMargins": false,
					"bottom": 0,
					"top": 0,
					"left": 0,
					"right": 0,
					"verticalGap": 0,
                    "align": "center",
					"position": "bottom",
                    "markerType": "circle",
					"balloonText" : "[[title]]<br><span style='font-size:14px'><b>[[value]]</b> ([[percents]]%)</span>"
                }

			});

			break;

		case "chart7" :			//매출 실적 추이

			var chart = AmCharts.makeChart("chart7", {
			  "type": "serial",
			  "addClassNames": true,
			  "startDuration": 0,
			  "theme": "dark",
			  "autoMargins": true,
			  "marginTop": 30,
			  "mouseWheelScrollEnabled": false,
			  "balloon": {
				"adjustBorderColor": false,
				"horizontalPadding": 10,
				"verticalPadding": 8,
				"color": "#ffffff"
			  },
				"prefixesOfBigNumbers": [
							{
								"number": 10000,
								"prefix": ""
							}
				],
				"dataProvider": AmCharts.loadJSON("http://www.erpia.net/include/JSon_Proc_graph.asp?kind=meachul_7&value_kind=meachul_7&admin_code=" + admin_code + "&swm_gu=" + gu),
				"valueAxes": [
						{
							"id": "ValueAxis-1",
							"title": "",
							"titleRotation": 0,
							"usePrefixes": true,
							"position": "left"
						},
						{
							"id": "ValueAxis-2",
							"title": "",
							"titleRotation": 0,
							"position": "right"
						}
					],
				"allLabels": [
					{
						"id": "ValueAxis-1",
						"text": "금액(원)",
						"bold": true,
						"size": 12,
						"x": 20,
						"y": 0
					},
					{
						"id": "ValueAxis-2",
						"text": "수량(개)",
						"bold": true,
						"size": 12,
						"align": "right",
						"x": "98%",
						"y": 0
					}
				],
				  "startDuration": 1,
				  "graphs": [{
					"id": "graph1",
					"alphaField": "alpha",
					"balloonText": "<span style='font-size:12px;'>[[title]] in [[category]]:<br><span style='font-size:20px;'>[[value]]</span> 원</span>",
					"fillAlphas": 1,
					"title": "금액",
					"type": "column",
					"valueField": "value",
					"dashLengthField": "dashLengthColumn",
					"ValueAxis": "ValueAxis-1"
				  }, {
					"id": "graph2",
					"balloonText": "<span style='font-size:12px;'>[[title]] in [[category]]:<br><span style='font-size:20px;'>[[value]]</span> 개</span>",
					"bullet": "round",
					"lineThickness": 3,
					"bulletSize": 7,
					"bulletBorderAlpha": 1,
					"bulletColor": "#FFFFFF",
					"useLineColorForBulletBorder": true,
					"bulletBorderThickness": 3,
					"fillAlphas": 0,
					"lineAlpha": 1,
					"title": "수량",
					"valueField": "su",
					"valueAxis": "ValueAxis-2",
					"position" : "right"
				  }],
				  "categoryField": "name",
				  "categoryAxis": {
					"gridPosition": "start",
					"axisAlpha": 0,
					"tickLength": 0
				  },
				  "export": {
					"enabled": true
				  },
                "legend": {
					"enabled": true,
					"align": "center",
					"autoMargins": false,
					"bottom": 0,
					"top": 0,
					"left": 0,
					"right": 0,
					"verticalGap": 0,
                    "align": "center",
                    "markerType": "circle",
					"balloonText" : "[[title]]<br><span style='font-size:14px'><b>[[value]]</b> ([[percents]]%)</span>"
                }
			});

			break;

		case "chart8" :			//매입현황

			var chart = AmCharts.makeChart("chart8", {
			   "theme": "dark",
				"type": "serial",
				"dataProvider": AmCharts.loadJSON("http://www.erpia.net/include/JSon_Proc_graph.asp?kind=meaip_7&value_kind=meaip_7&admin_code=" + admin_code + "&swm_gu=" + gu),
				"startDuration": 1,
				"marginTop": 30,
				"prefixesOfBigNumbers": [
					{
						"number": 10000,
						"prefix": ""
					}
				],
				"valueAxes": [
					{
						"id": "ValueAxis-1",
						//"title": "금액",
						"titleRotation": 0,
						"usePrefixes": true
					},
					{
						"id": "ValueAxis-2",
						//"title": "수량",
						"titleRotation": 0,
						"position": "right"
					}
				],
				"allLabels": [
					{
						"id": "ValueAxis-1",
						"text": "금액(원)",
						"bold": true,
						"size": 12,
						"x": 20,
						"y": 0
					},
					{
						"id": "ValueAxis-2",
						"text": "수량(개)",
						"bold": true,
						"size": 12,
						"align": "right",
						"x": "98%",
						"y": 0
					}
				],
				"graphs": [{
//					"balloonText": "수량: <b>[[value]]</b>",
					"balloonText": "<span style='font-size:12px;'>[[title]] in [[category]]:<br><span style='font-size:20px;'>[[value]]</span> 개</span>",
					"fillAlphas": 0.9,
					"lineAlpha": 0.2,
					"title": "수량",
					"type": "column",
					"valueAxis": "ValueAxis-2",
					"valueField": "su"
				}, {
//					"balloonText": "금액: <b>[[value]]</b>",
					"balloonText": "<span style='font-size:12px;'>[[title]] in [[category]]:<br><span style='font-size:20px;'>[[value]]</span> 원</span>",
					"fillAlphas": 0.9,
					"lineAlpha": 0.2,
					"title": "금액",
					"type": "column",
					"clustered":false,
					"columnWidth":0.5,
					"valueAxis": "ValueAxis-1",
					"valueField": "value"
				}],
				"plotAreaFillAlphas": 0.1,
				"categoryField": "name",
				"categoryAxis": {
					"gridPosition": "start",
					"autoRotateAngle" : 0,
					"autoRotateCount": 1,
				},
				"export": {
					"enabled": true
				 },
                "legend": {
					"enabled": true,
					"autoMargins": false,
					"bottom": 0,
					"top": 0,
					"left": 0,
					"right": 0,
					"verticalGap": 0,
                    "align": "center",
                    "markerType": "circle",
					"balloonText" : "[[title]]<br><span style='font-size:14px'><b>[[value]]</b> ([[percents]]%)</span>"
                }
			});

			break;

		case "chart9" :			//금일 출고 현황
			var chart = AmCharts.makeChart("chart9", {
			  "type": "pie",
			  "theme": "dark",
			  "dataProvider": AmCharts.loadJSON("http://www.erpia.net/include/JSon_Proc_graph.asp?kind=beasonga&value_kind=beasonga&admin_code=" + admin_code + "&swm_gu=" + gu),
			  "titleField": "name",
			  "valueField": "value",
			  "labelRadius": 5,
			  "radius": "42%",
			  "innerRadius": "60%",
//			  "labelText": "[[title]]:[[percents]]%",
			  "labelsEnabled": true,
			  "legend": {
			    "enabled": false,
			    "truncateLabels": 10 // custom parameter
			  },
			  "balloonText": "<span style='font-size:12px;'>[[title]] in [[category]]:<br><span style='font-size:20px;'>[[value]]</span> ([[percents]]%)</span>",
			  "export": {
				"enabled": true
			  }

			});

			//alert("http://www.erpia.net/include/JSon_Proc_graph.asp?kind=beasonga&value_kind=beasonga&admin_code=" + admin_code + "&swm_gu=" + gu);

			break;

		case "chart10" :			//택배사별 통계 

			var chart = AmCharts.makeChart("chart10", {
					"type": "serial",
					"theme": "dark",
					"legend": {
						"horizontalGap": 10,
						"maxColumns": 1,
						"position": "right",
						"useGraphSettings": true,
						"markerSize": 10
					},
					"dataProvider": AmCharts.loadJSON("http://www.erpia.net/include/JSon_Proc_graph.asp?kind=beasong_gu&value_kind=beasong_gu&admin_code=" + admin_code + "&swm_gu=" + gu),
					"valueAxes": [{
						"stackType": "regular",
						"axisAlpha": 0.3,
						"gridAlpha": 0
					}],
					"graphs": [{
//						"balloonText": "<b>[[title]]</b><br><span style='font-size:14px'>[[category]]: <b>[[value]]</b></span>",
						"balloonText": "<span style='font-size:12px;'>[[title]] in [[category]]:<br><span style='font-size:20px;'>[[value]]</span> 건</span>",
						"fillAlphas": 0.8,
						"labelText": "[[value]]",
						"lineAlpha": 0.3,
						"title": "선불",
						"type": "column",
						"color": "#000000",
						"valueField": "value"
					}, {
						"balloonText": "<span style='font-size:12px;'>[[title]] in [[category]]:<br><span style='font-size:20px;'>[[value]]</span> 건</span>",
						//"balloonText": "<b>[[title]]</b><br><span style='font-size:14px'>[[category]]: <b>[[value]]</b></span>",
						"fillAlphas": 0.8,
						"labelText": "[[value]]",
						"lineAlpha": 0.3,
						"title": "착불",
						"type": "column",
						"color": "#000000",
						"valueField": "value1"
					}, {
						"balloonText": "<span style='font-size:12px;'>[[title]] in [[category]]:<br><span style='font-size:20px;'>[[value]]</span> 건</span>",
						//"balloonText": "<b>[[title]]</b><br><span style='font-size:14px'>[[category]]: <b>[[value]]</b></span>",
						"fillAlphas": 0.8,
						"labelText": "[[value]]",
						"lineAlpha": 0.3,
						"title": "신용",
						"type": "column",
						"color": "#000000",
						"valueField": "value2"
					}],
					"categoryField": "name",
					"categoryAxis": {
						"gridPosition": "start",
						"axisAlpha": 0,
						"gridAlpha": 0,
						"position": "left"
					},
					"export": {
						"enabled": true
					 },
				"allLabels": [
					{
						"id": "Label-1",
						"text": temp + sDate + " ~ " + eDate,
						"x": 10,
						"y": 0
					}
				]
			});

			break;

		case "chart11" :			//온 오프라인 비교 매출

			var chart = AmCharts.makeChart("chart11", {
				"type": "pie",
//				"balloonText": "[[title]]<span style='font-size:14px'><b>[[value]]</b> ([[percents]]%)</span>",
				"balloonText": "<span style='font-size:12px;'>[[title]] in [[category]]:<br><span style='font-size:20px;'>[[value]]</span> ([[percents]]%)</span>",
				"minRadius": 100,
				"labelText": "[[title]]: [[percents]]%",
				"titleField": "name",
				"valueField": "value",
				"fontSize": 12,
				"theme": "dark",
			    "labelsEnabled": true,
			    "legend": {
			      "enabled": false,
			      "truncateLabels": 10 // custom parameter
			    },
				"allLabels": [
					{
						"id": "Label-1",
						"text": temp + sDate + " ~ " + eDate,
						"x": 6,
						"y": 280
					}
				],
				"balloon": {},
				"titles": [],
				"labelRadius": 1,
				 dataProvider: AmCharts.loadJSON("http://www.erpia.net/include/JSon_Proc_graph.asp?kind=meachul_onoff&value_kind=meachul_onoff&admin_code=" + admin_code + "&swm_gu=" + gu)
			});

			break;

		case "chart12" :			//매출 반품 현황

			var chart = AmCharts.makeChart("chart12", {
				 "type": "serial",
			  "addClassNames": true,
			  "theme": "dark",
			  "autoMargins": true,
			  "marginTop": 30,
			  "balloon": {
				"adjustBorderColor": false,
				"horizontalPadding": 10,
				"verticalPadding": 8,
				"color": "#ffffff"
			  },
				"prefixesOfBigNumbers": [
							{
								"number": 10000,
								"prefix": ""
							}
				],
				"dataProvider": AmCharts.loadJSON("http://www.erpia.net/include/JSon_Proc_graph.asp?kind=banpum&value_kind=banpum&admin_code=" + admin_code + "&swm_gu=" + gu),
				"valueAxes": [
						{
							"id": "ValueAxis-1",
							//"title": "금액",
							"titleRotation": 0,
							"usePrefixes": true,
							"position": "left"
						},
						{
							"id": "ValueAxis-2",
							//"title": "수량",
							"titleRotation": 0,
							"position": "right"
						}
					],
				"allLabels": [
					{
						"id": "ValueAxis-1",
						"text": "금액(원)",
						"bold": true,
						"size": 12,
						"x": 20,
						"y": 0
					},
					{
						"id": "ValueAxis-2",
						"text": "수량(개)",
						"bold": true,
						"size": 12,
						"align": "right",
						"x": "98%",
						"y": 0
					}
				],
				  "startDuration": 1,
				  "graphs": [{
					"id": "graph1",
					"alphaField": "alpha",
					"balloonText": "<span style='font-size:12px;'>[[title]] in [[category]]:<br><span style='font-size:20px;'>[[value]]</span> 원</span>",
					"fillAlphas": 1,
					"title": "금액",
					"type": "column",
					"valueField": "value",
					"dashLengthField": "dashLengthColumn",
					"ValueAxis": "ValueAxis-1"
				  }, {
					"id": "graph2",
					"balloonText": "<span style='font-size:12px;'>[[title]] in [[category]]:<br><span style='font-size:20px;'>[[value]]</span> 개</span>",
					"bullet": "round",
					"lineThickness": 3,
					"bulletSize": 7,
					"bulletBorderAlpha": 1,
					"bulletColor": "#FFFFFF",
					"useLineColorForBulletBorder": true,
					"bulletBorderThickness": 3,
					"fillAlphas": 0,
					"lineAlpha": 1,
					"title": "수량",
					"valueField": "su",
					"valueAxis": "ValueAxis-2",
					"position" : "right"
				  }],
				  "categoryField": "name",
				  "categoryAxis": {
					"gridPosition": "start",
					"axisAlpha": 0,
					"tickLength": 0
				  },
				  "export": {
					"enabled": true
				  },
                "legend": {
					"enabled": true,
					"autoMargins": false,
					"bottom": 0,
					"top": 0,
					"left": 0,
					"right": 0,
					"verticalGap": 0,
                    "align": "center",
                    "markerType": "circle",
					"balloonText" : "[[title]]<br><span style='font-size:14px'><b>[[value]]</b> ([[percents]]%)</span>"
                }
			});

			break;

		case "chart13" :			//상품별 매출 반품 건수/ 반품액 Top 5

			var chart = AmCharts.makeChart("chart13", {
				"type": "serial",
				 "theme": "dark",
				"categoryField": "name",
				"rotate": true,
				"startDuration": 1,
				"autoMarginOffset": 40,
				"autoMargins": false,
				"marginBottom": 40,
				"marginRight": 40,
				"marginTop": 40,
				"marginLeft": 20,
				"categoryAxis": {
					"gridPosition": "middle",
					"position": "left",
					"inside": true,
					"labelFunction": function(label) {
					  if (label.length > 10)
						return label.substr(0, 10) + '...';
					  return label;
					}
				},
				"trendLines": [],
				"graphs": [
					{
					"fillAlphas": 0.9,
					"lineAlpha": 0.2,
					"title": "금액",
					"type": "column",
					"valueAxis": "ValueAxis-1",
					"balloonText": "<span style='font-size:12px;'>[[title]] in [[category]]:<br><span style='font-size:20px;'>[[value]]</span> 원</span>",
					"valueField": "value"
				},{
					"bullet": "square",
					"bulletBorderAlpha": 1,
					"bulletBorderThickness": 1,
					"bulletSize": 16,
//					"id": "AmGraph-2",
					"valueAxis": "ValueAxis-2",
					"lineThickness": 3,
					"title": "수량",
					"balloonText": "<span style='font-size:12px;'>[[title]] in [[category]]:<br><span style='font-size:20px;'>[[value]]</span> 개</span>",
					"valueField": "su"
				}],
				"guides": [],
				"prefixesOfBigNumbers": [
					{
						"number": 10000,
						"prefix": ""
					}
				],
				"valueAxes": [
					{
						"id": "ValueAxis-1",
						"position": "top",
						"title": "",
						"axisAlpha": 0,
						"usePrefixes": true
					},
					{
						"id": "ValueAxis-2",
						"title": "",
						"usePrefixes": true,
						"axisAlpha": 0,
						"position": "bottom"
					}
				],
				"allLabels": [
					{
						"id": "ValueAxis-1",
						"text": "금액(원)",
						"bold": true,
						"size": 12,
						"x": 20,
						"y": 0
					},
					{
						"id": "ValueAxis-2",
						"text": "수량(개)",
						"bold": true,
						"size": 12,
						"align": "right",
						"x": 80,
						"y": "95%"
					}
				],
				"balloon": {},
				"titles": [],
				"dataProvider": AmCharts.loadJSON("http://www.erpia.net/include/JSon_Proc_graph.asp?kind=banpum_top5&value_kind=banpum_top5&admin_code=" + admin_code + "&swm_gu=" + gu),
				"export": {
					"enabled": true
				 },
                "legend": {
					"enabled": true,
					"autoMargins": false,
					"bottom": 0,
					"top": 0,
					"left": 0,
					"right": 0,
					"verticalGap": 0,
                    "align": "center",
                    "markerType": "circle",
					"balloonText" : "[[title]]<br><span style='font-size:14px'><b>[[value]]</b> ([[percents]]%)</span>"
                }
			});

			break;

		case "chart14" :			//CS 컴플레인 현황

			var chart = AmCharts.makeChart("chart14", {
				"type": "pie",
//				"balloonText": "[[title]]<span style='font-size:14px'><b>[[value]]</b> ([[percents]]%)</span>",
				"balloonText": "<span style='font-size:12px;'>[[title]] in [[category]]:<br><span style='font-size:20px;'>[[value]]</span> ([[percents]]%)</span>",
				"minRadius": 100,
				"labelText": "[[title]]: [[percents]]%",
				"titleField": "name",
				"valueField": "value",
				"fontSize": 12,
				"theme": "dark",
			    "labelsEnabled": true,
			    "legend": {
			      "enabled": false,
			      "truncateLabels": 10 // custom parameter
			    },
				"allLabels": [
					{
						"id": "Label-1",
						"text": temp + sDate + " ~ " + eDate,
						"x": 6,
						"y": 280
					}
				],
				"balloon": {},
				"titles": [],
				"labelRadius": 5,
				 dataProvider: AmCharts.loadJSON("http://www.erpia.net/include/JSon_Proc_graph.asp?kind=meachul_cs&value_kind=meachul_cs&admin_code=" + admin_code + "&swm_gu=" + gu)
			});

			break;

		case "chart15" :			//상품별 매입건수/매입액 top5

			var chart = AmCharts.makeChart("chart15", {
				"type": "serial",
				 "theme": "dark",
				"categoryField": "name",
				"rotate": true,
				"startDuration": 1,
				"autoMarginOffset": 40,
				"autoMargins": false,
				"marginBottom": 40,
				"marginRight": 40,
				"marginTop": 40,
				"marginLeft": 20,
				"categoryAxis": {
					"gridPosition": "middle",
					"position": "left",
					"inside": true,
					"labelFunction": function(label) {
					  if (label.length > 10)
						return label.substr(0, 10) + '...';
					  return label;
					}
				},
				"trendLines": [],
				"graphs": [
					{
					"fillAlphas": 0.9,
					"lineAlpha": 0.2,
					"title": "금액",
					"type": "column",
					"valueAxis": "ValueAxis-1",
					"balloonText": "<span style='font-size:12px;'>[[title]] in [[category]]:<br><span style='font-size:20px;'>[[value]]</span> 원</span>",
					"valueField": "value"
				},{
					"bullet": "square",
					"bulletBorderAlpha": 1,
					"bulletBorderThickness": 1,
					"bulletSize": 16,
//					"id": "AmGraph-2",
					"valueAxis": "ValueAxis-2",
					"lineThickness": 3,
					"title": "수량",
					"balloonText": "<span style='font-size:12px;'>[[title]] in [[category]]:<br><span style='font-size:20px;'>[[value]]</span> 개</span>",
					"valueField": "su"
				}],
				"guides": [],
				"prefixesOfBigNumbers": [
					{
						"number": 10000,
						"prefix": ""
					}
				],
				"valueAxes": [
					{
						"id": "ValueAxis-1",
						"position": "top",
						"title": "",
						"axisAlpha": 0,
						"usePrefixes": true
					},
					{
						"id": "ValueAxis-2",
						"title": "",
						"usePrefixes": true,
						"axisAlpha": 0,
						"position": "bottom"
					}
				],
				"allLabels": [
					{
						"id": "ValueAxis-1",
						"text": "금액(원)",
						"bold": true,
						"size": 12,
						"x": 20,
						"y": 0
					},
					{
						"id": "ValueAxis-2",
						"text": "수량(개)",
						"bold": true,
						"size": 12,
						"align": "right",
						"x": 80,
						"y": "95%"
					}
				],
				"balloon": {},
				"titles": [],
				"dataProvider": AmCharts.loadJSON("http://www.erpia.net/include/JSon_Proc_graph.asp?kind=meaip_commgoods&value_kind=meaip_commgoods&admin_code=" + admin_code + "&swm_gu=" + gu),
				"export": {
					"enabled": true
				 },
                "legend": {
					"enabled": true,
					"autoMargins": false,
					"bottom": 0,
					"top": 0,
					"left": 0,
					"right": 0,
					"verticalGap": 0,
                    "align": "center",
                    "markerType": "circle",
					"balloonText" : "[[title]]<br><span style='font-size:14px'><b>[[value]]</b> ([[percents]]%)</span>"
                }
			});

			break;

		case "chart16" :			//재고회전율top5

			var chart = AmCharts.makeChart("chart16", {
				"type": "serial",
				 "theme": "dark",
				"categoryField": "name",
				"rotate": true,
				"startDuration": 1,
				"autoMarginOffset": 25,
				"autoMargins": true,
				"marginBottom": 25,
				"marginRight": 25,
				"margintop": 25,
				"marginleft": 25,
				"categoryAxis": {
					"gridPosition": "start",
					"position": "left"
				},
				"trendLines": [],
				"graphs": [
					{
					"fillAlphas": 0.9,
					"lineAlpha": 0.2,
					"title": "회전율",
					"type": "column",
					"valueAxis": "ValueAxis-1",
					"balloonText": "<span style='font-size:12px;'>[[title]] in [[category]]:<br><span style='font-size:20px;'>[[value]]</span> %</span>",
					"valueField": "value"
				},{
					"bullet": "square",
					"bulletBorderAlpha": 1,
					"bulletBorderThickness": 1,
					"bulletSize": 16,
//					"id": "AmGraph-2",
					"valueAxis": "ValueAxis-2",
					"lineThickness": 3,
					"title": "소진 기준일",
					"balloonText": "<span style='font-size:12px;'>[[title]] in [[category]]:<br><span style='font-size:20px;'>[[value]]</span> 일</span>",
					"valueField": "su"
				}],
				"guides": [],
				"prefixesOfBigNumbers": [
					{
						"number": 10000,
						"prefix": ""
					}
				],
				"valueAxes": [
					{
						"id": "ValueAxis-1",
						"position": "top",
						"title": "회전율",
						"axisAlpha": 0,
						"usePrefixes": true
					},
					{
						"id": "ValueAxis-2",
						"title": "소진일",
						"usePrefixes": true,
						"axisAlpha": 0,
						"position": "bottom"
					}
				],
				"allLabels": [],
				"balloon": {},
				"titles": [],
				"dataProvider": AmCharts.loadJSON("http://www.erpia.net/include/JSon_Proc_graph.asp?kind=JeGo_TurnOver&value_kind=JeGo_TurnOver&admin_code=" + admin_code + "&swm_gu=" + gu),
				"export": {
					"enabled": true
				 }
			});

			break;

		case "chart17" :			//출고현황

			var chart = AmCharts.makeChart("chart17", {
			  "type": "serial",
			  "addClassNames": true,
			  "theme": "dark",
			  "autoMargins": true,
			  "marginTop": 30,
			  "balloon": {
				"adjustBorderColor": false,
				"horizontalPadding": 10,
				"verticalPadding": 8,
				"color": "#ffffff"
			  },
				"prefixesOfBigNumbers": [
							{
								"number": 10000,
								"prefix": ""
							}
				],
				"dataProvider": AmCharts.loadJSON("http://www.erpia.net/include/JSon_Proc_graph.asp?kind=beasongb&value_kind=beasongb&admin_code=" + admin_code + "&swm_gu=" + gu),
				"valueAxes": [
						{
							"id": "ValueAxis-1",
							//"title": "건수",
							"titleRotation": 0,
							"usePrefixes": true,
							"position": "left"
						}
					],
				"allLabels": [
					{
						"id": "ValueAxis-1",
						"text": "건수",
						"bold": true,
						"size": 12,
						"x": 20,
						"y": 0
					}			
				],
				  "startDuration": 1,
				  "graphs": [{
					"id": "graph1",
					"alphaField": "alpha",
					"balloonText": "<span style='font-size:12px;'>[[title]] in [[category]]:<br><span style='font-size:20px;'>[[value]]</span> 건</span>",
					"fillAlphas": 1,
					"title": "건수",
					"type": "column",
					"valueField": "value",
					"dashLengthField": "dashLengthColumn",
					"ValueAxis": "ValueAxis-1"
				  }],
				  "categoryField": "name",
				  "categoryAxis": {
					"gridPosition": "start",
					"axisAlpha": 0,
					"tickLength": 0
				  },
				  "export": {
					"enabled": true
				  }
			});

			break;

		default :
			break;
	
	}

	if (!chart.dataProvider[0])
	{
		$("#loading2").html("정보없음");
	}
}