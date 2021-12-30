const Message = {    
    // 從 DB 取得的 sender 只是 id
    async sender(parent, args, { db }, info) {
        return await db.UserModel.findById(parent.sender);
    },
}

export default Message;