import React, { useState } from 'react'

const TodoList = (props) => {
    const updateTodoItem = props.updateTodoItem;
    const updateLeft = props.updateLeft;
    const removeTodoItem = props.removeTodoItem;
    const buttonState = props.buttonState;
    const updateCompleted = props.updateCompleted;
    

    const [text, setText] = useState("");
    const [id, changeId] = useState(0);

    const createNewTodoItem = (inputText) => {
        const appList = document.querySelector(".todo-app__list");
        const li_elenent = document.createElement("li");
        li_elenent.classList.add("todo-app__item");
        li_elenent.innerHTML = `
        <div class="todo-app__checkbox">
          <input id="${id}" type="checkbox">
          <label for="${id}"></label>
        </div>
        <h1 class="todo-app__item-detail">${inputText}</h1>
        <img src="./img/x.png" class="todo-app__item-x">`;
        // if (document.querySelector('#completed').classList.contains("on")) {
        //   li_elenent.classList.add('hidden');
        // }
        appList.appendChild(li_elenent);
        changeId(id + 1);
        updateLeft(1);
    }

    // 按下"Enter"後將創建todo item，將text設為""
    const addTodoItem = (event) => {
        if (event.key === "Enter" && text.length > 0) {
            createNewTodoItem(text);
            setText("");
            updateTodoItem(1);
        }
    }

    //點擊checkbox，更新left數
    const updateItemState = (event) => {
        if (event.target.tagName === "INPUT") {
            if (event.target.checked) {
                if (buttonState==="active"){
                    event.target.parentElement.parentElement.classList.add('hidden');
                }
                event.target.parentElement.nextElementSibling.classList.add('completed');
                updateLeft(-1);
                updateCompleted(1);
                
            } else {
                if (buttonState==="completed"){
                    event.target.parentElement.parentElement.classList.add('hidden');
                }
                event.target.parentElement.nextElementSibling.classList.remove('completed');
                updateLeft(1);
                updateCompleted(-1);   
            }
        }
    }

    // 按下(x)檢查此欄是否為checked，若不為checked，刪除此欄再left-=1
    const deleteTodoItem = (event) => {
        if (event.target.tagName === "IMG") {
            let checked = event.target.parentElement.querySelector('input').checked;
            removeTodoItem(event.target.parentElement);
            if (!checked) {
                updateLeft(-1);
            }else{
                updateCompleted(-1);   
            }
        }
    }

    return (
        <section className="todo-app__main">
            <input className="todo-app__input"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyPress={addTodoItem}
                placeholder="What needs to be done?" />


            <ul className="todo-app__list" id="todo-list"
                onClick={
                    (e) => {
                        deleteTodoItem(e);
                        updateItemState(e);
                    }}
            >
                {/* <li className="todo-app__item">
                    <div className="todo-app__checkbox">
                        <input id="1" type="checkbox" />
                        <label htmlFor="1"></label>
                    </div>
                    <h1 className="todo-app__item-detail">{`${inputText}`}</h1>
                    <img src="./img/x.png" className="todo-app__item-x" alt="" />
                </li>
                <li className="todo-app__item">
                    <div className="todo-app__checkbox">
                        <input id="1" type="checkbox" />
                        <label htmlFor="1"></label>
                    </div>
                    <h1 className="todo-app__item-detail">{`${inputText}`}</h1>
                    <img src="./img/x.png" className="todo-app__item-x" alt="" />
                </li> */}
            </ul>
        </section>
    )
}

export default TodoList;