var TNSTextToSpeech = require("nativescript-texttospeech");


onready = function() {
   
    postMessage("Hi");
    
    
    let opts = {
        text: 'You may choose whether and how to split a body of text into multiple utterances for speech. Because an utterance can control speech parameters, you can split text into sections that require different parameters. For example, you can emphasize a sentence by increasing the pitch and decreasing the rate of that utterance relative to others, or you can introduce pauses between sentences by putting each one into an utterance with a leading or trailing delay. Because the speech synthesizer sends messages to its delegate as it starts or finishes speaking an utterance, you can create an utterance for each meaningful unit in a longer text in order to be notified as its speech progresses.',
        language: "en-US",
        //voice:  "com.apple.ttsbundle.Alex",
        useAlex: "yes",
        finishedCallback: lop
    };
    if (isChina(opts.text)) { opts.voice = "com.apple.ttsbundle.Mei-Jia-compact"; }

    function isChina(s) {
        var patrn = /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi;
        if (!patrn.exec(s)) {
            return false;
        } else {
            return true;
        }
    }
    let TTS = new TNSTextToSpeech.TNSTextToSpeech();

    function lop() {

        TTS.speak(opts);
    }

    TTS.speak(opts);

};

onmessage = function(m) {
    console.log("NativeScript said" + m);
};

onerror = function(e) {
    console.log("Error thrown and not caught: " + e);
    return true;
}
