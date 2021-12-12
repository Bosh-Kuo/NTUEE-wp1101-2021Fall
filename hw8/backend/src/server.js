import mongoose from 'mongoose';
import express from 'express'
import WebSocket from 'ws';
import http from 'http';
import dotenv from "dotenv-defaults";
import Message from './models/message'
import { sendData, sendStatus, initData } from './wssConnect'
dotenv.config();

if (!process.env.MONGO_URL) {
    console.error("Missing MONGO_URL!");
    process.exit(1);
}
mongoose.connect(process.env.MONGO_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})

const db = mongoose.connection;
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server }); // 建立WebSoccket Server

// 廣播給所有client端
const broadcastMessage = (data, status) => {
    wss.clients.forEach((client) => {
        sendData(data, client);  // 傳送原本前端傳過來的data
        sendStatus(status, client);  // 傳送status
    });
};

db.on('error', (error) => {
    throw new Error("DB connection error " + error);
});

db.once('open', () => {
    console.log('MongoDB connected!')
    wss.on('connection', (ws) => {
        console.log('One client connect to server!')

        // 將先前聊天記錄傳回client端作為初始畫面
        initData(ws);

        // 後端監聽前端傳送訊息
        ws.onmessage = async (byteString) => {

            const { data } = byteString
            const [task, payload] = JSON.parse(data)  //將byteString 轉回 JS object
            switch (task) {
                case 'input': {
                    const { name, body } = payload
                    const message
                        = new Message({ name, body })
                    try {                        
                        await message.save();  // 將client傳來的message存到DB
                    } catch (e) {
                        throw new Error
                            ("Message DB save error: " + e);
                    }

                    // 將client端傳來的payload傳回client端
                    broadcastMessage(['output', payload], {
                        type: "success",
                        msg: "Message sent."
                    });
                    break
                }
                case 'clear': {
                    Message.deleteMany({}, () => {

                        broadcastMessage(['cleared'], {
                            type: "info",
                            msg: "Message cache cleared."
                        });
                    })
                    break
                }

                default: break
            }
        }
    })

    const PORT = process.env.port || 4000
    server.listen(PORT, () => {
        console.log(`Listening on http://localhost:${PORT}`)
    })
})
