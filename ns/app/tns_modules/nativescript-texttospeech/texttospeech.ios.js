"use strict";
var delegate;
var doneCallback;
var MySpeechDelegate = (function (_super) {
    __extends(MySpeechDelegate, _super);
    function MySpeechDelegate() {
        _super.apply(this, arguments);
    }
    MySpeechDelegate.prototype.speechSynthesizerDidStartSpeechUtterance = function (synthesizer, utterance) {
    };
    MySpeechDelegate.prototype.speechSynthesizerDidFinishSpeechUtterance = function (synthesizer, utterance) {
        if (doneCallback) {
            doneCallback();
        }
    };
    MySpeechDelegate.prototype.speechSynthesizerDidPauseSpeechUtterance = function (synthesizer, utterance) {
    };
    MySpeechDelegate.prototype.speechSynthesizerDidContinueSpeechUtterance = function (synthesizer, utterance) {
    };
    MySpeechDelegate.prototype.speechSynthesizerDidCancelSpeechUtterance = function (synthesizer, utterance) {
    };
    MySpeechDelegate.ObjCProtocols = [AVSpeechSynthesizerDelegate];
    return MySpeechDelegate;
}(NSObject));
var TNSTextToSpeech = (function () {
    function TNSTextToSpeech() {
    }
    TNSTextToSpeech.prototype.speak = function (options) {
        if (!this._speechSynthesizer) {
            this._speechSynthesizer = AVSpeechSynthesizer.alloc().init();
            this._speechSynthesizer.delegate = new MySpeechDelegate();
        }
        if (!this.isString(options.text)) {
            console.log("Text is required to speak.");
            return;
        }
        doneCallback = options.finishedCallback;
        if (!this.isNumber(options.pitch)) {
            options.pitch = 1.0;
        }
        else if (options.pitch < 0.5) {
            options.pitch = 0.5;
        }
        else if (options.pitch > 2.0) {
            options.pitch = 2.0;
        }
        if (!this.isNumber(options.speakRate)) {
            options.speakRate = AVSpeechUtterance.AVSpeechUtteranceMaximumSpeechRate / 4.0;
        }
        else if (options.speakRate < AVSpeechUtterance.AVSpeechUtteranceMinimumSpeechRate) {
            options.speakRate = AVSpeechUtterance.AVSpeechUtteranceMinimumSpeechRate;
        }
        else if (options.speakRate > AVSpeechUtterance.AVSpeechUtteranceMaximumSpeechRate) {
            options.speakRate = AVSpeechUtterance.AVSpeechUtteranceMaximumSpeechRate;
        }
        if (!this.isNumber(options.volume) || options.volume > 1.0) {
            options.volume = 1.0;
        }
        else if (options.volume < 0.0) {
            options.volume = 0.0;
        }
        var speechUtterance = AVSpeechUtterance.alloc().initWithString(options.text);
        if (this.isString(options.language) && this.isValidLocale(options.language)) {
            speechUtterance.voice = AVSpeechSynthesisVoice.voiceWithLanguage(options.language);
        }

        if (this.isString(options.voice) && this.isValidLocale(options.voice)) {
            speechUtterance.voice = AVSpeechSynthesisVoice.voiceWithIdentifier(options.voice);
        }

        speechUtterance.pitchMultiplier = options.pitch;
        speechUtterance.volume = options.volume;
        speechUtterance.rate = options.speakRate;
        if (!this.isBoolean(options.queue)) {
            options.queue = false;
        }
        if (!options.queue && this._speechSynthesizer.speaking) {
            this._speechSynthesizer.stopSpeakingAtBoundary(AVSpeechBoundary.AVSpeechBoundaryImmediate);
        }
        this._speechSynthesizer.speakUtterance(speechUtterance);
    };
    TNSTextToSpeech.prototype.pause = function (now) {
        this._speechSynthesizer.pauseSpeakingAtBoundary(now ? AVSpeechBoundary.AVSpeechBoundaryImmediate : AVSpeechBoundary.AVSpeechBoundaryWord);
    };
    TNSTextToSpeech.prototype.resume = function () {
        this._speechSynthesizer.continueSpeaking();
    };
    TNSTextToSpeech.prototype.destroy = function () {
        this._speechSynthesizer = null;
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
    TNSTextToSpeech.prototype.isValidLocale = function (locale) {
        var re = new RegExp("\\w\\w-\\w\\w");
        return re.test(locale);
    };
    return TNSTextToSpeech;
}());
exports.TNSTextToSpeech = TNSTextToSpeech;
//# sourceMappingURL=texttospeech.ios.js.map