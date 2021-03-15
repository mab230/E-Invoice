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
'use strict';
define(['appUtils',
        'ojs/ojknockout-keyset',
        'ojs/ojarraydataprovider',
        'ojs/ojknockout',
        'ojs/ojlistview'],
  function(appUtils, KeySet, ArrayDataProvider) {
    function aboutList(params) {
      var self = this;
      self.optionChange = params.optionChange;
      // retrieve about items to render the list
      self.aboutOptions = new ArrayDataProvider(params.list, {keyAttributes: 'id'});
      self.selectedItem = new KeySet.ObservableKeySet();
      self.prefetch = function() {
        self.selectedItem.clear();
      }
      self.transitionCompleted = function() {
        appUtils.setFocusAfterModuleLoad('startBtn');
      }
    }
    return aboutList;
  });
