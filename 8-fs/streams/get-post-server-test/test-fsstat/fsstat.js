"use strict";

const chai = require("chai");
const expect = chai.expect;
const fs = require('mz/fs');
const co = require("co");
const path = require("path");

describe("fsstat", () => {

    it("if file exists return true", (done) => {
        let stats;

        co(function* () {
            stats = yield fs.stat(path.join(__dirname, "txt.txt"));
            expect(!!stats).to.be.true;
            done();
        })
        .catch(err => console.log(err.stack));
    });

    it("if file is directory return true", (done) => {
        let stats;

        co(function* () {
            stats = yield fs.stat(__dirname);
            expect(stats.isDirectory()).to.be.true;
            done();
        })
        .catch(err => console.log(err.stack));
    });

});

