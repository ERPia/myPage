// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','ionic.service.core','ngCordova','ionic.service.push', 'starter.controllers', 'tabSlideBox' ,'ngCordova'
	, 'starter.services'])

 // .constant('ERPiaAPI',{
 // 	url:'http://localhost:8100/include'
 // 	, imgUrl:'http://localhost:8100/erpia_update/img'
 // 	, toast:'N'
 // })

//실제 사용시
.constant('ERPiaAPI',{
	url:'http://www.erpia.net/include'
	, imgUrl:'http://erpia2.godohosting.com/erpia_update/img'
	, toast:'Y'
})

.run(function($ionicPlatform, $ionicPush, $ionicUser, $rootScope, $ionicHistory) {
	$ionicPlatform.ready(function() {
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		ionic.Platform.fullScreen();
		if(window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}
		
        if(window.StatusBar) {
			StatusBar.styleDefault();
		}
		$rootScope.$on('$cordovaPush:tokenReceived', function(event, data) {
		    // alert("Successfully registered token " + data.token);
		    console.log('Ionic Push: Got token ', data.token, data.platform);
		    $rootScope.token = data.token;
		    //디바이스 토큰 값 받는곳
		});
		//★push regist
		console.log('Ionic Push: Registering user');
		var user = $ionicUser.get();
		if(!user.user_id) {
			// Set your user_id here, or generate a random one.
			user.user_id = $ionicUser.generateGUID();
			$rootScope.UserKey = user.user_id
		};

		// Metadata
		angular.extend(user, {
			name: 'ERPiaUser',
			bio: 'ERPiaPush'
		});

		// Identify your user with the Ionic User Service
		$ionicUser.identify(user).then(function(){
			//$scope.identified = true;
			console.log('Identified user ' + user.name + '\n ID ' + user.user_id);
		});


		// Register with the Ionic Push service.  All parameters are optional.
		$ionicPush.register({
			canShowAlert: true, //Can pushes show an alert on your screen?
			canSetBadge: true, //Can pushes update app icon badges?
			canPlaySound: true, //Can notifications play a sound?
			canRunActionsOnWake: true, //Can run actions outside the app,
			
			onNotification: function(notification) {
				// Handle new push notifications here
				console.log(notification);
				//notification.message;  푸시 알람 내용
				if(notification.payload){	
					//notification.payload.payload.$state 푸시에서 명시한 로드될 화면
					if(notification.payload.payload.$state === "app.erpia_board-Main"){
						// alert("tab.chats");
						//$rootScope.boardIndex = $rootScope.BoardParam
						//$state.go("app.erpia_board-Main")
						if(notification.payload.payload.$BoardParam === "0"){
							$rootScope.boardIndex = notification.payload.payload.$BoardParam
						}else if(notification.payload.payload.$BoardParam === "1"){
							$rootScope.boardIndex = notification.payload.payload.$BoardParam
						}else if(notification.payload.payload.$BoardParam === "2"){
							$rootScope.boardIndex = notification.payload.payload.$BoardParam
						}else if(notification.payload.payload.$BoardParam === "4"){
							$rootScope.boardIndex = notification.payload.payload.$BoardParam
						}							
					}
				}
			}
		});
	});
	$rootScope.goHome = function(userType){
		$ionicHistory.clearCache();
		$ionicHistory.clearHistory();
		$ionicHistory.nextViewOptions({disableBack:true, historyRoot:true});
		switch($rootScope.userType){
			case 'ERPia': location.href = '#/app/slidingtab'; break;
			case 'SCM' : location.href = '#/app/scmhome'; break;
			case 'Geust': location.href = '#/app/sample/Main'; break;
			default : location.href = '#/app/sample/Main'; break;
		} 
	}
	$rootScope.goto_with_clearHistory = function(goto_Href){
		$ionicHistory.clearCache();
		$ionicHistory.clearHistory();
		$ionicHistory.nextViewOptions({disableBack:true, historyRoot:true});
		location.href = goto_Href;
	}
	$rootScope.goto_with_backButton = function(goto_Href){
		$ionicHistory.clearCache();
		$ionicHistory.clearHistory();
		location.href = goto_Href;	
	}
	$rootScope.goBack_with_clearHistory = function() {
		$ionicHistory.goBack();
		$ionicHistory.clearCache();
		$ionicHistory.clearHistory();
		$ionicHistory.nextViewOptions({disableBack:true, historyRoot:true});
		//location.href = '#app/config';
	};
	$rootScope.rndNum = 0;
})

