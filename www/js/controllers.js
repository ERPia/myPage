var g_playlists = [{
	title : 'Reggaehiphop',
	id : 1
}, {
	title : 'Chill',
	id : 2
}, {
	title : 'Dubstep',
	id : 3
}, {
	title : 'Indie',
	id : 4
}, {
	title : 'Rap',
	id : 5
}, {
	title : 'Cowbell',
	id : 6
}];

angular.module('starter.controllers', ['starter.services', 'ionic', 'ngCordova', 'ionic.service.core', 'ionic.service.push', 'tabSlideBox'])
.controller('AppCtrl', function($rootScope, $scope, $ionicModal, $timeout, $http, $state, $ionicHistory, $cordovaToast, $ionicLoading, $cordovaDevice, $location
	, loginService, CertifyService, pushInfoService, uuidService, ERPiaAPI){
	$rootScope.urlData = [];
	$rootScope.loginState = "R"; //R: READY, E: ERPIA LOGIN TRUE, S: SCM LOGIN TRUE
	$rootScope.deviceInfo = {};
	
	$scope.ion_login = "ion-power active";
	$scope.loginData = {};	//Admin_Code, UserId, Pwd
	$scope.userData = {};
	$scope.SMSData = {};

	// Create the login modal that we will use later
	$ionicModal.fromTemplateUrl('erpia_login/login.html', {
		scope : $scope
	}).then(function(modal) {
		$scope.loginModal = modal;
	});

	$ionicModal.fromTemplateUrl('side/agreement.html',{
		scope : $scope
	}).then(function(modal){
		$scope.agreeModal = modal;
	});

	$ionicModal.fromTemplateUrl('side/certification.html',{
		scope : $scope
	}).then(function(modal){
		$scope.certificationModal = modal;
	});

	$ionicModal.fromTemplateUrl('side/check_Sano.html',{
		scope : $scope
	}).then(function(modal){
		$scope.check_sano_Modal = modal;
	});
	$scope.init = function(loginType){
		if(loginType == 'logout') {
			$ionicLoading.show({template:'Logging out...'});
			$rootScope.loginState = "R";
			$scope.loginHTML = "로그인";
			$scope.ion_login = "ion-power active";
			$scope.icon_home = "";
		}else{
			$scope.icon_home = "ion-home";
		}

		$timeout(function(){
			$ionicLoading.hide();
			$scope.loginData = {};
			$scope.userData = {};
			$scope.dashBoard = {};

			$rootScope.goto_with_clearHistory('#/app/main');
			// $ionicHistory.clearCache();
			// $ionicHistory.clearHistory();
			// $ionicHistory.nextViewOptions({disableBack:true, historyRoot:true});
			$state.go('app.erpia_main');
		}, 500);
	}
	// Triggered in the login modal to close it
	$scope.closeLogin = function() {
		$ionicHistory.nextViewOptions({
			disableBack: true
		});
		$scope.loginModal.hide();
		console.log('hideModal', $scope.loginModal);
		if($rootScope.mobile_Certify_YN == 'Y'){
			if($rootScope.loginState == "S"){
		        $state.go("app.erpia_scmhome");
			}else if($rootScope.loginState == "E"){
				//$state.go("app.erpia_main");
		        $state.go("app.slidingtab");
			}else if($rootScope.loginState == 'N'){
				$state.go("app.erpia_main");
			}
			// else if($rootScope.userType == 'Guest'){
			// 	$location.href = '#/app/slidingtab';
			// }
		}
		else if($rootScope.loginState != "R") {
			$scope.agreeModal.show();
		}
		var PushInsertCheck = "";
		var PushInsertCheck2 = "";

		$scope.pushUserCheck = function() {
			pushInfoService.pushInfo($scope.loginData.Admin_Code, $scope.loginData.UserId, 'Mobile_Push_Token', 'SELECT_InsertCheck', $rootScope.UserKey, $rootScope.token, '', '', '', '')
		    .then(function(pushInfo){
		    	console.log('pushinfo::', pushInfo);
		    	
		    	if(pushInfo.data.list.length != 0){
		    		PushInsertCheck = pushInfo.data.list[0].token;
		    	}
		    	if(PushInsertCheck == $rootScope.token){
		    		PushInsertCheck2 = "duplication";
		    		console.log('pushinfo:: duplication');
		    	}else{
		    		PushInsertCheck2 = "NewToken";
		    		console.log('pushinfo:: NewToken.. Insert&Update Start');
	    			if(PushInsertCheck2 == "NewToken"){
						$scope.pushUserRegist();
					};
		    	}
		    },function(){
				alert('pushUserCheck fail')	
			});
		};

		$scope.pushUserRegist = function() {
			pushInfoService.pushInfo($scope.loginData.Admin_Code, $scope.loginData.UserId, 'Mobile_Push_Token', 'SAVE', $rootScope.UserKey, $rootScope.token, $rootScope.loginState, 'A', '', '')
		    .then(function(pushInfo){
		    	console.log('pushUserRegist success ::[' + $rootScope.token + ']');
		    },function(){
				alert('pushUserRegist fail')	
			});
		};
		$scope.pushUserCheck();
		// };
	};

	$rootScope.loginMenu = "selectUser";	//사용자 선택화면
	$scope.selectType = function(userType){
		console.log('userType', userType);
		switch(userType){
			case 'ERPia': $rootScope.loginMenu = 'User'; $rootScope.userType = 'ERPia'; $scope.footer_menu = 'U'; break;
			case 'SCM': $rootScope.loginMenu = 'User'; $rootScope.userType = 'SCM'; $scope.footer_menu = 'U'; break;
			case 'Normal': $rootScope.loginMenu = 'User'; $rootScope.userType = 'Normal'; $scope.footer_menu = 'U'; break;
			case 'Guest': $rootScope.loginMenu = 'User'; $rootScope.userType = 'Guest'; $scope.footer_menu = 'G';
				$scope.loginModal.hide(); 
				$scope.doLogin(); 
			break;
			case 'login': $rootScope.loginMenu = 'selectUser'; break;
		}
	}
	// Open the login modal
	$scope.login = function() {
		$rootScope.loginMenu = 'selectUser';
		if($rootScope.loginState == 'R'){
			$scope.loginModal.show();
			$scope.init('login');
		}else{
			$scope.footer_menu = 'G';
			$scope.init('logout');
		};
	};

	// Perform the login action when the user submits the login form
	$scope.doLogin = function(admin_code, loginType, id, pwd, autologin_YN) {
		if (autologin_YN == 'Y') {
			switch(loginType){
				case 'E' : $rootScope.userType = 'ERPia'; $rootScope.loginMenu = 'User'; $scope.footer_menu = 'U'; break;
				case 'S' : $rootScope.userType = 'SCM'; $rootScope.loginMenu = 'User'; $scope.footer_menu = 'U'; break;
				case 'N' : $rootScope.userType = 'Normal'; $rootScope.loginMenu = 'User'; $scope.footer_menu = 'U'; break;
			}
			$scope.loginData.Admin_Code = admin_code;
			$scope.loginData.UserId = id;
			$scope.loginData.Pwd = pwd;
		}
		// console.log('autoLogin : ', $rootScope.autologin_YN);
		// if($rootScope.autologin_YN) {
		// 	var userType = '';
		// 	switch($rootScope.userType){
		// 		case 'ERPia': userType ='E'; break;
		// 		case 'SCM': userType = 'S'; break;
		// 		case 'Normal': userType = 'N'; break;
		// 	}
		// 	uuidService.saveUUID(uuid, $scope.loginData.Admin_Code, userType, $scope.loginData.UserId, $scope.loginData.Pwd, 'Y')
		// }
		//SCM 로그인
		if ($rootScope.userType == 'SCM') {
			loginService.comInfo('scm_login', $scope.loginData.Admin_Code, $scope.loginData.UserId, $scope.loginData.Pwd)
			.then(function(comInfo){
				console.log('comInfo', comInfo);
				if (comInfo.data.list[0].ResultCk == '1'){
					$scope.userData.GerName = comInfo.data.list[0].GerName + '<br>(' + comInfo.data.list[0].G_Code + ')';
					$scope.userData.G_Code = comInfo.data.list[0].G_Code;
					$scope.userData.G_Sano = comInfo.data.list[0].Sano;
					$scope.userData.GerCode = comInfo.data.list[0].G_Code;
					$scope.userData.cntNotRead = comInfo.data.list[0].cntNotRead;

					$scope.loginHTML = "로그아웃";
					$scope.ion_login = "ion-power";
					$rootScope.loginState = "S";
					$rootScope.mobile_Certify_YN = comInfo.data.list[0].mobile_CertifyYN; 

					$timeout(function() {
						$scope.closeLogin();
					}, 500);
				}else{
					if(ERPiaAPI.toast == 'Y') $cordovaToast.show(comInfo.data.list[0].ResultMsg, 'long', 'center');
					else alert(comInfo.data.list[0].ResultMsg);
				}	
			},function(){
				if(ERPiaAPI.toast == 'Y') $cordovaToast.show('login error', 'long', 'center');
					else alert('login error');
			});
		}else if ($rootScope.userType == 'ERPia'){
			//ERPia 로그인
			loginService.comInfo('ERPiaLogin', $scope.loginData.Admin_Code, $scope.loginData.UserId, $scope.loginData.Pwd)
			.then(function(comInfo){
				console.log('comInfo', comInfo);
				if(comInfo.data.list[0].Result=='1'){
					$scope.loginHTML = "로그아웃"; //<br>(" + comInfo.data.list[0].Com_Code + ")";
					$scope.ion_login = "ion-power";

					$scope.userData.Com_Name = comInfo.data.list[0].Com_Name + '<br>(' + comInfo.data.list[0].Com_Code + ')';
					$scope.userData.package = comInfo.data.list[0].Pack_Name;
					$scope.userData.cnt_user = comInfo.data.list[0].User_Count + ' 명';
					$scope.userData.cnt_site = comInfo.data.list[0].Mall_ID_Count + ' 개';
					
					$rootScope.mobile_Certify_YN = comInfo.data.list[0].mobile_CertifyYN;

					loginService.comInfo('erpia_ComInfo', $scope.loginData.Admin_Code)
					.then(function(comTax){
						var d= new Date();
						var month = d.getMonth() + 1;
						var day = d.getDate();
						var data = comTax.data;
						
						Pay_Method = data.list[0].Pay_Method;
						Pay_State = data.list[0].Pay_State;
						Max_Pay_YM = data.list[0].Max_Pay_YM;
						Pay_Ex_Days = data.list[0].Pay_Ex_Days;
						Pay_Day = data.list[0].Pay_Day;
						Pay_Ex_Date = d.getFullYear() + '-' + (month<10 ? '0':'') + month + '-' + (day<10 ? '0' : '') + day;

						if (Pay_Method != 'P')
						{
							if (Pay_State == 'Y')	//당월결재존재
							{
								if (Max_Pay_YM != '')
								{
									if (Pay_Ex_Days >= 0)
									{
										//G_Expire_Days = DateDiff("D", Now_Date, DateAdd("M", 1, Max_Pay_YM & "-01")) + CInt(Pay_Day) + CInt(Pay_Ex_Days) - 1
										Max_Pay_Y = Max_Pay_YM.split('-')[0];
										Max_Pay_M = Max_Pay_YM.split('-')[1];
										var d1 = new Date(Max_Pay_Y, Max_Pay_M, Pay_Day);
										var diffD = d1 - d;
										G_Expire_Date = d1.format("yyyy.MM.dd");
										G_Expire_Days = Math.ceil(diffD/(24*3600*1000));
									}else{
										G_Expire_Days = '무제한';
										G_Expire_Date = '무제한';
									}
								}
							}else{
								if (Pay_Ex_Days < 0)		//당월결재미존재, 초과허용무제한
								{
									G_Expire_Days = '무제한';
									G_Expire_Date = '무제한';
								}else{
									if (Last_Pay_YM == '')	//당월결재미존재, 이전결재내역미존재
									{
										G_Expire_Days = "0";
										G_Expire_Date = "기간만료";
									}else{					//당월결재미존재, 이전결재내역존재
										Max_Pay_Y = Max_Pay_YM.split('-')[0];
										Max_Pay_M = Max_Pay_YM.split('-')[1];
										if (new Date(Max_Pay_Y, Max_Pay_M, Pay_Day) < d)
										{
											G_Expire_Days = "0"
											G_Expire_Date = "기간만료"
										}else{
											//G_Expire_Days = DateDiff("D", Now_Date, DateAdd("D", CInt(Pay_Day) + CInt(Pay_Ex_Days) - 1, DateAdd("M", 1, Last_Pay_YM & "-01")))
											//G_Expire_Date = DateAdd("D", CInt(Pay_Day) + CInt(Pay_Ex_Days) - 1, DateAdd("M", 1, Last_Pay_YM & "-01"))
										}
									}
								}
							}
						}else{
							G_Expire_Days = "무제한"
							if (CLng(IO_Amt) + CLng(Point_Ex_Amt) - CLng(Point_Out_StandBy_Amt) <= 0)
							{
								G_Expire_Date = "포인트부족"
							}else{
								G_Expire_Date = CLng(IO_Amt) + CLng(Point_Ex_Amt) - CLng(Point_Out_StandBy_Amt)
							}
						}

						$scope.userData.cntNotRead = data.list[0].CNT_Tax_No_Read;	//계산서 미수신건
						$scope.userData.expire_date = G_Expire_Date; //"2015년<br>8월20일";
						$scope.userData.expire_days = G_Expire_Days;

						$scope.management_bill = "330,000원	<br><small>(VAT 포함)</small>";
						$scope.sms = "15000 개<br><small>(건당 19원)</small>";
						$scope.tax = "150 개<br><small>(건당 165원)</small>";
						$scope.e_money = "30,000원<br><small>(자동이체 사용중)</small>";
						$scope.every = "10,000 P";
						

						$rootScope.loginState = "E";
						$timeout(function() {
							$scope.closeLogin();
						}, 500);
					},
					function(){
						if(ERPiaAPI.toast == 'Y') $cordovaToast.show('comTax error', 'long', 'center');
						else alert('comTax error');
					})
				}else{
					if(ERPiaAPI.toast == 'Y') $cordovaToast.show(comInfo.data.list[0].Comment, 'long', 'center');
					else alert(comInfo.data.list[0].Comment);
				}
			},function(){
				if(ERPiaAPI.toast == 'Y') $cordovaToast.show('comInfo error', 'long', 'center');
				else alert('comInfo error');
			});
		}else if($rootScope.userType == 'Normal'){
			loginService.comInfo('ERPia_Ger_Login', $scope.loginData.Admin_Code, $scope.loginData.UserId, $scope.loginData.Pwd)
			.then(function(comInfo){
				if(comInfo.data.list[0].result == '0'){ 
					$scope.loginData.UserId = comInfo.data.list[0].G_ID;

					$scope.userData.GerName = comInfo.data.list[0].GerName + '<br>(' + comInfo.data.list[0].G_Code + ')';
					$scope.userData.G_Code = comInfo.data.list[0].G_Code;
					$scope.userData.G_Sano = comInfo.data.list[0].Sano;
					$scope.userData.GerCode = comInfo.data.list[0].G_Code;
					$scope.userData.cntNotRead = comInfo.data.list[0].cntNotRead;

					$scope.loginHTML = "로그아웃";
					$scope.ion_login = "ion-power";
					$rootScope.loginState = "N";
					$rootScope.mobile_Certify_YN = comInfo.data.list[0].mobile_CertifyYN; 

					$timeout(function() {
						$scope.closeLogin();
					}, 500);
				}else{
					if(ERPiaAPI.toast == 'Y') $cordovaToast.show(comInfo.data.list[0].comment, 'long', 'center');
					else alert(comInfo.data.list[0].comment);	
				}
			})
		}else if($rootScope.userType == 'Guest'){
			$rootScope.loginState = "E"
			$scope.loginHTML = "로그아웃"; //<br>(" + comInfo.data.list[0].Com_Code + ")";
			$scope.ion_login = "ion-power";	
			$scope.userData.Com_Name = 'ERPia' + '<br>(' + 'onz' + ')';
			$scope.loginData.Admin_Code = 'ERPia';
			$scope.loginData.UserId = 'Guest';

			$scope.userData.package = 'Professional';
			$scope.userData.cnt_user = '5 명';
			$scope.userData.cnt_site = '10 개';

			$scope.userData.cntNotRead = 10;	//계산서 미수신건
			$scope.userData.expire_date = '2015-12-31'; //"2015년<br>8월20일";
			$scope.userData.expire_days = 50;
			$state.go('app.sample_Main');
		}
		//}
	};

  	$scope.loginHTML = "로그인";

  	$scope.click_agreement = function(agrees){
		if(agrees.agree_1 && agrees.agree_2){
			$scope.agreeModal.hide();
			$scope.certificationModal.show();
		}else{
			if(ERPiaAPI.toast == 'Y') $cordovaToast.show('약관에 동의해!!', 'long', 'center');
			alert('약관에 동의해!!');
		}
	}

	$scope.click_cancel = function(){
		$scope.agreeModal.hide();
		$scope.init('logout');
		// $state.go('app.erpia_main');
	}
	// $rootScope.CertificationSwitch = 'firstPage';
	$scope.click_Certification = function(){
		CertifyService.certify($scope.loginData.Admin_Code, $rootScope.loginState, $scope.loginData.UserId, 'erpia', 'a12345', '070-7012-3071', $scope.SMSData.recUserTel)
	}
	$scope.click_responseText = function(){
		CertifyService.check($scope.loginData.Admin_Code, $rootScope.loginState, $scope.loginData.UserId, $scope.SMSData.rspnText)
		.then(function(response){
			$scope.certificationModal.hide();
		})
	}
	$scope.showCheckSano = function(){
		$scope.check_sano_Modal.show();
	}
	$scope.login_back = function(){
		$rootScope.loginMenu = "selectUser";
	}
	$scope.click_home = function(){
		if($rootScope.userType == 'ERPia') $location.href = '#/slidingtab'; //$state.go('app.slidingtab');
		else if($rootScope.userType == 'Guest') $location.href = '#/sample/Main'; //$state.go('app.sample_Main');
	}
	document.addEventListener("deviceready", function () {
		$rootScope.deviceInfo.device = $cordovaDevice.getDevice();
		$rootScope.deviceInfo.cordova = $cordovaDevice.getCordova();
		$rootScope.deviceInfo.model = $cordovaDevice.getModel();
		$rootScope.deviceInfo.platform = $cordovaDevice.getPlatform();
		$rootScope.deviceInfo.uuid = $cordovaDevice.getUUID();
		$rootScope.deviceInfo.version = $cordovaDevice.getVersion();
		
		alert('uuid : ', $rootScope.deviceInfo.uuid)
		uuidService.getUUID($rootScope.deviceInfo.uuid)
		.then(function(response){
			if(response.list[0].result == '1'){
				$scope.loginData.Admin_Code = response.list[0].admin_code;
				$scope.loginData.loginType = response.list[0].loginType;
				$scope.loginData.User_Id = response.list[0].ID;
				$scope.loginData.User_PW = response.list[0].pwd;
				$scope.loginData.autologin_YN = response.list[0].autoLogin_YN;

				$scope.doLogin($scope.loginData.Admin_Code, $scope.loginData.loginType, $scope.loginData.User_Id, $scope.loginData.User_PW, $scope.loginData.autologin_YN);
			}
		})
	}, false);
})

