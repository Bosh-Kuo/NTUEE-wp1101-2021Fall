import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import useChat from '../Hooks/useChat'
import { message } from 'antd'
import styled from 'styled-components';
import ChatRoom from './ChatRoom';
import SignIn from './SignIn';
import Register from './Register'

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
  const [password, setPassword] = useState('')

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
      <Router>
        <Switch>
          <Route exact path="/">
            {!signedIn ?
              <Redirect to="/login" /> :
              <ChatRoom username={username} displayStatus={displayStatus} status={status} messages={messages} sendMessage={sendMessage} clearMessages={clearMessages}></ChatRoom>
            }
          </Route>
          <Route path="/login">
            <SignIn username={username} setUsername={setUsername} setSignedIn={setSignedIn} displayStatus={displayStatus} password={password} setPassword={setPassword}></SignIn>
          </Route>
          <Route path="/register">
            <Register displayStatus={displayStatus}></Register>
          </Route>
        </Switch>
      </Router>
    </Wrapper>
  )
}

export default App
