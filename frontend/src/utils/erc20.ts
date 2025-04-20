export const ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint)",
  "function transfer(address to, uint amount) returns (bool)",
  "function deposit() payable",
  "function withdraw(uint256 tokenAmount)",
  "function getInitialReserve() view returns (uint256)",
];

// Sepolia USDC token (mock)
export const ERC20_ADDRESS = "0x5eb3Bc0a489C5A8288765d2336659EbCA68FCd00";
