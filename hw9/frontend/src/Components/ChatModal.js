import { Modal, Form, Select } from 'antd';
import { useState } from 'react'

const ChatModal = ({ visible, setVisible, friends, handleOpenChatBox }) => {
    const [form] = Form.useForm();
    const { Option } = Select;
    const [currentFriend, setCurrentFriend] = useState('')

    // ok鍵綁定之callbackfunction
    const submitFunction = () => {
        handleOpenChatBox(currentFriend)
    }

    // 取消鍵綁定之callback function
    const onCancel = () => {
        setVisible(false)
    }
    return (
        <Modal
            visible={visible}
            title='Create a new ChatRoom' // 對話筐標題
            okText='Create' cancelText='Cancel'  // ok鍵與取消鍵文字
            onCancel={onCancel}  //取消鍵綁定之callback function
            onOk={submitFunction}  // ok鍵綁定之callbackfunction
        >
            <Form form={form} layout='vertical' name='form_in_modal'>
                <Form.Item
                    name='friendName' label='Friend List' // 標格元素標題
                    rules={[{
                        required: true,
                        message: 'Error: please enter the name of person to chat',
                    },]}
                >
                    <Select
                        placeholder="選擇開啟對話的朋友"
                        onChange={(value) => { setCurrentFriend(value) }}  // 變更currentFriend
                    // allowClear
                    >
                        {/* 選項為所有朋友 */}
                        {friends.map((friend, i) => <Option value={`${friend}`} key={i}> {`${friend}`} </Option>)}

                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ChatModal;
