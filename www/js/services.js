angular.module('starter.services', [])

//InnerHtml을 사용하기 위한 compiler
.directive('compileData', function ( $compile ) {
	return {
		scope: true,
		link: function ( scope, element, attrs ) {
			var elmnt;
			attrs.$observe( 'template', function ( myTemplate ) {
				if ( angular.isDefined( myTemplate ) ) {
					// compile the provided template against the current scope
					elmnt = $compile( myTemplate )( scope );

					element.html(""); // dummy "clear"

					element.append( elmnt );
				}
			});
		}
	};
})

.factory('loginService', function($http, $q, $cordovaToast, ERPiaAPI){
	var comInfo = function(kind, Admin_Code, G_id, G_Pass){
		if(kind == 'scm_login'){
			var url = ERPiaAPI.url + '/Json_Proc_MyPage_Scm.asp';
			var data = 'kind=' + kind + '&Admin_Code=' + Admin_Code + '&G_id=' + G_id + '&G_Pass=' + G_Pass;
			return $http.get(url + '?' + data)
				.then(function(response){
					if(typeof response.data == 'object'){
						return response;
					}else{
						return $q.reject(response);
					}
				},function(response){
					return $q.reject(response);
				});
		}else if(kind == 'ERPiaLogin'){
			var url = ERPiaAPI.url + '/JSon_Proc_MyPage_Scm_Manage.asp';
			var data = 'kind=' + kind + '&Admin_Code=' + Admin_Code + '&uid=' + G_id + '&pwd=' + G_Pass;
			return $http.get(url + '?' + data)
				.then(function(response){
					if(typeof response.data == 'object'){
						return response;
					}else{
						return $q.reject(response);
					}
				},function(response){
					return $q.reject(response);
				});
		}else if(kind =='erpia_ComInfo'){
			var url = ERPiaAPI.url + '/JSon_Proc_MyPage_Scm_Manage.asp';
			var data = 'kind=' + kind + '&Admin_Code=' + Admin_Code;
			return $http.get(url + '?' + data)
				.then(function(response){
					if(typeof response.data == 'object'){
						return response;
					}else{
						return $q.reject(response);
					}
				},function(response){
					return $q.reject(response);
				});
		}else if(kind == 'ERPia_Ger_Login'){
			var url = ERPiaAPI.url + '/Json_Proc_MyPage_Scm.asp';
			var data = 'kind=' + kind + '&Admin_Code=' + Admin_Code + '&id=' + G_id + '&pwd=' + G_Pass;
			return $http.get(url + '?' + data)
				.then(function(response){
					if(typeof response.data == 'object'){
						return response;
					}else{
						if(ERPiaAPI.toast == 'Y') $cordovaToast.show('유효한 업체코드가 아닙니다.', 'long', 'center');
						else alert('유효한 업체코드가 아닙니다.');
						return $q.reject(response);
					}
				},function(response){
					if(ERPiaAPI.toast == 'Y') $cordovaToast.show('유효한 업체코드가 아닙니다.', 'long', 'center');
					else alert('유효한 업체코드가 아닙니다.');
					return $q.reject(response);
				});
		}
	}
	return{
		comInfo: comInfo
	}
})
.factory('ERPiaInfoService', function($http, ERPiaAPI){
	var ERPiaInfo = function(kind, Admin_Code, sDate, eDate){
		var url = ERPiaAPI.url + '/Json_Proc_MyPage_Scm.asp';
		var data = 'kind=' + kind + '&Admin_Code=' + Admin_Code + '&sDate=' + sDate + '&eDate=' + eDate;
		return $http.get(url + '?' + data);
	}
	return{
		ERPiaInfo: ERPiaInfo
	}
})

