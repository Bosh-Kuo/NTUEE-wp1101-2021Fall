const Subscription = {
    chatBoxOpened: {
        subscribe(parent, { username }, { db, pubsub }, info) {
            return pubsub.asyncIterator(`${username}_chatBoxOpened`);
        }
    },
    chatBoxClosed: {
        subscribe(parent, { username }, { db, pubsub }, info) {
            return pubsub.asyncIterator(`${username}_chatBoxClosed`);
        }
    },
    messageReceived: {
        subscribe(parent, { username }, { db, pubsub }, info) {
            return pubsub.asyncIterator(`${username}_messageReceived`);
        }
    },
    messageRead: {
        subscribe(parent, { username }, { db, pubsub }, info) {
            return pubsub.asyncIterator(`${username}_messageRead`);
        }
    }
}



export default Subscription