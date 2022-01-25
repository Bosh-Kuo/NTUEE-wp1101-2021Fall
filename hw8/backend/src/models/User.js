import mongoose from "mongoose";

const Schema = mongoose.Schema;
const UserSchema = new Schema({
    username: {
        type: String,
        required: [true, 'UserName field is required.']
    },
    password: {
        type: String,
        required: [true, 'Password field is required.']
    },
    chatRoom: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'ChatRoom'
    }]
})

const User = mongoose.model('User', UserSchema)
export default User;
