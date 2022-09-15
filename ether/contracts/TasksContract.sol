// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

contract TasksContract {
    uint256 public tasksCounter = 0;
    address payable public admin;
    address payable public winner;
    address payable[] public players;
    mapping(address => uint256) balances;

    struct Task {
        uint256 id;
        string title;
        string description;
        bool done;
        uint256 createdAt;
    }

    event TaskCreated(
        uint256 id,
        string title,
        string description,
        bool done,
        uint256 createdAt
    );
    event TaskToggledDone(uint256 id, bool done);

    event info(
        address payable sender,
        address payable[] players,
        address payable winner,
        uint index,
        uint initial_balance,
        uint256 final_balance
    );

    mapping(uint256 => Task) public tasks;

    constructor() {
        createTask("Task 1", "Description");
        admin = payable(msg.sender);
    }

    modifier restricted() {
        require(payable(msg.sender) == admin);
        _;
    }

    function createTask(string memory _title, string memory _description)
        public
    {
        tasksCounter++;
        tasks[tasksCounter] = Task(
            tasksCounter,
            _title,
            _description,
            false,
            block.timestamp
        );
        emit TaskCreated(
            tasksCounter,
            _title,
            _description,
            false,
            block.timestamp
        );
    }

    function toggleDone(uint256 _id) public {
        Task memory _task = tasks[_id];
        _task.done = !_task.done;
        tasks[_id] = _task;
        emit TaskToggledDone(_id, _task.done);
    }

    // Function to get
    // address of admin
    function getContractAddress() public view returns (address) {
        return address(this);
    }

    // Function to return
    // current balance of admin
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function enter() public payable {
        require(msg.value >= 5 ether);
        players.push(payable(msg.sender));
    }

    function getPlayers() public view returns (address payable[] memory) {
        return players;
    }

    function restartPool() public returns (bool) {
        delete players;
        return true;
    }

    function random() private view returns (uint) {
        return uint(keccak256(abi.encodePacked(block.difficulty,block.timestamp,players)));
    }
    
    function pickWinner() public restricted returns (address){
        uint index = random() % players.length;
        uint initial_balance = address(this).balance;
        winner = players[index];
        players[index].transfer(address(this).balance);
        emit info(
            payable(msg.sender),
            players,
            winner,
            index,
            initial_balance,
            address(this).balance
        );
        // players = new address payable [](0);
        delete players;
        return address(winner);
    }

    function getWinnerAddress() public view returns (address) {
        return address(winner);
    }
}
