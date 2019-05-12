function fancySelectDirective($rootScope, $parse, $timeout, genericModalService) {
  return {
    restrict: 'EA',
    require: 'ngModel',
    scope: {
      'items': '='
    },

    link: function (scope, element, attrs, ngModelCtrl) {
      element.addClass('fancy-select');
      // Validate directive attributes.
      if (!attrs.items) {
        throw (new Error('items requires list over which to iterate.'));
      }
      if (!attrs.itemLabel) {
        throw (new Error('fancySelect requires a itemLabel expression.'));
      }

      var multiSelect = scope.$eval(attrs.multiSelect) || false,
        closeOnSelection = scope.$eval(attrs.closeOnSelection) || multiSelect ? false : true,
        headerText = attrs.headerText || (multiSelect ? 'Select items' : 'Select item'),
        templateUrl = attrs.itemsTemplateUrl || 'template/fancy-select/fancy-select.html',
        groupBy = attrs.groupBy || '',
        groupLabelParser = attrs.groupLabel ? $parse(attrs.groupLabel) : false,
        itemLabelParser = $parse(attrs.itemLabel),
        modalScope;

      function select() {
        var viewValue;
        if (multiSelect) {
          viewValue = modalScope.selection.selectable.filter(function (item) {
            return item.selected;
          });
        } else {
          viewValue = modalScope.selection.selected;
        }
        ngModelCtrl.$setViewValue(viewValue);
        ngModelCtrl.$render();
      }

      function showItems() {
        modalScope = $rootScope.$new();
        modalScope.multiSelect = multiSelect;
        modalScope.headerText = headerText;
        modalScope.itemLabel = itemLabelParser;
        modalScope.closeOnSelection = closeOnSelection;
        modalScope.group = groupBy;
        modalScope.groupLabel = groupLabelParser;
        modalScope.select = select;
        modalScope.selection = {
          selectable: scope.items,
          selected: scope.selected
        };

        if (multiSelect && typeof modalScope.selection.selected !== 'undefined' && Array.isArray(modalScope.selection.selected)) {
          modalScope.selection.selectable.forEach(function (item) {
            delete item.selected;
          });
          modalScope.selection.selected.forEach(function (item) {
            // var itemIndex = modalScope.selection.selectable.indexOf(item);
            var itemIndex = modalScope.selection.selectable.findIndex(x => x.name == item.name);
            if (itemIndex >= 0) {
              modalScope.selection.selectable[itemIndex].selected = true;
            }
          });
        }
        if (closeOnSelection) {
          var watchable = multiSelect ? 'selection.selectable' : 'selection.selected';
          modalScope.$watch(watchable, function (nv, ov) {
            if (nv !== ov) {
              select();
              $timeout(modalScope.closeModal, 0);
            }
          }, true);
        }

        genericModalService.show(templateUrl, modalScope, 'slide-in-right');
      }

      ngModelCtrl.$render = function () {
        scope.selected = ngModelCtrl.$viewValue;
      };

      element.on('click', showItems);
    }
  };
}

