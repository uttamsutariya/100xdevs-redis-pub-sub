import { Server } from "socket.io";
import { publisher, subscriber } from "../index";

export default class SocketService {
    private _io: Server;

    constructor() {
        console.log("Init socker server...");
        this._io = new Server({
            cors: {
                allowedHeaders: "*",
                origin: "*",
            },
        });
    }

    public async initSubscribers() {
        subscriber.subscribe("MESSAGE", (msg) => {
            console.log("Message from REDIS SUBSCRIBE ::", msg);
            this.io.emit("message", msg);
        });
    }

    public initListeners() {
        console.log("Initializing listeners...");
        const io = this._io;
        io.on("connect", (socket) => {
            console.log(`New client connected: ${socket.id}`);
            socket.on("event:message", async ({ message }: { message: string }) => {
                console.log(`Received message: ${message}`);
                // publish message to redis
                await publisher.publish("MESSAGE", message);
            });
        });
    }

    get io() {
        return this._io;
    }
}
