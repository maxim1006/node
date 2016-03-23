'use strict';

const server = require('./server');
const config = require('./config/default.js');

server.listen(config['port'], config['host'], () => {
    console.log(server.address());
});

