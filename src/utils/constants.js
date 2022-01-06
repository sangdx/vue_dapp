const Web3 = require("web3");
import { ethers, Contract } from 'ethers';

export const appNetworkName = {
  BSC: 'BSC'
}

const NETWORK_URL = process.env.NETWORK_PROVIDER || '';

export const BSC_CHAIN_ID = process.env.BSC_CHAIN_ID
export const contract_address = process.env.STAKING_ADDRESS

export const appNetwork = {
  [appNetworkName.BSC]: {
    name: 'BSC',
    id: BSC_CHAIN_ID ,
    icon: "/images/BNB.svg"
  }
}

export const getProvider = () => {
  return new Web3(process.env.NETWORK_PROVIDER || 'https://data-seed-prebsc-1-s1.binance.org:8545/');
}

export const getContractInstance = (
  ABIContract,
  contractAddress,
  networkName = 'MetaMask',
  appChainID = BSC_CHAIN_ID,
  typeMethod = 'read',
  forceUsingEther = false
) => {
  const provider = getProviderByNetwork(networkName, appChainID, typeMethod, forceUsingEther);

  if (provider) {
    const web3Instance = new Web3(provider);
    return new web3Instance.eth.Contract(
      ABIContract,
      contractAddress,
    );
  }

  return;
};

export const getProviderByNetwork = (
  networkName,
  appChainID,
  typeMethod,
  forceUsingEther
) => {
  if (forceUsingEther) {
      return new Web3.providers.HttpProvider(NETWORK_URL);
  }
  if (appChainID && typeMethod === 'read') {
      // switch (appChainID) {
      //   case BSC_CHAIN_ID: 
      //     return new Web3.providers.HttpProvider(BSC_NETWORK_URL);
      //   case POLYGON_CHAIN_ID:
      //     return new Web3.providers.HttpProvider(POLYGON_NETWORK_URL);
      //   case ETH_CHAIN_ID:
      //   default:
      //     return new Web3.providers.HttpProvider(NETWORK_URL);
      // }
  }
}

export const getSigner = (library, account) => library.getSigner(account).connectUnchecked()
export const getProviderOrSigner = (library, account = '')  => account ? getSigner(library, account) : library

export const getContract = (address, ABI, account = '') => {
  if (!ethers.utils.isAddress(address)) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }
  const library = new ethers.providers.Web3Provider(window.ethereum);
  return new Contract(address, ABI, getProviderOrSigner(library, account))
}


export const getApproveToken = (appChainId = 0) => {
  return {
    address: '0xb8c77482e45f1f44de1745f52c74426c631bdd52',
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18,
  }
}
export const getApproveTokenBuni = () => {
  return {
    address: '0x958b7F4D1eca6331C86D983b6229F6b23Ce2993a',
    name: 'BUNI',
    symbol: 'BUNI',
    decimals: 18,
  }
}
