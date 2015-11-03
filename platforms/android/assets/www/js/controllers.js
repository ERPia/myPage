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

angular.module('starter.controllers', ['starter.services', 'ionic', 'ngCordova', 'ionic.service.core', 'ionic.service.push'])

.controller('AppCtrl', function($rootScope, $scope, $ionicModal, $timeout, $stateParams, $location, $http, $state, loginService, $ionicHistory, $ionicUser, $ionicPush ,pushInfoService){
	$rootScope.urlData = [];
	$rootScope.loginState = "R"; //R: READY, E: ERPIA LOGIN TRUE, S: SCM LOGIN TRUE
	// console.log($rootScope.loginState);

	$scope.loginData = {};

	console.log('AppCtrl'); 

	// Create the login modal that we will use later
	$ionicModal.fromTemplateUrl('erpia_login/login.html', {
		scope : $scope
	}).then(function(modal) {
		$scope.modal = modal;
	});
 
	$scope.closeLogin = function() {
		$scope.modal.hide();
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

			if($rootScope.loginState != 'R'){
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
			    .then(function(pushInfo){
			    	console.log('테이블 저장 성공' + $scope.UserKey + '키저장좀되셈');
			    },function(){
					alert('저장 실패')	
				});
			};

		    $scope.identifyUser();
		    $scope.pushRegister();
			};
	};

	// Open the login modal
	$scope.login = function() {
		console.log($rootScope.loginState);
		if($rootScope.loginState == "R"){
			$scope.modal.show();
		}else{
			$scope.id_title = "";
			$scope.UserId = "";
			$scope.Admin_Code = "";
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
		$scope.Admin_Code = $scope.loginData.Admin_Code;
		$scope.G_id = $scope.loginData.UserId;
		$scope.G_Pass = $scope.loginData.Pwd;
		$scope.SCM_Use_YN = $scope.loginData.SCM_Use_YN
		$scope.Auto_Login = $scope.loginData.Auto_Login

		if ($scope.Auto_Login != true) {
			//SCM 로그인
			if ($scope.SCM_Use_YN == true) {
				loginService.comInfo('scm_login', $scope.Admin_Code, $scope.G_id, $scope.G_Pass)
				.then(function(comInfo){
					if (comInfo.data.list.length > 0){
						$scope.Admin_Code = comInfo.data.list[0].Admin_Code;
						$scope.GerName = comInfo.data.list[0].GerName + '<br>(' + comInfo.data.list[0].G_Code + ')';
						$scope.G_id = comInfo.data.list[0].G_ID;
						$scope.G_Code = comInfo.data.list[0].G_Code;
						$scope.loginHTML = "로그아웃";
						$rootScope.loginState = "S";

						$timeout(function() {
							$scope.closeLogin();
						}, 100);

						// $rootScope.$on('$cordovaPush:tokenReceived', function(event, data) {
						// 	alert("Successfully registered token " + data.token);
						// 	console.log('Ionic Push: Got token ', data.token, data.platform);
						// 	$scope.token = data.token;
						// });

						// $scope.identifyUser = function() {
						// 	var user = $ionicUser.get();
						// 	if(!user.user_id) {
						// 		// Set your user_id here, or generate a random one.
						// 		user.user_id = $ionicUser.generateGUID();
						// 	};

						// 	// Metadata
						// 	angular.extend(user, {
						// 		name: $scope.Admin_Code,
						// 		bio: $scope.GerName + 'SCM_USER'
						// 	});

						// 	// Identify your user with the Ionic User Service
						// 	$ionicUser.identify(user).then(function(){
						// 	$scope.identified = true;
						// 		console.log('Identified user ' + user.name + '\n ID ' + user.user_id);
						// 	});
						// };

						// // Registers a device for push notifications
						// $scope.pushRegister = function() {
						// 	console.log('Ionic Push: Registering user');

						// 	// Register with the Ionic Push service.  All parameters are optional.
						// 	$ionicPush.register({
						// 		canShowAlert: true, //Can pushes show an alert on your screen?
						// 		canSetBadge: true, //Can pushes update app icon badges?
						// 		canPlaySound: true, //Can notifications play a sound?
						// 		canRunActionsOnWake: true, //Can run actions outside the app,
								
						// 		onNotification: function(notification) {
						// 			// Handle new push notifications here
						// 			return true;
						// 		}
						// 	});
						// };

						// $scope.pushUserRegist = function() {
						// 	console.log('Ionic Push: Regist user DATABASE Insert');
						//     pushInfoService.pushInfo('Mobile_Push_Token', $scope.Admin_Code, $scope.UserId, $scope.UserKey, $scope.token, $rootScope.loginState, 'A')
						//     .then(function(pushInfo){
						//     	console.log('테이블 저장 성공');
						//     },function(){
						// 		alert('저장 실패')	
						// 	});
						// };
					 //    $scope.identifyUser();
					 //    $scope.pushRegister();
						// $scope.pushUserRegist();
					}
				},
				function(){
					alert('로그인실패')
				});
			}else{
				//ERPia 로그인
				loginService.comInfo('ERPiaLogin', $scope.Admin_Code, $scope.G_id, $scope.G_Pass)
				.then(function(comInfo){
					if (comInfo.data.list.length > 0){
						console.log('comInfo', comInfo);
						$scope.Com_Name = comInfo.data.list[0].Com_Name + '<br>(' + comInfo.data.list[0].Com_Code + ')';
						$scope.UserId = comInfo.data.list[0].user_id;
						$scope.package = comInfo.data.list[0].Pack_Name;
						$scope.cnt_site = comInfo.data.list[0].CNT_Site + " 개";
						$scope.loginHTML = "로그아웃<br>(" + comInfo.data.list[0].Com_Code + ")";
						$rootScope.loginState = "E";

						$timeout(function() {
							$scope.closeLogin();
						}, 100);

						// $rootScope.$on('$cordovaPush:tokenReceived', function(event, data) {
						// 	alert("Successfully registered token " + data.token);
						// 	console.log('Ionic Push: Got token ', data.token, data.platform);
						// 	$scope.token = data.token;
						// 	$scope.pushUserRegist();
						// });
					 //    $scope.identifyUser();
					 //    $scope.pushRegister();
					}
				},
				function(){
					alert('로그인실패')
				});

				$rootScope.urlData = [
				{
					"url" : "#/erpia_home/erpiahome.html"
				}, {
					"url" : "http://www.erpia.net/psm/02/html/Graph.asp?Admin_Code=YGNEXT&swm_gu=1&kind=chart7"
				}, {
					"url" : "http://www.erpia.net/psm/02/html/Graph.asp?Admin_Code=YGNEXT&swm_gu=1&kind=chart2"
				}, {
					"url" : "http://www.erpia.net/psm/02/html/Graph.asp?Admin_Code=YGNEXT&swm_gu=1&kind=chart6"
				},{
					"url" : "http://www.erpia.net/psm/02/html/Graph.asp?Admin_Code=YGNEXT&swm_gu=1&kind=chart4"
				}, {
					"url" : "http://www.erpia.net/psm/02/html/Graph.asp?Admin_Code=YGNEXT&swm_gu=1&kind=chart3"
				}, {
					"url" : "http://www.erpia.net/psm/02/html/Graph.asp?Admin_Code=YGNEXT&swm_gu=1&kind=chart11"
				},{
					"url" : "http://www.erpia.net/psm/02/html/Graph.asp?Admin_Code=YGNEXT&swm_gu=1&kind=chart12"
				}, {
					"url" : "http://www.erpia.net/psm/02/html/Graph.asp?Admin_Code=YGNEXT&swm_gu=1&kind=chart13"
				}, {
					"url" : "http://www.erpia.net/psm/02/html/Graph.asp?Admin_Code=YGNEXT&swm_gu=1&kind=chart14"
				},{
					"url" : "http://www.erpia.net/psm/02/html/Graph.asp?Admin_Code=YGNEXT&swm_gu=1&kind=chart8"
				}, {
					"url" : "http://www.erpia.net/psm/02/html/Graph.asp?Admin_Code=YGNEXT&swm_gu=1&kind=chart1"
				}, {
					"url" : "http://www.erpia.net/psm/02/html/Graph.asp?Admin_Code=YGNEXT&swm_gu=1&kind=chart15"
				},{
					"url" : "http://www.erpia.net/psm/02/html/Graph.asp?Admin_Code=YGNEXT&swm_gu=1&kind=chart9"
				}, {
					"url" : "http://www.erpia.net/psm/02/html/Graph.asp?Admin_Code=YGNEXT&swm_gu=1&kind=chart17"
				}, {
					"url" : "http://www.erpia.net/psm/02/html/Graph.asp?Admin_Code=YGNEXT&swm_gu=1&kind=chart10"
				}];

				$rootScope.urlData2 = [
				{
					"url" : "#/chart/candleStick.html"
				}, {
					"url" : "#/chart/candleStick.html"
				}, {
					"url" : "#/chart/candleStick.html"
				}, {
					"url" : "#/chart/candleStick.html"
				}];
			};
		};
		// console.log('Doing login', $scope.loginData);
		//location.href="#/app/home";
		//alert("로그인성공");

		// Simulate a login delay. Remove this and replace with your login
		// code if using a login system
		
	};

  	$scope.loginHTML = "로그인";	
})

