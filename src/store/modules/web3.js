import { ethers, BigNumber, utils } from "ethers";
import StakingPool from "@/utils/Staking/index.json";
import ERC20_ABI from "@/utils/Staking/ERC20_abi.json";
import MartketPlace from "@/utils/Staking/MartketPlace.json";
import NFT from "@/utils/Staking/NFT.json";

import {
  appNetworkName,
  BSC_CHAIN_ID,
  appNetwork,
  getProvider,
  contract_address,
  martket_address,
  getApproveToken,
  getContractInstance,
  getApproveTokenBuni,
  getContract,
  getProviderLocal,
  appNetworkId
} from '@/utils/constants'

const BaseNetwork = appNetwork[appNetworkName.BSC];
const { ethereum } = window;
const web3 = getProvider();
const web3Local = appNetworkId === BSC_CHAIN_ID ? web3 : getProviderLocal();

const BlockchainProvider = {
  state: {
    appChainID: BSC_CHAIN_ID,
    account: null,
    error: null,
    contract_address: contract_address,
    appNetwork: BaseNetwork,
    provider: window.ethereum,
    tier: null,
    userStaked: {amount: 0},
    balance: localStorage.getItem('account_balance') || 0,
    balanceBUNI: localStorage.getItem('account_balance_buni') || 0,
    currentHash: '',
    loading: false,
    martketContract: {},
    martketOffers: [],
    appNetworkId: appNetworkId,
    myOffers: [],
    NFTContract: {},
    orders: []
  },
  mutations: {
    setAccount(state, account) {
      state.account = account;
    },
    setError(state, error) {
      state.error = error;
    },
    updateUserStaked(state, amount) {
      state.userStaked.amount = amount;
    },
    setBalance(state, amount) {
      state.balance = amount
    },
    setBalanceBuni(state, amount) {
      state.balanceBUNI = amount
    },
    setCurrentHash(state, hash) {
      state.currentHash = hash
    },
    setLoading(state, loading) {
      state.loading = loading
    },
    setMartketContract(state, contract) {
      state.martketContract = contract
    },
    setMartketOffer(state, martketOffers) {
      state.martketOffers = martketOffers
    },
    setAppNetworkId(state, appNetworkId) {
      state.appNetworkId = appNetworkId
    },
    setMyOffers(state, myOffers) {
      state.myOffers = myOffers
    },
    setNFTContract(state, contract) {
      state.NFTContract = contract
    },
    setOrder(state, order) {
      state.orders = order
    }
  },
  actions: {
    async initialize({ commit, dispatch, state }) {
      const account = await dispatch("checkIfConnected")
      if (account) {
        localStorage.setItem('account', account);
        await dispatch('userStaking', account);
        await dispatch('getBalance', account);
        await dispatch('getBalanceBuni', account);
        await dispatch('getNFTContract', account);
        commit('setAccount', account);
        const address = NFT.networks[state.appNetworkId].address
        const contractNFT = getContract(address, NFT.abi, account);
        contractNFT.on('Transfer', (address, to, tokenId) => {
          console.log('>>>>>>>>>>>Transfer>>>>>', address, to, tokenId)
        });
      }
    },
    async connect({ commit, dispatch }, connect) {
      try {
        if (!ethereum) {
          commit("setError", "Metamask not installed!");
          return;
        }
        const account = await dispatch("checkIfConnected")
        if (!!!account && connect) {
          await dispatch("requestAccess");
        }
        await dispatch("checkNetwork");
        await dispatch("setupEventListeners");
        await dispatch("userStaking", account);
        await dispatch('getBalance', account);
        await dispatch('getBalanceBuni', account);
      } catch (error) {
        console.log(error);
        commit("setError", "Account request refused.");
      }
    },
    async checkNetwork({ commit, dispatch }) {
      if (BaseNetwork.id !== BSC_CHAIN_ID) {
        if (!(await dispatch("switchNetwork"))) {
          commit(
            "setError",
            "You are not connected to the BSC!"
          );
        }
      }
    },
    async switchNetwork() {
      try {
        await ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: BSC_CHAIN_ID }],
        });
        return 1;
      } catch (switchError) {
        return 0;
      }
    },
    async checkIfConnected({ commit }) {
      const accounts = await ethereum.request({ 
        method: "eth_accounts"
      });
      if (accounts.length !== 0) {
        commit("setAccount", accounts[0]);
        return accounts[0];
      } else {
        return 0;
      }
    },
    async requestAccess({ commit }) {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      commit("setAccount", accounts[0]);
    },
    async getContract({ dispatch }) {
      try {
        return new web3.eth.Contract(
          StakingPool,
          contract_address
        );
      } catch (error) {
        console.log(error);
        console.log("connected contract not found");
        return null;
      }
    },
    async getMartketPlaceContract({ commit, state }, account) {
      try {
        const address = MartketPlace.networks[state.appNetworkId].address
        const contract = getContract(address, MartketPlace.abi, account);
        commit('setMartketContract', contract);
        return contract;
      } catch (error) {
        console.log(error);
        console.log("connected contract not found");
        return null;
      }
    },
    async getNFTContract({ commit, state }, account) {
      try {
        const address = NFT.networks[state.appNetworkId].address
        console.log(account, state.appNetworkId, '>>>>>>>>>>>>>>>>>>>>>,,,')
        const NFTContract = getContract(address, NFT.abi, account);
        console.log(NFTContract)
        commit('setNFTContract', NFTContract);
        return NFTContract;
      } catch (error) {
        console.log(error);
        console.log("connected contract not found");
        return null;
      }
    },
    async setupEventListeners({ commit, dispatch }) {
      try {
        const connectedContract = await dispatch('getContract');
        if (!connectedContract) return;
        //connectedContract.on([eventName], callback)
      } catch (error) {
        console.log(error);
      }
    },
    async getBalance({commit}, account) {
      try {
        const balance = await web3.eth.getBalance(account);
        const balanceReturn = utils.formatEther(balance);
        localStorage.setItem('account_balance', balanceReturn);
        commit("setBalance", balanceReturn);
      } catch(err) {
        console.log('getBalance::::', err)
      }
    },
    async getBalanceBuni({commit}, account) {
      try {
        const token = getApproveTokenBuni();
        const contract = getContractInstance(ERC20_ABI, token.address, 'MetaMask', BSC_CHAIN_ID, 'read', true);
        if (contract) {
          const balance = await contract.methods.balanceOf(account).call();
          const balanceReturn = utils.formatEther(balance);
          localStorage.setItem('account_balance_buni', balanceReturn);
          commit("setBalanceBuni", balanceReturn);
        }
      } catch(err) {
        console.log('getBalance::::', err)
      }
    },
    async userStaking({ commit, dispatch }, account) {
      try {
        const connectedContract = await dispatch('getContract');
        if (!connectedContract) return;
        const staking = await connectedContract.methods.userInfo(account).call()
        commit('updateUserStaked', staking.amount)
      } catch (error) {
        console.log('userStaking:::::', error);
      }
    },
    async userStakeToken({ commit, dispatch }, payload) {
      try {
        commit('setLoading', true)
        commit('setCurrentHash', '')
        const {amount, account} = payload
        const connectedContract = getContract(contract_address, StakingPool, account);
        if (!connectedContract) return;
        const transaction = await connectedContract.deposit(utils.parseEther(amount));
        commit('setCurrentHash', transaction.hash)
        await transaction.wait(1);
        commit('setLoading', false);
        await dispatch('userStaking', account);
      } catch (error) {
        console.log('usertakeToken:::::', error);
      }
    },
    async martketOffers({ commit, dispatch }) {
      try {
        commit('setLoading', true)
        const connectedContract = await dispatch('getMartketPlaceContract');
        if (!connectedContract) return;
        const transaction = await connectedContract.methods.getOffers().call();
        commit('setLoading', false);
        console.log('Offerrrr :::::', transaction)
      } catch (error) {
        console.log('Martket offers:::::', error);
      }
    },
    async martketOrders({ commit, dispatch }, account) {
      try {
        commit('setLoading', true)
        const connectedContract = await dispatch('getMartketPlaceContract', account);
        if (!connectedContract) return;
        const transaction = await connectedContract.getOrder();
        commit('setLoading', false);
        const orders = transaction.map(trans => ({ ct: trans[1], tokenId: BigNumber.from(trans[2]._hex).toNumber(), ver: BigNumber.from(trans[0]._hex).toNumber()}))
        commit('setOrder', orders);
        console.log('order :::::', transaction)
      } catch (error) {
        console.log('Martket offers:::::', error);
      }
    },
    async martketMyOffers({ commit, dispatch }, account) {
      try {
        commit('setLoading', true)
        const connectedContract = await dispatch('getNFTContract');
        if (!connectedContract) return;
        const transaction = await connectedContract.methods.myOffers(account, 10).call();
        commit('setLoading', false);
        console.log(transaction, '>>>>>>..sell')
        // commit('setMyOffers', transaction);
      } catch (error) {
        console.log('Martket offers:::::', error);
      }
    },
    async sellNFT({ commit, dispatch }, params) {
      try {
        commit('setLoading', true)
        const connectedContract = await dispatch('getMartketPlaceContract', params.account);
        if (!connectedContract) return;
        const {ver, address, tokenId, unit, openPrice, closePrice, startTime, duration, keep} = params
        const transaction = await connectedContract.sell(ver, address, tokenId, unit, openPrice, closePrice, startTime, duration, keep)
        const b = await transaction.wait();
        console.log(b , '>>>>>>>b')
        commit('setLoading', false);
        // commit('setMyOffers', transaction);
      } catch (error) {
        commit('setLoading', false);
        console.log('Martket sell:::::', error);
      }
    },
  }
}

export default BlockchainProvider
