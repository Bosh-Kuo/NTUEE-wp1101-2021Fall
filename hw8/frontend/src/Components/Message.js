import styled from 'styled-components';

const MessageElement = styled.div`
    display: flex;
    flex-direction: row;
    padding-top: 10px;
    min-height: 40px;
    line-height: 30px;
    justify-content: ${(props) =>
        props.username === props.message.sender ? "flex-end" : "flex-start"
    }
`

const ContentElement = styled.div`
    background-color: #e8e5e5;
    color: #6a6767;
    padding-left: 9px;
    padding-right: 9px;
    border-radius: 5px;
    max-width: 300px;
    overflow-wrap: break-word;
`
const SenderElement = styled.div`
    padding-left: 6px;
    padding-right: 6px;
    font-weight: bold;
`

const Message = ({ message, username }) => {
    return (
        username === message.sender ?
            <MessageElement message={message} username={username}>
                <ContentElement> {message.body}  </ContentElement>
                <SenderElement>{message.sender}</SenderElement>

            </MessageElement> :
            <MessageElement message={message} username={username}>
                <SenderElement>{message.sender}</SenderElement>
                <ContentElement> {message.body}  </ContentElement>
            </MessageElement>
    )

}

export default Message