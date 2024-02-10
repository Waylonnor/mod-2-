import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [creditScore, setCreditScore] = useState("");
  const [loanAmount, setLoanAmount] = useState(0);
  const [showBrochure, setShowBrochure] = useState(false);
  const [eligibilityMessage, setEligibilityMessage] = useState("");

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const accounts = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(accounts);
    }
  };

  const handleAccount = (accounts) => {
    if (accounts.length > 0) {
      console.log("Account connected: ", accounts[0]);
      setAccount(accounts[0]);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    // Once wallet is set, we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      const balance = await atm.getBalance();
      setBalance(balance.toNumber());
    }
  };

  const deposit = async () => {
    if (atm) {
      let tx = await atm.deposit(1);
      await tx.wait();
      getBalance();
    }
  };

  const withdraw = async () => {
    if (atm) {
      let tx = await atm.withdraw(1);
      await tx.wait();
      getBalance();
    }
  };

  const checkEligibility = () => {
    const score = parseInt(creditScore);
    if (score > 720) {
      setLoanAmount(10000);
      setEligibilityMessage("Congratulations! You are eligible for a loan of $10,000.");
    } else if (score > 700) {
      setLoanAmount(7000);
      setEligibilityMessage("Congratulations! You are eligible for a loan of $7,000.");
    } else if (score > 600) {
      setLoanAmount(6000);
      setEligibilityMessage("Congratulations! You are eligible for a loan of $6,000.");
    } else if (score > 400) {
      setLoanAmount(5000);
      setEligibilityMessage("Congratulations! You are eligible for a loan of $5,000.");
    } else {
      setLoanAmount(0);
      setEligibilityMessage("Sorry! You are not eligible for a loan.");
    }
    setShowBrochure(true); // Show brochure when eligibility is checked
  };

  const viewBrochure = () => {
    setShowBrochure(!showBrochure); // Toggle brochure visibility
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header>
        <h1>Welcome to the Metacrafters ATM!</h1>
      </header>
      <div>
        {account ? (
          <div>
            <p>Your Account: {account}</p>
            <p>Your Balance: {balance}</p>
            <button onClick={deposit}>Deposit 1 ETH</button>
            <button onClick={withdraw}>Withdraw 1 ETH</button>
            <br />
            <br />
            <label htmlFor="creditScore">Enter your credit score:</label>
            <input
              type="text"
              id="creditScore"
              value={creditScore}
              onChange={(e) => setCreditScore(e.target.value)}
            />
            <button onClick={checkEligibility}>Check Eligibility</button>
            <p>{eligibilityMessage}</p>
            <br />
            <br />
            {showBrochure && (
              <div>
                <h2>Loan Details</h2>
                <p>
                  If your credit score is above 720, you are eligible for a loan of $10,000.
                </p>
                <p>
                  If your credit score is above 700, you are eligible for a loan of $7,000.
                </p>
                <p>
                  If your credit score is above 600, you are eligible for a loan of $6,000.
                </p>
                <p>
                  If your credit score is above 400, you are eligible for a loan of $5,000.
                </p>
              </div>
            )}
            <button onClick={viewBrochure}>
              {showBrochure ? "Hide Loan Brochure" : "View Loan Brochure"}
            </button>
          </div>
        ) : (
          <button onClick={connectAccount}>Connect your Metamask wallet</button>
        )}
      </div>
      <style jsx>{`
        .container {
          text-align: center;
        }
      `}</style>
    </main>
  );
}
