//   angular.module('starter.directive')

// .directive('slideable', function () {
//     return {
//         restrict:'C',
//         compile: function (element, attr) {
//             // wrap tag
//             var contents = element.html();
//             element.html('<div class="slideable_content" style="margin:0 !important; padding:0 !important" >' + contents + '</div>');

//             return function postLink(scope, element, attrs) {
//                 // default properties
//                 attrs.duration = (!attrs.duration) ? '1s' : attrs.duration;
//                 attrs.easing = (!attrs.easing) ? 'ease-in-out' : attrs.easing;
//                 element.css({
//                     'overflow': 'hidden',
//                     'height': '0px',
//                     'transitionProperty': 'height',
//                     'transitionDuration': attrs.duration,
//                     'transitionTimingFunction': attrs.easing
//                 });
//             };
//         }
//     };
// })
// .directive('slideToggle', function() {
//     return {
//         restrict: 'A',
//         link: function(scope, element, attrs) {
//             var target = document.querySelector(attrs.slideToggle);
//             attrs.expanded = false;
//             element.bind('click', function() {
//                 var content = target.querySelector('.slideable_content');
//                 if(!attrs.expanded) {
//                     content.style.border = '1px solid rgba(0,0,0,0)';
//                     var y = content.clientHeight;
//                     content.style.border = 0;
//                     target.style.height = y + 'px';
//                 } else {
//                     target.style.height = '0px';
//                 }
//                 attrs.expanded = !attrs.expanded;
//             });
//         }
//     }
// })
//     .directive('compareTo', compareTo);
//   compareTo.$inject = [];

//   function compareTo() {
//     return {
//       require: "ngModel",
//       scope: {
//         compareTolValue: "=compareTo"
//       },
//       link: function (scope, element, attributes, ngModel) {

//         ngModel.$validators.compareTo = function (modelValue) {

//           return modelValue == scope.compareTolValue;
//         };

//         scope.$watch("compareTolValue", function () {
//           ngModel.$validate();
//         });
//       }
//     };
//   };


// (function () {

//   'use strict';

//   angular
//     .module('starter.directive', ['ionic'])
//     .directive('formValidateAfter', formValidateAfter);

//   function formValidateAfter() {
//     var directive = {
//       restrict: 'A',
//       require: 'ngModel',
//       link: link
//     };

//     return directive;

//     function link(scope, element, attrs, ctrl) {
//       var validateClass = 'form-validate';
//       ctrl.validate = false;
//       element.bind('focus', function (evt) {
//         if (ctrl.validate && ctrl.$invalid) // if we focus and the field was invalid, keep the validation
//         {
//           element.addClass(validateClass);
//           scope.$apply(function () {
//             ctrl.validate = true;
//           });
//         } else {
//           element.removeClass(validateClass);
//           scope.$apply(function () {
//             ctrl.validate = false;
//           });
//         }

//       }).bind('blur', function (evt) {
//         element.addClass(validateClass);
//         scope.$apply(function () {
//           ctrl.validate = true;
//         });
//       });
//     }
//   }

// }());
