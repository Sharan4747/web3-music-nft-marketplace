// store/util.js
import { providers } from 'ethers';

export const AMOY_CHAIN_ID = 80002;
export const AMOY_HEX_CHAIN_ID = '0x13882';

const DEFAULT_RPC_URLS = [
  'https://polygon-amoy-bor-rpc.publicnode.com',
  'https://polygon-amoy.drpc.org',
];

const getRpcUrls = () => {
  const configured = process.env.NEXT_PUBLIC_AMOY_RPC
    ? process.env.NEXT_PUBLIC_AMOY_RPC.split(',').map((url) => url.trim()).filter(Boolean)
    : [];
  return [...new Set([...configured, ...DEFAULT_RPC_URLS])];
};

// A fallback provider lets reads continue if one public Amoy RPC is unavailable.
export const getReadProvider = () => {
  const urls = getRpcUrls();
  const configs = urls.map((url, index) => ({
    provider: new providers.JsonRpcProvider(url, {
      chainId: AMOY_CHAIN_ID,
      name: 'polygon-amoy',
    }),
    priority: index + 1,
    weight: 1,
    stallTimeout: 2500,
  }));
  return new providers.FallbackProvider(configs, 1);
};

const ensureAmoyNetwork = async (web3Provider) => {
  let network = await web3Provider.getNetwork();
  if (network.chainId === AMOY_CHAIN_ID) return;

  const ethereum = web3Provider.provider;
  if (!ethereum?.request) throw new Error('WRONG_NETWORK');

  await ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: AMOY_HEX_CHAIN_ID }],
  }).catch(async (error) => {
    if (error?.code !== 4902) throw error;
    await ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [{
        chainId: AMOY_HEX_CHAIN_ID,
        chainName: 'Polygon Amoy Testnet',
        nativeCurrency: { name: 'POL', symbol: 'POL', decimals: 18 },
        rpcUrls: getRpcUrls().slice(0, 3),
        blockExplorerUrls: ['https://amoy.polygonscan.com'],
      }],
    });
  });

  network = await web3Provider.getNetwork();
  if (network.chainId !== AMOY_CHAIN_ID) throw new Error('WRONG_NETWORK');
};

// Wallet provider/signer (MetaMask or another injected wallet).
export const getProviderOrSigner = async (web3ModalRef, needSigner = false) => {
  if (!web3ModalRef?.current) throw new Error('WALLET_NOT_INITIALIZED');

  const instance = await web3ModalRef.current.connect();
  const web3Provider = new providers.Web3Provider(instance, 'any');
  await ensureAmoyNetwork(web3Provider);

  return needSigner ? web3Provider.getSigner() : web3Provider;
};
