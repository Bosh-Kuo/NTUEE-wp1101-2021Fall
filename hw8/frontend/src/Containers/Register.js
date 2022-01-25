import { Form, Input, Button } from "antd";
import { UserOutlined, EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import Title from "../Components/Title";
import { useHistory } from "react-router";
import { useState, useEffect } from "react";
import useChat from "../Hooks/useChat";
import {useStatus} from "../Hooks/useStatus"

const Register = () => {
    const history = useHistory()
    const { register, setRegister, displayStatus } = useStatus()
    const { sendData } = useChat()
    const [username, setUserName] = useState("")
    const [password, setPassword] = useState("")
    const [check, setCheck] = useState("")
    

    const handleSignUp = async () => {
        if (!username || !password || !check) {
            displayStatus({ type: 'error', msg: 'Please input completely!' })
        } else if (password !== check) {
            displayStatus({ type: 'error', msg: "Passwords don't match!" })
        } else {
            sendData(['register', { username, password }])  // 將註冊帳號密碼傳到後端
        }
    }

    useEffect(() => {
        console.log("register:" + register)
        if (register) {
            setRegister(false) // 將register改回fasle狀態才可再次進入 "/register" Route
            history.push('/')  // 若register成功就切換Route到 "/"下
        }
    },[register])


    return (
        <>
            <Title>
                <h1>Create Account</h1>
            </Title>
            <Form>
                <Form.Item
                    label="Username" name="username"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your username!',
                        }
                    ]}>
                    <Input
                        addonAfter={<UserOutlined />}
                        placeholder="Name"
                        value={username}
                        onChange={(e) => { setUserName(e.target.value) }}
                    />
                </Form.Item>
                <Form.Item
                    label="Password" name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                    ]}>
                    <Input.Password
                        placeholder="Password"
                        iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        value={password}
                        onChange={(e) => { setPassword(e.target.value) }}
                    />


                </Form.Item>
                <Form.Item
                    label="Password" name="check password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                    ]}>
                    <Input.Password
                        placeholder="Password again"
                        iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        value={check}
                        onChange={(e) => { setCheck(e.target.value) }}
                    />
                </Form.Item>
            </Form>


            <Button type="primary" shape="round" size="middle" style={{ width: 300, marginTop: 10 }} onClick={handleSignUp}> Sign Up </Button>
            <Button type="primary" shape="round" size="middle" style={{ width: 300, margin: 20, backgroundColor: "orange" }}
                onClick={() => {
                    history.push('/login')
                }}>
                Log into Account
            </Button>
        </>
    )
}
export default Register;