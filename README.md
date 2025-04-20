# Web3 DApp with Smart Contracts

This repository contains a Web3 decentralized application with React frontend and Solidity smart contracts. The project uses a submodule structure to manage the smart contract code separately from the frontend.

## Project Structure

```
my-web3-dapp/
├── contract/           # Smart contract submodule
│   ├── src/           # Contract source files
│   ├── test/          # Contract tests
│   └── script/        # Deployment scripts
└── frontend/          # React frontend application
    ├── src/           # Frontend source code
    └── public/        # Static assets
```

## Prerequisites

- Node.js (v16 or later)
- Git
- Foundry (for smart contract development)
- pnpm (recommended) or npm

## Getting Started

### 1. Clone the Repository

```bash
# Clone the main repository
git clone https://github.com/YOUR_USERNAME/my-web3-dapp.git
cd my-web3-dapp

# Initialize and update the submodules
git submodule init
git submodule update
```

### 2. Smart Contract Setup (contract directory)

```bash
# Navigate to the contract directory
cd contract

# Install Foundry dependencies
forge install

# Run contract tests
forge test

# Build contracts
forge build
```

### 3. Frontend Setup

```bash
# Navigate to the frontend directory
cd ../frontend

# Install dependencies
npm install

# Start development server
npm dev
```

## Development Workflow

### Working with the Smart Contract Submodule

When making changes to the smart contracts:

1. Navigate to the contract directory:

   ```bash
   cd contract
   ```

2. Make your changes and commit them:

   ```bash
   git add .
   git commit -m "Your contract changes"
   ```

3. Return to the main project and update the submodule reference:
   ```bash
   cd ..
   git add contract
   git commit -m "Update contract submodule"
   ```

### Frontend Development

The frontend code can be modified directly in the `frontend` directory. Changes can be committed to the main repository as usual.

## Making Changes

1. Create a new branch for your changes:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes
3. Commit your changes:

   ```bash
   git add .
   git commit -m "Your descriptive commit message"
   ```

4. Push your changes:
   ```bash
   git push origin feature/your-feature-name
   ```

## Troubleshooting

### Submodule Issues

If you see empty contract directory or get submodule errors:

```bash
# Re-initialize submodules
git submodule init
git submodule update

# Or clone with submodules in one go
git clone --recurse-submodules https://github.com/YOUR_USERNAME/my-web3-dapp.git
```

### Contract Compilation Issues

If you encounter issues with contract compilation:

```bash
cd contract
forge clean
forge build
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to your fork
5. Create a Pull Request

## License

[MIT License](LICENSE)
