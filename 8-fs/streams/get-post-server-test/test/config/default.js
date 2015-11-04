var path = require('path');

var projectRoot = path.dirname(__dirname);

module.exports = {
    projectRoot,
    publicRoot: path.join(projectRoot, 'public'),
    port: 3000,
    host: '127.0.0.1'
};