.controller("IndexCtrl", ['$rootScope', "$scope", "$stateParams", "$q", "$location", "$window", '$timeout', '$http', '$sce', 'ERPiaInfoService',
	function($rootScope, $scope, $stateParams, $q, $location, $window, $timeout, $http, $sce, ERPiaInfoService) {
		console.log("IndexCtrl");
		$scope.myStyle = {
		    "width" : "100%",
		    "height" : "100%"
		};

		$scope.ERPiaBaseData = function() {
			console.log("IndexCtrl::" + $rootScope.loginState);

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

			ERPiaInfoService.ERPiaInfo('erpia_dashBoard', $scope.Admin_Code, aWeekAgo, nowday)
			.then(function(ERPiaInfo){
				if (ERPiaInfo.data.list.length > 0){
					$scope.E_NewOrder = ERPiaInfo.data.list[0].CNT_JuMun_New;
					$scope.E_BsComplete = ERPiaInfo.data.list[0].CNT_BS_NO;
					$scope.E_InputMno = ERPiaInfo.data.list[0].CNT_BS_No_M_No;
					$scope.E_CgComplete = ERPiaInfo.data.list[0].CNT_BS_Before_ChulGo;
					$scope.E_RegistMno = ERPiaInfo.data.list[0].CNT_BS_After_ChulGo_No_Upload;

					$scope.E_TOT = parseInt(ERPiaInfo.data.list[0].CNT_JuMun_New) + parseInt(ERPiaInfo.data.list[0].CNT_BS_NO) + parseInt(ERPiaInfo.data.list[0].CNT_BS_No_M_No)
								 + parseInt(ERPiaInfo.data.list[0].CNT_BS_Before_ChulGo) + parseInt(ERPiaInfo.data.list[0].CNT_BS_After_ChulGo_No_Upload)
				}
			},
			function(){
				alert('조회 실패')
			});
		};

		$scope.ERPiaBaseData();
		$scope.tabs = [{
			"text" : "홈"
		}, {
			"text" : "매출 실적 추이"
		}, {
			"text" : "사이트별 매출 점유율"
		}, {
			"text" : "매출이익증감율"
		}, { 
			"text" : "상품별 매출 TOP5"
		}, {
			"text" : "브랜드별 매출 TOP5"
		}, {
			"text" : "온오프라인 비교 매출"
		}, {
			"text" : "매출반품현황"
		}, {
			"text" : "상품별 매출 반품 건수/반품액 TOP5"
		}, {
			"text" : "CS 컴플레인 현황"
		}, {
			"text" : "매입 현황"
		}, {
			"text" : "거래처별 매입 점유율 TOP 10"
		}, {
			"text" : "상품별 매입건수/매입액 TOP5"
		}, { 
			"text" : "최근배송현황"
		}, {
			"text" : "배송현황"
		}, {
			"text" : "택배사별 구분 건수 통계"
		}, {
			"text" : "재고 회전율 TOP5"
		}];

		$scope.url = "";
		$scope.onSlideMove = function(data) {
			try{
				$scope.chart_url = $rootScope.urlData[data.index].url;//$sce.trustAsResourceUrl("http://www.erpia.net/psm/02/html/Graph.asp?Admin_Code=YGNEXT&swm_gu=1&kind=chart7");
			}catch(err){

			}
			console.log($scope.chart_url);

			// try{
			// 	$scope.url = $rootScope.urlData[data.index].url;
			// // 	$scope.login_alert = "";

			// 	console.log("define:" + $scope.url);
			// }catch (err){
			// // 	// $scope.login_alert = "로그인하세요";
			// 	console.log("undefine");
			// }
			
			$scope.myStyle = {
			    "width" : "100%",
			    "height" : "100%"
			};
			//alert("You have selected " + $scope.tabs[data.index].text + " tab");
		};
	}])

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

	// 	if($rootScope.loginState == "E") {
	// 		$http({
	// 			method: 'POST',
	// 			url: 'https://www.erpia.net/include/JSon_Proc_MyPage_Scm.asp',
	// 			data: 	"kind=" + "erpia_dashBoard"
	// 					+ "&Admin_Code=" + $scope.Admin_Code
	// 					+ "&sDate=" + "2015-07-01"
	// 					+ "&eDate=" + "2015-09-31",
	// 			headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=euc-kr'} //헤더
	// 		})
	// 		  .success(function (response) {
	// 			console.log(response);
	// 			$scope.E_NewOrder = response.list[0].Cnt
	// 			$scope.E_BsComplete = response.list[1].Cnt
	// 			$scope.E_InputMno = response.list[2].Cnt
	// 			$scope.E_CgComplete = response.list[3].Cnt
	// 			$scope.E_RegistMno = response.list[4].Cnt

	// 			$scope.E_TOT = $scope.E_NewOrder + $scope.E_BsComplete + $scope.E_InputMno + $scope.E_CgComplete + $scope.E_RegistMno
	// 		})
	// 		  .error(function(data, status, headers, config){
	// 			console.log("Fail");
	// 		})
	// 	}else{
	// 		// alert(response.list[0].ResultMsg);
	// 	};
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

