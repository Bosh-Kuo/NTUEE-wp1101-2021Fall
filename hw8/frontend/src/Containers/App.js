import { useState, useEffect } from 'react'
import useChat from '../Hooks/useChat'
import { message } from 'antd'
import styled from 'styled-components';
import ChatRoom from './ChatRoom';
import SignIn from './SignIn';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 500px;
  margin: auto;
`;

const LOCALSTORAGE_KEY = "save-user";
function App() {
  const saveUser = localStorage.getItem(LOCALSTORAGE_KEY)
  const { status, messages, sendMessage, clearMessages } = useChat()
  const [username, setUsername] = useState(saveUser || '')
  const [signedIn, setSignedIn] = useState(false)

  const displayStatus = (payload) => {
    if (payload.msg) {
      const { type, msg } = payload
      const content = {
        content: msg, duration: 1.5
      }
      switch (type) {
        // 跳出通知視窗
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

  useEffect(() => {
    if (signedIn) {
      localStorage.setItem(LOCALSTORAGE_KEY, username);
    }
  }, [signedIn, username])

  return (
    <Wrapper>
      {!signedIn ?
        <SignIn username={username} setUsername={setUsername} setSignedIn={setSignedIn} displayStatus={displayStatus}></SignIn> :
        <ChatRoom username={username} displayStatus={displayStatus}  status={status} messages={messages} sendMessage={sendMessage} clearMessages={clearMessages}></ChatRoom>
      }
    </Wrapper>
  )
}

export default App