.factory('scmInfoService', function($http, ERPiaAPI){
	var scmInfo = function(kind, BaljuMode, Admin_Code, GerCode, FDate, TDate){
		var url = ERPiaAPI.url + '/JSon_Proc_Multi_Lhk.asp';
		var data = 'Value_Kind=list&kind=' + kind + '&BaljuMode=' + BaljuMode + '&Admin_Code=' + Admin_Code + '&GerCode=' + GerCode;
		data += '&FDate=' + FDate + '&TDate=' + TDate;
		return $http.get(url + '?' + data);
	}
	return{
		scmInfo: scmInfo
	}
})
.factory('IndexService', function($http, $q, ERPiaAPI){
	var dashBoard = function(kind, Admin_Code, sDate, eDate){
		var url = ERPiaAPI.url + '/Json_Proc_MyPage_Scm.asp';
		var data = 'kind=' + kind + '&Admin_Code=' + Admin_Code + '&sDate=' + sDate + '&eDate=' + eDate;
		return $http.get(url + '?' + data)
			.then(function(response){
				if(typeof response.data == 'object'){
					return response;
				}else{
					return $q.reject(response);
				}
			},function(response){
				return $q.reject(response);
			});
	}
	return{
		dashBoard: dashBoard
	}
})
.factory('CertifyService', function($http, $cordovaToast, ERPiaAPI){
	var url = ERPiaAPI.url + '/Json_Proc_MyPage_Scm.asp';
	var certify = function(Admin_Code, loginType, ID, sms_id, sms_pwd, sendNum, rec_num){
		var rndNum = Math.floor(Math.random() * 1000000) + 1;
		if (rndNum < 100000) rndNum = '0' + rndNum;
		console.log(rndNum);
		var data = 'Kind=mobile_Certification&Value_Kind=list' + '&Admin_Code=' + Admin_Code + '&ID=' + ID;
		data += '&Certify_Code=' + rndNum + '&loginType=' + loginType;
		return $http.get(url + '?' + data)
		.success(function(response){
			if(ERPiaAPI.toast == 'Y') $cordovaToast.show('인증코드를 전송했습니다.', 'long', 'center');

			if (response.list[0].Result == '1'){
				var url = ERPiaAPI.url + '/SCP.asp';
				var data = 'sms_id=' + sms_id + '&sms_pwd=' + sms_pwd + '&send_num=' + sendNum + '&rec_num=' + rec_num;
				data += '&rndNum=' + rndNum + '&SendType=mobile_Certification';
				return $http.get(url + '?' + data);
				//location.href="#/app/certification";
			}else{
				if(ERPiaAPI.toast == 'Y') $cordovaToast.show('전송실패', 'long', 'center');
				else console.log('전송실패');
			}
		})
	}
	var check = function(Admin_Code, loginType, ID, Input_Code){
		var data ='';
		if(loginType == 'S' || loginType == 'N'){
			data = 'Kind=check_Certification&Value_Kind=list' + '&Admin_Code=' + Admin_Code + '&ID=' + ID;
			data += '&Input_Code=' + Input_Code + '&loginType=' + loginType;
		}else if(loginType=='E'){
			url = ERPiaAPI.url + '/JSon_Proc_MyPage_Scm_Manage.asp';
			data = 'Kind=ERPiaCertify' + '&Admin_Code=' + Admin_Code + '&uid=' + ID;
		}
		return $http.get(url + '?' + data)
		.success(function(response){
			if (response.list[0].Result == '1'){
				switch(loginType){
					case 'S': location.href = "#/app/scmhome"; break;
					case 'E': location.href = "#/app/slidingtab"; break;
					case 'N': location.href = "#/app/main"; break;
				}
			}else{
				if(ERPiaAPI.toast == 'Y') $cordovaToast.show(response.list[0].Comment, 'long', 'center');
				else alert(response.list[0].Comment);
			}
		})
	}
	return{
		certify: certify,
		check: check
	}
})
.factory('tradeDetailService', function($http, $q, ERPiaAPI) {
	return{
		tradeList: function(Admin_Code, GerCode){
			var url = ERPiaAPI.url + '/JSon_Proc_MyPage_Scm.asp';
			var data = 'Kind=select_Trade' + '&Admin_Code=' + Admin_Code + '&GerCode=' + GerCode;
			return $http.get(url + '?' + data)
				.then(function(response){
					if(typeof response.data == 'object'){
						return response.data;
					}else{
						return $q.reject(response.data);
					}
				}, function(response){
					return $q.reject(response.data);
				})
		}, readDetail: function(Admin_Code, Sl_No){
			var url = ERPiaAPI.url + '/JSon_Proc_MyPage_Scm.asp';
			var data = 'Kind=select_Trade_Detail' + '&Admin_Code=' + Admin_Code + '&Sl_No=' + Sl_No;
			return $http.get(url + '?' + data)
				.then(function(response){
					if(typeof response.data == 'object'){
						var tot_Ea = 0;
						for(var i=0; i<response.data.list.length; i++){
							tot_Ea += Number(((response.data.list[i].G_ea1)?response.data.list[0].G_ea1:0));
							tot_Ea += Number(((response.data.list[i].G_ea2)?response.data.list[0].G_ea2:0));
							tot_Ea += Number(((response.data.list[i].G_ea3)?response.data.list[0].G_ea3:0));
							tot_Ea += Number(((response.data.list[i].G_ea4)?response.data.list[0].G_ea4:0));
							tot_Ea += Number(((response.data.list[i].G_ea5)?response.data.list[0].G_ea5:0));
							tot_Ea += Number(((response.data.list[i].G_ea6)?response.data.list[0].G_ea6:0));
							tot_Ea += Number(((response.data.list[i].G_ea7)?response.data.list[0].G_ea7:0));
							tot_Ea += Number(((response.data.list[i].G_ea8)?response.data.list[0].G_ea8:0));
							tot_Ea += Number(((response.data.list[i].G_ea9)?response.data.list[0].G_ea9:0));
							tot_Ea += Number(((response.data.list[i].G_ea10)?response.data.list[0].G_ea10:0));
							response.data.list[i].G_tot_Ea = tot_Ea;
						}
						console.log(response.data);
						return response.data;
					}else{
						return $q.reject(response.data);
					}
				}, function(response){
					return $q.reject(response.data);
				})
		}
	};
})
.factory('NoticeService', function($http, $q, ERPiaAPI){
	return{
		//http://erpia2.godohosting.com/erpia_update/img
		getList: function(){
		var url = ERPiaAPI.url + '/JSon_Proc_MyPage_Scm_Manage.asp';
		var data = 'Kind=myPage_Notice&Value_Kind=encode&cntRow=10';
		return $http.get(url + '?' + data)
			.then(function(response){
				if(typeof response.data == 'object'){
					for(var i=0; i<response.data.list.length; i++){
						oldContent = response.data.list[i].content;
						response.data.list[i].content = oldContent
							.replace(/http:\/\/erpia2.godohosting.com\/erpia_update\/img\/notice\/phj/g, ERPiaAPI.imgUrl + '/notice/phj')
							.replace(/&quot;/g,'')
							.replace(/<img src=/g, '<img width=100% src=');
					}
					return response.data;
				}else{
					return $q.reject(response.data);
				}
			}, function(response){
				return $q.reject(response.data);
			})
		}
	};
})
.factory('statisticService', function($http, $q, ERPiaAPI) {
	var titles =  [{Idx:0, title:"홈"}
				, {Idx:1, title:"거래처별 매입 점유율 TOP 10"}
				, {Idx:2, title:"사이트별 매출 점유율"}
				, {Idx:3, title:"브랜드별 매출 TOP5"}
				, {Idx:4, title:"상품별 매출 TOP5"}
				, {Idx:5, title:"매출이익증감율"}
				, {Idx:6, title:"매출 실적 추이"}
				, {Idx:7, title:"매입 현황"}
				, {Idx:8, title:"재고 회전율 TOP5"}
				, {Idx:9, title:"택배사별 구분 건수 통계"}
				, {Idx:10, title:"온오프라인 비교 매출"}
				, {Idx:11, title:"매출반품현황"}
				, {Idx:12, title:"상품별 매출 반품 건수/반품액 TOP5"}
				, {Idx:13, title:"CS 컴플레인 현황"}
				, {Idx:14, title:"상품별 매입건수/매입액 TOP5"}
				, {Idx:15, title:"최근배송현황"}
				, {Idx:16, title:"배송현황"}];
	return{
		all : function(kind, mode, Admin_Code, loginType, G_Id) {
			var url = ERPiaAPI.url + '/JSon_Proc_MyPage_Scm.asp';
			var data = 'Value_Kind=list&Kind=' + kind + '&mode=' + mode + '&Admin_Code=' + Admin_Code + '&loginType=' + loginType + '&G_Id=' + G_Id;
			return $http.get(url + '?' + data)
				.then(function(response) {
					if(typeof response.data == 'object'){
						for(var i=0; i<response.data.list.length; i++){
							switch(response.data.list[i].Idx){
								case "1": response.data.list[i].title = titles[1].title; break;
								case "2": response.data.list[i].title = titles[2].title; break;
								case "3": response.data.list[i].title = titles[3].title; break;
								case "4": response.data.list[i].title = titles[4].title; break;
								case "6": response.data.list[i].title = titles[5].title; break;
								case "7": response.data.list[i].title = titles[6].title; break;
								case "8": response.data.list[i].title = titles[7].title; break;
								case "9": response.data.list[i].title = titles[8].title; break;
								case "10": response.data.list[i].title = titles[9].title; break;
								case "11": response.data.list[i].title = titles[10].title; break;
								case "12": response.data.list[i].title = titles[11].title; break;
								case "13": response.data.list[i].title = titles[12].title; break;
								case "14": response.data.list[i].title = titles[13].title; break;
								case "15": response.data.list[i].title = titles[14].title; break;
								case "16": response.data.list[i].title = titles[15].title; break;
								case "17": response.data.list[i].title = titles[16].title; break;
							}
						}
						return response.data.list;	
					}else{
						return $q.reject(response.data);
					}
				}, function(response){
					return $q.reject(response.data);
				})
		},save : function(kind, mode, Admin_Code, loginType, G_Id, statistic){
			var url = ERPiaAPI.url + '/JSon_Proc_MyPage_Scm.asp';
			var data = 'Value_Kind=list&Kind=' + kind + '&mode=' + mode + '&Admin_Code=' + Admin_Code + '&loginType=' + loginType + '&G_Id=' + G_Id + '&statistic=' + statistic;
			return $http.get(url + '?' + data)
				.then(function(response) {
					if(typeof response.data == 'object'){
						return response.data;	
					}else{
						return $q.reject(response.data);
					}
				}, function(response){
					return $q.reject(response.data);
				})
		}, title : function(kind, mode, Admin_Code, loginType, G_Id){
			var url = ERPiaAPI.url + '/JSon_Proc_MyPage_Scm.asp';
			var data = 'Value_Kind=list&Kind=' + kind + '&mode=' + mode + '&Admin_Code=' + Admin_Code + '&loginType=' + loginType + '&G_Id=' + G_Id;
			return $http.get(url + '?' + data)
				.then(function(response) {
					if(typeof response.data == 'object'){
						for(var i=0; i<response.data.list.length; i++){
							switch(response.data.list[i].Idx){
								case "0": response.data.list[i].title = titles[0].title; break;
								case "1": response.data.list[i].title = titles[1].title; break;
								case "2": response.data.list[i].title = titles[2].title; break;
								case "3": response.data.list[i].title = titles[3].title; break;
								case "4": response.data.list[i].title = titles[4].title; break;
								case "6": response.data.list[i].title = titles[5].title; break;
								case "7": response.data.list[i].title = titles[6].title; break;
								case "8": response.data.list[i].title = titles[7].title; break;
								case "9": response.data.list[i].title = titles[8].title; break;
								case "10": response.data.list[i].title = titles[9].title; break;
								case "11": response.data.list[i].title = titles[10].title; break;
								case "12": response.data.list[i].title = titles[11].title; break;
								case "13": response.data.list[i].title = titles[12].title; break;
								case "14": response.data.list[i].title = titles[13].title; break;
								case "15": response.data.list[i].title = titles[14].title; break;
								case "16": response.data.list[i].title = titles[15].title; break;
								case "17": response.data.list[i].title = titles[16].title; break;
							}
						}
						return response.data.list;	
					}else{
						return $q.reject(response.data);
					}
				}, function(response){
					return $q.rejec(response.data);
				})
		}, chart : function(kind, mode, Admin_Code, loginType, G_Id, chart_idx){
			var url = ERPiaAPI.url + '/JSon_Proc_MyPage_Scm.asp';
			var data = 'Value_Kind=list&Kind=' + kind + '&mode=' + mode + '&Admin_Code=' + Admin_Code + '&loginType=' + loginType;
				data += '&G_Id=' + G_Id + '&chart_idx=' + chart_idx;
			return $http.get(url + '?' + data)
				.then(function(response) {
					if(typeof response.data == 'object'){
						return response.data;	
					}else{
						return $q.reject(response.data);
					}
				})
		}
	}
})
.factory('alarmService', function($http, $q, ERPiaAPI){
	var url = ERPiaAPI.url + '/JSon_Proc_MyPage_Scm.asp';
	return{
		select : function(kind, Admin_Code, loginType, G_Id){
			var data = 'Value_Kind=list&Kind=' + kind + '&Admin_Code=' + Admin_Code + '&loginType=' + loginType + '&G_Id=' + G_Id;
			return $http.get(url + '?' + data)
				.then(function(response){
					console.log('response', response);
					if(typeof response.data == 'object'){
						return response.data;
					}else{
						return $q.reject(response.data);
					}
				}, function(response){
					return $q.reject(response.data);
				})
		}, save : function(kind, Admin_Code, loginType, G_Id, alarm){
			var data = 'Value_Kind=list&Kind=' + kind + '&Admin_Code=' + Admin_Code + '&loginType=' + loginType + '&G_Id=' + G_Id + '&alarm=' + alarm;
			return $http.get(url + '?' + data)
				.then(function(response){
					if(typeof response.data == 'object'){
						return response.data;
					}else{
						return $q.reject(response.data);
					}
				}, function(response){
					return $q.reject(response.data);
				})
		}

	}
})
.factory('pushInfoService', function($http, ERPiaAPI){
	var pushInfo = function(Admin_Code, UserId, kind, Mode, UserKey, Token, ChkAdmin, DeviceOS, sDate, eDate){
		var url = ERPiaAPI.url + '/JSon_Proc_MyPage_Scm_Manage.asp';
		var data = 'Admin_Code=' + Admin_Code + '&UserId=' + UserId + '&kind=' + kind + '&Mode=' + Mode + '&UserKey=' + UserKey + '&Token=' + Token 
		data += '&ChkAdmin=' + ChkAdmin + '&DeviceOS=' + DeviceOS + '&sDate=' + sDate + '&eDate=' + eDate;
		console.log(url + '?' + data)
		return $http.get(url + '?' + data);
	}
	return{
		pushInfo: pushInfo
	}
})
.factory('csInfoService', function($http, ERPiaAPI){
	var csInfo = function(Admin_Code, UserId, kind, chkAdmin, comName, writer, subject, tel, sectors, interestTopic, inflowRoute, contents){
		var url = ERPiaAPI.url + '/JSon_Proc_MyPage_Scm_Manage.asp';
		var data = 'Admin_Code=' + Admin_Code + '&UserId=' + UserId + '&kind=' + kind + '&chkAdmin=' + chkAdmin + '&comName=' + comName 
		data += '&writer=' + writer + '&subject=' + subject + '&tel=' + tel + '&sectors=' + sectors + '&interestTopic=' + interestTopic
		data += '&inflowRoute=' + inflowRoute + '&contents=' + contents 
		console.log(url + '?' + data)
		return $http.get(url + '?' + data);
	}
	return{
		csInfo: csInfo
	}
})
.factory('uuidService', function($http, $q, ERPiaAPI){
	return{
		getUUID : function(uuid){
			var url = ERPiaAPI.url + '/JSon_Proc_MyPage_Scm_Manage.asp';
			var data = 'Kind=getUUID&uuid=' + uuid;
			return $http.get(url + '?' + data)
			.then(function(response){
				if(typeof response == 'object'){
					return response.data;
				}else{
					return $q.reject(response.data);
				}
			}, function(response){
				return $q.reject(response.data);
			})
		}, saveUUID : function(uuid, admin_code, loginType, id, pwd, autoLogin_YN){
			var url = ERPiaAPI.url + '/JSon_Proc_MyPage_Scm_Manage.asp';
			var data = 'Kind=saveUUID&uuid=' + uuid + '&admin_code=' + admin_code + '&loginType=' + loginType;
			data += '&id=' + id + '&pwd=' + pwd + '&autoLogin_YN=' + autoLogin_YN;
			return $http.get(url + '?' + data)
			.then(function(response){
				if(typeof response == 'object'){
					return response.data;
				}else{
					return $q.reject(response.data);
				}
			}, function(response){
				return $q.reject(response.data);
			})
		}
	}
})
.factory('TestService', function($http, $q, ERPiaAPI){
	var testInfo = function(Admin_Code, UserId, kind, Mode, Sl_No, GerName, GoodsName, G_OnCode, GoodsCode, GI_Code, sDate, eDate){
		var url = ERPiaAPI.url + '/ERPiaApi_TestProject.asp';
		var data = 'Admin_Code=' + Admin_Code + '&UserId=' + UserId + '&kind=' + kind + '&Mode=' + Mode + '&Sl_No=' + Sl_No 
		data += '&GerName=' + GerName + '&GoodsName=' + GoodsName + '&G_OnCode=' + G_OnCode + '&GoodsCode=' + GoodsCode + '&GI_Code=' + GI_Code
		data += '&sDate=' + sDate + '&eDate=' + eDate 
		console.log(url + '?' + data)
		return $http.get(url + '?' + data);
	}
	return{
		testInfo: testInfo
	}
})
.factory('testLhkServicse', function($http, $q, ERPiaAPI){
	return{
		test: function(){
		var url = ERPiaAPI.url + '/psm/02/html/Graph.asp';
		var data = 'Admin_Code=onz&swm_gu=1&kind=chart7';
		return $http.get(url + '?' + data)
			.then(function(response){
				console.log('testChart', typeof response);
				if(typeof response == 'object'){
					return response.data;
				}else{
					return $q.reject(response.data);
				}
			}, function(response){
				return $q.reject(response.data);
			})
		}
	};
})
.factory('AmChart_Service', function($http, $q, ERPiaAPI){
	var url = ERPiaAPI.url + '/JSon_Proc_graph.asp';
	return{
		scm_Chart: function(Kind, Value_Kind, Admin_Code, swm_gu, Ger_code){
			var data = 'Kind=' + Kind + '&Value_Kind=' + Value_Kind + '&admin_code=' + Admin_Code + '&swm_gu=' + swm_gu + '&Ger_code=' + Ger_code;
			return $http.get(url + '?' + data)
			.then(function(response){
				if(typeof response == 'object'){
					return response.data;
				}else{
					return $q.reject(response.data);
				}
			}, function(response){
				return $q.reject(response.data);
			})
		}, erpia_Chart: function(Kind, Value_Kind, Admin_Code, swm_gu){
			var data = 'Kind=' + Kind + '&Value_Kind=' + Value_Kind + '&admin_code=' + Admin_Code + '&swm_gu=' + swm_gu;
			return $http.get(url + '?' + data)
			.then(function(response){
				if(typeof response == 'object'){
					return response.data;
				}else{
					return $q.reject(response.data);
				}
			}, function(response){
				return $q.reject(response.data);
			}) 
		}
	}
	ERPiaApi_url + "/JSon_Proc_graph.asp?kind=meaip_jem&value_kind=meaip_jem&admin_code=" + admin_code + "&swm_gu=" + gu
})
.factory('publicFunction', function($ionicHistory){
	return{
		goHome: function(userType){
			$ionicHistory.nextViewOptions({
				disableBack: true
			});
			switch(userType){
				case 'ERPia': location.href = '#/app/slidingtab'; break;
				case 'SCM' : location.href = '#/app/scmhome'; break;
				case 'Geust': location.href = '#/app/sample/Main'; break;
			}
		}
	}
})
.factory('Chats', function() {
	// Might use a resource here that returns a JSON array

	// Some fake testing data
	var chats = [{
		id : 0,
		name : 'Ben Sparrow',
		lastText : 'You on your way?',
		face : 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
	}, {
		id : 1,
		name : 'Max Lynx',
		lastText : 'Hey, it\'s me',
		face : 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
	}, {
		id : 2,
		name : 'Adam Bradleyson',
		lastText : 'I should buy a boat',
		face : 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
	}, {
		id : 3,
		name : 'Perry Governor',
		lastText : 'Look at my mukluks!',
		face : 'https://pbs.twimg.com/profile_images/598205061232103424/3j5HUXMY.png'
	}, {
		id : 4,
		name : 'Mike Harrington',
		lastText : 'This is wicked good ice cream.',
		face : 'https://pbs.twimg.com/profile_images/578237281384841216/R3ae1n61.png'
	}];

	return {
		all : function() {
			return chats;
		},
		remove : function(chat) {
			chats.splice(chats.indexOf(chat), 1);
		},
		get : function(chatId) {
			for (var i = 0; i < chats.length; i++) {
				if (chats[i].id === parseInt(chatId)) {
					return chats[i];
				}
			}
			return null;
		}
	};
})

