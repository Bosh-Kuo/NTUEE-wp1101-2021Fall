import React, { Component } from 'react';
import Header from './components/Header';
import TodoList from './components/TodoList'
import Footer from './components/Footer'


class App extends Component {
  state = {
    todoItem: 0,
    left: 0,
    completed: 0,
    buttonState: "all"
  };

  // 若todoItem被刪光就隱藏footer
  updateTodoItem = (i) => {
    this.setState(state => ({ todoItem: state.todoItem + i }),
      () => {
        const footer = document.getElementById("todo-footer");
        if (this.state.todoItem === 0) {
          footer.classList.add("hidden");
        } else {
          footer.classList.remove("hidden");
          footer.querySelectorAll("button").forEach(button => {
            if (button.id === "all") {
              button.classList.add("on");
            } else {
              button.classList.remove("on");
            }
          })
        }
      });
  }

  updateLeft = (i) => {
    this.setState(state => ({ left: state.left + i }));
  }

  removeTodoItem = (element) => {
    element.remove();
    this.updateTodoItem(-1);
  }

  updatebuttonState = (button) => {
    this.setState(state => ({ buttonState: button }));
  }

  updateCompleted = (i) => {
    this.setState(state => ({ completed: state.completed + i }),
      () => {
        const clearButton = document.querySelector(".todo-app__clean button");
        console.log(this.state.completed);
        if (this.state.completed === 0) {
          clearButton.classList.add("hidden");
        } else {
          clearButton.classList.remove("hidden");
        }
      }
    );
  }


  render() {
    return (
      <div className="todo-app__root">
        <Header />
        <TodoList
          updateTodoItem={this.updateTodoItem}
          updateLeft={this.updateLeft}
          removeTodoItem={this.removeTodoItem}
          buttonState={this.state.buttonState}
          updateCompleted={this.updateCompleted}

        />
        <Footer
          left={this.state.left}
          removeTodoItem={this.removeTodoItem}
          updatebuttonState={this.updatebuttonState}
          buttonState={this.state.buttonState}
          updateCompleted={this.updateCompleted}
        />
      </div>
    );
  }
}

export default App;