.controller('tradeCtrl', function($scope, $state, $ionicSlideBoxDelegate, $cordovaPrinter, $cordovaToast, $ionicModal, $ionicHistory, tradeDetailService, ERPiaAPI){
	$ionicModal.fromTemplateUrl('side/trade_Detail.html',{
		scope : $scope
	}).then(function(modal){
		$scope.trade_Detail_Modal = modal;
	});
	$scope.check = {};

	tradeDetailService.tradeList($scope.loginData.Admin_Code, $scope.userData.GerCode)
		.then(function(response){
			console.log('list', response);
			if(response.list.length == 0) {
				$scope.haveList = 'N';
			}else{
				$scope.haveList = 'Y';
				$scope.items = response.list;	
			}
			console.log('haveList', $scope.haveList);
		})
	$scope.readTradeDetail = function(dataParam){
		var Sl_No = dataParam.substring(0, dataParam.indexOf('^'));
		var detail_title = dataParam.substring(dataParam.indexOf('^') + 1);
		tradeDetailService.readDetail($scope.loginData.Admin_Code, Sl_No)
			.then(function(response){
				console.log('readDetail', response);
				$scope.detail_items = response.list;
				$scope.trade_Detail_Modal.show();
			})
	}
	$scope.close_sano = function(){
		console.log('asdsss');
		$scope.check_sano_Modal.hide();
	}
	$scope.close = function(){
		$scope.trade_Detail_Modal.hide();
	}
	// $scope.backToList = function(){
	// 	$ionicSlideBoxDelegate.previous();
	// }
	$scope.print = function(){
		if($cordovaPrinter.isAvailable()){
			$cordovaPrinter.print('www.erpia.net/mobile/trade_Detail.asp');
		}else{
			if(ERPiaAPI.toast == 'Y') $cordovaToast.show('Printing is not available on device', 'long', 'center');
			else alert('Printing is not available on device');
		}
	}
	$scope.check_Sano = function(){
		console.log('sano', $scope.userData.G_Sano.substring($scope.userData.G_Sano.lastIndexOf('-') + 1));
		if($scope.userData.G_Sano.substring($scope.userData.G_Sano.lastIndexOf('-') + 1) == $scope.userData.Sano){
			$scope.check_sano_Modal.hide();
			$ionicHistory.nextViewOptions({
				disableBack: true
			});
			$state.go('app.tradeList');
			// location.href="#/app/tradeList";
		}else{
			if(ERPiaAPI.toast == 'Y') $cordovaToast.show('사업자 번호와 일치하지 않습니다.', 'long', 'center');
			else alert('사업자 번호와 일치하지 않습니다.');
		}
	}
})

