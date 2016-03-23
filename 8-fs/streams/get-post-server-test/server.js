'use strict';

const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');
const mime = require('mime');
const config = require('./config/default.js');

module.exports = http.createServer((req, res) => {

    let urlParsed = url.parse(req.url);
    let filename = decodeURI(urlParsed.pathname.slice(1));

    if (!filename) filename = 'index.html';


    if (filename.includes('/') || filename.includes('..')) {
        res.statusCode = 400;
        res.end("Nested paths are not allowed");
    }

    let filepath = path.join(config['publicRoot'], filename)

    if (req.method == 'GET') {
        let fileStream = fs.createReadStream(filepath);
        fileStream.pipe(res);

        fileStream
            .on('open', () => {
                if (!res.headersSent) {
                    res.setHeader('Content-Type', mime.lookup(filename));
                }
            })
            .on('error', err => {
                if (err.code == 'ENOENT') {
                    res.statusCode = 404;
                    res.end("Not found");
                } else {
                    res.statusCode = 500;
                    res.end("Server Error");
                    console.error(err);
                }
            });

        res
            .on('close', () => {
                fileStream.destroy();
            });
    }

    if (req.method == 'POST') {
        let fileStream = new fs.createWriteStream(filepath, {flags: 'wx'});
        req.pipe(fileStream);

        let hadErrors = false;

        fileStream.on('error', (err) => {
            if (err.code == 'EEXIST') {
                res.statusCode = 409;
                res.end('File already exists');
            } else {
                res.statusCode = 500;
                res.end('Server Error');
                console.error(err);
                hadErrors = true;
                fs.unlink(filepath, err => {
                    /* удалить недокачанный файл */
                });
            }
        });

        // успешный вызов end()
        fileStream.on('finish', () => {
            if (!hadErrors) {
                res.end("OK");
            }
        });

        req.on('close', () => {
            hadErrors = true;
            fileStream.destroy();
            fs.unlink(filepath, err => { /* удалить недокачанный файл */
            });
        });
    }

});

