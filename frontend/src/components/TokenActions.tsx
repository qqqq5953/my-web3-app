import { useState } from "react";
import { BrowserProvider, Contract, parseEther, formatEther, formatUnits } from "ethers";
import { ERC20_ABI, ERC20_ADDRESS } from "../utils/erc20";

type Props = {
  setMtkBalance: (mtkBalance: string) => void;
  setEthBalance: (ethBalance: string) => void;
  setUserBalance: (userBalance: string) => void;
}

const EXCHANGE_RATE = 1000;

export default function TokenActions(props: Props) {
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [status, setStatus] = useState("");
  const [estimatedGas, setEstimatedGas] = useState<string | null>(null);
  const [userBalance, setUserBalance] = useState<string | null>(null);

  const handleDeposit = async () => {
    if (!window.ethereum) {
      setStatus("Please install MetaMask");
      return;
    }

    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(ERC20_ADDRESS, ERC20_ABI, signer);

      // Convert ETH amount to Wei
      const depositValueWei = parseEther(depositAmount);
      console.log('Deposit amount in Wei:', depositValueWei.toString());

      // Get user's balance
      const balance = await provider.getBalance(await signer.getAddress());
      setUserBalance(formatEther(balance));
      console.log('User balance in Wei:', balance.toString());

      // Estimate gas
      const gasEstimate = await contract.deposit.estimateGas({ value: depositValueWei });
      console.log('Gas estimate:', gasEstimate.toString());

      const gasPrice = await provider.getFeeData();
      console.log('Gas price:', gasPrice.gasPrice?.toString());

      const totalGasCost = gasEstimate * (gasPrice.gasPrice || 0n);
      console.log('Total gas cost in Wei:', totalGasCost.toString());

      // Total cost = deposit amount + gas
      const totalCost = depositValueWei + totalGasCost;
      console.log('Total cost in Wei:', totalCost.toString());

      // Check if user has enough funds
      if (balance < totalCost) {
        const needed = formatEther(totalCost - balance);
        setStatus(
          `Insufficient funds. You have ${formatEther(balance)} ETH but need ${formatEther(totalCost)} ETH total:\n` +
          `• ${depositAmount} ETH for deposit\n` +
          `• ${formatEther(totalGasCost)} ETH for gas\n` +
          `Please add ${needed} more ETH to proceed.`
        );
        return;
      }

      setEstimatedGas(formatEther(totalGasCost));
      setStatus(`Ready to deposit. Total cost will be ${formatEther(totalCost)} ETH (${depositAmount} ETH + ${formatEther(totalGasCost)} ETH gas)`);

      // Call deposit function with ETH value
      const tx = await contract.deposit({
        value: depositValueWei,
        gasLimit: gasEstimate
      });
      setStatus("Depositing...");

      await tx.wait();
      setStatus("Deposit successful!");
      setDepositAmount("");
      setEstimatedGas(null);

      // get new contract mtk balance
      const newBalance = await contract.balanceOf(await signer.getAddress());
      props.setMtkBalance(formatEther(newBalance));

      // get new contract eth balance
      const contractEthBalance = await provider.getBalance(ERC20_ADDRESS);
      const _ethBalance = formatUnits(contractEthBalance, 18);
      props.setEthBalance(_ethBalance);

      // get new user eth balance
      const newEthBalance = await provider.getBalance(await signer.getAddress());
      props.setUserBalance(formatEther(newEthBalance));
    } catch (error: unknown) {
      console.error("Error depositing:", error);
      if (error instanceof Error) {
        if (error.message.includes("insufficient funds")) {
          setStatus("Insufficient funds to cover deposit amount and gas fees. Remember you need extra ETH for gas!");
        } else if (error.message.includes("user rejected")) {
          setStatus("Transaction was rejected.");
        } else {
          setStatus(`Error: ${error.message}`);
        }
      } else {
        setStatus("An unknown error occurred");
      }
    }
  };

  const handleWithdraw = async () => {
    if (!window.ethereum) {
      setStatus("Please install MetaMask");
      return;
    }

    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(ERC20_ADDRESS, ERC20_ABI, signer);

      // When withdrawing 1 ETH, we need to burn 1000 tokens
      // First convert ETH to Wei, then multiply by exchange rate
      const tokenAmount = parseEther(withdrawAmount) * BigInt(EXCHANGE_RATE);
      console.log('Token amount to burn:', formatEther(tokenAmount), 'tokens');

      // Estimate gas first
      const gasEstimate = await contract.withdraw.estimateGas(tokenAmount);
      console.log('gasEstimate', gasEstimate);

      const tx = await contract.withdraw(tokenAmount, {
        gasLimit: gasEstimate
      });
      console.log('tx', tx);

      setStatus("Withdrawing...");

      await tx.wait();
      setStatus("Withdrawal successful!");
      setWithdrawAmount("");

      // get new contract mtk balance
      const newBalance = await contract.balanceOf(await signer.getAddress());
      props.setMtkBalance(formatEther(newBalance));

      // get new contract eth balance
      const contractEthBalance = await provider.getBalance(ERC20_ADDRESS);
      const _ethBalance = formatUnits(contractEthBalance, 18);
      props.setEthBalance(_ethBalance);

      // get new user eth balance
      const newEthBalance = await provider.getBalance(await signer.getAddress());
      props.setUserBalance(formatEther(newEthBalance));
    } catch (error: unknown) {
      console.error("Error withdrawing:", error);
      if (error instanceof Error) {
        if (error.message.includes("insufficient funds")) {
          setStatus("Insufficient funds to cover gas fees.");
        } else if (error.message.includes("user rejected")) {
          setStatus("Transaction was rejected.");
        } else {
          setStatus(`Error: ${error.message}`);
        }
      } else {
        setStatus("An unknown error occurred");
      }
    }
  };

  // Calculate token amounts for display
  const displayTokenAmount = (ethAmount: string): string => {
    if (!ethAmount) return "0";
    try {
      // 1 ETH = 1000 tokens
      const tokens = parseFloat(ethAmount) * EXCHANGE_RATE;
      return tokens.toLocaleString();
    } catch {
      return "0";
    }
  };

  return (
    <div className="bg-white shadow-md p-6 rounded-lg mt-4">
      <h2 className="text-xl font-bold mb-4">Deposit & Withdraw</h2>

      {userBalance && (
        <div className="mb-4 text-sm text-gray-600">
          Your balance: {userBalance} ETH
        </div>
      )}

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Deposit ETH</label>
        <div className="flex gap-2">
          <input
            type="number"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            placeholder="Amount in ETH"
            className="border rounded p-2 flex-1"
            min="0"
            step="0.01"
          />
          <button
            onClick={handleDeposit}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Deposit
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          You will receive {displayTokenAmount(depositAmount)} MTK tokens
          <br />
          <span className="text-xs">
            (Rate: 1 ETH = {EXCHANGE_RATE} MTK)
          </span>
          {estimatedGas && (
            <>
              <br />
              <span className="text-xs text-orange-600">
                Estimated gas cost: {estimatedGas} ETH
              </span>
            </>
          )}
        </p>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Withdraw ETH</label>
        <div className="flex gap-2">
          <input
            type="number"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            placeholder="Amount in ETH"
            className="border rounded p-2 flex-1"
            min="0"
            step="0.01"
          />
          <button
            onClick={handleWithdraw}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Withdraw
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          You will burn {displayTokenAmount(withdrawAmount)} MTK tokens
          <br />
          <span className="text-xs">
            (Rate: 1 ETH = {EXCHANGE_RATE} MTK)
          </span>
        </p>
      </div>

      {status && (
        <div className={`mt-4 p-3 rounded break-words ${status.includes("Error") || status.includes("Insufficient")
          ? "bg-red-100 text-red-700"
          : status.includes("success")
            ? "bg-green-100 text-green-700"
            : "bg-gray-100"
          }`}>
          {status}
        </div>
      )}
    </div>
  );
} 