function fancySelectTemplate($templateCache) {
  $templateCache.put('template/fancy-select/fancy-select.html',
    '<ion-modal-view class="fancy-select-modal">' +
    '	<ion-header-bar align-title="center" class="bar-positive">' +
    '		<button class="button button-clear button-icon ion-arrow-left-c" ng-click="closeModal()"></button>' +
    '		<h1 class="title">{{headerText}}</h1>' +
    '		<button class="button button-clear button-icon ion-checkmark-round" ng-if="!closeOnSelection" ng-click="select(); closeModal();"></button>' +
    '	</ion-header-bar>' +
    '	<ion-content>' +
    '       <div class="list">' +
    '           <div class="item item-input-inset">' +
    '         <label class="item-input-wrapper">' +
    '               <input type="text" placeholder="Search" ng-model="searchText">' +
    '         </label>' +
    '           <button class="button button-small">' +
    '              Clear' +
    '           </button>' +
    '           </div>' +
    '       </div>' +
    '		<div ng-if="group">' +
    '			<div class="list cus-lable" ng-if="multiSelect" ng-repeat="(key, value) in selection.selectable | groupBy : group | filter:searchText">' +
    '				<ion-item ng-if="groupLabel" class="item-divider">{{groupLabel(value[0])}}</ion-item>' +
    '				<ion-checkbox ng-repeat="item in value" ng-model="item.selected">{{itemLabel(item)}}</ion-checkbox>' +
    '			</div>' +
    '			<div class="list cus-lable" ng-if="!multiSelect" ng-repeat="(key, value) in selection.selectable | groupBy : group | filter:searchText">' +
    '				<ion-item ng-if="groupLabel" class="item-divider">{{groupLabel(value[0])}}</ion-item>' +
    '				<ion-radio ng-repeat="item in value" ng-model="selection.selected" ng-value="item" name="fancy-select">{{itemLabel(item)}}</ion-radio>' +
    '			</div>' +
    '		</div>' +
    '		<div ng-if="!group">' +
    '			<div class="list cus-lable">' +
    '				<ion-checkbox ng-if="multiSelect" ng-repeat="item in selection.selectable | filter:searchText" ng-model="item.selected">{{itemLabel(item)}}</ion-checkbox>' +
    '				<ion-radio ng-if="!multiSelect" ng-repeat="item in selection.selectable | filter:searchText" ng-model="selection.selected" ng-value="item" name="fancy-select">{{itemLabel(item)}}</ion-radio>' +
    '			</div>' +
    '		</div>' +
    '	</ion-content>' +
    '</ion-modal-view>'
  );
}

