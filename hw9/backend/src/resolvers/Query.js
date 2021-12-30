const Query = {
    // 找出並回傳 DB 中的 User 資料，若不存在於 DB，則創建並儲存 User 後回傳
    async user(parent, { username }, { db }, info) {
        // check DB
        if (!db) {
            console.error('DB error!');
            throw new Error('Please connect to DB!');
        }
        // check argument
        if (!username) {
            throw new Error('Please fill in required field: name');
        }
        const user = await db.UserModel.findOne({ username });
        if (!user) {
            return await new db.UserModel({ username }).save()
        }
        user.chatBoxes = []
        await user.save()
        return user;
    },

    // 找出並回傳DB中除了使用者外的朋友（名字）名單 array
    async friends(parent, { username }, { db }, info) {
        const allUser = await db.UserModel.find({})
        const friends = allUser.filter(user => user.username !== username).map(user => user.username)
        return friends
    }
}

export default Query