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
define(['ojs/ojcore', 'knockout','ModuleHelper',
        'dataService',
        'appController',
        'appUtils',
        'ojs/ojarraydataprovider',
        'ojs/ojknockout',
        'ojs/ojanimation',
        'ojs/ojavatar',
        'ojs/ojlistview',
        'ojs/ojlistitemlayout'], function(oj, ko,moduleHelper, data, app, appUtils,ArrayDataProvider){
  function products(params) {
    var self = this, handleSectionClick;
    self.appUtilities = appUtils;
    self.toggleDrawer = app.toggleDrawer;
    self.parentRouter = params.parentRouter;
    self.scrollElem = document.body;

    self.prefetch = function() {

    }

    
    
 self.openCart = function() {
     console.log(">>>")
    $(".shopping-cart").fadeToggle("fast");
    };
    
    

    self.connected = function() {
          var data = [{ "id": 1, "name": "ULTRABOOST 20 Shoes", "title": "$180", "image": "https://assets.adidas.com/images/h_840,f_auto,q_auto:sensitive,fl_lossy/65dba7d32e7b4d8ea2faab0b00ad3783_9366/Ultraboost_20_Shoes_Black_EG0691_01_standard.jpg" },
          { "id": 2, "name": "ULTRABOOST LTD SHOES", "title": "$180", "image": "https://assets.adidas.com/images/h_840,f_auto,q_auto:sensitive,fl_lossy/731495bd401043bd97f0ac2f012d9a50_9366/Ultraboost_Ltd_Shoes_Burgundy_AF5836_01_standard.jpg" },
          { "id": 3, "name": "SUPERSTAR SHOES", "title": "$85", "image": "https://assets.adidas.com/images/h_840,f_auto,q_auto:sensitive,fl_lossy/7ed0855435194229a525aad6009a0497_9366/Superstar_Shoes_White_EG4958_01_standard.jpg" },
          { "id": 4, "name": "ZX 2K BOOST SHOES", "title": "$150", "image": "https://assets.adidas.com/images/h_840,f_auto,q_auto:sensitive,fl_lossy/a00e176273414e2d986babc90099fa3e_9366/ZX_2K_Boost_Shoes_White_FV9996_01_standard.jpg" },
          { "id": 5, "name": "GAZELLE SHOES", "title": "$80", "image": "https://assets.adidas.com/images/h_840,f_auto,q_auto:sensitive,fl_lossy/698e41ae0196408eb16aa7fb008046ad_9366/Gazelle_Shoes_Blue_BB5478_01_standard.jpg" },
          { "id": 6, "name": "COMFORT SLIDES", "title": "$35", "image": "https://assets.adidas.com/images/h_840,f_auto,q_auto:sensitive,fl_lossy/2a4d6189e3a64c6e9fd5a80801532571_9366/Adilette_Comfort_Slides_Black_S82137_01_standard.jpg" },
          { "id": 7, "name": "2K BOOST SHOES", "title": "$150", "image": "https://assets.adidas.com/images/h_840,f_auto,q_auto:sensitive,fl_lossy/74d0ccea82d44cb3b60fabc9013e15db_9366/ZX_2K_Boost_Shoes_Blue_FX8836_01_standard.jpg" },
          { "id": 9, "name": "ULTRABOOST DNA SHOES", "title": "$180", "image": "https://assets.adidas.com/images/h_840,f_auto,q_auto:sensitive,fl_lossy/6f0c843f4baf47f689b4ac0200d2f657_9366/Ultraboost_DNA_Shoes_Green_EG5923_01_standard.jpg" }
      ];
          
          this.dataProvider = new ArrayDataProvider(data, { keyAttributes: 'id' });
    };

    self.transitionCompleted = function() {
    };

    self.disconnected = function() {
    }
    
    self.goToCheckout = function() {
        app.router.go("cart")
    };
    
    // profile page header
    var leftBtnLabel = ko.computed(function(){
      return 'Back';
    });

    var rightBtnLabel = ko.computed(function(){
      return 'Cart';
    });

    var rightClickAction = function() {
        self.openCart();
    };

    var leftClickAction = function() {
        app.router.go("signin");
    };

    var icons = ko.computed(function() {
      return 'oj-ux-ico-arrow-left oj-ux-icon-size-6x';
    });

    var headerViewModelParams = {
      title: '',
      startBtn: {
        id: 'backBtn',
        click: leftClickAction,
        display: 'icons',
        label: leftBtnLabel,
        icons: icons,
        visible: true
      },
      endBtn: {
        id: 'nextBtn',
        click: rightClickAction,
        display: 'all',
        label: rightBtnLabel,
        icons: 'fa fa-shopping-cart',
        visible: true,
        disabled: false
      }
    };

    moduleHelper.setupStaticModule(self, 'headerConfig', 'basicHeader', headerViewModelParams);
    
  }

  return products;
});
