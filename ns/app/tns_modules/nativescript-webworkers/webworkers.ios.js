/**********************************************************************************
 * (c) 2016, Master Technology
 * Licensed under the MIT license or contact me for a Support or Commercial License
 *
 * I do contract work in most languages, so let me solve your problems!
 *
 * Any questions please feel free to email me or put a issue up on the github repo
 * Version 0.0.1                                      Nathan@master-technology.com
 *********************************************************************************/
"use strict";

var application = require('application');
var fs = require('file-system');

/* jshint node: true, browser: true, unused: false, undef: true */
/* global android, com, java, javax, unescape, exports, global, NSObject, NSString, NSLocale, WKScriptMessageHandler, WKNavigationDelegate */


var _WKScriptMessageHandler = NSObject.extend({
    _worker: null,
    userContentControllerDidReceiveScriptMessage: function(userContentController, message) {
        this._worker._clientMessage(message.body);
    },
    webViewDidFinishNavigation: function(webKit, navigation) {
        this._worker._finishedLoading();
    }
},{name: 'WKScriptMHandler', protocols: [WKScriptMessageHandler,WKNavigationDelegate]});

function WebWorker(js) {
     
    this._running = true;
    this._initialized = false;
    this._messages = [];
    //alert("ok so far0");
    this._config = new WKWebViewConfiguration();
    //alert("ok so far1");
    this._controller = new WKUserContentController();
//alert("ok so far2");
    /*
     this._uiWindow = UIWindow.alloc().initWithFrame(CGRectMake(0,0,100,100));
     this._uiWindow.userInteractionEnabled = false;
     var uiViewController = UIViewController.alloc().init();
     var uiView = UIView.alloc().initWithFrame(CGRectMake(0,0,100,100));
     uiView.backgroundColor = UIColor.alloc().initWithRedGreenBlueAlpha(0 / 255, 0 / 255, 255 / 255, 128 / 255);
     uiViewController.view.addSubview(uiView);
     this._uiWindow.rootViewController = uiViewController;
     this._uiWindow.windowLevel = UIWindowLevelStatusBar;
     this._uiWindow.makeKeyAndVisible();
     this._uiWindow.hidden=false;
     */

    var script1 = "if (typeof console === 'undefined') { console = {}; } console.log = function() { postMessage({'_BRM': 'log', 'data': Array.prototype.slice.call(arguments) }); }; " +
        "window.postMessage = function(data) { try { window.webkit.messageHandlers.channel.postMessage(JSON.stringify(data)); } catch (e) { console.error(e); } }; " +
        "window._WW_receiveMessage = function(d) { setTimeout(function() { _WW_timedMessage(d); },0); }; " +
        "window._WW_timedMessage = function(d) { try { window.onmessage(d); } catch (e) { console.log(e); postMessage({_BRM: 'error', error: e}); } }; " +
        "window.close = function() { postMessage({_BRM: 'close'}); }; ";
    var script2 = "if (typeof onready === 'function') { onready(); } ";

    var s1 = WKUserScript.alloc().initWithSourceInjectionTimeForMainFrameOnly(script1, WKUserScriptInjectionTimeAtDocumentStart, false);
    var s2 = WKUserScript.alloc().initWithSourceInjectionTimeForMainFrameOnly(script2, WKUserScriptInjectionTimeAtDocumentEnd, false);
    this._scriptHandler = _WKScriptMessageHandler.alloc().init();
    this._scriptHandler._worker = this;
//alert("ok so far3");
    this._controller.addScriptMessageHandlerName(this._scriptHandler, "channel");

    this._controller.addUserScript(s1);
    this._controller.addUserScript(s2);

    this._config.userContentController = this._controller;

    this.ios = WKWebView.alloc().initWithFrameConfiguration(CGRectMake(0,0,50,50), this._config);
    this.ios.customUserAgent = "nativescript-websockets";
    this.ios.navigationDelegate = this._scriptHandler;

//	var d = UIApplication.sharedApplication().keyWindow;
//	d.addSubview(this.ios);
    //uiView.addSubview(this.ios);

//alert("ok so far");
    if (js == null || js === '') {
        alert("path null");
        console.error("WebWorkers: can not find JavaScript file: ", js);
        //noinspection JSUnresolvedFunction
        this.ios.loadRequest(NSURLRequest.requestWithURL(NSURL.URLWithString("about:blank")));
        return;
    }
    if (js[0] === '/' || (js[1] === '/' && (js[0] === '.' || js[0] === '~'))) {
        
        if (js[0] === '~' || js[0] === '.') {
            // TODO: Check to see if ./ is working properly
            js = fs.path.join(fs.knownFolders.currentApp().path, js.substr(2));
        }
        if (fs.File.exists(js)) {
            
            var baseURL = "file://" + js.substring(0, js.lastIndexOf('/') + 1);
            var baseJSUrl = NSURL.URLWithString(baseURL);
            var fileName = js.substring(baseURL.length-7);

            //noinspection JSUnresolvedFunction
            this.ios.loadHTMLStringBaseURL("<html><head><script src='"+fileName+"'></script></head></html>", baseJSUrl);
               //alert("<html><head><script src='"+fileName+"'></script></head></html>");
        } else {
            alert(js);
            console.error("WebWorkers: can not find JavaScript file: ", js);
            //noinspection JSUnresolvedFunction
            this.ios.loadRequest(NSURLRequest.requestWithURL(NSURL.URLWithString("about:blank")));
        }
    } else {
       
        // Check for http(s)://
        if ((js[0] === 'h' || js[0] === 'H') && (js[6] === '/' && (js[5] === '/' || js[7] === '/'))) {
            //noinspection JSUnresolvedFunction
            this.ios.loadRequest(NSURLRequest.requestWithURL(NSURL.URLWithString(js)));
        } else {
            var baseDataUrl = NSURL.URLWithString("file:///" + fs.knownFolders.currentApp().path + "/");
            //noinspection JSUnresolvedFunction
            this.ios.loadHTMLStringBaseURL("<html><head><script>"+js+"</script></head></html>", baseDataUrl);
        }
    }

    //alert("found");
}