/*매출전표 날짜 조회 서비스*/
// .factory('ERPiaMCSearchService', function($http, ERPiaAPI){
// 	var ERPiaMCSearchData = function(Admin_Code, UserId, kind, Mode, Sl_No, sDate, eDate, GerCode){
// 		var url = ERPiaAPI.url + '/ERPiaApi_TestProject.asp';
// 		var data = 'Admin_Code=' + Admin_Code + '&UserId=' + UserId + '&Kind=' + kind + '&Mode=' + Mode + '&Sl_No=' + Sl_No
// 		data += '&sDate=' + sDate + '&eDate=' + eDate + '&GerCode=' + GerCode
// 		return $http.get(url + '?' + data);
// 	}
// 	return{
// 		ERPiaMCSearchData: ERPiaMCSearchData
// 	}
// })

.factory('ERPiaMCSearchService', function($http, ERPiaAPI){
return{
		Select_Date: function(Admin_Code, UserId, kind, Mode, Sl_No, sDate, eDate){
			console.log("ERPiaMCSearchService and Select_Date");
		var url = ERPiaAPI.url + '/ERPiaApi_TestProject.asp';
		var data = 'Admin_Code=onz&UserId=pikapika&Kind=' + kind + '&Mode=' + Mode + '&Sl_No=' + Sl_No
		// var data = 'Admin_Code=' + Admin_Code + '&UserId=' + UserId + '&Kind=' + kind + '&Mode=' + Mode + '&Sl_No=' + Sl_No
			data += '&sDate=' + sDate + '&eDate=' + eDate
		return $http.get(url + '?' + data)
			.then(function(response){
				console.log('ERPiaMCSearchService(Select_Date)=', response);
				if(typeof response == 'object'){
					console.log('=', response.data);
					return response.data;
				}else{
					return $q.reject(response.data);
				}
			}, function(response){
				return $q.reject(response.data);
			})

		},	Select_BeforeAmt: function(Admin_Code, UserId, kind, Mode, Sl_No, sDate, eDate, GerCode){
			console.log("ERPiaMCSearchService and Select_BeforeAmt");
		var url = ERPiaAPI.url +'/ERPiaApi_TestProject.asp';
		var data = 'Admin_Code=' + Admin_Code + '&UserId=' + UserId + '&Kind=' + kind + '&Mode=' + Mode + '&Sl_No=' + Sl_No
			data += '&sDate=' + sDate + '&eDate=' + eDate + '&GerCode=' + GerCode
		return $http.get(url + '?' + data)
			.then(function(response){
				console.log('ERPiaMCSearchService(Select_BeforeAmt)=', response);
				if(typeof response == 'object'){
					console.log('=', response.data);
					return response.data;
				}else{
					return $q.reject(response.data);
				}
			}, function(response){
				return $q.reject(response.data);
			})
		
		}

	};
})


