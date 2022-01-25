import mongoose from 'mongoose';
import express from 'express'
import cors from 'cors';
import WebSocket from 'ws';
import http from 'http';
import dotenv from "dotenv-defaults";
import { registerCase, loginCase, openChatRoomCase, initCase, inputCase, deleteCase } from "./wssHandleCases"

import { sendData, sendStatus, initData } from './wssSend';
dotenv.config();

// connect to MongoDB
if (!process.env.MONGO_URL) {
    console.error("Missing MONGO_URL!");
    process.exit(1);
} else {
    mongoose.connect(process.env.MONGO_URL, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    })
}

const db = mongoose.connection;  //  DB連線object
const app = express();  // 創建express server物件
const server = http.createServer(app);  // 創建http server（當需要同個http server重複運行如websocket）
const wss = new WebSocket.Server({ server });  // 將server交給 WebSocket Server開啟server服務
const PORT = process.env.port || 4000

db.on('error', (error) => {
    throw new Error("DB connection error " + error);
});

db.once('open', () => {
    console.log('MongoDB connected!')
    wss.on('connection', (ws) => {
        console.log('一使用者連線')

        // 對 message 設定監聽，接收從 Client 發送的訊息, byteString 為 client 端發來的訊息
        ws.onmessage = async (byteString) => {
            const { data } = byteString;
            const [task, payLoad] = JSON.parse(data);  //將前端傳來的byteString data轉為json data
            switch (task) {
                case 'register':
                    await registerCase(payLoad, ws)  // payLoad = {username, password}
                    break;
                case 'login':
                    await loginCase(payLoad, ws)  // payLoad = {username, password}
                    break 
                case 'openChatRoom':  // payLoad = {username, friend}
                    await openChatRoomCase(payLoad, ws)
                    break
                case 'init':  // payload = currentChatRoomID
                    await initCase(payLoad, ws)
                    break
                case 'input': // payload = { username, body, friend, chatRoomID }
                    await inputCase(payLoad, ws)
                    break
                case 'delete':
                    await deleteCase(payLoad, ws)
                    break
                default:
                    break;
            }
        }
        ws.onclose = () => {
            console.log("一使用者離線")
        }
    })

    server.listen(PORT, () => {
        console.log(`Listening on http://localhost:${PORT}`)
    })
})
