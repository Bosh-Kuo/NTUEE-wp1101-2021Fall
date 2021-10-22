const newInput = document.querySelector(".todo-app__input");
const left = document.querySelector(".todo-app__total span");
const appList = document.querySelector(".todo-app__list");
const footer = document.getElementById("todo-footer")
var itemLabelId = 0;
var completed = 0;
var todoItem = 0;

// Input元素EventListener => 當有文字輸入時，偵測輸入的字元是否為enter與輸入文字長度，若該輸入為enter且有輸入長度就createNewTodoItem
newInput.addEventListener("keypress", (e) => {
    if (e.charCode === 13 && newInput.value.length > 0){
        createNewTodoItem(newInput.value);
        newInput.value = "";
        todoItem+=1;
    }
})

// todoList監聽 => 點擊若該元素為checked，left item -1，反之+1，若在active狀態點擊後要變completed，若在complteted狀態，點擊後要變active
appList.addEventListener("click", (e) => {
    var h1 = e.target.parentElement.nextElementSibling;
    // 因為在 label 標籤包覆 checkbox 的情況下，我們去點擊了 label 觸發 click 事件，此時瀏覽器會自動把這個 click 事件帶給 checkbox，引此會觸發兩次事件。因此要限定僅在input tag觸發才做動作。
    if (e.target.tagName=="INPUT"){
        if(e.target.checked){
            if (document.querySelector('#active').classList.contains("on")) {
                e.target.parentElement.parentElement.classList.add('hidden');
            }
            h1.classList.add("completed");
            updateLeft(-1);
            upadteCompleted(1);
        }else{
            if (document.querySelector('#completed').classList.contains("on")) {
                e.target.parentElement.parentElement.classList.add('hidden');
            }
            h1.classList.remove("completed");
            updateLeft(1);
            upadteCompleted(-1);
        }
    }  
})

// todoList監聽 => 點擊若該元素為img（x符號），檢查此欄是否為checked，若不為checked，刪除此欄再left item -1，並檢查是否要隱藏footer
appList.addEventListener("click", (e) => {
    if (e.target.tagName=="IMG"){
        // todoItem -=1;
        let checked = (e.target.parentElement.querySelector('input').checked);
        removeTodoItem(e.target.parentElement);
        if (!checked){
            updateLeft(-1);
        }else{
            upadteCompleted(-1);
        }
        checkTodoItiem();
    }
})

// footer監聽 => 點擊若該元素為button，讓此按鈕經過filter，並且將class="on"移到此button上
footer.addEventListener("click", (e)=>{
    if (e.target.tagName == "BUTTON"){
        filter(e.target);
        const buttons = e.target.parentElement.querySelectorAll("button");
        buttons.forEach(button => button.classList.remove("on"));
        e.target.classList.add("on");
    }
})

// input輸入文熾，新增一欄todo，若目前Completed按鈕為按下的狀態，就在todo元素加上class = "hidden"，以CSS控制其不顯示，
// 並將新增的todo元素加入ul母元素，並更新left以及移除footer class=hidden
function createNewTodoItem(inputText){
    const li_elenent = document.createElement("li");
    li_elenent.classList.add("todo-app__item");
    li_elenent.innerHTML = `
    <div class="todo-app__checkbox">
    <input id="${itemLabelId}" type="checkbox">
    <label for="${itemLabelId}"></label>
    </div>
    <h1 class="todo-app__item-detail">${inputText}</h1>
    <img src="./img/x.png" class="todo-app__item-x">`;
    itemLabelId += 1;
    if (document.querySelector('#completed').classList.contains("on")) {
        li_elenent.classList.add('hidden');
    }
    appList.appendChild(li_elenent);
    updateLeft(1);
    footer.classList.remove("hidden");
}

function updateLeft(i){
    left.innerText = Number(left.innerText) + i ;
}

function upadteCompleted(i){
    completed += i;
    const clearButton = footer.querySelector(".todo-app__clean button");
    if (completed == 0){
        clearButton.classList.add("hidden");
    }else{
        clearButton.classList.remove("hidden");
    }
}

function removeTodoItem(element){
    todoItem -= 1;
    element.remove();
}

// 若left = 0，隱藏footer並重置button class="on"未至於 #all
function checkLeft(){
    if (left.innerText == 0){
        footer.classList.add("hidden");
        initializeButtons();
    }
}

function checkTodoItiem(){
    if (todoItem == 0){
        footer.classList.add("hidden");
        initializeButtons();
    }
}

// 根據button id將todo欄加上或移除class="hidden"
function filter(element){
    const li_elements = appList.querySelectorAll("li");
    if(element.id == "all"){
        li_elements.forEach(li => {
            li.classList.remove("hidden");
        })
    }else if(element.id == "active"){
        li_elements.forEach(li => {
            if (li.querySelector("input").checked)
                li.classList.add("hidden");
            else
                li.classList.remove("hidden");
        })
    }else if(element.id == "completed"){
        li_elements.forEach(li => {
            if (li.querySelector("input").checked)
                li.classList.remove("hidden");
            else
                li.classList.add("hidden");
        })
    }else{
        li_elements.forEach(li => {
            if (li.querySelector("input").checked){
                removeTodoItem(li);
                upadteCompleted(-1);
            }
        })
        checkLeft();
    }
}

function initializeButtons(){
    const buttons = document.querySelectorAll(".todo-app__view-buttons button");
    buttons.forEach(button => {
        if (button.id == "all"){
            button.classList.add("on");
        }else{
            button.classList.remove("on");
        }
    })
}