/*매출전표 상세 조회 서비스*/

.factory('ERPiaMCSearchDetailService', function($http, ERPiaAPI){
	var ERPiaMCSearchDetailData = function(Admin_Code, UserId, kind, Sl_No){
		var url = ERPiaAPI.url + '/ERPiaApi_TestProject.asp';
		 var data = 'Admin_Code=onz&UserId=pikapika&Kind=' + kind + '&Sl_No=' + Sl_No
		// var data = 'Admin_Code=' + Admin_Code + '&UserId=' + UserId + '&Kind=' + kind + '&Sl_No=' + Sl_No
		return $http.get(url + '?' + data);
	}
	return{
		ERPiaMCSearchDetailData: ERPiaMCSearchDetailData
	}
})

/*매출전표 삭제 서비스 ERPiaMCDeleteService*/
//$scope.loginData.Admin_Code, $scope.loginData.UserId, $scope.reqparams.Kind, $scope.reqparams.Mode, $scope.reqparams.Sl_No
.factory('ERPiaMCDeleteService', function($http, ERPiaAPI){
	var ERPiaMCDeleteResult = function(Admin_Code, UserId, kind, mode, Sl_No){
		
		var url = ERPiaAPI.url + '/ERPiaApi_TestProject.asp';
		var data = 'Admin_Code=' + Admin_Code + '&UserId=' + UserId + '&Kind=' + kind + '&Mode=' +mode+ '&Sl_No=' + Sl_No
		return $http.get(url + '?' + data);
		
	}
	return{
		ERPiaMCDeleteResult: ERPiaMCDeleteResult
	}
})



