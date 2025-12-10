import { http, createConfig } from 'wagmi';
import { base } from 'wagmi/chains';
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors';

// Get WalletConnect project ID from environment
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '56079185f69a12e1f6444a2b71ceffc9';

export const config = createConfig({
  chains: [base],
  connectors: [
    injected(),
    coinbaseWallet({
      appName: 'Karma Tipper',
      appLogoUrl: 'https://karma-tipper.vercel.app/splash.png',
      // Enable EIP-5792 support for batch transactions
      preference: 'smartWalletOnly',
    }),
    walletConnect({
      projectId,
    }),
  ],
  transports: {
    [base.id]: http(),
  },
});
