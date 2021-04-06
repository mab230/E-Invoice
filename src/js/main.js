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

/**
 * Example of Require.js boostrap javascript
 */
'use strict';

(function () {

  function _ojIsIE11() {
    var nAgt = navigator.userAgent;
    return nAgt.indexOf('MSIE') !== -1 || !!nAgt.match(/Trident.*rv:11./);
  };
  var _ojNeedsES5 = _ojIsIE11();

  requirejs.config({
    // Path mappings for the logical module names
    paths:
    // injector:mainReleasePaths
    {
      'knockout': 'libs/knockout/knockout-3.5.1',
      'mapping': 'libs/knockout/knockout.mapping-latest',
      'jquery': 'libs/jquery/jquery-3.5.1.min',
      'jqueryui-amd': 'libs/jquery/jqueryui-amd-1.12.1.min',
      'hammerjs': 'libs/hammer/hammer-2.0.8.min',
      'ojdnd': 'libs/dnd-polyfill/dnd-polyfill-1.0.2.min',
      'ojs': 'libs/oj/v9.2.0/min' + (_ojNeedsES5 ? '_es5' : ''),
      'ojL10n': 'libs/oj/v9.2.0/ojL10n',
      'ojtranslations': 'libs/oj/v9.2.0/resources',
      'signals': 'libs/js-signals/signals.min',
      'text': 'libs/require/text',
      'oraclemapviewer': 'libs/oraclemapsv2',
      'oracleelocation': 'libs/oracleelocationv3',
      'customElements': 'libs/webcomponents/custom-elements.min',
      'css': 'libs/require-css/css.min',
      'touchr': 'libs/touchr/touchr',
      'corejs': 'libs/corejs/shim',
      'chai': 'libs/chai/chai-4.2.0',
      'regenerator-runtime': 'libs/regenerator-runtime/runtime',
      'pouchdb': 'libs/pouchdb/min/pouchdb-6.3.4',
      'pouchfind': 'libs/pouchdb/min/pouchdb.find',
      'persist': 'libs/persist/min',
      'appConfig': 'appConfigExternal'
    }
    // endinjector
  });
}());


require(['pouchdb'], function (pouchdb) {
  window.PouchDB = pouchdb;
});

/**
 * A top-level require call executed by the Application.
 * Although 'ojcore' and 'knockout' would be loaded in any case (they are specified as dependencies
 * by the modules themselves), we are listing them explicitly to get the references to the 'oj' and 'ko'
 * objects in the callback
 */
require(['ojs/ojcore', 'knockout', 'appController', 'jquery', 'appUtils'], function (oj, ko, app, $, appUtils) {
  // The moment we load the app, we set the busy context.
  // This will be resolved when app's login page is ready to interact.
  appUtils.setPageBusyContext();
  $(function () {

    function init() {
      oj.Router.sync().then(function () {
        // bind your ViewModel for the content of the whole page body.
        ko.applyBindings(app, document.getElementById('page'));
      }, function (error) {
        oj.Logger.error('Error in root start: ' + error.message);
      });

      document.addEventListener("deviceready", onDeviceReady, false);
      // device APIs are available
      //
      function onDeviceReady() {
        // Register the event listener
        document.addEventListener("backbutton", onBackKeyDown, false);
      }

      // Handle the back button
      //
      function onBackKeyDown(e) {
        console.log('Back Btn Disbaled');
        e.preventDefault();
      }

    }

    // If running in a hybrid (e.g. Cordova) environment, we need to wait for the deviceready
    // event before executing any code that might interact with Cordova APIs or plugins.
    if ($(document.body).hasClass('oj-hybrid')) {
      document.addEventListener("deviceready", init);
    } else {
      init();
    }

  });

});