.controller('configCtrl', function($scope, $rootScope) {
	if($rootScope.loginState == 'E'){
	}
})
  
.controller('configCtrl_Info', function($scope, $ionicPopup, $ionicHistory, NoticeService) {
	$scope.myGoBack = function() {
		// $ionicPopup.show({
		// 	title: 'View',
		// 	subTitle: '',
		// 	content: '¿Are you sure you back?',
		// 	buttons: [
		// 		{ text: 'No',
		// 			onTap: function(e){
		// 			}
		// 		},
		// 		{
		// 			text: 'Yes',
		// 			type: 'button-positive',
		// 			onTap: function(e) {
		// 			$ionicHistory.goBack();
		// 			}
		// 		},
		// 	]
		// })
		$ionicHistory.goBack();
		$ionicHistory.clearCache();
		$ionicHistory.clearHistory();
		$ionicHistory.nextViewOptions({disableBack:true, historyRoot:true});
	};
	
	$scope.toggle = false;
	NoticeService.getList()
		.then(function(data){
			$scope.items = data.list;
		})
})
.controller('configCtrl_login', function($scope, $rootScope, uuidService){
	console.log('autoloign', $scope.autologin_YN);
	if($scope.autologin_YN == 'Y') $scope.autoLogin = true;
	else $scope.autoLogin = false;
	$scope.autoLogin_YN = function(check){
		if(check) uuidService.saveUUID($scope.uuid, $scope.loginData.Admin_Code, $rootScope.loginState, $scope.loginData.UserId, $scope.loginData.Pwd, 'Y')
		else uuidService.saveUUID($scope.uuid, $scope.loginData.Admin_Code, $rootScope.loginState, $scope.loginData.UserId, $scope.loginData.Pwd, 'N')
	}
})
.controller('configCtrl_statistics', function($scope, $rootScope, statisticService, publicFunction){
	statisticService.all('myPage_Config_Stat', 'select_Statistic', $scope.loginData.Admin_Code, $rootScope.loginState, $scope.loginData.UserId)
		.then(function(data){
			$scope.items = data;
		})
	$scope.moveItem = function(item, fromIndex, toIndex) {
		fromIdx = $scope.items[fromIndex].Idx;
		fromTitle = $scope.items[fromIndex].title;
		fromVisible = $scope.items[fromIndex].visible;

		toIdx = $scope.items[toIndex].Idx;
		toTitle = $scope.items[toIndex].title;
		toVisible = $scope.items[toIndex].visible;

		$scope.items[fromIndex].Idx = toIdx;
		$scope.items[fromIndex].title = toTitle;
		$scope.items[fromIndex].visible = toVisible;

		$scope.items[toIndex].Idx = fromIdx;
		$scope.items[toIndex].title = fromTitle;
		$scope.items[toIndex].visible = fromVisible;

		var rsltList = '';
		for(var i = 0; i < $scope.items.length; i++){
			rsltList += $scope.items[i].cntOrder + '^';
			rsltList += $scope.items[i].Idx + '^';
			rsltList += $scope.items[i].visible + '^|';
		}
		console.log('rsltList', rsltList);
		statisticService.save('myPage_Config_Stat', 'save_Statistic', $scope.loginData.Admin_Code, $rootScope.loginState, $scope.loginData.UserId, rsltList);
	};

	$scope.onItemDelete = function(item) {
		$scope.items.splice($scope.items.indexOf(item), 1);
	};
})
.controller('configCtrl_alarm', function($scope, $rootScope, $location, alarmService){
	 $scope.settingsList = [];
	var cntList = 6;
	$scope.fnAlarm = function(isCheckAll){
		if(isCheckAll == 'checkAll'){
			var arrAlarm = new Array();
			arrAlarm.push({idx:1,name:'공지사항',checked:true});
			arrAlarm.push({idx:2,name:'업데이트현황',checked:true});
			arrAlarm.push({idx:3,name:'지식 나눔방',checked:true});
			arrAlarm.push({idx:4,name:'업체문의 Q&A(답변)',checked:true});
			arrAlarm.push({idx:5,name:'거래명세서 도착',checked:true});
			arrAlarm.push({idx:6,name:'기타 이벤트',checked:true});
			$scope.settingsList = arrAlarm;
		}else{
			alarmService.select('select_Alarm', $scope.loginData.Admin_Code, $rootScope.loginState, $scope.loginData.UserId)
			.then(function(data){
				// cntList = data.list.length;
				for(var i=0; i<cntList; i++){
					switch(data.list[i].idx){
						case 1: data.list[i].checked = (data.list[i].checked == 'T')?true:false;
							data.list[i].name = '공지사항';
							break;
						case 2: data.list[i].checked = (data.list[i].checked == 'T')?true:false;
							data.list[i].name = '업데이트 현황';
							break;
						case 3: data.list[i].checked = (data.list[i].checked == 'T')?true:false;
							data.list[i].name = '지식 나눔방';
							break;
						case 4: data.list[i].checked = (data.list[i].checked == 'T')?true:false;
							data.list[i].name = '업체문의 Q&A(답변)';
							break;
						case 5: data.list[i].checked = (data.list[i].checked == 'T')?true:false;
							data.list[i].name = '거래명세서 도착';
							break;
						case 6: data.list[i].checked = (data.list[i].checked == 'T')?true:false;
							data.list[i].name = '기타 이벤트';
							break;
					}
				}
				if(data.list[0].alarm == 'F'){
					$scope.selectedAll = false;
					$scope.settingsList = [];
				}
				else{
					$scope.selectedAll = true;
					$scope.settingsList = data.list;
				}
			});
		}
	}
	$scope.check_alarm = function(check){
		if(check) {
			rsltList = '0^T^|1^T^|2^T^|3^T^|4^T^|5^T^|6^T^|'; //7^T^|8^T^|';
			alarmService.save('save_Alarm', $scope.loginData.Admin_Code, $rootScope.loginState, $scope.loginData.UserId, rsltList);
			$scope.fnAlarm('checkAll');
		}
		else{
			$scope.settingsList = [];
			rsltList = '0^F^|1^F^|2^F^|3^F^|4^F^|5^F^|6^F^|'; //7^F^|8^F^|';
			alarmService.save('save_Alarm', $scope.loginData.Admin_Code, $rootScope.loginState, $scope.loginData.UserId, rsltList);
		}
		angular.forEach($scope.settingsList, function(item){
			item.checked = check; 
		})
	}
	$scope.check_change = function(item){
		var rsltList = '';
		console.log('settingsList', $scope.settingsList[0]);
		for(var i=0; i<cntList; i++){
			rsltList += $scope.settingsList[i].idx + '^';
			rsltList += ($scope.settingsList[i].checked == true)?'T^|':'F^|';
		}
		alarmService.save('save_Alarm', $scope.loginData.Admin_Code, $rootScope.loginState, $scope.loginData.UserId, '0^U|' + rsltList)
	}
	$scope.fnAlarm('loadAlarm');
})
.controller("IndexCtrl", function($rootScope, $scope, $timeout, $http, $sce, IndexService, statisticService) {
	$scope.myStyle = {
	    "width" : "100%",
	    "height" : "100%"
	};
	$scope.dashBoard = {};
	var indexList = [];
	// 날짜
	var d= new Date();
	var month = d.getMonth() + 1;
	var day = d.getDate();
	//일주일전
	var w = new Date(Date.parse(d) -7 * 1000 * 60 * 60 * 24)
	var wMonth = w.getMonth() + 1;
	var wDay = w.getDate();

	var nowday = d.getFullYear() + '-' + (month<10 ? '0':'') + month + '-' + (day<10 ? '0' : '') + day;
	var aWeekAgo = w.getFullYear() + '-' + (wMonth<10 ? '0':'') + wMonth + '-' + (wDay<10 ? '0' : '') + wDay;

	IndexService.dashBoard('erpia_dashBoard', $scope.loginData.Admin_Code, aWeekAgo, nowday)
	.then(function(processInfo){
		$scope.dashBoard.E_NewOrder = processInfo.data.list[0].CNT_JuMun_New;
		$scope.dashBoard.E_BsComplete = processInfo.data.list[0].CNT_BS_NO;
		$scope.dashBoard.E_InputMno = processInfo.data.list[0].CNT_BS_No_M_No;
		$scope.dashBoard.E_CgComplete = processInfo.data.list[0].CNT_BS_Before_ChulGo;
		$scope.dashBoard.E_RegistMno = processInfo.data.list[0].CNT_BS_After_ChulGo_No_Upload;
	},
	function(){
		if(ERPiaAPI.toast == 'Y') $cordovaToast.show('IndexService Error', 'long', 'center');
		else alert('IndexService Error');
	});

	// $scope.dashBoard.G_Expire_Date = $scope.userData.management_day;
	// $scope.dashBoard.G_Expire_Days = $rootScope.ComInfo.G_Expire_Days;
	// $scope.dashBoard.CNT_Tax_No_Read = $rootScope.ComInfo.CNT_Tax_No_Read;

	statisticService.title('myPage_Config_Stat', 'select_Title', $scope.loginData.Admin_Code, $rootScope.loginState, $scope.loginData.UserId)
	.then(function(data){
		$scope.tabs = data;
	})
	$scope.onSlideMove = function(data) {
		if(indexList.indexOf(data.index) < 0){
			indexList.push(data.index);
			if (data.index > 0){
				statisticService.chart('myPage_Config_Stat', 'select_Chart', $scope.loginData.Admin_Code, $rootScope.loginState, $scope.loginData.UserId, data.index)
				.then(function(response){
					var strChartUrl = 'http://www.erpia.net/psm/02/html/Graph.asp?Admin_Code=' + $scope.loginData.Admin_Code;
					strChartUrl += '&swm_gu=1&kind=chart' + response.list[0].idx;
					switch(data.index){
						case 1: $scope.chart_url1 = $sce.trustAsResourceUrl(strChartUrl); break;
						case 2: $scope.chart_url2 = $sce.trustAsResourceUrl(strChartUrl); break;
						case 3: $scope.chart_url3 = $sce.trustAsResourceUrl(strChartUrl); break;
						case 4: $scope.chart_url5 = $sce.trustAsResourceUrl(strChartUrl); break;
						case 5: $scope.chart_url6 = $sce.trustAsResourceUrl(strChartUrl); break;
						case 6: $scope.chart_url7 = $sce.trustAsResourceUrl(strChartUrl); break;
						case 7: $scope.chart_url8 = $sce.trustAsResourceUrl(strChartUrl); break;
						case 8: $scope.chart_url9 = $sce.trustAsResourceUrl(strChartUrl); break;
						case 9: $scope.chart_url10 = $sce.trustAsResourceUrl(strChartUrl); break;
						case 10: $scope.chart_url11 = $sce.trustAsResourceUrl(strChartUrl); break;
						case 11: $scope.chart_url12 = $sce.trustAsResourceUrl(strChartUrl); break;
						case 12: $scope.chart_url13 = $sce.trustAsResourceUrl(strChartUrl); break;
						case 13: $scope.chart_url14 = $sce.trustAsResourceUrl(strChartUrl); break;
						case 14: $scope.chart_url15 = $sce.trustAsResourceUrl(strChartUrl); break;
						case 15: $scope.chart_url16 = $sce.trustAsResourceUrl(strChartUrl); break;
						case 16: $scope.chart_url17 = $sce.trustAsResourceUrl(strChartUrl); break;
						default : 
							if(ERPiaAPI.toast == 'Y') $cordovaToast.show('chart Error', 'long', 'center');
							else alert('chart Error'); 
						break;
					}
				})
			}
		}
	};

})
.controller('ScmUser_HomeCtrl', function($rootScope, $scope, $ionicModal, $timeout, $http, $sce, scmInfoService, AmChart_Service){
	$scope.ScmBaseData = function() {
		if($rootScope.loginState == "S") {
			// 날짜
			var d= new Date();
			var month = d.getMonth() + 1;
			var day = d.getDate();
			var nowTime = (d.getHours() < 10 ? '0':'') + d.getHours() + ":"
				nowTime += (d.getMinutes() < 10 ? '0':'') + d.getMinutes() + ":";
				nowTime += (d.getSeconds() < 10 ? '0':'') + d.getSeconds();
			//일주일전
			var w = new Date(Date.parse(d) -7 * 1000 * 60 * 60 * 24)
			var wMonth = w.getMonth() + 1;
			var wDay = w.getDate();

			var nowday = d.getFullYear() + '-' + (month<10 ? '0':'') + month + '-' + (day<10 ? '0' : '') + day;
			var aWeekAgo = w.getFullYear() + '-' + (wMonth<10 ? '0':'') + wMonth + '-' + (wDay<10 ? '0' : '') + wDay;

			$scope.nowTime = '최근 조회 시간 :' + nowday + ' ' + nowTime;
			
			scmInfoService.scmInfo('ScmMain', 'Balju', $scope.loginData.Admin_Code, $scope.G_Code, aWeekAgo, nowday)
			.then(function(scmInfo){
				var B_TOT = 0;
				for(var i=0; i<scmInfo.data.list.length; i++){
					switch(scmInfo.data.list[i].CntStts){
						case '0': 
							$scope.B_NewBalju = scmInfo.data.list[i].Cnt + ''; 
							B_TOT += scmInfo.data.list[i].Cnt;
							break;
						case '1': $scope.B_BalJuConfirm = scmInfo.data.list[i].Cnt + ''; 
							B_TOT += scmInfo.data.list[i].Cnt;
							break;
						case 'b': $scope.B_ChulgoConfirm = scmInfo.data.list[i].Cnt + ''; 
							B_TOT += scmInfo.data.list[i].Cnt;
							break;
						case '2': $scope.B_MeaipComplete = scmInfo.data.list[i].Cnt + ''; 
							B_TOT += scmInfo.data.list[i].Cnt;
							break;
					}
				}
				$scope.B_TOT = B_TOT + '';	
				
			});
			scmInfoService.scmInfo('ScmMain', 'Direct', $scope.loginData.Admin_Code, $scope.G_Code, aWeekAgo, nowday)
			.then(function(scmInfo){
				var J_TOT = 0;
				for(var i=0; i<scmInfo.data.list.length; i++){
					switch(scmInfo.data.list[i].CntStts){
						case '0': $scope.J_NewBalju = scmInfo.data.list[i].Cnt + ''; 
							J_TOT += scmInfo.data.list[i].Cnt;
							break;
						case '1': $scope.J_BalJuConfirm = scmInfo.data.list[i].Cnt + ''; 
							J_TOT += scmInfo.data.list[i].Cnt;
							break;
						case 'b': $scope.J_ChulgoConfirm = scmInfo.data.list[i].Cnt + ''; 
							J_TOT += scmInfo.data.list[i].Cnt;
							break;
						case '2': $scope.J_MeaipComplete = scmInfo.data.list[i].Cnt + ''; 
							J_TOT += scmInfo.data.list[i].Cnt;
							break;
					}
				}
				$scope.J_TOT = J_TOT + '';
			});
			scmInfoService.scmInfo('CrmMenu', '', $scope.loginData.Admin_Code, $scope.G_Code, aWeekAgo, nowday)
			.then(function(scmInfo){
				var C_TOT = 0;
				for(var i=0; i<scmInfo.data.list.length; i++){
					switch(scmInfo.data.list[i].CntStts){
						case '1': $scope.C_CancelCnt = scmInfo.data.list[i].Cnt + ''; 
							C_TOT += scmInfo.data.list[i].Cnt;
							break;
						case '2': $scope.C_ReturnCnt = scmInfo.data.list[i].Cnt + ''; 
							C_TOT += scmInfo.data.list[i].Cnt;
							break;
						case '3': $scope.C_ExchangeCnt = scmInfo.data.list[i].Cnt + ''; 
							C_TOT += scmInfo.data.list[i].Cnt;
							break;
					}
				}
				$scope.C_TOT = C_TOT + '';
			});
		}
	}
	$scope.ScmBaseData();
	//scm Chart
	$scope.load_scm_chart = function(){
	    AmChart_Service.scm_Chart('scm', 'scm', $scope.loginData.Admin_Code, 3, $scope.userData.G_Code)
	    .then(function(response){
	    	var chartData = response;
	    	console.log('chartData', chartData);
	    	var chart = AmCharts.makeChart("chart5", {
			   //theme: "dark",
				type: "serial",
				dataProvider: chartData,
				startDuration: 1,
				prefixesOfBigNumbers: [
					{
						"number": 10000,
						"prefix": ""
					}
				],
				valueAxes: [
					{
						id: "ValueAxis-1",
						title: "금액",
						titleRotation: 0,
						usePrefixes: true
					},
					{
						id: "ValueAxis-2",
						title: "수량",
						titleRotation: 0,
						position: "right"
					}
				],
				graphs: [{
//					balloonText: "수량: <b>[[value]]</b>",
					balloonText: "<span style='font-size:12px;'>[[title]] in [[category]]:<br><span style='font-size:20px;'>[[value]]</span> 개</span>",
					fillAlphas: 0.9,
					lineAlpha: 0.2,
					title: "수량",
					type: "column",
					valueAxis: "ValueAxis-2",
					valueField: "su"
				}, {
//					"balloonText": "금액: <b>[[value]]</b>",
					balloonText: "<span style='font-size:12px;'>[[title]] in [[category]]:<br><span style='font-size:20px;'>[[value]]</span> 원</span>",
					fillAlphas: 0.9,
					lineAlpha: 0.2,
					title: "금액",
					type: "column",
					clustered:false,
					columnWidth:0.5,
					valueAxis: "ValueAxis-1",
					valueField: "value"
				}],
				plotAreaFillAlphas: 0.1,
				categoryField: "name",
				categoryAxis: {
					gridPosition: "start",
					autoRotateAngle : 0,
					autoRotateCount: 1,
				},
				export: {
					enabled: true
				 },
                legend: {
                    align: "center",
                    markerType: "circle",
					balloonText : "[[title]]<br><span style='font-size:14px'><b>[[value]]</b> ([[percents]]%)</span>"
                }
			});
	    })
	}
	$scope.load_scm_chart();   
})

