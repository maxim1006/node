"use strict";

const fs = require('fs');
const path = require('path');
const PUBLIC_DIR = path.join(__dirname, 'public');

let filename = 'txt.txt';
let filePath = path.join(PUBLIC_DIR, filename);

let inp = fs.createReadStream(filename, {encoding: "utf-8", highWaterMark: 9}); //читать по 9 байт
let out = fs.createWriteStream(filePath, {flags: 'w+', highWaterMark: 9});


inp
    .on('error', clean)
    .pipe(out)
    .on('error', clean)
    .on('finish', function() {
        console.log("DONE");
    });



/*let content = '';

inp
    .on("data", (data) => {
        content += data;
        console.log(data);
    })
    .on("end", () => {
        //console.log(content);
    });*/


//Это тоже самое, что и выше только через read, write
/*inp.on("readable", () => {
    let data = inp.read();

    if (data) {
        //console.log(data);
    }

    if (data) {
        console.log(out.write(data));
    }

});*/

out
    .on('close', function() {
        out.destroy();
    });


/*Helpers*/
function clean(err) {

    if (err = "ENOENT") {
        console.log("Файл не существует");
    } else {
        console.log(err);
    }

    fs.unlink(filePath, function(err) {
        /* should be no error, if the file exists, then it is ours */
    });
}