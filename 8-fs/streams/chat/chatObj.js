var clients = [];

exports.subscribe = (req, res) => {
    console.log("subscribe");
    clients.push(res);

    res.on("close", () => { //если соединение прерывается или destroy, то срабатывает close
        clients.splice(clients.indexOf(res), 1);
    });
};

exports.publish = (msg) => {
    console.log("publish '%s'", msg);

    clients.forEach((res) => {
        res.end(msg); //заканчиваю соединение для каждого потока
    });

    clients = [];
};

setInterval(() => {
    console.log(clients.length);
}, 3000);