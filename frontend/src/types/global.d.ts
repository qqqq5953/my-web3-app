interface Window {
  ethereum?: {
    request: (args: { method: string; params?: string[] }) => Promise<string>;
    isMetaMask?: boolean;
  };
}
