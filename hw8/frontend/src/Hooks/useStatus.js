import { useState, useContext, createContext } from "react";
import client from "../connection";
import { message } from 'antd'


const StatusContext = createContext({
    username: "",
    currentFriend: "",
    currentChatRoomID: "",
    friends: [],
    login: false,
    register: false,
    setUsername: () => { },
    setCurrentFriend: () => { },
    setCurrentChatRoomID: () => { },
    setFriends: () => { },
    setLogin: () => { },
    setRegister: () => { },
    displayStatus: () => { }
})

const StatusProvider = (props) => {
    const [username, setUsername] = useState('')
    const [currentFriend, setCurrentFriend] = useState('')
    const [currentChatRoomID, setCurrentChatRoomID] = useState('')
    const [friends, setFriends] = useState([])
    const [login, setLogin] = useState(false)
    const [register, setRegister] = useState(false)

    // 顯示通知
    const displayStatus = (payload) => {
        if (payload.msg) {
            const { type, msg } = payload
            const content = {
                content: msg, duration: 1.5
            }
            switch (type) {
                case 'success':
                    message.success(content)
                    break
                case 'error':
                    message.error(content)
                    break
                default:
                    message.warning(content)
            }
        }
    }

    client.onmessage = (byteString) => {
        console.log("WebSocket message event")
        const { data } = byteString
        const [task, payLoad] = JSON.parse(data)
        switch (task) {
            case "status":   // payLoad = { mission, type, msg } 
                const { mission, type, msg } = payLoad
                displayStatus({ type, msg })
                // for 登錄與註冊
                if (type === "success" && mission === "register") {
                    setRegister(true)
                } else if (type === "success" && mission === "login") {
                    setLogin(true)
                }
                break;
            case "updateFriends":  // payLoad = { friends }
                setFriends(payLoad)  
                break;
            default:
                break;
        }
    }

    return <StatusContext.Provider
        value={{
            username,
            currentFriend,
            currentChatRoomID,
            friends,
            login,
            register,
            setUsername,
            setCurrentFriend,
            setCurrentChatRoomID,
            setFriends,
            setLogin,
            setRegister,
            displayStatus
        }}{...props}
    />
}

function useStatus() {
    return useContext(StatusContext)
}

export { StatusProvider, useStatus }



