import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './Containers/App'
import 'antd/dist/antd.css'
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
} from '@apollo/client';
import { split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
// import { StatusProvider } from "./Hooks/useStatus"
// create http link
const httpLink = new HttpLink({
  uri: 'http://localhost:5000/',
});

// create socket
const wsLink = new WebSocketLink({
  uri: 'ws://localhost:5000/',
});

const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

ReactDOM.render(
  // <React.StrictMode>
    // <StatusProvider>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>,
    // </StatusProvider>
  // </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
