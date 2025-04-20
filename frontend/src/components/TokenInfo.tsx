import { useEffect, useState } from "react";
import { Addressable, BrowserProvider, Contract, formatEther, formatUnits } from "ethers";
import { ERC20_ABI, ERC20_ADDRESS } from "../utils/erc20";

type Props = {
  mtkBalance: string;
  setMtkBalance: (mtkBalance: string) => void;
  ethBalance: string;
  setEthBalance: (ethBalance: string) => void;
  userBalance: string;
  setUserBalance: (userBalance: string) => void;
}

export default function TokenInfo(props: Props) {
  const [userAddress, setUserAddress] = useState("");
  const [contractAddress, setContractAddress] = useState<string | Addressable>();
  const [symbol, setSymbol] = useState("");

  useEffect(() => {
    const load = async () => {
      if (window.ethereum) {
        try {
          const provider = new BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const userAddress = await signer.getAddress();
          setUserAddress(userAddress);


          // get new eth balance
          const newEthBalance = await provider.getBalance(await signer.getAddress());
          props.setUserBalance(formatEther(newEthBalance));

          const contract = new Contract(ERC20_ADDRESS, ERC20_ABI, signer);
          console.log('contract', contract);

          // const initialReserve = await contract.getInitialReserve();
          // console.log('initialReserve', initialReserve);

          setContractAddress(contract.target);


          const tokenSymbol = await contract.symbol();
          setSymbol(tokenSymbol);

          const decimals = await contract.decimals();
          const rawBalance = await contract.balanceOf(userAddress);
          const _balance = formatUnits(rawBalance, decimals);
          props.setMtkBalance(_balance);
          console.log('balance', _balance);

          // Fetch ETH balance of the contract
          const contractEthBalance = await provider.getBalance(ERC20_ADDRESS);
          const _ethBalance = formatUnits(contractEthBalance, 18);
          props.setEthBalance(_ethBalance);
          console.log('ETH Balance in contract:', _ethBalance);
        } catch (error) {
          console.error('Error fetching token info:', error);
        }
      }
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-white shadow-md p-6 rounded-lg">
      <h1 className="text-xl font-bold mb-2">Your {symbol} Balance</h1>
      <p><strong>User Address:</strong> {userAddress}</p>
      <p><strong>User ETH Balance:</strong> {parseFloat(props.userBalance).toFixed(0)} ETH</p>
      <br />
      <p><strong>Contract Address:</strong> {contractAddress?.toString()}</p>
      <p><strong>Contract MTK Balance:</strong> {props.mtkBalance} {symbol}</p>
      <p><strong>Contract ETH Balance:</strong> {props.ethBalance} ETH</p>
    </div>
  );
}