.controller('CsCtrl', function($rootScope, $scope, $ionicModal, $timeout, $stateParams, $location, $http){
	console.log("CsCtrl");

    $scope.dialNumber = function(number) {
        window.open('tel:' + number, '_system');
    }
 	var data = [{id:1,nmPlaca:'IKC-1394'},{id:2,nmPlaca:'IKY-5437'},{id:3,nmPlaca:'IKC-1393'},{id:4,nmPlaca:'IKI-5437'},{id:5,nmPlaca:'IOC-8749'},{id:6,nmPlaca:'IMG-6509'}];
    $scope.veiculos = data;
    $scope.testa = function(){
      alert($scope.veiculo.nmPlaca);
    }
})

.controller('BoardSelectCtrl', function($rootScope, $scope, $ionicModal, $timeout, $stateParams, $location, $http){
	console.log("BoardSelectCtrl");

	$scope.BoardSelect1 = function() {	 
		$rootScope.boardIndex = "1";
		console.log($rootScope.boardIndex);
	};
	$scope.BoardSelect2 = function() {	 
		$rootScope.boardIndex = "2";
		console.log($rootScope.boardIndex);
	};
	$scope.BoardSelect3 = function() {	 
		$rootScope.boardIndex = "3";
		console.log($rootScope.boardIndex);
	};
	$scope.BoardSelect4 = function() {	 
		$rootScope.boardIndex = "4";
		console.log($rootScope.boardIndex);
	};
})

