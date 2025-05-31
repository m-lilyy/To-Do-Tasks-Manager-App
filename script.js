const addBtn = document.getElementById('add-btn');
const tasksList = document.getElementById('tasks-list');
const taskInput = document.getElementById('input-task');

addBtn.addEventListener('click',(e)=>{
   e.preventDefault();
   addTasks();
  });

taskInput.addEventListener('keydown',(e)=>{
   if(e.key === 'Enter'){
     e.preventDefault();
     addTasks();
   }
});

function addTasks(){
    const taskValue = taskInput.value.trim();

  if(!taskValue){
    return;  
  }
 
  const list = document.createElement('li');
     list.innerHTML  = `
     <div class='renderList'>
     <span><input type='checkbox' class='checkbox'><p>${taskValue}</p></span>
      <div class='btn'>
        <button class='edit-btn'><i class="fa-solid fa-pen"></i></button>
        <button class='delete-btn'><i class="fa-solid fa-minus"></i></button>
      </div>
     </div>
    `
     tasksList.appendChild(list);
     taskInput.value = '';
     progressUpdate();
     saveTaskstoLocal();
};

   // apply to all delete btn and select the target event
   document.addEventListener('click',(e)=>{
      if(e.target.closest('.delete-btn')){
         e.target.closest('li').remove();
         progressUpdate();
         saveTaskstoLocal();
      } 
   });

   // apply to all edit btn and select the target event
   document.addEventListener('click',(e)=>{
      if(e.target.closest('.edit-btn')){
        const task = e.target.closest('li').querySelector('p');
        const newTask = prompt("Revised task:", task.textContent);
        if(newTask?.trim()){
         task.textContent = newTask;
        }
      }
      saveTaskstoLocal();
   });

   // update progress when checkbox change
   document.addEventListener('change', (e) => { 
    if (e.target.classList.contains('checkbox')){
        progressUpdate();
        saveTaskstoLocal();
    }
});

function progressUpdate(){
   const totalTasks = document.querySelectorAll('#tasks-list li').length;
   const finishedTasks = document.querySelectorAll('#tasks-list .checkbox:checked').length; // target all checked checkbox 
   const currentTasks = `${finishedTasks} / ${totalTasks} Tasks Completed`;

   const tasksDone = document.getElementById('tasks-done');   //show tasks complete
   tasksDone.textContent = currentTasks;

   const percentage = totalTasks === 0 ? "0%" : `${Math.round((finishedTasks/totalTasks) * 100)}%`; //round number
   document.getElementById('percentage').textContent = percentage;    // update percentage status target html

   progressBar(percentage);
};

 function progressBar(percentage) {
  const progressBar = document.querySelector('.status-bar');
  
  const value = parseInt(percentage); // convert % to number to compare value not percentage
 
  let widthStyle = value === 100 ?  
      'width: 100%; border-radius: 10px;':
      `width: ${percentage};
       border-top-right-radius: 0;
       border-bottom-right-radius: 0;`;
   
  if(value > 50){
     widthStyle += 'background: linear-gradient(to right, #d2c17b 0%,  #d2c17b 50%, #d9ae04 50%,  #d9ae04 100%);'
  };
 
    progressBar.innerHTML =`<div class="inner" style="${widthStyle}"></div>`;

   let textMsg = document.getElementById('greet-message');

   if(value < 50){
      textMsg.textContent = "What's up for today?🌻";
   } 
   if(value >= 50){
      textMsg.textContent = "🤗Haft way to go";
   } 
   if(value >= 75){
      textMsg.textContent = "😃Keep going!";
   }
   if(value === 100){
      textMsg.textContent = "🎉Your Goal Complete!";
   }
 };

function saveTaskstoLocal(){
   const tasksInApp = document.querySelectorAll('#tasks-list li');  //nodelist
   const tasksArray =  [...tasksInApp].map(task=>{       // convert to array for save
           return {text: task.querySelector('p').textContent, 
            completed: task.querySelector('.checkbox').checked }              
      }); 

   return localStorage.setItem('tasksInApp',JSON.stringify(tasksArray)); // always save tasks in localstorage even no task
};

function getTasks(){
   const storedTasks = localStorage.getItem('tasksInApp');
   return storedTasks ? JSON.parse(storedTasks): [];   // convert JSON to array or null (if no local data)
};

function renderTasks(){
   const tasksArray = getTasks();
   tasksList.innerHTML ='';  // clear current tasks

   tasksArray.forEach(task => {
   const list = document.createElement('li');
   list.innerHTML  = `
   <div class='renderList'>
   <span><input type='checkbox' class='checkbox' ${task.completed ? 'checked' : ''}><p>${task.text}</p></span>
   <div class='btn'>
      <button class='edit-btn'><i class="fa-solid fa-pen"></i></button>
      <button class='delete-btn'><i class="fa-solid fa-minus"></i></button>
   </div>
   </div>
   `;
   tasksList.appendChild(list);
 });
  progressUpdate();
};

window.addEventListener('DOMContentLoaded',()=>{ 
     renderTasks();  // load tasks from localStorage immediately after DOM ready
     tasksList.classList.add('hidden');   //ensure tasks list hidden first
   
   document.querySelector('.items-btn').addEventListener('click', ()=>{
   tasksList.classList.toggle('hidden'); 
   });
});