angular.module('starter')
  .run(fancySelectTemplate)
  .directive('fancySelect', fancySelectDirective)
  .directive("donationButton", function () {
    var controller = ['$scope', '$ionicModal', 'APIService', '$stateParams', '$ionicLoading', 'ionicToast', '$timeout', function ($scope, $ionicModal, APIService, $stateParams, $ionicLoading, ionicToast, $timeout) {
      $scope.showLoader = function () {
        $ionicLoading.show({
          template: 'Loading...',
        }).then(function () {});
      };
      $scope.hideLoader = function () {
        $ionicLoading.hide().then(function () {});
      };
      $scope.getCards = function () {
        $scope.showLoader();
        APIService.getCards().then(function (response) {
            $scope.hideLoader();
            $scope.cards = response.data;
          },
          function (error) {
            ionicToast.show(error.data.message, 'middle', false, 1000);
            $scope.hideLoader();
          });
      };

      $scope.toastShortCenter = function (content) {
        if (ionic.Platform.platform() == 'ios' || ionic.Platform.platform() == 'android') {
          ionicToast.show(content, 'middle', false, 1000);

        } else {
          ionicToast.show(content, 'middle', false, 1000);
        }
      };

      $scope.defaultPopModal = function () {
        $scope.donate = {
          amount: 10,
          currency: 'USD',
          type: '',
          id: '',
          bank_account_id: '',
          gift_aid: false,
          btnStripe: true,
          number: '',
          cvc: '',
          expiry: null,
          future_save: false,
          name: APIService.getName(),
          address: APIService.getAddress(),
          postcode: APIService.getPostcode(),
          city: APIService.getPostCity(),
          anonymous: false,
          charity: '5',
          email: APIService.getEmail(),

          paymore: [{
            id: $stateParams.id,
            type: '',
            currency: 'USD',
            organization_id: '',
            amount: 10,
            currency_repeat: ['USD', 'PKR', 'AED', 'GBP'],
          }]
        };
      };

      $scope.addNewPaymore = function () {

        let newItemNo = $scope.donate.paymore.length + 1;
        $scope.donate.paymore.push({
          id: 'orgization' + newItemNo,
          currency: 'currency' + newItemNo,
          organization_id: '',
          amount: 'amount' + newItemNo,
          currency_repeat: ['USD', 'PKR', 'AED', 'GBP'],
        });
      };
      $scope.getCurrency = function (id, index) {

        $scope.showLoader();
        APIService.getCurrency(id).then(function (response) {
            $scope.hideLoader();
            $scope.donate.paymore[index].currency_repeat = response.data.length ? response.data : ['USD', 'PKR', 'AED', 'GBP'];;
          },
          function (error) {
            ionicToast.show(error.data.message, 'middle', false, 1000);
            $scope.hideLoader();
          });
      };

      $scope.changeOrg = function (id, index) {
        $scope.getCurrency(id, index);
      };

      $scope.removeNewPaymore = function () {
        var newItemNo = $scope.donate.paymore.length - 1;
        if (newItemNo !== 0) {
          $scope.donate.paymore.pop();
        }
      };

      $scope.alreadyCardShow = function () {
        $scope.modal.hide();
        $scope.alreadysavemodal.show();
      };
      $scope.addCard = function () {
        $scope.modal.hide();
        $scope.notsavemodal.show();
      };
      $scope.alreadyCard = function (isbanktransfer) {
        $scope.showLoader();

        let obj = {};
        obj.pay_more = [];
        obj.total_amount = 0;

        $scope.donate.paymore.forEach(element => {
          let objCard = {};
          objCard.amount = element.amount;
          objCard.id = $scope.donate.id;
          objCard.type = $scope.donate.type;
          obj.total_amount += element.amount;
          objCard.currency = element.currency;
          objCard.organization_id = element.organization_id;
          obj.pay_more.push(objCard);
        });


        obj.card_save = $scope.donate.future_save;
        obj.card_id = $scope.donate.paymentMethod;
        obj.amount = $scope.donate.amount;
        obj.bank_account_id = 1; //it's will be change in future
        obj.gift_aid = $scope.donate.gift_aid;
        // obj.total_amount = $scope.donate.amount;
        obj.name = $scope.donate.name;
        obj.address = $scope.donate.address;
        obj.post_code = $scope.donate.postcode;
        obj.city = $scope.donate.city;
        obj.email = $scope.donate.email;
        obj.anonymous = $scope.donate.anonymous;
        obj.banktransfer = isbanktransfer;
        obj.donate_to_platform_percentage = $scope.donate.charity;
        obj.type = $scope.donate.type;
        obj.id = $scope.donate.id;
        //new

        APIService.donateOrg(obj).then(function (response) {
            window.localStorage.setItem('mch_mob_data', JSON.stringify(response.data));
            $scope.modal.hide();
            $scope.thnakyoumodal.show();
            $scope.alreadysavemodal.hide();
            $timeout(function () {
              $scope.defaultPopModal();
            }, 1000);
            $timeout(function () {
              $scope.thnakyoumodal.hide();
            }, 2000);
            $scope.hideLoader();
          },
          function (error_response) {

            $scope.toastShortCenter(error_response);
            $scope.hideLoader();
            $scope.defaultPopModal();
          });
      };
      $scope.submitCreditCard = function (creditcard) {
        $scope.showLoader();
        Stripe.card.createToken({
          number: $scope.donate.number,
          cvc: $scope.donate.cvc,
          exp: $scope.donate.expiry
        }, stripeResponseHandler);
      };

      function stripeResponseHandler(status, response) {
        if (status != 200) {
          $scope.hideLoader();
          $scope.toastShortCenter(response.error.message);
        } else {

          let obj = {};
          obj.total_amount = 0;
          obj.pay_more = [];

          $scope.donate.paymore.forEach(element => {
            let objCard = {};
            objCard.amount = element.amount;
            objCard.id = $scope.donate.id;
            objCard.type = $scope.donate.type;
            obj.total_amount += element.amount;
            objCard.currency = element.currency;
            objCard.organization_id = element.organization_id;
            obj.pay_more.push(objCard);
          });

          obj.token = response.id;
          obj.card_save = $scope.donate.future_save;
          obj.amount = $scope.donate.amount;
          obj.bank_account_id = 1; //it's will be change in future
          obj.gift_aid = $scope.donate.gift_aid;
          obj.name = $scope.donate.name;
          obj.address = $scope.donate.address;
          obj.post_code = $scope.donate.postcode;
          obj.city = $scope.donate.city;
          obj.email = $scope.donate.email;
          obj.anonymous = $scope.donate.anonymous;
          obj.donate_to_platform_percentage = $scope.donate.charity;
          obj.type = $scope.donate.type;
          obj.id = $scope.donate.id;

          APIService.donateOrg(obj).then(function (response) {
              window.localStorage.setItem('mch_mob_data', JSON.stringify(response.data));
              $scope.modal.hide();
              $scope.thnakyoumodal.show();
              $scope.notsavemodal.hide();
              $scope.alreadysavemodal.hide();
              $scope.getCards();
              $timeout(function () {
                $scope.defaultPopModal();
              }, 1000);
              $timeout(function () {
                $scope.thnakyoumodal.hide();
              }, 2000);
              $scope.hideLoader();
            },
            function (error_response) {
              $scope.toastShortCenter(error_response);
              $scope.hideLoader();
              $scope.defaultPopModal();
            });
        }
      }
      $ionicModal.fromTemplateUrl('templates/donataion.html', {
        scope: $scope
      }).then(function (modal) {
        $scope.modal = modal;

        $scope.defaultPopModal();
        // $scope.getCards();
        $scope.closeModalDonation = function () {
          $scope.defaultPopModal();
          $scope.modal.hide();
        };
        $scope.checkAddMore = function (objdata) {

          for (let index = 0; index < objdata.length; index++) {
            const element = objdata[index];
            if (!element.amount || !element.currency || !element.organization_id) {
              return true;
            }
          }
        };
        $scope.showModal = function () {
          $scope.getCards();
          $scope.modal.show();
        };
      });

      $ionicModal.fromTemplateUrl('templates/thankyou.html', {
        scope: $scope
      }).then(function (modal) {
        $scope.thnakyoumodal = modal;
      });
      $ionicModal.fromTemplateUrl('templates/alreadysave.html', {
        scope: $scope
      }).then(function (modal) {
        $scope.alreadysavemodal = modal;
        $scope.closeModalAlreadySave = function () {
          $scope.alreadysavemodal.hide();
        };
      });
      $ionicModal.fromTemplateUrl('templates/notsave.html', {
        scope: $scope
      }).then(function (modal) {
        $scope.notsavemodal = modal;
        $scope.closeModalNotSave = function () {
          $scope.notsavemodal.hide();
        }
      });
    }];
    return {
      restrict: 'E',
      scope: {
        data: '@',
        display: '&',
        type: '@',
        event: '@',
      },
      controller: controller,
      templateUrl: './templates/common/DonationComponent.html',

      link: function ($scope, element, attrs) {

        $scope.showDonation = function () {
          event.stopPropagation(); //for click event stop whole div
          $scope.defaultPopModal();
          $scope.donate.type = this.type;

          let objData = $scope.$eval(this.data);

          $scope.donate.id = objData.id;

          $scope.orgList = objData.organization;
          !$scope.orgList ? $scope.getCurrency($scope.donate.id, 0) : '';
          !$scope.orgList ? $scope.donate.paymore[0].organization_id = $scope.donate.id : '';

          // $scope.getCurrency()
          // 

          $scope.showModal();
        };

      }
    };
  })

  .directive('donorList', function () {
    var controller = ['$scope', '$ionicModal', 'APIService', '$ionicLoading', 'ionicToast', 'IMAGE_PATH', function ($scope, $ionicModal, APIService, $ionicLoading, ionicToast, IMAGE_PATH) {
      $scope.objData = "";
      $scope.attachPath = IMAGE_PATH;
      $scope.showLoader = function () {
        $ionicLoading.show({
          template: 'Loading...',
        }).then(function () {});
      };
      $scope.hideLoader = function () {
        $ionicLoading.hide().then(function () {});
      };


      $scope.toastShortCenter = function (content) {
        if (ionic.Platform.platform() == 'ios' || ionic.Platform.platform() == 'android') {
          ionicToast.show(content, 'middle', false, 1000);

        } else {
          ionicToast.show(content, 'middle', false, 1000);
        }
      };

      function groupByCurrency(response) {
        // $scope.objData = response;

        let output = [];
        response.forEach(function (item) {
          var existing = output.filter(function (v, i) {
            return v.user_id == item.user_id;
          });

          if (existing.length) {
            var existingIndex = output.indexOf(existing[0]);
            output[existingIndex].amount = output[existingIndex].amount.concat(item.amount);
          } else {
            if (typeof item.amount == 'string' || typeof item.amount == 'number')
              item.amount = [item.amount];
            output.push(item);
          }
        });

        output.forEach(function (element, index) {
          let amount = 0;
          element.amount.forEach(el => {
            amount += parseInt(el);

          });

          output[index].amount = amount;
        });

        $scope.objData = output;
        $scope.modal.show();
      }

      $scope.getDonarList = function (obj) {
        // $scope.modal.show();
        $scope.showLoader();

        APIService.getDonarList(obj.id, obj.type).then(function (response) {
            $scope.hideLoader();

            if (response.data === undefined || response.data.length == 0) {
              $scope.toastShortCenter("Donation is empty");
            } else {
              groupByCurrency(response.data);
            }
          },
          function (error) {
            $scope.hideLoader();
          });
      };
      $ionicModal.fromTemplateUrl('templates/donar.html', {
        scope: $scope
      }).then(function (modal) {
        $scope.modal = modal;
        $scope.closeModal = function () {
          $scope.modal.hide();
        };
      });

      function getType(type) {

          switch (type) {
            case "App\\Organization":
             return 'organization';
              break;
              case "App\\Project":
            return 'project';
              break;
              case "App\\Challenge":
              return 'challenge';
                break;
          }
      }
    //socket start
    socket.on('connect', function(){
      
      console.log('connected');
      console.log(socket.id);
    });

    socket.on('message', function (response) {
      $scope.raiseDonation += parseInt(response.amount);
      
      if (parseInt($scope.raiseDonation) >= parseInt($scope.fundTarget)) {
        $scope.calulatedProgressbarRaise = 100;
        $scope.calulatedProgressbarMax = $scope.calulatedProgressbarRaise / 2;
      } 
      else {
        $scope.calulatedProgressbarRaise = Math.ceil(parseInt($scope.raiseDonation) / parseInt($scope.fundTarget) * 100);
        $scope.calulatedProgressbarMax = $scope.calulatedProgressbarRaise / 2;
      }

       let type= getType(response.donatable_type);
       if (JSON.parse($scope.items).id == response.orginization_id && JSON.parse($scope.items).type == type) {

        if ($scope.objData.length && $scope.objData.find(x => x.user.id == response.user.id)) {
          $scope.objData.find(x => x.user.id == response.user.id).amount +=parseInt(response.amount);
          $scope.$apply();
        }
        else if($scope.objData.length){
          $scope.objData.push(response);
          $scope.$apply();
        }  
       }
     
    });
    socket.on('disconnect', function () {});
    //socket end
    }];
    return {
      restrict: 'E',
      // replace: true,
      scope: {
        /*The object that passed from the cntroller*/
        objectToInject: '=',
        // recordId: '@',
        // type: '@',
        items: '@',
        // amount: '=',
        raiseDonation: '=',
        calulatedProgressbarRaise: '=',
        calulatedProgressbarMax: '=',
        fundTarget: '=',
      },
      templateUrl: './templates/common/DonarComponent.html',
      controller: controller,
      link: function ($scope, element, attrs) {
        
        // $scope.amout +=parseInt(response.amount);
        /*This method will be called whet the 'objectToInject' value is changes*/
        $scope.$watch('objectToInject', function (value) {
          /*Checking if the given value is not undefined*/
          if (value) {
            $scope.Obj = value;
            /*Injecting the Method*/
            $scope.Obj.invoke = function () {
              
              $scope.getDonarList($scope.$eval($scope.items));
              //Do something
            }
          }
        });
      }
    };
  })
  //attachments start

  .directive("attachment", function () {
    var controller = ['$scope', 'APIService', '$stateParams', '$ionicLoading', 'ionicToast', 'BASE_URL', 'Upload', '$ionicActionSheet', 'ATTACH_PATH', '$ionicSlideBoxDelegate', '$ionicModal', function ($scope, APIService, $stateParams, $ionicLoading, ionicToast, BASE_URL, Upload, $ionicActionSheet, ATTACH_PATH, $ionicSlideBoxDelegate, $ionicModal) {

      $scope.attachments = [];
      // $scope.isLabel = true;
      // $scope.role = angular.isDefined($scope.role) ? $scope.role : 'admin';

      $scope.showLoader = function () {
        $ionicLoading.show({
          template: 'Loading...',
        }).then(function () {});
      };
      $scope.hideLoader = function () {
        $ionicLoading.hide().then(function () {});
      };


      $scope.toastShortCenter = function (content) {
        if (ionic.Platform.platform() == 'ios' || ionic.Platform.platform() == 'android') {
          ionicToast.show(content, 'middle', false, 1000);

        } else {
          ionicToast.show(content, 'middle', false, 1000);
        }
      };

      // $scope.attachments.push(['https://images.pexels.com/photos/67636/rose-blue-flower-rose-blooms-67636.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500%201x,%20https://images.pexels.com/photos/67636/rose-blue-flower-rose-blooms-67636.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500%202x', 'img']);
      $scope.imageProgress = false;
      $scope.fileFormatError = function (errFiles) {
        if (errFiles.length > 0) {
          let errorName = "";
          errFiles.forEach(element => {
            errorName += element.name + ' ';
          });
          alert('ev', '', `Please Select a valid file format ${errorName} is not supported`);
          // $scope.showAlert('ev', '', `Please Select a valid file format ${errorName} is not supported`);
        }
      };

      $scope.log = '';
      // $scope.filepathdsd='https://www.w3schools.com/tags/horse.ogg';
      $scope.attachmentsFile = function (files, errFiles) {

        $scope.fileFormatError(errFiles);
        if (files && files.length) {
          let indexer = 0;
          for (var i = 0; i < files.length; i++) {
            var file = files[i];
            if (!file.$error) {
              let token = JSON.parse(window.localStorage.mch_mob_data).access_token;
              Upload.upload({
                // url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
                url: BASE_URL + '/upload-attachment',
                data: {
                  file: file
                },
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Accept': 'application/json'
                },
              }).then(function (resp) {

                let orignalfile = "";
                if (files[indexer].type.includes('application/pdf')) {
                  // orignalfile = ['img/pdf-icon.png', 'pdf'];
                  orignalfile = [ATTACH_PATH + resp.data.filename, 'pdf'];
                } else if (files[indexer].type.includes('video')) {
                  // orignalfile = [files[indexer], 'video'];
                  orignalfile = [ATTACH_PATH + resp.data.filename, 'video'];
                } else {
                  // try to do that thing
                  orignalfile = [ATTACH_PATH + resp.data.filename, 'img'];
                  // orignalfile = [files[indexer], 'img'];
                }

                $scope.attachments.push(orignalfile);
                $scope.imageProgress = false;

                indexer++;
              }, function (resp) {
                $scope.toastShortCenter(resp.status);
                // console.log('Error status: ' + resp.status);
                $scope.imageProgress = false;
              }, function (resp) {
                $scope.imageProgress = true;

              });
              //  return deferred.promise;
            }
          }
        }

      };
      $scope.onHoldRemoveImg = function (objArray, currentIndex) {

        var hideSheet = $ionicActionSheet.show({
          buttons: [{
            text: '<b class="red">Delete</b>'
          }],
          titleText: 'Action',
          cancelText: 'Cancel',
          cancel: function () {
            // add cancel code..
          },
          buttonClicked: function () {
            objArray.splice(currentIndex, 1);
            return true;
          }
        });
      };
      $scope.navSlide = function (index) {
        $scope.modal.show();
        $ionicSlideBoxDelegate.slide(index, 500);
      };
      $ionicModal.fromTemplateUrl('templates/slideBox.html', {
        scope: $scope,
        // backdropClickToClose: false,
      }).then(function (modal) {
        $scope.modal = modal;

        $scope.closeModalDonation = function () {
          // $scope.title = "";
          // $scope.myOrganization = [];
          // $scope.dataAvailable = true; //default infinite scroll is true
          // $scope.count = false; //default count is 0 for number assign
          // page = 0;
          $scope.modal.hide();
        };
      });
      $scope.openSlideBox = function (index) {

        $scope.navSlide(index);
      };
    }];
    return {
      restrict: 'EA',
      require: 'ngModel',
      scope: {
        attachments: '=',
        titleText: '@',
        role: '@?',
        showAddAttachment: '@',
      },
      controller: controller,
      templateUrl: './templates/common/attachments.html',
      // replace: true,

      link: function ($scope, element, attrs) {

        // scope.$watch(function () {

        //   return ngModel.$modelValue;
        // }, function (v) {
        //   console.log('!!!' + v);
        // })
        // $scope.$on('updateAttachmentDirective', function() {

        //  console.log('updating the scope of directive so that ng-bind works');
        //  // $scope.$apply(function() {
        //  //   $scope.myObject = myApi.model().myObject;
        //  //   console.log($scope.myObject);
        //  // });
        // });
      }

    };
  })
  //attachments end

  // show more start
  .directive("showMore", function () {
    var controller = ['$scope', '$ionicModal', 'APIService', '$stateParams', '$ionicLoading', 'ionicToast', '$timeout', 'IMAGE_PATH', '$state', function ($scope, $ionicModal, APIService, $stateParams, $ionicLoading, ionicToast, $timeout, IMAGE_PATH, $state) {

      $scope.imagePath = IMAGE_PATH;
      $scope.title = "";
      let page = 0;
      $scope.myOrganization = [];
      $scope.dataAvailable = true; //default infinite scroll is true
      $scope.count = false; //default count is 0 for number assign
      $scope.showLoader = function () {
        $ionicLoading.show({
          template: 'Loading...',
        }).then(function () {});
      };
      $scope.hideLoader = function () {
        $ionicLoading.hide().then(function () {});
      };

      $scope.toastShortCenter = function (content) {
        if (ionic.Platform.platform() == 'ios' || ionic.Platform.platform() == 'android') {
          ionicToast.show(content, 'middle', false, 1000);

        } else {
          ionicToast.show(content, 'middle', false, 1000);
        }
      };
      $scope.amountConversionTok = function (data) {

        if (data.associatable.funds_raised) {
          data.associatable.convert_funds_raised = data.associatable.funds_raised > 999 ? (data.associatable.funds_raised / 1000) + 'K' : data.associatable.funds_raised;
        }
        if (data.associatable.funds_target) {
          data.associatable.convert_funds_target = data.associatable.funds_target > 999 ? (data.associatable.funds_target / 1000) + 'K' : data.associatable.funds_target;
        }
        return data;
      }
      $ionicModal.fromTemplateUrl('templates/listShowMore.html', {
        scope: $scope,
        backdropClickToClose: false,
      }).then(function (modal) {
        $scope.modal = modal;

        $scope.closeModalDonation = function () {
          $scope.title = "";
          $scope.myOrganization = [];
          $scope.dataAvailable = true; //default infinite scroll is true
          $scope.count = false; //default count is 0 for number assign
          page = 0;
          $scope.modal.hide();
        };
      });
      $scope.gotoProfile = function (data) {
        $scope.closeModalDonation();
        if ($scope.type === 'user') {
          $state.go('app.hero-profile', {
            'id': data.associatable.id
          });

        } else if ($scope.type === 'challenge') {
          $state.go('app.challenge-profile', {
            'id': data.associatable.id
          });

        } else if ($scope.type === 'organization') {
          $state.go('app.profile', {
            'id': data.associatable.id
          });
        } else if ($scope.type === 'project') {
          $state.go('app.project-profile', {
            'id': data.associatable.id
          });
        }
      };
      $scope.showModal = function () {
        $scope.modal.show();
        $scope.getById();
      };

      $scope.getById = function (searchTxt) {

        let obj = {};
        obj.id = $stateParams.id;
        obj.idType = this.idType;
        obj.type = this.type;
        obj.limit = 10;
        page++;
        obj.page = page;
        $scope.title = this.titleName;
        $scope.showLoader();
        $scope.dataAvailable = false;
        $scope.type = this.type;
        $scope.idType = this.idType;
       
        if (searchTxt) {
          obj.search = searchTxt;
        }

        APIService.getAssociates(obj).then(function (response) {
            // let objDataArray = [];
            $scope.hideLoader();

            if (response.data.length && response.data[0].associatable) {
              response.data.forEach(element => {
                $scope.myOrganization.push(element);
              });
            } else {
              response.data.forEach(element => {
                let objData = {};
                objData.associatable = element;
                $scope.myOrganization.push(objData);
              });
            }
          
            $scope.count = response.data.length > 0 ? true : false;
            $scope.$broadcast('scroll.infiniteScrollComplete');
          },
          function (error) {
            ionicToast.show(error.data.message, 'middle', false, 1000);
            $scope.hideLoader();
          });

      };

      var promise;
      $scope.SearchResults = function (SearchText) {
          if (promise) $timeout.cancel(promise);

          promise = $timeout(function () {
            page = 0;
            $scope.myOrganization=[];
            $scope.getById(SearchText);
          }, 500);
      };
    }];
    return {
      restrict: 'E',
      scope: {
        display: '&',
        idType: '@',
        type: '@',
        page: '@',
        titleName: '@',
      },
      controller: controller,
      templateUrl: './templates/common/ShowMoreComponent.html',

      link: function ($scope, element, attrs) {
        $scope.showDonation = function () {
          $scope.showModal();
        };

      }
    };
  })
// show more end

function ModalService($rootScope, $q, $ionicModal) {
  function show(templateUrl, scope, animation) {
    var deferred = $q.defer();
    var modalScope = typeof scope !== 'undefined' ? scope : $rootScope.$new();

    $ionicModal.fromTemplateUrl(templateUrl, {
      scope: modalScope,
      animation: animation || 'slide-in-up'
    }).then(function (modal) {
      modalScope.modal = modal;

      modalScope.openModal = function () {
        modalScope.modal.show();
      };

      modalScope.closeModal = function () {
        modalScope.modal.hide();
      };

      modalScope.$on('modal.hidden', function (thisModal) {
        thisModal.currentScope.$destroy();
        thisModal.currentScope.modal.remove();
      });

      modalScope.modal.show();

      deferred.resolve(modalScope);
    });

    return deferred.promise;
  }

  return {
    show: show
  };
}
angular.module('starter')
  .factory('genericModalService', ModalService);
