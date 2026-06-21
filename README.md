# Simple Payment dApp (Stellar Level 1)

A responsive Stellar testnet dApp built with Vite, React, TypeScript, Tailwind CSS, Freighter, and `@stellar/stellar-sdk`.

## Features

- Connect and disconnect Freighter wallet
- Stellar testnet network check
- Fetch and display native XLM balance
- Fund account with Friendbot
- Send XLM payments on testnet
- Show success/failure feedback with transaction hash and explorer link

## Level 1 Checklist

- [x] Freighter wallet setup on Stellar testnet
- [x] Wallet connect / disconnect
- [x] XLM balance fetch and display
- [x] Send XLM transaction on testnet
- [x] Transaction success/failure feedback with hash
- [x] Modular UI, wallet integration, balance fetch, transaction logic, error handling

## Prerequisites

- Node.js 20+
- [Freighter browser extension](https://www.freighter.app/)
- Freighter configured to **Testnet**

## Getting Started

```bash
npm install
npm run dev
```

Open the local URL shown in the terminal (default: `http://localhost:5173`).

## Test Flow

1. Install Freighter and switch it to **Testnet**
2. Open the dApp and click **Connect Wallet**
3. Approve the Freighter connection request
4. Click **Fund with Friendbot** if your balance is `0`
5. Enter a destination testnet address and amount
6. Click **Send Payment** and approve the transaction in Freighter
7. Confirm the success message and open the Stellar Expert link

## Project Structure

```text
src/
├── components/     # UI components
├── hooks/          # Freighter wallet hook
└── lib/            # Stellar config, balance, friendbot, transactions
```

## Deploy to Vercel

1. Push this project to a public GitHub repository
2. Import the repository in [Vercel](https://vercel.com/)
3. Use these settings:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Deploy

The included `vercel.json` adds SPA rewrites for client-side routing.

## Scripts

- `npm run dev` - start local dev server
- `npm run build` - typecheck and build for production
- `npm run preview` - preview production build locally

## Network

- Horizon: `https://horizon-testnet.stellar.org`
- Friendbot: `https://friendbot.stellar.org`
- Explorer: `https://stellar.expert/explorer/testnet`