.controller('ERPiaUser_HomeCtrl', function($rootScope, $scope, $ionicModal, $timeout, $http){
	console.log($rootScope.loginState); 
// 	// Perform the login action when the user submits the login form
	// $scope.ERPiaBaseData = function() {
		 
	// 	$scope.Kind = "scm_login";
	// 	$scope.loginData.Admin_Code = $scope.loginData.Admin_Code;
	// 	$scope.loginData.UserId = $scope.loginData.UserId;
	// 	$scope.G_Pass = $scope.loginData.Pwd;
	// 	$scope.SCM_Use_YN = $scope.loginData.SCM_Use_YN
	// 	$scope.Auto_Login = $scope.loginData.Auto_Login

		// if($rootScope.loginState == "E") {
		// 	$http({
		// 		method: 'POST',
		// 		url: 'https://www.erpia.net/include/JSon_Proc_MyPage_Scm.asp',
		// 		data: 	"kind=" + "erpia_dashBoard"
		// 				+ "&Admin_Code=" + $scope.loginData.Admin_Code
		// 				+ "&sDate=" + "2015-07-01"
		// 				+ "&eDate=" + "2015-09-31",
		// 		headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=euc-kr'} //헤더
		// 	})
		// 	  .success(function (response) {
		// 		console.log(response);
		// 		$scope.E_NewOrder = response.list[0].Cnt
		// 		$scope.E_BsComplete = response.list[1].Cnt
		// 		$scope.E_InputMno = response.list[2].Cnt
		// 		$scope.E_CgComplete = response.list[3].Cnt
		// 		$scope.E_RegistMno = response.list[4].Cnt

		// 		$scope.E_TOT = $scope.E_NewOrder + $scope.E_BsComplete + $scope.E_InputMno + $scope.E_CgComplete + $scope.E_RegistMno
		// 	})
		// 	  .error(function(data, status, headers, config){
		// 		console.log("Fail");
		// 	})
		// }else{
		// 	// alert(response.list[0].ResultMsg);
		// };
	// };
	// $scope.ERPiaBaseData();
})

