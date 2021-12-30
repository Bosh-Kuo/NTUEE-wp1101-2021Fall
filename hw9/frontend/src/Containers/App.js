import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import styled from 'styled-components';
import ChatRoom from './ChatRoom';
import SignIn from './SignIn';
import Register from './Register'
import { message } from 'antd'

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
  const [username, setUsername] = useState('')
  const [loginStatus, setLoginStatus] = useState(false)
  
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

  useEffect(() => {
    console.log("login:" + loginStatus)
    if (loginStatus) {
      localStorage.setItem(LOCALSTORAGE_KEY, username);
    } else {
      setUsername("" || saveUser)  // 將username更新為上次登錄者
    }
  }, [loginStatus])

  return (
    <Wrapper>
      <Router>
        <Switch>
          <Route exact path="/">
            {!loginStatus ?
              <Redirect to="/login" /> :
              <ChatRoom displayStatus={displayStatus} username={username}/>
            }
          </Route>
          <Route path="/login">
            {!loginStatus ?
              <SignIn displayStatus={displayStatus} username={username} setUsername={setUsername} loginStatus={loginStatus} setLoginStatus={setLoginStatus}></SignIn> :
              <Redirect to="/" />
            }
          </Route>
          <Route path="/register">
            <Register displayStatus={displayStatus} username={username} setUsername={setUsername}/>
          </Route>
        </Switch>
      </Router>
    </Wrapper>
  )
}

export default App
