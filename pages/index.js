// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Assessment {
    address payable public owner;
    uint256 public balance;

    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);

    constructor(uint initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;
    }

    function getBalance() public view returns(uint256){
        return balance;
    }

    function deposit(uint256 _amount) public payable {
        uint _previousBalance = balance;
        require(msg.sender == owner, "You are not the owner of this account");
        balance += _amount;
        assert(balance == _previousBalance + _amount);
        emit Deposit(_amount);
    }

    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    function withdraw(uint256 _withdrawAmount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        uint _previousBalance = balance;
        if (balance < _withdrawAmount) {
            revert InsufficientBalance({
                balance: balance,
                withdrawAmount: _withdrawAmount
            });
        }
        balance -= _withdrawAmount;
        assert(balance == (_previousBalance - _withdrawAmount));
        emit Withdraw(_withdrawAmount);
    }

    function checkLoanEligibility(uint256 _creditScore) public pure returns(uint256) {
        if (_creditScore > 720) {
            return 10000;
        } else if (_creditScore > 700) {
            return 7000;
        } else if (_creditScore > 600) {
            return 6000;
        } else if (_creditScore > 400) {
            return 5000;
        } else {
            return 0;
        }
    }
    
    function viewLoanBrochure() public pure returns (string memory) {
        string memory brochure = "Loan Details:\n";
        brochure = string(abi.encodePacked(brochure, "If your credit score is above 720, you are eligible for a loan of $10,000.\n"));
        brochure = string(abi.encodePacked(brochure, "If your credit score is above 700, you are eligible for a loan of $7,000.\n"));
        brochure = string(abi.encodePacked(brochure, "If your credit score is above 600, you are eligible for a loan of $6,000.\n"));
        brochure = string(abi.encodePacked(brochure, "If your credit score is above 400, you are eligible for a loan of $5,000.\n"));
        return brochure;
    }
}
