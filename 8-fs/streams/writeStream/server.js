"use strict";

let http = require("http");
let fs = require("fs");

let server = new http.Server();

server.on("request", (req, res) => { //res === new stream.Writable
    let file;


    /*if (req.url === "/index.html") {
        res.setHeader("Content-type", "text/html; charset=utf-8");
        res.end("index");
    } else {
        res.statusCode = 500;
        res.end("Server error");
    }*/


    if (req.url === "/") {
        file = new fs.ReadStream("index.html");


        /*file.on("error", (err) => {
            if (err = "ENOENT") {
                console.log("Файл не существует");
            } else {
                console.log(err);
            }
        });*/


        sendFile(file, res);
    }
});


server.listen(2000);


function sendFile(file, res) {
    //это pipe
    /*file.on('readable', write);

    function write() {
        var fileContent = file.read();

        if (fileContent) {
            console.log(res.write(fileContent));
        }

        if (fileContent && !res.write(fileContent)) {//res.write - отправляет часть файла из буфера, также - вернет true, если весь файл целиком в буфере, false - если буфер переполнен, а когда буфер снова очистился, вызывается drain
            console.log(res.write(fileContent));

            file.removeListener("readable", write);

            res.removeAllListeners('drain');

            res.once('drain', () => { //drain - когда поток все отошлет его внутренний буфер опустеет, то будет сгенерирован drain
                file.on('readable', write);
                write();
            });
        }
    }

    file.on("end", () => { //end - полностью файл пришел
        res.end(); //соединение закрыто, файл полностью отослан
        console.log("END");
    });*/






    file.pipe(res); //readable->pipe->writable
    //file.pipe(process.stdout); //stdout - выводит fileContent

    //это как раз для примера, чтобы можно было посмотреть когда закроют скачивание файла по середине, для этого использую curl http://curl.haxx.se/dlwiz/?type=bin&os=Win64&flav=-, чтобы решить эту проблему использую res.close()
    //curl --limit-rate 1K http://localhost:2000/index.html
    file
        .on("error", (err) => {
            res.statusCode = 500;
            res.end("Server error");
            console.error(err);
        })
        .on("open", (err) => {
            console.log("file Opened"); //сработает при открытии файла
        }).on("close", (err) => {
            console.log("file Closed"); //сработает при закрытии файла, т.е. полном скачивании в буфер, это нормальное завершение, но если что-то произошло, то мы должны еще отслеживать close на res
        }).on("end", () => { //весь файл в потоке
            console.log("file Ended");
        });

    res.on('close', () => { //у объекта ответа сервера тоже есть close, сигнал, что соединение было оборвано, при нормальном завершении проиходит не close, а finish
        console.log("res Closed");
        file.destroy(); //убиваю поток, освобождаю ресурсы
    });

    res.on('finish', () => { //успешное окончание работы потока, успешная отдача всех данных
        console.log("res Finished");
    });
}

/*Есть разница между файловыми (fs) потоками и серверными (req, res), в файловых close - это когда файл в буфере
* close в серверных потоках - это обрыв соединения
* */