import { gql } from "@apollo/client";

export const USER_QUERY = gql`
    query user(
        $username: String!
    ) {
        user(
            username: $username
        ) {
            username
            chatBoxes {
                chatBoxName
                user1_Unread
                user2_Unread
                messages {
                    sender {
                        username
                    }
                    body
                }
            }
        }
    }
`;

export const FRIENDS_QUERY = gql`
  query Friends($username: String!) {
    friends(username: $username) 
  }
`;
