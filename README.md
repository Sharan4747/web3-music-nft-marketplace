
# NEONVERSE – Music NFT Marketplace

A decentralized Music NFT Marketplace built using Next.js, Ethers.js, and Polygon Amoy.

NEONVERSE allows users to create, explore, purchase, and manage music-based NFTs. Music and NFT metadata are stored using IPFS through Pinata, while NFT ownership and marketplace transactions are handled through smart contracts on the Polygon Amoy blockchain.

**Live Website:** https://music-nfts-ruby.vercel.app/

---

## 1. Project Overview

NEONVERSE is a Web3-based music marketplace where artists and music enthusiasts can interact with digital music collectibles.

### Main Features

- Connect cryptocurrency wallets using MetaMask.
- Create and mint music NFTs.
- Upload music files and artwork.
- Store NFT metadata using IPFS and Pinata.
- Explore available music NFTs.
- Buy NFTs using Polygon Amoy testnet POL.
- View and manage your NFT collection.
- Listen to music associated with NFTs.
- Download owned NFT content where available.

---

## 2. Technologies Used

| Technology | Purpose |
|---|---|
| Next.js | Frontend framework |
| React.js | User interface |
| Ethers.js | Blockchain communication |
| Solidity | Smart contract development |
| ERC-1155 | NFT token standard |
| Polygon Amoy | Blockchain test network |
| MetaMask | Cryptocurrency wallet |
| IPFS | Decentralized file storage |
| Pinata | IPFS file and metadata management |
| Hardhat / Remix | Smart contract development tools |
| Tailwind CSS | UI styling |

---

## 3. Prerequisites

Before running the project, install the following:

1. **Node.js:** Version 18 or newer.
   - Download: https://nodejs.org/

2. **npm:** Installed automatically with Node.js.

3. **MetaMask:** Browser wallet extension.
   - Download: https://metamask.io/

4. **Git (optional):** Useful for version control.
   - Download: https://git-scm.com/

5. **Visual Studio Code (recommended):**
   - Download: https://code.visualstudio.com/

---

## 4. Run the Project on Your Computer

Follow these steps to run NEONVERSE locally.

### Step 1: Extract the Project

- Download the project ZIP file.
- Right-click the ZIP file.
- Select **Extract All**.
- Open the extracted project folder.

Do not run the project directly from inside the ZIP file.

### Step 2: Open the Project in VS Code

Open VS Code.

Select:

`File → Open Folder`

Choose the extracted project folder.

**Important:** Open the actual project root folder containing `package.json`, not its parent folder.

### Step 3: Open the Terminal

In VS Code, select:

`Terminal → New Terminal`

Check that the terminal is inside the folder containing `package.json`.

On Windows PowerShell, you can navigate to it using:

```powershell
cd "C:\path\to\your\project"
```

### Step 4: Install Dependencies

Run:

```powershell
npm install
```

Wait until all dependencies are installed.

If the project includes a valid `package-lock.json`, you can alternatively use:

```powershell
npm ci
```

Do not run both commands unnecessarily.

### Step 5: Configure Environment Variables

Create a new file named:

`.env.local`

Place it in the project root, beside `package.json`.

Add the following configuration:

```env
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0x457d1A782557d4154F88169DABf62bDFB7382770

NEXT_PUBLIC_PINATA_JWT=your_own_pinata_jwt

NEXT_PUBLIC_AMOY_RPC=https://polygon-amoy-bor-rpc.publicnode.com,https://polygon-amoy.drpc.org
```

**Environment variable details:**

| Variable | Description |
|---|---|
| NEXT_PUBLIC_NFT_CONTRACT_ADDRESS | Deployed NFT marketplace contract address |
| NEXT_PUBLIC_PINATA_JWT | Your Pinata authentication token |
| NEXT_PUBLIC_AMOY_RPC | Polygon Amoy RPC endpoint or comma-separated endpoints |

Replace `your_own_pinata_jwt` with your own Pinata JWT.

Pinata: https://pinata.cloud/

The contract address above is the address configured for this project. If you use another contract, it must be deployed on Polygon Amoy and compatible with the included ABI.

The RPC variable is optional if the application already has working default RPC endpoints configured.

### Step 6: Start the Development Server

Run:

```powershell
npm run dev
```

Wait for the terminal to display the local development URL.

Open your browser and visit:

http://localhost:3000

**NEONVERSE is now running locally!**

---

## 5. Useful Commands

Run these commands from the project root folder.

