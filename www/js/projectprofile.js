angular.module('starter.projectProfileOrg', ['ionic', 'ionic-timepicker']).run(['$anchorScroll', function($anchorScroll) {
  $anchorScroll.yOffset = 50;   // always scroll by 50 extra pixels
}])
  .controller('ProjectProfileCtrl', function ($scope,$window,BASE_URL,Upload, $rootScope, $stateParams, $state, $ionicNavBarDelegate, $ionicModal, APIService, ATTACH_PATH, IMAGE_PATH, $timeout, $ionicActionSheet, $location, $anchorScroll, $ionicSideMenuDelegate) {

    $ionicSideMenuDelegate.canDragContent(false);
    $scope.textToCopy = $location.absUrl();
    $scope.success = function () {
      $scope.toastShortCenter('Copied');
    };
    $scope.fail = function (err) {
      $scope.toastShortCenter('Error!' + err);
      console.error('Error!', err);
    };
    $scope.objData = {
      id: $stateParams.id,
      type: "project",
    };
    
    $scope.imagePath = IMAGE_PATH;
    $scope.attachPath = ATTACH_PATH;
    $scope.profile = {};
    $scope.profile.btnHeor = true;
    $scope.profile.btnOrganizations = false;
    $scope.profile.btnCHal = false;

    $scope.profile.image = "";
    $scope.profile.name = "";
    $scope.profile.address = "";
    $scope.profile.fund_target = "";
    $scope.profile.max_donation = "";
    $scope.profile.totaldonation = "";
    $scope.profile.raisdonation = "";
    $scope.profile.donation_createddate = "";
    $scope.profile.donation_enddate = "";
    $scope.profile.trophy = "";
    $scope.profile.desc = "";
    $scope.profile.attachments = [];
    $scope.profile.heros = [];
    $scope.profile.organizations = [];
    $scope.profile.challenges = [];
    $scope.profile.comment = [];
    $scope.profile.replies = [];
    $scope.profile.isEditable = false;
    $scope.profile.readMore = true;
    $scope.attachfile = null; // for comment file
    
    $scope.profile.supporters = 0;
    $scope.profile.donors = 0;
    $scope.profile.Celebrities = 0;

    $scope.readMore = function () {
      $scope.profile.readMore = false;
    }

    $scope.addLike = function () {

    }

    $scope.removeAttachFile = function() {
      $scope.attachfile = null;
    }


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


    $scope.attachmentsFile = function (files, errFiles) {

      console.log(files);

      $scope.fileFormatError(errFiles);
      if (files && files.length) {
        let indexer = 0;
        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          if (!file.$error) {
            let token = JSON.parse(window.localStorage.mch_mob_data).access_token;
            Upload.upload({
              // url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
              url: BASE_URL + '/upload-comment-attachment',// '/upload-attachment',
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
                orignalfile = ['https://mycharityhero.co.uk/MyCharityHero/public/comments-attachments/' + resp.data.filename, 'pdf'];
              } else if (files[indexer].type.includes('video')) {
                // orignalfile = [files[indexer], 'video'];
                orignalfile = ['https://mycharityhero.co.uk/MyCharityHero/public/comments-attachments/' + resp.data.filename, 'video'];
              } else {
                // try to do that thing
                orignalfile = ['https://mycharityhero.co.uk/MyCharityHero/public/comments-attachments/' + resp.data.filename, 'img'];
                //orignalfile = [ATTACH_PATH + resp.data.filename, 'img'];
                // orignalfile = [files[indexer], 'img'];
              }

              $scope.attachfile = orignalfile[0];
              $scope.imageProgress = false;

              //$scope.attachfile = orignalfile;

              console.log(orignalfile);
              console.log(ATTACH_PATH);

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

    $scope.deletCommentReply = function (itemParentId , item) {
      let index = $scope.profile.comment.map(function (e) {
        return e.id;
      }).indexOf(itemParentId);

      let childIndex = $scope.profile.comment[index].replies.map(function (e) {
        return e.id;
      }).indexOf(item.id);

      let userId = JSON.parse(window.localStorage.mch_mob_data).id;
      let commentUserId =  item.user_id;

      console.log('userId ' + userId);
      console.log('commentUserId '+ commentUserId);
      
      if(userId == commentUserId){
      $scope.showLoader();    
      APIService.removeComments(item.id).then(function (response) {
          $scope.hideLoader();
          
          $scope.profile.comment[index].replies.splice(childIndex, 1);
        },
        function (error_response) {
          $scope.toastShortCenter(error_response.message);
          $scope.hideLoader();
        });
          return true;
        
        }else{
          $scope.toastShortCenter("You cannot delete this comment!");
        }
    }

    $scope.deletComment = function (item) {
      let index = $scope.profile.comment.map(function (e) {
        return e.id;
      }).indexOf(item.id);

      let userId = JSON.parse(window.localStorage.mch_mob_data).id;
      let commentUserId =  item.user_id;

      console.log('userId ' + userId);
      console.log('commentUserId '+ commentUserId);
      
      if(userId == commentUserId){
      $scope.showLoader();    
      APIService.removeComments(item.id).then(function (response) {
          $scope.hideLoader();
          
          $scope.profile.comment.splice(index, 1);
        },
        function (error_response) {
          $scope.toastShortCenter(error_response.message);
          $scope.hideLoader();
        });
          return true;
        
        }else{
          $scope.toastShortCenter("You cannot delete this comment!");
        }
      }

      $scope.autoExpand = function(e) {
        var element = typeof e === 'object' ? e.target : document.getElementById(e);
    		var scrollHeight = element.scrollHeight -8; // replace 60 by the sum of padding-top and padding-bottom
        element.style.height =  scrollHeight + "px";  
        if(scrollHeight >= 83){
          element.style.height = '83px';
        }
    };

    function expand() {
      $scope.autoExpand('comment_box');
    }
      

    $scope.reply_to_id = null;
    $scope.getReplyId = function ($event,getId) {
      
      $scope.reply_to_id = getId;
      console.log(getId);

      var newHash = 'comment-' + $scope.reply_to_id;
      if ($location.hash() !== newHash) {
        // set the $location.hash to `newHash` and
        // $anchorScroll will automatically scroll to it
        $location.hash('comment-' + $scope.reply_to_id);
      } else {
        // call $anchorScroll() explicitly,
        // since $location.hash hasn't changed
        $anchorScroll();
      }
      
      setTimeout(()=>{
        document.getElementById('comment_box').focus();
      },400);

    }

    $scope.commentSend = function (comment) {
      $scope.showLoader();
      var obj = {};
      obj.user = {};
      obj.user_id = JSON.parse(window.localStorage.mch_mob_data).id;
      obj.comment = comment;
      obj.user.name = JSON.parse(window.localStorage.mch_mob_data).name;
      obj.user.image = JSON.parse(localStorage.mch_mob_data).image;
      obj.created_at = new Date();
      obj.id = $stateParams.id;  // page id
      obj.user.id = APIService.getId();
      obj.type = 'project';
      obj.reply_to = $scope.reply_to_id;
      obj.attachment = $scope.attachfile;


      console.log($scope.reply_to_id);
      console.log(obj);
      //$scope.profile.comment[]  .push(obj);
      
      if(  obj.reply_to != null &&  obj.reply_to != undefined ){

        let index = $scope.profile.comment.map(function (e) {
          return e.id;
        }).indexOf(obj.reply_to);

        $scope.profile.comment[index].replies.push(obj);
        

      }else{
        $scope.profile.comment.push(obj);
      }

      APIService.addComment(obj).then(function (response) {


          $scope.profile.reply = "";
          $scope.attachfile = null;
          $scope.hideLoader();
          var objDiv = document.getElementById('scrollDiv');
          objDiv.scrollTop = objDiv.scrollHeight;
          //$scope.profile.comment.splice(-1, 1);

          obj = {};
          obj.user = {};
          obj.user_id = JSON.parse(window.localStorage.mch_mob_data).id;
          obj.comment = response.data.comment;
          obj.user.name = JSON.parse(window.localStorage.mch_mob_data).name;
          obj.created_at = new Date();
          obj.id = response.data.id;
          obj.user.id = APIService.getId();
          obj.from = response.data.from;
          obj.attachment = response.data.attachment;

          //$scope.reply_to_id = null; // Update

          obj.user.image = JSON.parse(localStorage.mch_mob_data).image;

          //$scope.profile.comment.push(obj);
          if(  response.data.reply_to != null &&  response.data.reply_to != undefined ){

            let index = $scope.profile.comment.map(function (e) {
              return e.id;
            }).indexOf(obj.reply_to);
    
            $scope.profile.comment[index].replies.push(obj);
    
          }else{
            $scope.profile.comment.push(obj);
          }

          
          console.log('commentable_id '+commentable_id);
         

        },
        function (error_response) {
          $scope.hideLoader();
          $scope.toastShortCenter(error_response);
          $scope.profile.comment.splice(-1, 1);
          
          setTimeout(function(){
            $location.hash('comment-' + $scope.reply_to_id);
            $anchorScroll();
            console.log($scope.reply_to_id);
            $scope.reply_to_id = null;
          },1000);

        });
    }

    function defaultAssociate() {
      $scope.asscociate = {
        challanges: [],
        heros: [],
        organizations: [],
      };
    }
    defaultAssociate();

    $scope.challenges = '';
    $scope.heros = '';
    $scope.organizations = '';


    function getChallenges() {
      $scope.showLoader();
      APIService.getChallenges().then(function (response) {
          $scope.hideLoader();
          $scope.challenges = response.data;
        },
        function (error) {
          $scope.hideLoader();
        });
    };

    function getOrganizations() {
      $scope.showLoader();
      APIService.getOrganization().then(function (response) {
          $scope.hideLoader();
          $scope.organizations = response.data;
        },
        function (error) {
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
          $scope.hideLoader();
        });
    };

    $scope.addAssociate = function () {
      $scope.showLoader();

      let obj = {};
      obj.organizations = $scope.asscociate.organizations;
      obj.heroes = $scope.asscociate.heros;
      obj.challenges = $scope.asscociate.challanges;
      obj.id = $stateParams.id;
      obj.type = 'pro';
      APIService.addAssociate(obj).then(function (response) {
          $scope.associationmodal.hide();
          $state.reload();
          $timeout(function () {
            defaultAssociate();
          }, 1000);

          $scope.hideLoader();
        },
        function (error_response) {
          $scope.associationmodal.hide();
          $scope.toastShortCenter(error_response);
          $scope.hideLoader();
          defaultAssociate();
        });
    };



    function getProjectProfile(id) {
      $scope.showLoader();
      APIService.getProjectProfile(id).then(function (response) {
          $scope.item = response.data;
          let obj = response.data;
          $scope.profile.image = obj.image;
          $scope.profile.name = obj.name;
          $scope.profile.support = obj.supported;

          $scope.profile.address = obj.address;
          $scope.profile.fund_target = obj.funds_target;
          $scope.profile.max_donation = obj.max_donation;
          $scope.profile.totaldonation = obj.total_donation;
          $scope.profile.raisdonation = obj.funds_raised;
          $scope.profile.donation_createddate = obj.created_at;
          $scope.profile.donation_enddate = obj.end_date;
          $scope.profile.trophy = "";
          $scope.profile.desc = obj.description;
          $scope.profile.heros = obj.heroes;
          $scope.profile.currency = obj.currency ? obj.currency : 'GBP';
          $scope.profile.isEditable = obj.isEditable;

          $scope.profile.supporters = obj.supporters;
          $scope.profile.donors = obj.donors;
          $scope.profile.Celebrities = obj.Celebrities;

          $scope.isAttachment=obj.attachments.length > 0 ? true : false; 
          obj.attachments.forEach(el => {
            $scope.profile.attachments.push([ATTACH_PATH + el.name, el.type]);
          });

          $timeout(function () {
            $scope.raise_amount_width = angular.element(document.getElementsByClassName('pro_width')).prop('offsetWidth') + 63;
          }, 5);
          if (parseInt($scope.profile.raisdonation) >= parseInt($scope.profile.fund_target)) {
            $scope.calulated_progressbar_raise = 100;
            $scope.calulated_progressbar_max = $scope.calulated_progressbar_raise / 2;

          } else {
            $scope.calulated_progressbar_raise = Math.ceil(parseInt($scope.profile.raisdonation) / parseInt($scope.profile.fund_target) * 100);
            $scope.calulated_progressbar_max = $scope.calulated_progressbar_raise / 2;

          }

          $scope.profile.organizations = obj.organization;
          $scope.profile.challenges = obj.challenges;
          $scope.profile.comment = obj.comments;
          $scope.profile.replies = [];
          
       
          $scope.hideLoader();

        },
        function (error) {
          $scope.hideLoader();
        });
    }

    function createGuestuser(getProjectProfile, getChallenges, getHeros, getOrganizations) {
      $scope.showLoader();
      APIService.createGuest().then(function (response) {

          window.localStorage.setItem('mch_mob_data', JSON.stringify(response.data));
          $rootScope.role = JSON.parse(window.localStorage.mch_mob_data).role;
          getProjectProfile($stateParams.id);
          getChallenges();
          getHeros();
          getOrganizations();
          //  getCurrency($stateParams.id);
          $scope.hideLoader();
        },
        function (error_response) {
          // $scope.toastShortCenter(error_response);
          $scope.hideLoader();
        });
    }

    if (!window.localStorage.mch_mob_data) {
      createGuestuser(getProjectProfile, getChallenges, getHeros, getOrganizations);
    } else {
      getProjectProfile($stateParams.id);
      getChallenges();
      getHeros();
      getOrganizations();
      //  getCurrency($stateParams.id);
    }
    // getProjectProfile($stateParams.id);


    $scope.gotoEdit = function () {
      $state.go('app.projectedit', {
        'id': $stateParams.id
      });
    };
    $scope.gotoCommentProfile = function (id) {
      $state.go('app.hero-profile', {
        'id': id
      });
    };
    $scope.goBack = function () {
      $ionicHistory.goBack();

    };

    $scope.onHold = function (item) {
      if (item.user_id != JSON.parse(localStorage.mch_mob_data).id) {
        return;
      }
      var hideSheet = $ionicActionSheet.show({
        buttons: [{
          text: '<b class="red">Delete</b>'
        }],
        titleText: 'Action',
        cancelText: 'Cancel',
        cancel: function () {
          // add cancel code..
        },
        buttonClicked: function (buttonIndex) {
          let index = $scope.profile.comment.map(function (e) {
            return e.id;
          }).indexOf(item.id);

          $scope.showLoader();
          APIService.removeComments(item.id).then(function (response) {
              $scope.hideLoader();
              $scope.profile.comment.splice(index, 1);
            },
            function (error_response) {
              $scope.toastShortCenter(error_response);
              $scope.hideLoader();
            });
          return true;
        }
      });

    };

    $scope.supportedType = function () {
      $scope.profile.support = true;

      $scope.showLoader();
      let obj = {};
      obj.id = $stateParams.id;
      obj.type = "project";
      APIService.supperted(obj).then(function (response) {
          $scope.hideLoader();
        },
        function (error) {
          $scope.hideLoader();
        });
    };
    $scope.usSupportedType = function () {
      $scope.profile.support = false;

      $scope.showLoader();
      let obj = {};
      obj.id = $stateParams.id;
      obj.type = "project";
      APIService.usSupperted(obj).then(function (response) {
          $scope.hideLoader();
        },
        function (error) {
          $scope.hideLoader();
        });
    };

    $ionicModal.fromTemplateUrl('templates/associations.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.associationmodal = modal;

      // $scope.closeModalNotSave = function () {
      //   $scope.associationmodal.hide();
      // };
    });

    $ionicModal.fromTemplateUrl('templates/commentreply.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.replyModal = modal;

      // $scope.closeModalNotSave = function () {
      //   $scope.associationmodal.hide();
      // };
      $scope.modalCommentReplyShow = function () {
        $scope.replyModal.show();
          };
    
       $scope.modalCommentReplyHide = function () {
        $scope.replyModal.hide();
      };
    });
    

  })





  