.controller('MainCtrl', function($rootScope, $scope, $ionicModal, $timeout, $http){
	console.log("MainCtrl");
    $scope.ERPiaCafe_Link = function() {
        window.open('http://cafe.naver.com/erpia10');
    }

    $scope.ERPiaBlog_Link = function() {
        window.open('http://blog.naver.com/zzata');
    }
})

.controller('CsCtrl', function($rootScope, $scope, $ionicModal, $timeout, $http, csInfoService){
	console.log("CsCtrl");
	$scope.csData = {};

    $scope.dialNumber = function(number) {
        window.open('tel:' + number, '_system');
    }

    $scope.sectorslist = [
	    { id: 1, value: "제조업" },
	    { id: 2, value: "유통업" },
	    { id: 3, value: "프랜차이즈" },
	    { id: 4, value: "서비스" },
	    { id: 5, value: "비영리" },
	    { id: 6, value: "건설업" },
	    { id: 7, value: "기타" }
  	];

  	$scope.interestTopiclist = [
	    { id: 1, value: "재고관리" },
	    { id: 2, value: "물류관리" },
	    { id: 3, value: "온라인관리" },
	    { id: 4, value: "매장관리" },
	    { id: 5, value: "회계&장부관리" },
	    { id: 6, value: "판매관리" },
	    { id: 7, value: "해외판매" },
	    { id: 8, value: "정산관리" },
	    { id: 9, value: "미수관리" },
	    { id: 10, value: "발주관리" },
	    { id: 11, value: "그룹사관리" }
  	];

  	$scope.inflowRoutelist = [
	    { id: 1, value: "검색엔진" },
	    { id: 2, value: "인터넷광고" },
	    { id: 3, value: "블로그&카페" },
	    { id: 4, value: "지인소개" },
	    { id: 5, value: "신문&잡지광고" },
	    { id: 6, value: "신문기사" },
	    { id: 7, value: "기타" }
  	];
	
  	$scope.csRegist = function() {
  		console.log($scope.csData);
		csInfoService.csInfo($scope.loginData.Admin_Code, $scope.loginData.UserId, 'Mobile_CS_Save', $rootScope.loginState, $scope.csData.comName,
							 $scope.csData.writer , $scope.csData.subject, $scope.csData.tel, $scope.csData.sectors, $scope.csData.interestTopic,
							 $scope.csData.inflowRoute, $scope.csData.contents)
	    .then(function(csInfo){
	    	console.log('csRegist success');
	    	a
	    },function(){
			alert('csRegist fail')	
		});
	};

	//test 용 OT201304100001
	// $scope.csRegist = function() {
 	//  		console.log($scope.csData);
 	//  		// TestService.testInfo('pikachu','pikachu', 'ERPia_Sale_Select_Master', 'Select_SlNo', 'OT201304100001','','','','','','2013-01-01','2015-01-01' )
	// 	// TestService.testInfo('pikachu','pikachu', 'ERPia_Sale_Select_Master', 'Select_Date', '','','','','','','2013-01-01','2015-01-01' )
	// 	TestService.testInfo('pikachu','pikachu', 'ERPia_Sale_Select_Detail', '', 'OT201304100001','','','','','','','' )
	// 	// TestService.testInfo('pikachu','pikachu', 'ERPia_Sale_Select_Detail', '', '','','','','','','','' )
	// 	// TestService.testInfo('pikachu','pikachu', 'ERPia_Sale_Select_Detail', '', '','','','','','','','' )
	// 	// TestService.testInfo('pikachu','pikachu', 'ERPia_Sale_Select_Detail', '', '','','','','','','','' )
	// 	// TestService.testInfo('pikachu','pikachu', 'ERPia_Sale_Select_Detail', '', '','','','','','','','' )
	// 	// TestService.testInfo('pikachu','pikachu', 'ERPia_Sale_Select_Detail', '', '','','','','','','','' )
	// 	// TestService.testInfo('pikachu','pikachu', 'ERPia_Sale_Select_Detail', '', '','','','','','','','' )
	// 	// TestService.testInfo('pikachu','pikachu', 'ERPia_Sale_Select_Detail', '', '','','','','','','','' )
	// 	// TestService.testInfo('pikachu','pikachu', 'ERPia_Sale_Select_Detail', '', '','','','','','','','' )
	// 	// TestService.testInfo('pikachu','pikachu', 'ERPia_Sale_Select_Detail', '', '','','','','','','','' )
	// 	// TestService.testInfo('pikachu','pikachu', 'ERPia_Sale_Select_Detail', '', '','','','','','','','' )
	// 	// TestService.testInfo('pikachu','pikachu', 'ERPia_Sale_Select_Detail', '', '','','','','','','','' )
	// 	// TestService.testInfo('pikachu','pikachu', 'ERPia_Sale_Select_Detail', '', '','','','','','','','' )
	// 	// TestService.testInfo('pikachu','pikachu', 'ERPia_Sale_Select_Detail', '', '','','','','','','','' )

	//     .then(function(testInfo){
	//     	console.log(testInfo.data);
	//     },function(){
	// 		alert('csRegist fail')	
	// 	});
	// };
})

