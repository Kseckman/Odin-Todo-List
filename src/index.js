import "./styles.css"
//local storage objects-------------
// let todoData= JSON.parse(localStorage.getItem('todo'))|| [];
let projectData = JSON.parse(localStorage.getItem('project'))|| [];
let currentProject = 'default';
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
projectName.innerHTML = currentProject
displayCurrentProjectTodoByTitle(currentProject)
displayProject()

//add new todo function---
    function createTodo(){
        let newTitle = todoTitle.value.toLowerCase().trim('')
        let newId = `${newTitle}-${Date.now()}`
        if(newTitle === '') return
        const createData={
            todoTitle: newTitle,
            todoDescription: todoDescription.value,
            dueDate: dueDate.value,
            todoNotes: todoNotes.value,
            id: newId,
            completed: false
        }
        const project = projectData.find(p=> p.projectTitle === currentProject)
        if(project){
            project.projectTodos.push(createData);
            saveProjectToStorage();
            displayCurrentProjectTodoByTitle(currentProject)
        }
        reset()
       console.log('Current Project:', currentProject)
        console.log('All Projects:', projectData)
    }

//add display---
// function displayTodo(){
//     todoDiv.innerHTML = ''
//     todoData.forEach(({todoTitle, todoDescription, dueDate, todoNotes, id, completed}) => {
//          todoDiv.innerHTML += renderTodoCard({todoTitle, todoDescription, dueDate, todoNotes, id, completed})
//     });
// }
// html for cards
function renderTodoCard({todoTitle, todoDescription, dueDate, todoNotes, id, completed}){
    return `
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
}
//edit todo---

//clear todo form inputs reset---
function reset(){
    todoTitle.value = '';
    todoDescription.value = '';
    dueDate.value = '';
    todoNotes.value = '';
}
// mark todo as complete or not--UPDATE Moved to eventListener---
//save to local storage---

// function saveTodoToStorage(){
//     localStorage.setItem('todo', JSON.stringify(todoData))
// }

function saveProjectToStorage(){
    localStorage.setItem('project', JSON.stringify(projectData))
}


//--------------------------------------------
//create project----
function createProject(){
   let newProject = projectTitle.value.toLowerCase().trim('')
   if(newProject === '') return
 
   let createProject = {
    projectTitle: newProject,
    projectTodos: []
   }
   projectData.push(createProject);
   saveProjectToStorage()
   displayProject()
   projectTitle.value =''
//    console.log('project data---------------')
//    console.log(projectData)
//    console.table(projectData)
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

//select specific project from projectList to display todos----
function displayCurrentProjectTodo(e){
    let clickedProject = e.target.closest('.project-item')
    if(!clickedProject) return
    const title = clickedProject.id;
    displayCurrentProjectTodoByTitle(title)
}

function displayCurrentProjectTodoByTitle(title){
    todoDiv.innerHTML = '';
    projectName.innerHTML = title;
    currentProject = title;

    const project = projectData.find(p=> p.projectTitle === title);
    if(!project || !Array.isArray(project.projectTodos)) return;

    project.projectTodos.forEach((todo) => {
    todoDiv.innerHTML += renderTodoCard(todo)
    })
}
//view all todos from all projects-----
function displayAllTodos(){

}

//todo form submit-----------------
todoForm .addEventListener('submit',(e)=>{
    e.preventDefault()
    createTodo()
})

//delete todo----------------------
todoDiv.addEventListener('click', (e)=>{
    if(e.target.classList.contains('delete')){
        const card = e.target.closest('.todo-card')
        const cardId = card.id
        card.remove()

        const project = projectData.find(p=> p.projectTitle === currentProject)
        if(project){
            project.projectTodos = project.projectTodos.filter(todo=> todo.id !== cardId)
            saveTodoToStorage()
        }
    }
})
//complete todo css indicator-----
todoDiv.addEventListener('click', (e)=>{
    if(e.target.classList.contains('complete')){
        const card = e.target.closest('.todo-card')
        const id = card.id
        card.classList.toggle('todo-complete')
        const project = projectData.find(p=> p.projectTitle === currentProject)
        if(project){
            const todo = project.projectTodos.find(t=> t.id === id)
            if(todo){
                todo.completed = !todo.completed
                saveTodoToStorage()
            }
        }
    }
})

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
        projectName.innerHTML = 'default'
        currentProject = 'default'
    }
})

projectList.addEventListener('click', displayCurrentProjectTodo)