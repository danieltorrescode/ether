// const ganache = require("ganache-cli");
// const Web3 = require("web3");
// const web3 = new Web3(ganache.provider());

const TasksContract = artifacts.require("TasksContract");

contract("TasksContract", (accounts) => {
  before(async () => {
    this.tasksContract = await TasksContract.deployed();
    this.accounts = await web3.eth.getAccounts();
  });

  it("deploys a contract", async () => {
    const address = await this.tasksContract.address;
    assert.ok(address);
  });

  it("migrate deployed successfully", async () => {
    const address = await this.tasksContract.address;

    assert.notEqual(address, null);
    assert.notEqual(address, undefined);
    assert.notEqual(address, 0x0);
    assert.notEqual(address, "");
  });

  it("get Tasks List", async () => {
    const tasksCounter = await this.tasksContract.tasksCounter();
    const task = await this.tasksContract.tasks(tasksCounter);

    assert.equal(task.id.toNumber(), tasksCounter.toNumber());
    assert.equal(task.title, "Task 1");
    assert.equal(task.description, "Description");
    assert.equal(task.done, false);
    assert.equal(tasksCounter, 1);
  });

  it("task created successfully", async () => {
    const result = await this.tasksContract.createTask("some task two", "description two");
    const taskEvent = result.logs[0].args;
    const tasksCounter = await this.tasksContract.tasksCounter();

    assert.equal(tasksCounter, 2);
    assert.equal(taskEvent.id.toNumber(), 2);
    assert.equal(taskEvent.title, "some task two");
    assert.equal(taskEvent.description, "description two");
    assert.equal(taskEvent.done, false);
  });

  it("task toggled done", async () => {
    const result = await this.tasksContract.toggleDone(1);
    const taskEvent = result.logs[0].args;
    const task = await this.tasksContract.tasks(1);

    assert.equal(task.done, true);
    assert.equal(taskEvent.id.toNumber(), 1);
    assert.equal(taskEvent.done, true);
  });

  it("allows one account to enter", async () => {
    balance = await web3.eth.getBalance(this.accounts[0])
    console.log(balance);
    console.log(this.accounts[0]);
    const result = await this.tasksContract.enter({
      from: this.accounts[0],
      value: web3.utils.toWei("1", "ether"),
    });
    console.log(result);
    console.log(result.receipt.status);

    
    balance = await web3.eth.getBalance("0x393a6a6850e0788e496d73c50a436606e6cca874")
    console.log(balance);
    // const players = await lottery.methods.getPlayers().call({
    //   from: accounts[0],
    // });

    // assert.equal(accounts[0], players[0]);
    // assert.equal(1, players.length);
  });

  // it("allows multiple accounts to enter", async () => {
  //   await lottery.methods.enter().send({
  //     from: accounts[0],
  //     value: web3.utils.toWei("0.02", "ether"),
  //   });
  //   await lottery.methods.enter().send({
  //     from: accounts[1],
  //     value: web3.utils.toWei("0.02", "ether"),
  //   });
  //   await lottery.methods.enter().send({
  //     from: accounts[2],
  //     value: web3.utils.toWei("0.02", "ether"),
  //   });

  //   const players = await lottery.methods.getPlayers().call({
  //     from: accounts[0],
  //   });

  //   assert.equal(accounts[0], players[0]);
  //   assert.equal(accounts[1], players[1]);
  //   assert.equal(accounts[2], players[2]);
  //   assert.equal(3, players.length);
  // });

  // it("requires a minimum amount of ether to enter", async () => {
  //   try {
  //     await lottery.methods.enter().send({
  //       from: accounts[0],
  //       value: 0,
  //     });
  //     assert(false);
  //   } catch (err) {
  //     assert(err);
  //   }
  // });

  // it("only manager can call pickWinner", async () => {
  //   try {
  //     await lottery.methods.pickWinner().send({
  //       from: accounts[1],
  //     });
  //     assert(false);
  //   } catch (err) {
  //     assert(err);
  //   }
  // });

  // it("sends money to the winner and resets the players array", async () => {
  //   await lottery.methods.enter().send({
  //     from: accounts[0],
  //     value: web3.utils.toWei("2", "ether"),
  //   });

  //   const initialBalance = await web3.eth.getBalance(accounts[0]);
  //   await lottery.methods.pickWinner().send({ from: accounts[0] });
  //   const finalBalance = await web3.eth.getBalance(accounts[0]);
  //   const difference = finalBalance - initialBalance;

  //   assert(difference > web3.utils.toWei("1.8", "ether"));
  // });
});
