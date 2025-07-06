import "./styles.css"
//local storage objects-------------
let todoData= JSON.parse(localStorage.getItem('todo'))|| [];
let projectData = JSON.parse(localStorage.getItem('project'))|| [];
//Project selectors------------------
const projectForm = document.querySelector('#project-form')
const projectTitle = document.querySelector('#project-title')
const projectBtn = document.querySelector('#project-button')
const projectList = document.querySelector('.project-list')
const allTodosBtn = document.querySelector('#all-todos')
const projectName = document.querySelector('#project-name')
//todo selectors---------------------
const todoList = document.querySelector('.todo-list')
const showFormBtn = document.querySelector('#show-form')
const todoForm = document.querySelector('#todo-form')
const todoTitle = document.querySelector('#todo-title')
const todoDescription = document.querySelector('#todo-description')
const dueDate = document.querySelector('#due-date')
const todoNotes = document.querySelector('#todo-notes')
const todoBtn = document.querySelector('#todo-button')
const todoDiv = document.querySelector('#todo-div')
//load existing storage to display--
displayTodo()
displayProject()

//add new todo function---
    function createTodo(){
        let newTitle = todoTitle.value.toLowerCase().trim('')
        let newId = `${newTitle}-${Date.now()}`
        if(newTitle === ''){
            return
        }
        const createData={
            todoTitle: newTitle,
            todoDescription: todoDescription.value,
            dueDate: dueDate.value,
            todoNotes: todoNotes.value,
            id: newId,
            completed: false
        }
        todoData.push(createData);
        saveTodoToStorage();
        displayTodo()
        reset()
        console.log('todo data------------')
        console.log(todoData)
        console.table(todoData)
    }

//add display---
function displayTodo(){
    todoDiv.innerHTML = ''
    todoData.forEach(({todoTitle, todoDescription, dueDate, todoNotes, id, completed}) => {
         todoDiv.innerHTML += `
            <div class="todo-card ${completed?'todo-complete':''}" id='${id}'>
                    <h2 class="todo-title">${todoTitle}</h2>
                    <p class="todo-description">Desc: ${todoDescription}</p>
                    <p class="todo-duedate">Due: ${dueDate}</p>
                    <p class="todo-note">Notes:<hr> ${todoNotes}</p>
                    <div class="todo-buttons">
                        <button class="complete">complete</button>
                        <button class="delete">delete</button>
                    </div>
            </div>
        `
    });
}
//add delete---UPDATE moved to event listener
// window.deleteTodo = (todoDel)=>{
//     todoDel.parentElement.parentElement.remove()
//     saveTodoToStorage()
// }

//edit todo---

//clear todo form inputs reset---
function reset(){
    todoTitle.value = ''
    todoDescription.value = ''
    dueDate.value = ''
    todoNotes.value = ''
}
// mark todo as complete or not--UPDATE Moved to eventListener---
//save to local storage---
function saveTodoToStorage(){
    localStorage.setItem('todo', JSON.stringify(todoData))
}

function saveProjectToStorage(){
    localStorage.setItem('project', JSON.stringify(projectData))
}

//event listeners---
todoForm .addEventListener('submit',(e)=>{
    e.preventDefault()
    createTodo()
})

todoDiv.addEventListener('click', (e)=>{
    if(e.target.classList.contains('delete')){
        const card = e.target.closest('.todo-card')
        const cardId = card.id
        card.remove()
        todoData = todoData.filter(todo=> todo.id !== cardId)
         saveTodoToStorage()
    }
})

todoDiv.addEventListener('click', (e)=>{
    if(e.target.classList.contains('complete')){
        const card = e.target.closest('.todo-card')
        const id = card.id
        card.classList.toggle('todo-complete')
        const todo = todoData.find(t=> t.id === id)
        if(todo){
            todo.completed = !todo.completed
            saveTodoToStorage()
        }
    }
})

//--------------------------------------------
//create project----
function createProject(){
   let newProject = projectTitle.value.toLowerCase().trim('')
   if(newProject === ''){
    return
   }
   
   let createProject = {
    projectTitle: newProject,
    projectTodos: todoData
   }
   projectData.push(createProject);

   saveProjectToStorage()
   displayProject()
   console.log('project data---------------')
   console.log(projectData)
   console.table(projectData)
}

//display project------
function displayProject(){
    projectList.innerHTML = ''
    projectData.forEach(({projectTitle}) => {
         projectList.innerHTML += `
            <p id='${projectTitle}' class='project-item'>${projectTitle} <button class='delete-project'>X</button></p>
        `
    });
}

//select specific project to display todos----

//view all todos from all projects-----
function displayAllTodos(){

}

//project Event listeners---------
projectForm .addEventListener('submit',(e)=>{
    e.preventDefault()
    createProject()
})

projectList.addEventListener('click', (e)=>{
    if(e.target.classList.contains('delete-project')){
        const card = e.target.closest('.project-item')
        const cardId = card.id
        card.remove()
        projectData = projectData.filter(project=> project.projectTitle !== cardId)
        saveProjectToStorage()
    }
})