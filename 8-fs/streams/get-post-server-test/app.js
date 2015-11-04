'use strict';

const server = require('./server');
const config = require('config');

server.listen(config.get('port'), config.get('host'), () => {
    console.log(server.address());
});

