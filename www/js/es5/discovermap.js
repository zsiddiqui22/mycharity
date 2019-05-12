"use strict";

angular.module('starter.discoverMap', []).controller('DiscoverCtrl', function ($scope, $rootScope, $stateParams, IMAGE_PATH, $state, $ionicNavBarDelegate, $ionicModal, $cordovaDatePicker, $ionicSideMenuDelegate, $timeout, APIService, STYLE_JSON, ionicToast) {
  $scope.isMap = true;
  $scope.search = "";
  $scope.autoFocusSearchInput = false;
  $scope.mapData = [];
  $scope.listData = [];
  $scope.count = false; //default count is 0 for number assign

  $scope.dataAvailable = true; //default infinite scroll is true

  $scope.objIdsByType = {
    orginizations: [],
    projects: [],
    challenges: [],
    users: []
  };
  var markerCluster = "";
  $scope.isMarketRefresh = false;
  var objData = {
    page: 0
  };

  $scope.toogleContent = function (value) {
    $scope.isMap = value;

    if (!$scope.isMap) {
      $scope.listData = [];
      objData.page = 1;
    } else {
      markers = []; //newly add for reset marker when screen map screen available

      $scope.count = false;
    }

    $scope.getSeacrh(true, true, true); //loader show or not, servercall ,clear object org, project, chalenges
  };

  $ionicSideMenuDelegate.canDragContent(false);
  $scope.imagePath = IMAGE_PATH;
  $scope.discover = {};
  $scope.discover.orginization = true;
  $scope.discover.project = true;
  $scope.discover.challenge = true;
  $scope.discover.hero = true;
  $rootScope.isNavVisible = false;
  var map = "";
  var markers = [];
  var currentLat = "";
  var currentLng = "";
  var bounds = "";
  var southWest = "";
  var northEast = "";

  $scope.showSearch = function () {
    $rootScope.isNavVisible = !$rootScope.isNavVisible;
    $scope.autoFocusSearchInput = !$scope.autoFocusSearchInput;
  };

  if ($stateParams.search == "true") {
    $scope.showSearch();
  }

  $scope.getSeacrh = function (isloader, serverCall, resetMarker) {
    //reload marker property
    objData.page = 1;
    var obj = {};
    obj.latitude = currentLat;
    obj.longitude = currentLng;
    obj.type = ribbonFilter();

    if (resetMarker) {
      $scope.objIdsByType = {
        orginizations: [],
        projects: [],
        challenges: [],
        users: []
      };
      markerCluster.clearMarkers();
    }

    $scope.isMarketRefresh = resetMarker;

    if (angular.element(document.getElementById('disconver-input'))[0]) {
      obj.search = angular.element(document.getElementById('disconver-input'))[0].value;
      $scope.listData = [];
    }

    getCordinates(obj, isloader, $scope.isMap, serverCall, $scope.objIdsByType);
  };

  function ribbonFilter() {
    var typeArray = [];

    if ($scope.discover.orginization) {
      typeArray.push('orginization');
    }

    if ($scope.discover.project) {
      typeArray.push('project');
    }

    if ($scope.discover.challenge) {
      typeArray.push('challenge');
    }

    if ($scope.discover.hero) {
      typeArray.push('hero');
    }

    return typeArray.join();
  }

  $scope.initMap = function () {
    map = new google.maps.Map(document.getElementById('discover-map'), {
      zoom: 10,
      center: {
        lat: 51.5285582,
        lng: -0.2416815
      },
      fullscreenControl: false,
      zoomControl: false,
      mapTypeControlOptions: {
        mapTypeIds: []
      },
      styles: STYLE_JSON
    });

    if ($scope.isMap) {
      markerCluster = new MarkerClusterer(map, null, {
        imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
      });
    }

    google.maps.event.addListener(map, 'zoom_changed', function () {
      var obj = {};
      obj.latitude = currentLat;
      obj.longitude = currentLng;
      obj.type = ribbonFilter();
      $scope.isMarketRefresh = false;

      if (angular.element(document.getElementById('disconver-input'))[0]) {
        obj.search = angular.element(document.getElementById('disconver-input'))[0].value;
      }

      obj = mapShowOrNot(obj, map);
      $scope.mapGlobalBounds = obj;
      getCordinates(obj, false, $scope.isMap, true, $scope.objIdsByType); //obj, loader show, map or list, server call, objects by type and id's
    });
    google.maps.event.addListener(map, 'dragend', function () {
      var obj = {};
      obj.latitude = currentLat;
      obj.longitude = currentLng;
      obj.type = ribbonFilter();
      $scope.isMarketRefresh = false;

      if (angular.element(document.getElementById('disconver-input'))[0]) {
        obj.search = angular.element(document.getElementById('disconver-input'))[0].value;
      }

      obj = mapShowOrNot(obj, map);
      $scope.mapGlobalBounds = obj;
      getCordinates(obj, false, $scope.isMap, true, $scope.objIdsByType); //obj, loader show, map or list, server call, objects by type and id's
    });
  };

  function reloadMarkers(data) {
    //data.length == 0 &&
    if ($scope.isMarketRefresh && angular.element(document.getElementById('disconver-input'))[0] && angular.element(document.getElementById('disconver-input'))[0].value) {
      for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
      }

      markers = [];
      $scope.objIdsByType = {
        orginizations: [],
        projects: [],
        challenges: [],
        users: []
      };
      var _objData = {};
      _objData.search = angular.element(document.getElementById('disconver-input'))[0].value;
      _objData.type = ribbonFilter();
      APIService.getSearchCount(_objData).then(function (response) {
        if (response.data.total_count == 0) {
          $scope.toastShortBottomLong("'".concat(response.data.total_count, "' results found. Change your search result."));
        } else {
          $scope.toastShortBottomLong("'".concat(response.data.total_count, "' results found. Zoom out to see all results."));
        }
      }, function (error) {});
    }

    for (var i = 0; i < markers.length; i++) {
      if (!$scope.discover.orginization && markers[i].get('type') == 'orginization') {
        markers[i].setMap(null);
      }

      if (!$scope.discover.project && markers[i].get('type') == 'project') {
        markers[i].setMap(null);
      }

      if (!$scope.discover.challenge && markers[i].get('type') == 'challenge') {
        markers[i].setMap(null);
      }

      if (!$scope.discover.hero && markers[i].get('type') == 'hero') {
        markers[i].setMap(null);
      }
    }
  }

  function addClickHandler(theMarker) {
    google.maps.event.addListener(theMarker, 'click', function () {
      if (theMarker.get('type') === 'orginization') {
        $state.go('app.profile', {
          'id': theMarker.get('id'),
          'redirect': 'app.discover'
        });
      } else if (theMarker.get('type') === 'project') {
        $state.go('app.project-profile', {
          'id': theMarker.get('id')
        });
      } else if (theMarker.get('type') === 'challenge') {
        $state.go('app.challenge-profile', {
          'id': theMarker.get('id')
        });
      } else if (theMarker.get('type') === 'hero') {
        $state.go('app.hero-profile', {
          'id': theMarker.get('id')
        });
      }
    });
  }

  $scope.gotoProfile = function (data) {
    if (data.type === 'orginization') {
      $state.go('app.profile', {
        'id': data.id,
        'redirect': 'app.discover'
      });
    } else if (data.type === 'project') {
      $state.go('app.project-profile', {
        'id': data.id
      });
    } else if (data.type === 'challenge') {
      $state.go('app.challenge-profile', {
        'id': data.id
      });
    } else if (data.type === 'hero') {
      $state.go('app.hero-profile', {
        'id': data.id
      });
    }
  };

  function setByType(data) {
    data.forEach(function (el) {
      switch (el.type) {
        case 'hero':
          $scope.objIdsByType.users.push(el.id);
          break;

        case 'orginization':
          $scope.objIdsByType.orginizations.push(el.id);
          break;

        case 'project':
          $scope.objIdsByType.projects.push(el.id);
          break;

        case 'challenge':
          $scope.objIdsByType.challenges.push(el.id);
          break;
      }
    });
  }

  function setMarkers(data) {
    reloadMarkers(data);
    setByType(data);

    for (var i = 0; i < data.length; i++) {
      var latLng = new google.maps.LatLng(parseFloat(data[i].latitude), parseFloat(data[i].longitude));
      var marker = new google.maps.Marker({
        position: latLng,
        id: data[i].id,
        type: data[i].type,
        map: map,
        icon: $scope.getMapIcon(data[i].type),
        title: data[i].name
      });
      markers.push(marker);
      addClickHandler(marker);
    }

    markerCluster.addMarkers(markers);
  }

  function mapShowOrNot(obj, map) {
    bounds = map.getBounds();
    southWest = bounds.getSouthWest();
    northEast = bounds.getNorthEast();
    obj.ne_lat = bounds.getNorthEast().lat();
    obj.ne_lon = bounds.getNorthEast().lng();
    obj.sw_lat = bounds.getSouthWest().lat();
    obj.sw_lon = bounds.getSouthWest().lng();
    obj.currentLat = map.getCenter().lat();
    obj.currentLng = map.getCenter().lng();
    currentLat = map.getCenter().lat();
    currentLng = map.getCenter().lng();
    return obj;
  }

  $scope.onScroll = function () {
    var obj = {};
    obj.latitude = currentLat;
    obj.longitude = currentLng;
    obj.type = ribbonFilter();

    if (angular.element(document.getElementById('disconver-input'))[0]) {
      obj.search = angular.element(document.getElementById('disconver-input'))[0].value;
    }

    getCordinates(obj, true, $scope.isMap, true);
  };

  function isMapOrList(obj, isloader, isMap, serverCall, objIdsByType) {
    isloader ? $scope.showLoader() : null;

    if (isMap && serverCall) {
      obj.ids = objIdsByType; //id's by types

      APIService.getDiscover(obj).then(function (response) {
        setMarkers(response.data);
        $scope.hideLoader();
      }, function (error) {
        $scope.hideLoader();
        ionicToast.show(error.data.message, 'middle', false, 1000);
      });
    } else if (!isMap && serverCall) {
      $scope.dataAvailable = false;
      obj.page = objData.page++; //page state

      obj.limit = 10; //record limit

      APIService.getSeacrh(obj).then(function (response) {
        response.data.forEach(function (element) {
          $scope.listData.push(element);
        });
        $scope.count = response.data.length > 0 ? true : false;
        $scope.hideLoader();
        $scope.$broadcast('scroll.infiniteScrollComplete');
      }, function (error) {
        ionicToast.show(error.data.message, 'middle', false, 1000);
        $scope.hideLoader();
      });
    }
  }

  $scope.mapGlobalBounds = {};

  function getAlreadySaveBounds(obj) {
    obj.ne_lat = $scope.mapGlobalBounds.ne_lat;
    obj.ne_lon = $scope.mapGlobalBounds.ne_lon;
    obj.sw_lat = $scope.mapGlobalBounds.sw_lat;
    obj.sw_lon = $scope.mapGlobalBounds.sw_lon;
    currentLat = $scope.mapGlobalBounds.currentLat;
    currentLng = $scope.mapGlobalBounds.currentLng;
    return obj;
  }

  function getCordinates(obj, isloader, isMap, serverCall, objIdsByType) {
    if (!map.getBounds()) {
      google.maps.event.addListenerOnce(map, 'idle', function () {
        obj = mapShowOrNot(obj, map);
        $scope.mapGlobalBounds = obj;
        isMapOrList(obj, isloader, isMap, serverCall, objIdsByType);
      });
    } else {
      obj = getAlreadySaveBounds(obj);
      isMapOrList(obj, isloader, isMap, serverCall, objIdsByType);
    }
  }

  $scope.filterOrg = function (data) {
    $scope.orginization = data;
    $scope.getMapFilter();
  };

  $scope.getMapFilter = function () {
    var obj = {};
    obj.latitude = map.getCenter().lat();
    obj.longitude = map.getCenter().lng();
    currentLat = map.getCenter().lat();
    currentLng = map.getCenter().lng();
    obj.type = ribbonFilter();

    if (angular.element(document.getElementById('disconver-input'))[0]) {
      obj.search = angular.element(document.getElementById('disconver-input'))[0].value;
    }

    objData.page = 1;
    $scope.listData = [];

    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }

    markers = [];
    $scope.objIdsByType = {
      orginizations: [],
      projects: [],
      challenges: [],
      users: []
    };
    markerCluster.clearMarkers();
    getCordinates(obj, true, $scope.isMap, true, $scope.objIdsByType);
  };

  function createGuestuser() {
    $scope.showLoader();
    APIService.createGuest().then(function (response) {
      window.localStorage.setItem('mch_mob_data', JSON.stringify(response.data));
      $rootScope.role = JSON.parse(window.localStorage.mch_mob_data).role;
      $rootScope.image = $scope.imagePath + JSON.parse(localStorage.mch_mob_data).image;
      $rootScope.user_name = JSON.parse(localStorage.mch_mob_data).name;
      $rootScope.user_email = JSON.parse(localStorage.mch_mob_data).email;
      var obj = {};
      obj.latitude = 51.5285582;
      obj.longitude = -0.2416815;
      currentLat = 51.5285582;
      currentLng = -0.2416815;
      obj.type = ribbonFilter();
      getCordinates(obj, true, $scope.isMap, true);
      $scope.hideLoader();
    }, function (error_response) {
      $scope.hideLoader();
    });
  }

  ;

  $scope.supportedType = function (data) {
    var index = $scope.listData.indexOf($scope.listData.filter(function (i) {
      return i.id == data.id && i.type == data.type;
    })[0]);
    $scope.listData[index].supported = true;
    $scope.showLoader();
    var obj = {};
    obj.id = data.id;
    obj.type = data.type;
    APIService.supperted(obj).then(function (response) {
      $scope.hideLoader();
    }, function (error) {
      ionicToast.show(error.data.message, 'middle', false, 1000);
      $scope.hideLoader();
    });
  };

  $scope.usSupportedType = function (data) {
    var index = $scope.listData.indexOf($scope.listData.filter(function (i) {
      return i.id == data.id && i.type == data.type;
    })[0]);
    $scope.listData[index].supported = false;
    $scope.showLoader();
    var obj = {};
    obj.id = data.id;
    obj.type = data.type;
    APIService.usSupperted(obj).then(function (response) {
      $scope.hideLoader();
    }, function (error) {
      ionicToast.show(error.data.message, 'middle', false, 1000);
      $scope.hideLoader();
    });
  };

  $scope.$on("$ionicView.afterEnter", function (scopes, states) {
    $timeout(function () {
      $scope.initMap();

      if (!window.localStorage.mch_mob_data) {
        createGuestuser();
      } else {
        var obj = {};
        obj.latitude = 51.5285582;
        obj.longitude = -0.2416815;
        currentLat = 51.5285582;
        currentLng = -0.2416815;
        obj.type = ribbonFilter();
        getCordinates(obj, true, $scope.isMap, true, $scope.objIdsByType);
      }
    }, 500);
  });
});