import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import styled from 'styled-components';
import ChatRoom from './ChatRoom';
import SignIn from './SignIn';
import Register from './Register'
import { useStatus } from "../Hooks/useStatus";


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
  const { username, setUsername, login } = useStatus()
  const [password, setPassword] = useState('')

  useEffect(() => {
    console.log("login:" + login)
    if (login) {
      localStorage.setItem(LOCALSTORAGE_KEY, username);
    } else {
      setUsername("" || saveUser)  // 將username更新為上次登錄者
    }
  }, [login])

  return (
    <Wrapper>
      <Router>
        <Switch>
          <Route exact path="/">
            {!login ?
              <Redirect to="/login" /> :
              <ChatRoom/>
            }
          </Route>
          <Route path="/login">
            {!login ?
              <SignIn password={password} setPassword={setPassword} ></SignIn> :
              <Redirect to="/" />
            }
          </Route>
          <Route path="/register">
            <Register/>
          </Route>
        </Switch>
      </Router>
    </Wrapper>
  )
}

export default App
