'use strict';

var util = require('util');

let phrases = {
    "Hello": "Привет",
    "world": "мир"
};


function PhraseError(message) {
    this.message = message;
    Error.captureStackTrace(this, PhraseError);
}
util.inherits(PhraseError, Error);
PhraseError.prototype.name = 'PhraseError';


function HttpError(status, message) {
    this.message = message;
    this.status = status;
    Error.captureStackTrace(this, HttpError); //сохраняет стек до этой точки в this, 2ой параметр - это ф-ция до которой нужно вести трейс
}
util.inherits(HttpError, Error);
HttpError.prototype.name = 'HttpError';



function getPhrase(name) {
    if (!phrases[name]) {
        throw new PhraseError("Нет такой фразы " + name); //http 500, уведомление
    }
    return phrases[name];
}

function makePage(url) {
    if (url != "index.html") {
        throw new HttpError(404, "Нет такой страницы"); //http 404
    }

    return util.format("%s, %s!", getPhrase("Helo"), getPhrase("world"));
}

try {
    var page = makePage("index.html");
    console.log(page);
} catch (e) {
    if (e instanceof HttpError) {
        console.log('%s %s', e.status, e.message);
    } else {
        console.error('Ошибка %s\n сообщение: %s\n стек: %s', e.name, e.message, e.stack);
    }
}
