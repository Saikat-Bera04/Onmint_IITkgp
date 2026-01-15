# Changelog

All notable changes to OnMint BNPL will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-01-16

### Added
- 🎉 Initial release of OnMint BNPL protocol
- ✅ TrustScoreManager smart contract with dynamic scoring
- ✅ BNPLCore smart contract with loan management
- ✅ Trust-based credit limit calculation (10 USDC + bonus)
- ✅ 7-day repayment period with early bonus (+15 pts)
- ✅ Installment payment support (1-3 payments)
- ✅ Merchant whitelist system
- ✅ Admin liquidity pool management
- ✅ Next.js 16 frontend with Turbopack
- ✅ Web3 wallet integration (wagmi + RainbowKit)
- ✅ User dashboard with trust score visualization
- ✅ Shop interface with BNPL checkout
- ✅ Repayment interface with progress tracking
- ✅ Admin panel for protocol management
- ✅ Comprehensive test suite (39 tests, 100% pass rate)
- ✅ Deployment scripts for Polygon Amoy
- ✅ Contract verification on PolygonScan
- ✅ Complete documentation (API, Testing, Deployment)
- ✅ Contributing guidelines
- ✅ MIT License
- ✅ Security policy

### Deployed
- **Network:** Polygon Amoy Testnet (Chain ID: 80002)
- **TrustScoreManager:** `0x3ef1456a5AbA04eFd979be0a49232211C88Df014`
- **BNPLCore:** `0x0B8e9E0278Fe46647E9C4876586Ece93e8Ec1F65`
- **Status:** Verified on PolygonScan ✅

### Security
- ⚠️ Testnet only - not audited for production
- ⚠️ Use with test funds only
- ⚠️ Formal audit required before mainnet

---

## [Unreleased]

### Planned for v1.1.0
- Enhanced credit scoring with wallet history analysis
- ZK-proof privacy layer for balance verification
- Cross-protocol credit data integration
- Default handling and risk management system
- Protocol analytics dashboard
- Economic model documentation
- Privacy architecture documentation

### Planned for v2.0.0
- Mainnet deployment on Polygon
- Governance token ($ONMINT)
- Liquidity mining program
- Multi-chain support (Ethereum, Arbitrum, Base)
- Mobile app (React Native)
- Advanced risk models
- Insurance pool for defaults
- Decentralized credit bureau

---

## Version History

### [1.0.0] - 2026-01-16
**"Genesis Release"** - First public testnet deployment

**Highlights:**
- 🚀 Fully functional BNPL protocol
- 📊 Trust score system (0-100+ scale)
- 💰 Dynamic credit limits
- 📱 Modern Web3 frontend
- ✅ Production-ready smart contracts
- 📚 Comprehensive documentation

**Statistics:**
- 2 smart contracts deployed
- 39 tests passing
- 4 frontend pages
- 8 React components
- 3 custom hooks
- 5 deployment scripts
- 6 documentation files

**Contributors:**
- Samya Deb (@SamyaDeb)

---

## Notes

### Breaking Changes
None in v1.0.0

### Deprecations
None in v1.0.0

### Bug Fixes
None in v1.0.0 (initial release)

### Performance Improvements
- Gas-optimized smart contracts
- Efficient frontend bundle size
- Optimized RPC calls with wagmi

---

## How to Upgrade

### From Source
```bash
git pull origin main
npm install
cd frontend && npm install
npx hardhat compile
```

### Redeploy Contracts
```bash
npx hardhat run scripts/deploy.ts --network amoy
# Update frontend/.env.local with new addresses
```

---

## Links

- **Repository:** https://github.com/SamyaDeb/OnMint
- **Documentation:** See `/docs` folder
- **Issues:** https://github.com/SamyaDeb/OnMint/issues
- **Polygon Amoy Explorer:** https://amoy.polygonscan.com/

---

## Stay Updated

Watch this repository for updates:
```bash
# GitHub CLI
gh repo watch SamyaDeb/OnMint

# Or click "Watch" on GitHub web interface
```

---

[Unreleased]: https://github.com/SamyaDeb/OnMint/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/SamyaDeb/OnMint/releases/tag/v1.0.0
