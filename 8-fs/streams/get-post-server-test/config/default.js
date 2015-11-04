var path = require('path');

var projectRoot = path.dirname(__dirname);

//console.log(projectRoot); //C:\Projects\NODE\node\8-fs\streams\get-post-server-test
//console.log(__dirname); //C:\Projects\NODE\node\8-fs\streams\get-post-server-test\config
//console.log(__filename); //C:\Projects\NODE\node\8-fs\streams\get-post-server-test\config\default.js

module.exports = {
    projectRoot,
    publicRoot: path.join(projectRoot, 'public'),
    port: 2000,
    host: '127.0.0.1'
};