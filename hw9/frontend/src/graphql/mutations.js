import { gql } from "@apollo/client";

export const CREATE_USER_MUTATION = gql`
  mutation CreateUser($username: String!, $password: String!) {
    createUser(username: $username, password: $password) {
        type
        msg
    }
  }
`

export const LOGIN_MUTATION = gql`
    mutation Login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            type
            msg
        }
    }
`

export const OPEN_CHATBOX_MUTATION = gql`
    mutation OpenChatBox($username: String!, $friendName: String!){
        openChatBox(username: $username, friendName: $friendName){
            chatBoxName
        }
    }
`

export const CLOSE_CHATBOX_MUTATION = gql`
    mutation CloseChatBox($username: String!, $chatBoxName: String!){
        closeChatBox(username: $username, chatBoxName: $chatBoxName){
            chatBoxName
        }
    }
`

export const SEND_MESSAGE_MUTATION = gql`
    mutation SendMessage($chatBoxName: String!, $username:String!, $body:String!){
        sendMessage(chatBoxName: $chatBoxName, username: $username, body: $body){
            chatBoxName
        }
    }
`

export const READ_MESSAGE_MUTATION = gql`
    mutation ReadMessage($chatBoxName: String!, $username:String!){
        readMessage(chatBoxName: $chatBoxName, username: $username){
            chatBoxName
        }
    }
`