.controller('BoardSelectCtrl', function($rootScope, $scope, $state){
	console.log("BoardSelectCtrl");

	$scope.BoardSelect1 = function() {	 
		$rootScope.boardIndex = 0;
		$state.go("app.erpia_board-Main");
		console.log($rootScope.boardIndex);
	};
	$scope.BoardSelect2 = function() {	 
		$rootScope.boardIndex = 1;
		$state.go("app.erpia_board-Main");
		console.log($rootScope.boardIndex);
	};
	$scope.BoardSelect3 = function() {	 
		$rootScope.boardIndex = 2;
		$state.go("app.erpia_board-Main");
		console.log($rootScope.boardIndex);
	};
	$scope.BoardSelect4 = function() {	 
		$rootScope.boardIndex = 3;
		$state.go("app.erpia_board-Main");
		console.log($rootScope.boardIndex);
	};
})

.controller('BoardMainCtrl', function($rootScope, $scope, $ionicModal, $timeout, $http, $sce, ERPiaAPI){
	console.log("BoardMainCtrl");

	$rootScope.useBoardCtrl = "Y";
	var idx = $rootScope.boardIndex;
	
	$scope.tabs2 = [{
		"text" : "공지사항"
	}, {
		"text" : "업데이트 현황"
	}, {
		"text" : "지식 나눔방"
	}, {
		"text" : "업체문의 Q&A"
	}];

	$rootScope.urlData = [{
		"url" : "http://www.erpia.net/brd/brdMobile.asp?brdKinds=notice"
	}, {
		"url" : "http://www.erpia.net/brd/brdMobile.asp?brdKinds=erpup"
	}, {
		"url" : "http://www.erpia.net/brd/brdMobile.asp?brdKinds=faq"
	}, {
		"url" : "http://www.erpia.net/scm2/brdProc.asp?Admin_Code=" + $rootScope.Admin_Code + "&user_id=" + $rootScope.G_id + "&modeKinds=Mobile&brdKinds=mobile_request"
	}];

	switch(idx){
		case 0: $scope.BoardUrl1 = $sce.trustAsResourceUrl($rootScope.urlData[0].url); break;
		case 1: $scope.BoardUrl2 = $sce.trustAsResourceUrl($rootScope.urlData[1].url); break;
		case 2: $scope.BoardUrl3 = $sce.trustAsResourceUrl($rootScope.urlData[2].url); break;
		case 3: $scope.BoardUrl4 = $sce.trustAsResourceUrl($rootScope.urlData[3].url); break;
	}
	$scope.onSlideMove = function(data) {	 	
		switch(data.index){
			case 0: $scope.BoardUrl1 = $sce.trustAsResourceUrl($rootScope.urlData[0].url); break;
			case 1: $scope.BoardUrl2 = $sce.trustAsResourceUrl($rootScope.urlData[1].url); break;
			case 2: $scope.BoardUrl3 = $sce.trustAsResourceUrl($rootScope.urlData[2].url); break;
			case 3: $scope.BoardUrl4 = $sce.trustAsResourceUrl($rootScope.urlData[3].url); break;
		}
		$rootScope.useBoardCtrl = "N";
		console.log('BoardUrl', $rootScope.urlData[$rootScope.boardIndex].url);	
	};
})

.controller('PlaylistsCtrl', function($scope) {
	console.log("PlaylistsCtrl");
	$scope.playlists = g_playlists;
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
	console.log($stateParams);
	$scope.playlists = g_playlists;
	$scope.playlist = $scope.playlists[$stateParams.playlistId - 1];
})
.controller('DashCtrl', function($scope) {
	console.log("DashCtrl");
})

.controller('ChatsCtrl', function($scope, Chats) {
	$scope.chats = Chats.all();
	$scope.remove = function(chat) {
		Chats.remove(chat);
	};
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
	$scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
	$scope.settings = {
		enableFriends : true
	}
})

