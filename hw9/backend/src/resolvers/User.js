const User = {
    // 從 DB 取得的 chatBoxes 只是 id array
    chatBoxes(parent, args, { db }, info){
        return Promise.all(
            parent.chatBoxes.map((chatBoxId) =>
                db.ChatBoxModel.findById(chatBoxId)),
        );
    }
}
export default User;