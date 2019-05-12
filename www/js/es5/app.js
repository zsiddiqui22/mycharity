"use strict";

// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
// ,'ngMaterial', 'ngMessages'
angular.module('starter', ['ionic', 'starter.controllers', 'angular-clipboard', 'ngAnimate', 'ionic-toast', 'ngSanitize', 'starter.projectProfileOrg', 'starter.discoverMap', 'starter.heroProfile', 'starter.challangeProfile', 'starter.profileOrg', 'starter.services', 'ngCordova', 'rzModule', 'angularPayments', 'ionic-datepicker', 'ngFileUpload', 'ngTextTruncate', 'ionic-timepicker']).run(function ($rootScope, $ionicPlatform, $window, $state) {
  $ionicPlatform.ready(function ($rootScope) {
    // $rootScope.loadingShow = function() {
    //   $ionicLoading.show({
    //     template: 'Loading...',
    //   }).then(function(){
    //   });
    // };
    // $rootScope.loadingHide = function(){
    //   $ionicLoading.hide().then(function(){
    //   });
    // };
    if (window.cordova && window.Keyboard) {
      window.Keyboard.hideKeyboardAccessoryBar(true);
    }

    if (window.StatusBar) {
      // Set the statusbar to use the default style, tweak this to
      // remove the status bar on iOS or change it to use white instead of dark colors.
      StatusBar.styleDefault();
    }
  });
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, options) {
    if (window.localStorage.getItem('mch_mob_data')) {
      var role_name = JSON.parse(window.localStorage.mch_mob_data).role;

      if (role_name == "guest" && (toState.name == 'app.organzationcreate' || toState.name == 'app.organzationcedit' || toState.name == 'app.challangecreate' || toState.name == 'app.challangeedit' || toState.name == 'app.projectcreate' || toState.name == 'app.projectedit' || toState.name == 'app.herocreate' || toState.name == 'app.heroedit')) {
        if (fromState.name) {
          $state.go(fromState.name);
        } else {
          $state.go('app.discover');
          event.preventDefault();
        }
      }
    } else {
      if (toState.name == 'app.organzationcreate' || toState.name == 'app.organzationcedit' || toState.name == 'app.challangecreate' || toState.name == 'app.challangeedit' || toState.name == 'app.projectcreate' || toState.name == 'app.projectedit' || toState.name == 'app.herocreate' || toState.name == 'app.heroedit') {
        if (fromState.name) {
          $state.go(fromState.name);
          event.preventDefault();
        } else {
          $state.go('app.discover');
          event.preventDefault();
        }
      }
    }
  });
}) // .config(function (ionicTimePickerProvider) {
//   var timePickerObj = {
//     inputTime: (((new Date()).getHours() * 60 * 60) + ((new Date()).getMinutes() * 60)),
//     format: 24,
//     step: 15,
//     setLabel: 'Set',
//     closeLabel: 'Close'
//   };
//   ionicTimePickerProvider.configTimePicker(timePickerObj);
// })
.config(function (ionicDatePickerProvider) {
  var datePickerObj = {
    // inputDate: new Date('Jan 15,2019'),
    titleLabel: 'Select a Date',
    setLabel: 'Set',
    todayLabel: 'Today',
    closeLabel: 'Close',
    mondayFirst: false,
    weeksList: ["S", "M", "T", "W", "T", "F", "S"],
    monthsList: ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"],
    templateType: 'popup',
    from: new Date(1500, 0, 0),
    // to: new Date(),
    // to: new Date(2019, 8, 1),
    showTodayButton: true,
    dateFormat: 'MMM DD,YYYY',
    closeOnSelect: false,
    disableWeekdays: []
  };
  ionicDatePickerProvider.configDatePicker(datePickerObj);
}).config(function () {
  // window.Stripe.setPublishableKey('pk_test_kwsDXVDxJqCkJXUVpQVFJoUM'); //local key 
  window.Stripe.setPublishableKey('pk_live_n2cfANbMcgH9Dt9uBQZBm0nQ'); //live key
}).config(function ($ionicConfigProvider) {
  $ionicConfigProvider.tabs.position('top');
}).config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider.state('app', {
    url: '/app',
    "abstract": true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  }) // organziation start
  .state('app.organization', {
    url: '/organization',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/organization/index.html',
        controller: 'OrganizationCtrl'
      }
    }
  }).state('app.organization.current', {
    url: '/current',
    cache: false,
    views: {
      'tab-current': {
        templateUrl: 'templates/organization/tab-current.html',
        controller: 'OrganizationCurrentCtrl'
      }
    }
  }).state('app.organization.suggested', {
    url: '/suggested',
    cache: false,
    views: {
      'tab-suggested': {
        templateUrl: 'templates/organization/tab-suggested.html',
        controller: 'OrganizationSuggestedCtrl'
      }
    }
  }).state('app.organization.past', {
    url: '/past',
    cache: false,
    views: {
      'tab-past': {
        templateUrl: 'templates/organization/tab-past.html',
        controller: 'OrganizationPastCtrl'
      }
    }
  }).state('app.organzationcreate', {
    url: '/organization/create',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/organization/create.html',
        controller: 'OrganizationCreateCtrl'
      }
    }
  }).state('app.organzationcedit', {
    url: '/organization/edit/:id',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/organization/create.html',
        controller: 'OrganizationCreateCtrl'
      }
    }
  }) // organziation end
  // project start
  .state('app.projectcreate', {
    url: '/project/create',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/project/create.html',
        controller: 'ProjectCreateCtrl'
      }
    }
  }).state('app.projectedit', {
    url: '/project/edit/:id',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/project/create.html',
        controller: 'ProjectCreateCtrl'
      }
    }
  }).state('app.herocreate', {
    url: '/hero/create',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/heroes/create.html',
        controller: 'HeroCreateCtrl'
      }
    }
  }).state('app.heroedit', {
    url: '/hero/edit/:id',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/heroes/create.html',
        controller: 'HeroCreateCtrl'
      }
    }
  }).state('app.project', {
    url: '/project',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/project/index.html',
        controller: 'ProjectCtrl'
      }
    }
  }).state('app.project.current', {
    url: '/current',
    cache: false,
    views: {
      'tab-project-current': {
        templateUrl: 'templates/project/tab-current.html',
        controller: 'ProjectCurrentCtrl'
      }
    }
  }).state('app.project.suggested', {
    url: '/suggested',
    cache: false,
    views: {
      'tab-project-suggested': {
        templateUrl: 'templates/project/tab-suggested.html',
        controller: 'ProjectSuggestedCtrl'
      }
    }
  }).state('app.project.past', {
    url: '/past',
    cache: false,
    views: {
      'tab-project-past': {
        templateUrl: 'templates/project/tab-past.html',
        controller: 'ProjectPastCtrl'
      }
    }
  }) // project end
  // challenges start
  .state('app.challangecreate', {
    url: '/challange/create',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/challenges/create.html',
        controller: 'ChallangeCreateCtrl'
      }
    }
  }).state('app.challangeedit', {
    url: '/challange/edit/:id',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/challenges/create.html',
        controller: 'ChallangeCreateCtrl'
      }
    }
  }).state('app.challenges', {
    url: '/challenges',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/challenges/index.html',
        controller: 'ChallengeCtrl'
      }
    }
  }).state('app.challenges.current', {
    url: '/current',
    cache: false,
    views: {
      'tab-challenges-current': {
        templateUrl: 'templates/challenges/tab-current.html',
        controller: 'ChallengeCurrentCtrl'
      }
    }
  }).state('app.challenges.suggested', {
    url: '/suggested',
    cache: false,
    views: {
      'tab-challenges-suggested': {
        templateUrl: 'templates/challenges/tab-suggested.html',
        controller: 'ChallengeSuggestedCtrl'
      }
    }
  }).state('app.challenges.past', {
    url: '/past',
    cache: false,
    views: {
      'tab-challenges-past': {
        templateUrl: 'templates/challenges/tab-past.html',
        controller: 'ChallengePastCtrl'
      }
    }
  }) // challanges end
  // heroes start
  .state('app.heroes', {
    url: '/heroes',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/heroes/index.html',
        controller: 'HeroCtrl'
      }
    }
  }).state('app.heroes.current', {
    url: '/heroes',
    cache: false,
    views: {
      'tab-heroes-heroes': {
        templateUrl: 'templates/heroes/tab-heroes.html',
        controller: 'HeroHerosCtrl'
      }
    }
  }).state('app.heroes.suggested', {
    url: '/celeberities',
    cache: false,
    views: {
      'tab-heroes-celeberities': {
        templateUrl: 'templates/heroes/tab-celeberities.html',
        controller: 'HeroCelebrityCtrl'
      }
    }
  }).state('app.heroes.past', {
    url: '/supporters',
    cache: false,
    views: {
      'tab-heroes-supporters': {
        templateUrl: 'templates/heroes/tab-supporters.html',
        controller: 'HeroSupporterCtrl'
      }
    }
  }) // heroes end
  .state('login', {
    url: "/login",
    views: {
      '': {
        templateUrl: "templates/login.html",
        controller: 'LoginCtrl'
      }
    }
  }).state('signup', {
    url: "/signup",
    views: {
      '': {
        templateUrl: "templates/signup.html",
        controller: 'SignUpCtrl'
      }
    }
  }).state('forgot', {
    url: "/forgot",
    views: {
      '': {
        templateUrl: "templates/forgot.html",
        controller: 'ForgotCtrl'
      }
    }
  }) // discover start
  .state('app.discover', {
    url: '/discover?search',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/discover/index.html',
        controller: 'DiscoverCtrl'
      }
    }
  }).state('app.profile', {
    url: '/profile/:id/:redirect',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/common/profile.html',
        controller: 'ProfileCtrl'
      }
    } // resolve: {
    //   authorize: function (APIService) {
    //     if (!window.localStorage.mch_mob_data) {
    //       APIService.createGuest().then(function (response) {
    //           window.localStorage.setItem('mch_mob_data', JSON.stringify(response.data));
    //           // $rootScope.role = JSON.parse(window.localStorage.mch_mob_data).role;
    //           return response;
    //         },
    //         function (error_response) {
    //           return error_response;
    //         });
    //     }
    //     // return TaskService.list(SessionService.currentUserId,
    //     //   currentTimeframe.id);
    //   }
    // },

  }).state('app.hero-profile', {
    url: '/hero-profile/:id',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/common/hero-profile.html',
        controller: 'HeroProfileCtrl'
      }
    }
  }).state('app.project-profile', {
    url: '/project-profile/:id',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/common/project-profile.html',
        controller: 'ProjectProfileCtrl'
      }
    }
  }).state('app.challenge-profile', {
    url: '/challenge-profile/:id',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/common/challenge-profile.html',
        controller: 'ChallengeProfileCtrl'
      }
    }
  }).state('app.payments', {
    url: '/payments/:redirect/:redirectid',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/payment/payments.html',
        controller: 'PaymentsCtrl'
      }
    }
  }); // discover end
  // .state('app.signup', {
  //   url: "/signup",
  //   views: {
  //     'signup-tab': {
  //       templateUrl: "templates/signup.html"
  //     }
  //   }
  // });
  // .state('app.browse', {
  //     url: '/browse',
  //     views: {
  //       'menuContent': {
  //         templateUrl: 'templates/browse.html'
  //       }
  //     }
  //   })
  // .state('app.playlists', {
  //   url: '/playlists',
  //   views: {
  //     'menuContent': {
  //       templateUrl: 'templates/playlists.html',
  //       controller: 'PlaylistsCtrl'
  //     }
  //   }
  // })
  // .state('app.single', {
  //   url: '/playlists/:playlistId',
  //   views: {
  //     'menuContent': {
  //       templateUrl: 'templates/playlist.html',
  //       controller: 'PlaylistCtrl'
  //     }
  //   }
  // });
  // if none of the above states are matched, use this as the fallback

  $urlRouterProvider.otherwise('/app/discover');
});
/**
 * Fire an event handler to the specified node. Event handlers can detect that the event was fired programatically
 * by testing for a 'synthetic=true' property on the event object
 * @param {HTMLNode} node The node to fire the event handler on.
 * @param {String} eventName The name of the event without the "on" (e.g., "focus")
 */

