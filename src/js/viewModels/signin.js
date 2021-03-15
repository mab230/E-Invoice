/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/**
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */

// signin page viewModel
// In a real app, replace it with your authentication and logic
'use strict';
define(['ojs/ojcore', 'knockout', 'appController', 'appUtils',
  'ojs/ojknockout', 'ojs/ojinputtext', 'ojs/ojbutton', 'ojs/ojvalidationgroup',
  'ojs/ojanimation'], function (oj, ko, app, appUtils) {
    function signin() {
      var self = this;

      self.signInGroupValid = ko.observable();
      self.username = ko.observable();
      self.password = ko.observable();


      // Replace with sign in authentication
      self.signIn = function () {
        if (self.isFormValid('signInFormGroup')) {
          console.log('User Name -- ', self.username(), '  password -- ', self.password());
          if (self.username() == 'Mr Badawy' && self.password() == '12345678') {
            console.log('Valid User');
            // self.goToFaqs();
            app.onLoginSuccess();
          } else {
            console.log('Not Valid User');
            document.getElementById('invalidUserMessageId').classList.add('showinvalidUserMessage')
          }
        }
      };

      self.goToFaqs = function () {
        app.router.go("faqs")
      };

      /**
      * check if form is valid
      * @param {*} formId 
      */
      self.isFormValid = function (formId) {
        var tracker = document.getElementById(formId);
        if (tracker.valid === "valid") {
          return true;
        } else {
          tracker.showMessages();
          tracker.focusOn("@firstInvalidShown");
          return false;
        }
      };

    }
    return signin;
  });
