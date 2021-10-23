import React from "react";
const Footer = (props) => {
    const removeTodoItem = props.removeTodoItem;
    const updatebuttonState = props.updatebuttonState;
    const updateCompleted = props.updateCompleted;

    const filter = (event) => {
        if (event.target.tagName === "BUTTON") {
            const li_elements = document.querySelectorAll("li");

            // highlight 選到的button
            const buttons = event.target.parentElement.querySelectorAll("button");
            buttons.forEach(button => button.classList.remove("on"));
            event.target.classList.add("on");

            // 更新button state, todoItem
            updatebuttonState(event.target.id);

            if (event.target.id === "all") {
                li_elements.forEach(
                    li => {
                        li.classList.remove("hidden");
                    })
            } else if (event.target.id === "active") {
                li_elements.forEach(
                    li => {
                        if (li.querySelector("input").checked)
                            li.classList.add("hidden");
                        else
                            li.classList.remove("hidden");
                    })
            } else if (event.target.id === "completed") {
                
                li_elements.forEach(
                    li => {
                        if (li.querySelector("input").checked)
                            li.classList.remove("hidden");
                        else
                            li.classList.add("hidden");
                    })
            } else {
                li_elements.forEach(
                    li => {
                        if (li.querySelector("input").checked) {
                            removeTodoItem(li);
                            updateCompleted(-1);
                        }
                    })
            }
        }
    }
    return (
        <footer className="todo-app__footer hidden" id="todo-footer" onClick={filter}>
            <div className="todo-app__total"><span>{props.left}</span> left</div>
            <ul className="todo-app__view-buttons">
                <button type="button" id="all" className="on">All</button>
                <button type="button" id="active">Active</button>
                <button type="button" id="completed">Completed</button>
            </ul>
            <div className="todo-app__clean">
                <button type="button" className="hidden">Clear Completed</button>
            </div>
        </footer>
    )
}

export default Footer;