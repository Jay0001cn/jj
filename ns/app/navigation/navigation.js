'use strict';
var helpers = require('../utils/widgets/helper'),
    navigationViewModel = require('./navigation-view-model');
//var WebWorker = require('nativescript-webworkers');

function pageLoaded(args) {
    var page = args.object;

    helpers.platformInit(page);
    page.bindingContext = navigationViewModel;
    navigationViewModel.set('pageTitle', 'nativeScriptApp');
}

function menuItemTap(args) {
   
	var worker = new WebWorker("~/workder/bgman.js");
    helpers.navigate(navigationViewModel.menuItems[args.index]);
}

exports.pageLoaded = pageLoaded;
exports.menuItemTap = menuItemTap;