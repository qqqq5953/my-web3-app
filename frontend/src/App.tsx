import TokenInfo from "./components/TokenInfo";
import TokenActions from "./components/TokenActions";
import { useState } from "react";

export default function App() {
  const [mtkBalance, setMtkBalance] = useState("0");
  const [ethBalance, setEthBalance] = useState("");
  const [userBalance, setUserBalance] = useState("");

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">My Token App</h1>
      <TokenInfo
        mtkBalance={mtkBalance}
        setMtkBalance={setMtkBalance}
        ethBalance={ethBalance}
        setEthBalance={setEthBalance}
        userBalance={userBalance}
        setUserBalance={setUserBalance}
      />

      <TokenActions
        setMtkBalance={setMtkBalance}
        setEthBalance={setEthBalance}
        setUserBalance={setUserBalance}
      />
    </div>
  )
}