/*매출전표 삭제 서비스 ERPiaMCTDeleteService*/
//$scope.loginData.Admin_Code, $scope.loginData.UserId, $scope.reqparams.Kind, $scope.reqparams.Mode, $scope.reqparams.Sl_No
.factory('ERPiaMCTDeleteService', function($http, ERPiaAPI){
	var ERPiaMCDeleteResult = function(Admin_Code, UserId, kind, mode, Sl_No, Tseq){
		
		var url = ERPiaAPI.url + '/ERPiaApi_TestProject.asp';
		var data = 'Admin_Code=' + Admin_Code + '&UserId=' + UserId + '&Kind=' + kind + '&Mode=' +mode+ '&Sl_No=' + Sl_No + '&Tseq=' + Tseq
		return $http.get(url + '?' + data);
		
	}
	return{
		ERPiaMCDeleteResult: ERPiaMCDeleteResult
	}
})



/*매출매입 환경설정 서비스*/
.factory('mconfigService', function($http, ERPiaAPI, $q, $cordovaToast){
	return{
		basicSM: function(admin_code, userid){
			console.log("mconfigService and basicM");
		var url = ERPiaAPI.url +'/ERPiaApi_TestProject.asp';
		var data = 'Admin_Code=' + admin_code + '&UserId=' + userid + '&Kind=ERPia_Sale_Select_Place_CName&Mode=Select_Place';
		return $http.get(url + '?' + data)
			.then(function(response){
				console.log('mconfigService(basicM)=', response);
				if(typeof response == 'object'){
					console.log('매장리스트=', response.data);
					return response.data;
				}else{
					return $q.reject(response.data);
				}
			}, function(response){
				return $q.reject(response.data);
			})

		}, basicM: function(admin_code, userid){
			console.log("mconfigService and basicM");
		var url = ERPiaAPI.url +'/ERPiaApi_TestProject.asp';
		var data = 'Admin_Code=' + admin_code + '&UserId=' + userid + '&Kind=ERPia_Meaip_Select_Place_CName&Mode=Select_Place';
		return $http.get(url + '?' + data)
			.then(function(response){
				console.log('mconfigService(basicM)=', response);
				if(typeof response == 'object'){
					console.log('매장리스트=', response.data);
					return response.data;
				}else{
					return $q.reject(response.data);
				}
			}, function(response){
				return $q.reject(response.data);
			})

		}, basicSetup: function(admin_code, userid){
			console.log("mconfigService and basicSetup");
			var url = ERPiaAPI.url +'/ERPiaApi_TestProject.asp';
			var data = 'Admin_Code=' + admin_code + '&UserId=' + userid + '&Kind=ERPia_Config&Mode=select';
			return $http.get(url + '?' + data)
				.then(function(response){
					console.log('mconfigService(basicSetup)=', response);
					console.log('데이터 =>', response.data.list[0].UserId);
					if(typeof response == 'object'){
						//조회된 환경설정 리스트중에 아이디에 맞는 리스트 조회
						/*response.data.list / userid*/
						if(response.data != '<!--Parameter Check-->'){
							var data = {
									state : 0,
									basic_Place_Code : response.data.list[0].basic_Place_Code,
									basic_Ch_Code :response.data.list[0].basic_Ch_Code,
									basic_Dn_Sale : response.data.list[0].basic_Dn_Sale,
									basic_Dn_Meaip : response.data.list[0].basic_Dn_Meaip,
									basic_Subul_Sale : response.data.list[0].basic_Subul_Sale,
									basic_Subul_Meaip : response.data.list[0].basic_Subul_Meaip,
									basic_Subul_Meaip_Before : response.data.list[0].basic_Subul_Meaip_Before,
									basic_Subul_Sale_Before : response.data.list[0].basic_Subul_Sale_Before
							};
							return data;
						}else{
							if(ERPiaAPI.toast == 'Y') $cordovaToast.show('저장되어있는 초기값이 없습니다.', 'long', 'center');
							else console.log('저장되어있는 초기값이 없습니다.');
								var data = {
									state : 1,
									basic_Place_Code : 0,
									basic_Ch_Code : 0,
									basic_Dn_Sale : 1,
									basic_Dn_Meaip : 1,
									basic_Subul_Sale : 2,
									basic_Subul_Meaip : 2,
									basic_Subul_Meaip_Before : 'N'
								};
								var testtest = 0;
								console.log('확인=>', data);
								return data;
						}
					}else{
						return $q.reject(response.data);
					}
				}, function(response){
					if(ERPiaAPI.toast == 'Y') $cordovaToast.show('저장되어있는 초기값이 없습니다.', 'long', 'center');
					else console.log('저장되어있는 초기값이 없습니다.');
					var data = {
						state : 1,
						basic_Place_Code : 0,
						basic_Ch_Code : 0,
						basic_Dn_Sale : 1,
						basic_Dn_Meaip : 1,
						basic_Subul_Sale : 2,
						basic_Subul_Meaip : 2
					};
					console.log('요기');
					console.log('확인=>', data);
					return data;
				})

		}, basicSC: function(admin_code, userid, meajang_code){
				console.log("mconfigService and changoSearch");
				console.log('매장코드=>', meajang_code);
				var url = ERPiaAPI.url +'/ERPiaApi_TestProject.asp';
				var data = 'Admin_Code=' + admin_code + '&UserId=' + userid + '&Kind=ERPia_Sale_Select_Place_CName&Mode=Select_CName&Sale_Place_Code=' + meajang_code;
				return $http.get(url + '?' + data)
					.then(function(response){
						console.log('mconfigService', response);
						if(typeof response == 'object'){
							return response.data;
						}else{
							return $q.reject(response.data);
						}
					}, function(response){
						return $q.reject(response.data);
					})
		}, basicC: function(admin_code, userid, meajang_code){
				console.log("mconfigService and changoSearch");
				console.log('매장코드=>', meajang_code);
				var url = ERPiaAPI.url +'/ERPiaApi_TestProject.asp';
				var data = 'Admin_Code=' + admin_code + '&UserId=' + userid + '&Kind=ERPia_Meaip_Select_Place_CName&Mode=Select_CName&Sale_Place_Code=' + meajang_code;
				return $http.get(url + '?' + data)
					.then(function(response){
						console.log('mconfigService', response);
						if(typeof response == 'object'){
							return response.data;
						}else{
							return $q.reject(response.data);
						}
					}, function(response){
						return $q.reject(response.data);
					})
		}, configIU: function(admin_code, userid, configdata, mode){
				console.log("mconfigService and configIU");
				var url = ERPiaAPI.url +'/ERPiaApi_TestProject.asp';
				if(mode == 'insert'){
					var data = 'Admin_Code=' + admin_code + '&Userid=' + userid + '&Kind=ERPia_Config&Mode='+ mode +'&basic_Ch_Code='+ configdata.basic_Ch_Code +'&basic_Place_Code='+ configdata.basic_Place_Code +'&basic_Dn_Meaip='+ configdata.basic_Dn_Meaip +'&basic_Dn_Sale='+ configdata.basic_Dn_Sale +'&basic_Subul_Sale='+  configdata.basic_Subul_Sale +'&basic_Subul_Sale_Before=N&basic_Subul_Meaip='+ configdata.basic_Subul_Meaip +'&basic_Subul_Meaip_Before=N';
				}else{
					var data = 'Admin_Code=' + admin_code + '&Userid=' + userid + '&Kind=ERPia_Config&Mode=update&basic_Ch_Code='+ configdata.basic_Ch_Code +'&basic_Place_Code='+ configdata.basic_Place_Code +'&basic_Dn_Meaip='+ configdata.basic_Dn_Meaip +'&basic_Dn_Sale='+ configdata.basic_Dn_Sale +'&basic_Subul_Sale='+  configdata.basic_Subul_Sale +'&basic_Subul_Sale_Before='+ configdata.basic_Subul_Sale_Before  +'&basic_Subul_Meaip='+ configdata.basic_Subul_Meaip +'&basic_Subul_Meaip_Before='+ configdata.basic_Subul_Meaip_Before;
				}
				console.log('저장&수정할데이터확인 ->', data);
				return $http.get(url + '?' + data)
					.then(function(response){
						console.log('mconfigService', response);
						if(typeof response == 'object'){
							return response.data;
						}else{
							return $q.reject(response.data);
						}
					}, function(response){
						return $q.reject(response.data);
					})
		}, paysearch : function(admin_code, userid, kind, mode){
				console.log("mconfigService and paysearch");
				console.log('kind---------------------->',kind);
				console.log('mode------------------->',mode);
				var url = ERPiaAPI.url +'/ERPiaApi_TestProject.asp';
				var data = 'Admin_Code=' + admin_code + '&UserId=' + userid + '&Kind=' + kind + '&Mode=' + mode;
				return $http.get(url + '?' + data)
					.then(function(response){
						console.log('mconfigService(paysearch)=', response);
						if(typeof response == 'object'){
							console.log('카드 & 통장 정보=', response.data);
							return response.data;
						}else{
							return $q.reject(response.data);
						}
					}, function(response){
						return $q.reject(response.data);
					})
		
		}

	};
})

