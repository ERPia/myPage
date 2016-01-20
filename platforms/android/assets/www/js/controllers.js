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

angular.module('starter.controllers', ['starter.services', 'ionic', 'ngCordova', 'ionic.service.core', 'ionic.service.push', 'tabSlideBox', 'pickadate'])
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
		    	console.log(pushInfo)
		    	// console.log('pushUserRegist success ::[' + $rootScope.token + ']');
		    },function(){
				/*alert('pushUserRegist fail')*/	
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
		}else{
			switch($rootScope.userType){
				case 'ERPia': userType ='E'; break;
				case 'SCM': userType = 'S'; break;
				case 'Normal': userType = 'N'; break;
			}
			if(ERPiaAPI.toast == 'Y'){
				uuidService.saveUUID($cordovaDevice.getUUID(), $scope.loginData.Admin_Code, userType, $scope.loginData.UserId, $scope.loginData.Pwd);	
			}else{
				switch($rootScope.userType){
					case 'SCM':response.data.list[i].UserId환
						$scope.loginData.Admin_Code = 'onz';
						$scope.loginData.UserId = '1111';
						$scope.loginData.Pwd = '1234';
					break;
					case 'ERPia':
						$scope.loginData.Admin_Code = 'pikachu';
						$scope.loginData.UserId = 'khs239';
						$scope.loginData.Pwd = '1234';
					break;
					/*case 'ERPia':
						$scope.loginData.Admin_Code = 'pikachu';
						$scope.loginData.UserId = 'test';
						$scope.loginData.Pwd = '1234';
					break;*/
					/*case 'ERPia':
						$scope.loginData.Admin_Code = 'onz';
						$scope.loginData.UserId = 'lhk';
						$scope.loginData.Pwd = 'alsdud0125!';
					break;*/
				}
			}
		}
		// console.log('autoLogin : ', $rootScope.autologin_YN);
		// if($rootScope.autologin_YN) {
		// 	var userType = '';
			
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

