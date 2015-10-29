"use strict";

var fs = require("fs");

/*асинхронно читаю файл*/
//fs.readFile(__filename, (err, data) => {
//    if (err) {
//        if (err.code === "ENOENT") //если нет файла
//            console.log(err.message);
//        else
//            console.log(err);
//    } else {
//        console.log(data);
//    }
//});



//получаю инфу о файле, проверить файл можно с помощью fs.Stat
//fs.stat(__filename, (err, stats) => {
//    console.log(stats.isFile());
//    console.log(stats);
//});



//Пример создания, переименования и удаления файла
fs.writeFile("file.tmp", "data", (err) => {
    if (err) throw err;

    fs.rename("file.tmp", "new.tmp", (err) => {
        if (err) throw err;

        fs.unlink("new.tmp", (err) => {
            if (err) throw err;
        });

    });
});