.factory('ERPiaMeachulService', function($http, ERPiaAPI){
	return{
		ERPiaCompsearchData: function(Admin_Code, UserId, kind, mode, gernamekr){
			console.log("ERPiaMeachulService and ERPiaCompsearchData");
		var url = ERPiaAPI.url +'/ERPiaApi_TestProject.asp';
		var data = 'Admin_Code=' + Admin_Code + '&UserId=' + UserId + '&Kind=' + kind + '&Mode=' +mode + '&GerName=' + gernamekr
		return $http.get(url + '?' + data)
			.then(function(response){
				console.log('ERPiaMeachulService', response);
				if(typeof response == 'object'){
					return response.data;
				}else{
					return $q.reject(response.data);
				}
			}, function(response){
				return $q.reject(response.data);
			})

		}, ERPiaMejangsearchData: function(Admin_Code, UserId, kind, mode){
			console.log("ERPiaMeachulService and ERPiaMejangsearchData");
		var url = ERPiaAPI.url +'/ERPiaApi_TestProject.asp';
		var data = 'Admin_Code=' + Admin_Code + '&UserId=' + UserId + '&Kind=' + kind + '&Mode=' +mode
		/*var data = 'Admin_Code=onz&UserId=pikapika&Kind=ERPia_Meaip_Config&Mode=select';*/
		return $http.get(url + '?' + data)
			.then(function(response){
				if(typeof response == 'object'){
					return response.data;
				}else{
					return $q.reject(response.data);
				}
			}, function(response){
				return $q.reject(response.data);
			})

		}, ERPiaChanggosearchData: function(Admin_Code, UserId, kind, mode, Sale_Place_Code){
				console.log("ERPiaMeachulService and ERPiaChanggosearchData");
		var url = ERPiaAPI.url +'/ERPiaApi_TestProject.asp';
		var data = 'Admin_Code=' + Admin_Code + '&UserId=' + UserId + '&Kind=' + kind + '&Mode=' + mode + '&Sale_Place_Code=' + Sale_Place_Code
		return $http.get(url + '?' + data)
			.then(function(response){
				console.log('ERPiaMeachulService', response);
				if(typeof response == 'object'){
					return response.data;
				}else{
					return $q.reject(response.data);
				}
			}, function(response){
				return $q.reject(response.data);
			})
		}, ERPiaItemsearchData: function(Admin_Code, UserId, kind, mode, goodsnamekr, G_OnCode, GoodsCode, GI_Code){
				console.log("ERPiaMeachulService and ERPiaItemsearchData");
		var url = ERPiaAPI.url +'/ERPiaApi_TestProject.asp';
		var data = 'Admin_Code=' + Admin_Code + '&UserId=' + UserId + '&Kind=' + kind + '&Mode=' + mode + '&GoodsName=' + goodsnamekr + '&G_OnCode=' + G_OnCode + '&GoodsCode=' + GoodsCode + '&GI_Code=' + GI_Code
		return $http.get(url + '?' + data)
			.then(function(response){
				console.log('ERPiaMeachulService', response);
				if(typeof response == 'object'){
					return response.data;
				}else{
					return $q.reject(response.data);
				}
			}, function(response){
				return $q.reject(response.data);
			})

			//@Admin_Code		= 'pikachu'
			// , @UserId			= 'pikachu'
			// , @Kind			= 'ERPia_Sale_Insert_Goods'
			// , @Mode			= ''

			// , @Sale_Place_Code	= '004'
			// , @RequestXml		↓참조
			// , @IpJi_YN
		}, ERPiaMeachulInsert: function(Admin_Code, UserId, kind, mode, Sale_Place_Code, RequestXml, IpJi_YN){
			console.log("ERPiaMeachulService and ERPiaCompsearchData");
		var url = ERPiaAPI.url +'/ERPiaApi_TestProject.asp';
		var data = 'Admin_Code=' + Admin_Code + '&UserId=' + UserId + '&Kind=' + kind + '&Mode=' +mode + '&Sale_Place_Code=' + Sale_Place_Code + '&RequestXml=' + RequestXml + '&IpJi_YN=' + IpJi_YN
		return $http.get(url + '?' + data)
			.then(function(response){
				console.log('ERPiaMeachulService', response);
				if(typeof response == 'object'){
					return response.data;
				}else{
					return $q.reject(response.data);
				}
			}, function(response){
				return $q.reject(response.data);
			})

		}, basic_Subul_Sale_Before : function(admin_code, userid, basic_Subul_Sale_Before){
				console.log("mconfigService and basic_Subul_Sale_Before");
				var url = ERPiaAPI.url +'/ERPiaApi_TestProject.asp';
				var data = 'Admin_Code=' + admin_code + '&UserId=' + userid + '&Kind=ERPia_Config&Mode=update_subul_before&basic_Subul_Sale_Before=' + basic_Subul_Sale_Before;
				return $http.get(url + '?' + data)
					.then(function(response){
						console.log('basic_Subul_Sale_Before=', response);
						if(typeof response == 'object'){
							
							return response.data;
						}else{
							return $q.reject(response.data);
						}
					}, function(response){
						return $q.reject(response.data);
					})
		
		}
//4.Admin_Code, UserId, Kind, Mode, basic_Subul_Sale_Before, basic_Subul_Meaip_Before
	};
})


/*

.factory('ERPiaItemsearchService', function($http, ERPiaAPI)
	var ERPiaItemsearchData = function(Admin_Code, UserId, kind, mode, goodsnamekr, G_OnCode, GoodsCode, GI_Code){
		var url = ERPiaAPI.url + '/ERPiaApi_TestProject.asp';
		var data = 'Admin_Code=' + Admin_Code + '&UserId=' + UserId + '&Kind=' + kind + '&Mode=' + mode + '&GoodsName=' + goodsnamekr + '&G_OnCode=' + G_OnCode + '&GoodsCode=' + GoodsCode + '&GI_Code=' + GI_Code 
		return $http.get(url + '?' + data);
		
	}
	return{
		ERPiaItemsearchData: ERPiaItemsearchData
	}
})*/;
