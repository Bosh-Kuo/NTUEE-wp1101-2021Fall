import bcrypt from "bcrypt";

const Mutation = {
    // 處理註冊
    async createUser(parent, { username, password }, { db, pubsub }, info) {
        try {
            const existUser = await db.UserModel.findOne({ username: username });  
            if (existUser) {
                return { type: "exist", msg: `User: ${username} has already existed!` }
            } else {
                //generate new password
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);

                //create and save a new user
                const newUser = new db.UserModel({
                    username: username,
                    password: hashedPassword,
                }).save();
                console.log(`${username}成功註冊`)
                return { type: "success", msg: `User: ${username} successfully established !` }
            }
        } catch (e) {
            console.error("Something error:" + e)
        }
    },

    // 處理登入
    async login(parent, { username, password }, { db, pubsub }, info) {
        try {
            const user = await db.UserModel.findOne({ username: username });  
            if (!user) {
                return { type: "error", msg: `User: ${username} doesn't exist!` }
            } else {
                const valid = await bcrypt.compare(password, user.password)  
                if (!valid) {
                    return { type: "error", msg: "Wrong password!" }
                } else {
                    console.log(`${username}成功登入`)
                    return { type: "success", msg: `${username} successfully Login!` }
                }
            }
        } catch (e) {
            console.error("Something error:" + e)
        }
    },


    // 找到並回傳 DB 中的chatBox，若不存在，則新增並除存後回傳
    async openChatBox(parent, { username, friendName }, { db, pubsub }, info) {
        const chatBoxName = [username, friendName].sort().join('_');
        let chatBox = await db.ChatBoxModel.findOne({ chatBoxName: chatBoxName });
        if (!chatBox) {
            chatBox = await new db.ChatBoxModel({ chatBoxName: chatBoxName, user1_Unread: 0, user2_Unread: 0 }).save();
        }
        console.log("打開chatBox: "+chatBoxName)
        await db.UserModel.findOneAndUpdate({ username: username }, { "$push": { "chatBoxes": chatBox._id } })

        // 通知使用者該更新query userData了
        pubsub.publish(`${username}_chatBoxOpened`, {
            chatBoxOpened: chatBox,
        });
        return chatBox;
    },

    // 找到並移除 DB 中的User.chatBox，並回傳刪除之chatBox
    async closeChatBox(parent, { username, chatBoxName }, { db, pubsub }, info) {
        const user = await db.UserModel.findOne({ username: username });  // 搜尋該使用者
        const deletedChatBox = await db.ChatBoxModel.findOne({ chatBoxName: chatBoxName });
        const newChatBoxes = user.chatBoxes.filter(chatBox => !chatBox.equals(deletedChatBox._id));
        user.chatBoxes = newChatBoxes
        await user.save()

        // 通知使用者該更新query userData了
        pubsub.publish(`${username}_chatBoxClosed`, {
            chatBoxClosed: deletedChatBox,
        });

        return deletedChatBox
    },


    // 新增一Message data，並加到相應chatBox的 ChatBox.messages中，並更新chatBox中兩方的未讀狀況
    async sendMessage(parent, { chatBoxName, username, body }, { db, pubsub }, info) {
        const receiverName = chatBoxName.split('_')[0] === username ? chatBoxName.split('_')[1] : chatBoxName.split('_')[0]
        const user = await db.UserModel.findOne({ username: username });  // 使用者
        const newMessage = await new db.MessageModel({ sender:user, body:body });  //  新增 Message 
        const chatBox = await db.ChatBoxModel.findOne({ chatBoxName: chatBoxName });   

        chatBox.messages.push(newMessage)
        if (chatBoxName.split('_')[1] === username){
            chatBox.user1_Unread += 1
        }else if(chatBoxName.split('_')[0] === username){
            chatBox.user2_Unread += 1
        }
        await newMessage.save();
        await chatBox.save();

        // 廣播給雙方
        pubsub.publish(`${username}_messageReceived`, {
            messageReceived: chatBox,
        });

        pubsub.publish(`${receiverName}_messageReceived`, {
            messageReceived: chatBox,
        });
        return chatBox;
    },

    // 更新 ChatBox 中的未讀狀況
    async readMessage(parent, { chatBoxName, username }, { db, pubsub }, info) {
        const chatBox = await db.ChatBoxModel.findOne({ chatBoxName: chatBoxName });  
        console.log(chatBox.chatBoxName)
        if (chatBoxName.split('_')[0] === username) {
            chatBox.user1_Unread = 0;
        } else if (chatBoxName.split('_')[1] === username) {
            chatBox.user2_Unread = 0;
        }
        console.log(username + "messageRead")
        pubsub.publish(`${username}_messageRead`, {
            messageRead: chatBox,
        });
        await chatBox.save();
        return chatBox;
    }
}

export default Mutation