WebWorker.prototype._clientMessage = function(m) {
    var data;
    if (m[0] === '{') {
        try {
            data = JSON.parse(m);
        }
        catch (e) {
            data = m;
        }
    } else {
        data = m;
    }
    //noinspection JSUnresolvedVariable
    if (data._BRM) {
        switch (data._BRM) {
            case 'close':
                this.terminate(); break;
            case 'error':
                this.onerror(data.error); break;
            case 'log':
                console.log.apply(console,data.data);	break;
            default:
                console.log("Unknown _BRM", data._BRM)
        }

        return;
    }
    this.onmessage(data);
};

WebWorker.prototype._finishedLoading = function() {
    this._initialized = true;
    if (this._messages.length) {
        while (this._messages.length) {
            var m = this._messages.pop();
            this.postMessage(m);
        }
    }
    this.onready();
};

WebWorker.prototype.postMessage = function(data) {
    
    if (!this._running) { return; }
    if (!this._initialized) {
        this._messages.push(data);
    } else {
        var self = this;
        this.ios.evaluateJavaScriptCompletionHandler("_WW_receiveMessage(" + JSON.stringify(data) + "); ", function(c,err) { if (err) self.onerror(err); });
    }
};

WebWorker.prototype.terminate = function() {
    this._running = false;
    //noinspection JSUnresolvedFunction
    this.ios = null;
    this._config = null;
    this._controller = null;
};

WebWorker.prototype.onerror = function(e) {
    console.log("NativeScript-WebWorker error:", e);
    // Do Nothing.
      alert(e);
};

WebWorker.prototype.onmessage = function() {
    console.log("NativeScript-WebWorker message");
    // Do Nothing.
      alert("Webworker said:");
};

WebWorker.prototype.onready = function() {
    var TNSTextToSpeech = require("nativescript-texttospeech");
    // Do nothing; this allows the end user to override this
      let opts = {
	    text: 'You may choose whether and how to split a body of text into multiple utterances for speech. Because an utterance can control speech parameters, you can split text into sections that require different parameters. For example, you can emphasize a sentence by increasing the pitch and decreasing the rate of that utterance relative to others, or you can introduce pauses between sentences by putting each one into an utterance with a leading or trailing delay. Because the speech synthesizer sends messages to its delegate as it starts or finishes speaking an utterance, you can create an utterance for each meaningful unit in a longer text in order to be notified as its speech progresses.',
        language: "en-US",
        //voice:  "com.apple.ttsbundle.Alex",
        useAlex:   "yes",
         finishedCallback: lop   
	};
   if(isChina(opts.text)){opts.voice = "com.apple.ttsbundle.Mei-Jia-compact";}
    function isChina(s){ 
var patrn=/[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi; 
if(!patrn.exec(s)){ 
return false; 
}
else{ 
return true; 
} 
}
       let   TTS   = new TNSTextToSpeech.TNSTextToSpeech(); 
       function  lop(){
               TTS.speak(opts);
       }
       
        TTS.speak(opts);
};

if (!global.Worker) {
    global.Worker = WebWorker;
}

module.exports = WebWorker;