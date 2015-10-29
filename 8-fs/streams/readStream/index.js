"use strict";

/*Поток - это javascript объект, который получает файл на вход и может с ним работать

Потоки используются для работы с несколькими операциями чтения/записи одновременно

 можно выделить 2 основных потока:

 stream.Readable - встроенный класс, который организует потоки на чтение,
 его наследники: fs.readStream, при работе сервера объект req (1ый аргумент)

 stream.Writable - встроенный класс для потоков на запись
 его наследники: fs.writeStream, при работе сервера объект res
 */


let fs = require("fs");
let stream = new fs.ReadStream("big.html");


//stream.destroy(); //можно закрыть поток, полностью все очистить



stream.on("open", () => {
   console.log("File opened");
});



stream.on("readable", () => { //событие readable наступает, когда поток прочитал файл и его данные находятся в буфере потока, если файл для считывания большой, то событие readable наступает несколько раз

    let data = stream.read(); //read - получаем данные из буфера
    //console.log(data);

    if (data) { //нужно это условие, так как есть доп тик у readable
        console.log(data.length); //64kb, поток читает не весь файл целиком, а по частям, по умолчанию 64kb
    }
});



stream.on("end", () => {
    console.log("End of stream");
});



stream.on("close", () => {
    console.log("File closed"); //если по каким-либо причинам файл недочитан, то событие end не будет, но всегда будет close
});



stream.on("error", (err) => {
    if (err = "ENOENT") {
        console.log("Файл не существует");
    } else {
        console.log(err);
    }
});


