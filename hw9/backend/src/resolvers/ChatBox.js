const ChatBox = {
    // 從 DB 取得的 chatBox.messages 只是 id array
    messages(parent, args, { db }, info) {
        return Promise.all(
            parent.messages.map((messageId) =>
                db.MessageModel.findById(messageId)),
        );
    },
}

export default ChatBox;