import { Input } from "antd";
import { UserOutlined } from "@ant-design/icons";
import Title from "../Components/Title";
const SignIn = ({ username, setUsername, setSignedIn, displayStatus }) => (
    <>
        <Title>
            <h1>My Chat Room</h1>
        </Title>
        <Input.Search
            prefix={<UserOutlined />}
            value={username} enterButton="Sign In"
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your name"
            size="large" style={{ width: 300, margin: 50 }}
            onSearch={
                (name) => {
                    if (!name){
                        console.log("No Nmae")
                        displayStatus({
                            type: "error",
                            msg: "Missing user name",
                        });
                    }
                        
                    else {
                        console.log(name)
                        setSignedIn(true);
                    }

                }
            }
        />
    </>
);
export default SignIn;
