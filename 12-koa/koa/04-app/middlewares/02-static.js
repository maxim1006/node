//отдает статические файлы
// Usually served by Nginx
var serve = require('koa-static');
var path = require("path");
//console.log(path.join(__dirname, '..', 'public'));
module.exports = serve(path.join(__dirname, '..', 'public'));

