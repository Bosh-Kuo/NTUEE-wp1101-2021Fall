import mongoose from "mongoose";

const Schema = mongoose.Schema;
const RoomSchema = new Schema({
    user: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    messages: [{type: mongoose.Schema.Types.ObjectId, ref: 'Message' }]
})

const ChatRoom = mongoose.model('ChatRoom', RoomSchema)
export default ChatRoom;