"use strict";
var appModule = require('application');
var Locale = java.util.Locale;
var TNSTextToSpeech = (function () {
    function TNSTextToSpeech() {
        var _this = this;
        this._initialized = false;
        this._lastOptions = null;
        this._utteranceProgressListener = android.speech.tts.UtteranceProgressListener.extend({
            init: (function () {
            }),
            onStart: (function (utteranceId) {
            }),
            onError: (function (utteranceId) {
            }),
            onDone: (function (utteranceId) {
                if (_this._lastOptions.finishedCallback) {
                    _this._lastOptions.finishedCallback();
                }
            })
        });
    }
    TNSTextToSpeech.prototype.speak = function (options) {
        var _this = this;
        if (!this.isString(options.text)) {
            console.log("Text property is required to speak.");
            return;
        }
        if (options.text.length > 4000) {
            console.log("Text cannot be greater than 4000 characters");
            return;
        }
        this._lastOptions = options;
        if (!this._tts || !this._initialized) {
            this._tts = new android.speech.tts.TextToSpeech(this._getContext(), new android.speech.tts.TextToSpeech.OnInitListener({
                onInit: (function (status) {
                    if (status === android.speech.tts.TextToSpeech.SUCCESS) {
                        _this._initialized = true;
                        _this._tts.setOnUtteranceProgressListener(new _this._utteranceProgressListener());
                        _this.speakText(options);
                    }
                })
            }));
        }
        else {
            this.speakText(options);
        }
    };
    TNSTextToSpeech.prototype.pause = function () {
        if (this._tts && this._initialized) {
            this._tts.stop();
        }
    };
    TNSTextToSpeech.prototype.resume = function () {
        if (this._lastOptions) {
            this.speak(this._lastOptions);
        }
    };
    TNSTextToSpeech.prototype.destroy = function () {
        if (this._tts) {
            this._tts.shutdown();
        }
    };
    TNSTextToSpeech.prototype.speakText = function (options) {
        if (this.isString(options.language) && this.isValidLocale(options.language)) {
            var languageArray = options.language.split("-");
            var locale = new Locale(languageArray[0], languageArray[1]);
            this._tts.setLanguage(locale);
        }
        if (!this.isBoolean(options.queue)) {
            options.queue = false;
        }
        if (!options.queue && this._tts.isSpeaking()) {
            this._tts.stop();
        }
        if (!this.isNumber(options.pitch)) {
            options.pitch = 1.0;
        }
        if (!this.isNumber(options.speakRate)) {
            options.speakRate = 1.0;
        }
        if (!this.isNumber(options.volume) || options.volume > 1.0) {
            options.volume = 1.0;
        }
        else if (options.volume < 0.0) {
            options.volume = 0.0;
        }
        this._tts.setPitch(options.pitch);
        this._tts.setSpeechRate(options.speakRate);
        var queueMode = options.queue ? android.speech.tts.TextToSpeech.QUEUE_ADD : android.speech.tts.TextToSpeech.QUEUE_FLUSH;
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.LOLLIPOP) {
            var params = new android.os.Bundle();
            params.putString("volume", options.volume.toString());
            this._tts.speak(options.text, queueMode, params, "UniqueID");
        }
        else {
            var hashMap = new java.util.HashMap();
            hashMap.put("volume", options.volume.toString());
            this._tts.speak(options.text, queueMode, hashMap);
        }
    };
    TNSTextToSpeech.prototype._getContext = function () {
        if (appModule.android.context) {
            return (appModule.android.context);
        }
        var ctx = java.lang.Class.forName("android.app.AppGlobals").getMethod("getInitialApplication", null).invoke(null, null);
        if (ctx)
            return ctx;
        ctx = java.lang.Class.forName("android.app.ActivityThread").getMethod("currentApplication", null).invoke(null, null);
        return ctx;
    };
    TNSTextToSpeech.prototype.isValidLocale = function (locale) {
        var re = new RegExp("\\w\\w-\\w\\w");
        return re.test(locale);
    };
    TNSTextToSpeech.prototype.isString = function (elem) {
        return Object.prototype.toString.call(elem).slice(8, -1) === 'String';
    };
    ;
    TNSTextToSpeech.prototype.isBoolean = function (elem) {
        return Object.prototype.toString.call(elem).slice(8, -1) === 'Boolean';
    };
    ;
    TNSTextToSpeech.prototype.isNumber = function (elem) {
        return Object.prototype.toString.call(elem).slice(8, -1) === 'Number';
    };
    ;
    return TNSTextToSpeech;
}());
exports.TNSTextToSpeech = TNSTextToSpeech;
//# sourceMappingURL=texttospeech.android.js.map