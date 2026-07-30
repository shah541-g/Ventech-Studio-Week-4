let globalData = [];

const performCommonValidations = (inputText) => {
  let isEmpty = inputText.trim().length === 0;
  return isEmpty;
};

const validateTitle = (title = "") => {
  return /^[A-Za-z ]+$/.test(title);
};

const validatePriority = (priority = 'medium') => {
  return priority === 'medium' || priority === 'high' || priority === 'low';
}



const validateFields = ([title, priority, status]) => {
  const errors = [];
  if (performCommonValidations(title)) {
    errors.push({
      status: false,
      message: "Title is Required",
      field: "title",
    });
  }
  if (performCommonValidations(status)) {
    errors.push({
      status: false,
      message: "status is Required",
      field: "status",
    });
  }
  if (performCommonValidations(priority)) {
    errors.push({
      priority: false,
      message: "priority is Required",
      field: "priority",
    });
  }
  if (!validateTitle(title)) {
    errors.push({
      status: false,
      message: "Title must contain Alphabets or spaces",
      field: "title",
    });
  }
  if (errors.length === 0) return null;
  else return errors;
};
const fetchFieldsText = () => {
  const titleField = document.getElementById("element-title");
  const title = titleField.value;
  const statusField = document.getElementById("element-status");
  const status = statusField.value;
  const priorityField = document.getElementById('element-priority');
  const priority = priorityField.value;
  return [title, status, priority];
};

const addNewTask = (title = "",  status = "to-do", priority = 'medium') => {
  const newTaskData = {
    title,
    status,
    priority
  };
  globalData = [...globalData, {id: Date.now(),...newTaskData}]
};

const updateTask = (id, title = "",  status = "to-do", priority = 'medium') => {
  for(const task of globalData){
    if(task.id==id){
      task.title = title;
      task.status=status;
      task.priority=priority;
    }
  }
}

const clearErrors = () => {
  const titleErrorElement = document.getElementById("title-warning");
  titleErrorElement.textContent = ""
  titleErrorElement.classList.add("d-none");
  const editTitleErrorElement = document.getElementById("edit-title-warning");
  editTitleErrorElement.textContent = ""
  editTitleErrorElement.classList.add("d-none");
};
const clearFields = () => {
  const titleField = document.getElementById('element-title')
  titleField.value = ""
  const editTitleField = document.getElementById('edit-element-title')
  editTitleField.value = ""
}
const updateCount = () => {
  const completedCount = globalData.filter(task => task.status=="completed").length
  document.getElementById("completed-count").textContent = completedCount
  const total = globalData.length
  document.getElementById("total-count").textContent = total
}
const performSubmitAction = () => {
  const submittedInputs = fetchFieldsText();
  const response = validateFields(submittedInputs);
  if (response === null) {
    clearErrors();
    addNewTask(submittedInputs[0], submittedInputs[1],  submittedInputs[2]);
    updateCount()
    clearTable()
    clearFields();
    renderData();
  } else {
    clearErrors();
    for (const error of response) {
      const errorElement = document.getElementById(`${error.field}-warning`);
      errorElement.classList.remove("d-none");
      errorElement.textContent += error.message + " ";
    }
  }
};
const performEditAction = () => {
  const id = document.getElementById('edit-id').value
  const title = document.getElementById("edit-element-title").value;
  const status = document.getElementById("edit-element-status").value;
  const priority = document.getElementById('edit-element-priority').value;
  const response = validateFields([title,priority,status]);
  if (response === null) {
    clearErrors();
    updateTask(id, title, status,  priority);
    updateCount()
    clearTable()
    clearFields();
    renderData();
  } else {
    clearErrors();
    for (const error of response) {
      const errorElement = document.getElementById(`${error.field}-warning`);
      errorElement.classList.remove("d-none");
      errorElement.textContent += error.message + " ";
    }
  }
};

const loadData = () => {
  globalData = [
    {
      id: 1,
      title: "Complete To Do List App",
      status: "active",
      priority: "high"
    },
    {
      id:2,
      title: "Complete Remaining W3School Topics",
      status: "to-do",
      priority: "low"
    },
  ];
};

const colorKeys = {
  high:"text-danger fw-bold",
  medium: "text-primary fw-bold",
  low: "text-success fw-bold",
  active: "text-danger fw-bold",
  completed: 'text-success fw-bold',
  "to-do": "text-primary fw-bold"
}

const deleteTask = (id) => {
  globalData = globalData.filter(task => task.id !== id);
  clearTable()
  renderData()
}

const editTask = (id) => {
  const modal = new bootstrap.Modal(document.getElementById("edit-modal"))
  modal.show();
  const selectedItem = globalData.filter(task => task.id == id)
  document.getElementById('edit-element-title').value = selectedItem[0].title
  document.getElementById('edit-element-status').value = selectedItem[0].status
  document.getElementById('edit-element-priority').value = selectedItem[0].priority
  document.getElementById('edit-id').value = id
}

