App = {
  contracts: {},
  init: async () => {
    await App.loadWeb3();
    await App.loadAccount();
    await App.loadContract();
    await App.showAccount();
    await App.showInfo();
    await App.getTasks();
  },
  loadWeb3: async () => {
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      App.web3 = new Web3(App.web3Provider);
    } else if (web3) {
      web3 = new Web3(window.web3.currentProvider);
    } else {
      console.log(
        "No ethereum browser is installed. Try it installing MetaMask "
      );
    }
  },
  loadAccount: async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    App.account = accounts[0];
  },
  loadContract: async () => {
    try {
      const res = await fetch("TasksContract.json");
      const tasksContractJSON = await res.json();
      App.contracts.TasksContract = TruffleContract(tasksContractJSON);
      App.contracts.TasksContract.setProvider(App.web3Provider);

      App.tasksContract = await App.contracts.TasksContract.deployed();
    } catch (error) {
      console.error(error);
    }
  },
  showAccount: async () => {
    document.getElementById("account").innerText = App.account;
  },
  showInfo: async () => {
    console.log(`getContractAddress: ${await App.tasksContract.getContractAddress()}`);
    console.log(`getContractBalance: ${await App.tasksContract.getContractBalance()}`);
    console.log(`getBalance: ${await App.web3.eth.getBalance(App.account)}`);
  },
  getTasks: async () => {
    const tasksCounter = await App.tasksContract.tasksCounter();
    const taskCounterNumber = tasksCounter.toNumber();

    let html = "";

    for (let i = 1; i <= taskCounterNumber; i++) {
      const task = await App.tasksContract.tasks(i);
      const taskId = task[0].toNumber();
      const taskTitle = task[1];
      const taskDescription = task[2];
      const taskDone = task[3];
      const taskCreatedAt = task[4];

      let taskElement = `
        <tr>
          <th scope="row">${taskId}</th>
          <td>${taskTitle}</td>
          <td>${taskDescription}</td>
          <td>
            <input class="form-check-input" data-id="${taskId}"
            type="checkbox" onchange="App.toggleDone(this)" ${
              taskDone === true && "checked"
            }
            >
          </td>
          <td>${new Date(taskCreatedAt * 1000).toLocaleString()}</td>
        </tr>
      `;
      html += taskElement;
    }

    document.querySelector("#tasksList").innerHTML = html;
  },
  createTask: async (title, description) => {
    try {
      const result = await App.tasksContract.createTask(title, description, {
        from: App.account,
      });
      console.log(result.logs[0].args);
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  },
  sendPayment: async () => {
    try {
      let result = await App.tasksContract.enter({
        from: App.account,
        value: App.web3.utils.toWei("10", "ether"),
      });
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  },
  toggleDone: async (element) => {
    const taskId = element.dataset.id;
    await App.tasksContract.toggleDone(taskId, {
      from: App.account,
    });
    window.location.reload();
  },
};

App.init();
const taskForm = document.querySelector("#taskForm");

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = taskForm["title"].value;
  const description = taskForm["description"].value;
  App.createTask(title, description);
});