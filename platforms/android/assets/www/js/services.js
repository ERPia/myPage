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

.factory('loginService', function($http, ERPiaAPI){
	var comInfo = function(kind, Admin_Code, G_id, G_Pass){
		if(kind == 'scm_login'){
			var url = ERPiaAPI.url + '/Json_Proc_MyPage_Scm.asp';
			var data = 'kind=' + kind + '&Admin_Code=' + Admin_Code + '&G_id=' + G_id + '&G_Pass=' + G_Pass;
			return $http.get(url + '?' + data);
		}else if(kind == 'ERPiaLogin'){
			var url = ERPiaAPI.url + '/JSon_Proc_MyPage_Scm_Manage.asp';
			var data = 'kind=' + kind + '&Admin_Code=' + Admin_Code + '&uid=' + G_id + '&pwd=' + G_Pass;
			return $http.get(url + '?' + data);
		}else if(kind =='erpia_ComInfo'){
			var url = ERPiaAPI.url + '/JSon_Proc_MyPage_Scm_Manage.asp';
			var data = 'kind=' + kind + '&Admin_Code=' + Admin_Code;
			return $http.get(url + '?' + data);
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
.factory('IndexService', function($http, ERPiaAPI){
	var dashBoard = function(kind, Admin_Code, sDate, eDate){
		var url = ERPiaAPI.url + '/Json_Proc_MyPage_Scm.asp';
		var data = 'kind=' + kind + '&Admin_Code=' + Admin_Code + '&sDate=' + sDate + '&eDate=' + eDate;
		return $http.get(url + '?' + data);
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
		if(loginType=='S'){
			data = 'Kind=check_Certification&Value_Kind=list' + '&Admin_Code=' + Admin_Code + '&ID=' + ID;
			data += '&Input_Code=' + Input_Code + '&loginType=' + loginType;
		}else if(loginType=='E'){
			url = ERPiaAPI.url + '/JSon_Proc_MyPage_Scm_Manage.asp';
			data = 'Kind=ERPiaCertify' + '&Admin_Code=' + Admin_Code + '&uid=' + ID;
		}
		return $http.get(url + '?' + data)
		.success(function(response){
			if (response.list[0].Result == '1'){
				if(loginType == "S"){
					location.href = "#/app/scmhome";
				}else if(loginType == "E"){
					location.href = "#/app/slidingtab";
				};
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
		innerHtml: function(Admin_Code, GerCode){
			var url = ERPiaAPI.url + '/JSon_Proc_MyPage_Scm.asp';
			var data = 'Kind=select_Trade' + '&Admin_Code=' + Admin_Code + '&GerCode=' + GerCode;
			return $http.get(url + '?' + data)
				.then(function(response){
					console.log(response.data);
					if(typeof response.data == 'object'){
						return response.data;
					}else{
						return $q.reject(response.data);
					}
				}, function(response){
					return $q.reject(response.data);
				})
		}
	};

	// var innerHtml = function(Admin_Code, GerCode){
	// 	var strHtml='';
	// 	var url = ERPiaAPI.url + '/JSon_Proc_MyPage_Scm.asp';
	// 	var data = 'Kind=select_Trade' + '&Admin_Code=' + 'onz' + '&GerCode=' + '01016';
	// 	$http.get(url + '?' + data)
	// 	.then(function(response){
	// 		console.log(response);
	// 		if(typeof response.data == 'object'){
	// 			for(var i=0; i<response.data.list.length; i++){
	// 				strHtml += '<div class="row">';
	// 				strHtml += '<div class="col">' + response.data.list[i].Idx + '</div>';
	// 				strHtml += '<div class="col col-25">' + response.data.list[i].in_date + '</div>';
	// 				strHtml += '<div class="col col-20">' + response.data.list[i].Admin_Code + '</div>';
	// 				strHtml += '<div class="col col-25"><a href="" ng-click="readTradeDetail(' + response.data.list[i].Idx + ')">';
	// 				strHtml += response.data.list[i].G_Name.substring(0, 3) + ' 외 ' + response.data.list[i].totCnt + '</a></div>';
	// 				strHtml += '<div class="col col-20">X</div>';
	// 				strHtml += '</div>';
	// 			}
	// 				// }else{
	// 				// 	innerHtml += '<div class="row">';
	// 				// 	innerHtml += '<div class="col">열람 가능한 명세서가 없습니다.</div>';
	// 				// 	innerHtml += '</div>';
	// 				// }
	// 				console.log('innerHtml', innerHtml);
	// 		}
	// 	})
	// 	return strHtml;
	// }
	// console.log(innerHtml);
	// return {
	// 	innerHtml:innerHtml
	// }
})
.factory('NoticeService', function($http, $q, ERPiaAPI){
	return{
		getList: function(){
			var url = ERPiaAPI.url + '/JSon_Proc_MyPage_Scm_Manage.asp';
			var data = 'Kind=myPage_Notice&Value_Kind=encode&cntRow=10';
			return $http.get(url + '?' + data)
				.then(function(response){
					console.log(response.data);
					if(typeof response.data == 'object'){
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
	var items =  [{order:0, Idx:0, title:"홈", visible:"Y"}
				, {order:1, Idx:1, title:"매출 실적 추이", visible:"Y"}
				, {order:2, Idx:2, title:"사이트별 매출 점유율", visible:"Y"}
				, {order:3, Idx:3, title:"매출이익증감율", visible:"Y"}
				, {order:4, Idx:4, title:"상품별 매출 TOP5", visible:"Y"}
				, {order:5, Idx:5, title:"브랜드별 매출 TOP5", visible:"Y"}
				, {order:6, Idx:6, title:"온오프라인 비교 매출", visible:"Y"}
				, {order:7, Idx:7, title:"매출반품현황", visible:"Y"}
				, {order:8, Idx:8, title:"상품별 매출 반품 건수/반품액 TOP5", visible:"Y"}
				, {order:9, Idx:9, title:"CS 컴플레인 현황", visible:"Y"}
				, {order:10, Idx:10, title:"매입 현황", visible:"Y"}
				, {order:11, Idx:11, title:"거래처별 매입 점유율 TOP 10", visible:"Y"}
				, {order:12, Idx:12, title:"상품별 매입건수/매입액 TOP5", visible:"Y"}
				, {order:13, Idx:13, title:"최근배송현황", visible:"Y"}
				, {order:14, Idx:14, title:"배송현황", visible:"Y"}
				, {order:15, Idx:15, title:"택배사별 구분 건수 통계", visible:"Y"}
				, {order:16, Idx:16, title:"재고 회전율 TOP5", visible:"Y"}];
	return{
		all : function(kind, mode, Admin_Code, loginType, G_Id) {
			var url = ERPiaAPI.url + '/JSon_Proc_MyPage_Scm.asp';
			var data = 'Value_Kind=list&Kind=' + kind + '&mode=' + mode + '&Admin_Code=' + Admin_Code + '&loginType=' + loginType + '&G_Id=' + G_Id;
			return $http.get(url + '?' + data)
				.then(function(response) {
<<<<<<< HEAD
					console.log(response)
=======
>>>>>>> refs/remotes/origin/lhk
					if(typeof response.data == 'object'){
						return response.data.list;	
					}else{
						return items;
					}
			})
		},save : function(kind, mode, Admin_Code, loginType, G_Id, statistic){
			var url = ERPiaAPI.url + '/JSon_Proc_MyPage_Scm.asp';
			var data = 'Value_Kind=list&Kind=' + kind + '&mode=' + mode + '&Admin_Code=' + Admin_Code + '&loginType=' + loginType + '&G_Id=' + G_Id + '&statistic=' + statistic;
			return $http.get(url + '?' + data)
				.then(function(response) {
<<<<<<< HEAD
					console.log('response', response);
=======
>>>>>>> refs/remotes/origin/lhk
					return response.data;
			})
		}, title : function(kind, mode, Admin_Code, loginType, G_Id){
			var url = ERPiaAPI.url + '/JSon_Proc_MyPage_Scm.asp';
			var data = 'Value_Kind=list&Kind=' + kind + '&mode=' + mode + '&Admin_Code=' + Admin_Code + '&loginType=' + loginType + '&G_Id=' + G_Id;
			return $http.get(url + '?' + data)
				.then(function(response) {
<<<<<<< HEAD
					console.log(response)
=======
>>>>>>> refs/remotes/origin/lhk
					if(typeof response.data == 'object'){
						return response.data.list;	
					}else{
						return items;
					}
			})
		}, chart : function(kind, mode, Admin_Code, loginType, G_Id, chart_idx){
			var url = ERPiaAPI.url + '/JSon_Proc_MyPage_Scm.asp';
			var data = 'Value_Kind=list&Kind=' + kind + '&mode=' + mode + '&Admin_Code=' + Admin_Code + '&loginType=' + loginType;
				data += '&G_Id=' + G_Id + '&chart_idx=' + chart_idx;
			return $http.get(url + '?' + data)
				.then(function(response) {
<<<<<<< HEAD
					console.log(response)
=======
>>>>>>> refs/remotes/origin/lhk
					if(typeof response.data == 'object'){
						return response.data;	
					}else{
						return items;
					}
			})
		}
	}
})
<<<<<<< HEAD
=======
.factory('alarmService', function($http, $q, ERPiaAPI){
	var url = ERPiaAPI.url + '/JSon_Proc_MyPage_Scm.asp';
	return{
		select : function(kind, Admin_Code, loginType, G_Id){
			var data = 'Value_Kind=list&Kind=' + kind + '&Admin_Code=' + Admin_Code + '&loginType=' + loginType + '&G_Id=' + G_Id;
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
>>>>>>> refs/remotes/origin/lhk
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
});
