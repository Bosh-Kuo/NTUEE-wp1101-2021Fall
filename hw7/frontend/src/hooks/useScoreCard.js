import { createContext, useContext, useState } from 'react';

const ADD_MESSAGE_COLOR = '#3d84b8';
const REGULAR_MESSAGE_COLOR = '#2b2e4a';
const ERROR_MESSAGE_COLOR = '#fb3640';
const CLEAR_COLOR = '#000000'

// 把需要傳遞的資料帶入 Context，概念類似component以及要向下傳遞的props的模板，子層的元件就可以再次透過 contextType 取得新的資料
const ScoreCardContext = createContext({
  messages: [],

  addCardMessage: () => { },
  addRegularMessage: () => { },
  addErrorMessage: () => { },
  clearMessage: () => { }
});

const makeMessage = (message, color) => {
  return { message, color };
};

const ScoreCardProvider = (props) => {
  const [messages, setMessages] = useState([]);

  const addCardMessage = (message) => {
    setMessages([...messages, makeMessage(message, ADD_MESSAGE_COLOR)]);
  };

  const addRegularMessage = (...ms) => {
    setMessages([
      ...messages,
      ...ms.map((m) => makeMessage(m, REGULAR_MESSAGE_COLOR)),
    ]);
  };

  const addErrorMessage = (message) => {
    setMessages([...messages, makeMessage(message, ERROR_MESSAGE_COLOR)]);
  };
  
  //advance 
  const clearMessage = (message) => {
    setMessages([makeMessage(message, CLEAR_COLOR)]);
  };

  return (
    //；一旦使用 Context.Provider 後，就會以 <Context.Provider value={} /> 中 value 帶入的值為主。否則取到context預設的值
    <ScoreCardContext.Provider
      value={{
        messages,
        addCardMessage,
        addRegularMessage,
        addErrorMessage,
        clearMessage,
      }}
      {...props}
    />
  );
};

// useContext 中可以在 function 中使用 useContext(Context)，這等同於在 class 中使用 static contextType = Context
function useScoreCard() {
  return useContext(ScoreCardContext);
}

export { ScoreCardProvider, useScoreCard };