.controller('BoardMainCtrl', function($rootScope, $scope, $ionicModal, $timeout, $stateParams, $location, $http){
	console.log("BoardMainCtrl");

	$scope.tabs2 = [{
			"text" : "공지사항"
		}, {
			"text" : "업데이트 현황"
		}, {
			"text" : "지식 나눔방"
		}, {
			"text" : "업체문의 Q&A"
		}];

		$scope.url = "";
		$scope.onSlideMove2 = function(data) {
			try{
				$scope.url2 = $rootScope.urlData2[data.index].url;
			// 	$scope.login_alert = "";

				console.log("define:" + $scope.url2);
			}catch (err){
			// 	// $scope.login_alert = "로그인하세요";
				console.log("undefine");w
			}
			
			$scope.myStyle = {
			    "width" : "100%",
			    "height" : "100%"
			};
			//alert("You have selected " + $scope.tabs[data.index].text + " tab");
		};

	$scope.BoardBaseData = function() {
		 
		// $scope.Kind = "scm_login";
		// $scope.Admin_Code = $scope.loginData.Admin_Code;
		// $scope.G_id = $scope.loginData.UserId;
		// $scope.G_Pass = $scope.loginData.Pwd;
		// $scope.SCM_Use_YN = $scope.loginData.SCM_Use_YN
		// $scope.Auto_Login = $scope.loginData.Auto_Login

		// if($rootScope.loginState == "E") {
			$http({
				method: 'POST',
				url: 'https://www.erpia.net/include/JSon_Proc_MyPage_Scm_Manage.asp',
				data: 	"kind=" + "board_notice"
						+ "&Admin_Code=" + "onz",
				headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=euc-kr'} //헤더
			})
			  .success(function (response) {
				// console.log(response);

				// console.log($stateParams);
				// $scope.playlists2 = response

				var items = [];
  				for (var i = 0; i < 10; i++) {
  					items = response.list[i]
  					console.log(items);
  				}

  				$scope.itemlist = items;
  				console.log($scope.itemlist);
  				
				// $scope.E_BsComplete = response.list[1].Cnt
				// $scope.E_InputMno = response.list[2].Cnt
				// $scope.E_CgComplete = response.list[3].Cnt
				// $scope.E_RegistMno = response.list[4].Cnt

				// $scope.E_TOT = $scope.E_NewOrder + $scope.E_BsComplete + $scope.E_InputMno + $scope.E_CgComplete + $scope.E_RegistMno
			})
			  .error(function(data, status, headers, config){
				console.log("Fail");
			})
		// }else{
			// alert(response.list[0].ResultMsg);
		// };
	};
	$scope.BoardBaseData();
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
