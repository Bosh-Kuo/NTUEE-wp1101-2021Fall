import { Input, Button } from "antd";
import { UserOutlined, EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import Title from "../Components/Title";
import { useHistory } from "react-router";
import { useState } from "react";
import { LOGIN_MUTATION } from "../graphql"
import { useMutation } from "@apollo/client";


const SignIn = ({ displayStatus, username, setUsername, loginStatus, setLoginStatus }) => {
    const history = useHistory()
    const [password, setPassword] = useState('')
    const [login] = useMutation(LOGIN_MUTATION);

    // 點擊Login
    const handleLogin = async () => {
        if (!username || !password) {
            displayStatus({ type: 'error', msg: 'Please input completely!' })
        } else {
            const statusPayLoad = await login({
                variables: { username: username, password: password }
            })
            const type = statusPayLoad.data.login.type
            const msg = statusPayLoad.data.login.msg
            displayStatus({ type, msg })
            if (type === 'success') {
                setLoginStatus(true)
            }
        }
    }
    
    return (
        <>
            <Title>
                <h1>My Chat Room</h1>
            </Title>
            <Input
                addonAfter={<UserOutlined />}
                placeholder="Enter your name"
                size="large" style={{ width: 300, marginTop: 25, marginBottom: 10 }}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <Input.Password
                placeholder="Enter your password"
                size="large" style={{ width: 300, margin: 10 }}
                iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                value={password}
                onChange={(e) => { setPassword(e.target.value) }}
                onPressEnter={handleLogin}
            />
            <Button type="primary" shape="round" size="large" style={{ width: 300, marginTop: 10 }} onClick={handleLogin}> Login </Button>
            <Button type="primary" shape="round" size="large" style={{ width: 300, margin: 10, backgroundColor: '#00a854' }}
                onClick={() => {
                    history.push('/register')
                }}
            >
                Create a New Account
            </Button>
        </>
    )
}
export default SignIn;
