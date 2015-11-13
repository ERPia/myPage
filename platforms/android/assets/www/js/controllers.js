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

<<<<<<< HEAD
.controller('AppCtrl', function($rootScope, $scope, $ionicModal, $timeout, $stateParams, $location, $http, $state, $ionicHistory, $ionicUser, $ionicPush
	, loginService, CertifyService, pushInfoService, ERPiaAPI){
=======
.controller('AppCtrl', function($rootScope, $scope, $ionicModal, $timeout, $stateParams, $location, $http, $state, loginService, $ionicHistory, $ionicUser, $ionicPush ,pushInfoService, CertifyService, ERPiaAPI){
>>>>>>> refs/remotes/origin/yyk
	$rootScope.urlData = [];
	$rootScope.loginState = "R"; //R: READY, E: ERPIA LOGIN TRUE, S: SCM LOGIN TRUE
	// console.log($rootScope.loginState);

	$scope.loginData = {};
	$scope.SMSData = {};

	console.log('AppCtrl'); 

	// Create the login modal that we will use later
	$ionicModal.fromTemplateUrl('erpia_login/login.html', {
		scope : $scope
	}).then(function(modal) {
		$scope.modal = modal;
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
	
	// Triggered in the login modal to close it
	$scope.closeLogin = function() {
		$scope.modal.hide();
		if($rootScope.mobile_Certify_YN == 'Y'){
			if($rootScope.loginState == "S"){
				$ionicHistory.nextViewOptions({
	            	disableBack: true
		        });
		        $state.go("app.erpia_scmhome");
			}else if($rootScope.loginState == "E"){
				$ionicHistory.nextViewOptions({
	            	disableBack: true
		        });
		        $state.go("app.slidingtab");
			};
		}
		else if($rootScope.loginState != "R") {
			$scope.agreeModal.show(); //location.href="#/app/agreement";
		}
<<<<<<< HEAD
		if($rootScope.loginState != 'R'){
<<<<<<< HEAD
		// 	// $rootScope.$on('$cordovaPush:tokenReceived', function(event, data) {
		// 	// 	// alert("Successfully registered token " + data.token);
		// 	// 	console.log('Ionic Push: Got token ', data.token, data.platform);
		// 	// 	$scope.token = data.token;
		// 	// 	$scope.pushUserRegist();
			
		// 	// });

		// $scope.identifyUser = function() {
		// 	var user = $ionicUser.get();
		// 	if(!user.user_id) {
		// 		// Set your user_id here, or generate a random one.
		// 		user.user_id = $ionicUser.generateGUID();
		// 	};

		// 	// Metadata
		// 	angular.extend(user, {
		// 		name: $scope.Admin_Code,
		// 		bio: $rootScope.loginState + '_USER'
		// 	});

		// 	// Identify your user with the Ionic User Service
		// 	$ionicUser.identify(user).then(function(){
		// 	$scope.identified = true;
		// 		console.log('Identified user ' + user.name + '\n ID ' + user.user_id);
		// 		$scope.UserKey = user.user_id
		// 	});
		// };
=======
>>>>>>> refs/remotes/origin/yyk

		var PushInsertCheck = "";
		var PushInsertCheck2 = "";

<<<<<<< HEAD
		// 	// Register with the Ionic Push service.  All parameters are optional.
		// 	$ionicPush.register({
		// 		canShowAlert: true, //Can pushes show an alert on your screen?
		// 		canSetBadge: true, //Can pushes update app icon badges?
		// 		canPlaySound: true, //Can notifications play a sound?
		// 		canRunActionsOnWake: true, //Can run actions outside the app,
				
		// 		onNotification: function(notification) {
		// 			// Handle new push notifications here
		// 			if(notification.payload.payload.$state === "app.slidingtab"){
		// 				alert("app.slidingtab");
		// 			}
		// 			if(notification.payload.payload.$state === "tab.A"){
		// 				alert("tab.A");
		// 				//$state.go("경로") //해당 값으로 화면 이동
		// 			}
		// 			if(notification.payload.payload.$state === "tab.B"){
		// 				alert("tab.B");
		// 			}
		// 			return true;
		// 		}
		// 	});
		// };

		$scope.pushUserRegist = function() {
			pushInfoService.pushInfo($scope.Admin_Code, $scope.loginData.UserId, 'Mobile_Push_Token', 'SAVE', $rootScope.UserKey, $rootScope.token, $rootScope.loginState, 'A', '', '')
=======
			$rootScope.$on('$cordovaPush:tokenReceived', function(event, data) {
				// alert("Successfully registered token " + data.token);
				console.log('Ionic Push: Got token ', data.token, data.platform);
				$scope.token = data.token;
				$scope.pushUserRegist();
			
			});

		$scope.identifyUser = function() {
			var user = $ionicUser.get();
			if(!user.user_id) {
				// Set your user_id here, or generate a random one.
				user.user_id = $ionicUser.generateGUID();
			};

			// Metadata
			angular.extend(user, {
				name: $scope.Admin_Code,
				bio: $rootScope.loginState + '_USER'
			});

			// Identify your user with the Ionic User Service
			$ionicUser.identify(user).then(function(){
			$scope.identified = true;
				console.log('Identified user ' + user.name + '\n ID ' + user.user_id);
				$scope.UserKey = user.user_id
			});
		};

		// Registers a device for push notifications
		$scope.pushRegister = function() {
			console.log('Ionic Push: Registering user');

			// Register with the Ionic Push service.  All parameters are optional.
			$ionicPush.register({
				canShowAlert: true, //Can pushes show an alert on your screen?
				canSetBadge: true, //Can pushes update app icon badges?
				canPlaySound: true, //Can notifications play a sound?
				canRunActionsOnWake: true, //Can run actions outside the app,
				
				onNotification: function(notification) {
					// Handle new push notifications here
					if(notification.payload.payload.$state === "app.slidingtab"){
						alert("app.slidingtab");
					}
					if(notification.payload.payload.$state === "tab.A"){
						alert("tab.A");
						//$state.go("경로") //해당 값으로 화면 이동
					}
					if(notification.payload.payload.$state === "tab.B"){
						alert("tab.B");
					}
					return true;
				}
			});
		};

		$scope.pushUserRegist = function() {
			pushInfoService.pushInfo($scope.Admin_Code, $scope.loginData.UserId, 'Mobile_Push_Token', 'SAVE', $scope.UserKey, $scope.token, $rootScope.loginState, 'A', '', '')
>>>>>>> refs/remotes/origin/lhk
=======
		$scope.pushUserCheck = function() {
			pushInfoService.pushInfo($rootScope.Admin_Code, $scope.loginData.UserId, 'Mobile_Push_Token', 'SELECT_InsertCheck', $rootScope.UserKey, $rootScope.token, '', '', '', '')
>>>>>>> refs/remotes/origin/yyk
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

<<<<<<< HEAD
<<<<<<< HEAD
	 //    $scope.identifyUser();
	    $scope.pushUserRegist();
=======
	    $scope.identifyUser();
	    $scope.pushRegister();
>>>>>>> refs/remotes/origin/lhk
=======
		$scope.pushUserRegist = function() {
			pushInfoService.pushInfo($rootScope.Admin_Code, $scope.loginData.UserId, 'Mobile_Push_Token', 'SAVE', $rootScope.UserKey, $rootScope.token, $rootScope.loginState, 'A', '', '')
		    .then(function(pushInfo){
		    	console.log('pushUserRegist success ::[' + $rootScope.token + ']');
		    },function(){
				alert('pushUserRegist fail')	
			});
>>>>>>> refs/remotes/origin/yyk
		};
		$scope.pushUserCheck();
		// };
	};

	$rootScope.loginMenu = "selectUser";	//사용자 선택화면
	$scope.selectType = function(userType){
		console.log('userType', userType);
		switch(userType){
			case 'ERPia': $rootScope.loginMenu = 'User'; $scope.userType='ERPia'; break;
			case 'SCM': $rootScope.loginMenu = 'User'; $scope.userType='SCM'; break;
			case 'Normal': $rootScope.loginMenu = 'User'; $scope.userType='Normal'; break;
			case 'Guest': $rootScope.loginMenu = 'User'; $scope.userType='Guest'; $scope.closeLogin(); break;
		}
	}
	// Open the login modal
	$scope.login = function() {
		console.log('loginState', $rootScope.loginState);
		$rootScope.loginMenu = 'selectUser';
		if($rootScope.loginState == "R"){
			$scope.modal.show();
		}else{
			$scope.id_title = "";
			$rootScope.UserId = "";
			$rootScope.Admin_Code = "";
			$scope.management_day = "";
			$scope.management_bill = "";
			$scope.sms = "";
			$scope.tax = "";
			$scope.e_money = "";
			$scope.every = "";
			$scope.package = "";
			$scope.user = "";
			$scope.site = "";
			$scope.account = "";

			$scope.loginHTML = "로그인";
			$rootScope.loginState = "R";
			alert("로그아웃 되었습니다.");

			$ionicHistory.nextViewOptions({
            	disableBack: true
	        });
			$state.go("app.erpia_main");
		};
	};

	// Perform the login action when the user submits the login form
	$scope.doLogin = function() {
		// $scope.Kind = "scm_login";
		$rootScope.Admin_Code = $scope.loginData.Admin_Code;
		$rootScope.G_id = $scope.loginData.UserId;
		$scope.G_Pass = $scope.loginData.Pwd;
		// $scope.SCM_Use_YN = $scope.loginData.SCM_Use_YN;
		$scope.Auto_Login = $scope.loginData.Auto_Login;

		if ($scope.Auto_Login != true) {
			//SCM 로그인
			if ($scope.userType == 'SCM') {
				loginService.comInfo('scm_login', $scope.Admin_Code, $rootScope.G_id, $scope.G_Pass)
				.then(function(comInfo){
					if (comInfo.data.list[0].ResultCk == '1'){
						$rootScope.Admin_Code = comInfo.data.list[0].Admin_Code;
						$scope.GerName = comInfo.data.list[0].GerName + '<br>(' + comInfo.data.list[0].G_Code + ')';
						$rootScope.G_id = comInfo.data.list[0].G_ID;
						$scope.G_Code = comInfo.data.list[0].G_Code;
						$scope.G_Sano = comInfo.data.list[0].Sano;
<<<<<<< HEAD
=======
						$scope.GerCode = comInfo.data.list[0].G_Code;
>>>>>>> refs/remotes/origin/lhk

						$scope.loginHTML = "로그아웃";
						$rootScope.loginState = "S";
						$rootScope.mobile_Certify_YN = comInfo.data.list[0].mobile_CertifyYN; 

						$timeout(function() {
							$scope.closeLogin();
						}, 100);
					}else{
						if(ERPiaAPI.toast == 'Y') $cordovaToast.show(comInfo.data.list[0].ResultMsg, 'long', 'center');
						else alert(comInfo.data.list[0].ResultMsg);
					}	
				},
				function(){
					alert('login error');
				});
			}else if ($scope.userType == 'ERPia'){
				//ERPia 로그인
				loginService.comInfo('ERPiaLogin', $rootScope.Admin_Code, $rootScope.G_id, $scope.G_Pass)
				.then(function(comInfo){
					console.log('comInfo', comInfo);
					if(comInfo.data.list[0].Result=='1'){
						$scope.Com_Name = comInfo.data.list[0].Com_Name + '<br>(' + comInfo.data.list[0].Com_Code + ')';
						$scope.UserId = comInfo.data.list[0].user_id;
						$scope.loginHTML = "로그아웃<br>(" + comInfo.data.list[0].Com_Code + ")";
						$scope.package = comInfo.data.list[0].Pack_Name;
						$rootScope.mobile_Certify_YN = comInfo.data.list[0].mobile_CertifyYN; 
						// $scope.cnt_site = cominfo.list[0].CNT_Site + " 개";

						loginService.comInfo('erpia_ComInfo', $scope.Admin_Code)
						.then(function(comTax){
							var d= new Date();
							var month = d.getMonth() + 1;
							var day = d.getDate();
							var data = comTax.data;

							CNT_Tax_No_Read = data.list[0].CNT_Tax_No_Read;	//계산서 미수신건
							Pay_Method = data.list[0].Pay_Method;
							Pay_State = data.list[0].Pay_State;
							Max_Pay_YM = data.list[0].Max_Pay_YM;
							Pay_Ex_Days = data.list[0].Pay_Ex_Days;
							Pay_Day = data.list[0].Pay_Day;
							Pay_Ex_Date = d.getFullYear() + '-' + (month<10 ? '0':'') + month + '-' + (day<10 ? '0' : '') + day;

							$scope.CNT_Tax_No_Read = CNT_Tax_No_Read + " 건";
							
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
											G_Expire_Days = '?';
											G_Expire_Date = '?';
										}
									}
								}else{
									if (Pay_Ex_Days < 0)		//당월결재미존재, 초과허용무제한
									{
										G_Expire_Days = '?';
										G_Expire_Date = '?';
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
								G_Expire_Days = "?"
								if (CLng(IO_Amt) + CLng(Point_Ex_Amt) - CLng(Point_Out_StandBy_Amt) <= 0)
								{
									G_Expire_Date = "포인트부족"
								}else{
									G_Expire_Date = CLng(IO_Amt) + CLng(Point_Ex_Amt) - CLng(Point_Out_StandBy_Amt)
								}
							}

							$scope.management_day = G_Expire_Date; //"2015년<br>8월20일";
							$scope.management_bill = "330,000원	<br><small>(VAT 포함)</small>";
							$scope.sms = "15000 개<br><small>(건당 19원)</small>";
							$scope.tax = "150 개<br><small>(건당 165원)</small>";
							$scope.e_money = "30,000원<br><small>(자동이체 사용중)</small>";
							$scope.every = "10,000 P";
							$scope.cnt_user = "5 명";
							$scope.cnt_account = "20 개";

							$rootScope.loginState = "E";
							$rootScope.ComInfo = {
									"G_Expire_Date":G_Expire_Date
									, "G_Expire_Days":G_Expire_Days
									, "CNT_Tax_No_Read":CNT_Tax_No_Read
								};
							$timeout(function() {
								$scope.closeLogin();
							}, 100);
						},
						function(){
							if(ERPiaAPI.toast == 'Y') $cordovaToast.show('comTax error', 'long', 'center');
							else alert('comTax error');
						})
					}else{
						if(ERPiaAPI.toast == 'Y') $cordovaToast.show(comInfo.data.list[0].Comment, 'long', 'center');
						else alert(comInfo.data.list[0].Comment);
					}
				},
				function(){
					if(ERPiaAPI.toast == 'Y') $cordovaToast.show('comInfo error', 'long', 'center');
					else alert('comInfo error');
				});
			};
		};
		// console.log('Doing login', $scope.loginData);
		//location.href="#/app/home";
		//alert("로그인성공");

		// Simulate a login delay. Remove this and replace with your login
		// code if using a login system
		
	};

  	$scope.loginHTML = "로그인";

  	$scope.click_agreement = function(agrees){
		if(agrees.agree_1 && agrees.agree_2){
			//location.href="#/app/certification";
			$scope.agreeModal.hide();
			$scope.certificationModal.show();
		}else{
			if(ERPiaAPI.toast == 'Y') $cordovaToast.show('약관에 동의해!!', 'long', 'center');
			alert('약관에 동의해!!');
		}
	}

	// $rootScope.CertificationSwitch = 'firstPage';
	$scope.click_Certification = function(){
		CertifyService.certify($scope.Admin_Code, $rootScope.loginState, $rootScope.G_id, 'erpia', 'a12345', '070-7012-3071', $scope.SMSData.recUserTel)
	}
	$scope.click_responseText = function(){
		CertifyService.check($scope.Admin_Code, $rootScope.loginState, $rootScope.G_id, $scope.SMSData.rspnText)
		.then(function(response){
			$scope.certificationModal.hide();
		})
	}
})

.controller('tradeCtrl', function($scope, $ionicSlideBoxDelegate, $cordovaPrinter, $cordovaToast, tradeDetailService, ERPiaAPI){
<<<<<<< HEAD
	$scope.tradeDetailList = tradeDetailService;
	$scope.check = {};
=======
	$scope.check = {};
	tradeDetailService.innerHtml($scope.Admin_Code, $scope.GerCode)
		.then(function(response){
			$scope.items = response.list;
		})
<<<<<<< HEAD
	$scope.tradeDetailList = innerHtml;
	
>>>>>>> refs/remotes/origin/lhk
	$scope.readTradeDetail = function(idx){
=======
	$scope.readTradeDetail = function(Sl_No){
>>>>>>> refs/remotes/origin/lhk
		$ionicSlideBoxDelegate.next();
		tradeDetailService.readDetail($scope.Admin_Code, Sl_No)
			.then(function(response){
				console.log('readDetail', response);
				$scope.detail_items = response.list;
			})
	}
	$scope.backToList = function(){
		$ionicSlideBoxDelegate.previous();
	}
	$scope.print = function(){
		var page = location.href;
		if($cordovaPrinter.isAvailable()){
			// $cordovaPrinter.print(page.replace('trade_Detail','trade_Detail_Print'));
			$cordovaPrinter.print('www.erpia.net/mobile/trade_Detail.asp');
		}else{
			if(ERPiaAPI.toast == 'Y') $cordovaToast.show('Printing is not available on device', 'long', 'center');
			else alert('Printing is not available on device');
		}
	}
	$scope.check_Sano = function(){
		console.log('sano', $scope.G_Sano.substring($scope.G_Sano.lastIndexOf('-') + 1));
		if($scope.G_Sano.substring($scope.G_Sano.lastIndexOf('-') + 1) == $scope.check.Sano){
			location.href="#/app/trade_Detail";
		}else{
			if(ERPiaAPI.toast == 'Y') $cordovaToast.show('사업자 번호와 일치하지 않습니다.', 'long', 'center');
			else alert('사업자 번호와 일치하지 않습니다.');
		}
	}
})

<<<<<<< HEAD
.controller('configCtrl', function($scope) {

=======
.controller('configCtrl', function($scope, $rootScope) {
	console.log($rootScope);
	if($rootScope.loginState == 'E'){

	}
>>>>>>> refs/remotes/origin/lhk
})
  
.controller('configCtrl_Info', function($scope, NoticeService) {
	$scope.toggle = false;
	NoticeService.getList()
		.then(function(data){
			var innerHtml = '';
			$scope.items = data.list;
			// for(var i=0; i<data.list.length; i++){
			// 	innerHtml += '<ui class="list" ng-click="toggle_' + i + ' = !toggle_' + i + '">'
			// 	innerHtml += '<li class="item">';
			// 	innerHtml += '<font>';
			// 	innerHtml += data.list[i].inDate;
			// 	innerHtml += '</font><br/>';
			// 	innerHtml += data.list[i].subject;
			// 	innerHtml += '</li>';
			// 	innerHtml += '</ui>';
			// 	innerHtml += '<div class="lhkNoticeContent" ng-show="toggle_' + i + '" ng-animate="\'box\'">';
			// 	innerHtml += data.list[i].content;
			// 	innerHtml += '</div>';
			// }
			// $scope.noticeList = innerHtml;
		})
})
.controller('configCtrl_statistics', function($scope, $rootScope, statisticService){
	statisticService.all('myPage_Config_Stat', 'select_Statistic', $rootScope.Admin_Code, $rootScope.loginState, $rootScope.G_id)
		.then(function(data){
<<<<<<< HEAD
			console.log('data', data);
			$scope.items = data;
		})
	// $scope.items = statisticService.all('myPage_Config_Stat', 'select_Statistic', $scope.Admin_Code, $rootScope.loginState, $scope.G_id);
	// console.log('controller',$scope.items)
=======
			$scope.items = data;
		})
>>>>>>> refs/remotes/origin/lhk
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

<<<<<<< HEAD
		console.log('changed', $scope.items);
		
=======
>>>>>>> refs/remotes/origin/lhk
		var rsltList = '';
		for(var i = 0; i < $scope.items.length; i++){
			rsltList += $scope.items[i].cntOrder + '^';
			rsltList += $scope.items[i].Idx + '^';
			rsltList += $scope.items[i].visible + '^|';
		}
<<<<<<< HEAD
		statisticService.save('myPage_Config_Stat', 'save_Statistic', $scope.Admin_Code, $rootScope.loginState, $scope.G_id, rsltList);
<<<<<<< HEAD
=======
		statisticService.save('myPage_Config_Stat', 'save_Statistic', $rootScope.Admin_Code, $rootScope.loginState, $rootScope.G_id, rsltList);
>>>>>>> refs/remotes/origin/yyk
		console.log('rsltList', rsltList);
		// $scope.items.splice(fromIndex, 1);
		// $scope.items.splice(toIndex, 0, item);
=======
>>>>>>> refs/remotes/origin/lhk
	};

	$scope.onItemDelete = function(item) {
		$scope.items.splice($scope.items.indexOf(item), 1);
	};
})
<<<<<<< HEAD
// .controller("IndexCtrl", ['$rootScope', "$scope", "$stateParams", "$q", "$location", "$window", '$timeout', '$http', '$sce',
.controller("IndexCtrl", function($rootScope, $scope, $timeout, $http, $sce, IndexService, statisticService, ERPiaAPI) {
=======
.controller('configCtrl_alarm', function($scope, $rootScope, alarmService){
	$scope.settingsList = [];
	var cntList = 0;
	alarmService.select('select_Alarm', $scope.Admin_Code, $rootScope.loginState, $scope.G_id)
		.then(function(data){
			cntList = data.list.length;
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
					case 7: data.list[i].checked = (data.list[i].checked == 'T')?true:false;
						data.list[i].name = '소리';
						break;
					case 8: data.list[i].checked = (data.list[i].checked == 'T')?true:false;
						data.list[i].name = '진동';
						break;
				}
			}
			if(data.list[0].alarm == 'F') $scope.selectedAll = false;
			else $scope.selectedAll = true;
			$scope.settingsList = data.list;
		});
	$scope.check_change = function(item){
		var rsltList = '';
		for(var i=0; i<cntList; i++){
			rsltList += $scope.settingsList[i].idx + '^';
			rsltList += ($scope.settingsList[i].checked == true)?'T' + '^|':'F' + '^|';
		}
		alarmService.save('save_Alarm', $scope.Admin_Code, $rootScope.loginState, $scope.G_id, rsltList)
	}
	$scope.check_alarm = function(check){
		angular.forEach($scope.settingsList, function(item){
			item.checked = check;
			if(item.checked) rsltList = '0^T^|1^T^|2^T^|3^T^|4^T^|5^T^|6^T^|7^T^|8^T^|';
			else rsltList = '0^F^|1^F^|2^F^|3^F^|4^F^|5^F^|6^F^|7^F^|8^F^|';
		})
		alarmService.save('save_Alarm', $scope.Admin_Code, $rootScope.loginState, $scope.G_id, rsltList)
	}
})
// .controller("IndexCtrl", ['$rootScope', "$scope", "$stateParams", "$q", "$location", "$window", '$timeout', '$http', '$sce',
.controller("IndexCtrl", function($rootScope, $scope, $timeout, $http, $sce, IndexService, statisticService) {
>>>>>>> refs/remotes/origin/lhk
		$scope.myStyle = {
		    "width" : "100%",
		    "height" : "100%"
		};
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

		if($rootScope.loginState == "E") {
			IndexService.dashBoard('erpia_dashBoard', $scope.Admin_Code, aWeekAgo, nowday)
			.then(function(processInfo){
				$scope.E_NewOrder = processInfo.data.list[0].CNT_JuMun_New;
				$scope.E_BsComplete = processInfo.data.list[0].CNT_BS_NO;
				$scope.E_InputMno = processInfo.data.list[0].CNT_BS_No_M_No;
				$scope.E_CgComplete = processInfo.data.list[0].CNT_BS_Before_ChulGo;
				$scope.E_RegistMno = processInfo.data.list[0].CNT_BS_After_ChulGo_No_Upload;
			},
			function(){
				alert('ProcessInfo Error');
			});
			$scope.G_Expire_Date = $rootScope.ComInfo.G_Expire_Date;
			$scope.G_Expire_Days = $rootScope.ComInfo.G_Expire_Days;
			$scope.CNT_Tax_No_Read = $rootScope.ComInfo.CNT_Tax_No_Read;

			statisticService.title('myPage_Config_Stat', 'select_Title', $rootScope.Admin_Code, $rootScope.loginState, $rootScope.G_id)
			.then(function(data){
				console.log('data', data);
				$scope.tabs = data;
			})

			// $scope.url = "";
			$scope.onSlideMove = function(data) {
				console.log('index :', indexList.indexOf(data.index));
				if(indexList.indexOf(data.index) < 0){
					indexList.push(data.index);
					console.log('indexList :', indexList);
					if (data.index > 0){
						statisticService.chart('myPage_Config_Stat', 'select_Chart', $rootScope.Admin_Code, $rootScope.loginState, $rootScope.G_id, data.index)
						.then(function(response){
							switch(data.index){
								case 1: $scope.chart_url1 = $sce.trustAsResourceUrl(response.list[0].url); break;
								case 2: $scope.chart_url2 = $sce.trustAsResourceUrl(response.list[0].url); break;
								case 3: $scope.chart_url3 = $sce.trustAsResourceUrl(response.list[0].url); break;
								case 4: $scope.chart_url4 = $sce.trustAsResourceUrl(response.list[0].url); break;
								case 5: $scope.chart_url5 = $sce.trustAsResourceUrl(response.list[0].url); break;
								case 6: $scope.chart_url6 = $sce.trustAsResourceUrl(response.list[0].url); break;
								case 7: $scope.chart_url7 = $sce.trustAsResourceUrl(response.list[0].url); break;
								case 8: $scope.chart_url8 = $sce.trustAsResourceUrl(response.list[0].url); break;
								case 9: $scope.chart_url9 = $sce.trustAsResourceUrl(response.list[0].url); break;
								case 10: $scope.chart_url10 = $sce.trustAsResourceUrl(response.list[0].url); break;
								case 11: $scope.chart_url11 = $sce.trustAsResourceUrl(response.list[0].url); break;
								case 12: $scope.chart_url12 = $sce.trustAsResourceUrl(response.list[0].url); break;
								case 13: $scope.chart_url13 = $sce.trustAsResourceUrl(response.list[0].url); break;
								case 14: $scope.chart_url14 = $sce.trustAsResourceUrl(response.list[0].url); break;
								case 15: $scope.chart_url15 = $sce.trustAsResourceUrl(response.list[0].url); break;
								case 16: $scope.chart_url16 = $sce.trustAsResourceUrl(response.list[0].url); break;
								case 17: $scope.chart_url17 = $sce.trustAsResourceUrl(response.list[0].url); break;
								default : alert('chart error'); break;
							}
							console.log('chartUrl', response.list[0].url);
						})
					}
				}

				$scope.myStyle = {
				    "width" : "100%",
				    "height" : "100%"
				};
				//alert("You have selected " + $scope.tabs[data.index].text + " tab");
			};
		}else if($rootScope.loginState == "S") {

		};
	})

.controller('ScmUser_HomeCtrl', function($rootScope, $scope, $ionicModal, $timeout, $stateParams, $location, $http, scmInfoService){
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
			
			scmInfoService.scmInfo('ScmMain', 'Balju', $scope.Admin_Code, $scope.G_Code, aWeekAgo, nowday)
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
			scmInfoService.scmInfo('ScmMain', 'Direct', $scope.Admin_Code, $scope.G_Code, aWeekAgo, nowday)
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
			scmInfoService.scmInfo('CrmMenu', '', $scope.Admin_Code, $scope.G_Code, aWeekAgo, nowday)
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
})

.controller('ERPiaUser_HomeCtrl', function($rootScope, $scope, $ionicModal, $timeout, $stateParams, $location, $http){
	console.log($rootScope.loginState); 
// 	// Perform the login action when the user submits the login form
	// $scope.ERPiaBaseData = function() {
		 
	// 	$scope.Kind = "scm_login";
	// 	$scope.Admin_Code = $scope.loginData.Admin_Code;
	// 	$scope.G_id = $scope.loginData.UserId;
	// 	$scope.G_Pass = $scope.loginData.Pwd;
	// 	$scope.SCM_Use_YN = $scope.loginData.SCM_Use_YN
	// 	$scope.Auto_Login = $scope.loginData.Auto_Login

		// if($rootScope.loginState == "E") {
		// 	$http({
		// 		method: 'POST',
		// 		url: 'https://www.erpia.net/include/JSon_Proc_MyPage_Scm.asp',
		// 		data: 	"kind=" + "erpia_dashBoard"
		// 				+ "&Admin_Code=" + $scope.Admin_Code
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

.controller('MainCtrl', function($rootScope, $scope, $ionicModal, $timeout, $stateParams, $location, $http){
	console.log("MainCtrl");
    $scope.ERPiaCafe_Link = function() {
        window.open('http://cafe.naver.com/erpia10');
    }

    $scope.ERPiaBlog_Link = function() {
        window.open('http://blog.naver.com/zzata');
    }
})

.controller('CsCtrl', function($rootScope, $scope, $ionicModal, $timeout, $stateParams, $location, $http, csInfoService){
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
		csInfoService.csInfo($scope.Admin_Code, $scope.loginData.UserId, 'Mobile_CS_Save', $rootScope.loginState, $scope.csData.comName,
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

.controller('BoardSelectCtrl', function($rootScope, $scope, $state, $stateParams){
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

<<<<<<< HEAD
.controller('BoardMainCtrl', function($rootScope, $scope, $ionicModal, $timeout, $stateParams, $location, $http, ERPiaAPI){
=======
.controller('BoardMainCtrl', function($rootScope, $scope, $rootScope, $stateParams, $sce){
>>>>>>> refs/remotes/origin/yyk
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

<<<<<<< HEAD
	// $scope.BoardBaseData = function() {
		 
<<<<<<< HEAD
	// 	// $scope.Kind = "scm_login";
	// 	// $scope.Admin_Code = $scope.loginData.Admin_Code;
	// 	// $scope.G_id = $scope.loginData.UserId;
	// 	// $scope.G_Pass = $scope.loginData.Pwd;
	// 	// $scope.SCM_Use_YN = $scope.loginData.SCM_Use_YN
	// 	// $scope.Auto_Login = $scope.loginData.Auto_Login

	// 	// if($rootScope.loginState == "E") {
	// 		$http({
	// 			method: 'POST',
	// 			url: 'https://www.erpia.net/include/JSon_Proc_MyPage_Scm_Manage.asp',
	// 			data: 	"kind=" + "board_notice"
	// 					+ "&Admin_Code=" + "onz",
	// 			headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=euc-kr'} //헤더
	// 		})
	// 		  .success(function (response) {
	// 			// console.log(response);
=======
		// $scope.Kind = "scm_login";
		// $scope.Admin_Code = $scope.loginData.Admin_Code;
		// $scope.G_id = $scope.loginData.UserId;
		// $scope.G_Pass = $scope.loginData.Pwd;
		// $scope.SCM_Use_YN = $scope.loginData.SCM_Use_YN
		// $scope.Auto_Login = $scope.loginData.Auto_Login

		// if($rootScope.loginState == "E") {
			$http({
				method: 'POST',
				url: ERPiaAPI.url + '/JSon_Proc_MyPage_Scm_Manage.asp',
				data: 	"kind=" + "board_notice"
						+ "&Admin_Code=" + "onz",
				headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=euc-kr'} //헤더
			})
			  .success(function (response) {
				// console.log(response);
>>>>>>> refs/remotes/origin/lhk

	// 			// console.log($stateParams);
	// 			// $scope.playlists2 = response

	// 			var items = [];
 //  				for (var i = 0; i < 10; i++) {
 //  					items = response.list[i]
 //  					console.log(items);
 //  				}

 //  				$scope.itemlist = items;
 //  				console.log($scope.itemlist);
  				
	// 			// $scope.E_BsComplete = response.list[1].Cnt
	// 			// $scope.E_InputMno = response.list[2].Cnt
	// 			// $scope.E_CgComplete = response.list[3].Cnt
	// 			// $scope.E_RegistMno = response.list[4].Cnt

	// 			// $scope.E_TOT = $scope.E_NewOrder + $scope.E_BsComplete + $scope.E_InputMno + $scope.E_CgComplete + $scope.E_RegistMno
	// 		})
	// 		  .error(function(data, status, headers, config){
	// 			console.log("Fail");
	// 		})
	// 	// }else{
	// 		// alert(response.list[0].ResultMsg);
	// 	// };
	// };
	// $scope.BoardBaseData();
=======
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
>>>>>>> refs/remotes/origin/yyk
})

//////////////////////////////side///////////////////////////
.controller('PlaylistsCtrl', function($scope) {

	console.log("PlaylistsCtrl");
	$scope.playlists = g_playlists;
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
	console.log($stateParams);
	$scope.playlists = g_playlists;
	$scope.playlist = $scope.playlists[$stateParams.playlistId - 1];
})

////////////////////////////tab///////////////////////////////
.controller('DashCtrl', function($scope) {
	console.log("DashCtrl");
})

.controller('ChatsCtrl', function($scope, Chats) {
	// With the new view caching in Ionic, Controllers are only called
	// when they are recreated or on app start, instead of every page change.
	// To listen for when this page is active (for example, to refresh data),
	// listen for the $ionicView.enter event:
	
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

// var teste = angular.module('ionicTeste',['ionic','ionicSelect']);

// teste.controller('CsCtrl',function($scope){
   
//     var data = [{id:1,nmPlaca:'IKC-1394'},{id:2,nmPlaca:'IKY-5437'},{id:3,nmPlaca:'IKC-1393'},{id:4,nmPlaca:'IKI-5437'},{id:5,nmPlaca:'IOC-8749'},{id:6,nmPlaca:'IMG-6509'}];
//     $scope.veiculos = data;
//     $scope.testa = function(){
//       alert($scope.veiculo.nmPlaca);
//     }
// })
.controller('chartCtrl', function($scope, $rootScope, statisticService){
	statisticService.title('myPage_Config_Stat', 'select_Title', $scope.Admin_Code, $rootScope.loginState, $scope.G_id)
		.then(function(data){
			console.log('data', data);
			$scope.charts = data;
		})
	$scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
    $scope.series = ['Series A', 'Series B', 'SeriesC'];
    $scope.data = [
        [65, 59, 80, 81, 56, 55, 40],
        [28, 48, 40, 19, 86, 27, 90],
        [12, 54, 23, 43, 34, 45, 65]
    ];
})