// 	// if none of the above states are matched, use this as the fallback
// 	$urlRouterProvider.otherwise('/app/slidingtab');
// });
// device token(iPhone6 plus) : 1d1070d82459a34181921255227fca4d55d87692f68e498e6e0d1e5d953a8abb

.config(['$ionicAppProvider', function($ionicAppProvider) {
	$ionicAppProvider.identify({
      	app_id: '256d0feb', //app id
		// api_key:'8d60e2043f9eb247083a7479d1865a5020c9478458051c06',		// public key 개발테스트시 
		// dev_push: true // 개발테스트시
		api_key:'5c142d3b4c0bc012c7bcd2f45b6b0019a78e0693617d04ca', 	// private key 실적용시
		dev_push: false // 실적용시
	});
}])
.config(function($stateProvider, $urlRouterProvider, $ionicAppProvider) {
	$stateProvider
	
	.state('app', {
		url : '/app',
		abstract : true,
		templateUrl : 'side/menu.html',
		controller : 'AppCtrl'
	})

	.state('app.erpia_main', {
		url : '/main',
		views : {
			'menuContent' : {
				templateUrl : 'erpia_main/main.html',
				controller : 'MainCtrl'
			}
		}
	})

	.state('app.erpia_login', {
		url : '/login',
		views : {
			'menuContent' : {
				templateUrl : 'erpia_login/login.html'
			}
		}
	})
  
	.state('app.erpia_scmhome', {
		url : '/scmhome',
		views : {
			'menuContent' : {
				templateUrl : 'erpia_scmhome/scmhome.html',
				controller : 'ScmUser_HomeCtrl'
			}
		}
	})

	.state('app.slidingtab', {
		url : '/slidingtab',
		views : {
			'menuContent' : {
				templateUrl : 'slidingtab/slidingTabsUsingRepeat.html',
				controller : 'IndexCtrl'
			}
		}
	})

	.state('app.agreement', {
		url : '/agreement',
		views : {
			'menuContent' : {
				templateUrl : 'side/agreement.html',
				controller : 'AppCtrl'
			}
		}
	})

	.state('app.mobile_certification', {
		url : '/certification',
		views : {
			'menuContent' : {
				templateUrl : 'side/certification.html',
				controller : 'AppCtrl'
			}
		}
	})
	/////////////////////////////////////trade////////////////////////////////////
	.state('app.check_Sano', {
		url : '/check_Sano',
		views : {
			'menuContent' : {
				templateUrl : 'side/check_Sano.html',
				//controller : 'tradeCtrl'
			}
		}
	})
	.state('app.tradeList', {
		url : '/tradeList',
		views : {
			'menuContent' : {
				templateUrl : 'side/tradeList.html',
				controller : 'tradeCtrl'
			}
		}
	})
	.state('app.trade_Detail', {
		url : '/trade_Detail',
		views : {
			'menuContent' : {
				templateUrl : 'side/trade_Detail.html',
				controller : 'tradeCtrl'
			}
		}
	})
	.state('app.trade_Detail_Print', {
		url : '/trade_Detail_Print',
		views : {
			'menuContent' : {
				templateUrl : 'side/trade_Detail_Print.html',
				controller : 'tradeCtrl'
			}
		}
	})
	.state('app.erpia_board', {
		url : '/board',
		views : {
			'menuContent' : {
				templateUrl : 'erpia_board/board.html',
				controller : 'BoardSelectCtrl'
			}
		}
	})

	.state('app.erpia_board-Main', {
		url : '/board/Main',
		views : {
			'menuContent' : {
				templateUrl : 'erpia_board/board-main.html',
				controller : 'BoardMainCtrl'
			}
		}
	})

	.state('app.erpia_cs', {
		url : '/cs',
		views : {
			'menuContent' : {
				templateUrl : 'erpia_cs/cs.html',
				controller : 'CsCtrl'
			}
		}
	})

	.state('app.erpia_push', {
		url : '/push',
		views : {
			'menuContent' : {
				templateUrl : 'erpia_push/push.html',
				controller : 'PushCtrl'
			}
		}
	})

	.state('app.erpia_push.push-detail', {
		url : '/PushList/:Seq',
		views : {
			'menuContent' : {
				templateUrl : 'erpia_push/push-detail.html',
				controller : 'PushDetailCtrl'
			}
		}
	})

	.state('app.erpia_introduce', {
		url : '/introduce',
		views : {
			'menuContent' : {
				templateUrl : 'erpia_introduce/erpiaIntroduce.html',
				// controller : 'CsCtrl'
			}
		}
	})

	.state('app.erpia_servicelist', {
		url : '/servicelist',
		views : {
			'menuContent' : {
				templateUrl : 'erpia_servicelist/erpiaServicelist.html',
				// controller : 'CsCtrl'
			}
		}
	})

	////////////////////////////////////config///////////////////////////////////
	.state('app.config', {
		url : '/config',
		views : {
			'menuContent' : {
				templateUrl : 'config/home.html',
				controller : 'configCtrl'
			}
		}
	})
	.state('app.config-Info', {
		url : '/config/Info',
		views : {
			'menuContent' : {
				templateUrl : 'config/Info.html',
				controller : 'configCtrl_Info'
			}
		}
	})
	.state('app.config-notice', {
		url : '/config/notice',
		views : {
			'menuContent' : {
				templateUrl : 'config/notice.html',
				controller : 'configCtrl_Notice'
			}
		}
	})
	.state('app.config-custom', {
		url : '/config/custom',
		views : {
			'menuContent' : {
				templateUrl : 'config/custom.html'
			}
		}
	})
	.state('app.config-alarm', {
		url : '/config/alarm',
		views : {
			'menuContent' : {
				templateUrl : 'config/alarm.html',
				controller : 'configCtrl_alarm'
			}
		}
	})
	.state('app.config-statistics', {
		url : '/config/statistics',
		views : {
			'menuContent' : {
				templateUrl : 'config/statistics.html',
				controller : 'configCtrl_statistics'
			}
		}
	})
	.state('app.config-loginConfig', {
		url : '/config/loginConfig',
		views : {
			'menuContent' : {
				templateUrl : 'config/loginConfig.html',
				controller : 'configCtrl_login'
			}
		}
	})
	/////////////////////////////////////tab////////////////////////////////////
	.state('app.tab', {
		url : '/tab',
		views : {
			'menuContent' : {
				templateUrl : 'tab/tabs.html'				 
			}
		}
	})
	////////////////////////////////sample///////////////////////////////////
	.state('app.chart_test', {
		url : '/chart_test',
		views : {
			'menuContent' : {
				templateUrl : 'test/meaip_test.html',
				controller : 'chartTestCtrl'
			}
		}
	})
	/*전표조회*/
	.state('app.meaipChit', {
      url: '/meaipChit',
      views: {
        'menuContent': {
          templateUrl: 'test/meaipChit.html',
          controller: 'chartTestCtrl'
        }
      }
    })
    /*전표조회*/
	.state('app.meaipInsert', {
      url: '/meaipInsert',
      views: {
        'menuContent': {
          templateUrl: 'test/meaipInsert_basic.html',
          controller: 'meaipInsertCtrl'
        }
      }
    })
 // 	.state('app.tab.dash', {
	// 	url : '/dash',
	// 	views : {
	// 		'tab-dash' : {
	// 			templateUrl : 'tab/tab-dash.html'
				
	// 		}
	// 	}
	// })

 //  	.state('app.tab.chats', {
	// 	url : '/chats',
	// 	views : {
	// 		'tab-chats' : {
	// 			templateUrl : 'tab/tab-chats.html',
	// 			controller : 'ChatsCtrl'
	// 		}
	// 	}
	// })

	// .state('app.tab.chat-detail', {
	// 	url : '/chats/:chatId',
	// 	views : {
	// 		'tab-chats' : {
	// 			templateUrl : 'tab/chat-detail.html',
	// 			controller : 'ChatDetailCtrl'
	// 		}
	// 	}
	// })

	// .state('app.tab.account', {
	// 	url : '/account',
	// 	views : {
	// 		'tab-account' : {
	// 			templateUrl : 'tab/tab-account.html',
	// 			controller : 'AccountCtrl'
	// 		}
	// 	}
	// })

  ////////////////////////////////side///////////////////////////////////
 //    .state('app.browse', {
	// 	url : '/browse',
	// 	views : {
	// 		'menuContent' : {
	// 			templateUrl : 'side/browse.html'
	// 		}
	// 	}
	// })

 //    .state('app.search', {
	// 	url : '/search',
	// 	views : {
	// 		'menuContent' : {
	// 			templateUrl : 'side/search.html'
	// 		}
	// 	}
	// })

	// .state('app.playlists', {
	// 	url : '/playlists',
	// 	views : {
	// 		'menuContent' : {
	// 			templateUrl : 'side/playlists.html',
	// 			controller : 'PlaylistsCtrl'
	// 		}
	// 	}
	// })

	// .state('app.single', {
	// 	url : '/playlists/:playlistId',
	// 	views : {
	// 		'menuContent' : {
	// 			templateUrl : 'side/playlist.html',
	// 			controller : 'PlaylistCtrl'
	// 		}
	// 	}
	// });

	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/app/main');
});