.controller('tradeCtrl', function($scope, $state, $ionicSlideBoxDelegate, $cordovaToast, $ionicModal, $ionicHistory, $location
	, tradeDetailService, ERPiaAPI){
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
		cordova.plugins.printer.isAvailable(
		    function (isAvailable) {
		    	// URI for the index.html
				//var page = 'www.erpia.net/mobile/trade_Detail.asp';
				var page = document.getElementById('divTradeDetail_Print_Area');
				cordova.plugins.printer.print(page, 'Document.html', function () {
				    alert('printing finished or canceled')
				});
		    }
		);
	}
	// create canvas object
	// function getCanvas(form, a4){
	// 	form.width((a4[0]*1.33333) -80).css('max-width','none');
	// 	return html2canvas(form,{imageTimeout:2000,removeContainer:true}); 
	// }
	// // function createPDF(form){
	// // 	getCanvas().then(function(canvas){
	// // 	var img = canvas.toDataURL("image/png"), doc = new jsPDF({unit:'px', format:'a4'});     
	// // 		doc.addImage(img, 'JPEG', 20, 20);
	// // 		doc.save('techumber-html-to-pdf.pdf');
	// // 		form.width(cache_width);
	// // 	});
	// // }
	// $scope.createPDF = function(){
	// 	// for a4 size paper width and height
	// 	var form = $('.form'), cache_width = form.width(), a4  =[ 595.28,  841.89];
	// 	$('body').scrollTop(0);
	// 	getCanvas(form, a4).then(function(canvas){
	// 		var img = canvas.toDataURL("image/png"), doc = new jsPDF({unit:'px', format:'a4'});     
	// 		doc.addImage(img, 'JPEG', 20, 20);
	// 		doc.save('techumber-html-to-pdf.pdf');
	// 		form.width(cache_width);
	// 	})
	// }
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
	if($scope.loginData.autologin_YN == 'Y') $scope.autoLogin = true;
	else $scope.autoLogin = false;
	$scope.autoLogin_YN = function(check){
		if(check) uuidService.saveUUID($rootScope.deviceInfo.uuid, $scope.loginData.Admin_Code, $rootScope.loginState, $scope.loginData.UserId, $scope.loginData.Pwd, 'Y')
		else uuidService.saveUUID($rootScope.deviceInfo.uuid, $scope.loginData.Admin_Code, $rootScope.loginState, $scope.loginData.UserId, $scope.loginData.Pwd, 'N')
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
			rsltList = '0^T^|1^T^|2^T^|3^T^|4^T^|5^T^|6^T^|';
			alarmService.save('save_Alarm', $scope.loginData.Admin_Code, $rootScope.loginState, $scope.loginData.UserId, rsltList);
			$scope.fnAlarm('checkAll');
		}
		else{
			$scope.settingsList = [];
			rsltList = '0^F^|1^F^|2^F^|3^F^|4^F^|5^F^|6^F^|';
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

.controller('CsCtrl', function($rootScope, $scope, $ionicModal, $timeout, $stateParams, $location, $http, csInfoService, TestService){
	console.log("CsCtrl");
	$scope.csData = {};

	var ChkinterestTopic = [];
	$scope.interestTopic1 = "";
	$scope.interestTopic2 = "";
	$scope.interestTopic3 = "";

	var csResigtData = [];
	$scope.interestTopicRemoveYN = "";

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
	
	var updated = 0;
	$scope.$watch('csData.interestTopic', function(newValue, oldValue, oldValue2) {
		if (newValue === oldValue || newValue === oldValue2 || oldValue === oldValue2) {
				return;
		}
		switch(updated){
			case 0: ChkinterestTopic[0] = $scope.csData.interestTopic; updated++; $scope.interestTopic1 = ChkinterestTopic[0]; $scope.interestTopicRemoveYN = "Y"; break;
			case 1: ChkinterestTopic[1] = $scope.csData.interestTopic; updated++; $scope.interestTopic2 = ' /' + ChkinterestTopic[1]; break;
			case 2: ChkinterestTopic[2] = $scope.csData.interestTopic; updated = 0; $scope.interestTopic3 = ' /' + ChkinterestTopic[2]; break;
		}
		console.log(ChkinterestTopic);
		},true
	);
		
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
  		var errMsg = "";
  		csResigtData[0] = $scope.csData.comName;
	  	csResigtData[1] = $scope.csData.writer;
	  	csResigtData[2] = $scope.csData.subject;
	  	csResigtData[3] = $scope.csData.tel;
	  	csResigtData[4] = $scope.csData.sectors;
	  	csResigtData[5] = $scope.interestTopic1;
	  	csResigtData[6] = $scope.interestTopic2;
	  	csResigtData[7] = $scope.interestTopic3;
	  	csResigtData[8] = $scope.csData.inflowRoute;
	  	csResigtData[9] = $scope.csData.contents;

	  	if(!$scope.csData.comName != ''){
	  		errMsg += "회사명";
	  	}
	  	if(!$scope.csData.subject != ''){
	  		errMsg += "/제목";
	  	}
	  	if(!$scope.csData.tel != ''){
	  		errMsg += "/연락처";
	  	}
	  	if(!$scope.csData.sectors != ''){
	  		errMsg += "/업종"
	  	}
	  	if(!csResigtData[5] != ''){
	  		errMsg += "/관심항목";
	  	}
	  	if(!$scope.csData.inflowRoute != ''){
	  		errMsg += "/유입경로";
	  	}
	  	if(!$scope.csData.contents != ''){
	  		errMsg += "/문의사항";
	  	}
	  	if(errMsg != ""){
	  		console.log(errMsg + "쓰셈");
	  		if(errMsg.substring(0, 1) == "/"){
	  			errMsg = errMsg.replace("/", "");
	  		}
	  		alert(errMsg + " 은(는) 필수 입력 항목입니다.")
	  	}else{
			// Admin_Code, UserId, kind, chkAdmin, comName, writer, subject, tel, sectors, interestTopic1,interestTopic2, interestTopic3, inflowRoute, contents
			csInfoService.csInfo($scope.loginData.Admin_Code, $scope.loginData.UserId, 'Mobile_CS_Save', $rootScope.loginState, escape(csResigtData[0]),
								 escape(csResigtData[1]), escape(csResigtData[2]), escape(csResigtData[3]), escape(csResigtData[4]), escape(csResigtData[5]),
								 escape(csResigtData[6]), escape(csResigtData[7]), escape(csResigtData[8]), escape(csResigtData[9]))
		    .then(function(csInfo){
		    	alert('등록 성공');
		    },function(){
				alert('등록 실패')	
			});
		};
	};

	$scope.interestTopicRemove = function() {
		$scope.interestTopic1 = "";
		$scope.interestTopic2 = "";
		$scope.interestTopic3 = "";
		$scope.interestTopicRemoveYN = "N";
		updated = 0;
	}

	// //test 용 OT201304100001
	// $scope.csRegist2 = function() {
 // 	 	console.log($scope.csData);
	// 	// TestService.testInfo('onz','yyk0628', 'ERPia_Meaip_Select_Master', 'Select_ILNo', 'Ip201512030001')
	// 	// TestService.testInfo('onz','yyk0628', 'ERPia_Sale_Select_Master', 'Select_Date', '2015-11-01', '2015-12-03')
	// 	// TestService.testInfo('onz','yyk0628', 'ERPia_Meaip_Select_Detail', '', 'Ip201512020001')
	// 	// TestService.testInfo('onz','yyk0628', 'ERPia_Meaip_Select_GerName', '', 'g')
	//     // TestService.testInfo('onz','yyk0628', 'ERPia_Meaip_Select_Place_CName', 'Select_Place')
	//     // TestService.testInfo('onz','yyk0628', 'ERPia_Meaip_Select_Place_CName', 'Select_CName', '001')
	// 	// TestService.testInfo('onz','yyk0628', 'ERPia_Meaip_Select_Goods', 'Select_GoodsName', 'ra')
	// 	// TestService.testInfo('onz','yyk0628', 'ERPia_Meaip_Select_Goods', 'Select_G_OnCode', 'erpia:SFSELFAA0000036')
	// 	// TestService.testInfo('onz','yyk0628', 'ERPia_Sale_Select_Goods', 'Select_G_Code', '9806200718567')
	// 	// TestService.testInfo('onz','yyk0628', 'ERPia_Meaip_Select_Goods', 'Select_GI_Code', '5555')
		
	// 	//되는거
	// 	// TestService.testInfo('pikachu','khs239', 'ERPia_Meaip_Insert_Goods', '', escape('<root><MeaipM><Admin_Code>onz</Admin_Code><Meaip_Date>2015-12-21</Meaip_Date><GuMeaCom_Code>02474</GuMeaCom_Code><Meaip_Amt>2200000</Meaip_Amt><Sale_Place>001</Sale_Place><Remk> <![CDATA[띄어쓰기 테스트 입니다 /?!]]> </Remk></MeaipM><MeaipT><item><seq>1</seq><ChangGo_Code>122</ChangGo_Code><subul_kind>224</subul_kind><G_Code>9808316000018</G_Code><G_name> <![CDATA[띄어쓰기 테스트 상품 ㅁ ㅁ ㅁ]]> </G_name><G_stand> <![CDATA[]]> </G_stand><G_Price>1004</G_Price><G_Qty>200</G_Qty><G_vat>1800</G_vat></item><item><seq>2</seq><ChangGo_Code>122</ChangGo_Code><subul_kind>224</subul_kind><G_Code>9806200718690</G_Code><G_name> <![CDATA[하이퍼볼]]> </G_name><G_stand> <![CDATA[더잘잡힘]]> </G_stand><G_Price>2000</G_Price><G_Qty>15</G_Qty><G_vat>1800</G_vat></item><item><seq>3</seq><ChangGo_Code>122</ChangGo_Code><subul_kind>224</subul_kind><G_Code>9806200718690</G_Code><G_name> <![CDATA[하이퍼볼]]> </G_name><G_stand> <![CDATA[더잘잡힘]]></G_stand><G_Price>2000</G_Price><G_Qty>15</G_Qty><G_vat>1800</G_vat></item></MeaipT></root>'))
	// 	//안되는거 
	// 	TestService.testInfo('pikachu','khs239', 'ERPia_Meaip_Insert_Goods', '', escape('<root><MeaipM><Admin_Code>pikachu</Admin_Code><Meaip_Date>2015-12-21</Meaip_Date><GuMeaCom_Code>00001</GuMeaCom_Code><Meaip_Amt>0</Meaip_Amt><Sale_Place>023</Sale_Place><Remk><![CDATA[d d]]></Remk></MeaipM><MeaipT><item><seq>1</seq><ChangGo_Code>101</ChangGo_Code><subul_kind>111</subul_kind><G_Code>9806200720639</G_Code><G_name><![CDATA[ss]]></G_name><G_stand><![CDATA[]]></G_stand><G_Price>0</G_Price><G_Qty>1</G_Qty><G_vat>1800</G_vat></item></MeaipT></root>'))
	// 	// erpia.net/include/ERPiaApi_TestProject.asp?Admin_Code=onz&User_id=pikapika&Kind=ERPia_Meaip_Insert_Goods&Mode=&RequestXml=<root><MeaipM><Admin_Code>onz</Admin_Code><Meaip_Date>2015-12-21</Meaip_Date><GuMeaCom_Code>99921</GuMeaCom_Code><Meaip_Amt>0</Meaip_Amt><Sale_Place>023</Sale_Place><Remk><![CDATA[d d]]></Remk></MeaipM><MeaipT><item><seq>1</seq><ChangGo_Code>101</ChangGo_Code><subul_kind>111</subul_kind><G_Code>9806200720639</G_Code><G_name><![CDATA[ss]]></G_name><G_stand><![CDATA[]]></G_stand><G_Price>0</G_Price><G_Qty>1</G_Qty><G_vat>1800</G_vat></item></MeaipT></root>
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
			//console.log('data', data);
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
//////////////////////////////////////////					매입 테스트					//////////////////////////////////////////////
.controller('chartTestCtrl', function($scope, $sce, $rootScope, testLhkServicse, dayService, ERPiaAPI, $cordovaToast){

		$scope.date={
			sdate : '',
			edate : ''
		}
		/* 날짜계산 */
		$scope.dateMinus=function(days){

		    var nday = new Date();  //오늘 날짜  
		    nday.setDate(nday.getDate() - days); //오늘 날짜에서 days만큼을 뒤로 이동 

		    var yy = nday.getFullYear();
		    var mm = nday.getMonth()+1;
		    var dd = nday.getDate();

		    if( mm<10 ) mm = "0" + mm;
		    if( dd<10 ) dd = "0" + dd;

		    return yy + "-" + mm + "-" + dd;

		}
		$rootScope.today = $scope.dateMinus(0);

    	//날짜별 검색
    	$scope.searchestoday = function(day){

    		if(day == 100){
    			console.log('사용자 입력data');
    			alert($scope.date.sdate);
    			alert($scope.date.edate);
    			$scope.sdate1=new Date($scope.date.sdate);
    			$scope.edate1=new Date($scope.date.edate);
    		}else if(day == 0){
    			console.log('금일data');
    			$scope.date.sdate = $scope.dateMinus(0);
    			$scope.date.edate = $scope.dateMinus(0);
    		}else if(day == 7){
    			console.log('1주일data');
    			$scope.date.sdate = $scope.dateMinus(7);
    			$scope.date.edate = $scope.dateMinus(0);
    		}else{
    			console.log('한달data');
    			$scope.date.sdate = $scope.dateMinus(30);
    			$scope.date.edate = $scope.dateMinus(0);
    		}
    		dayService.day($scope.date.sdate, $scope.date.edate, $scope.loginData.Admin_Code, $scope.loginData.UserId)
			.then(function(data){
				$scope.lists = data.list;
				console.log("?->" , data.list);
			})
    	};
//////////////////////////////////////////////////////////////////////////

$scope.sDate1= new Date();
$scope.eDate1= new Date();
	$scope.mydate1=function(sdate1){
	    var nday = new Date(sdate1);  //선택1 날짜..  
	    var yy = nday.getFullYear();
	    var mm = nday.getMonth()+1;
	    var dd = nday.getDate();
    	if( mm<10) mm="0"+mm;
		if( dd<10) dd="0"+dd;

	    $scope.date.sdate = yy + "-" + mm + "-" + dd;
	    $scope.sDate1=new Date(sdate1);
	 	console.log('선택날짜:'+$scope.date.sdate + $scope.sDate1);
	};

	$scope.mydate2=function(edate1){
	    var nday = new Date(edate1);  //선택2 날짜..  
	    var yy = nday.getFullYear();
	    var mm = nday.getMonth()+1;
	    var dd = nday.getDate();

	    if( mm<10) mm="0"+mm;
	    if( dd<10) dd="0"+dd;

	    $scope.date.edate = yy + "-" + mm + "-" + dd;
	    $scope.sDate1=new Date(edate1);
	 	console.log('선택날짜2:'+$scope.date.edate);
	};
////////////////////////////////////////////////////////////////////////
    	$scope.listSearch = ''; //상품명 검색
		$scope.listindex = 5; //더보기 5개씩

		/* 더보기 처리 */
		 $scope.more=function(){
		  $scope.listindex = $scope.listindex + 5;
		 }

		 $scope.ionstar = "ion-android-star-outline";

		 /* 매입전표 조회 */
		 $scope.meaipChitF = function(lino){
		 	dayService.meaipChit(lino, $scope.loginData.Admin_Code, $scope.loginData.UserId)
			.then(function(data){
				$rootScope.meaipchitlists = data.list;
				console.log("?->" , data.list);
				/* 총 수량 & 가격 */
				$rootScope.qtysum = 0;//총 수량
		        $rootScope.pricesum = 0;//총 가격
		        for (var i = 0; i < $rootScope.meaipchitlists.length; i++) {
		          $rootScope.qtysum = parseInt($rootScope.qtysum) + parseInt($rootScope.meaipchitlists[i].G_Qty);
		          $rootScope.gop = parseInt($rootScope.meaipchitlists[i].G_Qty)*parseInt($rootScope.meaipchitlists[i].G_Price);
		          $rootScope.pricesum = parseInt($rootScope.pricesum) + parseInt($rootScope.gop);
		      	}
		      	//즐겨찾기 부분
		      	$scope.ionstar = "ion-android-star-outline"; // ion-android-star 
		      	console.log('icon check=', $scope.ionstar);
				location.href="#/app/meaipChit";
			})
		 }
		 $rootScope.testtest = function(){
		 	alert('1234');
		 }
		 $scope.meaipState=0;
		 /*더보기버튼*/
		 /*$scope.lastsclick = function(index) {
               
	            $ionicLoading.show({template:'<ion-spinner icon="spiral"></ion-spinner>'});

	            $timeout(function(){
	         $ionicLoading.hide();
	         $scope.loginData = {};
	         $scope.userData = {};
	         $scope.dashBoard = {};


	         $scope.lasts=index+5;
	      }, 1000); //더보기 클릭시 $index+5

	            
	    }*/
	    $scope.lasts=5; //결과값은 기본으로 0~4까지 5개 띄운다
		  $scope.lastsclick = function(index) {
		               
		  		$scope.loadingani();

		        $scope.lasts=index+5; //더보기 클릭시 $index+5
		    };
	    /*---------로딩화면-----------*/
		$rootScope.loadingani=function(){
		        $ionicLoading.show({template:'<ion-spinner icon="spiral"></ion-spinner>'});

		         $timeout(function(){
		         $ionicLoading.hide();


		         
		      }, 500); 
		}

		 $scope.meaipStar = function(){
		 	console.log('star');
		 	if($scope.meaipState == 0){
		 		$scope.ionstar = "ion-android-star";
		 		$scope.meaipState = 1;
		 		if(ERPiaAPI.toast == 'Y') $cordovaToast.show('빠른등록이 등록되었습니다.', 'long', 'center');
				else alert('빠른등록이 등록되었습니다.');

		 	}else{
		 		$scope.ionstar = "ion-android-star-outline";
		 		$scope.meaipState = 0;

		 		if(ERPiaAPI.toast == 'Y'){
		 			 $cordovaToast.show('빠른등록이 해제되었습니다.', 'long', 'center');
		 		}else{
		 			alert('빠른등록이 해제되었습니다.');
		 		} 
		 	}
		 }

})
.controller('meaipInsertCtrl', function($scope, $sce, $cordovaToast, $rootScope, $ionicPopup, $ionicHistory, $ionicModal, $cordovaBarcodeScanner, meaipService, mconfigService, ERPiaAPI){

	/*저장시킬 데이터*/

	/*거래처명 && 수불구분*/
	$scope.compo={
		userGerName : '', //user가 입력한 상품정보 (검색할때 사용)
		GerName : '', // 거래처검색명
		GerCode : 0, //거래처코드(매입등록 시 필요)
		subulkind : 0, // 수불지정 es) 111,122
		remk : '', // 관리비고
		paysubul : 0, // 지급구분 수불 ex) 701=현금 , 702=통장, 703=카트, 704=어음
		paycardbank : '', // 카드 은행정보
		payprice : 0 // 지급액
	};

	/*매입정보 체크*/
    $scope.MeaipData = {
    	cusCheck : 'f',
    	subulCheck : 'f',
    	meajangCheck :'f',
    	changoCheck : 'f'
    };

    /*매입 상품정보*/
    $scope.Meaipgoods={
    	userGoodsName : '',
    	userMode : 'Select_GoodsName',
    	totalsumprices : 0,
    	totalnum : 0
    };

    /*자동슬라이드*/
    $scope.basictype=true;
	$scope.basic2type=false;
	$scope.basic3type=false;
	$scope.upAnddown="ion-arrow-down-b";
	$scope.upAnddown2="ion-arrow-up-b";
	$scope.upAnddown3="ion-arrow-up-b";

	/*체크된상품 확인데이터*/
    $scope.checkedDatas=[];

    /*바코드상품 확인데이터*/
    $rootScope.barcodegood=[];

    /*상품검색 selectBoxList*/
    $scope.modeselectlist=[
    { Name: '상품명', Code: 'Select_GoodsName' },
    { Name: '자체코드', Code: 'Select_G_OnCode' },
    { Name: '상품코드', Code: 'Select_G_Code' },
    { Name: '공인바코드', Code: 'Select_GI_Code' }
    ];

    /*상품등록 리스트*/
    $scope.goodsaddlists=[];

    /*지급타입*/
    $scope.paytype = false;

    /*바코드구분*/
    $scope.barcheck = 'N';

    //기본설정데이터
	mconfigService.basicM($scope.loginData.Admin_Code, $scope.loginData.UserId)
	.then(function(data){
		$scope.mejanglists = data.list;// admin_code에 맞는 매장리스트저장.
			/*환경설정조회*/
			mconfigService.basicSetup($scope.loginData.Admin_Code, $scope.loginData.UserId)
			.then(function(data){
				$scope.configData = data; // 아이디에 저장된 환경설정 리스트 저장
				console.log('데이터 확인 =>', data);
				/*console.log('초기값?= ', $scope.configData.state);*/
					if($scope.configData.state == 1){
						console.log('저장환경설정이 없네요.');
					}else{
						/*환경설정 조회된 매장코드로 창고리스트 조회*/
						mconfigService.basicC($scope.loginData.Admin_Code, $scope.loginData.UserId, $scope.configData.basic_Place_Code)
						.then(function(data){
							$scope.changolists = data.list;
							$scope.MeaipData.meajangCheck = 't';
							$scope.MeaipData.changoCheck = 't';
							$scope.MeaipData.subulCheck = 't';
						})
						//매입 수불구분확인
						var i = $scope.configData.basic_Subul_Meaip;
						switch (i) {
						    case '1' : console.log('1'); 
						    		   switch($scope.configData.basic_Subul_Meaip_Before){
						    		   		case 'N' : console.log('N'); $scope.compo.subulkind=111; break;
						    		   		case 'I' : console.log('I'); $scope.compo.subulkind=111; break;
						    		   		case 'B' : console.log('B'); $scope.compo.subulkind=122; break;
						    		   }
						    		   break;
						    case '2' : console.log('2'); $scope.compo.subulkind=111; break;
						    case '3' : console.log('3'); $scope.compo.subulkind=122; break;

						    default : console.log('수불카인드 오류'); break;
						  }
						  console.log('=============================>',$scope.compo.subulkind);
					}
			})
	})

	$scope.dateMinus=function(days){

	    var nday = new Date();  //오늘 날짜..  
	    nday.setDate(nday.getDate() - days); //오늘 날짜에서 days만큼을 뒤로 이동 
	    var yy = nday.getFullYear();
	    var mm = nday.getMonth()+1;
	    var dd = nday.getDate();

	    if( mm<10) mm="0"+mm;
	    if( dd<10) dd="0"+dd;

	    return yy + "-" + mm + "-" + dd;
	}
	$scope.date={
		todate : '',
		payday : ''
	}
	$scope.datetypes='';
	$scope.date.todate=$scope.dateMinus(0); //오늘날짜 스코프
	$scope.date.payday=$scope.dateMinus(0);
	//데이트피커(캘린더)----------------------------------------------------------
	$ionicModal.fromTemplateUrl('test/datemodal.html', 
	        function(modal) {
	            $scope.datemodal = modal;
	        },
	        {
	        scope: $scope, 
	        animation: 'slide-in-up'
	        }
	    );
	    $scope.opendateModal = function(datetypes) {
	      $scope.datetypes=datetypes;
	      if(datetypes == 'payday'){
	      	$scope.modalmeaipDataRegi.hide();
	      }
	      $scope.datemodal.show();
	    };
	    $scope.closedateModal = function(modal) {
	      $scope.datemodal.hide();
	      if($scope.datetypes=='payday'){
		      $scope.date.payday = modal;
		      $scope.modalmeaipDataRegi.show();
		     }else if($scope.datetypes=='meaipdate'){
		      	$scope.date.todate = modal;
		     }
	      $scope.datetypes='';
	    };

    /* customerSearch modal */
	$ionicModal.fromTemplateUrl('test/customerSearch.html', {
	    scope: $scope
	}).then(function(modal) {
	    $scope.customerModal = modal;
	});

	/* customerSearch modal Show */
	$scope.cusSearch = function() {
	    $scope.customerModal.show();
	};

	/* customerSearch modal Close */
	$scope.cussearchClose = function() {
		$scope.customerDatas = ''; // data배열 초기화
		$scope.customerModal.hide();
	};

	/* goods Search modal */
    $ionicModal.fromTemplateUrl('test/goodsSearchModal.html', {
    scope: $scope
    }).then(function(modal) {
    $scope.goodsSearchmodesear = modal;
    });

    /* goods Search modal Show && Search */
    $scope.goodsSearch=function(division_num){
    	console.log('$scope.Meaipgoods.userGoodsName=', $scope.Meaipgoods.userGoodsName);
    	console.log('$scope.Meaipgoods.userMode=', $scope.Meaipgoods.userMode);
    	if(division_num == 1){
    		if($scope.Meaipgoods.userGoodsName.length > 0){
	    		meaipService.goodS($scope.loginData.Admin_Code, $scope.loginData.UserId, $scope.Meaipgoods.userMode, $scope.Meaipgoods.userGoodsName)
				.then(function(data){
					$scope.goodslists = data.list;
				})
    		}
    		$scope.goodsSearchmodesear.show();
    	}else{
    		if($scope.Meaipgoods.userGoodsName.length > 0){
	    		meaipService.goodS($scope.loginData.Admin_Code, $scope.loginData.UserId, $scope.Meaipgoods.userMode, $scope.Meaipgoods.userGoodsName)
				.then(function(data){
					$scope.goodslists = data.list;
				})
	    	}else{
	    		if(ERPiaAPI.toast == 'Y') $cordovaToast.show('상품정보를 입력해 주세요.', 'long', 'center');
				else alert('상품정보를 입력해 주세요.');
	    	}
    	}	
    }

    /* goods Search modal Close */
    $scope.closemodesear = function() {
    	$scope.Meaipgoods.userGoodsName = '';
    	//체크확인 배열 초기화
    	$scope.checkedDatas.splice(0, $scope.checkedDatas.length);
    	$scope.goodslists = '';
    	$scope.goodsSearchmodesear.hide();
    };

    /* meaip Insert modal */
	$ionicModal.fromTemplateUrl('test/meaipinsertM.html', {
	    scope: $scope
	}).then(function(modal) {
	    $scope.modalmeaipDataRegi = modal;
	});

    /* meaip Insert modal Show */
	$scope.meaipDataRegist = function() {
		$scope.Meaipgoods.totalnum = 0;
		for(var i=0; i<$scope.goodsaddlists.length; i++){
			$scope.Meaipgoods.totalnum = parseInt($scope.Meaipgoods.totalnum) + parseInt($scope.goodsaddlists[i].num);
		}
		//매입/상품정보 확인
		if($scope.compo.GerCode == 0 || $scope.compo.subulkind == 0 || $scope.MeaipData.meajangCheck == 'f' || $scope.MeaipData.changoCheck == 'f'){
			if(ERPiaAPI.toast == 'Y') $cordovaToast.show('매입정보가 바르게 입력되었는지 확인해주세요.', 'long', 'center');
			else alert('매입정보가 바르게 입력되었는지 확인해주세요.');
		}else if($scope.goodsaddlists.length == 0 ){
			if(ERPiaAPI.toast == 'Y') $cordovaToast.show('상품정보가 바르게 입력되었는지 확인해주세요.', 'long', 'center');
			else alert('상품정보가 바르게 입력되었는지 확인해주세요.');
		}else{
			console.log('매입정보, 상품정보 모두 바르게 입력.');
			$scope.modalmeaipDataRegi.show();
		}
	};

	/* meaip Insert modal Close */
	$scope.closemodeInsert = function() {
		$scope.modalmeaipDataRegi.hide();
	};

	/*매장코드로 창고조회*/
	$scope.Chango=function(){
		$scope.MeaipData.meajangCheck = 't';
		console.log('확인=>', $scope.configData);
		mconfigService.basicC($scope.loginData.Admin_Code, $scope.loginData.UserId, $scope.configData.basic_Place_Code)
		.then(function(data){
			$scope.changolists = data.list;
		})
	}

	/*거래처조회*/
    $scope.cus=function(){
    	var cusname = $scope.compo.userGerName;
    	meaipService.cusnameSearch($scope.loginData.Admin_Code, $scope.loginData.UserId, cusname)
		.then(function(data){
			$scope.customerDatas = data.list;
			$scope.GerName = '';
		})
    }
    /*거래처창고 조회후 값저장*/
    $scope.customerFunc=function(gname,gcode){
    	$scope.customerDatas = ''; // data배열 초기화
        $scope.compo.GerName=gname;
		$scope.compo.GerCode=gcode;
        $scope.MeaipData.cusCheck = 't';
      	$scope.customerModal.hide();
    }

    /* page up And down */
    $scope.meaipNext=function(){
    	if($scope.basictype == true){
    		$scope.basictype= false;
    		$scope.upAnddown="ion-arrow-up-b";
    	}else{
    		$scope.basictype=true;
    		$scope.upAnddown="ion-arrow-down-b";
    	}
    }
    $scope.meaipNext2=function(){
    	if($scope.basic2type == true){
    		$scope.basic2type= false;
    		$scope.upAnddown2="ion-arrow-up-b";
    	}else{
    		$scope.basic2type=true;
    		$scope.upAnddown2="ion-arrow-down-b";
    	}
    }
    $scope.meaipNext3=function(){
    	if($scope.basic3type == true){
    		$scope.basic3type= false;
    		$scope.upAnddown3="ion-arrow-up-b";
    	}else{
    		$scope.basic3type=true;
    		$scope.upAnddown3="ion-arrow-down-b";
    	}
    }

	$scope.Changosave=function(){
		$scope.MeaipData.changoCheck = 't';
	}

    $scope.checkup=function(){
   		console.log('checkup',$scope.MeaipData.cusCheck,$scope.MeaipData.subulCheck,$scope.MeaipData.meajangCheck,$scope.MeaipData.changoCheck);
    	if($scope.MeaipData.cusCheck == 't' && $scope.MeaipData.subulCheck == 't' && $scope.MeaipData.meajangCheck == 't' && $scope.MeaipData.changoCheck == 't'){
        	/*상품폼 열기*/
        	$scope.basic2type=true;
    		$scope.upAnddown2="ion-arrow-down-b";
    		/*매입폼닫기*/
    		$scope.basictype= false;
    		$scope.upAnddown="ion-arrow-up-b";
        }
    }

    /*상품체크박스*/
    $scope.goodsCheck=function(goodsdata){
    	/*console.log('체크박스=', goodsdata);*/
    	$scope.checkcaught='no';
    	console.log($scope.checkedDatas);

    	for(var i=0; i<$scope.checkedDatas.length; i++){
    		if($scope.checkedDatas[i] == goodsdata){
    			$scope.checkedDatas.splice(i, 1);
    			$scope.checkcaught='yes';
    			break;
    		}
    	}
    	if($scope.checkcaught != 'yes'){
    		$scope.checkedDatas.push(goodsdata);
    	}
    }
    $scope.bargoods={
    	num : 0
    };
	/*선택된 상품들을 등록리스트에 저장*/
    $scope.checkdataSave=function(){
    	console.log('여기왔어요.', $scope.barcheck);
		if($scope.goodsaddlists.length > 0){
			for(var j=0; j < $scope.goodsaddlists.length; j++){
				for(var o=0; o < $scope.checkedDatas.length; o++){
					if($scope.goodsaddlists[j].code == $scope.checkedDatas[o].G_Code){
						$ionicPopup.alert({
						     title: '('+ $scope.goodsaddlists[j].code +')<br>' + $scope.goodsaddlists[j].name,
						     template: '같은상품이 상품등록 리스트에 이미 존재합니다.'
						   });

						$scope.checkedDatas.splice(o, 1);
						break;
					}
				}
			}
		}
		for(var i=0; i < $scope.checkedDatas.length; i++){
			switch($scope.configData.basic_Dn_Meaip){
	    		case '1': console.log('매입가'); var price = $scope.checkedDatas[i].G_Dn1; break;
	    		case '2': console.log('도매가'); var price = $scope.checkedDatas[i].G_Dn2; break;
	    		case '3': console.log('인터넷가'); var price = $scope.checkedDatas[i].G_Dn3; break;
	    		case '4': console.log('소매가'); var price = $scope.checkedDatas[i].G_Dn4; break;
	    		case '5': console.log('권장소비자가'); var price = $scope.checkedDatas[i].G_Dn5; break;

	    		default : console.log('설정안되있습니다.'); break;
	    	}
	    	if($scope.barcheck == 'N'){
	    		$scope.goodsaddlists.push({
					name : $scope.checkedDatas[i].G_Name,
					num : 1,
					goodsprice : parseInt(price),
					code : $scope.checkedDatas[i].G_Code
				});
	    	}else{
	    		console.log('바코드스캔시 팝업띄울꺼야.');
	    		$rootScope.barcodegood.splice(0,1);
	    		$rootScope.barcodegood.push($scope.checkedDatas[i]);
	    		$ionicPopup.show({
				    template: '<input type="text" ng-model="bargoods.num">',
				    title: '('+ $scope.barcodegood[0].G_Code +')<br>' + $scope.barcodegood[0].G_Name,
				    subTitle: '수량을 입력해주세요.',
				    scope: $scope,
				    buttons: [
					           { text: '확인',
					            onTap: function(e){
					            	if($scope.bargoods.num != 0){
					            		$scope.goodsaddlists.push({
											name : $scope.barcodegood[0].G_Name,
											num : parseInt($scope.bargoods.num),
											goodsprice : parseInt(price),
											code : $scope.barcodegood[0].G_Code
										});
					            	}else{
					            		alert('0개는 등록 할 수 없습니다. 다시 시도해주세요.');
					            	}
					            	console.log('확인좀 =>', $scope.bargoods.num);
					            	
					            }},
					         ]
				  });
	    	}
			
		}
    	$scope.Meaipgoods.userGoodsName = '';
    	//체크확인 배열 초기화
    	$scope.checkedDatas.splice(0, $scope.checkedDatas.length);
    	$scope.goodslists = '';
    	$scope.barcheck = 'N';
    	$scope.goodsSearchmodesear.hide();
    	$scope.goods_totalprice1();
    }
 /////////////////////////////////////////////////////////////바코드///////////////////////////////////////////////////////////////////////////////////////////////////
    	$scope.scanBarcode = function() {
        $cordovaBarcodeScanner.scan().then(function(imageData) {
            console.log('format ' + imageData.format);
            	meaipService.barcode($scope.loginData.Admin_Code, $scope.loginData.UserId, imageData.text)
					.then(function(data){
						if(data == undefined){
							alert('일치하는 데이터가 없습니다.');
						}else{
							console.log('바코드 스캔 데이터 확인=', data);
							console.log('상품 개수는=?', data.list.length);
							for(var b=0; b < data.list.length; b++){
								console.log('for문안->', b);
								$scope.checkedDatas.push(data.list[b]);
								console.log('checkedDatas=>', $scope.checkedDatas[0].G_Code);
								$scope.barcheck = 'Y';
							}
							$scope.checkdataSave();
						}
					})
            }, function(error) {
            	console.log('an error ' + error);
            });
    	}
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /* 해당 상품리스트항목 삭제 */
     $scope.goodsDelete=function(index){
        $scope.goodsaddlists.splice(index,1);					
     }

	$scope.pay={
     	use : true
     };
     $scope.payment={
     	one : false,
     	two : false,
     	th : false,
     	fo : false
     };

     /*지급구분*/
     $scope.Payments_division=function(num){
     	$scope.paycardbank.splice(0,1);
     	$scope.compo.paycardbank = '';
		if(num == 1 && $scope.payment.one == true){
		    $scope.compo.paysubul = 701;
			$scope.payment.two = false;
			$scope.payment.th = false;
			$scope.payment.fo = false;
			$scope.paytype = false;
			$scope.pay.use = false;
			$scope.paycardbank.push({
	     		code : '',
	     		name : '',
	     		num : ''
	     	});$scope.paycardbank.push({
	     		code : '',
	     		name : '',
	     		num : ''
	     	});

		}else if(num == 2 && $scope.payment.two == true){
			$scope.payment.one = false;
			$scope.payment.th = false;
			$scope.payment.fo = false;
     		$scope.paytype = true;
     		$scope.paytype_bank = true;
     		$scope.paytype_card = false;
     		$scope.payname = '지급은행';
     		$scope.compo.paysubul = 702;
     		$scope.pay.use = false;
     		var kind = 'ERPia_Bank_Card_Select';
     		var mode = 'Select_Bank';
     		meaipService.paysearch($scope.loginData.Admin_Code, $scope.loginData.UserId, kind, mode)
			.then(function(data){
				$scope.paydatalist = data.list;
			})

		}else if(num == 3 && $scope.payment.th == true){
			$scope.payment.one = false;
			$scope.payment.two = false;
			$scope.payment.fo = false;
		    $scope.compo.paysubul = 704;
		    $scope.paytype = false;
		    $scope.pay.use = false;
		    $scope.paycardbank.push({
	     		code : '',
	     		name : '',
	     		num : ''
	     	});
	     	$scope.paycardbank.push({
	     		code : '',
	     		name : '',
	     		num : ''
	     	});

		}else if(num == 4 && $scope.payment.fo == true){
			$scope.payment.one = false;
			$scope.payment.two = false;
			$scope.payment.th = false;
     		$scope.paytype = true;
     		$scope.paytype_bank = false;
     		$scope.paytype_card = true;
     		$scope.payname = '지급카드';
     		$scope.compo.paysubul = 703;
     		$scope.pay.use = false;
     		var kind = 'ERPia_Bank_Card_Select';
     		var mode = 'Select_Card';
     		meaipService.paysearch($scope.loginData.Admin_Code, $scope.loginData.UserId, kind, mode)
			.then(function(data){
				$scope.paydatalist = data.list;
			})

		}else{
				$scope.paytype = false;
				$scope.pay.use = true;
				$scope.compo.payprice = 0;
			 }

     }

     /*상품 종합 합계 가격 구하기*/
    $scope.goods_totalprice1=function(){
     	$scope.Meaipgoods.totalsumprices = 0;
     	for(var count=0;count<$scope.goodsaddlists.length;count++){
     		var sum = parseInt($scope.goodsaddlists[count].goodsprice) * parseInt($scope.goodsaddlists[count].num);
     		$scope.Meaipgoods.totalsumprices = $scope.Meaipgoods.totalsumprices + sum;
     	}
    };

     $scope.paycardbank=[];
     /*은행/카드 정보*/
     $scope.paydataF=function(){
     	console.log('--------------------->', $scope.compo.paycardbank);
     	var cblist = $scope.compo.paycardbank.split(',');
    	$scope.paycardbank.splice(0,1);
    	if($scope.compo.paysubul == 702){
	     	$scope.paycardbank.push({
	     		code : cblist[0],
	     		name : cblist[1],
	     		num : cblist[2]
	     	});
	     	$scope.paycardbank.push({
	     		code : '',
	     		name : '',
	     		num : ''
	     	});
	     }else{
	     		$scope.paycardbank.push({
		     		code : '',
		     		name : '',
		     		num : ''
	     		});
		     	$scope.paycardbank.push({
		     		code : cblist[0],
		     		name : cblist[1],
		     		num : cblist[2]
		     	});
	     }
     }
     /*매입전표 저장*/
     $scope.insertGoodsF=function(){
/*     	console.log('상품정보=',$scope.goodsaddlists);
     	console.log('매입정보=',$scope.configData);
     	console.log('따로저장=',$scope.compo);*/
     	if($scope.payment.one == true || $scope.payment.two == true || $scope.payment.th == true || $scope.payment.fo == true){
     		console.log('하나라도 true');
     		if($scope.compo.payprice == 0){
     			var answer = '지급액을 입력해주세요.';
     		}else if($scope.compo.payprice > $scope.Meaipgoods.totalsumprices){
     			var answer = '지급액이 매입액보다 많습니다.';
     			}else if($scope.payment.two == true || $scope.payment.fo == true){
	     			if($scope.paycardbank.length < 1){
	     				console.log('카드&통장 셀랙스박스 미선택일시에.=',$scope.paycardbank.length);
	     				var answer = '지급 카드 & 은행을 선택해주세요.';
	     			}else{
	     				var answer = '매입전표를 등록하시겠습니까?';
	     				var distinction = 'ok';
	     			}
	     		}else{
	     			var answer = '매입전표를 등록하시겠습니까?';
	     			var distinction = 'ok';
	     		}
     	}else{
     		var answer = '지급정보가 입력되지 않았습니다. <br> 매입전표를 등록하시겠습니까?';
     		var distinction = 'ok';
     	}
		
		if(distinction == 'ok'){
			console.log('ok');
			$ionicPopup.show({
			         title: '매입등록',
			         content: answer,
			         buttons: [
			           { text: 'No',
			            onTap: function(e){
			            	console.log('no');
			            }},{
			             text: 'Yes',
			             type: 'button-positive',
			             onTap: function(e) {
			                 console.log('yes');
			                 meaipService.insertm($scope.loginData.Admin_Code, $scope.loginData.UserId, $scope.configData, $scope.goodsaddlists, $scope.compo,$scope.paycardbank, $scope.date, $scope.Meaipgoods)
							.then(function(data){
								console.log('매입 인설트 서비스 실행후 ->',data);
								if(data.list[0].Rslt=='Y'){
									meaipService.subulup($scope.loginData.Admin_Code, $scope.loginData.UserId, $scope.compo.subulkind)
									.then(function(data2){
									})
										$ionicPopup.show({
									         content: '저장완료 되었습니다.<br>내역을 확인하시겠습니까?',
									         buttons: [
									           { text: 'No',
									            onTap: function(e){
									            	console.log('no->매입매출전표페이지');
									            	$scope.modalmeaipDataRegi.hide();
									            	$ionicHistory.goBack();
									            }},{
									             text: 'Yes',
									             type: 'button-positive',
									             onTap: function(e) {
									                 console.log('yes->해당전표페이지');
									                 $scope.modalmeaipDataRegi.hide();
									            	 $ionicHistory.goBack();
													 $rootScope.testtest();
										}},]})
								}
							})
			}},]})
		}else{
			if(ERPiaAPI.toast == 'Y') $cordovaToast.show(answer, 'long', 'center');
			else alert(answer);
		}
				
     }

     

	//backcontroll
     $scope.backControll=function(){
      $ionicPopup.show({
         title: '경고',
         subTitle: '',
         content: '작성중인 내용이 지워집니다.<br> 계속진행하시겠습니까?',
         buttons: [
           { text: 'No',
            onTap: function(e){
            }},
           {
             text: 'Yes',
             type: 'button-positive',
             onTap: function(e) {
                  $ionicHistory.goBack();
             }
           },
         ]
        })
     }
	})

.controller('mconfigCtrl', function($scope, $sce, $cordovaToast, $rootScope, $ionicPopup, $ionicHistory, $ionicModal, mconfigService, ERPiaAPI){
	//단가지정배열(매출) 1. 매입가 2. 도매가 3. 인터넷가 4. 소매가 5. 권장소비자가
    $scope.MeaipDn = [
      { num: 1, id: '매출가' },
      { num: 2, id: '도매가' },
      { num: 3, id: '인터넷가' },
      { num: 4, id: '소매가' },
      { num: 5, id: '권장소비자가' }
    ];
    //단가지정배열(매입) 1. 매입가 2. 도매가 3. 인터넷가 4. 소매가 5. 권장소비자가
    $scope.MeaipDn = [
      { num: 1, id: '매입가' },
      { num: 2, id: '도매가' },
      { num: 3, id: '인터넷가' },
      { num: 4, id: '소매가' },
      { num: 5, id: '권장소비자가' }
    ];
    //기본매출최근등록수불 1. 최근등록수불 2. 매출출고 3. 매출반품
    $scope.configbasicS = [
      { id: '최근등록수불', num: 1 },
      { id: '매출출고', num: 2 },
      { id: '매출반품', num: 3 }
    ];
    //기본매입최근등록수불 1. 최근등록수불 2. 매입입고 3. 매입반품
    $scope.configbasicM = [
      { id: '최근등록수불', num: 1 },
      { id: '매입입고', num: 2 },
      { id: '매입반품', num: 3 }
    ];
    $scope.configState = 0;
	/*기본매장조회 --> 등록페이지에 값불러올때 이거 가져다 쓰셈.*/ 
	mconfigService.basicM($scope.loginData.Admin_Code, $scope.loginData.UserId)
	.then(function(data){
		$scope.mejanglists = data.list;// admin_code에 맞는 매장리스트저장.
			/*환경설정조회*/
			mconfigService.basicSetup($scope.loginData.Admin_Code, $scope.loginData.UserId)
			.then(function(data){
				$scope.configData = data; // 아이디에 저장된 환경설정 리스트 저장
				console.log('초기값?= ', $scope.configData.state);
					if($scope.configData.state == 1){
						console.log('초기값 없을때.');
					}else{
						/*환경설정 조회된 매장코드로 창고리스트 조회*/
						mconfigService.basicC($scope.loginData.Admin_Code, $scope.loginData.UserId, $scope.configData.basic_Place_Code)
						.then(function(data){
							$scope.changolists = data.list;
						})
						$scope.configState = 1;
					}
				console.log($scope.configData.basic_Dn_Sale);
			})
	})

	$scope.Chango=function(){
		console.log('매장코드로 창코조회');
		/*$scope.MeaipData.meajangCheck = 't';*/
		mconfigService.basicC($scope.loginData.Admin_Code, $scope.loginData.UserId, $scope.configData.basic_Place_Code)
		.then(function(data){
			$scope.changolists = data.list;
		})
	}

	//Meaip&Meachul Contrl
     $scope.configback=function(check){
      $ionicPopup.show({
         title: '경고',
         subTitle: '',
         content: '저장하시겠습니까?',
         buttons: [
           { text: 'No',
            onTap: function(e){
              $ionicHistory.goBack();
            }
           },
           {
             text: 'Yes',
             type: 'button-positive',
             onTap: function(e) {
             	console.log(check);
                  if(check == 0){
                  	//환경설정 저장 (insert)
					mconfigService.configInsert($scope.loginData.Admin_Code, $scope.loginData.UserId, $scope.configData)
					.then(function(data){
						console.log('Y?',data.list[0].rslt);
						if(data.list[0].rslt == 'Y'){
							$ionicHistory.goBack();
						}else{
							alert('수정에 성공하지 못하였습니다');
							if(ERPiaAPI.toast == 'Y') $cordovaToast.show('수정에 성공하지 못하였습니다', 'long', 'center');
							else alert('수정에 성공하지 못하였습니다');

						}
						
					})
                  }else{
                  	console.log('update', check);
                  	console.log($scope.configData);
                  	//환경설정 수성 (update)
                  	mconfigService.configUpdate($scope.loginData.Admin_Code, $scope.loginData.UserId, $scope.configData)
					.then(function(data){
						console.log('Y?',data.list[0].rslt);
						if(data.list[0].rslt == 'Y'){
							$ionicHistory.goBack();
						}else{
							if(ERPiaAPI.toast == 'Y') $cordovaToast.show('수정에 성공하지 못하였습니다', 'long', 'center');
							else alert('수정에 성공하지 못하였습니다');
						}
						
					})
					
                  }
             }
           },
         ]
        })
     }

})

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

.controller("IndexCtrl", function($rootScope, $scope, $stateParams, $q, $location, $window, $timeout, ERPiaAPI, statisticService) {
	var request = null;
	var indexList = [];
	$scope.gu = 1;
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
		$("table[name=tbGrid]").html(strHtml);
	}
	AmCharts.loadJSON = function(url, load_kind) {	
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
			response = eval(request.responseText);
			$.each(response[0], function(index, jsonData){
				tmpAlert += jsonData;
			});
			//상세보기 그리드 생성
			insertRow(response, $scope.kind);    
		}
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
	$scope.kind= '', $scope.htmlCode= '';

	$scope.onSlideMove = function(data) {
		console.log('selectedIdx', $scope.userData.selectedIdx);
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
									'<button name="btnW" class="btn btn-default btn-sm dropdown-toggle" data-toggle="" onclick="javascript:refresh(\'' + $scope.kind +'\',\'' + $scope.gu + '\',\'' + $scope.loginData.Admin_Code + '\',\'' + ERPiaAPI.url + '\');"><i class="fa fa-refresh"></i></button>&nbsp;&nbsp;&nbsp;'+
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
												'<table name="tbGrid" class="table table-bordered" style="color:rgb(208, 208, 212); width:100%; font-size:12pt; margin-bottom:10px;">'+
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
												'<table name="tbGrid" class="table table-bordered" style="color:rgb(208, 208, 212); width:100%; font-size:12pt; margin-bottom:10px;">'+
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
				renewalDay($scope.kind,$scope.gu,$scope.loginData.Admin_Code,ERPiaAPI.url);
				// makeCharts($scope.kind,$scope.gu,$scope.loginData.Admin_Code,ERPiaAPI.url);
				switch(data.index){
					case 1: $('#s1').html($scope.htmlCode); $('button[name=btnW]').click(); break;
					case 2: $('#s2').html($scope.htmlCode); $('button[name=btnW]').click(); break;
					case 3: $('#s3').html($scope.htmlCode); $('button[name=btnW]').click(); break;
					case 4: $('#s4').html($scope.htmlCode); $('button[name=btnW]').click(); break;
					case 5: $('#s5').html($scope.htmlCode); $('button[name=btnW]').click(); break;
					case 6: $('#s6').html($scope.htmlCode); $('button[name=btnW]').click(); break;
					case 7: $('#s7').html($scope.htmlCode); $('button[name=btnW]').click(); break;
					case 8: $('#s8').html($scope.htmlCode); $('button[name=btnW]').click(); break;
					case 9: $('#s9').html($scope.htmlCode); $('button[name=btnW]').click(); break;
					case 10: $('#s10').html($scope.htmlCode); $('button[name=btnW]').click(); break;
					case 11: $('#s11').html($scope.htmlCode); $('button[name=btnW]').click(); break;
					case 12: $('#s12').html($scope.htmlCode); $('button[name=btnW]').click(); break;
					case 13: $('#s13').html($scope.htmlCode); $('button[name=btnW]').click(); break;
					case 14: $('#s14').html($scope.htmlCode); $('button[name=btnW]').click(); break;
					case 15: $('#s15').html($scope.htmlCode); $('button[name=btnW]').click(); break;
					case 16: $('#s16').html($scope.htmlCode); $('button[name=btnW]').click(); break;
					case 17: $('#s17').html($scope.htmlCode); $('button[name=btnW]').click(); break;
				}
				// $('div[name=gridBody]').hide();
				$("button[name=btnGrid]").click(function() {
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
});
