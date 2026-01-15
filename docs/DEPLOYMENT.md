# 🚀 Deployment Guide

## Prerequisites

### Required Tools
- Node.js 18+ and npm
- MetaMask or compatible Web3 wallet
- Hardhat CLI
- Git

### Required Tokens
- Test MATIC for gas (get from [Polygon Faucet](https://faucet.polygon.technology/))
- Test USDC for testing (get from [Circle Faucet](https://faucet.circle.com/))

### API Keys
- PolygonScan API key (get from [polygonscan.com](https://polygonscan.com/apis))
- Alchemy API key (optional, for better RPC)
- WalletConnect Project ID (get from [cloud.walletconnect.com](https://cloud.walletconnect.com/))

---

## Step 1: Clone and Setup

```bash
git clone https://github.com/SamyaDeb/OnMint.git
cd OnMint
npm install
```

---

## Step 2: Configure Environment

### Backend Configuration

Create `.env` file in project root:

```env
PRIVATE_KEY=your_wallet_private_key_here
AMOY_RPC_URL=https://rpc-amoy.polygon.technology
POLYGONSCAN_API_KEY=your_polygonscan_api_key_here
```

⚠️ **Security Warning:** Never commit your `.env` file! It's already in `.gitignore`.

### Frontend Configuration

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_TRUST_SCORE_MANAGER_ADDRESS=deployed_address_after_step_3
NEXT_PUBLIC_BNPL_CORE_ADDRESS=deployed_address_after_step_3
NEXT_PUBLIC_AMOY_RPC_URL=https://rpc-amoy.polygon.technology
```

---

## Step 3: Deploy Smart Contracts

### 3.1 Compile Contracts

```bash
npx hardhat compile
```

Expected output:
```
Compiled 10 Solidity files successfully
```

### 3.2 Run Tests

```bash
npx hardhat test
```

Expected: All 39 tests passing ✅

### 3.3 Deploy to Polygon Amoy

```bash
npx hardhat run scripts/deploy.ts --network amoy
```

Expected output:
```
Deploying contracts to Polygon Amoy...
TrustScoreManager deployed to: 0x...
BNPLCore deployed to: 0x...
Contracts linked successfully!
Merchant added: 0x...
```

**📝 Important:** Copy the deployed contract addresses!

### 3.4 Verify Contracts on PolygonScan

```bash
npx hardhat run scripts/verify.ts --network amoy
```

Expected output:
```
Verifying TrustScoreManager...
Successfully verified!
Verifying BNPLCore...
Successfully verified!
```

---

## Step 4: Setup Protocol

### 4.1 Add Liquidity to Pool

```bash
npx hardhat run scripts/setup-liquidity.ts --network amoy
```

This script:
1. Deposits 2.0 USDC to protocol pool
2. Adds merchant to whitelist
3. Verifies setup

Expected output:
```
Current protocol liquidity: 2.0 USDC
Merchant 0x... added successfully
Setup complete!
```

### 4.2 Update Frontend Environment

Update `frontend/.env.local` with deployed addresses from Step 3.3:

```env
NEXT_PUBLIC_TRUST_SCORE_MANAGER_ADDRESS=0xYourTrustScoreAddress
NEXT_PUBLIC_BNPL_CORE_ADDRESS=0xYourBNPLCoreAddress
```

---

## Step 5: Run Frontend

### 5.1 Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 5.2 Start Development Server

```bash
npm run dev
```

Expected output:
```
▲ Next.js 16.1.2 (Turbopack)
- Local:         http://localhost:3000
- Network:       http://192.168.x.x:3000

✓ Ready in 1s
```

### 5.3 Access Application

Open browser: http://localhost:3000

---

## Step 6: Test the Application

### 6.1 Connect Wallet

1. Click "Connect Wallet" button
2. Select MetaMask
3. Switch to Polygon Amoy network (will auto-prompt)
4. Approve connection

### 6.2 Check Dashboard

- Navigate to Dashboard
- Verify trust score shows 0
- Verify credit limit shows 10 USDC

### 6.3 Create First Loan

1. Go to Shop page
2. Click "Buy with BNPL" on first product
3. Confirm transaction in MetaMask
4. Wait for confirmation toast

### 6.4 Repay Loan

1. Go to Repay page
2. Click "Approve USDC"
3. Click "Pay Full Amount"
4. Verify trust score increases

---

## Production Deployment

### Frontend Deployment (Vercel)

1. **Connect GitHub Repository**
   ```bash
   # Push to GitHub first
   git remote add origin https://github.com/SamyaDeb/OnMint.git
   git push -u origin main
   ```

2. **Import to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select GitHub repository
   - Configure:
     - Root Directory: `frontend`
     - Framework: Next.js
     - Build Command: `npm run build`

3. **Set Environment Variables**
   Add all variables from `frontend/.env.local`:
   - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
   - `NEXT_PUBLIC_TRUST_SCORE_MANAGER_ADDRESS`
   - `NEXT_PUBLIC_BNPL_CORE_ADDRESS`
   - `NEXT_PUBLIC_AMOY_RPC_URL`

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Get deployment URL: `https://your-app.vercel.app`

### Mainnet Deployment (Future)

⚠️ **Before deploying to Polygon mainnet:**

1. **Security Audit**
   - Get contracts audited by professional firm
   - Run automated security tools (Slither, Mythril)
   - Conduct penetration testing

2. **Economic Review**
   - Validate economic model with real data
   - Test with larger amounts
   - Ensure sufficient liquidity

3. **Legal Compliance**
   - Consult legal counsel
   - Ensure compliance with local regulations
   - Implement KYC/AML if required

4. **Deployment Steps**
   ```bash
   # Update hardhat.config.ts with mainnet settings
   # Update .env with mainnet RPC and keys
   
   npx hardhat run scripts/deploy.ts --network polygon
   npx hardhat run scripts/verify.ts --network polygon
   ```

---

## Troubleshooting

### Issue: "Insufficient funds for gas"
**Solution:** Get more test MATIC from [Polygon Faucet](https://faucet.polygon.technology/)

### Issue: "Network not supported"
**Solution:** 
1. Open MetaMask
2. Add Polygon Amoy network manually:
   - Network Name: Polygon Amoy Testnet
   - RPC URL: https://rpc-amoy.polygon.technology
   - Chain ID: 80002
   - Currency Symbol: MATIC
   - Block Explorer: https://amoy.polygonscan.com

### Issue: "Transaction failed"
**Solution:**
- Check RPC connection
- Ensure sufficient gas
- Verify contract addresses
- Check transaction on PolygonScan

### Issue: "Module not found"
**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Port 3000 already in use"
**Solution:**
```bash
# Kill existing process
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

---

## Monitoring & Maintenance

### Check Protocol Health

```bash
npx hardhat run scripts/test-rpc.ts --network amoy
```

Checks:
- Contract connectivity
- Protocol liquidity
- Active loans
- Merchant status

### View Logs

```bash
# View transaction logs on PolygonScan
https://amoy.polygonscan.com/address/YOUR_CONTRACT_ADDRESS

# View frontend logs
# Open browser DevTools → Console
```

### Update Contract Addresses

If you redeploy contracts:

1. Update `frontend/.env.local`
2. Update `deployments/latest.json`
3. Restart frontend server
4. Clear browser cache

---

## Backup & Recovery

### Backup Important Data

```bash
# Backup deployment addresses
cp deployments/latest.json deployments/backup-$(date +%Y%m%d).json

# Backup environment files (encrypted)
# Never commit actual .env files!
```

### Recovery Steps

If something goes wrong:

1. **Smart Contracts:** Redeploy from `scripts/deploy.ts`
2. **Frontend:** Redeploy to Vercel
3. **Data Loss:** Contracts are immutable, data is on-chain

---

## Performance Optimization

### Frontend Optimization

```bash
# Build optimized production bundle
cd frontend
npm run build

# Analyze bundle size
npm install -g @next/bundle-analyzer
ANALYZE=true npm run build
```

### Smart Contract Optimization

- Use `view` functions for reads (no gas)
- Batch write operations
- Optimize storage layout
- Use events for off-chain indexing

---

## Support

### Get Help

- **GitHub Issues:** [github.com/SamyaDeb/OnMint/issues](https://github.com/SamyaDeb/OnMint/issues)
- **Polygon Discord:** [discord.gg/polygon](https://discord.gg/polygon)
- **Documentation:** See `docs/` folder

### Useful Resources

- [Polygon Documentation](https://docs.polygon.technology/)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [wagmi Documentation](https://wagmi.sh/)

---

## Next Steps

After successful deployment:

1. ✅ Test full BNPL flow with real users
2. ✅ Monitor default rates and adjust parameters
3. ✅ Implement additional features from NEXT_STEPS.md
4. ✅ Prepare for mainnet launch
5. ✅ Build community and gather feedback

Good luck! 🚀
