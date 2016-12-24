'use strict';
var helpers = require('../utils/widgets/helper'),
    navigationViewModel = require('./navigation-view-model');




function pageLoaded(args) {
    var page = args.object;

    helpers.platformInit(page);
    page.bindingContext = navigationViewModel;
    navigationViewModel.set('pageTitle', 'nativeScriptApp');
}

function menuItemTap(args) {
        require('nativescript-webworkers');
	    var myWorker = new Worker('~/fuck.js');
        //myWorker.onready = function(m) { alert("Webworker said:"); };

    helpers.navigate(navigationViewModel.menuItems[args.index]);
}

exports.pageLoaded = pageLoaded;
exports.menuItemTap = menuItemTap;