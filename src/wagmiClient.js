import { createClient, configureChains, defaultChains } from 'wagmi';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';

// Configure Ethereum chains and providers
const { chains, provider, webSocketProvider } = configureChains(defaultChains, [
  jsonRpcProvider({
    rpc: (chain) => ({
      http: chain.rpcUrls.default.http[0],
    }),
  }),
]);

// Create wagmi client
export const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
});