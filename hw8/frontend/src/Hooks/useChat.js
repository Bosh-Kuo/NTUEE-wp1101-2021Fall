import client from "../connection"

const useChat = () => {
    const sendData = (data) => {
        client.send(JSON.stringify(data));
    }
    
    const sendMessage = (payload) => {
        sendData(['input', payload]);
    }

    const clearMessages = (payload) => {
        sendData(["delete" ,payload]);
    };

    return {
        sendData,
        sendMessage,
        clearMessages,
    };
};

export default useChat;