.controller('LoginCtrl', function($scope){

})
.controller('chartCtrl', function($scope, $rootScope, statisticService){
	statisticService.title('myPage_Config_Stat', 'select_Title', $scope.loginData.Admin_Code, $rootScope.loginState, $scope.loginData.UserId)
		.then(function(data){
			console.log('data', data);
			$scope.charts = data;
		})
	$scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
    $scope.series = ['Series A', 'Series B', 'SeriesC'];
    $scope.data = [
        [65, 59, 80, 80, 56, 55, 40],
        [28, 48, 40, 19, 86, 27, 90],
        [12, 54, 23, 43, 34, 45, 65]
    ];
})
.controller('chartTestCtrl', function($scope, $sce, testLhkServicse){
	testLhkServicse.test()
		.then(function(data){
			//console.log('test', data);
			$scope.innerHtml = $sce.trustAsResourceUrl(data);
		})
})
.controller("IndexCtrl", function($rootScope, $scope, $stateParams, $q, $location, $window, $timeout, ERPiaAPI, statisticService) {
		var request = null;
		$scope.gu = 1;
		function deleteRow()
		{
			var tbGrid = $("table[name=tbGrid]");
			console.log(tbGrid);
			var tRow = "";
			if (tbGrid.length > 0)
			{
				for (a=0; a<tbGrid.length; a++)
				{
					tbGrid.remove(); 
				}
			}
		}
		function commaChange(Num)
		{
			fl="" 
			Num = new String(Num) 
			temp="" 
			co=3 
			num_len=Num.length 
			while (num_len>0)
			{ 
				num_len=num_len-co 
				if(num_len<0)
				{
					co=num_len+co;
					num_len=0
				} 
				temp=","+Num.substr(num_len,co)+temp 
			} 
			rResult =  fl+temp.substr(1);
			return rResult;
		}
		function insertRow(data, kind)
		{
			var strHtml = "";
			var strSubject = "";
			var strSubgu="";
			
			switch($('input[name=gu_hidden]').val()){
				case "1": strSubgu = " (주간)"; break;
				case "2": strSubgu = " (월간)"; break;
				case "3": strSubgu = " (년간)"; break;
			}
			console.log('kind_name : ', kind);
			switch (kind)
			{
				case "meaip_jem" :
					strHtml = "<tr><th style='color:white'>순번</th><th style='color:white'>구분</th><th style='color:white'>금액</th></tr>";
					strSubject = "거래처별 매입 점유율 TOP 10" + strSubgu;
					break;
				case "meachul_jem" :
					strHtml = "<tr><th style='color:white'>번호</th><th style='color:white'>사이트명</th><th style='color:white'>매출액</th></tr>";
					strSubject = "사이트별 매출 점유율"  + strSubgu ;
					break;
				case "brand_top5" :
					strHtml = "<tr><th style='color:white'>번호</th><th style='color:white'>브랜드명</th><th style='color:white'>수량</th><th style='color:white'>금액</th></tr>";
					strSubject = "브랜드별 매출 TOP 5" + strSubgu;
					break;
				case "meachul_top5" :
					strHtml = "<tr><th style='color:white'>번호</th><th style='color:white'>상품명</th><th style='color:white'>수량</th><th style='color:white'>금액</th></tr>";
					strSubject = "상품별 매출 TOP 5" + strSubgu;
					break;
				case "scm" :
					strHtml = "<tr><th style='color:white'>번호</th><th style='color:white'>구분</th><th style='color:white'>수량</th><th style='color:white'>금액</th></tr>";
					strSubject = "SCM " + strSubgu;
					break;
				case "Meachul_ik" :
					strHtml = "<tr><th style='color:white'>날짜</th><th style='color:white'>공급이익</th><th style='color:white'>매출이익</th><th style='color:white'>공급이익률</th><th style='color:white'>매출이익률</th></tr>";
					strSubject = "매출 이익 증감률" + strSubgu;
					break;
				case "meachul_7" :
					strHtml = "<tr><th style='color:white'>날짜</th><th style='color:white'>수량</th><th style='color:white'>금액</th></tr>";
					strSubject = "매출 실적 추이" + strSubgu;
					break;
				case "meaip_7" :
					strHtml = "<tr><th style='color:white'>날짜</th><th style='color:white'>금액</th><th style='color:white'>수량</th></tr>";
					strSubject = "매입 현황" + strSubgu;
					break;
				case "beasonga" :
					strHtml = "<tr><th style='color:white'>순번</th><th style='color:white'>구분</th><th style='color:white'>건수</th></tr>";
					strSubject = "최근 배송 현황" + strSubgu;
					break;
				case "beasong_gu" :
					strHtml = "<tr><th style='color:white'>순번</th><th style='color:white'>구분</th><th style='color:white'>선불</th><th style='color:white'>착불</th><th style='color:white'>신용</th></tr>";
					strSubject = "택배사별 구분 건수 통계" + strSubgu;
					break;
				case "meachul_onoff" :
					strHtml = "<tr><th style='color:white'>구분</th><th style='color:white'>금액</th></tr>";
					strSubject = "온오프라인 비교 매출" + strSubgu;
					break;
				case "banpum" :
					strHtml = "<tr><th style='color:white'>날짜</th><th style='color:white'>수량</th><th style='color:white'>금액</th></tr>";
					strSubject = "매출 반품 현황" + strSubgu;
					break;
				case "banpum_top5" :
					strHtml = "<tr><th style='color:white'>번호</th><th style='color:white'>상품명</th><th style='color:white'>수량</th><th style='color:white'>금액</th></tr>";
					strSubject = "상품별 매출 반품 건수/반품액 TOP5" + strSubgu;
					break;
				case "meachul_cs" :
					strHtml = "<tr><th style='color:white'>번호</th><th style='color:white'>구분</th><th style='color:white'>건수</th></tr>";
					strSubject = "CS 컴플레인 현황" + strSubgu;
					break;
				case "meaip_commgoods" :
					strHtml = "<tr><th style='color:white'>번호</th><th style='color:white'>상품명</th><th style='color:white'>수량</th><th style='color:white'>금액</th></tr>";
					strSubject = "상품별 매입건수/매입액 TOP5" + strSubgu;
					break;
				case "JeGo_TurnOver" :
					strHtml = "<tr><th style='color:white'>순번</th><th style='color:white'>구분</th><th style='color:white'>선불</th><th style='color:white'>착불</th><th style='color:white'>신용</th></tr>";
					strSubject = "재고 회전률 TOP5" + strSubgu;
					break;
				case "beasongb" :
					strHtml = "<tr><th style='color:white'>순번</th><th style='color:white'>날짜</th><th style='color:white'>건수</th></tr>";
					strSubject = "배송 현황" + strSubgu;
					break;
			}

			$("div[name=gridSubject]").html("<font style='color:#000000; font-weight:bold;'>" + strSubject + "</font>");

			for (i=0, len=data.length; i<len; i++)
			{
				switch (kind)
				{
					case  "meaip_jem": case "meachul_jem" :
						strHtml = strHtml + "<tr>";
						strHtml = strHtml + "<td>";
						strHtml = strHtml +  (i+1) ;
						strHtml = strHtml + "</td>";
						strHtml = strHtml + "<td>";
						strHtml = strHtml + data[i].name;
						strHtml = strHtml + "</td>";
						strHtml = strHtml + "<td>";
						strHtml = strHtml + commaChange(data[i].value) + " ??";
						strHtml = strHtml + "</td>";
						strHtml = strHtml + "</tr>";
						break;
					case "meachul_top5" : case "brand_top5" : case "banpum_top5" : case "meaip_7" : case "meaip_commgoods" : case "scm" :
						strHtml = strHtml + "<tr>";
						strHtml = strHtml + "<td>";
						strHtml = strHtml +  (i+1) ;
						strHtml = strHtml + "</td>";
						strHtml = strHtml + "<td>";
						strHtml = strHtml + data[i].name;
						strHtml = strHtml + "</td>";
						strHtml = strHtml + "<td>";
						strHtml = strHtml + commaChange(data[i].su);
						strHtml = strHtml + "</td>";
						strHtml = strHtml + "<td>";
						strHtml = strHtml + commaChange(data[i].value) + " ??";
						strHtml = strHtml + "</td>";
						strHtml = strHtml + "</tr>";
						break;
					case "Meachul_ik" :
						strHtml = strHtml + "<tr>";
						strHtml = strHtml + "<td>";
						strHtml = strHtml + data[i].name;
						strHtml = strHtml + "</td>";
						strHtml = strHtml + "<td>";
						strHtml = strHtml +  commaChange(data[i].value1) + " ??";
						strHtml = strHtml + "</td>";
						strHtml = strHtml + "<td>";
						strHtml = strHtml + commaChange(data[i].value2) + " ??";
						strHtml = strHtml + "</td>";
						strHtml = strHtml + "<td>";
						strHtml = strHtml + commaChange(data[i].su1) + " %";
						strHtml = strHtml + "</td>";
						strHtml = strHtml + "<td>";
						strHtml = strHtml + commaChange(data[i].su2) + " %";
						strHtml = strHtml + "</td>";
						strHtml = strHtml + "</tr>";
						break;
					case "meachul_cs": case "beasonga": case "beasongb" :
						strHtml = strHtml + "<tr>";
						strHtml = strHtml + "<td>";
						strHtml = strHtml +  (i+1) ;
						strHtml = strHtml + "</td>";
						strHtml = strHtml + "<td>";
						strHtml = strHtml + data[i].name;
						strHtml = strHtml + "</td>";
						strHtml = strHtml + "<td>";
						strHtml = strHtml + commaChange(data[i].value) + " ??";
						strHtml = strHtml + "</td>";
						strHtml = strHtml + "</tr>";
						break;
					case "meachul_onoff" :
						strHtml = strHtml + "<tr>";
						strHtml = strHtml + "<td>";
						strHtml = strHtml + data[i].name;
						strHtml = strHtml + "</td>";
						strHtml = strHtml + "<td>";
						strHtml = strHtml + commaChange(data[i].value) + " ??";
						strHtml = strHtml + "</td>";
						strHtml = strHtml + "</tr>";
						break;
					case  "meachul_7": case "banpum": case "meaip_7":
						strHtml = strHtml + "<tr>";
						strHtml = strHtml + "<td>";
						strHtml = strHtml + data[i].name;
						strHtml = strHtml + "</td>";
						strHtml = strHtml + "<td>";
						strHtml = strHtml + commaChange(data[i].su);
						strHtml = strHtml + "</td>";
						strHtml = strHtml + "<td>";
						strHtml = strHtml + commaChange(data[i].value) + " ??";
						strHtml = strHtml + "</td>";
						strHtml = strHtml + "</tr>";
						break;
					case  "beasong_gu" :
						strHtml = strHtml + "<tr>";
						strHtml = strHtml + "<td>";
						strHtml = strHtml +  (i+1) ;
						strHtml = strHtml + "</td>";
						strHtml = strHtml + "<td>";
						strHtml = strHtml + data[i].name;
						strHtml = strHtml + "</td>";
						strHtml = strHtml + "<td>";
						strHtml = strHtml + commaChange(data[i].value) + " ??";
						strHtml = strHtml + "</td>";
						strHtml = strHtml + "<td>";
						strHtml = strHtml + commaChange(data[i].value1) + " ??";
						strHtml = strHtml + "</td>";
						strHtml = strHtml + "<td>";
						strHtml = strHtml + commaChange(data[i].value2) + " ??";
						strHtml = strHtml + "</td>";
						strHtml = strHtml + "</tr>";
						break;
					default :
						strHtml = strHtml + "<tr>";
						strHtml = strHtml + "<td>";
						strHtml = strHtml + "</td>";
						strHtml = strHtml + "</tr>";
						break;
				}
			}
			console.log('strHtml', strHtml);
			$("table[name=tbGrid]").append(strHtml);
		}
		AmCharts.loadJSON = function(url, load_kind) {	
			console.log(url);

			// create the request
			if (window.XMLHttpRequest) {
			// IE7+, Firefox, Chrome, Opera, Safari
			var request = new XMLHttpRequest();
			} else {
			// code for IE6, IE5
			var request = new ActiveXObject('Microsoft.XMLHTTP');
			}

			request.onreadystatechange = callback;

			request.open('POST', url, false);
			request.send();
			var tmpAlert = "최근갱신일 : ";
			if (load_kind == "refresh")
			{
				response = eval(request.responseText);	  
				$.each(response[0], function(index, jsonData){
							tmpAlert += jsonData;
				});
				$("h3[name=refresh_date]").html(tmpAlert);
			}
			if (load_kind == "gridInfo")
			{
				deleteRow();
				response = eval(request.responseText);
				$.each(response[0], function(index, jsonData){
					tmpAlert += jsonData;
				});
				console.log('htmlTable : ', response);
				//상세보기 그리드 생성
				insertRow(response, $scope.kind);    
			}
			console.log(request.responseText);
			return eval(request.responseText);

			function callback()
			{
				if(request.readyState == 1 || request.readyState == 2 || request.readyState == 3)
				{
					$("#loading").css("display","block");
				}
				else if(request.readyState == 4)
				{
					 if (request.status == 200)
					{
						$("#loading").css("display","none");
					}
				}
			};
		};
		statisticService.title('myPage_Config_Stat', 'select_Title', $scope.loginData.Admin_Code, $rootScope.loginState, $scope.loginData.UserId)
		.then(function(data){
			$scope.tabs = data;
		})

		// $scope.onSlideMove = function(data) {
		// 	if(indexList.indexOf(data.index) < 0){
		// 		indexList.push(data.index);
		// 	}
		// };
		$scope.kind= '', $scope.htmlCode= '';

		$scope.onSlideMove = function(data) {
			console.log("You have selected " + data.index + " tab");
			var titles =  [{Idx:0, title:"홈"}
				, {Idx:1, title:"meaip_jem"}
				, {Idx:2, title:"meachul_jem"}
				, {Idx:3, title:"brand_top5"}
				, {Idx:4, title:"meachul_top5"}
				, {Idx:5, title:"Meachul_ik"}
				, {Idx:6, title:"meachul_7"}
				, {Idx:7, title:"meaip_7"}
				, {Idx:8, title:"beasonga"}
				, {Idx:9, title:"beasong_gu"}
				, {Idx:10, title:"meachul_onoff"}
				, {Idx:11, title:"banpum"}
				, {Idx:12, title:"banpum_top5"}
				, {Idx:13, title:"meachul_cs"}
				, {Idx:14, title:"meaip_commgoods"}
				, {Idx:15, title:"JeGo_TurnOver"}
				, {Idx:16, title:"beasongb"}];

			if (data.index > 0){
				statisticService.chart('myPage_Config_Stat', 'select_Chart', $scope.loginData.Admin_Code, $rootScope.loginState, $scope.loginData.UserId, data.index)
				.then(function(response){
					console.log('response', response);
					$rootScope.kind = 'chart' + response.list[0].idx;
					switch (response.list[0].idx)
					{
						case '1' : $scope.kind = titles[1].title; break;
						case '2' : $scope.kind = titles[2].title; break;
						case '3' : $scope.kind = titles[3].title; break;
						case '4' : $scope.kind = titles[4].title; break;
						case '6' : $scope.kind = titles[5].title; break;
						case '7' : $scope.kind = titles[6].title; break;
						case '8' : $scope.kind = titles[7].title; break;
						case '9' : $scope.kind = titles[8].title; break;
						case '10' : $scope.kind = titles[9].title; break;
						case '11' : $scope.kind = titles[10].title; break;
						case '12' : $scope.kind = titles[11].title; break;
						case '13' : $scope.kind = titles[12].title; break;
						case '14' : $scope.kind = titles[13].title; break;
						case '15' : $scope.kind = titles[14].title; break;
						case '16' : $scope.kind = titles[15].title; break;
						case '17' : $scope.kind = titles[16].title; break;
					}
					if($scope.kind === "meachul_onoff"){
						$scope.htmlCode = '<input type="hidden" name="gu_hidden">' +
								'<div class="direct-chat">'+
									'<div class="box-header">'+
										'<button class="btn btn-default btn-sm dropdown-toggle" data-toggle="" onclick="javascript:refresh(\'' + $scope.kind +'\',\'' + $scope.gu + '\',\'' + $scope.loginData.Admin_Code + '\',\'' + ERPiaAPI.url + '\');"><i class="fa fa-refresh"></i></button>&nbsp;&nbsp;&nbsp;'+
										'<h3 class="box-title" name="refresh_date" style="color:#fff"></h3>&nbsp;&nbsp;&nbsp;&nbsp;'+
										'<div class="pull-right">'+
										'<button name="btnGrid" class="btn btn-box-tool" ><i class="fa fa-bars"></i></button>'+
										'</div>'+
										'<div name="loading">로딩중...</div>'+
										'<div name="loading2"></div>'+
									'</div>'+
									'<div class="box-body" style="padding:10px 0px;">'+
										'<div id=\"'+$scope.kind+'\" style="width: 100%; height: 300px;"></div>'+
										'<div name="gridBody" height: 320px; ">'+
											'<ul class="contacts-list">'+
												'<li>'+
													'<div name="gridSubject" class="callout callout-info" style="padding:5px; text-align:center;"><font style="color:#000000; font-weight:bold;"></font></div>'+
													'<table name="tbGrid" class="table table-bordered" style="font-size:12px; margin-bottom:10px;">'+
													'</table>'+
													'<div style="width:100%; text-align:center;">'+
														'<button name="btnGridClose" class="btn bg-orange margin">닫기</button>'+
													'</div>'+
												'</li>'+
											'</ul>'+
										'</div>'+
									'</div>'+
								'</div>';
					}else{
						$scope.htmlCode = '<input type="hidden" name="gu_hidden">' +
								'<div class="direct-chat">'+
									'<div class="box-header">'+
										'<button class="btn btn-default btn-sm dropdown-toggle" data-toggle="" onclick="javascript:refresh(\''+ $scope.kind +'\',\''+$scope.gu+'\',\''+ $scope.loginData.Admin_Code +'\',\'' + ERPiaAPI.url + '\');"><i class="fa fa-refresh"></i></button>&nbsp;&nbsp;&nbsp;'+
										'<h3 class="box-title" name="refresh_date" style="color:#fff"></h3>&nbsp;&nbsp;&nbsp;&nbsp;'+
										'<div class="pull-right">'+
										'<button name="btnW" class="btn bg-purple btn-xs" onclick="makeCharts(\''+ $scope.kind +'\',\'1\',\''+ $scope.loginData.Admin_Code +'\',\'' + ERPiaAPI.url + '\');">주간</button>'+
										'<button name="btnM" class="btn bg-purple btn-xs" onclick="makeCharts(\''+ $scope.kind +'\',\'2\',\''+ $scope.loginData.Admin_Code +'\',\'' + ERPiaAPI.url + '\');">월간</button>'+
										'<button name="btnY" class="btn bg-purple btn-xs" onclick="makeCharts(\''+ $scope.kind +'\',\'3\',\''+ $scope.loginData.Admin_Code +'\',\'' + ERPiaAPI.url + '\');">년간</button>&nbsp;&nbsp;&nbsp;&nbsp;'+
										'<button name="btnGrid" class="btn btn-box-tool"><i class="fa fa-bars"></i></button>'+
										'</div>'+
										'<div name="loading">로딩중...</div>'+
										'<div name="loading2"></div>'+
									'</div>'+
									'<div class="box-body" style="padding:10px 0px;">'+
										'<div id=\"'+$scope.kind+'\" style="width: 100%; height: 300px;"></div>'+
										'<div name="gridBody" height: 320px; ">'+
											'<ul class="contacts-list">'+
												'<li>'+
													'<div name="gridSubject" class="callout callout-info" style="padding:5px; text-align:center;"><font style="color:#000000; font-weight:bold;"></font></div>'+
													'<table name="tbGrid" class="table table-bordered" style="font-size:12px; margin-bottom:10px;">'+
													'</table>'+
													'<div style="width:100%; text-align:center;">'+
														'<button name="btnGridClose" class="btn bg-orange margin">닫기</button>'+
													'</div>'+
												'</li>'+
											'</ul>'+
										'</div>'+
									'</div>'+
								'</div>';
					}

					makeCharts($scope.kind,$scope.gu,$scope.loginData.Admin_Code,ERPiaAPI.url);
					renewalDay($scope.kind,$scope.gu,$scope.loginData.Admin_Code,ERPiaAPI.url);
					switch(data.index){
						case 1: $('#s1').html($scope.htmlCode); break;
						case 2: $('#s2').html($scope.htmlCode); break;
						case 3: $('#s3').html($scope.htmlCode); break;
						case 4: $('#s4').html($scope.htmlCode); break;
						case 5: $('#s5').html($scope.htmlCode); break;
						case 6: $('#s6').html($scope.htmlCode); break;
						case 7: $('#s7').html($scope.htmlCode); break;
						case 8: $('#s8').html($scope.htmlCode); break;
						case 9: $('#s9').html($scope.htmlCode); break;
						case 10: $('#s10').html($scope.htmlCode); break;
						case 11: $('#s11').html($scope.htmlCode); break;
						case 12: $('#s12').html($scope.htmlCode); break;
						case 13: $('#s13').html($scope.htmlCode); break;
						case 14: $('#s14').html($scope.htmlCode); break;
						case 15: $('#s15').html($scope.htmlCode); break;
						case 16: $('#s16').html($scope.htmlCode); break;
						case 17: $('#s17').html($scope.htmlCode); break;
					}
					// $('div[name=gridBody]').hide();
					$("button[name=btnGrid]").click(function() {
						console.log('gridBody_css : ', $('div[name=gridBody]').css('display'));
						if ($('div[name=gridBody]').css('display') == 'none') {
							$('div[name=gridBody]').css('display','block');
							$('#' + $scope.kind).css('display', 'none');
							$scope.gu = $("input[name=gu_hidden]").val();
							AmCharts.loadJSON(ERPiaAPI.url + "/JSon_Proc_graph.asp?kind="+ $scope.kind +"&value_kind="+ $scope.kind +"&admin_code=" + $scope.loginData.Admin_Code + "&swm_gu=" + $scope.gu + "&Ger_code=" + $scope.userData.GerCode, "gridInfo");
						} else {
							$("div[name=gridBody]").css('display', 'none');
							$('#' + $scope.kind).css('display', 'block');
						}
					});
					$("button[name=btnGridClose]").click(function() {
						$("div[name=gridBody]").css('display', 'none');
						$('#' + $scope.kind).css('display', 'block');
					});
				})
			}
        };
        
	}
);
