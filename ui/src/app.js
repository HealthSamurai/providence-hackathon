require('file?name=/index.html!jade-env-html?{module:"public"}!./app.jade');
require('./static.js');
var app = angular.module('app', ((([
    'ngCookies',
    'ngRoute',
    'ngAnimate',
    'ngAidbox'
]))));
var util  = require('./util.js');
util.requireAll(require.context("ng-cache?!jade-env-html!./", true, /^\.\/.*\.jade$/));

app.run(function($rootScope, $aidbox, $cookies){
    $aidbox.init({"flow": 'redirect',
                  "box": "http://hackathon.dev.aidbox.io",
                  "onSignIn": function(user){
                      $rootScope.user = user;},
                  "onSignOut": function(){
                      $cookies.remove("ab_site");
                      $rootScope.user = nil;}});
    $rootScope.auth = {"signin": $aidbox.signin, "signout": $aidbox.signnout};
});

app.config(function ($routeProvider) {
    rp = $routeProvider;
    rp.when('/', {"templateUrl": 'index.jade', "controller": 'IndexCtrl'});
});

app.controller('IndexCtrl', function($scope, $location, $window, $cookies, $aidbox){
    $aidbox.http({"url": "/fhir/Patient"})
        .then(function(data){
            $scope.data = data;
        });

});
