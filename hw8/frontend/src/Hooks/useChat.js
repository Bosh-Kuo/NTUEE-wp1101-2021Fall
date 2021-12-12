import { useState } from "react";

// 建立連到server端的WebSocket物件
const client = new WebSocket('ws://localhost:4000')
const useChat = () => {
    const [messages, setMessages] = useState([]);
    const [status, setStatus] = useState({});

    // 用來監聽接收伺服器主動傳過來的訊息 (WebSocket 的事件共有 4 個：onopen、onerror、onclose、onmessage)
    client.onmessage = (byteString) => {
        console.log("WebSocket message event")
        const { data } = byteString;
        const [task, payload] = JSON.parse(data);
        switch (task) {
            case "output": {
                setMessages(() =>
                    [...messages, payload]); //本來[...messages, ...payload]會有payload is not iterable的error
                break;
            }
            case "status": {
                setStatus(payload);
                break;
            }
            case "init": {
                setMessages(() => payload);
                break;
            }
            case "cleared": {
                setMessages([]);
                break;
            }

            default: break;
        }
    }

    // 將JS object轉成byte stream透過WebSocket傳資料給server WebSocket API，methods 有2個：send、close。 send 就是發訊息，close 就是關閉跟 WS Server 的連結。
    const sendData = (data) => {
        client.send(JSON.stringify(data));
    }

    // client端打包["input", payload]成data，呼叫sendData，(payload={name, body})
    const sendMessage = (payload) => {
        sendData(['input', payload]);
    }

    // client端打包["clear"]成data，呼叫sendData
    const clearMessages = () => {
        sendData(["clear"]);
    };

    return {
        status,
        messages,
        sendMessage,
        clearMessages
    };
};

export default useChat;
