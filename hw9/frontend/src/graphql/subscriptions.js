import { gql } from "@apollo/client";

export const CHATBOX_OPEND_SUBSCRIPTION = gql`
    subscription chatBoxOpened($username: String!){
        chatBoxOpened(username:$username){
            chatBoxName
            messages{
                sender{
                    username
                }
                body
            }
            user1_Unread
            user2_Unread
        }
    }
`

export const CHATBOX_CLOSED_SUBSCRIPTION = gql`
subscription chatBoxClosed($username: String!){
    chatBoxClosed(username:$username){
        chatBoxName
        messages{
            sender{
                username
            }
            body
        }
        user1_Unread
        user2_Unread
    }
}
`

export const  MESSAGE_RECEIVED_SUBSCRIPTION = gql`
subscription MessageReceived($username: String!){
    messageReceived(username:$username){
        chatBoxName
        messages{
            sender{
                username
            }
            body
        }
        user1_Unread
        user2_Unread
    }
}
`

export const  MESSAGE_READ_SUBSCRIPTION = gql`
subscription MessageRead($username: String!){
    messageRead(username:$username){
        chatBoxName
        messages{
            sender{
                username
            }
            body
        }
        user1_Unread
        user2_Unread
    }
}
`