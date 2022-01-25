import Title from '../Components/Title'
import Message from '../Components/Message'
import MessageWrapper from '../Components/MessageWrapper'
import ChatModal from "../Components/ChatModal"
import { Input, Tabs, Button } from 'antd'
import { useState, useEffect, useRef } from 'react'
import { useStatus } from "../Hooks/useStatus"
import useChat from '../Hooks/useChat';
import client from "../connection";



const { TabPane } = Tabs;
const ChatRoom = () => {
    const bodyRef = useRef(null)
    const messageRef = useRef(null)
    const { sendData, sendMessage, clearMessages } = useChat()
    const { username, currentFriend, setCurrentFriend, currentChatRoomID, setCurrentChatRoomID, displayStatus } = useStatus()
    const [tags, setTags] = useState([])  // 標籤訊息
    const [body, setBody] = useState('')  // 輸入框文字
    const [visible, setVisible] = useState(false)
    const [messages, setMessages] = useState([])
    const [activeKey, setActiveKey] = useState('')

    // 監聽後端傳來的訊息
    client.onmessage = (byteString) => {
        console.log("WebSocket message event")
        const { data } = byteString
        const [task, payLoad] = JSON.parse(data)
        switch (task) {
            case "openChatRoom":  // payLoad =  chatRoomID 
                setTags([...tags, { title: currentFriend, content: '', key: payLoad }])
                getChatRoom(payLoad)  // 當確認成功開啟新的tag，便可轉移activeKey並初始化該聊天室
                break;

            case "init":  // payLoad = messages
                setMessages(payLoad)
                break;

            case "backToSender":
                setMessages([...messages, payLoad])  // payLoad = message
                break;

            case "backToReceiver":  //payLoad = {message, chatRoomID}
                if (payLoad.chatRoomID === currentChatRoomID) {
                    setMessages([...messages, payLoad.message])
                }
                break;
            case "delete":
                if (payLoad.status === 'clear') {
                    setMessages([])
                }
            case "status":
                displayStatus(payLoad)
                break;
            default:
                break;
        }
    }

    // 變更chatRoom並向後端傳出chatRoomKey，用於切換不同tag、移除tag與新增tag時
    const getChatRoom = (key) => {
        const indexOfTargetKey = tags.findIndex(tag => tag.key === key)  // 找出targetKey在tags中的index，若不存在回傳值為-1  (新增tag時)
        if (indexOfTargetKey !== -1) setCurrentFriend(tags[indexOfTargetKey].title)  // 更新currentFriend (排除新增tag的情境)
        setActiveKey(key)  // 變更activeKey
        setCurrentChatRoomID(key)
        sendData(['init', key])  // 將要開啟的chatRoomID傳到後端
    }

    // 新增或移除窗格
    const onEdit = (targetKey, action) => {
        if (action === "add") {
            setVisible(true)
        } else if (action === "remove") {
            const indexOfTargetKey = tags.findIndex(tag => tag.key === targetKey)  // 找出targetKey在tags中的index
            if (indexOfTargetKey !== 0) {
                getChatRoom(tags[indexOfTargetKey - 1].key)  // 轉換到前一個tag
            } else {
                if (tags.length === 1) {  // 若要移除的為最後一個tag，將畫面重置到最初樣子
                    setActiveKey('')
                    setCurrentChatRoomID('')
                    setMessages([])
                } else {
                    getChatRoom(tags[indexOfTargetKey + 1].key)  // 轉換到後一個tag
                }
            }
            const newTags = tags.filter(tag => tag.key !== targetKey)  // 濾掉targetKey相同的tag
            setTags(newTags)
        }
    }

    // 清除聊天室messages
    const onDelete = () => {
        if (currentChatRoomID && currentFriend) {
            clearMessages({ currentChatRoomID, currentFriend })
        }
    }

    useEffect(() => {
        console.log(messageRef.current)
        if (messageRef.current) {
            messageRef.current.scrollIntoView();
        }

    }, [messages])


    return (
        <>
            <Title>
                <h1>{username}'s Chat Room</h1>
                <Button type="primary" danger size="large"
                    onClick={onDelete}>
                    Clear
                </Button>
            </Title>
            <MessageWrapper  >
                <Tabs
                    type='editable-card'
                    onEdit={onEdit}
                    activeKey={activeKey}
                    onChange={getChatRoom}  // 變更currentChatRoomID

                >
                    {tags.map(
                        ({ title, key, closable }) => {
                            return (
                                <TabPane tab={title} key={key} closable={closable} style={{ overflow: "auto" }}>
                                    {messages.map((message, i) => <Message message={message} username={username} key={i} />)}
                                    <div ref={messageRef}></div>
                                </TabPane>
                            )
                        })
                    }
                </Tabs>
            </MessageWrapper>

            <ChatModal visible={visible} setVisible={setVisible} tags={tags} setTags={setTags}></ChatModal>

            <Input.Search
                ref={bodyRef}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                enterButton="Send"
                placeholder="Type a message here..."
                onSearch={(msg) => {
                    if (!msg || !username || !currentFriend || !currentChatRoomID) {
                        displayStatus({
                            type: 'error',
                            msg: 'Please open a chat room and or enter message body.'
                        })
                        setBody('')
                    } else {
                        sendMessage({ username: username, body: body, friend: currentFriend, chatRoomID: currentChatRoomID })
                        setBody('')
                    }

                }}
            ></Input.Search>
        </>
    )
}
export default ChatRoom;