const deleteBtn = (id) => `<button class="btn btn-danger border border-1 rounded" id="delete-${id}" onclick="deleteTask(${id})"><i class="bi bi-trash"></i></button> `
const editButton = (id) =>   `<button class="btn btn-success border border-1 rounded" onclick="editTask(${id})" id="edit-${id}"><i class="bi bi-pen"></i></button> `

const getHtmlCodeToRenderData = (data = []) => {
  if (data.length === 0) {
    return null;
  }
  let tHead = `<thead><tr class="text-capitalize">`;
  const keys = Object.keys(data[0]);
  for (const key of keys) {
    if (key!=="id")
    tHead += `<th>${key}</th>`;
  }
  tHead+= `<th class="text-success">Edit</th>`
  tHead+= `<th class="text-danger">Delete</th>`
  tHead += "</tr></thead>";

  let tBody = "<tbody>";
  for (const element of data) {
    tBody += "<tr>";

    for (const key of keys) {
      if (key!=="id")
      tBody += `<td class="text-capitalize ${colorKeys[element[key]]}">${element[key]}</td>`;
    }

    tBody += `<td>${editButton(element["id"])}</td>`;
    tBody += `<td>${deleteBtn(element["id"])}</td></tr>`;
  }
  tBody += "</tbody>";

  return [tHead, tBody];
};

const renderData = (data = globalData) => {
  const noDataWrapper = document.getElementById("no-data-wrapper");
  const table = document.getElementById("data-table");
  if (data.length === 0) {
    noDataWrapper.classList.remove("d-none");
    noDataWrapper.classList.add("d-flex");
    table.classList.add("d-none");
  } else {
    noDataWrapper.classList.remove("d-flex");
    noDataWrapper.classList.add("d-none");
    const tableWrapper = document.getElementById("table-wrapper");
    table.classList.remove("d-none");
    const code = getHtmlCodeToRenderData(data);
    tableWrapper.classList.add("table-responsive");
    table.classList.remove("d-none");
    const tHead = document.getElementById("data-table-head");
    tHead.insertAdjacentHTML("afterbegin", code[0]);
    const tBody = document.getElementById("data-table-body");
    tBody.insertAdjacentHTML("afterbegin", code[1]);
  }
};

const fetchFilteredExpenses = (searchText) => {
  return globalData.filter((expense) => {
    return (
      expense.title.toLowerCase().includes(searchText) ||
      expense.status.toLowerCase().includes(searchText)
    );
  });
};

const clearTable = () => {
  document.getElementById("data-table-head").innerHTML = "";
  document.getElementById("data-table-body").innerHTML = "";
};

const liveRenderFilteredExpenses = (event) => {
  const searchText = event.target.value.toLowerCase();
  const filteredResults = fetchFilteredExpenses(searchText);
  clearTable();
  renderData(filteredResults);
};

const toggleModeClass = () => {
  if (document.body.classList.contains('dark-mode')){
    document.getElementById('dark-mode-div').classList.add('bg-white');
    document.getElementById('dark-mode-div').classList.remove('bg-dark');
    document.getElementById('dark-mode-icon-img').setAttribute('src','./assets/moon-stars-fill.svg')
  } else{
    document.getElementById('dark-mode-div').classList.remove('bg-white');
    document.getElementById('dark-mode-div').classList.add('bg-danger');
    document.getElementById('dark-mode-icon-img').setAttribute('src','./assets/moon-stars.svg')
    
  }
  document.body.classList.toggle('dark-mode')
  document.getElementById('header').classList.toggle('dark-mode-background')
  document.getElementById('checkmark-icon').classList.toggle('dark-mode-text');
  document.getElementById('completed-count').classList.toggle('dark-mode-text');
  document.getElementById('total-count').classList.toggle('dark-mode-text');
  document.getElementById('add-btn').classList.toggle('btn-dark')
  document.getElementById('submit-btn').classList.toggle('btn-black')
  document.getElementById('submit-btn').classList.toggle('btn-primary')
  document.getElementById('close-btn').classList.toggle('btn-close-white');
  document.getElementById('modal-header').classList.toggle('dark-mode-background')
  document.getElementById('data-table-head').classList.toggle('table-dark')
  document.getElementById('footer').classList.toggle('dark-mode-background')
  document.getElementById('modal-body').classList.toggle('dark-mode-background')
  document.getElementById('modal-footer').classList.toggle('dark-mode-background')
  document.getElementById('add-new-task-section').classList.toggle('border-white')
  document.getElementById('filter-and-list-section').classList.toggle('border-white')

}

const addEventListenersToElements = () => {
  const submitBtn = document.getElementById("submit-btn");
  submitBtn.addEventListener("click", performSubmitAction);
  const editBtn = document.getElementById("edit-btn");
  editBtn.addEventListener("click", performEditAction);
  const filterInputField = document.getElementById("filter");
  filterInputField.addEventListener("input", liveRenderFilteredExpenses);
  const darkModeBtn = document.getElementById('dark-mode-btn')
  darkModeBtn.addEventListener('click',toggleModeClass)
};

const main = () => {
  loadData();
  updateCount()
  renderData();
  addEventListenersToElements();
};

main();
