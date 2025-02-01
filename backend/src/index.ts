import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

interface User {
    socket: WebSocket;
    room: string;   
}

let allSockets: User[] = [];

wss.on("connection", (socket) => {
    socket.on("message", (message) => {
        // there is no JSON obj in websocket, so the incoming values will be in string. So converting string to JSON
        const parsedMessage = JSON.parse(message as unknown as string);

        if(parsedMessage.type == "join") {
            // if the user wants to join an existing room then,
            allSockets.push({
                socket,
                room: parsedMessage.payload.roomId
            })
        }

        if(parsedMessage.type == "chat") {
            // if the user wants to send a message, then find that user's room.
            const currentUserRoom = allSockets.find((x) => x.socket == socket)?.room

            // to send message to all the sockets of that room
            for(let i = 0; i < allSockets.length; i++) {
                if(allSockets[i].room == currentUserRoom) {
                    allSockets[i].socket.send(parsedMessage.payload.message);
                }
            }
        }
    })

    // to clean up disocnnected sockets.
    socket.on("disconnect", () => {
        allSockets = allSockets.filter(x => x.socket != socket);
    })
})