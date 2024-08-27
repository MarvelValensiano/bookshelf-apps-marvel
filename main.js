const todos = [];
const RENDER_EVENT = 'render-todo';

document.addEventListener('DOMContentLoaded', function() {
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function(event) {
        event.preventDefault();
        addBook();
    })
    if (isStorageExist()) {
      loadDataFromStorage();
    }
});

    function addBook() {
        const inputBookTitle = document.getElementById('inputBookTitle').value;
        const inputBookAuthor = document.getElementById('inputBookAuthor').value;
        const inputBookYear = parseInt(document.getElementById('inputBookYear').value);
        const inputBookIsComplete = document.getElementById('inputBookIsComplete').checked;


        const generatedID = generateId();
        const bookData = generateTodoObject(generatedID, inputBookTitle, inputBookAuthor, inputBookYear, inputBookIsComplete);
        todos.push(bookData);
       
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }

    function generateId() {
        return +new Date();
    }

    function generateTodoObject(id, title, author, year, isComplete) {
        return {
          id,
          title,
          author,
          year,
          isComplete
        }
    }


    document.addEventListener(RENDER_EVENT, function () {
        const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
        incompleteBookshelfList.innerHTML = '';

        const completeBookshelfList = document.getElementById('completeBookshelfList');
        completeBookshelfList.innerHTML = '';

         for (const BookItem of todos) {
          const BookElement = makeTodo(BookItem);

          if (!BookItem.isComplete) {
            incompleteBookshelfList.append(BookElement);
          }
          else {
            completeBookshelfList.append(BookElement);
          }
        }
      });

function makeTodo(BookObject) {
    const textTitle = document.createElement('h3');
    textTitle.innerText = BookObject.title;

    const textId = document.createElement('p');
    textId.innerText = BookObject.id;

    const textPenulis = document.createElement('p');
    textPenulis.innerText = BookObject.author;

    const textYear = document.createElement('p');
    textYear.innerText = BookObject.year;
   
    const container = document.createElement('div');
    container.classList.add('action');
    container.setAttribute('id', `todo-${BookObject.id}`);
   
    const textArticle = document.createElement('article');
    textArticle.classList.add('book_item');
    textArticle.append(textTitle, textId, textPenulis, textYear, container);
   


    if (BookObject.isComplete) {
        const undoButton = document.createElement('button');
        undoButton.innerText = 'Belum selesai di Baca';
        undoButton.classList.add('green');

        undoButton.addEventListener('click', function () {
          undoTaskFromCompleted(BookObject.id);
        });
     
        const trashButton = document.createElement('button');
        trashButton.innerText = 'Hapus buku';
        trashButton.classList.add('red');
     
        trashButton.addEventListener('click', function () {
          removeTaskFromCompleted(BookObject.id);
        });
     
        container.append(undoButton, trashButton);
      } else {
        const DoneButton = document.createElement('button');
        DoneButton.innerText = 'Selesai dibaca';
        DoneButton.classList.add('green');
        
        DoneButton.addEventListener('click', function () {
          addTaskToCompleted(BookObject.id);
        });
        
        const trashButton = document.createElement('button');
        trashButton.innerText = 'Hapus buku';
        trashButton.classList.add('red');
     
        trashButton.addEventListener('click', function () {
          removeTaskFromCompleted(BookObject.id);
        }); 

        container.append(DoneButton, trashButton);
      }
     
      return textArticle;
    }
    

    function addTaskToCompleted (todoId) {
        const todoTarget = findTodo(todoId);
       
        if (todoTarget == null) return;
       
        todoTarget.isComplete = true;
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
      }

function findTodo(todoId) {
  for (const todoItem of todos) {
    if (todoItem.id === todoId) {
      return todoItem;
    }
  }
  return null;
}

function removeTaskFromCompleted(todoId) {
  const todoTarget = findTodoIndex(todoId);
 
  if (todoTarget === -1) return;
 
  todos.splice(todoTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoTaskFromCompleted(todoId) {
  const todoTarget = findTodo(todoId);
 
  if (todoTarget == null) return;
 
  todoTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findTodoIndex(todoId) {
  for (const index in todos) {
    if (todos[index].id === todoId) {
      return index;
    }
  }
 
  return -1;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(todos);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

const SAVED_EVENT = 'saved-todo';
const STORAGE_KEY = 'TODO_APPS';

function isStorageExist() /* boolean */ {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
  alert('DATA KAMU SUDAH TERSIMPAN!')
});


function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);
 
  if (data !== null) {
    for (const todo of data) {
      todos.push(todo);
    }
  }
 
  document.dispatchEvent(new Event(RENDER_EVENT));
}
