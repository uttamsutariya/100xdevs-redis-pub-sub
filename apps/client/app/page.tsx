"use client";
import { useState } from "react";
import { useSocket } from "../context/SocketContext";
import classes from "./page.module.css";

export default function HomePage() {
    const { sendMessage, messages } = useSocket();
    const [message, setMessage] = useState("");

    return (
        <div className={classes["main"]}>
            <div className={classes["container"]}>
                <input value={message} onChange={(e) => setMessage(e.target.value)} className={classes["chat-input"]} placeholder="Message..." type="text" />
                <button onClick={() => sendMessage(message)} className={classes["button"]}>
                    Send
                </button>
            </div>
            <div>
                <h1>All messages will appear here</h1>
            </div>
            <div>
                {messages.map((msg, i) => {
                    return <li key={i}>{msg}</li>;
                })}
            </div>
        </div>
    );
}
