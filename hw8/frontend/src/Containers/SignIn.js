import { Input, Button } from "antd";
import { UserOutlined, EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import Title from "../Components/Title";
import { useHistory } from "react-router";
import { useStatus } from "../Hooks/useStatus";
import useChat from "../Hooks/useChat";


const SignIn = ({ password, setPassword }) => {
    const history = useHistory()
    const { sendData } = useChat()
    const { username, setUsername, displayStatus } = useStatus()
    
    const handleLogin = async () => {
        if (!username || !password) {
            displayStatus({ type: 'error', msg: 'Please input completely!' })
        } else {
            sendData(['login', { username, password }])  // 將登錄帳號密碼傳到後端
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
