
// Parse application/json, application/x-www-form-urlencoded
// NOT form/multipart!
//работает с потоками, на выходе this.request.body с инфой из запроса,
//файлы не обрабатывает, а если нужны файлы, то это в multipartParser
var bodyParser = require('koa-bodyparser');
module.exports = bodyParser();
