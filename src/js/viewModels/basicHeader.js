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

// header module viewModel

'use strict';
define(['appUtils', 'ojs/ojbutton', 'ojs/ojknockout'], function(appUtils) {
  function basicHeaderVM(params) {
    var self = this;
    self.title = params.title || '';
    self.startBtn = params.startBtn;
    self.endBtn = params.endBtn;
    self.endBtn.disabled = params.endBtn.disabled || false;

    self.addIncidentButton = params.addIncidentButton || undefined;

    self.transitionCompleted = function() {
//    appUtils.setFocusAfterModuleLoad(self.startBtn.id);
    }
  }
  return basicHeaderVM;
});