function fireEvent(node, eventName) {
  // Make sure we use the ownerDocument from the provided node to avoid cross-window problems
  var doc;

  if (node.ownerDocument) {
    doc = node.ownerDocument;
  } else if (node.nodeType == 9) {
    // the node may be the document itself, nodeType 9 = DOCUMENT_NODE
    doc = node;
  } else {
    throw new Error("Invalid node passed to fireEvent: " + node.id);
  }

  if (node.dispatchEvent) {
    // Gecko-style approach (now the standard) takes more work
    var eventClass = ""; // Different events have different event classes.
    // If this switch statement can't map an eventName to an eventClass,
    // the event firing is going to fail.

    switch (eventName) {
      case "click": // Dispatching of 'click' appears to not work correctly in Safari. Use 'mousedown' or 'mouseup' instead.

      case "mousedown":
      case "mouseup":
        eventClass = "MouseEvents";
        break;

      case "focus":
      case "change":
      case "blur":
      case "select":
        eventClass = "HTMLEvents";
        break;

      default:
        throw "fireEvent: Couldn't find an event class for event '" + eventName + "'.";
        break;
    }

    var event = doc.createEvent(eventClass);
    var bubbles = eventName == "change" ? false : true;
    event.initEvent(eventName, bubbles, true); // All events created as bubbling and cancelable.

    event.synthetic = true; // allow detection of synthetic events

    node.dispatchEvent(event, true);
  } else if (node.fireEvent) {
    // IE-old school style
    var event = doc.createEventObject();
    event.synthetic = true; // allow detection of synthetic events

    node.fireEvent("on" + eventName, event);
  }
}

;