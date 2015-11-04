"use strict";

/*
* it.only - запускает только 1 тест
*
* mocha --prof - показывает профайлинг того, что делает мока
*
* node-tick-processor - показывает на что было потрачено время нодой
*
* mocha server.js -s 0 - чтобы мока проставляла время для всех тестов
 * */



const chai = require("chai");
chai.should();
const request = require("request");
const config = require('config');
const server = require('../server');
const mock = require('mock-fs'); //нужен для эмуляции файловой системы
const fs = require("fs");

//describe - блок, который содержит it - более мелкие блочки тестов
describe("GET/POST server", () => {
    //условие перед выполнением теста, тоже может быть асинхронным
    before(done => {
        server.listen(3000, '127.0.0.1', done);
    });

    //условие после выполнением теста
    after(done => {
        server.close(done);
    });

    //перед каждым тестом it в этом блоке
    beforeEach(() => {
        let files = {
            [`${config.get('publicRoot')}/index.html`]: '<html></html>',
            [`${config.get('publicRoot')}/test.gif`]: '1б'.repeat(10000),
            '/test.jpg': '1б'.repeat(10000),
            '/test.gif': '1'.repeat(10000)
        };
        mock(files);
    });

    afterEach(() => {
        mock.restore();
    });

    describe("GET", () => {

        let url = 'http://localhost:3000/index.html';
        let nestedUrl = 'http://localhost:3000/nested/index.html';

        it("if /file exists then GET /file returns it", (done) => {
            request(url, function(error, response, body) {
                if (error) return done(error);
                response.statusCode.should.be.equal(200);
                body.should.not.be.empty;
                done();
            });
        });

        it("if path is nested then 400", (done) => {
            request(nestedUrl, function(error, response, body) {
                if (error) return done(error);
                response.statusCode.should.be.equal(400);
                done();
            });
        });

        it("if /file doesn't exist then GET returns 404", (done) => {
            request('http://localhost:3000/index132.html', function(error, response, body) {
                if (error) return done(error);
                response.statusCode.should.be.equal(404);
                done();
            });
        });


    });

    describe("POST", () => {

        it("when POST /new.jpg, saves it and returns 200", (done) => {

            let url = 'http://localhost:3000/new.jpg';
            let fstream = fs.createReadStream('/test.jpg');

            let req = request.post(url, function(err, response, body) {
                if (err) return done(err);
                response.statusCode.should.be.equal(200);
                let content1 = fs.readFileSync(config.get('publicRoot') + '/new.jpg');
                let content2 = fs.readFileSync('/test.jpg');
                let content3 = fs.readFileSync('/test.gif');
                Buffer.compare(content1, content2).should.be.equal(0);
                done();
            });

            fstream.pipe(req);
        });

        it("when POST /existing.jpg, returns 409", (done) => {

            let url = 'http://localhost:3000/test.gif';
            let fstream = fs.createReadStream('/test.gif');

            let req = request.post(url, function(error, response, body) {
                if (error) return done(error);
                response.statusCode.should.be.equal(409);
                done();
            });

            fstream.pipe(req);
        });

    });
});