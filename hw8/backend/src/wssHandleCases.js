import mongoose from 'mongoose';
import bcrypt from "bcrypt";
import Message from "./models/Message";
import User from "./models/User";
import ChatRoom from "./models/ChatRoom";
import { sendData, sendStatus } from "./wssSend";

const users_WS = {}
// 處理註冊
const registerCase = async (payLoad, ws) => {
    const { username, password } = payLoad;
    try {
        const existUser = await User.findOne({ username: username });  // check user
        if (!existUser) {
            //generate new password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            //create and save a new user
            const newUser = new User({
                username: username,
                password: hashedPassword,
            });
            await newUser.save();

            console.log(`${username}成功註冊`)
            sendStatus({
                mission: "register",
                type: "success",
                msg: `User: ${username} successfully established !`
            }, ws)

        } else {
            sendStatus({
                type: "exist",
                msg: `User: ${username} has already existed!`
            }, ws)
        }
    } catch (err) {
        console.log("Something error:" + err)
    }
}

// 處理登錄
const loginCase = async (payLoad, ws) => {
    const { username, password } = payLoad;
    try {
        const user = await User.findOne({ username: username });  // 搜尋該使用者
        if (!user) {
            sendStatus({
                type: "error",
                msg: `User: ${username} doesn't exist!`
            }, ws)
        } else {
            const validPassword = await bcrypt.compare(password, user.password)  // 驗證登錄密碼
            if (!validPassword) {
                sendStatus({
                    type: "error",
                    msg: "Wrong password!"
                }, ws)
            } else {
                const allUser = await User.find({})
                const friends = allUser.filter(user => user.username !== username).map(user => user.username)
                // console.log("friends:" + friends)
                console.log(`${username}成功登錄`)
                users_WS[username] = ws  // 儲存用戶ws

                sendData(['updateFriends', friends], ws)  // 回傳該使用者的freinds array
                sendStatus({
                    mission: "login",
                    type: "success",
                    msg: `${username} successfully Login!`
               }, ws)
            }
        }
    } catch (err) {
        console.log("Something error:" + err)
    }
}

// 打開ㄧchatRoom
const openChatRoomCase = async (payLoad, ws) => {
    const { username, currentFriend } = payLoad
    try {
        const user = await User.findOne({ username: username })
        const friend = await User.findOne({ username: currentFriend })
        const chatRoom = await ChatRoom.findOne({ user: { "$all": [user._id, friend._id] } })
        // console.log(user._id)
        // console.log(friend._id)
        if (!chatRoom) {
            console.log("chatRoom 不存在，創建chatRoom")
            const newChatRoom = new ChatRoom({ user: [user._id, friend._id] })
            await newChatRoom.save()
            await User.findOneAndUpdate({ username: username }, { "$push": { "chatRoom": newChatRoom._id } })
            await User.findOneAndUpdate({ username: currentFriend }, { "$push": { "chatRoom": newChatRoom._id } })
            sendData(['openChatRoom', newChatRoom._id], ws)
        } else {
            console.log(`${username}-${currentFriend} chatRoom 存在`)
            sendData(['openChatRoom', chatRoom._id], ws)  // 回傳該使用者的freinds array
        }
    } catch (err) {
        console.log("Something error:" + err)
    }
}

// 點擊ㄧchatRoom
const initCase = async (payLoad, ws) => {
    const chatRoomID = payLoad
    try {
        const chatRoom = await ChatRoom.findOne({ _id: mongoose.Types.ObjectId(chatRoomID) }).populate('messages')
        sendData(['init', chatRoom.messages], ws)
    } catch (err) {
        console.log("Something error:" + err)
    }

}

// 使用者傳送訊息
const inputCase = async (payLoad, ws) => {
    const { username, body, friend, chatRoomID } = payLoad
    try {
        const message = new Message({ sender: username, body: body })
        await message.save()
        await ChatRoom.findOneAndUpdate({ _id: mongoose.Types.ObjectId(chatRoomID) }, { "$push": { "messages": message._id } }, { new: true })
        sendData(['backToSender', message], ws)
        sendStatus({
            type: "success",
            msg: "Successfully sent one message"
        }, ws)
        sendData(['backToReceiver', {message, chatRoomID}], users_WS[friend])
        sendStatus({
            type: "success",
            msg: "Successfully receive one message"
        }, users_WS[friend])
    } catch {
        console.log('user is offline');
    }
}

// 清空聊天室對話紀錄
const deleteCase = async (payLoad, ws) => {
    const {currentChatRoomID, currentFriend} = payLoad
    try {
        await ChatRoom.findOneAndUpdate({_id: mongoose.Types.ObjectId(currentChatRoomID)}, {messages: []})
        sendData(['delete', {status: "clear"}], ws)
        sendStatus({
            type: "delete",
            msg: "Successfully clear all messages in this chat room"
        }, ws)
        sendData(['delete', {status: "clear"}], users_WS[currentFriend])
        sendStatus({
            type: "delete",
            msg: "Successfully clear all messages in this chat room"
        }, users_WS[currentFriend])
    } catch (err) {
        console.log('user is offline');
    }
    
    
}
export { registerCase, loginCase, openChatRoomCase, initCase, inputCase, deleteCase }