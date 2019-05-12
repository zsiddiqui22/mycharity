"use strict";

angular.module('starter.services', ['ngCordova']).factory("APIService", ['BASE_URL', '$http', function (BASE_URL, $http) {
  // window.localStorage.setItem('mch_mob_data', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImQxYjY2ZWJjOWY0ZTMxZmU4N2Q2M2Q4MmI4YzQyY2YyNGM4NGMxN2Y1M2VjNDM1OTJiZDMyYTM3NjEyZDM5MDJkNmI2MDAwYzAzZmE1YzFhIn0.eyJhdWQiOiI1IiwianRpIjoiZDFiNjZlYmM5ZjRlMzFmZTg3ZDYzZDgyYjhjNDJjZjI0Yzg0YzE3ZjUzZWM0MzU5MmJkMzJhMzc2MTJkMzkwMmQ2YjYwMDBjMDNmYTVjMWEiLCJpYXQiOjE1NDI2MTY3NjAsIm5iZiI6MTU0MjYxNjc2MCwiZXhwIjoxNTc0MTUyNzYwLCJzdWIiOiIxIiwic2NvcGVzIjpbXX0.fDT4e37CE4mYW6VKWKyPBd6D3bKqODQS42ClhrCgnfa8ZF33scClQvbTGlmf9RLu3FRIZ7aVv5ocS2pYYk2WwQ7rNVr7bhFfy_92mCsfPbyjDYlfTesqHsF41YBT8zKNKM66NXx0kirafTRxKzDsmBZ6E-DOXKzt8HAbiVJjMgwOhdHfYD02yLFz1IkHH0v0zzm2SdubX2bJZvzepvev2OE8MRsszNwBoy7mmYd9e_9IDBlwEBjmZsow57sZm1qXj-fvQR9K0kYSG9sL466JDCc-tyF0tynn2CIZu_3pJY7KIyeCN84Uxxov3fTTaxJT8AHnNVeXJt62TNKOCVrEJCRRzMbtX9rn9INJbwK88k9FRP-4C_OnUxBKQ_n_5LtPDz3eP6uD2DSYGxzCgIaMhrnA7DkSQwtuRQse0oY0Hc6GZft_33md9BFiv5_ufCDRFboKHbsMf_EXHWmTWUbI7Pajvm3nah2KNqrL64XS2UH6K3xZm4C-fBRIZv_uPbxcdq4u4h3XU6WV6MlwHF6HPdZkeSO7cP9s9Ru_qHLA-amDVI28tHu1BKt57c2Gb9pEEdAjaH4gCRbYGL_N8kNJdEgSqO1tXj9BcMQVKPLI2rP3nh293eb1qJ5UebtwDSgR4KPRXTaVYnWuvJTMlOAO2FE41I0LFq_TLbdSdvmUXiI');
  var factory = {};

  factory.getDiscover = function (obj) {
    var token = JSON.parse(window.localStorage.mch_mob_data).access_token;
    var url = "";

    if (obj.search) {
      url = BASE_URL + "/discover?latitude=".concat(obj.latitude, "&longitude=").concat(obj.longitude, "&type=").concat(obj.type, "&ne_lat=").concat(obj.ne_lat, "&ne_lon=").concat(obj.ne_lon, "&sw_lat=").concat(obj.sw_lat, "&sw_lon=").concat(obj.sw_lon, "&search=").concat(obj.search);
    } else {
      url = BASE_URL + "/discover?latitude=".concat(obj.latitude, "&longitude=").concat(obj.longitude, "&type=").concat(obj.type, "&ne_lat=").concat(obj.ne_lat, "&ne_lon=").concat(obj.ne_lon, "&sw_lat=").concat(obj.sw_lat, "&sw_lon=").concat(obj.sw_lon);
    }

    return $http.post(url, obj.ids, {
      headers: {
        'Authorization': "Bearer ".concat(token),
        'Accept': 'application/json'
      }
    });
  };

  factory.getOrganizationByType = function (obj) {
    var token = JSON.parse(window.localStorage.mch_mob_data).access_token;

    if (obj.type == "supported") {
      return $http.get(BASE_URL + "/get-organizations?limit=".concat(obj.limit, "&page=").concat(obj.page), {
        headers: {
          'Authorization': "Bearer ".concat(token),
          'Accept': 'application/json'
        }
      });
    } else {
      //type =own,suggested,past,supported
      return $http.get(BASE_URL + "/get-organizations?type=".concat(obj.type, "&limit=").concat(obj.limit, "&page=").concat(obj.page), {
        headers: {
          'Authorization': "Bearer ".concat(token),
          'Accept': 'application/json'
        }
      });
    }
  };

  factory.getProjectByType = function (obj) {
    var token = JSON.parse(window.localStorage.mch_mob_data).access_token;

    if (obj.type == "supported") {
      return $http.get(BASE_URL + "/get-projects?limit=".concat(obj.limit, "&page=").concat(obj.page), {
        headers: {
          'Authorization': "Bearer ".concat(token),
          'Accept': 'application/json'
        }
      });
    } else {
      //type =own,suggested,past,supported
      return $http.get(BASE_URL + "/get-projects?type=".concat(obj.type, "&limit=").concat(obj.limit, "&page=").concat(obj.page), {
        headers: {
          'Authorization': "Bearer ".concat(token),
          'Accept': 'application/json'
        }
      });
    }
  };

  factory.getChallengeByType = function (obj) {
    var token = JSON.parse(window.localStorage.mch_mob_data).access_token;

    if (obj.type == "supported") {
      return $http.get(BASE_URL + "/get-challenges?limit=".concat(obj.limit, "&page=").concat(obj.page), {
        headers: {
          'Authorization': "Bearer ".concat(token),
          'Accept': 'application/json'
        }
      });
    } else {
      //type =own,suggested,past,supported
      return $http.get(BASE_URL + "/get-challenges?type=".concat(obj.type, "&limit=").concat(obj.limit, "&page=").concat(obj.page), {
        headers: {
          'Authorization': "Bearer ".concat(token),
          'Accept': 'application/json'
        }
      });
    }
  };

  factory.getHeorByType = function (obj) {
    var token = JSON.parse(window.localStorage.mch_mob_data).access_token;
    return $http.get(BASE_URL + "/get-persons?type=".concat(obj.type, "&limit=").concat(obj.limit, "&page=").concat(obj.page), {
      headers: {
        'Authorization': "Bearer ".concat(token),
        'Accept': 'application/json'
      }
    });
  };

  factory.getProfile = function (id) {
    var token = JSON.parse(window.localStorage.mch_mob_data).access_token;
    return $http.get(BASE_URL + "/organization/".concat(id), {
      headers: {
        'Authorization': "Bearer ".concat(token),
        'Accept': 'application/json'
      }
    });
  };

  factory.getProfileProject = function (id) {
    var token = JSON.parse(window.localStorage.mch_mob_data).access_token;
    return $http.get(BASE_URL + "/project/".concat(id), {
      headers: {
        'Authorization': "Bearer ".concat(token),
        'Accept': 'application/json'
      }
    });
  };

  factory.getNotification = function (id) {
    var token = JSON.parse(window.localStorage.mch_mob_data).access_token;
    return $http.get(BASE_URL + "/notification", {
      headers: {
        'Authorization': "Bearer ".concat(token),
        'Accept': 'application/json'
      }
    });
  };

  factory.getProfileChallenge = function (id) {
    var token = JSON.parse(window.localStorage.mch_mob_data).access_token;
    return $http.get(BASE_URL + "/challenge/".concat(id), {
      headers: {
        'Authorization': "Bearer ".concat(token),
        'Accept': 'application/json'
      }
    });
  };

  factory.getHeroProfile = function (id) {
    var token = JSON.parse(window.localStorage.mch_mob_data).access_token;
    return $http.get(BASE_URL + "/user/".concat(id), {
      headers: {
        'Authorization': "Bearer ".concat(token),
        'Accept': 'application/json'
      }
    });
  };

  factory.getProjectProfile = function (id) {
    var token = JSON.parse(window.localStorage.mch_mob_data).access_token;
    return $http.get(BASE_URL + "/project/".concat(id), {
      headers: {
        'Authorization': "Bearer ".concat(token),
        'Accept': 'application/json'
      }
    });
  };

  factory.getChallangesProfile = function (id) {
    var token = JSON.parse(window.localStorage.mch_mob_data).access_token;
    return $http.get(BASE_URL + "/challenge/".concat(id), {
      headers: {
        'Authorization': "Bearer ".concat(token),
        'Accept': 'application/json'
      }
    });
  };

  factory.addPayment = function (obj) {
    var token = JSON.parse(window.localStorage.mch_mob_data).access_token;
    return $http.post(BASE_URL + "/credit-card", obj, {
      headers: {
        'Authorization': "Bearer ".concat(token),
        'Accept': 'application/json'
      }
    });
  };

  factory.getCards = function () {
    var token = JSON.parse(window.localStorage.mch_mob_data).access_token;
    return $http.get(BASE_URL + "/credit-card", {
      headers: {
        'Authorization': "Bearer ".concat(token),
        'Accept': 'application/json'
      }
    });
  };

  factory.donateOrg = function (obj) {
    var token = JSON.parse(window.localStorage.mch_mob_data).access_token;
    return $http.post(BASE_URL + "/donate", obj, {
      headers: {
        'Authorization': "Bearer ".concat(token),
        'Accept': 'application/json'
      }
    });
  };

  factory.donateChal = function (obj) {
    var token = JSON.parse(window.localStorage.mch_mob_data).access_token;
    return $http.post(BASE_URL + "/donate", obj, {
      headers: {
        'Authorization': "Bearer ".concat(token),
        'Accept': 'application/json'
      }
    });
  };

  factory.donatePro = function (obj) {
    var token = JSON.parse(window.localStorage.mch_mob_data).access_token;
    return $http.post(BASE_URL + "/donate", obj, {
      headers: {
        'Authorization': "Bearer ".concat(token),
        'Accept': 'application/json'
      }
    });
  };

  factory.createGuest = function () {
    return $http.post(BASE_URL + "/guest", {
      headers: {
        'Accept': 'application/json'
      }
    });
  };

  factory.register = function (obj) {
    var token = JSON.parse(window.localStorage.mch_mob_data).access_token;
    return $http.post(BASE_URL + "/signup", obj, {
      headers: {
        'Authorization': "Bearer ".concat(token),
        'Accept': 'application/json'
      }
    });
  };

  factory.login = function (obj) {
    return $http.post(BASE_URL + "/login", obj, {
      headers: {
        'Accept': 'application/json'
      }
    });
  };

  factory.addOrg = function (obj) {
    var token = JSON.parse(window.localStorage.mch_mob_data).access_token;
    return $http.post(BASE_URL + "/organization", obj, {
      headers: {
        'Authorization': "Bearer ".concat(token),
        'Accept': 'application/json'
      }
    });
  };

  factory.addProject = function (obj) {
    var token = JSON.parse(window.localStorage.mch_mob_data).access_token;
    return $http.post(BASE_URL + "/project", obj, {
      headers: {
        'Authorization': "Bearer ".concat(token),
        'Accept': 'application/json'
      }
    });
  };

  factory.addChallenge = function (obj) {
    var token = JSON.parse(window.localStorage.mch_mob_data).access_token;
    return $http.post(BASE_URL + "/challenge", obj, {
      headers: {
        'Authorization': "Bearer ".concat(token),
        'Accept': 'application/json'
      }
    });
  };

  factory.getProjects = function () {
    var token = JSON.parse(window.localStorage.mch_mob_data).access_token;
    return $http.get(BASE_URL + "/project", {
      headers: {
        'Authorization': "Bearer ".concat(token),
        'Accept': 'application/json'
      }
    });
  };

  factory.getChallenges = function () {
    var token = JSON.parse(window.localStorage.mch_mob_data).access_token;
    return $http.get(BASE_URL + "/challenge", {
      headers: {
        'Authorization': "Bearer ".concat(token),
        'Accept': 'application/json'
      }
    });
  };

  factory.getDonarList = function (id, type) {
    var token = JSON.parse(window.localStorage.mch_mob_data).access_token;

    if (type === 'organization') {
      return $http.get(BASE_URL + "/get-organization-donars/".concat(id), {
        headers: {
          'Authorization': "Bearer ".concat(token),
          'Accept': 'application/json'
        }
      });
    } else if (type === 'challenge') {
      return $http.get(BASE_URL + "/get-challenge-donars/".concat(id), {
        headers: {
          'Authorization': "Bearer ".concat(token),
          'Accept': 'application/json'
        }
      });
    } else if (type === 'project') {
      return $http.get(BASE_URL + "/get-project-donars/".concat(id), {
        headers: {
          'Authorization': "Bearer ".concat(token),
          'Accept': 'application/json'
        }
      });
    }
  };

  factory.getHeros = function () {
    var token = JSON.parse(window.localStorage.mch_mob_data).access_token;
    return $http.get(BASE_URL + "/heroes", {
      headers: {
        'Authorization': "Bearer ".concat(token),
        'Accept': 'application/json'
      }
    });
  };

  factory.getOrganization = function () {
    var token = JSON.parse(window.localStorage.mch_mob_data).access_token;
    return $http.get(BASE_URL + "/organizations", {
      headers: {
        'Authorization': "Bearer ".concat(token),
        'Accept': 'application/json'
      }
    });
  };

  factory.updateOrg = function (obj) {
    var token = JSON.parse(window.localStorage.mch_mob_data).access_token;
    return $http.put(BASE_URL + "/organization/".concat(obj.id), obj, {
      headers: {
        'Authorization': "Bearer ".concat(token),
        'Accept': 'application/json'
      }
    });
  };

  factory.getAssociates = function (obj) {
    var token = JSON.parse(window.localStorage.mch_mob_data).access_token;
    var url = "";

    if (obj.search) {
      url = BASE_URL + "/associates/".concat(obj.id, "?id_type=").concat(obj.idType, "&type=").concat(obj.type, "&limit=").concat(obj.limit, "&page=").concat(obj.page, "&search=").concat(obj.search);
    } else {
      url = BASE_URL + "/associates/".concat(obj.id, "?id_type=").concat(obj.idType, "&type=").concat(obj.type, "&limit=").concat(obj.limit, "&page=").concat(obj.page);
    }

    return $http.get(url, {
      headers: {
        'Authorization': "Bearer ".concat(token),
        'Accept': 'application/json'
      }
    });
  };

  factory.updateProject = function (obj) {
    var token = JSON.parse(window.localStorage.mch_mob_data).access_token;
    return $http.put(BASE_URL + "/project/".concat(obj.id), obj, {
      headers: {
        'Authorization': "Bearer ".concat(token),
        'Accept': 'application/json'
      }
    });
  };

  factory.updateHero = function (obj) {
    var token = JSON.parse(window.localStorage.mch_mob_data).access_token;
    return $http.put(BASE_URL + "/user/".concat(obj.id), obj, {
      headers: {
        'Authorization': "Bearer ".concat(token),
        'Accept': 'application/json'
      }
    });
  };

  factory.updateChallenge = function (obj) {
    var token = JSON.parse(window.localStorage.mch_mob_data).access_token;
    return $http.put(BASE_URL + "/challenge/".concat(obj.id), obj, {
      headers: {
        'Authorization': "Bearer ".concat(token),
        'Accept': 'application/json'
      }
    });
  };

  factory.getNotification = function () {
    var token = JSON.parse(window.localStorage.mch_mob_data).access_token; // let token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjYwYmVhNmUyMjM1ZGJjNWYzMDM0MmYzY2ZiZTZjOGNjZjZkZDQ5MGZiZGY0ZTA0YjgxMzVmZGNkZjZlMGQ3MDExYTAyN2ZlMzVjMDRkZWE3In0.eyJhdWQiOiI1IiwianRpIjoiNjBiZWE2ZTIyMzVkYmM1ZjMwMzQyZjNjZmJlNmM4Y2NmNmRkNDkwZmJkZjRlMDRiODEzNWZkY2RmNmUwZDcwMTFhMDI3ZmUzNWMwNGRlYTciLCJpYXQiOjE1NDk1NTMzMTksIm5iZiI6MTU0OTU1MzMxOSwiZXhwIjoxNTgxMDg5MzE4LCJzdWIiOiIyNiIsInNjb3BlcyI6W119.gKVo4GFn4psILRFwDFM31cXzGiOGT9QDqGtJDB8bJ8YTs3kWRwDM7cr5xT08GMwOOJghPSiAhokPKmkHt73wnZA4VcOaroTpcqLggiltsXlrdpqoj95uBvhtX4WCQYgV1Qv1BqtoLb2kDtiLEC4Vqy5WHofYeLY8l7vFa4xuhAVsNlpedZLjd59AEpgUrRl6l_NCTtl4upZSFEh5oc4IWdcnrc6lmFiu_RMwo7uc3Byfoe4RonJsmhcvlA9c3cK44HNX4Kdd_hfEbp6Ir4kmnm3E2cdtIxj5aFJv1hJTqY9reiUghH_SvAKmiX3_lEf-ahC1qfQo7gs0XtCGf3HY-PkJjdeuCtlBlw_br5nmU-B_vPpEGpslhiSxvdzYXOYxGDw7PYovNJeD1Jkd2ruAATv8SWP7xiyRhmJdGlqwRI5_D7coFTXIWA3EpNvlI8k-0RHhXXXenx_xM9TKRWOAK3jLyHPsQHUnKwfZcwgDtVqx2VPk3WQtFIjjybGbvJcqCiYeay94iQAHASowLsyHu78dDim4WgG7SAjKjexC7CmVGVaR-YhNJ4tiE3GJNrA8rTZRJPFLDUIanYqXLWuVulZBGVZfMlz9WMqd-LpSbvsNMpnEjx6jt0AAedhhD5eNTyHshsz-GAjlhfw902PqJPcqp3NFZaSSEeQIqI00jXE';

    return $http.get(BASE_URL + "/notifications", {
      headers: {
        'Authorization': "Bearer ".concat(token),
        'Accept': 'application/json'
      }
    });
  };

  factory.updateNotification = function (obj) {
    var token = JSON.parse(window.localStorage.mch_mob_data).access_token; // let token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjYwYmVhNmUyMjM1ZGJjNWYzMDM0MmYzY2ZiZTZjOGNjZjZkZDQ5MGZiZGY0ZTA0YjgxMzVmZGNkZjZlMGQ3MDExYTAyN2ZlMzVjMDRkZWE3In0.eyJhdWQiOiI1IiwianRpIjoiNjBiZWE2ZTIyMzVkYmM1ZjMwMzQyZjNjZmJlNmM4Y2NmNmRkNDkwZmJkZjRlMDRiODEzNWZkY2RmNmUwZDcwMTFhMDI3ZmUzNWMwNGRlYTciLCJpYXQiOjE1NDk1NTMzMTksIm5iZiI6MTU0OTU1MzMxOSwiZXhwIjoxNTgxMDg5MzE4LCJzdWIiOiIyNiIsInNjb3BlcyI6W119.gKVo4GFn4psILRFwDFM31cXzGiOGT9QDqGtJDB8bJ8YTs3kWRwDM7cr5xT08GMwOOJghPSiAhokPKmkHt73wnZA4VcOaroTpcqLggiltsXlrdpqoj95uBvhtX4WCQYgV1Qv1BqtoLb2kDtiLEC4Vqy5WHofYeLY8l7vFa4xuhAVsNlpedZLjd59AEpgUrRl6l_NCTtl4upZSFEh5oc4IWdcnrc6lmFiu_RMwo7uc3Byfoe4RonJsmhcvlA9c3cK44HNX4Kdd_hfEbp6Ir4kmnm3E2cdtIxj5aFJv1hJTqY9reiUghH_SvAKmiX3_lEf-ahC1qfQo7gs0XtCGf3HY-PkJjdeuCtlBlw_br5nmU-B_vPpEGpslhiSxvdzYXOYxGDw7PYovNJeD1Jkd2ruAATv8SWP7xiyRhmJdGlqwRI5_D7coFTXIWA3EpNvlI8k-0RHhXXXenx_xM9TKRWOAK3jLyHPsQHUnKwfZcwgDtVqx2VPk3WQtFIjjybGbvJcqCiYeay94iQAHASowLsyHu78dDim4WgG7SAjKjexC7CmVGVaR-YhNJ4tiE3GJNrA8rTZRJPFLDUIanYqXLWuVulZBGVZfMlz9WMqd-LpSbvsNMpnEjx6jt0AAedhhD5eNTyHshsz-GAjlhfw902PqJPcqp3NFZaSSEeQIqI00jXE';

    return $http.post(BASE_URL + "/approve-notification", obj, {
      headers: {
        'Authorization': "Bearer ".concat(token),
        'Accept': 'application/json'
      }
    });
  };

  factory.supperted = function (obj) {
    var token = JSON.parse(window.localStorage.mch_mob_data).access_token;
    return $http.post(BASE_URL + "/support", obj, {
      headers: {
        'Authorization': "Bearer ".concat(token),
        'Accept': 'application/json'
      }
    });
  };

  factory.usSupperted = function (obj) {
    var token = JSON.parse(window.localStorage.mch_mob_data).access_token;
    return $http.post(BASE_URL + "/unsupport", obj, {
      headers: {
        'Authorization': "Bearer ".concat(token),
        'Accept': 'application/json'
      }
    });
  };

  factory.addAssociate = function (obj) {
    var token = JSON.parse(window.localStorage.mch_mob_data).access_token;
    var url = '';

    if (obj.type == 'org') {
      url = 'associate-organization';
    } else if (obj.type == 'pro') {
      url = 'associate-project';
    } else if (obj.type == 'chal') {
      url = 'associate-challenge';
    } else if (obj.type == 'hero') {
      url = 'associate-heroes';
    }

    return $http.post(BASE_URL + "/".concat(url), obj, {
      headers: {
        'Authorization': "Bearer ".concat(token),
        'Accept': 'application/json'
      }
    });
  };

  factory.removeComments = function (id) {
    var token = JSON.parse(window.localStorage.mch_mob_data).access_token;
    return $http["delete"](BASE_URL + "/comment/".concat(id), {
      headers: {
        'Authorization': "Bearer ".concat(token),
        'Accept': 'application/json'
      }
    });
  };

  factory.getCurrency = function (id) {
    var token = JSON.parse(window.localStorage.mch_mob_data).access_token;
    return $http.get(BASE_URL + "/get-currencies?id=".concat(id), {
      headers: {
        'Authorization': "Bearer ".concat(token),
        'Accept': 'application/json'
      }
    });
  };

  factory.getSeacrh = function (obj) {
    var token = JSON.parse(window.localStorage.mch_mob_data).access_token;
    var url = "";

    if (obj.search) {
      url = BASE_URL + "/search?latitude=".concat(obj.latitude, "&longitude=").concat(obj.longitude, "&type=").concat(obj.type, "&search=").concat(obj.search, "&ne_lat=").concat(obj.ne_lat, "&ne_lon=").concat(obj.ne_lon, "&sw_lat=").concat(obj.sw_lat, "&sw_lon=").concat(obj.sw_lon, "&limit=").concat(obj.limit, "&page=").concat(obj.page);
    } else {
      url = BASE_URL + "/search?latitude=".concat(obj.latitude, "&longitude=").concat(obj.longitude, "&type=").concat(obj.type, "&ne_lat=").concat(obj.ne_lat, "&ne_lon=").concat(obj.ne_lon, "&sw_lat=").concat(obj.sw_lat, "&sw_lon=").concat(obj.sw_lon, "&limit=").concat(obj.limit, "&page=").concat(obj.page);
    }

    return $http.get(url, {
      headers: {
        'Authorization': "Bearer ".concat(token),
        'Accept': 'application/json'
      }
    });
  };

  factory.getSearchCount = function (obj) {
    var token = JSON.parse(window.localStorage.mch_mob_data).access_token;
    return $http.get(BASE_URL + "/search-count?search=".concat(obj.search, "&type=").concat(obj.type), {
      headers: {
        'Authorization': "Bearer ".concat(token),
        'Accept': 'application/json'
      }
    });
  };

  factory.getName = function () {
    if (window.localStorage.mch_mob_data) return JSON.parse(window.localStorage.mch_mob_data).name ? JSON.parse(window.localStorage.mch_mob_data).name : '';else return '';
  };

  factory.getId = function () {
    if (window.localStorage.mch_mob_data) return JSON.parse(window.localStorage.mch_mob_data).id ? JSON.parse(window.localStorage.mch_mob_data).id : '';else return '';
  };

  factory.getAddress = function () {
    if (window.localStorage.mch_mob_data) return JSON.parse(window.localStorage.mch_mob_data).address ? JSON.parse(window.localStorage.mch_mob_data).address : '';else return '';
  };

  factory.getPostcode = function () {
    if (window.localStorage.mch_mob_data) return JSON.parse(window.localStorage.mch_mob_data).post_code ? JSON.parse(window.localStorage.mch_mob_data).post_code : '';else return '';
  };

  factory.getPostCity = function () {
    if (window.localStorage.mch_mob_data) return JSON.parse(window.localStorage.mch_mob_data).city ? JSON.parse(window.localStorage.mch_mob_data).city : '';else return '';
  };

  factory.getEmail = function () {
    if (window.localStorage.mch_mob_data) return JSON.parse(window.localStorage.mch_mob_data).email ? JSON.parse(window.localStorage.mch_mob_data).email : '';else return '';
  };

  factory.addComment = function (obj) {
    var token = JSON.parse(window.localStorage.mch_mob_data).access_token;
    return $http.post(BASE_URL + "/comment", obj, {
      headers: {
        'Authorization': "Bearer ".concat(token),
        'Accept': 'application/json'
      }
    });
  };

  factory.forgotPass = function (obj) {
    return $http.post(BASE_URL + "/forgot-password", obj, {
      headers: {
        'Accept': 'application/json'
      }
    });
  };

  return factory;
}]);