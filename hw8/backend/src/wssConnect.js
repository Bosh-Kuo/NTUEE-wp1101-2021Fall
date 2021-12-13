import Message from './models/Message.js';
const sendData = (data, ws) => {
    ws.send(JSON.stringify(data));
}

const sendStatus = (payload, ws) => {
    sendData(["status", payload], ws);
}

// app剛啟動時server便將資料庫最新100條message傳回client端
const initData = (ws) => {
    Message.find()
    .sort({ created_at: -1 })
    .limit(100)
    .exec((err, res) => {
        if (err) throw err
        // initialize app with existing messages
        sendData(['init', res], ws)
  })}
  

export { sendData, sendStatus, initData }