| Command | Purpose |
|---|---|
| `npm install` | Install project dependencies |
| `npm ci` | Install exact dependencies using the lockfile |
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm start` | Start production server after building |
| `npm run lint` | Run linting, if configured in package.json |

### Run in Development Mode

```powershell
npm run dev
```

### Create a Production Build

```powershell
npm run build
```

### Start the Production Server

```powershell
npm start
```

Run `npm run build` successfully before running `npm start`.

---

## 6. MetaMask and Polygon Amoy Setup

NEONVERSE uses Polygon Amoy testnet.

Configure MetaMask with the following network details:

| Setting | Value |
|---|---|
| Network Name | Polygon Amoy |
| Network | Polygon Amoy Testnet |
| RPC URL | https://polygon-amoy-bor-rpc.publicnode.com |
| Chain ID | 80002 |
| Currency Symbol | POL |
| Block Explorer | https://amoy.polygonscan.com/ |

The application may request MetaMask to add or switch to Polygon Amoy automatically.

### Get Testnet POL

You need testnet POL to perform blockchain transactions and pay gas fees.

Use a Polygon Amoy faucet to obtain testnet tokens.

Polygon Amoy Explorer:

https://amoy.polygonscan.com/

---

## 7. Pinata and IPFS Configuration

NEONVERSE uses Pinata to upload music files, NFT artwork, and metadata to IPFS.

To configure Pinata:

1. Visit https://pinata.cloud/
2. Create an account or log in.
3. Generate your Pinata JWT.
4. Add the JWT to `.env.local`.
5. Restart the development server.

**Security Warning:**

The existing frontend configuration uses a `NEXT_PUBLIC_` Pinata JWT variable. Next.js exposes variables with this prefix to browser-side code.

Do not use a long-lived or privileged Pinata JWT in a public frontend. For a production deployment, move Pinata authentication and uploads to a secure server-side API route, and rotate any previously exposed credentials.

Never share private keys, wallet recovery phrases, or secret credentials.

---

## 8. RPC and Payment Troubleshooting

### RPC Connection Errors

You may encounter errors such as:

- `could not detect network`
- `missing trie node`
- `header not found`
- `unknown block`

These errors may occur when a public RPC endpoint is unavailable or experiencing issues.

**Solution:**

1. Check your Polygon Amoy RPC endpoint.
2. Update `NEXT_PUBLIC_AMOY_RPC` in `.env.local`.
3. Restart the development server.
4. Confirm that MetaMask is also connected to Polygon Amoy.

### MetaMask Network Error

Check the following:

- Network: Polygon Amoy.
- Chain ID: `80002`.
- Currency: `POL`.
- RPC URL: A working Polygon Amoy endpoint.

### Transaction Failed

Check that:

- Your wallet is connected.
- You are using Polygon Amoy.
- You have enough testnet POL for the NFT price and gas fees.
- The NFT is still available for purchase.
- The connected smart contract supports the marketplace operations.

### Pinata Upload Failed

Check that:

- Your Pinata JWT is valid.
- Your Pinata account has the required permissions.
- Your internet connection is working.
- Your environment variables are configured correctly.

After changing `.env.local`, restart the development server.

---

## 9. Important Project Files

| File / Folder | Purpose |
|---|---|
| `pages/index.jsx` | Homepage |
| `pages/marketplace.jsx` | NFT marketplace |
| `pages/create.jsx` | Create and mint NFTs |
| `pages/profile.jsx` | User NFT collection |
| `components/Navbar.jsx` | Navigation and wallet connection |
| `components/Card1.jsx` | Marketplace NFT card |
| `components/Card2.jsx` | NFT details and music player |
| `components/RegularButton.jsx` | Primary button |
| `components/StrokeButton.jsx` | Secondary outline button |
| `constants/index.js` | Smart contract ABI and configuration |
| `store/util.js` | Web3 provider and RPC utilities |
| `store/web3store.js` | Wallet and Web3 state management |
| `styles/globals.css` | Global styles and animations |
| `.env.local` | Local environment configuration |

---

## 10. Important Setup Notes

- Create `.env.local` in the same directory as `package.json`.
- Do not upload `.env.local` to GitHub.
- Do not share Pinata JWTs or wallet private keys.
- Do not change the contract address unless you are using a compatible deployed contract.
- The smart contract must be deployed on Polygon Amoy.
- Use testnet POL for testing transactions.
- Restart the development server after modifying environment variables.

---

## 11. Project Objective

NFT marketplaces provide a decentralized way to represent ownership of unique digital assets.

NEONVERSE applies this concept to the music industry by allowing artists and music enthusiasts to create, own, explore, and purchase music-related NFTs.

The project demonstrates how blockchain technology, smart contracts, decentralized storage, and modern frontend development can work together to create a Web3 music marketplace.

---

## 12. Live Project

**Website:** https://music-nfts-ruby.vercel.app/

**Blockchain:** Polygon Amoy Testnet

**Contract Address:**

`0x457d1A782557d4154F88169DABf62bDFB7382770`

---

**NEONVERSE – Own the Sound.**
