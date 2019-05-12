angular.module('starter.controllers', [])
  .directive('ngEnter', function () {
    return function (scope, element, attrs) {
      element.bind("keydown keypress", function (event) {

        if (event.which === 13 && !event.shiftKey) {

          scope.$apply(function () {
            scope.$eval(attrs.ngEnter);
          });

          event.preventDefault();
        }
      });
    };
  })
  .directive('autoFocus', function ($timeout) {
    return {
      link: function (scope, element, attrs) {
        attrs.$observe("autoFocus", function (newValue) {
          if (newValue === "true")
            $timeout(function () {
              element[0].focus()
            });
        });
      }
    };
  })
  .filter('multiline', function () {
    
    return function (text) {
      return text.replace(/\n/g, '<br>');
    }
  })
  // .filter('fundraise', function () {
  //   return functletion (data) {
  //    return data.raisdonation
  //   }
  // })
  // .filter('currencyrightside', function () {
  //   return function (text) {
  //     let data = "";
  //     text.raisdonation;
  //     profile.currency;
  //     status.concat()
  //     return data;
  //   }
  // })
  // local URL
  // .value('BASE_URL', 'http://192.168.0.152/MyCharityHero/public/api')
  // .value('IMAGE_PATH', 'http://192.168.0.152/MyCharityHero/public/images/')
  // .value('ATTACH_PATH', 'http://192.168.0.152/MyCharityHero/public/attachments/')
  
  // testing URL
  // .value('BASE_URL', 'https://api.mycharityhero.co.uk/MyCharityHero/public/api')
  // .value('IMAGE_PATH', 'https://api.mycharityhero.co.uk/MyCharityHero/public/images/')
  // .value('ATTACH_PATH', 'https://api.mycharityhero.co.uk/MyCharityHero/public/attachments/')

  // live URL
  .value('BASE_URL', 'https://mycharityhero.co.uk/MyCharityHero/public/api')
  .value('IMAGE_PATH', 'https://mycharityhero.co.uk/MyCharityHero/public/images/')
  .value('ATTACH_PATH', 'https://mycharityhero.co.uk/MyCharityHero/public/attachments/')
  .value('STYLE_JSON', [
    {
      "featureType": "administrative.land_parcel",
      "elementType": "labels",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi.business",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "labels",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "transit",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    }
  ])

  .component('myComponent', {
    template: '<h1>$ctrl.name</h1>',
    bindings: {
      name: '<' //one way data binding
    },
    controller: function () {
      //component controller
    }
  })

  .directive('slideable', function () {
    return {
      restrict: 'C',
      compile: function (element, attr) {
        // wrap tag
        var contents = element.html();
        element.html('<div class="slideable_content" style="margin:0 !important; padding:0 !important" >' + contents + '</div>');

        return function postLink(scope, element, attrs) {
          // default properties
          attrs.duration = (!attrs.duration) ? '1s' : attrs.duration;
          attrs.easing = (!attrs.easing) ? 'ease-in-out' : attrs.easing;
          element.css({
            'overflow': 'hidden',
            'height': '0px',
            'transitionProperty': 'height',
            'transitionDuration': attrs.duration,
            'transitionTimingFunction': attrs.easing
          });
        };
      }
    };
  })
  .directive('slideToggle', function () {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {

        var target = document.querySelector(attrs.slideToggle);
        attrs.expanded = false;
        element.bind('click', function () {
          var content = target.querySelector('.slideable_content');
          if (!attrs.expanded) {
            content.style.border = '1px solid rgba(0,0,0,0)';
            var y = content.clientHeight;
            content.style.border = 0;
            target.style.height = y + 'px';
          } else {
            target.style.height = '0px';
          }
          attrs.expanded = !attrs.expanded;
        });
      }
    };
  })
  .controller('AppCtrl', function ($scope, $rootScope, $ionicModal, $timeout, $ionicLoading, $cordovaToast, $ionicPopup, $state, APIService, IMAGE_PATH, ionicToast) {
    $scope.imagePath = IMAGE_PATH;
    // document.addEventListener('deviceready', function () {
    //   document.addEventListener('backbutton', function (event) {

    //     console.log('hey yaaahh');
    //   }, false);
    // }, false);
    // $scope.doantiontomycharityhero = [0, 2, 5, 10];
    $scope.doantiontomycharityhero = [{
        'id': 0,
        'label': '0'
      },
      {
        'id': 2,
        'label': '2'
      },
      {
        'id': 5,
        'label': '5'
      },
      {
        'id': 10,
        'label': '10'
      },
    ];
    if (localStorage.mch_mob_data) {
      $rootScope.user_id = JSON.parse(localStorage.mch_mob_data).id;
      $rootScope.image = $scope.imagePath + JSON.parse(localStorage.mch_mob_data).image;
      $rootScope.user_name = JSON.parse(localStorage.mch_mob_data).name;
    }

    $scope.gotoProfile = function () {
      $state.go('app.hero-profile', {
        'id': JSON.parse(localStorage.mch_mob_data).id
      });
    }

    $scope.showPopup = function (title, message, txt_btn_cancel, txt_btn_submit, redirect_url) {
      let url = redirect_url;
      // Custom popup
      var myPopup = $ionicPopup.show({
        template: '',
        title: title,
        subTitle: message,
        scope: $scope,

        buttons: [{
          text: `<b>${txt_btn_cancel}</b>`,
          type: 'button-stable',
          onTap: function (e) {}
        }, {
          text: `<b>${txt_btn_submit}</b>`,
          type: 'button-positive',
          onTap: function (e) {
            if (url)
              $state.go(url, {
                redirect: $state.current.name,
                redirectid: $state.params.id
              });
          }
        }]
      });

    };
    $ionicModal.fromTemplateUrl('templates/notification_modal.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.notificationModal = modal;
      $scope.statusNotification = function (status, data) {
        let obj = {};
        var index = $scope.notifications.indexOf($scope.notifications.filter(function (i) {
          return i.id == data.id
        })[0]);
        $scope.notifications[index].status = 1;

        obj.notification_id = data.id;
        obj.id = data.data.id;
        obj.table = data.data.table;
        if (status == 'approve') {
          obj.status = 'approve';
        } else {
          obj.false = 'reject';
        }

        $scope.showLoader();
        APIService.updateNotification(obj).then(function (response) {
            $scope.myOrganization = response.data;
            $scope.hideLoader();
          },
          function (error) {
            ionicToast.show(error.data.message, 'middle', false, 1000);
            $scope.hideLoader();
          });
      };
    });

    $scope.timeAgo = function (data) {
      if (data.created_at) {
        // data.created_at

        data.time_ago = moment(data.updated_at, 'YYYYMMDD').fromNow();
      }
      return data;
    }

    function getNotification() {
      $scope.showLoader();
      APIService.getNotification().then(function (response) {
          $scope.notifications = response.data;
          $scope.hideLoader();
        },
        function (error) {
          $scope.hideLoader();
        });
    };
    $rootScope.NOTIFICATIONMODAL = function () {
      $scope.notificationModal.show();
      getNotification();
    };
    $scope.notificationHide = function () {
      $scope.notificationModal.hide();
    };
    $scope.showLoader = function () {
      $ionicLoading.show({
        template: 'Loading...',
      }).then(function () {});
    };
    $scope.hideLoader = function () {
      $ionicLoading.hide().then(function () {});
    };
    $scope.gotoStateGlobal = function (state, _id) {
      $state.go(state, {
        id: _id
      });
    };

    $scope.toastShortCenter = function (content) {
      if (ionic.Platform.platform() == 'ios' || ionic.Platform.platform() == 'android') {
        alert(content);
        ionicToast.show(content, 'middle', false, 1000);
        // $cordovaToast.showShortCenter(content).then(function (success) {
        //   // success
        //   console.log('Success');
        // }, function (error) {
        //   // error
        //   console.log('error');
        // });
      } else {
        ionicToast.show(content, 'middle', false, 1000);
      }
    };
    $scope.toastLongCenter = function (content) {
      if (ionic.Platform.platform() == 'ios' || ionic.Platform.platform() == 'android') {
        ionicToast.show(content, 'middle', false, 2000);
        // $cordovaToast.showLongCenter(content).then(function (success) {
        //   // success
        // }, function (error) {
        //   // error
        // });
      } else {
        ionicToast.show(content, 'middle', false, 2000);
      }

    };
    $scope.toastShortTop = function (content) {
      if (ionic.Platform.platform() == 'ios' || ionic.Platform.platform() == 'android') {
        ionicToast.show(content, 'top', true, 1000);
        // $cordovaToast.showShortTop(content).then(function (success) {
        //   // success
        // }, function (error) {
        //   // error
        // });
      } else {
        ionicToast.show(content, 'top', true, 1000);
      }
    };
    $scope.toastLongBottom = function (content) {
      if (ionic.Platform.platform() == 'ios' || ionic.Platform.platform() == 'android') {
        ionicToast.show(content, false, 2000);
        // $cordovaToast.showLongBottom(content).then(function (success) {
        //   // success
        // }, function (error) {
        //   // error
        // });
      } else {
        ionicToast.show(content, false, 2000);
      }

    };
    $scope.toastLongTop = function (content) {
      if (ionic.Platform.platform() == 'ios' || ionic.Platform.platform() == 'android') {
        ionicToast.show(content, 'top', true, 2000);
        // $cordovaToast.showLongTop(content).then(function (success) {
        //   // success
        // }, function (error) {
        //   // error
        // });
      } else {
        ionicToast.show(content, 'top', true, 2000);
      }
    };

    $scope.toastShortBottom = function (content) {
      if (ionic.Platform.platform() == 'ios' || ionic.Platform.platform() == 'android') {
        ionicToast.show(content, 'bottom', false, 1000);
        // $cordovaToast.showShortBottom(content).then(function (success) {
        //   // success
        // }, function (error) {
        //   // error
        // });
      } else {
        ionicToast.show(content, 'bottom', false, 1000);
      }
    };
  
    $scope.toastShortBottomLong = function (content) {
      if (ionic.Platform.platform() == 'ios' || ionic.Platform.platform() == 'android') {
        ionicToast.show(content, 'bottom', true, 1000);
        // $cordovaToast.showShortBottom(content).then(function (success) {
        //   // success
        // }, function (error) {
        //   // error
        // });
      } else {
        ionicToast.show(content, 'bottom', true, 1000);
      }
    };
  

    $scope.amountConversionTok = function (data) {
      if (data.funds_raised) {
        data.convert_funds_raised = data.funds_raised > 999 ? (data.funds_raised / 1000) + 'K' : data.funds_raised;
      }
      if (data.funds_target) {
        data.convert_funds_target = data.funds_target > 999 ? (data.funds_target / 1000) + 'K' : data.funds_target;
      }
      return data;
    }

    $scope.dateFormatMddYYYYFilter = function (date) {
      
      if (date)
        return moment(date).format("MMM DD,YYYY");
    };
    $scope.timeFormatHHMMFilter = function (date) {
      let time= null;
      
      if (date && moment(date).format('HH : mm') != '00 : 00') {
        time= ': '+ moment(date).format('HH : mm');
      }
      return time;
    };
    
    $scope.TypeEnum = {
      "own": "own",
      "suggested": "suggested",
      "past": "past",
      "supported": "supported",
      "heroes": "heroes",
      "celebrities": "celebrities",
    }

    $scope.getMapIcon = function (mapIcon) {
      switch (mapIcon) {
        case 'hero':
          return './img/ic_pin_blue.png';
          break;
        case 'orginization':
          return './img/ic_pin_yurple.png';
          break;
        case 'project':
          return './img/ic_pin_green.png';
          break;
        case 'challenge':
          return './img/ic_pin_pink.png';
          break;
      }
    };
    $scope.logout = function () {
      window.localStorage.setItem('mch_mob_data', '');
      $rootScope.role = 'guest';
      $state.go('app.discover');
      // call main emit function
      // $scope.$emit('eventEmitedName');
      $state.reload();
    };
    if (window.localStorage.mch_mob_data) {
      if (JSON.parse(window.localStorage.mch_mob_data).role === 'user') {
        $rootScope.role = 'user';
      } else {
        $rootScope.role = 'guest';

      }
    }
    $scope.gotoMapsearch = function (param) {
      $state.go('app.discover', {
        search: param
      });
    };
  })

  .controller('LoginCtrl', function ($scope, $rootScope, $state, $ionicSideMenuDelegate, APIService, $ionicLoading, IMAGE_PATH, ionicToast) {
    $scope.imagePath = IMAGE_PATH;
    $scope.login = {
      email_phone: '',
      password: '',
    };
    $scope.toastShortCenter = function (content) {
      if (ionic.Platform.platform() == 'ios' || ionic.Platform.platform() == 'android') {
        ionicToast.show(content, 'middle', false, 1000);
       
      } else {
        ionicToast.show(content, 'middle', false, 1000);
      }
    };
    $scope.showLoader = function () {
      $ionicLoading.show({
        template: 'Loading...',
      }).then(function () {
        console.log("The loading indicator is now displayed");
      });
    };
    $scope.hideLoader = function () {
      $ionicLoading.hide().then(function () {
        console.log("The loading indicator is now hidden");
      });
    };

    $scope.gotoOrg = function () {
      $state.go('app.organization');
    };

    $scope.gotoDiscover = function () {
      $state.go('app.discover');
    };
    $scope.submit = function () {
      $scope.showLoader();
      let obj = {};
      obj.email = $scope.login.email_phone;
      obj.password = $scope.login.password;
      APIService.login(obj).then(function (response) {
          window.localStorage.setItem('mch_mob_data', JSON.stringify(response.data));
          $rootScope.role = JSON.parse(window.localStorage.mch_mob_data).role;

          $rootScope.user_id = JSON.parse(localStorage.mch_mob_data).id;
          $rootScope.image = $scope.imagePath + JSON.parse(localStorage.mch_mob_data).image;
          $rootScope.user_name = JSON.parse(localStorage.mch_mob_data).name;
          $scope.hideLoader();
          $scope.gotoDiscover();
          // $state.go('app.discover',{reload: true, inherit: false});
        },
        function (error) {
          $scope.toastShortCenter(error.data.message);
          $scope.hideLoader();
        });
    };

  })
  .controller('SignUpCtrl', function ($scope, $rootScope, $stateParams, $state, $ionicLoading, APIService, IMAGE_PATH, ionicToast) {
    $scope.imagePath = IMAGE_PATH;
    $scope.showLoader = function () {
      $ionicLoading.show({
        template: 'Loading...',
      }).then(function () {
        console.log("The loading indicator is now displayed");
      });
    };
    $scope.hideLoader = function () {
      $ionicLoading.hide().then(function () {
        console.log("The loading indicator is now hidden");
      });
    };
    $scope.toastShortCenter = function (content) {
      if (ionic.Platform.platform() == 'ios' || ionic.Platform.platform() == 'android') {
        ionicToast.show(content, 'middle', false, 1000);
       
      } else {
        ionicToast.show(content, 'middle', false, 1000);
      }
    };

    function createGuestuser() {
      $scope.showLoader();
      APIService.createGuest().then(function (response) {

          window.localStorage.setItem('mch_mob_data', JSON.stringify(response.data));
          $rootScope.role = JSON.parse(window.localStorage.mch_mob_data).role;

          $rootScope.user_id = JSON.parse(localStorage.mch_mob_data).id;
          $rootScope.image = $scope.imagePath + JSON.parse(localStorage.mch_mob_data).image;
          $rootScope.user_name = JSON.parse(localStorage.mch_mob_data).name;

          $scope.hideLoader();
        },
        function (error) {
          $scope.hideLoader();
          $scope.toastShortCenter(error.data.message);
        });
    }

    if (!window.localStorage.mch_mob_data) {
      createGuestuser();
    }

    $scope.signup = {
      fullname: '',
      email: '',
      password: '',
    };
    $scope.gotoSignin = function () {
      $state.go('login');
    };
    $scope.gotoDiscover = function () {
      $state.go('app.discover');
    };
    $scope.submit = function () {
      $scope.showLoader();
      let obj = {};
      obj.name = $scope.signup.fullname;
      obj.email = $scope.signup.email;
      obj.password = $scope.signup.password;
      APIService.register(obj).then(function (response) {
          window.localStorage.setItem('mch_mob_data', JSON.stringify(response.data));
          $rootScope.user_id = JSON.parse(localStorage.mch_mob_data).id;
          $rootScope.role = JSON.parse(window.localStorage.mch_mob_data).role;
          $rootScope.image = $scope.imagePath + JSON.parse(localStorage.mch_mob_data).image;
          $rootScope.user_name = JSON.parse(localStorage.mch_mob_data).name;

          $scope.hideLoader();
          $scope.gotoDiscover();
        },
        function (error) {
          $scope.toastShortCenter(error.data.message);
          $scope.hideLoader();
        });
    };
  })
  .controller('ForgotCtrl', function ($scope, $stateParams, $ionicViewService, $ionicLoading, APIService, ionicToast, $timeout, $state) {
    $scope.toastShortCenter = function (content) {
      if (ionic.Platform.platform() == 'ios' || ionic.Platform.platform() == 'android') {
        alert(content);
        ionicToast.show(content, 'middle', false, 1000);
        // $cordovaToast.showShortCenter(content).then(function (success) {
        //   // success
        //   console.log('Success');
        // }, function (error) {
        //   // error
        //   console.log('error');
        // });
      } else {
        ionicToast.show(content, 'middle', false, 1000);
      }
    };
    $scope.showLoader = function () {
      $ionicLoading.show({
        template: 'Loading...',
      }).then(function () {
        console.log("The loading indicator is now displayed");
      });
    };
    $scope.hideLoader = function () {
      $ionicLoading.hide().then(function () {
        console.log("The loading indicator is now hidden");
      });
    };
    $scope.gotoSignin = function () {
      $state.go('login');
    };

    function defaultPopModal() {
      $scope.forgot = {
        email_phone: '',
      };
    };
    defaultPopModal();

    $scope.goBack = function (params) {
      $ionicViewService.getBackView().go();
    };
    $scope.submit = function () {
      $scope.showLoader();
      let obj = {};
      obj.email = $scope.forgot.email_phone;

      APIService.forgotPass(obj).then(function (response) {
          $scope.toastShortCenter(response.data.message);
          // $scope.toastShortCenter('Record saved successfully');
          $timeout(function () {
            defaultPopModal();
          }, 1000);
          $scope.hideLoader();
        },
        function (error) {
          $scope.toastShortCenter(error.data.message);
          $scope.hideLoader();
          defaultPopModal();
        });
    };
  })
  .controller('OrganizationCtrl', function ($scope, $stateParams, $state, $ionicNavBarDelegate, $ionicPopup, $ionicModal, $cordovaDatePicker, ionicDatePicker, BASE_URL, Upload, IMAGE_PATH, APIService, $timeout) {
    $scope.imagePath = IMAGE_PATH;

    $scope.gotoOrg = function () {
      $state.go('app.organization');
    };
    $scope.gotoProject = function () {
      $state.go('app.project');
    };
    $scope.showGuestPopup = function () {
      $ionicPopup.show({
        // templateUrl: 'templates/guestuser.html',
        // template: '<i ng-click="closeConfirm();" class="icon ion-close-circled popclose"></i>',
        title: 'To create you have to login or register',
        subTitle: 'Please register or login',
        scope: $scope,
        buttons: [{
            // text: '<b>Login</b>',
            type: 'icon ion-close-circled popclose',
            onTap: function (e) {
              //  e.preventDefault();
              // this.close();
              return 'close';
            }
          },
          {
            text: '<b>Login</b>',
            type: 'button-positive',
            onTap: function (e) {

              return 'login';
            }
          },
          {
            text: '<b>Register</b>',
            type: 'button-positive',
            onTap: function (e) {

              return 'register';
            }
          },
        ]
      }).then(function (res) {

        if (res == 'login') {
          $state.go('login');
        } else if (res == 'register') {
          $state.go('signup');
        } else {
          return false;
        }
      }, function (err) {
        console.log('Err:', err);
      }, function (msg) {
        console.log('message:', msg);
      });
      // $scope.closeConfirm = function () {
      //   confirmVal.close();
      // };
    };

    $scope.gotoCreate = function () {
      if (JSON.parse(localStorage.mch_mob_data).role === 'user') {
        $state.go('app.organzationcreate');
      } else {
        $scope.showGuestPopup();
        // $scope.toastShortCenter('Must have login first');
      }
    };

    $ionicModal.fromTemplateUrl('templates/create.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modal = modal;

      function defaultPopModal() {
        $scope.create = {
          img_path: './img/arrow-up.svg',
          govtRegNumb: '',
          orgName: '',
          orgDesc: '',
          orgAddress: '',
          postcode: '',
          city: '',
          contact: '',
          email: '',
          foundon: null,
          image: '',
          loaderImg: '',
        };
      };
      defaultPopModal();
      $scope.log = '';
      $scope.upload = function (files, errFiles) {

        $scope.create.loaderImg = './img/image-uploader.svg';
        if (files && files.length) {
          for (var i = 0; i < files.length; i++) {
            var file = files[i];
            if (!file.$error) {
              let token = JSON.parse(window.localStorage.mch_mob_data).access_token;
              Upload.upload({
                url: BASE_URL + '/upload-image',
                data: {
                  file: file
                },
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Accept': 'application/json'
                },
              }).then(function (resp) {

                $scope.create.loaderImg = '';
                $scope.create.img_path = IMAGE_PATH + resp.data.filename;
                $scope.create.image = resp.data.filename;
              }, null, function (evt) {

              });
            }
          }
        }
      };
      $scope.submit = function () {
        $scope.showLoader();
        let obj = {};
        obj.name = $scope.create.orgName;
        obj.address = $scope.create.orgAddress;
        obj.email = $scope.create.email;
        obj.phone_number = $scope.create.contact;
        obj.gov_reg_no = $scope.create.govtRegNumb;
        obj.latitude = 51.11;
        obj.longitude = 11.232;
        obj.image = $scope.create.image;

        APIService.addOrg(obj).then(function (response) {
            $scope.toastShortCenter('Record saved successfully');
            $timeout(function () {
              defaultPopModal();
            }, 1000);
            $scope.hideLoader();
          },
          function (error_response) {

            $scope.toastShortCenter(error_response);
            $scope.hideLoader();
            defaultPopModal();
          });
      };

      $scope.openDatePicker = function () {
        var calanderObj = {
          callback: function (val) { //Mandatory
            $scope.create.foundon = moment(new Date(val)).format("MMM DD,YYYY");
            console.log('Return value from the datepicker popup is : ' + val, new Date(val));
          },
          disabledDates: [
            // new Date(2019, 2, 1),
          ],
          inputDate: $scope.create.foundon ? new Date($scope.create.foundon) : new Date(),
          // from: new Date(2012, 1, 1), //Optional
          // to: new Date(new Date().getFullYear(),1,1), //Optional
          // inputDate: new Date(),      //Optional
          // mondayFirst: true,          //Optional
          // disableWeekdays: [0],       //Optional
          closeOnSelect: true, //Optional
          // templateType: 'popup'       //Optional
          showTodayButton: false,
        };

        ionicDatePicker.openDatePicker(calanderObj);
      };
      // $scope.openDatePicker();
      $scope.closeModal = function () {
        defaultPopModal();
        modal.hide();
      };

    });

  })

  .controller('OrganizationCreateCtrl', function ($scope, $stateParams, $state, $ionicActionSheet, $ionicNavBarDelegate, $ionicModal, $cordovaDatePicker, ionicDatePicker, BASE_URL, Upload, IMAGE_PATH, APIService, $timeout, ATTACH_PATH) {
    $scope.imagePath = IMAGE_PATH;
    $scope.selectorhide = true;
    $scope.title = 'Create';
    $scope.btnText = 'Create Organization';

    $scope.parseMulti = function (items) {
      if (items) {
        return items.map(function (item) {
          return item.name;
        }).join(', ');
      }
    };

    $scope.goBack = function () {
      $state.go('app.organization');
    };
    $scope.disableTap = function () {
      var container = document.getElementsByClassName('pac-container');
      angular.element(container).attr('data-tap-disabled', 'true');
      var backdrop = document.getElementsByClassName('backdrop');
      angular.element(backdrop).attr('data-tap-disabled', 'true');
      angular.element(container).on("click", function () {
        document.getElementById('pac-input').blur();
      });
    };

    function defaultPopModal() {
      $scope.create = {
        img_path: './img/arrow-up.svg',
        govtRegNumb: '',
        orgName: '',
        orgDesc: '',
        orgAddress: '',
        postcode: '',
        city: '',
        contact: '',
        email: '',
        foundon: null,
        image: '',
        loaderImg: '',
        latitude: '',
        longitude: '',
        projects: '',
        challenges: '',
        heros: '',
        id: '',
        funds_target: null,
        currency: '',
        attachments: []
      };
    }

    $scope.projects = "";
    $scope.challenges = "";
    $scope.heros = "";
    $scope.currency = ["USD", "AED", "AFN*", "ALL", "AMD", "ANG", "AOA*", "ARS*", "AUD", "AWG", "AZN", "BAM", "BBD", "BDT", "BGN", "BIF", "BMD", "BND", "BOB*", "BRL*", "BSD", "BWP", "BZD", "CAD", "CDF", "CHF", "CLP*", "CNY", "COP*", "CRC*", "CVE*", "CZK*", "DJF*", "DKK", "DOP", "DZD", "EGP", "ETB", "EUR", "FJD", "FKP*", "GBP", "GEL", "GIP", "GMD", "GNF*", "GTQ*", "GYD", "HKD", "HNL*", "HRK", "HTG", "HUF*", "IDR", "ILS", "INR*", "ISK", "JMD", "JPY", "KES", "KGS", "KHR", "KMF", "KRW", "KYD", "KZT", "LAK*", "LBP", "LKR", "LRD", "LSL", "MAD", "MDL", "MGA", "MKD", "MMK", "MNT", "MOP", "MRO", "MUR*", "MVR", "MWK", "MXN", "MYR", "MZN", "NAD", "NGN", "NIO*", "NOK", "NPR", "NZD", "PAB*", "PEN*", "PGK", "PHP", "PKR", "PLN", "PYG*", "QAR", "RON", "RSD", "RUB", "RWF", "SAR", "SBD", "SCR", "SEK", "SGD", "SHP*", "SLL", "SOS", "SRD*", "STD", "SZL", "THB", "TJS", "TOP", "TRY", "TTD", "TWD", "TZS", "UAH", "UGX", "UYU*", "UZS", "VND", "VUV", "WST", "XAF", "XCD", "XOF*", "XPF*", "YER", "ZAR", "ZMW"];

    function getProjects() {
      $scope.showLoader();
      APIService.getProjects().then(function (response) {
          $scope.hideLoader();
          $scope.projects = response.data;
        },
        function (error) {
          ionicToast.show(error.data.message, 'middle', false, 1000);
          $scope.hideLoader();
        });
    }

    function getChallenges() {
      $scope.showLoader();
      APIService.getChallenges().then(function (response) {
          $scope.hideLoader();
          $scope.challenges = response.data;
        },
        function (error) {
          ionicToast.show(error.data.message, 'middle', false, 1000);
          $scope.hideLoader();
        });
    }

    function getHeros() {
      $scope.showLoader();
      APIService.getHeros().then(function (response) {
          $scope.hideLoader();
          $scope.heros = response.data;
        },
        function (error) {
          ionicToast.show(error.data.message, 'middle', false, 1000);
          $scope.hideLoader();
        });
    };

    getProjects();
    getHeros();
    getChallenges();

    defaultPopModal();
    if ($state.current.name === 'app.organzationcedit') {
      $scope.showLoader();
      APIService.getProfile($stateParams.id).then(function (response) {
          $scope.hideLoader();

          $scope.selectorhide = false;
          $scope.title = 'Update';
          $scope.btnText = 'Update Organization';
          console.log(response.data);

          $scope.create = {
            img_path: response.data.image ? IMAGE_PATH + response.data.image : './img/arrow-up.svg',
            govtRegNumb: response.data.gov_reg_no,
            orgName: response.data.name,
            orgDesc: response.data.description,
            orgAddress: response.data.address,
            contact: response.data.phone_number,
            email: response.data.email,
            foundon: response.data.found_on ? moment(new Date(response.data.found_on)).format("MMM DD,YYYY") : null,
            image: response.data.image,
            latitude: response.data.latitude,
            longitude: response.data.longitude,
            funds_target: parseInt(response.data.funds_target),
            id: $stateParams.id,
            currency: response.data.currency,
            attachments: []
          };

          response.data.attachments.forEach(el => {
            $scope.create.attachments.push([ATTACH_PATH + el.name, el.type]);
          });

          // $scope.$broadcast('updateAttachmentDirective');
        },
        function (error) {
          ionicToast.show(error.data.message, 'middle', false, 1000);
          $scope.hideLoader();
        });
    }
    $scope.log = '';
    $scope.upload = function (files, errFiles) {
      $scope.create.loaderImg = './img/image-uploader.svg';
      if (files && files.length) {
        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          if (!file.$error) {
            let token = JSON.parse(window.localStorage.mch_mob_data).access_token;
            Upload.upload({
              url: BASE_URL + '/upload-image',
              data: {
                file: file
              },
              headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
              },
            }).then(function (resp) {
              $scope.create.loaderImg = '';
              $scope.create.img_path = IMAGE_PATH + resp.data.filename;
              $scope.create.image = resp.data.filename;
            }, null, function (evt) {

            });
          }
        }
      }
    };
    $scope.submit = function (form) {

      if (form.$valid) {
        $scope.showLoader();
        let obj = {};
        obj.id = $scope.create.id ? $scope.create.id : '';
        obj.name = $scope.create.orgName;
        obj.address = $scope.create.orgAddress;
        obj.email = $scope.create.email;
        obj.phone_number = $scope.create.contact;
        obj.gov_reg_no = $scope.create.govtRegNumb;
        obj.latitude = $scope.create.latitude;
        obj.longitude = $scope.create.longitude;
        obj.projects = $scope.create.projects ? $scope.create.projects : '';
        obj.challenges = $scope.create.challenges ? $scope.create.challenges : '';
        obj.heroes = $scope.create.heros ? $scope.create.heros : '';
        obj.image = $scope.create.image;
        obj.description = $scope.create.orgDesc;
        obj.found_on = $scope.create.foundon != null ? moment(new Date($scope.create.foundon)).format("YYYY-MM-DD") : null;
        obj.funds_target = $scope.create.funds_target ? $scope.create.funds_target : 10000;
        obj.currency = $scope.create.currency;
        obj.ufiles = [];

        $scope.create.attachments.forEach(function (element) {
          let objAttach = {};
          objAttach.name = element[0].replace(ATTACH_PATH, '');
          objAttach.file_type = element[1];
          obj.ufiles.push(objAttach);
        });
        if (obj.id) {
          APIService.updateOrg(obj).then(function (response) {
              $scope.toastShortCenter('Record Update successfully');
              $scope.hideLoader();
              $scope.goBack();
            },
            function (error_response) {
              $scope.toastShortCenter(error_response);
              $scope.hideLoader();
            });
        } else {
          APIService.addOrg(obj).then(function (response) {
              $scope.toastShortCenter('Record saved successfully');
              $timeout(function () {
                defaultPopModal();

                let pac_input = document.getElementById('pac-input');
                if (pac_input) {
                  pac_input.value = '';
                }
                $scope.hideLoader();
                $scope.goBack();
                //new end
              }, 1000);
            },
            function (error_response) {
              $scope.toastShortCenter(error_response);
              $scope.hideLoader();
              defaultPopModal();
            });
        }
      }
    };

    $scope.openDatePicker = function () {
      var calanderObj = {
        callback: function (val) { //Mandatory
          $scope.create.foundon = moment(new Date(val)).format("MMM DD,YYYY");
          console.log('Return value from the datepicker popup is : ' + val, new Date(val));
        },
        disabledDates: [
          // new Date(2019, 2, 1),
        ],
        inputDate: $scope.create.foundon ? new Date($scope.create.foundon) : new Date(),
        closeOnSelect: true, //Optional
        showTodayButton: false,
      };
      ionicDatePicker.openDatePicker(calanderObj);
    };
    // popup start
    $scope.$on('$destroy', function () {
      $scope.modal.remove();
    });
    $ionicModal.fromTemplateUrl('templates/googlemap.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modal = modal;
      $scope.map = "";
      $scope.marker = "";

      var marker = "";
      var map = "";
      var infoWindow = "";

      var location = {
        lat: 51.509865,
        lng: -0.118092
      };
      $scope.geoCoderReverse = function (latlng) {
        $scope.create.latitude = latlng.lat();
        $scope.create.longitude = latlng.lng();

        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({
          location: latlng
        }, (results, status) => {
          if (status === 'OK') {
            $scope.create.orgAddress = results[0].formatted_address;
            document.getElementById('pac-input').value = results[0].formatted_address
            console.log(results[0].formatted_address);
          }
        });
      };
      $scope.initMap = function () {

        location = {
          lat: $scope.create.latitude ? $scope.create.latitude : 51.509865,
          lng: $scope.create.longitude ? $scope.create.longitude : -0.118092
        };
        map = new google.maps.Map(document.getElementById('organization-map'), {
          center: location,
          zoom: 13,
          fullscreenControl: false,
          zoomControl: false,
          // mapTypeId: 'satellite'
          mapTypeControlOptions: {
            mapTypeIds: []
          },
        });
        var input = document.getElementById('pac-input');
        input.value = $scope.create.orgAddress;
        var autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.bindTo('bounds', map);
        autocomplete.setFields(
          ['address_components', 'geometry', 'icon', 'name']);
        marker = new google.maps.Marker({
          map: map,
          draggable: true,
          anchorPoint: new google.maps.Point(0, -29),
          position: location,
        });

        //new start
        const objlatlng = new window.google.maps.LatLng(
          location.lat,
          location.lng
        );
        $scope.geoCoderReverse(objlatlng);
        //new end
        // google.maps.event.addListener(map, 'click', (evt) => {
        //   marker.setVisible(false);
        //   marker.setPosition(evt.latLng);
        //   $scope.geoCoderReverse(evt.latLng);
        //   marker.setVisible(true);

        // });
        google.maps.event.addListener(marker, 'dragend', (evt) => {

          marker.setVisible(false);
          marker.setPosition(evt.latLng);
          // const latlng = {
          //   lat: evt.latLng.lat(),
          //   lng: evt.latLng.lng()
          // }
          $scope.geoCoderReverse(evt.latLng);
          marker.setVisible(true);

        });
        autocomplete.addListener('place_changed', function () {
          marker.setVisible(false);

          var place = autocomplete.getPlace();
          if (!place.geometry) {
            window.alert("No details available for input: '" + place.name + "'");
            return;
          }
          if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
          } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);
          }
          marker.setPosition(place.geometry.location);
          marker.setVisible(true);
          // const latlng = {
          //   lat: place.geometry.location.lat(),
          //   lng: place.geometry.location.lng()
          // }
          $scope.geoCoderReverse(place.geometry.location);
          // $scope.geoCoderReverse(place.geometry.location);
        });
      };
      $scope.currentLocation = function () {

        if (navigator.geolocation) {
          const geocoder = new google.maps.Geocoder();
          navigator.geolocation.getCurrentPosition((position) => {
            // location = {
            //   lat: position.coords.latitude,
            //   lng: position.coords.longitude,
            // };

            const objlatlng = new window.google.maps.LatLng(
              position.coords.latitude,
              position.coords.longitude);
            marker.setVisible(false);
            marker.setPosition(objlatlng);
            marker.setVisible(true);
            map.setCenter(objlatlng);
            $scope.geoCoderReverse(objlatlng);
          });
        }
      };

      $scope.modalOpen = function () {
        modal.show();
        $scope.initMap();
      };

      $scope.closeModal = function () {
        modal.hide();
      };
    });
    // popup end
  })
  .controller('OrganizationCurrentCtrl', function ($scope, $rootScope, $stateParams, $state, APIService, IMAGE_PATH, $ionicHistory, $ionicModal, $timeout) {
    $scope.issupported = true;
    $scope.supported = [];
    $scope.myOrganization = [];
    $scope.count_supported = 0;
    $scope.count_myproject = 0;
    $scope.dataAvailable_supported = true;
    $scope.dataAvailable_myproject = true;
    $scope.imagePath = IMAGE_PATH;

    //first start
    let obj_pro = {
      page: 0
    };
   
    $scope.getOrganizationByOrg = function () {
      $scope.dataAvailable_myproject = false;
      $scope.showLoader();
      obj_pro.page++; //page state
      obj_pro.limit = 10; //record limit
      obj_pro.type = $scope.TypeEnum.own; //list type

      APIService.getOrganizationByType(obj_pro).then(function (response) {
          // $scope.myOrganization = response.data;
          // $scope.hideLoader();
          response.data.forEach(element => {
            $scope.myOrganization.push(element);
          });
          $scope.count_myproject = response.data.length ? response.data[0].count : 0;
          $scope.hideLoader();

          $scope.$broadcast('scroll.infiniteScrollComplete');
        },
        function (error) {
          ionicToast.show(error.data.message, 'middle', false, 1000);
          $scope.hideLoader();
        });
    };

    //second start
    let obj_sup = {
      page: 0
    };
   
    $scope.getOrganizationBySupported = function () {
      if (!window.localStorage.mch_mob_data) {
        createGuestuser();
      } else {
        if ($scope.dataAvailable_supported) {
          $scope.getOrganizationByOrg(); //first time call 
        }
        $scope.dataAvailable_supported = false;
        $scope.showLoader();
        obj_sup.page++; //page state
        obj_sup.limit = 10; //record limit
        obj_sup.type = $scope.TypeEnum.supported; //list type
        APIService.getOrganizationByType(obj_sup).then(function (response) {

            response.data.forEach(element => {
              $scope.supported.push(element);
            });
            $scope.count_supported = response.data.length ? response.data[0].count : 0;
            $scope.hideLoader();
            $scope.$broadcast('scroll.infiniteScrollComplete');
          },
          function (error) {
            ionicToast.show(error.data.message, 'middle', false, 1000);
            $scope.hideLoader();
          });
      }
    };

    $scope.getOrganizationBySupported(); //first time call 

    function createGuestuser() {
      $scope.showLoader();
      APIService.createGuest().then(function (response) {

          window.localStorage.setItem('mch_mob_data', JSON.stringify(response.data));
          $rootScope.role = JSON.parse(window.localStorage.mch_mob_data).role;
          $rootScope.user_id = JSON.parse(localStorage.mch_mob_data).id;
          $rootScope.image = $scope.imagePath + JSON.parse(localStorage.mch_mob_data).image;
          $rootScope.user_name = JSON.parse(localStorage.mch_mob_data).name;

          getOrganizationBySupported($scope.TypeEnum.supported);
          $scope.hideLoader();
        },
        function (error_response) {
          $scope.toastShortCenter(error_response.message);
          $scope.hideLoader();
        });
    }


    $scope.gotoProfile = function (id) {
      $state.go('app.profile', {
        'id': id,
        'redirect': 'app.organization.current'
      });
    };


    $scope.supportedType = function (data, objname) {

      if (objname == 'myOrganization') {
        let index = $scope.myOrganization.indexOf($scope.myOrganization.filter(function (i) {
          return i.id == data.id;
        })[0]);
        $scope.myOrganization[index].supported = true;
      } else if (objname == 'supported') {
        let index = $scope.supported.indexOf($scope.supported.filter(function (i) {
          return i.id == data.id;
        })[0]);
        $scope.supported[index].supported = true;
      }
      $scope.showLoader();
      let obj = {};
      obj.id = data.id;
      obj.type = "organization";
      APIService.supperted(obj).then(function (response) {
          $scope.hideLoader();
        },
        function (error) {
          ionicToast.show(error.data.message, 'middle', false, 1000);
          $scope.hideLoader();
        });
    };
    $scope.usSupportedType = function (data, objname) {

      if (objname == 'myOrganization') {
        let index = $scope.myOrganization.indexOf($scope.myOrganization.filter(function (i) {
          return i.id == data.id;
        })[0]);
        $scope.myOrganization.splice(index, 1);
      } else if (objname == 'supported') {
        let index = $scope.supported.indexOf($scope.supported.filter(function (i) {
          return i.id == data.id;
        })[0]);
        $scope.supported.splice(index, 1);
      }
      $scope.showLoader();
      let obj = {};
      obj.id = data.id;
      obj.type = "organization";
      APIService.usSupperted(obj).then(function (response) {
          $scope.hideLoader();
        },
        function (error) {
          ionicToast.show(error.data.message, 'middle', false, 1000);
          $scope.hideLoader();
        });
    };

  })

  .controller('OrganizationSuggestedCtrl', function ($scope, $rootScope, $stateParams, $state, APIService, IMAGE_PATH, $ionicModal, $timeout,ionicToast) {
    $scope.issupported = true;
    $scope.suggested = [];
    $scope.count = 0; //default count is 0 for number assign
    $scope.dataAvailable = true; //default infinite scroll is true
    $scope.imagePath = IMAGE_PATH;


    let obj = {
      page: 0
    };
    $scope.getOrganizationBySuggested = function () {
      if (!window.localStorage.mch_mob_data) {
        createGuestuser();
      } else {
        $scope.dataAvailable = false;
        $scope.showLoader();
        obj.page++; //page state
        obj.limit = 10; //record limit
        obj.type = $scope.TypeEnum.suggested; //list type
        APIService.getOrganizationByType(obj).then(function (response) {
            response.data.forEach(element => {
              $scope.suggested.push(element);
            });
            $scope.count = response.data.length ? response.data[0].count : 0;
            $scope.hideLoader();
            $scope.$broadcast('scroll.infiniteScrollComplete');
          },
          function (error) {
            ionicToast.show(error.data.message, 'middle', false, 1000);
            $scope.hideLoader();
          });
      }

    };
    $scope.getOrganizationBySuggested();

    function createGuestuser() {
      $scope.showLoader();
      APIService.createGuest().then(function (response) {

          window.localStorage.setItem('mch_mob_data', JSON.stringify(response.data));
          $rootScope.role = JSON.parse(window.localStorage.mch_mob_data).role;
          $rootScope.user_id = JSON.parse(localStorage.mch_mob_data).id;
          $rootScope.image = $scope.imagePath + JSON.parse(localStorage.mch_mob_data).image;
          $rootScope.user_name = JSON.parse(localStorage.mch_mob_data).name;

          $scope.getOrganizationBySuggested();
          $scope.hideLoader();
        },
        function (error_response) {
          // $scope.toastShortCenter(error_response);
          $scope.hideLoader();
        });
    }

    $scope.supportedType = function (data, objname) {
      if (objname == 'suggested') {
        let index = $scope.suggested.indexOf($scope.suggested.filter(function (i) {
          return i.id == data.id;
        })[0]);
        $scope.suggested[index].supported = true;
      }

      $scope.showLoader();
      let obj = {};
      obj.id = data.id;
      obj.type = "organization";
      APIService.supperted(obj).then(function (response) {
          $scope.hideLoader();
        },
        function (error) {
          ionicToast.show(error.data.message, 'middle', false, 1000);
          $scope.hideLoader();
        });
    };
    $scope.usSupportedType = function (data, objname) {

      if (objname == 'suggested') {
        let index = $scope.suggested.indexOf($scope.suggested.filter(function (i) {
          return i.id == data.id;
        })[0]);
        $scope.suggested[index].supported = false;
        // $scope.suggested.splice(index, 1);
      }
      $scope.showLoader();
      let obj = {};
      obj.id = data.id;
      obj.type = "organization";
      APIService.usSupperted(obj).then(function (response) {
          $scope.hideLoader();
        },
        function (error) {
          ionicToast.show(error.data.message, 'middle', false, 1000);
          $scope.hideLoader();
        });
    };

  })

  .controller('OrganizationPastCtrl', function ($scope, $rootScope, $stateParams, $state, APIService, IMAGE_PATH, $ionicModal, $timeout) {
    $scope.issupported = true;
    $scope.past = [];
    $scope.count = 0; //default count is 0 for number assign
    $scope.dataAvailable = true; //default infinite scroll is true
    $scope.imagePath = IMAGE_PATH;


    let obj = {
      page: 0
    };
    $scope.getOrganizationByPast = function () {
      if (!window.localStorage.mch_mob_data) {
        createGuestuser();
      } else {
        $scope.dataAvailable = false;
        $scope.showLoader();
        obj.page++; //page state
        obj.limit = 10; //record limit
        obj.type = $scope.TypeEnum.past; //list type
        APIService.getOrganizationByType(obj).then(function (response) {
            response.data.forEach(element => {
              $scope.past.push(element);
            });
            $scope.count = response.data.length ? response.data[0].count : 0;
            $scope.hideLoader();
            $scope.$broadcast('scroll.infiniteScrollComplete');
          },
          function (error) {
            ionicToast.show(error.data.message, 'middle', false, 1000);
            $scope.hideLoader();
          });
      }

    };
    $scope.getOrganizationByPast();

    function createGuestuser() {
      $scope.showLoader();
      APIService.createGuest().then(function (response) {

          window.localStorage.setItem('mch_mob_data', JSON.stringify(response.data));
          $rootScope.role = JSON.parse(window.localStorage.mch_mob_data).role;
          $rootScope.user_id = JSON.parse(localStorage.mch_mob_data).id;
          $rootScope.image = $scope.imagePath + JSON.parse(localStorage.mch_mob_data).image;
          $rootScope.user_name = JSON.parse(localStorage.mch_mob_data).name;

          $scope.getOrganizationByPast();
          $scope.hideLoader();
        },
        function (error_response) {
          // $scope.toastShortCenter(error_response);
          $scope.hideLoader();
        });
    }


    $scope.supportedType = function (data, objname) {
      if (objname == 'past') {
        let index = $scope.past.indexOf($scope.past.filter(function (i) {
          return i.id == data.id;
        })[0]);
        $scope.past[index].supported = true;
      }

      $scope.showLoader();
      let obj = {};
      obj.id = data.id;
      obj.type = "organization";
      APIService.supperted(obj).then(function (response) {
          $scope.hideLoader();
        },
        function (error) {
          ionicToast.show(error.data.message, 'middle', false, 1000);
          $scope.hideLoader();
        });
    };
    $scope.usSupportedType = function (data, objname) {

      if (objname == 'past') {
        let index = $scope.past.indexOf($scope.past.filter(function (i) {
          return i.id == data.id;
        })[0]);
        $scope.suggested[index].supported = false;
        // $scope.past.splice(index, 1);
      }
      $scope.showLoader();
      let obj = {};
      obj.id = data.id;
      obj.type = "organization";
      APIService.usSupperted(obj).then(function (response) {
          $scope.hideLoader();
        },
        function (error) {
          ionicToast.show(error.data.message, 'middle', false, 1000);
          $scope.hideLoader();
        });
    };

  })
  .controller('ProjectCtrl', function ($scope, $stateParams, $ionicPopup, $state, $ionicNavBarDelegate, $ionicModal, $cordovaDatePicker) {
    $scope.gotoOrg = function () {
      $state.go('app.organization');
    };
    $scope.gotoProject = function () {
      $state.go('app.project');
    };
    var options = {
      // date: new Date(),
      mode: 'date', // or 'time'
      // minDate: new Date() - 10000,
      // allowOldDates: true,
      // allowFutureDates: false,
      doneButtonLabel: 'DONE',
      doneButtonColor: '#F2F3F4',
      cancelButtonLabel: 'CANCEL',
      cancelButtonColor: '#000000'
    };

    $scope.showGuestPopup = function () {
      $ionicPopup.show({
        templateUrl: 'templates/guestuser.html',
        title: 'To create you have to login or register',
        subTitle: 'Please register or login',
        scope: $scope,
        buttons: [{
            text: '<b>Login</b>',
            type: 'button-positive',
            onTap: function (e) {
              return 'login';
            }
          },
          {
            text: '<b>Register</b>',
            type: 'button-positive',
            onTap: function (e) {
              return 'register';
            }
          },
        ]
      }).then(function (res) {
        if (res == 'login') {
          $state.go('login');
        } else {
          $state.go('signup');
        }
      }, function (err) {
        // console.log('Err:', err);
      }, function (msg) {
        // console.log('message:', msg);
      });
    };
    $scope.gotoCreate = function () {
      if (JSON.parse(localStorage.mch_mob_data).role === 'user') {
        $state.go('app.projectcreate');
      } else {
        $scope.showGuestPopup();
        // $scope.toastShortCenter('Must have login first');
      }
    };
    $scope.showDate = function () {
      $cordovaDatePicker.show(options).then(function (date) {
        alert(date);
      });
    };

    $ionicModal.fromTemplateUrl('templates/create.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modal = modal;
    });

  })

  .controller('ProjectCreateCtrl', function ($scope, $stateParams, $state, $ionicNavBarDelegate, $ionicModal, $cordovaDatePicker, ionicDatePicker, BASE_URL, Upload, IMAGE_PATH, APIService, $timeout, ATTACH_PATH) {
    $scope.imagePath = IMAGE_PATH;
    $scope.selectorhide = true;
    $scope.title = 'Create';
    $scope.btnText = 'Create Project';


    $scope.parseMulti = function (items) {
      if (items) {
        return items.map(function (item) {
          return item.name;
        }).join(', ');
      }
    };
    $scope.disableTap = function () {
      var container = document.getElementsByClassName('pac-container');
      angular.element(container).attr('data-tap-disabled', 'true');
      var backdrop = document.getElementsByClassName('backdrop');
      angular.element(backdrop).attr('data-tap-disabled', 'true');
      angular.element(container).on("click", function () {
        document.getElementById('pac-input').blur();
      });
    };
    $scope.goBack = function () {
      $state.go('app.project');
    };

    function defaultPopModal() {
      $scope.create = {
        img_path: './img/arrow-up.svg',
        // govtRegNumb: '',
        orgName: '',
        orgDesc: '',
        orgAddress: '',
        // contact: '',
        // email: '',
        startdate: null,
        enddate: null,
        image: '',
        loaderImg: '',
        latitude: '',
        longitude: '',
        organizatons: '',
        challenges: '',
        heros: '',
        id: '',
        funds_target: '',
        currency: '',
        attachments: []
      };

    };
    $scope.organizatons = "";
    $scope.challenges = "";
    $scope.heros = "";
    $scope.currency = ["USD", "AED", "AFN*", "ALL", "AMD", "ANG", "AOA*", "ARS*", "AUD", "AWG", "AZN", "BAM", "BBD", "BDT", "BGN", "BIF", "BMD", "BND", "BOB*", "BRL*", "BSD", "BWP", "BZD", "CAD", "CDF", "CHF", "CLP*", "CNY", "COP*", "CRC*", "CVE*", "CZK*", "DJF*", "DKK", "DOP", "DZD", "EGP", "ETB", "EUR", "FJD", "FKP*", "GBP", "GEL", "GIP", "GMD", "GNF*", "GTQ*", "GYD", "HKD", "HNL*", "HRK", "HTG", "HUF*", "IDR", "ILS", "INR*", "ISK", "JMD", "JPY", "KES", "KGS", "KHR", "KMF", "KRW", "KYD", "KZT", "LAK*", "LBP", "LKR", "LRD", "LSL", "MAD", "MDL", "MGA", "MKD", "MMK", "MNT", "MOP", "MRO", "MUR*", "MVR", "MWK", "MXN", "MYR", "MZN", "NAD", "NGN", "NIO*", "NOK", "NPR", "NZD", "PAB*", "PEN*", "PGK", "PHP", "PKR", "PLN", "PYG*", "QAR", "RON", "RSD", "RUB", "RWF", "SAR", "SBD", "SCR", "SEK", "SGD", "SHP*", "SLL", "SOS", "SRD*", "STD", "SZL", "THB", "TJS", "TOP", "TRY", "TTD", "TWD", "TZS", "UAH", "UGX", "UYU*", "UZS", "VND", "VUV", "WST", "XAF", "XCD", "XOF*", "XPF*", "YER", "ZAR", "ZMW"];


    function getOrganizatons() {
      $scope.showLoader();
      APIService.getOrganization().then(function (response) {
          $scope.hideLoader();
          $scope.organizatons = response.data;
        },
        function (error) {
          ionicToast.show(error.data.message, 'middle', false, 1000);
          $scope.hideLoader();
        });
    };

    function getChallenges() {
      $scope.showLoader();
      APIService.getChallenges().then(function (response) {
          $scope.hideLoader();
          $scope.challenges = response.data;
        },
        function (error) {
          ionicToast.show(error.data.message, 'middle', false, 1000);
          $scope.hideLoader();
        });
    };


    function getHeros() {
      $scope.showLoader();
      APIService.getHeros().then(function (response) {
          $scope.hideLoader();
          $scope.heros = response.data;
        },
        function (error) {
          ionicToast.show(error.data.message, 'middle', false, 1000);
          $scope.hideLoader();
        });
    };

    getOrganizatons();
    getHeros();
    getChallenges();

    defaultPopModal();
    if ($state.current.name === 'app.projectedit') {
      $scope.showLoader();
      APIService.getProfileProject($stateParams.id).then(function (response) {
          $scope.hideLoader();

          $scope.selectorhide = false;
          $scope.title = 'Update';
          $scope.btnText = 'Update Project';
          console.log(response.data);
          $scope.create = {
            img_path: response.data.image ? IMAGE_PATH + response.data.image : './img/arrow-up.svg',
            orgName: response.data.name,
            orgDesc: response.data.description,
            orgAddress: response.data.address,
            // contact: response.data.phone_number,
            // email: response.data.email,
            startdate: response.data.start_date ? moment(new Date(response.data.start_date)).format("MMM DD,YYYY") : null,
            enddate: response.data.end_date ? moment(new Date(response.data.end_date)).format("MMM DD,YYYY") : null,
            image: response.data.image,
            funds_target: parseInt(response.data.funds_target),
            // loaderImg: '',
            latitude: response.data.latitude,
            longitude: response.data.longitude,
            id: $stateParams.id,
            funds_target: parseInt(response.data.funds_target),
            currency: response.data.currency,
            attachments: []
          };
          response.data.attachments.forEach(el => {
            $scope.create.attachments.push([ATTACH_PATH + el.name, el.type]);
          });
        },
        function (error) {
          ionicToast.show(error.data.message, 'middle', false, 1000);
          $scope.hideLoader();
        });
    }
    $scope.log = '';
    $scope.upload = function (files, errFiles) {
      $scope.create.loaderImg = './img/image-uploader.svg';
      if (files && files.length) {
        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          if (!file.$error) {
            let token = JSON.parse(window.localStorage.mch_mob_data).access_token;
            Upload.upload({
              url: BASE_URL + '/upload-image',
              data: {
                file: file
              },
              headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
              },
            }).then(function (resp) {
              $scope.create.loaderImg = '';
              $scope.create.img_path = IMAGE_PATH + resp.data.filename;
              $scope.create.image = resp.data.filename;
            }, null, function (evt) {

            });
          }
        }
      }
    };
    $scope.submit = function (form) {

      if (form.$valid) {
        $scope.showLoader();
        let obj = {};
        obj.id = $scope.create.id ? $scope.create.id : '';
        obj.name = $scope.create.orgName;
        obj.address = $scope.create.orgAddress;
        obj.latitude = $scope.create.latitude;
        obj.longitude = $scope.create.longitude;
        obj.organizations = $scope.create.organizatons ? $scope.create.organizatons : '';
        obj.challenges = $scope.create.challenges ? $scope.create.challenges : '';
        obj.heroes = $scope.create.heros ? $scope.create.heros : '';
        obj.image = $scope.create.image;
        obj.description = $scope.create.orgDesc;
        obj.start_date = $scope.create.startdate != null ? moment(new Date($scope.create.startdate)).format("YYYY-MM-DD") : null;
        obj.end_date = $scope.create.enddate != null ? moment(new Date($scope.create.enddate)).format("YYYY-MM-DD") : null;
        obj.funds_target = $scope.create.funds_target ? $scope.create.funds_target : 10000;
        obj.currency = $scope.create.currency;
        obj.ufiles = [];

        $scope.create.attachments.forEach(function (element) {
          let objAttach = {};
          objAttach.name = element[0].replace(ATTACH_PATH, '');
          objAttach.file_type = element[1];
          obj.ufiles.push(objAttach);
        });
        if (obj.id) {
          APIService.updateProject(obj).then(function (response) {

              $scope.toastShortCenter('Record Update successfully');
              $scope.hideLoader();
              //new start
              $scope.goBack();
              //new end
            },
            function (error_response) {

              $scope.toastShortCenter(error_response);
              $scope.hideLoader();
            });
        } else {
          APIService.addProject(obj).then(function (response) {

              $scope.toastShortCenter('Record saved successfully');
              $timeout(function () {
                defaultPopModal();
                let pac_input = document.getElementById('pac-input-project');
                if (pac_input) {
                  pac_input.value = '';
                }
                $scope.hideLoader();
                $scope.goBack();
              }, 1000);

            },
            function (error_response) {

              $scope.toastShortCenter(error_response);
              $scope.hideLoader();
              defaultPopModal();
            });
        }
      }
    };

    $scope.openDatePicker = function (arg) {
      var calanderObj = {
        callback: function (val) { //Mandatory
          if (arg === 'startdate') {
            $scope.create.startdate = moment(new Date(val)).format("MMM DD,YYYY");
          } else {
            $scope.create.enddate = moment(new Date(val)).format("MMM DD,YYYY");
          }
          console.log('Return value from the datepicker popup is : ' + val, new Date(val));
        },
        disabledDates: [
          // new Date(2019, 2, 1),
        ],
        inputDate: arg === 'startdate' ? $scope.create.startdate ? new Date($scope.create.startdate) : new Date() : arg === 'enddate' ? $scope.create.enddate ? new Date($scope.create.enddate) : new Date() : '',
        // from: new Date(2012, 1, 1), //Optional
        // to: new Date(new Date().getFullYear(),1,1), //Optional
        // inputDate: new Date(),      //Optional
        // mondayFirst: true,          //Optional
        // disableWeekdays: [0],       //Optional
        closeOnSelect: true, //Optional
        // templateType: 'popup'       //Optional
        showTodayButton: false,
      };
      ionicDatePicker.openDatePicker(calanderObj);
    };
    // popup start

    $scope.$on('$destroy', function () {
      $scope.modal.remove();
    });
    $ionicModal.fromTemplateUrl('templates/googlemap.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modal = modal;
      $scope.map = "";
      $scope.marker = "";

      var marker = "";
      var map = "";
      var infoWindow = "";

      var location = {
        lat: 51.509865,
        lng: -0.118092
      };
      $scope.geoCoderReverse = function (latlng) {
        $scope.create.latitude = latlng.lat();
        $scope.create.longitude = latlng.lng();

        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({
          location: latlng
        }, (results, status) => {
          if (status === 'OK') {
            $scope.create.orgAddress = results[0].formatted_address;
            document.getElementById('pac-input-project').value = results[0].formatted_address
            console.log(results[0].formatted_address);
          }
        });
      };

      $scope.initMap = function () {
        location = {
          lat: $scope.create.latitude ? $scope.create.latitude : 51.509865,
          lng: $scope.create.longitude ? $scope.create.longitude : -0.118092
        };
        map = new google.maps.Map(angular.element(document.querySelector('#project-map'))[0], {
          center: location,
          zoom: 13,
          fullscreenControl: false,
          zoomControl: false,
          // mapTypeId: 'satellite'
          mapTypeControlOptions: {
            mapTypeIds: []
          },
        });
        var input = angular.element(document.querySelector('#pac-input-project'))[0];

        input.value = $scope.create.orgAddress;
        var autocomplete = new google.maps.places.Autocomplete(input);

        autocomplete.bindTo('bounds', map);

        autocomplete.setFields(
          ['address_components', 'geometry', 'icon', 'name']);

        marker = new google.maps.Marker({
          map: map,
          draggable: true,
          anchorPoint: new google.maps.Point(0, -29),
          position: location,
        });
        //new start
        const objlatlng = new window.google.maps.LatLng(
          location.lat,
          location.lng
        );
        $scope.geoCoderReverse(objlatlng);
        //new end

        // google.maps.event.addListener(map, 'click', (evt) => {
        //   marker.setVisible(false);
        //   marker.setPosition(evt.latLng);
        //   $scope.geoCoderReverse(evt.latLng);
        //   marker.setVisible(true);
        // });
        google.maps.event.addListener(marker, 'dragend', (evt) => {


          marker.setVisible(false);
          marker.setPosition(evt.latLng);
          // const latlng = {
          //   lat: evt.latLng.lat(),
          //   lng: evt.latLng.lng()
          // }
          $scope.geoCoderReverse(evt.latLng);
          marker.setVisible(true);

        });
        autocomplete.addListener('place_changed', function () {
          marker.setVisible(false);

          var place = autocomplete.getPlace();
          if (!place.geometry) {
            window.alert("No details available for input: '" + place.name + "'");
            return;
          }
          if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
          } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);
          }
          marker.setPosition(place.geometry.location);
          marker.setVisible(true);
          // const latlng = {
          //   lat: place.geometry.location.lat(),
          //   lng: place.geometry.location.lng()
          // }
          $scope.geoCoderReverse(place.geometry.location);
          // $scope.geoCoderReverse(place.geometry.location);
        });
      };
      $scope.currentLocation = function () {

        if (navigator.geolocation) {
          const geocoder = new google.maps.Geocoder();
          navigator.geolocation.getCurrentPosition((position) => {
            // location = {
            //   lat: position.coords.latitude,
            //   lng: position.coords.longitude,
            // };

            const objlatlng = new window.google.maps.LatLng(
              position.coords.latitude,
              position.coords.longitude
            );
            marker.setVisible(false);
            marker.setPosition(objlatlng);
            marker.setVisible(true);
            map.setCenter(objlatlng);
            $scope.geoCoderReverse(objlatlng);
          });
        }
      };

      $scope.modalOpen = function () {
        modal.show();
        $scope.initMap();
      };

      $scope.closeModal = function () {
        modal.hide();
      };
    });
    // popup end

  })

  .controller('HeroCreateCtrl', function ($scope, $rootScope, $stateParams, $state, $ionicNavBarDelegate, $ionicModal, $cordovaDatePicker, ionicDatePicker, BASE_URL, Upload, IMAGE_PATH, APIService, $timeout, ATTACH_PATH) {
    $scope.imagePath = IMAGE_PATH;
    $scope.selectorhide = true;
    $scope.title = 'Create';
    $scope.btnText = 'Create Project';

    $scope.parseMulti = function (items) {
      if (items) {
        return items.map(function (item) {
          return item.name;
        }).join(', ');
      }
    };
    $scope.disableTap = function () {
      var container = document.getElementsByClassName('pac-container');
      angular.element(container).attr('data-tap-disabled', 'true');
      var backdrop = document.getElementsByClassName('backdrop');
      angular.element(backdrop).attr('data-tap-disabled', 'true');
      angular.element(container).on("click", function () {
        document.getElementById('pac-input').blur();
      });
    };
    $scope.goBack = function () {
      $state.go('app.heroes');
    };

    function defaultPopModal() {
      $scope.create = {
        img_path: './img/arrow-up.svg',
        // govtRegNumb: '',
        orgName: '',
        orgDesc: '',
        orgAddress: '',
        job: '',
        // contact: '',
        // email: '',
        startdate: null,
        enddate: null,
        image: '',
        loaderImg: '',
        latitude: '',
        longitude: '',
        organizatons: '',
        challenges: '',
        heros: '',
        id: '',
        funds_target: '',
        attachments: []
      };

    };
    $scope.organizatons = "";
    $scope.challenges = "";
    $scope.heros = "";

    function getOrganizatons() {
      $scope.showLoader();
      APIService.getOrganization().then(function (response) {
          $scope.hideLoader();
          $scope.organizatons = response.data;
        },
        function (error) {
          ionicToast.show(error.data.message, 'middle', false, 1000);
          $scope.hideLoader();
        });
    };

    function getChallenges() {
      $scope.showLoader();
      APIService.getChallenges().then(function (response) {
          $scope.hideLoader();
          $scope.challenges = response.data;
        },
        function (error) {
          ionicToast.show(error.data.message, 'middle', false, 1000);
          $scope.hideLoader();
        });
    };


    function getHeros() {
      $scope.showLoader();
      APIService.getHeros().then(function (response) {
          $scope.hideLoader();
          $scope.heros = response.data;
        },
        function (error) {
          ionicToast.show(error.data.message, 'middle', false, 1000);
          $scope.hideLoader();
        });
    };

    getOrganizatons();
    getHeros();
    getChallenges();

    defaultPopModal();

    if ($state.current.name === 'app.heroedit') {
      $scope.showLoader();
      APIService.getHeroProfile($stateParams.id).then(function (response) {
          $scope.hideLoader();

          $scope.selectorhide = false;
          $scope.title = 'Update';
          $scope.btnText = 'Update Hero';
          $scope.create = {
            img_path: IMAGE_PATH + response.data.image,
            orgName: response.data.name,
            orgDesc: response.data.description,
            orgAddress: response.data.address,
            job: response.data.job,
            startdate: response.data.start_date ? moment(new Date(response.data.start_date)).format("MMM DD,YYYY") : null,
            enddate: response.data.end_date ? moment(new Date(response.data.end_date)).format("MMM DD,YYYY") : null,
            image: response.data.image,
            funds_target: parseInt(response.data.funds_target),
            // loaderImg: '',
            latitude: response.data.latitude,
            longitude: response.data.longitude,
            id: $stateParams.id,
            funds_target: parseInt(response.data.funds_target),
            attachments: []
          };
          response.data.attachments.forEach(el => {
            $scope.create.attachments.push([ATTACH_PATH + el.name, el.type]);
          });
        },
        function (error) {
          ionicToast.show(error.data.message, 'middle', false, 1000);
          $scope.hideLoader();
        });
    }
    $scope.log = '';
    $scope.upload = function (files, errFiles) {
      $scope.create.loaderImg = './img/image-uploader.svg';
      if (files && files.length) {
        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          if (!file.$error) {
            let token = JSON.parse(window.localStorage.mch_mob_data).access_token;
            Upload.upload({
              url: BASE_URL + '/upload-image',
              data: {
                file: file
              },
              headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
              },
            }).then(function (resp) {
              $scope.create.loaderImg = '';
              $scope.create.img_path = IMAGE_PATH + resp.data.filename;
              $scope.create.image = resp.data.filename;
            }, null, function (evt) {

            });
          }
        }
      }
    };
    $scope.submit = function () {

      $scope.showLoader();
      let obj = {};
      obj.id = $scope.create.id ? $scope.create.id : '';
      obj.name = $scope.create.orgName;
      obj.address = $scope.create.orgAddress;
      obj.latitude = $scope.create.latitude;
      obj.longitude = $scope.create.longitude;
      obj.organizations = $scope.create.organizatons ? $scope.create.organizatons : '';
      obj.challenges = $scope.create.challenges ? $scope.create.challenges : '';
      obj.heroes = $scope.create.heros ? $scope.create.heros : '';
      obj.image = $scope.create.image;
      obj.description = $scope.create.orgDesc;
      obj.job = $scope.create.job;
      obj.start_date = $scope.create.startdate != null ? moment(new Date($scope.create.startdate)).format("YYYY-MM-DD") : null;
      obj.end_date = $scope.create.enddate != null ? moment(new Date($scope.create.enddate)).format("YYYY-MM-DD") : null;
      obj.funds_target = $scope.create.funds_target ? $scope.create.funds_target : 10000;
      obj.ufiles = [];

      $scope.create.attachments.forEach(function (element) {
        let objAttach = {};
        objAttach.name = element[0].replace(ATTACH_PATH, '');
        objAttach.file_type = element[1];
        obj.ufiles.push(objAttach);
      });

      if (obj.id) {
        APIService.updateHero(obj).then(function (response) {

            window.localStorage.setItem('mch_mob_data', JSON.stringify(response.data));
            $rootScope.role = JSON.parse(window.localStorage.mch_mob_data).role;
            $rootScope.user_id = JSON.parse(localStorage.mch_mob_data).id;
            $rootScope.image = $scope.imagePath + JSON.parse(localStorage.mch_mob_data).image;
            $rootScope.user_name = JSON.parse(localStorage.mch_mob_data).name;
            $scope.toastShortCenter('Record Update successfully');
            $scope.hideLoader();
            //new start
            $scope.goBack();
            //new end
          },
          function (error_response) {

            $scope.toastShortCenter(error_response);
            $scope.hideLoader();
          });
      } else {
        APIService.addHero(obj).then(function (response) {

            $scope.toastShortCenter('Record saved successfully');
            $timeout(function () {
              defaultPopModal();
              let pac_input = document.getElementById('pac-input-hero');
              if (pac_input) {
                pac_input.value = '';
              }
              $scope.hideLoader();
              $scope.goBack();
            }, 1000);

          },
          function (error_response) {

            $scope.toastShortCenter(error_response);
            $scope.hideLoader();
            defaultPopModal();
          });
      }
    };

    $scope.openDatePicker = function (arg) {
      var calanderObj = {
        callback: function (val) { //Mandatory
          if (arg === 'startdate') {
            $scope.create.startdate = moment(new Date(val)).format("MMM DD,YYYY");
          } else {
            $scope.create.enddate = moment(new Date(val)).format("MMM DD,YYYY");
          }
          console.log('Return value from the datepicker popup is : ' + val, new Date(val));
        },
        disabledDates: [
          // new Date(2019, 2, 1),
        ],
        inputDate: arg === 'startdate' ? $scope.create.startdate ? new Date($scope.create.startdate) : new Date() : arg === 'enddate' ? $scope.create.enddate ? new Date($scope.create.enddate) : new Date() : '',
        // from: new Date(2012, 1, 1), //Optional
        // to: new Date(new Date().getFullYear(),1,1), //Optional
        // inputDate: new Date(),      //Optional
        // mondayFirst: true,          //Optional
        // disableWeekdays: [0],       //Optional
        closeOnSelect: true, //Optional
        // templateType: 'popup'       //Optional
        showTodayButton: false,
      };
      ionicDatePicker.openDatePicker(calanderObj);
    };
    // popup start
    $scope.$on('$destroy', function () {
      $scope.modal.remove();
    });
    $ionicModal.fromTemplateUrl('templates/googlemap.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modal = modal;
      $scope.map = "";
      $scope.marker = "";

      var marker = "";
      var map = "";
      var infoWindow = "";

      var location = {
        lat: 51.509865,
        lng: -0.118092
      };
      $scope.geoCoderReverse = function (latlng) {
        $scope.create.latitude = latlng.lat();
        $scope.create.longitude = latlng.lng();

        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({
          location: latlng
        }, (results, status) => {
          if (status === 'OK') {
            $scope.create.orgAddress = results[0].formatted_address;
            document.getElementById('pac-input-hero').value = results[0].formatted_address
            console.log(results[0].formatted_address);
          }
        });
      };
      $scope.initMap = function () {

        location = {
          lat: $scope.create.latitude ? $scope.create.latitude : 51.509865,
          lng: $scope.create.longitude ? $scope.create.longitude : -0.118092
        };
        map = new google.maps.Map(document.getElementById('hero-map'), {
          center: location,
          zoom: 13,
          fullscreenControl: false,
          zoomControl: false,
          // mapTypeId: 'satellite'
          mapTypeControlOptions: {
            mapTypeIds: []
          },
        });
        var input = document.getElementById('pac-input-hero');

        input.value = $scope.create.orgAddress;
        var autocomplete = new google.maps.places.Autocomplete(input);

        autocomplete.bindTo('bounds', map);

        autocomplete.setFields(
          ['address_components', 'geometry', 'icon', 'name']);

        marker = new google.maps.Marker({
          map: map,
          draggable: true,
          anchorPoint: new google.maps.Point(0, -29),
          position: location,
        });
        //new start
        const objlatlng = new window.google.maps.LatLng(
          location.lat,
          location.lng
        );
        $scope.geoCoderReverse(objlatlng);
        //new end
        // google.maps.event.addListener(map, 'click', (evt) => {
        //   marker.setVisible(false);
        //   marker.setPosition(evt.latLng);
        //   $scope.geoCoderReverse(evt.latLng);
        //   marker.setVisible(true);

        // });
        google.maps.event.addListener(marker, 'dragend', (evt) => {


          marker.setVisible(false);
          marker.setPosition(evt.latLng);
          // const latlng = {
          //   lat: evt.latLng.lat(),
          //   lng: evt.latLng.lng()
          // }
          $scope.geoCoderReverse(evt.latLng);
          marker.setVisible(true);

        });
        autocomplete.addListener('place_changed', function () {
          marker.setVisible(false);

          var place = autocomplete.getPlace();
          if (!place.geometry) {
            window.alert("No details available for input: '" + place.name + "'");
            return;
          }
          if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
          } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);
          }
          marker.setPosition(place.geometry.location);
          marker.setVisible(true);
          // const latlng = {
          //   lat: place.geometry.location.lat(),
          //   lng: place.geometry.location.lng()
          // }
          $scope.geoCoderReverse(place.geometry.location);
          // $scope.geoCoderReverse(place.geometry.location);
        });
      };
      $scope.currentLocation = function () {

        if (navigator.geolocation) {
          const geocoder = new google.maps.Geocoder();
          navigator.geolocation.getCurrentPosition((position) => {
            // location = {
            //   lat: position.coords.latitude,
            //   lng: position.coords.longitude,
            // };

            const objlatlng = new window.google.maps.LatLng(
              position.coords.latitude,
              position.coords.longitude
            );
            marker.setVisible(false);
            marker.setPosition(objlatlng);
            marker.setVisible(true);
            map.setCenter(objlatlng);
            $scope.geoCoderReverse(objlatlng);
          });
        }
      };

      $scope.modalOpen = function () {
        modal.show();
        $scope.initMap();
      };

      $scope.closeModal = function () {
        modal.hide();
      };
    });
    // popup end

  })
  .controller('ProjectCurrentCtrl', function ($scope, $rootScope, $stateParams, $state, APIService, IMAGE_PATH, $timeout, $ionicModal) {
    $scope.issupported = true;
    $scope.supported = [];
    $scope.myOrganization = [];
    $scope.count_supported = 0;
    $scope.count_myproject = 0;
    $scope.dataAvailable_supported = true;
    $scope.dataAvailable_myproject = true;
    $scope.imagePath = IMAGE_PATH;

    //first start
    let obj_pro = {
      page: 0
    };
    $scope.getProjectByOrg = function () {
      $scope.dataAvailable_myproject = false;
      $scope.showLoader();
      obj_pro.page++; //page state
      obj_pro.limit = 10; //record limit
      obj_pro.type = $scope.TypeEnum.own; //list type
      APIService.getProjectByType(obj_pro).then(function (response) {
          // $scope.myOrganization = response.data;

          // $scope.hideLoader();
          response.data.forEach(element => {
            $scope.myOrganization.push(element);
          });
          $scope.count_myproject = response.data.length ? response.data[0].count : 0;

          $scope.hideLoader();
          $scope.$broadcast('scroll.infiniteScrollComplete');
        },
        function (error) {
          ionicToast.show(error.data.message, 'middle', false, 1000);
          $scope.hideLoader();
        });
    };
    //first second

    //second start
    let obj_sup = {
      page: 0
    };
    $scope.getProjectBySupported = function () {
      if (!window.localStorage.mch_mob_data) {
        createGuestuser();
      } else {
        if ($scope.dataAvailable_supported) {
          $scope.getProjectByOrg(); //first time call 
        }
        $scope.dataAvailable_supported = false;
        $scope.showLoader();
        obj_sup.page++; //page state
        obj_sup.limit = 10; //record limit
        obj_sup.type = $scope.TypeEnum.supported; //list type

        APIService.getProjectByType(obj_sup).then(function (response) {

            response.data.forEach(element => {
              $scope.supported.push(element);
            });
            $scope.count_supported = response.data.length ? response.data[0].count : 0;
            $scope.hideLoader();
            $scope.$broadcast('scroll.infiniteScrollComplete');
          },
          function (error) {
            ionicToast.show(error.data.message, 'middle', false, 1000);
            $scope.hideLoader();
          });
      }

    };
    //second end
    $scope.getProjectBySupported(); //first time call 

    function createGuestuser() {
      $scope.showLoader();
      APIService.createGuest().then(function (response) {

          window.localStorage.setItem('mch_mob_data', JSON.stringify(response.data));
          $rootScope.role = JSON.parse(window.localStorage.mch_mob_data).role;
          $rootScope.user_id = JSON.parse(localStorage.mch_mob_data).id;
          $rootScope.image = $scope.imagePath + JSON.parse(localStorage.mch_mob_data).image;
          $rootScope.user_name = JSON.parse(localStorage.mch_mob_data).name;

          $scope.getProjectBySupported($scope.TypeEnum.supported);
          $scope.hideLoader();
        },
        function (error_response) {
          $scope.hideLoader();
          $scope.toastShortCenter(error_response.message);
        });
    }

    $scope.supportedType = function (data, objname) {

      if (objname == 'myOrganization') {
        let index = $scope.myOrganization.indexOf($scope.myOrganization.filter(function (i) {
          return i.id == data.id;
        })[0]);
        $scope.myOrganization[index].supported = true;
      } else if (objname == 'supported') {
        let index = $scope.supported.indexOf($scope.supported.filter(function (i) {
          return i.id == data.id;
        })[0]);
        $scope.supported[index].supported = true;
      }
      $scope.showLoader();
      let obj = {};
      obj.id = data.id;
      obj.type = "project";
      APIService.supperted(obj).then(function (response) {
          $scope.hideLoader();
        },
        function (error) {
          ionicToast.show(error.data.message, 'middle', false, 1000);
          $scope.hideLoader();
        });
    };
    $scope.usSupportedType = function (data, objname) {

      if (objname == 'myOrganization') {
        let index = $scope.myOrganization.indexOf($scope.myOrganization.filter(function (i) {
          return i.id == data.id;
        })[0]);
        $scope.myOrganization.splice(index, 1);
      } else if (objname == 'supported') {
        let index = $scope.supported.indexOf($scope.supported.filter(function (i) {
          return i.id == data.id;
        })[0]);
        $scope.supported.splice(index, 1);
      }
      $scope.showLoader();
      let obj = {};
      obj.id = data.id;
      obj.type = "project";
      APIService.usSupperted(obj).then(function (response) {
          $scope.hideLoader();
        },
        function (error) {
          ionicToast.show(error.data.message, 'middle', false, 1000);
          $scope.hideLoader();
        });
    };
  })
  .controller('ProjectSuggestedCtrl', function ($scope, $rootScope, $stateParams, $state, APIService, IMAGE_PATH, $timeout, $ionicModal) {
    $scope.issupported = true;
    $scope.suggested = [];
    $scope.count = 0; //default count is 0 for number assign
    $scope.dataAvailable = true; //default infinite scroll is true
    $scope.imagePath = IMAGE_PATH;

    let obj = {
      page: 0
    };
    $scope.getProjectBySuggested = function () {
      if (!window.localStorage.mch_mob_data) {
        createGuestuser();
      } else {
        $scope.dataAvailable = false;
        $scope.showLoader();
        obj.page++; //page state
        obj.limit = 10; //record limit
        obj.type = $scope.TypeEnum.suggested; //list type
        APIService.getProjectByType(obj).then(function (response) {
            response.data.forEach(element => {
              $scope.suggested.push(element);
            });
            $scope.count = response.data.length ? response.data[0].count : 0;
            $scope.hideLoader();
            $scope.$broadcast('scroll.infiniteScrollComplete');

          },
          function (error) {
            ionicToast.show(error.data.message, 'middle', false, 1000);
            $scope.hideLoader();
          });
      }
    };
    $scope.getProjectBySuggested(); //first time call 
    function createGuestuser() {
      $scope.showLoader();
      APIService.createGuest().then(function (response) {
          window.localStorage.setItem('mch_mob_data', JSON.stringify(response.data));
          $rootScope.role = JSON.parse(window.localStorage.mch_mob_data).role;
          $rootScope.user_id = JSON.parse(localStorage.mch_mob_data).id;
          $rootScope.image = $scope.imagePath + JSON.parse(localStorage.mch_mob_data).image;
          $rootScope.user_name = JSON.parse(localStorage.mch_mob_data).name;
          $scope.getProjectBySuggested();
          $scope.hideLoader();
        },
        function (error_response) {
          $scope.toastShortCenter(error_response.message);
          $scope.hideLoader();
        });
    }

    $scope.supportedType = function (data, objname) {
      if (objname == 'suggested') {
        let index = $scope.suggested.indexOf($scope.suggested.filter(function (i) {
          return i.id == data.id;
        })[0]);
        $scope.suggested[index].supported = true;
      }

      $scope.showLoader();
      let obj = {};
      obj.id = data.id;
      obj.type = "project";
      APIService.supperted(obj).then(function (response) {
          $scope.hideLoader();
        },
        function (error) {
          ionicToast.show(error.data.message, 'middle', false, 1000);
          $scope.hideLoader();
        });
    };
    $scope.usSupportedType = function (data, objname) {
      if (objname == 'suggested') {
        let index = $scope.suggested.indexOf($scope.suggested.filter(function (i) {
          return i.id == data.id;
        })[0]);
        $scope.suggested[index].supported = false;
        // $scope.suggested.splice(index, 1);
      }
      $scope.showLoader();
      let obj = {};
      obj.id = data.id;
      obj.type = "project";
      APIService.usSupperted(obj).then(function (response) {
          $scope.hideLoader();
        },
        function (error) {
          ionicToast.show(error.data.message, 'middle', false, 1000);
          $scope.hideLoader();
        });
    };
  })
  .controller('ProjectPastCtrl', function ($scope, $rootScope, $stateParams, $state, APIService, IMAGE_PATH, $timeout, $ionicModal) {
    $scope.issupported = true;
    $scope.past = [];
    $scope.count = 0; //default count is 0 for number assign
    $scope.dataAvailable = true; //default infinite scroll is true
    $scope.imagePath = IMAGE_PATH;


    function createGuestuser() {
      $scope.showLoader();
      APIService.createGuest().then(function (response) {
          window.localStorage.setItem('mch_mob_data', JSON.stringify(response.data));
          $rootScope.role = JSON.parse(window.localStorage.mch_mob_data).role;
          $rootScope.user_id = JSON.parse(localStorage.mch_mob_data).id;
          $rootScope.image = $scope.imagePath + JSON.parse(localStorage.mch_mob_data).image;
          $rootScope.user_name = JSON.parse(localStorage.mch_mob_data).name;

          $scope.getProjectByPast($scope.TypeEnum.past);
          $scope.hideLoader();
        },
        function (error_response) {
          $scope.toastShortCenter(error_response.message);
          $scope.hideLoader();
        });
    }

    let obj = {
      page: 0
    };
    $scope.getProjectByPast = function () {
      if (!window.localStorage.mch_mob_data) {
        createGuestuser();
      } else {
        $scope.dataAvailable = false;
        $scope.showLoader();
        obj.page++; //page state
        obj.limit = 10; //record limit
        obj.type = $scope.TypeEnum.past; //list type
        APIService.getProjectByType(obj).then(function (response) {
            response.data.forEach(element => {
              $scope.past.push(element);
            });
            $scope.count = response.data.length ? response.data[0].count : 0;
            $scope.hideLoader();
            $scope.$broadcast('scroll.infiniteScrollComplete');
          },
          function (error) {
            ionicToast.show(error.data.message, 'middle', false, 1000);
            $scope.hideLoader();
          });
      }
    };
    $scope.getProjectByPast();

    $scope.supportedType = function (data, objname) {
      if (objname == 'past') {
        let index = $scope.past.indexOf($scope.past.filter(function (i) {
          return i.id == data.id;
        })[0]);
        $scope.past[index].supported = true;
      }

      $scope.showLoader();
      let obj = {};
      obj.id = data.id;
      obj.type = "project";
      APIService.supperted(obj).then(function (response) {
          $scope.hideLoader();
        },
        function (error) {
          ionicToast.show(error.data.message, 'middle', false, 1000);
          $scope.hideLoader();
        });
    };
    $scope.usSupportedType = function (data, objname) {

      if (objname == 'past') {
        let index = $scope.past.indexOf($scope.past.filter(function (i) {
          return i.id == data.id;
        })[0]);
        $scope.suggested[index].supported = false;
        // $scope.past.splice(index, 1);
      }
      $scope.showLoader();
      let obj = {};
      obj.id = data.id;
      obj.type = "project";
      APIService.usSupperted(obj).then(function (response) {
          $scope.hideLoader();
        },
        function (error) {
          ionicToast.show(error.data.message, 'middle', false, 1000);
          $scope.hideLoader();
        });
    };

  })

  .controller('ChallengeCtrl', function ($scope, $stateParams, $ionicPopup, $state, $ionicNavBarDelegate, $ionicModal, $cordovaDatePicker) {
    $scope.gotoOrg = function () {
      $state.go('app.organization');
    };
    $scope.gotoProject = function () {
      $state.go('app.project');
    };
    var options = {
      // date: new Date(),
      mode: 'date', // or 'time'
      // minDate: new Date() - 10000,
      // allowOldDates: true,
      // allowFutureDates: false,
      doneButtonLabel: 'DONE',
      doneButtonColor: '#F2F3F4',
      cancelButtonLabel: 'CANCEL',
      cancelButtonColor: '#000000'
    };

    $scope.showDate = function () {
      $cordovaDatePicker.show(options).then(function (date) {
        alert(date);
      });
    };

    $scope.showGuestPopup = function () {
      $ionicPopup.show({
        templateUrl: 'templates/guestuser.html',
        title: 'To create you have to login or register',
        subTitle: 'Please register or login',
        scope: $scope,
        buttons: [{
            text: '<b>Login</b>',
            type: 'button-positive',
            onTap: function (e) {
              return 'login';
            }
          },
          {
            text: '<b>Register</b>',
            type: 'button-positive',
            onTap: function (e) {
              return 'register';
            }
          },
        ]
      }).then(function (res) {
        if (res == 'login') {
          $state.go('login');
        } else {
          $state.go('signup');
        }
      }, function (err) {
        // console.log('Err:', err);
      }, function (msg) {
        // console.log('message:', msg);
      });
    };

    $scope.gotoCreate = function () {
      if (JSON.parse(localStorage.mch_mob_data).role === 'user') {
        $state.go('app.challangecreate');
      } else {
        $scope.showGuestPopup();
      }
    };


    $ionicModal.fromTemplateUrl('templates/create.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modal = modal;
    });

  })
  .controller('ChallangeCreateCtrl', function ($scope, $stateParams, $state, $ionicNavBarDelegate, $ionicModal, $cordovaDatePicker, ionicDatePicker, BASE_URL, Upload, IMAGE_PATH, APIService, $timeout, ATTACH_PATH,ionicTimePicker) {
    $scope.imagePath = IMAGE_PATH;
    $scope.selectorhide = true;
    $scope.title = 'Create';
    $scope.btnText = 'Create Challenge';

    $scope.parseMulti = function (items) {
      if (items) {
        return items.map(function (item) {
          return item.name;
        }).join(', ');
      }
    };

    $scope.openTimePicker = function (arg) {
      var timeObj = {

        callback: function (val) {
          if (typeof (val) === 'undefined') {
            console.log('Time not selected');
          } else {
            var selectedTime = new Date(val * 1000);
            console.log('Selected epoch is : ', val, 'and the time is ', selectedTime.getUTCHours(), 'H :', selectedTime.getUTCMinutes(), 'M');
            if (arg == 'starttime') {
              $scope.create.starttime= `${selectedTime.getUTCHours()} : ${selectedTime.getUTCMinutes()}`;
            }
            else{
              $scope.create.endtime= `${selectedTime.getUTCHours()} : ${selectedTime.getUTCMinutes()}`;
            }
          }
        },
    
        inputTime: (60 * (new Date().getMinutes() + (60 * new Date().getHours()))),
        format: 24,
        step: 1,
      };

      if (arg == 'starttime' && $scope.create.starttime) {
          timeObj.inputTime = (parseInt($scope.create.starttime.split(':')[0]) * 60 * 60 + parseInt($scope.create.starttime.split(':')[1]) * 60);
      }
      if (arg == 'endtime' && $scope.create.endtime) {
        timeObj.inputTime = (parseInt($scope.create.endtime.split(':')[0]) * 60 * 60 + parseInt($scope.create.endtime.split(':')[1]) * 60);
      }
      ionicTimePicker.openTimePicker(timeObj);
    };

    $scope.disableTap = function () {
      var container = document.getElementsByClassName('pac-container');
      angular.element(container).attr('data-tap-disabled', 'true');
      var backdrop = document.getElementsByClassName('backdrop');
      angular.element(backdrop).attr('data-tap-disabled', 'true');
      angular.element(container).on("click", function () {
        document.getElementById('pac-input').blur();
      });
    };
    $scope.goBack = function () {
      $state.go('app.challenges');
    };

    function defaultPopModal() {
      $scope.create = {
        img_path: './img/arrow-up.svg',
        // govtRegNumb: '',
        orgName: '',
        orgDesc: '',
        orgAddress: '',
        // contact: '',
        // email: '',
        startdate: null,
        enddate: null,
        image: '',
        loaderImg: '',
        latitude: '',
        longitude: '',
        organizatons: '',
        projects: '',
        heros: '',
        id: '',
        funds_target: '',
        currency: '',
        attachments: [],
        starttime: null,
        endtime: null,
      };
    };

    $scope.organizatons = "";
    $scope.projects = "";
    $scope.heros = "";
    $scope.currency = ["USD", "AED", "AFN*", "ALL", "AMD", "ANG", "AOA*", "ARS*", "AUD", "AWG", "AZN", "BAM", "BBD", "BDT", "BGN", "BIF", "BMD", "BND", "BOB*", "BRL*", "BSD", "BWP", "BZD", "CAD", "CDF", "CHF", "CLP*", "CNY", "COP*", "CRC*", "CVE*", "CZK*", "DJF*", "DKK", "DOP", "DZD", "EGP", "ETB", "EUR", "FJD", "FKP*", "GBP", "GEL", "GIP", "GMD", "GNF*", "GTQ*", "GYD", "HKD", "HNL*", "HRK", "HTG", "HUF*", "IDR", "ILS", "INR*", "ISK", "JMD", "JPY", "KES", "KGS", "KHR", "KMF", "KRW", "KYD", "KZT", "LAK*", "LBP", "LKR", "LRD", "LSL", "MAD", "MDL", "MGA", "MKD", "MMK", "MNT", "MOP", "MRO", "MUR*", "MVR", "MWK", "MXN", "MYR", "MZN", "NAD", "NGN", "NIO*", "NOK", "NPR", "NZD", "PAB*", "PEN*", "PGK", "PHP", "PKR", "PLN", "PYG*", "QAR", "RON", "RSD", "RUB", "RWF", "SAR", "SBD", "SCR", "SEK", "SGD", "SHP*", "SLL", "SOS", "SRD*", "STD", "SZL", "THB", "TJS", "TOP", "TRY", "TTD", "TWD", "TZS", "UAH", "UGX", "UYU*", "UZS", "VND", "VUV", "WST", "XAF", "XCD", "XOF*", "XPF*", "YER", "ZAR", "ZMW"];


    function getOrganizatons() {
      $scope.showLoader();
      APIService.getOrganization().then(function (response) {
          $scope.hideLoader();
          $scope.organizatons = response.data;
        },
        function (error) {
          ionicToast.show(error.data.message, 'middle', false, 1000);
          $scope.hideLoader();
        });
    };

    function getProjects() {
      $scope.showLoader();
      APIService.getProjects().then(function (response) {
          $scope.hideLoader();

          $scope.projects = response.data;
        },
        function (error) {
          ionicToast.show(error.data.message, 'middle', false, 1000);
          $scope.hideLoader();
        });
    };


    function getHeros() {
      $scope.showLoader();
      APIService.getHeros().then(function (response) {
          $scope.hideLoader();
          $scope.heros = response.data;
        },
        function (error) {
          ionicToast.show(error.data.message, 'middle', false, 1000);
          $scope.hideLoader();
        });
    };

    getOrganizatons();
    getHeros();
    getProjects();

    defaultPopModal();
    if ($state.current.name === 'app.challangeedit') {
      $scope.showLoader();
      APIService.getProfileChallenge($stateParams.id).then(function (response) {
          $scope.hideLoader();

          $scope.selectorhide = false;
          $scope.title = 'Update';
          $scope.btnText = 'Update Challenge';
          console.log(response.data);

          $scope.create = {
            img_path: response.data.image ? IMAGE_PATH + response.data.image : './img/arrow-up.svg',
            orgName: response.data.name,
            orgDesc: response.data.description,
            orgAddress: response.data.address,
            // contact: response.data.phone_number,
            // email: response.data.email,
            startdate: response.data.start_date ? moment(new Date(response.data.start_date)).format("MMM DD,YYYY") : null,
            enddate: response.data.end_date ? moment(new Date(response.data.end_date)).format("MMM DD,YYYY") : null,
            image: response.data.image,
            funds_target: parseInt(response.data.funds_target),
            // loaderImg: '',
            latitude: response.data.latitude,
            longitude: response.data.longitude,
            id: $stateParams.id,
            funds_target: parseInt(response.data.funds_target),
            currency: response.data.currency,
            attachments: [],
                };
          if (response.data.start_date) {
            $scope.create.starttime = moment(response.data.start_date).format('HH : mm') == '00 : 00' ? null : moment(response.data.start_date).format('HH : mm');
          }
          if (response.data.end_date) {
            $scope.create.endtime = moment(response.data.end_date).format('HH : mm') == '00 : 00' ? null : moment(response.data.end_date).format('HH : mm');
          }
         

          response.data.attachments.forEach(el => {
            $scope.create.attachments.push([ATTACH_PATH + el.name, el.type]);
          });

        },
        function (error) {
          ionicToast.show(error.data.message, 'middle', false, 1000);
          $scope.hideLoader();
        });
    }
    $scope.log = '';
    $scope.upload = function (files, errFiles) {
      $scope.create.loaderImg = './img/image-uploader.svg';
      if (files && files.length) {
        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          if (!file.$error) {
            let token = JSON.parse(window.localStorage.mch_mob_data).access_token;
            Upload.upload({
              url: BASE_URL + '/upload-image',
              data: {
                file: file
              },
              headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
              },
            }).then(function (resp) {
              $scope.create.loaderImg = '';
              $scope.create.img_path = IMAGE_PATH + resp.data.filename;
              $scope.create.image = resp.data.filename;
            }, null, function (evt) {

            });
          }
        }
      }
    };
    $scope.submit = function (form) {
      if (form.$valid) {
        $scope.showLoader();
        let obj = {};
        obj.id = $scope.create.id ? $scope.create.id : '';
        obj.name = $scope.create.orgName;
        obj.address = $scope.create.orgAddress;
        obj.latitude = $scope.create.latitude;
        obj.longitude = $scope.create.longitude;
        obj.organizations = $scope.create.organizatons ? $scope.create.organizatons : '';
        obj.projects = $scope.create.projects ? $scope.create.projects : '';
        obj.heroes = $scope.create.heros ? $scope.create.heros : '';
        obj.image = $scope.create.image;
        obj.description = $scope.create.orgDesc;

        obj.start_date = $scope.create.startdate != null ? moment(new Date($scope.create.startdate)).format("YYYY-MM-DD") : null; //first hold format
        obj.end_date = $scope.create.enddate != null ? moment(new Date($scope.create.enddate)).format("YYYY-MM-DD") : null; //first hold format

        if (obj.start_date && $scope.create.starttime) {
          obj.start_date = $scope.create.startdate != null ? moment(obj.start_date + " " + $scope.create.starttime.replace(/ /g,'')).format("YYYY-MM-DD HH:mm:ss") : null;
        }
          if (obj.end_date && $scope.create.endtime) {
          obj.end_date = $scope.create.enddate != null ? moment(obj.end_date + " " + $scope.create.endtime.replace(/ /g,'')).format("YYYY-MM-DD HH:mm:ss") : null;
        }
       
        obj.funds_target = $scope.create.funds_target ? $scope.create.funds_target : 10000;
        obj.currency = $scope.create.currency;
       
       
        obj.ufiles = [];

        $scope.create.attachments.forEach(function (element) {
          let objAttach = {};
          objAttach.name = element[0].replace(ATTACH_PATH, '');
          objAttach.file_type = element[1];
          obj.ufiles.push(objAttach);
        });
        if (obj.id) {
          APIService.updateChallenge(obj).then(function (response) {

              $scope.toastShortCenter('Record Update successfully');
              $scope.hideLoader();
              //new start
              $scope.goBack();
              //new end
            },
            function (error_response) {

              $scope.toastShortCenter(error_response);
              $scope.hideLoader();
            });
        } else {
          APIService.addChallenge(obj).then(function (response) {

              $scope.toastShortCenter('Record saved successfully');
              $timeout(function () {
                defaultPopModal();
                let pac_input = document.getElementById('pac-input-challenge');
                if (pac_input) {
                  pac_input.value = '';
                }
                $scope.hideLoader();
                $scope.goBack();
              }, 1000);
              $scope.hideLoader();
            },
            function (error_response) {

              $scope.toastShortCenter(error_response);
              $scope.hideLoader();
              defaultPopModal();
            });
        }
      }
    };

    $scope.openDatePicker = function (arg) {
      var calanderObj = {
        callback: function (val) { //Mandatory
          if (arg === 'startdate') {
            $scope.create.startdate = moment(new Date(val)).format("MMM DD,YYYY");
          } else {
            $scope.create.enddate = moment(new Date(val)).format("MMM DD,YYYY");
          }
          console.log('Return value from the datepicker popup is : ' + val, new Date(val));
        },
        disabledDates: [
          // new Date(2019, 2, 1),
        ],
        inputDate: arg === 'startdate' ? $scope.create.startdate ? new Date($scope.create.startdate) : new Date() : arg === 'enddate' ? $scope.create.enddate ? new Date($scope.create.enddate) : new Date() : '',
        // from: new Date(2012, 1, 1), //Optional
        // to: new Date(new Date().getFullYear(),1,1), //Optional
        // inputDate: new Date(),      //Optional
        // mondayFirst: true,          //Optional
        // disableWeekdays: [0],       //Optional
        closeOnSelect: true, //Optional
        // templateType: 'popup'       //Optional
        showTodayButton: false,
      };
      ionicDatePicker.openDatePicker(calanderObj);
    };
    // popup start
    $scope.$on('$destroy', function () {
      $scope.modal.remove();
    });
    $ionicModal.fromTemplateUrl('templates/googlemap.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modal = modal;
      $scope.map = "";
      $scope.marker = "";

      let marker = "",
        map = "",
        infoWindow = "";

      let location = {
        lat: 51.509865,
        lng: -0.118092
      };
      $scope.geoCoderReverse = function (latlng) {
        $scope.create.latitude = latlng.lat();
        $scope.create.longitude = latlng.lng();

        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({
          location: latlng
        }, (results, status) => {
          if (status === 'OK') {
            $scope.create.orgAddress = results[0].formatted_address;
            document.getElementById('pac-input-challenge').value = results[0].formatted_address
            console.log(results[0].formatted_address);
          }
        });


      };
      $scope.initMap = function () {

        location = {
          lat: $scope.create.latitude ? $scope.create.latitude : 51.509865,
          lng: $scope.create.longitude ? $scope.create.longitude : -0.118092
        };
        map = new google.maps.Map(angular.element(document.querySelector('#challenge-map'))[0], {
          center: location,
          zoom: 13,
          fullscreenControl: false,
          zoomControl: false,
          // mapTypeId: 'satellite'
          mapTypeControlOptions: {
            mapTypeIds: []
          },
        });
        var input = document.getElementById('pac-input-challenge');

        // input.value = $scope.create.orgAddress;
        var autocomplete = new google.maps.places.Autocomplete(input);

        autocomplete.bindTo('bounds', map);

        autocomplete.setFields(
          ['address_components', 'geometry', 'icon', 'name']);

        marker = new google.maps.Marker({
          map: map,
          draggable: true,
          anchorPoint: new google.maps.Point(0, -29),
          position: location,
        });
        //new start
        const objlatlng = new window.google.maps.LatLng(
          location.lat,
          location.lng
        );
        $scope.geoCoderReverse(objlatlng);
        //new end
        // google.maps.event.addListener(map, 'click', (evt) => {
        //   marker.setVisible(false);
        //   marker.setPosition(evt.latLng);
        //   $scope.geoCoderReverse(evt.latLng);
        //   marker.setVisible(true);
        // });
        google.maps.event.addListener(marker, 'dragend', (evt) => {


          marker.setVisible(false);
          marker.setPosition(evt.latLng);
          // const latlng = {
          //   lat: evt.latLng.lat(),
          //   lng: evt.latLng.lng()
          // }
          $scope.geoCoderReverse(evt.latLng);
          marker.setVisible(true);

        });
        autocomplete.addListener('place_changed', function () {
          marker.setVisible(false);

          var place = autocomplete.getPlace();
          if (!place.geometry) {
            window.alert("No details available for input: '" + place.name + "'");
            return;
          }
          if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
          } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);
          }
          marker.setPosition(place.geometry.location);
          marker.setVisible(true);
          // const latlng = {
          //   lat: place.geometry.location.lat(),
          //   lng: place.geometry.location.lng()
          // }
          $scope.geoCoderReverse(place.geometry.location);
          // $scope.geoCoderReverse(place.geometry.location);
        });
      };
      $scope.currentLocation = function () {

        if (navigator.geolocation) {
          const geocoder = new google.maps.Geocoder();
          navigator.geolocation.getCurrentPosition((position) => {
            // location = {
            //   lat: position.coords.latitude,
            //   lng: position.coords.longitude,
            // };

            const objlatlng = new window.google.maps.LatLng(
              position.coords.latitude,
              position.coords.longitude
            );
            marker.setVisible(false);
            marker.setPosition(objlatlng);
            marker.setVisible(true);
            map.setCenter(objlatlng);
            $scope.geoCoderReverse(objlatlng);
          });
        }
      };

      $scope.modalOpen = function () {
        modal.show();
        $scope.initMap();
      };

      $scope.closeModal = function () {
        modal.hide();
      };
    });
    // popup end


  })
  .controller('ChallengeCurrentCtrl', function ($scope, $rootScope, $stateParams, $state, APIService, IMAGE_PATH, $timeout, $ionicModal) {
    $scope.issupported = true;
    $scope.supported = [];
    $scope.myOrganization = [];
    $scope.count_supported = 0;
    $scope.count_myproject = 0;
    $scope.dataAvailable_supported = true;
    $scope.dataAvailable_myproject = true;
    $scope.imagePath = IMAGE_PATH;


    //first start
    let obj_pro = {
      page: 0
    };
    $scope.getChallengeByOrg = function () {
      $scope.dataAvailable_myproject = false;
      $scope.showLoader();
      obj_pro.page++; //page state
      obj_pro.limit = 10; //record limit
      obj_pro.type = $scope.TypeEnum.own; //list type
      APIService.getChallengeByType(obj_pro).then(function (response) {
        
          response.data.forEach(element => {
            $scope.myOrganization.push(element);
          });
          $scope.count_myproject = response.data.length ? response.data[0].count : 0;

          $scope.hideLoader();
          $scope.$broadcast('scroll.infiniteScrollComplete');
        },
        function (error) {
          ionicToast.show(error.data.message, 'middle', false, 1000);
          $scope.hideLoader();
        });
    };


    //second start
    let obj_sup = {
      page: 0
    };
    $scope.getChallengeBySupported = function () {
      if (!window.localStorage.mch_mob_data) {
        createGuestuser();
      } else {
        if ($scope.dataAvailable_supported) {
          $scope.getChallengeByOrg(); //first time call 
        }
        $scope.dataAvailable_supported = false;
        $scope.showLoader();
        obj_sup.page++; //page state
        obj_sup.limit = 10; //record limit
        obj_sup.type = $scope.TypeEnum.supported; //list type
        APIService.getChallengeByType(obj_sup).then(function (response) {
            response.data.forEach(element => {
              $scope.supported.push(element);
            });
            $scope.count_supported = response.data.length ? response.data[0].count : 0;
            $scope.hideLoader();
            $scope.$broadcast('scroll.infiniteScrollComplete');
          },
          function (error) {
            ionicToast.show(error.data.message, 'middle', false, 1000);
            $scope.hideLoader();
          });
      }

    };
    $scope.getChallengeBySupported();

    function createGuestuser() {
      $scope.showLoader();
      APIService.createGuest().then(function (response) {

          window.localStorage.setItem('mch_mob_data', JSON.stringify(response.data));
          $rootScope.role = JSON.parse(window.localStorage.mch_mob_data).role;
          $rootScope.user_id = JSON.parse(localStorage.mch_mob_data).id;
          $rootScope.image = $scope.imagePath + JSON.parse(localStorage.mch_mob_data).image;
          $rootScope.user_name = JSON.parse(localStorage.mch_mob_data).name;
          $scope.getChallengeBySupported();
          $scope.hideLoader();
        },
        function (error_response) {
          // $scope.toastShortCenter(error_response);
          $scope.hideLoader();
        });
    }

    $scope.supportedType = function (data, objname) {

      if (objname == 'myOrganization') {
        let index = $scope.myOrganization.indexOf($scope.myOrganization.filter(function (i) {
          return i.id == data.id;
        })[0]);
        $scope.myOrganization[index].supported = true;
      } else if (objname == 'supported') {
        let index = $scope.supported.indexOf($scope.supported.filter(function (i) {
          return i.id == data.id;
        })[0]);
        $scope.supported[index].supported = true;
      }
      $scope.showLoader();
      let obj = {};
      obj.id = data.id;
      obj.type = "challenge";
      APIService.supperted(obj).then(function (response) {
          $scope.hideLoader();
        },
        function (error) {
          ionicToast.show(error.data.message, 'middle', false, 1000);
          $scope.hideLoader();
        });
    };
    $scope.usSupportedType = function (data, objname) {

      if (objname == 'myOrganization') {
        let index = $scope.myOrganization.indexOf($scope.myOrganization.filter(function (i) {
          return i.id == data.id;
        })[0]);
        $scope.myOrganization.splice(index, 1);
      } else if (objname == 'supported') {
        let index = $scope.supported.indexOf($scope.supported.filter(function (i) {
          return i.id == data.id;
        })[0]);
        $scope.supported.splice(index, 1);
      }
      $scope.showLoader();
      let obj = {};
      obj.id = data.id;
      obj.type = "challenge";
      APIService.usSupperted(obj).then(function (response) {
          $scope.hideLoader();
        },
        function (error) {
          ionicToast.show(error.data.message, 'middle', false, 1000);
          $scope.hideLoader();
        });
    };

  })
  .controller('ChallengeSuggestedCtrl', function ($scope, $rootScope, $stateParams, $state, APIService, IMAGE_PATH, $timeout, $ionicModal) {
    $scope.issupported = true;
    $scope.suggested = [];
    $scope.count = 0; //default count is 0 for number assign
    $scope.dataAvailable = true; //default infinite scroll is true
    $scope.imagePath = IMAGE_PATH;


    let obj = {
      page: 0
    };
    $scope.getChallengeBySuggested = function () {
      if (!window.localStorage.mch_mob_data) {
        createGuestuser();
      } else {
        $scope.dataAvailable = false;
        $scope.showLoader();
        obj.page++; //page state
        obj.limit = 10; //record limit
        obj.type = $scope.TypeEnum.suggested; //list type
        APIService.getChallengeByType(obj).then(function (response) {
            response.data.forEach(element => {
              $scope.suggested.push(element);
            });
            $scope.count = response.data.length ? response.data[0].count : 0;
            $scope.hideLoader();
            $scope.$broadcast('scroll.infiniteScrollComplete');
          },
          function (error) {
            ionicToast.show(error.data.message, 'middle', false, 1000);
            $scope.hideLoader();
          });
      }

    };
    $scope.getChallengeBySuggested();

    function createGuestuser() {
      $scope.showLoader();
      APIService.createGuest().then(function (response) {
          window.localStorage.setItem('mch_mob_data', JSON.stringify(response.data));
          $rootScope.role = JSON.parse(window.localStorage.mch_mob_data).role;
          $rootScope.user_id = JSON.parse(localStorage.mch_mob_data).id;
          $rootScope.image = $scope.imagePath + JSON.parse(localStorage.mch_mob_data).image;
          $rootScope.user_name = JSON.parse(localStorage.mch_mob_data).name;

          $scope.getChallengeBySuggested();
          $scope.hideLoader();
        },
        function (error_response) {
          // $scope.toastShortCenter(error_response);
          $scope.hideLoader();
        });
    }


    $scope.supportedType = function (data, objname) {
      if (objname == 'suggested') {
        let index = $scope.suggested.indexOf($scope.suggested.filter(function (i) {
          return i.id == data.id;
        })[0]);
        $scope.suggested[index].supported = true;
      }

      $scope.showLoader();
      let obj = {};
      obj.id = data.id;
      obj.type = "challenge";
      APIService.supperted(obj).then(function (response) {
          $scope.hideLoader();
        },
        function (error) {
          ionicToast.show(error.data.message, 'middle', false, 1000);
          $scope.hideLoader();
        });
    };
    $scope.usSupportedType = function (data, objname) {

      if (objname == 'suggested') {
        let index = $scope.suggested.indexOf($scope.suggested.filter(function (i) {
          return i.id == data.id;
        })[0]);
        $scope.suggested[index].supported = false;
        // $scope.suggested.splice(index, 1);
      }
      $scope.showLoader();
      let obj = {};
      obj.id = data.id;
      obj.type = "challenge";
      APIService.usSupperted(obj).then(function (response) {
          $scope.hideLoader();
        },
        function (error) {
          ionicToast.show(error.data.message, 'middle', false, 1000);
          $scope.hideLoader();
        });
    };

  })
  .controller('ChallengePastCtrl', function ($scope, $rootScope, $stateParams, $state, APIService, IMAGE_PATH, $timeout, $ionicModal) {

    $scope.issupported = true;
    $scope.past = [];
    $scope.count = 0; //default count is 0 for number assign
    $scope.dataAvailable = true; //default infinite scroll is true
    $scope.imagePath = IMAGE_PATH;


    let obj = {
      page: 0
    };
    $scope.getChallengeByPast = function () {
      if (!window.localStorage.mch_mob_data) {
        createGuestuser();
      } else {
        $scope.dataAvailable = false;
        $scope.showLoader();
        obj.page++; //page state
        obj.limit = 10; //record limit
        obj.type = $scope.TypeEnum.past; //list type
        APIService.getChallengeByType(obj).then(function (response) {
            response.data.forEach(element => {
              $scope.past.push(element);
            });
            $scope.count = response.data.length ? response.data[0].count : 0;
            $scope.hideLoader();
            $scope.$broadcast('scroll.infiniteScrollComplete');
          },
          function (error) {
            ionicToast.show(error.data.message, 'middle', false, 1000);
            $scope.hideLoader();
          });
      }

    };
    $scope.getChallengeByPast();

    function createGuestuser() {
      $scope.showLoader();
      APIService.createGuest().then(function (response) {

          window.localStorage.setItem('mch_mob_data', JSON.stringify(response.data));
          $rootScope.role = JSON.parse(window.localStorage.mch_mob_data).role;
          $rootScope.user_id = JSON.parse(localStorage.mch_mob_data).id;
          $rootScope.image = $scope.imagePath + JSON.parse(localStorage.mch_mob_data).image;
          $rootScope.user_name = JSON.parse(localStorage.mch_mob_data).name;

          $scope.getChallengeByPast();
          $scope.hideLoader();
        },
        function (error_response) {
          // $scope.toastShortCenter(error_response);
          $scope.hideLoader();
        });
    }


    $scope.supportedType = function (data, objname) {
      if (objname == 'past') {
        let index = $scope.past.indexOf($scope.past.filter(function (i) {
          return i.id == data.id;
        })[0]);
        $scope.past[index].supported = true;
      }

      $scope.showLoader();
      let obj = {};
      obj.id = data.id;
      obj.type = "challenge";
      APIService.supperted(obj).then(function (response) {
          $scope.hideLoader();
        },
        function (error) {
          ionicToast.show(error.data.message, 'middle', false, 1000);
          $scope.hideLoader();
        });
    };
    $scope.usSupportedType = function (data, objname) {

      if (objname == 'past') {
        let index = $scope.past.indexOf($scope.past.filter(function (i) {
          return i.id == data.id;
        })[0]);
        $scope.suggested[index].supported = false;
        // $scope.past.splice(index, 1);
      }
      $scope.showLoader();
      let obj = {};
      obj.id = data.id;
      obj.type = "challenge";
      APIService.usSupperted(obj).then(function (response) {
          $scope.hideLoader();
        },
        function (error) {
          ionicToast.show(error.data.message, 'middle', false, 1000);
          $scope.hideLoader();
        });
    };
    //donation end
  })
  .controller('HeroCtrl', function ($scope, $stateParams, $state, $ionicNavBarDelegate, $ionicModal, $cordovaDatePicker) {
    $scope.gotoOrg = function () {
      $state.go('app.organization');
    };
    $scope.gotoProject = function () {
      $state.go('app.project');
    };
  })
  .controller('HeroHerosCtrl', function ($scope, $rootScope, $stateParams, $state, APIService, IMAGE_PATH, $timeout, $ionicModal) {
    $scope.heros = [];
    $scope.count = 0; //default count is 0 for number assign
    $scope.dataAvailable = true; //default infinite scroll is true
    $scope.imagePath = IMAGE_PATH;


    let obj = {
      page: 0
    };
    $scope.getHeros = function () {
      if (!window.localStorage.mch_mob_data) {
        createGuestuser();
      } else {
        $scope.dataAvailable = false;
        $scope.showLoader();
        obj.page++; //page state
        obj.limit = 10; //record limit
        obj.type = $scope.TypeEnum.heroes; //list type
        APIService.getHeorByType(obj).then(function (response) {

            response.data.forEach(element => {
              $scope.heros.push(element);
            });

            $scope.count = response.data.length ? response.data[0].count : 0;
            $scope.hideLoader();
            $scope.$broadcast('scroll.infiniteScrollComplete');
          },
          function (error) {
            ionicToast.show(error.data.message, 'middle', false, 1000);
            $scope.hideLoader();
          });
      }

    };
    $scope.getHeros();

    function createGuestuser() {
      $scope.showLoader();
      APIService.createGuest().then(function (response) {

          window.localStorage.setItem('mch_mob_data', JSON.stringify(response.data));
          $rootScope.role = JSON.parse(window.localStorage.mch_mob_data).role;
          $rootScope.user_id = JSON.parse(localStorage.mch_mob_data).id;
          $rootScope.image = $scope.imagePath + JSON.parse(localStorage.mch_mob_data).image;
          $rootScope.user_name = JSON.parse(localStorage.mch_mob_data).name;
          $rootScope.user_email = JSON.parse(localStorage.mch_mob_data).email;
          

          $scope.getHeros();
          $scope.hideLoader();
        },
        function (error_response) {
          $scope.toastShortCenter(error_response.message);
          $scope.hideLoader();
        });
    }


    $scope.gotoProfile = function (item) {
      $state.go('app.hero-profile', {
        id: item.supportable_id
      });
    };

    $scope.supportedType = function (data, objname) {
      if (objname == 'heros') {
        let index = $scope.heros.indexOf($scope.heros.filter(function (i) {
          return i.id == data.id;
        })[0]);
        $scope.heros[index].supported = true;
      }

      $scope.showLoader();
      let obj = {};
      obj.id = data.id;
      obj.type = "hero";
      APIService.supperted(obj).then(function (response) {
          $scope.hideLoader();
        },
        function (error) {
          ionicToast.show(error.data.message, 'middle', false, 1000);
          $scope.hideLoader();
        });
    };
    $scope.usSupportedType = function (data, objname) {

      if (objname == 'heros') {
        let index = $scope.heros.indexOf($scope.heros.filter(function (i) {
          return i.id == data.id;
        })[0]);
        $scope.heros.splice(index, 1);
      }
      $scope.showLoader();
      let obj = {};
      obj.id = data.id;
      obj.type = "hero";
      APIService.usSupperted(obj).then(function (response) {
          $scope.hideLoader();
        },
        function (error) {
          ionicToast.show(error.data.message, 'middle', false, 1000);
          $scope.hideLoader();
        });
    };

  })

  .controller('HeroCelebrityCtrl', function ($scope, $rootScope, $stateParams, $state, APIService, IMAGE_PATH, $timeout, $ionicModal) {
    $scope.issupported = true;
    $scope.celebrity = [];
    $scope.count = 0; //default count is 0 for number assign
    $scope.dataAvailable = true; //default infinite scroll is true
    $scope.imagePath = IMAGE_PATH;


    let obj = {
      page: 0
    };
    $scope.getHeroByCelebrity = function () {
      if (!window.localStorage.mch_mob_data) {
        createGuestuser();
      } else {
        $scope.dataAvailable = false;
        $scope.showLoader();
        obj.page++; //page state
        obj.limit = 10; //record limit
        obj.type = $scope.TypeEnum.celebrities; //list type
        APIService.getHeorByType(obj).then(function (response) {
            response.data.forEach(element => {
              $scope.celebrity.push(element);
            });
            $scope.count = response.data.length ? response.data[0].count : 0;
            $scope.hideLoader();
            $scope.$broadcast('scroll.infiniteScrollComplete');
          },
          function (error) {
            ionicToast.show(error.data.message, 'middle', false, 1000);
            $scope.hideLoader();
          });
      }
    };
    $scope.getHeroByCelebrity();

    function createGuestuser() {
      $scope.showLoader();
      APIService.createGuest().then(function (response) {

          window.localStorage.setItem('mch_mob_data', JSON.stringify(response.data));
          $rootScope.role = JSON.parse(window.localStorage.mch_mob_data).role;
          $rootScope.user_id = JSON.parse(localStorage.mch_mob_data).id;
          $rootScope.image = $scope.imagePath + JSON.parse(localStorage.mch_mob_data).image;
          $rootScope.user_name = JSON.parse(localStorage.mch_mob_data).name;

          $scope.getHeroByCelebrity();
          $scope.hideLoader();
        },
        function (error_response) {
          $scope.toastShortCenter(error_response.message);
          $scope.hideLoader();
        });
    }

    $scope.gotoProfile = function (item) {
      $state.go('app.hero-profile', {
        id: item.supportable_id
      });
    };

    $scope.supportedType = function (data, objname) {
      if (objname == 'celebrity') {
        let index = $scope.celebrity.indexOf($scope.celebrity.filter(function (i) {
          return i.id == data.id;
        })[0]);
        $scope.celebrity[index].supported = true;
      }

      $scope.showLoader();
      let obj = {};
      obj.id = data.id;
      obj.type = "hero";
      APIService.supperted(obj).then(function (response) {
          $scope.hideLoader();
        },
        function (error) {
          ionicToast.show(error.data.message, 'middle', false, 1000);
          $scope.hideLoader();
        });
    };
    $scope.usSupportedType = function (data, objname) {

      if (objname == 'celebrity') {
        let index = $scope.celebrity.indexOf($scope.celebrity.filter(function (i) {
          return i.id == data.id;
        })[0]);
        $scope.celebrity.splice(index, 1);
      }
      $scope.showLoader();
      let obj = {};
      obj.id = data.id;
      obj.type = "hero";
      APIService.usSupperted(obj).then(function (response) {
          $scope.hideLoader();
        },
        function (error) {
          ionicToast.show(error.data.message, 'middle', false, 1000);
          $scope.hideLoader();
        });
    };

  })

  .controller('HeroSupporterCtrl', function ($scope, $rootScope, $stateParams, $state, APIService, IMAGE_PATH, $timeout, $ionicModal) {

    $scope.heros = [];
    $scope.count = 0; //default count is 0 for number assign
    $scope.dataAvailable = true; //default infinite scroll is true
    $scope.imagePath = IMAGE_PATH;


    let obj = {
      page: 0
    };
    $scope.getHeroBySupporter = function () {
      if (!window.localStorage.mch_mob_data) {
        createGuestuser();
      } else {
        $scope.dataAvailable = false;
        $scope.showLoader();
        obj.page++; //page state
        obj.limit = 10; //record limit
        obj.type = $scope.TypeEnum.own; //list type
        APIService.getHeorByType(obj).then(function (response) {
            response.data.forEach(element => {
              $scope.heros.push(element);
            });
            $scope.count = response.data.length ? response.data[0].count : 0;
            $scope.hideLoader();
            $scope.$broadcast('scroll.infiniteScrollComplete');
          },
          function (error) {
            ionicToast.show(error.data.message, 'middle', false, 1000);
            $scope.hideLoader();
          });
      }

    };
    $scope.getHeroBySupporter();

    function createGuestuser() {
      $scope.showLoader();
      APIService.createGuest().then(function (response) {

          window.localStorage.setItem('mch_mob_data', JSON.stringify(response.data));
          $rootScope.role = JSON.parse(window.localStorage.mch_mob_data).role;
          $rootScope.user_id = JSON.parse(localStorage.mch_mob_data).id;
          $rootScope.image = $scope.imagePath + JSON.parse(localStorage.mch_mob_data).image;
          $rootScope.user_name = JSON.parse(localStorage.mch_mob_data).name;

          $scope.getHeroBySupporter();
          $scope.hideLoader();
        },
        function (error_response) {
          // $scope.toastShortCenter(error_response);
          $scope.hideLoader();
        });
    }


    $scope.gotoProfile = function (item) {
      $state.go('app.hero-profile', {
        id: item.supportable_id
      });
    };
    $scope.supportedType = function (data, objname) {
      if (objname == 'heros') {
        let index = $scope.heros.indexOf($scope.heros.filter(function (i) {
          return i.id == data.id;
        })[0]);
        $scope.heros[index].supported = true;
      }

      $scope.showLoader();
      let obj = {};
      obj.id = data.id;
      obj.type = "hero";
      APIService.supperted(obj).then(function (response) {
          $scope.hideLoader();
        },
        function (error) {
          ionicToast.show(error.data.message, 'middle', false, 1000);
          $scope.hideLoader();
        });
    };
    $scope.usSupportedType = function (data, objname) {

      if (objname == 'heros') {
        let index = $scope.heros.indexOf($scope.heros.filter(function (i) {
          return i.id == data.id;
        })[0]);
        $scope.heros.splice(index, 1);
      }
      $scope.showLoader();
      let obj = {};
      obj.id = data.id;
      obj.type = "hero";
      APIService.usSupperted(obj).then(function (response) {
          $scope.hideLoader();
        },
        function (error) {
          ionicToast.show(error.data.message, 'middle', false, 1000);
          $scope.hideLoader();
        });
    };
  })

  .controller('PaymentsCtrl', function ($scope, $ionicHistory, $timeout, $ionicViewService, $stateParams, $state, $ionicNavBarDelegate, $ionicModal, APIService, ATTACH_PATH, IMAGE_PATH) {
    // $scope.slider = {};
    $ionicNavBarDelegate.showBackButton(false);
    $scope.creditcard = {
      number: "",
      expiry: null,
      cvc: "",
      btnStripe: true,
      btnDebitCredit: false,
      btnpaypal: false,
      name: APIService.getName(),
      address: APIService.getAddress(),
      postcode: APIService.getPostcode(),
      city: APIService.getPostCity(),
    };
    $scope.historyBack = function () {
      window.history.back();
    };

    // Stripe Response Handler
    // $scope.stripeCallback = function (code, result) {
    //   if (result.error) {
    //     window.alert('it failed! error: ' + result.error.message);
    //   } else {
    //     window.alert('success! token: ' + result.id);
    //   }
    // };
    $scope.submitCreditCard = function (creditcard) {
      $scope.showLoader();
      Stripe.card.createToken({
        number: $scope.creditcard.number,
        cvc: $scope.creditcard.cvc,
        exp: $scope.creditcard.expiry
      }, stripeResponseHandler);
    };

    function stripeResponseHandler(status, response) {
      if (status != 200) {
        $scope.hideLoader();
        $scope.toastShortCenter(response.error.message);
        // globalService.showAlert('ds', "Ops someting where wrong");
      } else {
        let obj = {};
        obj.token = response.id;
        obj.name = $scope.creditcard.name;
        obj.address = $scope.creditcard.address;
        obj.post_code = $scope.creditcard.postcode;
        obj.city = $scope.creditcard.city;
        obj.card_save = true;


        // obj.last_four = $scope.creditcard.number.substring($scope.creditcard.number.length - 4);

        APIService.addPayment(obj).then(function (response) {
            window.localStorage.setItem('mch_mob_data', JSON.stringify(response.data));

            $scope.toastShortCenter('Record saved successfully');
            $timeout(function () {
              $scope.creditcard = {};
              $scope.creditcard.btnStripe = true;
              $scope.creditcard.name = APIService.getName();
              $scope.creditcard.address = APIService.getAddress();
              $scope.creditcard.postcode = APIService.getPostcode();
              $scope.creditcard.city = APIService.getPostCity();
              $scope.creditcard.card_save = true;
              if ($stateParams.redirect && $stateParams.redirectid) {
                $state.go($stateParams.redirect, {
                  'id': $stateParams.redirectid,
                });
              }

            }, 1000);
            $scope.hideLoader();
          },
          function (error_response) {
            $scope.toastShortCenter(error_response);
            $scope.hideLoader();
            alert(error_response.data);
            // globalService.showAlert('ds', error_response.data);
          });
      }
    }
  });
