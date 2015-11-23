// in-memory store by default (use the right module instead)
//когда этот мв подключается, то он восстанавливает сессию из куков/базы и пишет ее в this.session
/*var session = require('koa-session');
module.exports = session();*/

// in-memory store by default (use the right module instead)
var session = require('koa-generic-session');
module.exports = session();

