let globalData = [];

const performCommonValidations = (inputText) => {
  let isEmpty = inputText.trim().length === 0;
  return isEmpty;
};

const validateTitle = (title = "") => {
  return /^[A-Za-z ]+$/.test(title);
};

const validateAmount = (amount = 0) => {
  return /^\d+(\.\d+)?$/.test(amount);
};

const validateCategory = (category = "") => {
  return /^[A-Za-z ]+$/.test(category);
};

const validateFields = ([title, amount, category]) => {
  const errors = [];
  if (performCommonValidations(title)) {
    errors.push({
      status: false,
      message: "Title is Required",
      field: "title",
    });
  }
  if (performCommonValidations(category)) {
    errors.push({
      status: false,
      message: "Category is Required",
      field: "category",
    });
  }
  if (performCommonValidations(amount)) {
    errors.push({
      status: false,
      message: "Amount is Required",
      field: "amount",
    });
  }
  if (!validateTitle(title)) {
    errors.push({
      status: false,
      message: "Title must contain Alphabets or spaces",
      field: "title",
    });
  }
  if (!validateCategory(category)) {
    errors.push({
      status: false,
      message: "Category must contain Alphabets or spaces",
      field: "category",
    });
  }
  if (!validateAmount(amount)) {
    errors.push({
      status: false,
      message: "Amount must be a number or some decimal input",
      field: "amount",
    });
  }
  if (errors.length === 0) return null;
  else return errors;
};
const fetchFieldsText = () => {
  const titleField = document.getElementById("element-title");
  const title = titleField.value;
  const amountField = document.getElementById("element-amount");
  const amount = amountField.value;
  const categoryField = document.getElementById("element-category");
  const category = categoryField.value;

  return [title, amount, category];
};

const addNewExpense = (title = "", amount = 0, category = "") => {
  const newExpenseData = {
    title,
    amount,
    category,
  };
  globalData.push(newExpenseData);
};

const clearErrors = () => {
  const titleErrorElement = document.getElementById("title-warning");
  titleErrorElement.textContent = ""
  titleErrorElement.classList.add("d-none");
  const categoryErrorElement = document.getElementById("category-warning");
  categoryErrorElement.textContent = ""
  categoryErrorElement.classList.add("d-none");
  const amountErrorElement = document.getElementById("amount-warning");
  amountErrorElement.textContent = ""
  amountErrorElement.classList.add("d-none");
};
const clearFields = () => {
  const titleField = document.getElementById('element-title')
  titleField.value = ""
  const amountField = document.getElementById('element-amount')
  amountField.value = ""
  const categoryField = document.getElementById('element-category')
  categoryField.value = ""

}

const performSubmitAction = () => {
  const submittedInputs = fetchFieldsText();
  const response = validateFields(submittedInputs);
  if (response === null) {
    clearErrors();
    addNewExpense(submittedInputs[0], submittedInputs[1], submittedInputs[2]);
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
      title: "School Fee",
      amount: "60",
      category: "education",
    },
    {
      title: "Medicine Fee",
      amount: "600",
      category: "Medication",
    },
  ];
};

const getHtmlCodeToRenderData = (data = []) => {
  if (data.length === 0) {
    return null;
  }
  let tHead = `<thead class="table-dark"><tr class="text-capitalize">`;
  const keys = Object.keys(data[0]);
  for (const key of keys) {
    tHead += `<th>${key}</th>`;
  }
  tHead += "</tr></thead>";

  let tBody = "<tbody>";
  for (const element of data) {
    tBody += "<tr>";

    for (const key of keys) {
      tBody += `<td>${element[key]}</td>`;
    }

    tBody += "</tr>";
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
      expense.category.toLowerCase().includes(searchText)
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
}

const addEventListenersToElements = () => {
  const submitBtn = document.getElementById("submit-btn");
  submitBtn.addEventListener("click", performSubmitAction);
  const filterInputField = document.getElementById("filter");
  filterInputField.addEventListener("input", liveRenderFilteredExpenses);
  const darkModeBtn = document.getElementById('dark-mode-btn')
  darkModeBtn.addEventListener('click',toggleModeClass)
};

const main = () => {
  loadData();
  renderData();
  addEventListenersToElements();
};

main();
