import http from "http";
import SocketService from "./services/socket";
import { createClient } from "redis";

export const publisher = createClient();
publisher.on("error", (err: Error) => console.log("PUBLISHER :: Redis client error", err));

export const subscriber = createClient();
subscriber.on("error", (err: Error) => console.log("SUBSCRIBER :: Redis client error", err));

const PORT = parseInt(process.env.PORT || "8000");
const socktService = new SocketService();
const httpServer = http.createServer();

async function startServer() {
    try {
        await publisher.connect();
        await subscriber.connect();
        console.log("Connected to Redis (PUBLISHER & SUBSCRIBER)...");

        socktService.io.attach(httpServer);

        httpServer.listen(PORT, () => {
            console.log("Http server listening on port ::", PORT);
        });

        socktService.initListeners();
        socktService.initSubscribers();
    } catch (error) {
        console.log("Failed to connect to Redis", error);
    }
}

startServer();
