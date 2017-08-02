require('file?name=/index.html!jade-env-html?{module:"public"}!./layout.jade');
require('./static.js');
var app = angular.module('app', ((([
  'ngCookies',
  'ngRoute',
  'angular-loading-bar',
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
                  $rootScope.user = null;}});
  $rootScope.auth = {"signin": $aidbox.signin, "signout": $aidbox.signout};
});

app.config(function ($routeProvider) {
  $routeProvider
    .when('/', {templateUrl: 'index.jade', controller: 'IndexCtrl'})
    .when('/patient/:id', {templateUrl: 'patient.jade', controller: 'PatientCtrl'})
    .otherwise({templateUrl: 'index.jade', controller: 'IndexCtrl'});
});

app.controller('IndexCtrl', function($scope, $aidbox, $rootScope){
  $rootScope.$watch("user", function(user){
    if (user) {
      $aidbox.http({url: "/db/patient_compartment",
                    method: "POST",
                    data: user.data})
        .then(function(data){
          $scope.family= data.result[0].patient_compartment;
        });
    }
  });
});

app.controller('PatientCtrl', function($scope, $aidbox, $rootScope, $routeParams){
  $rootScope.$watch("user", function(user){
    if (user) {
      $aidbox.http({url: "/fhir/Patient/"+$routeParams.id})
        .then(function(pt){
          $scope.patient = pt;
          $aidbox.http({url: "/fhir/Appointment?actor="+pt.id})
            .then(function(apps){
              $scope.appointments = apps.entry.map(function(a){return a.resource});
            });
          $aidbox.http({url: "/fhir/MedicationStatement?patient="+pt.id})
            .then(function(apps){
              $scope.medicationstatement = apps.entry.map(function(a){return a.resource});
            });
        });

    }
  });
});
