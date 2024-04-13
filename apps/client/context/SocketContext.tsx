"use client";

import React, { useCallback, useContext, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";

interface ISocketContext {
    sendMessage: (msg: string) => void;
    messages: string[];
}

const SocketContext = React.createContext<ISocketContext | null>(null);

export const useSocket = () => {
    const state = useContext(SocketContext);
    if (!state) throw new Error("State is undefined");

    return state;
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<Socket>();
    const [messages, setMessages] = useState<string[]>([]);

    useEffect(() => {
        const _socket = io("http://localhost:8000");
        _socket.on("message", onMessageRec);
        setSocket(_socket);

        return () => {
            _socket.disconnect();
            _socket.off("message", onMessageRec);
            setSocket(undefined);
        };
    }, []);

    const onMessageRec = useCallback(
        (msg: string) => {
            console.log("Msg received from the server ::", msg);
            setMessages((prev) => [msg, ...prev]);
        },
        [socket]
    );

    const sendMessage: ISocketContext["sendMessage"] = useCallback(
        (msg) => {
            console.log("Send Message ::", msg);

            if (socket) {
                socket.emit("event:message", { message: msg });
            }
        },
        [socket]
    );

    return <SocketContext.Provider value={{ sendMessage, messages }}>{children}</SocketContext.Provider>;
};
