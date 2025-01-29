import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

let userCount = 0;

wss.on("connection", (socket) => {
    userCount++;
    console.log("user connected #" + userCount);

    socket.on("message", (message) => {
        console.log("Message recieved " + message.toString());
        setTimeout(() => {
            socket.send("recieved.")
        }, 1000)
    })
})