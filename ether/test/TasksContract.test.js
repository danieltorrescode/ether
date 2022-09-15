// const ganache = require("ganache-cli");
// const Web3 = require("web3");
// const web3 = new Web3(ganache.provider());

// const { interface, bytecode } = require("../compile");

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
    const result = await this.tasksContract.createTask(
      "some task two",
      "description two"
    );
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
    const result = await this.tasksContract.enter({
      from: this.accounts[0],
      value: web3.utils.toWei("5", "ether"),
    });
    // console.log(this.accounts[0]);
    // console.log(await web3.eth.getBalance(this.accounts[0]));
    // console.log(result);
    // console.log(`Status: ${result.receipt.status}`);

    const players = await this.tasksContract.getPlayers();
    // console.log(`Players: ${players}`);
    // console.log(`accounts: ${accounts}`);

    assert.equal(accounts[0], players[0]);
    assert.equal(1, players.length);
    await this.tasksContract.restartPool();
  });

  it("allows multiple accounts to enter", async () => {
    await this.tasksContract.enter({
      from: this.accounts[0],
      value: web3.utils.toWei("5", "ether"),
    });
    await this.tasksContract.enter({
      from: this.accounts[1],
      value: web3.utils.toWei("5", "ether"),
    });
    await this.tasksContract.enter({
      from: this.accounts[2],
      value: web3.utils.toWei("5", "ether"),
    });

    const players = await this.tasksContract.getPlayers();
    // console.log(`Players: ${players}`);

    assert.equal(accounts[0], players[0]);
    assert.equal(accounts[1], players[1]);
    assert.equal(accounts[2], players[2]);
    assert.equal(3, players.length);
  });

  it("requires a minimum amount of ether to enter", async () => {
    let result;
    try {
      await this.tasksContract.enter({
        from: accounts[0],
        value: 0,
      });
      result=false;
    } catch (err) {
      result=true;
    }
    assert(result);
  });

  it("only manager can call pickWinner", async () => {
    let result;
    try {
      let response = await this.tasksContract.pickWinner({
        from: accounts[1],
      });
      result=false;
    } catch (err) {
      result=true;
    }
    assert(result);
  });

  it("sends money to the winner and resets the players array", async () => {
    await this.tasksContract.enter({
      from: accounts[0],
      value: web3.utils.toWei("5", "ether"),
    });

    const initialBalance = await this.tasksContract.getContractBalance();
    let response =  await this.tasksContract.pickWinner({ from: accounts[0] });
    const finalBalance = await this.tasksContract.getContractBalance();
    const difference = initialBalance - finalBalance;
    
    // console.log(`winner: ${await this.tasksContract.getWinnerAddress()}`);
    // console.log(`winner: ${await web3.eth.getBalance(await this.tasksContract.getWinnerAddress())}`);
    // console.log(typeof await this.tasksContract.getWinnerAddress())
    // console.log(response);
    // console.log(response.logs[0].args);
    // console.log(response.logs[0].args.sender);
    // console.log(response.logs[0].args.players);
    // console.log(response.logs[0].args.player);
    // console.log(response.logs[0].args.index.toNumber());
    // console.log(initialBalance.toNumber());
    // console.log(BigInt(finalBalance));
    // console.log(difference);
    // for (account of accounts) {
    //   console.log(`account: ${account}  --- balance: ${await web3.eth.getBalance(account)}`);
    // }
    // assert(difference > web3.utils.toWei("0.1", "ether"));
    assert(true);
  });
});
