import Title from '../Components/Title'
import Message from '../Components/Message'
import MessageWrapper from '../Components/MessageWrapper'
import ChatModal from "../Components/ChatModal"
import BadgeTab from '../Components/BadgeTab'
import { Input, Tabs } from 'antd'
import { useState, useEffect, useRef } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks';
import {
    USER_QUERY, FRIENDS_QUERY, OPEN_CHATBOX_MUTATION, CHATBOX_OPEND_SUBSCRIPTION,
    CLOSE_CHATBOX_MUTATION, CHATBOX_CLOSED_SUBSCRIPTION, SEND_MESSAGE_MUTATION,
    MESSAGE_RECEIVED_SUBSCRIPTION, READ_MESSAGE_MUTATION, MESSAGE_READ_SUBSCRIPTION
} from '../graphql'

const { TabPane } = Tabs;
const ChatRoom = ({ displayStatus, username }) => {
    const bodyRef = useRef(null)
    const messageRef = useRef(null)
    const [body, setBody] = useState('')  // 輸入框文字
    const [visible, setVisible] = useState(false)  // 控制對話框
    const [activeKey, setActiveKey] = useState('')  // 以chatBoxName命名

    const {
        loading: userLoading,
        error: userError,
        data: userData,
        subscribeToMore: userSubscription,
    } = useQuery(USER_QUERY, { variables: { username: username } });
    const {
        loading: friendLoading,
        error: friendError,
        data: friendsData
    } = useQuery(FRIENDS_QUERY, { variables: { username: username } });
    const [openChatBox] = useMutation(OPEN_CHATBOX_MUTATION)
    const [closeChatBox] = useMutation(CLOSE_CHATBOX_MUTATION)
    const [sendMessage] = useMutation(SEND_MESSAGE_MUTATION)
    const [readMessage] = useMutation(READ_MESSAGE_MUTATION)


    // 登入自動打開第一個chatBox
    useEffect(() => {
        if (userLoading === false && userData.user.chatBoxes.length > 0) {
            updateChatBox(userData.user.chatBoxes[0].chatBoxName)
        }
    }, [userLoading])

    const updateChatBox = (chatBoxName) => {
        setActiveKey(chatBoxName)
        if (chatBoxName !== '') {
            console.log("呼叫後端update unread")
            setTimeout(() => {
                readMessage({
                    variables: {
                        username: username,
                        chatBoxName: chatBoxName,
                    },
                });
            }, 1500);
        }
    }

    // 檢查chatBox是否已經開啟，是的話回傳true
    const checkChatBox = (friendName) => {
        const newChatBoxName = [username, friendName].sort().join('_');
        const exist = userData.user.chatBoxes.some(chatBox => chatBox.chatBoxName === newChatBoxName)
        return exist
    }

    // 新增chatBox按鈕
    const handleOpenChatBox = async (friendName) => {
        if (checkChatBox(friendName)) {
            displayStatus({
                type: "error",
                msg: "ChatRoom has been opend!"
            })
        } else {
            const chatBoxPayLoad = await openChatBox({
                variables: {
                    username: username,
                    friendName: friendName
                },
            });
            setVisible(false)
            updateChatBox(chatBoxPayLoad.data.openChatBox.chatBoxName)
        }
    }

    // 打開新chatBox同步更新userData.user.chatBoxes
    useEffect(() => {
        userSubscription({
            document: CHATBOX_OPEND_SUBSCRIPTION,
            variables: { username: username },
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev;
                const { data: { chatBoxOpened } } = subscriptionData
                return {
                    user: {
                        ...prev.user,
                        chatBoxes: [...prev.user.chatBoxes, chatBoxOpened],
                    },
                }
            }
        })
    }, [userSubscription])


    // 新增或移除窗格
    const onEdit = async (targetKey, action) => {
        if (action === "add") {
            setVisible(true)
        } else if (action === "remove") {
            const indexOfTargetKey = userData.user.chatBoxes.findIndex(chatBox => chatBox.chatBoxName === targetKey)  // 找出targetKey在tags中的index
            if (indexOfTargetKey !== 0) {
                // 轉換到前一個tag
                updateChatBox(userData.user.chatBoxes[indexOfTargetKey - 1].chatBoxName)
            } else {
                // 若要移除的為最後一個tag，將畫面重置到最初樣子
                if (userData.user.chatBoxes.length === 1) {
                    updateChatBox('')
                } else {
                    // 轉換到後一個tag
                    updateChatBox(userData.user.chatBoxes[indexOfTargetKey + 1].chatBoxName)
                }
            }
            await closeChatBox({
                variables: {
                    username: username,
                    chatBoxName: targetKey
                }
            })
        }
    }

    // 關閉chatBox同步更新userData.user.chatBoxes
    useEffect(() => {
        userSubscription({
            document: CHATBOX_CLOSED_SUBSCRIPTION,
            variables: { username: username },
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev;
                const { data: { chatBoxClosed } } = subscriptionData
                const newChatBoxes = prev.user.chatBoxes.filter(chatBox => chatBox.chatBoxName !== chatBoxClosed.chatBoxName)
                return {
                    user: {
                        ...prev.user,
                        chatBoxes: [...newChatBoxes],
                    },
                }
            }
        })
    }, [userSubscription])


    // 傳送訊息後同步更新兩邊使用者的userData.user.chatBoxes
    useEffect(() => {
        console.log("activeKey "+activeKey)
        userSubscription({
            document: MESSAGE_RECEIVED_SUBSCRIPTION,
            variables: { username: username },
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev;
                const { data: { messageReceived } } = subscriptionData
                const newChatBoxes = prev.user.chatBoxes.map(chatBox => {
                    if (chatBox.chatBoxName !== messageReceived.chatBoxName) {
                        return chatBox
                    } else {
                        return messageReceived  // 於後端被更新的chatBox
                    }
                })

                return {
                    user: {
                        ...prev.user,
                        chatBoxes: [...newChatBoxes],
                    },
                }
            }
        })
    }, [userSubscription])

    // 更新DB中使用者未讀狀態後更新前端的userData.user.chatBoxes
    useEffect(() => {
        userSubscription({
            document: MESSAGE_READ_SUBSCRIPTION,
            variables: { username: username },
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev;
                const { data: { messageRead } } = subscriptionData
                console.log(username + " Read Subscription")
                const newChatBoxes = prev.user.chatBoxes.map(chatBox => {
                    if (chatBox.chatBoxName !== messageRead.chatBoxName) {
                        return chatBox
                    } else {
                        return messageRead  // 於後端被更新的chatBox
                    }
                })
                return {
                    user: {
                        ...prev.user,
                        chatBoxes: [...newChatBoxes],
                    },
                }
            }
        })
    }, [userSubscription])

    // 自動滑動至最新留言
    useEffect(() => {
        console.log(messageRef.current)
        if (messageRef.current) {
            messageRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'end',
                inline: 'nearest'
            })
        }
    }, [userData, activeKey])

    // 未讀取數量標籤
    const badgeTab = (chatBoxName, friendName, unRead) => {
        return chatBoxName === activeKey ? friendName : <BadgeTab friendName={friendName} unRead={unRead}/>
        // return <BadgeTab friendName={friendName} unRead={unRead} />
    }

    const unReadLine = <>------------------------UNREAD MESSAGES------------------------</>

    if (userLoading || friendLoading) {
        return <h1>loading chat history...</h1>
    } else if (userError || userError) {
        return <h1>Error...</h1>
    }

    return (
        <>
            <Title>
                <h1>{username}'s Chat Room</h1>
            </Title>
            <MessageWrapper  >
                <Tabs
                    type='editable-card'
                    onEdit={onEdit}
                    activeKey={activeKey}
                    onChange={(key) => { updateChatBox(key) }}  // 變更currentChatRoomID
                >
                    {userData.user.chatBoxes.map(
                        ({ chatBoxName, messages, user1_Unread, user2_Unread }) => {
                            const friendName = chatBoxName.split('_')[0] === username ? chatBoxName.split('_')[1] : chatBoxName.split('_')[0]
                            const unRead = chatBoxName.split('_')[0] === username ? user1_Unread : user2_Unread
                            return (
                                <TabPane tab={badgeTab(chatBoxName, friendName, unRead)} key={chatBoxName} closable={true} style={{ overflow: "auto" }}>
                                    {
                                        messages.map((message, i) => {
                                            if (messages.length - i === unRead) {
                                                return <>{unReadLine}<Message message={message} username={username} key={i} /></>
                                            } else {
                                                return <Message message={message} username={username} key={i} />
                                            }

                                        })
                                    }
                                    <div ref={messageRef}></div>
                                </TabPane>
                            )
                        })
                    }
                </Tabs>
            </MessageWrapper>

            <ChatModal
                visible={visible} setVisible={setVisible}
                friends={friendsData.friends}
                handleOpenChatBox={handleOpenChatBox}
            >
            </ChatModal>

            <Input.Search
                ref={bodyRef}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                enterButton="Send"
                placeholder="Type a message here..."
                onSearch={
                    async (msg) => {
                        if (!msg || !username) {
                            displayStatus({
                                type: 'error',
                                msg: 'Please open a chat room and or enter message body.'
                            })
                            setBody('')
                        } else {
                            await sendMessage({
                                variables: {
                                    chatBoxName: activeKey,
                                    username: username,
                                    body: body
                                }
                            })
                            setBody('')
                        }
                    }}
            ></Input.Search>
        </>
    )
}
export default ChatRoom;

