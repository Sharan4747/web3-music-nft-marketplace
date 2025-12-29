// store/util.js
import { providers } from 'ethers';

// Use a stable public RPC for READS (set in .env.local)
const RPC =
  process.env.NEXT_PUBLIC_AMOY_RPC ||
  'https://rpc-amoy.polygon.technology';

// Public read provider (no wallet)
export const getReadProvider = () => new providers.JsonRpcProvider(RPC);

// Wallet provider/signer (MetaMask)
export const getProviderOrSigner = async (web3ModalRef, needSigner = false) => {
  const instance = await web3ModalRef.current.connect();
  // 'any' prevents the “could not detect network” edge case on chain switch
  const web3Provider = new providers.Web3Provider(instance, 'any');

  const { chainId } = await web3Provider.getNetwork();
  if (chainId !== 80002) {
    window.alert('Change the network to Amoy (Polygon Testnet, chainId 80002).');
    throw new Error('WRONG_NETWORK');
  }

  return needSigner ? web3Provider.getSigner() : web3Provider;
};
