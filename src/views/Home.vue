<template>
  <div id="home">
    <h1>Vue DAPP</h1>
    <div class="row">
      <div class="col-12">
        <button class="btn btn-primary" v-if="!account" @click="connectWallet">Connect wallet</button>
        <div class="account-info" v-else>
          <p>Address: {{ account }}</p>
          <p>Staking pool: {{ poolAddress }}</p>
          <p>Staking: {{ staking }}BUNI</p>
          <p>Account balance: {{ balance }}</p>
          <p>BNB balance: {{ bnbBalance }}</p>
          <p v-if="txHash && !loading">
            Current Hash: <a :href="`${scanUrl}${txHash}`">{{ txHash }}</a> 
          </p>
          <p v-if="loading">Loading.......</p>
          <div class="container">
            <div class="row">
              <div class="form-group col-4">
                <input type="number" class="form-control" v-model="stakeAmount">
              </div>
              <div class="col-4">
                <button class="btn btn-danger" @click="userStake">Stake</button>
              </div>
            </div>
          </div>
        </div>
        <div class="container">
          <div class="row">
            <div class="form-group col-4">
              <button class="btn btn-danger" @click="mintNFT">Mint NFT</button>
            </div>
            <div class="form-group col-4">{{ newNFT }}</div>
          </div>
        </div>

        <div class="container">
          <div class="row">
            <div class="form-group col-12">
              <input type="text" v-model="sellObj.address" class="form-control" placeholder="Address nft...">
              <input type="text" v-model="sellObj.tokenId" class="form-control" placeholder="Tokenid">
              <input type="number" v-model="sellObj.price" class="form-control" placeholder="Price...">
            </div>
            <div class="form-group col-4">
              <button class="btn btn-danger" @click="sellNFT">Sell NFT</button>
            </div>
          </div>
        </div>
        <!-- <table class="table table-striped">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Description</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(app, index) in apps"
              :key="index">
              <th scope="row">{{ index + 1 }}</th>
              <td :class="{'app-success': app.status}">{{ app.name }}</td>
              <td >{{ app.desc }}</td>
              <td><button v-if="!app.status" class="btn btn-danger" @click="remove(index)">X</button></td>
            </tr>
          </tbody>
        </table> -->
      </div>
    </div>
  </div>
</template>

<script>
  import FormInput from '@/components/CommonForm'
  import UpdateForm from '@/components/UpdateForm'
  import Test from '@/components/Test'
  import {mapState} from 'vuex'
  import { utils } from 'ethers';
  import { getApproveTokenBuni, getApproveToken, contract_address, nft_address } from '@/utils/constants';

  export default {
    name: 'Homepage',
    data() {
      return {
        apps: [
          { name: 'app1', 'desc': 'App1 description <b>App HTML</b>', status: 0 },
          { name: 'app2', 'desc': 'App2 description <b>App HTML</b>', status: 0 },
          { name: 'app3', 'desc': 'App3 description <b>App HTML</b>', status: 0 },
        ],
        isShow: true,
        stakeAmount: 0,
        scanUrl: 'https://testnet.bscscan.com/tx/',
        newNFT: {},
        sellObj: {
          address: '',
          tokenId: 0,
          price: 0
        }
      }
    },
    components: {
      FormInput,
      UpdateForm,
      Test
    },
    computed: {
      ...mapState({
        account: state => state.web3.account,
        staking: state => utils.formatEther(state.web3.userStaked.amount),
        buniBalance: state => state.web3.balanceBUNI,
        currentBalance: state => state.web3.balance,
        txHash: state => state.web3.currentHash,
        loading: state => state.web3.loading,
        martketContract: state => state.web3.martketContract,
        myOffers: state => state.web3.myOffers,
        NFTContract: state => state.web3.NFTContract,
        orders: state => state.web3.orders
      }),
      buni() {
        return getApproveTokenBuni()
      },
      balance() {
        return `${this.buniBalance}${this.buni.symbol}`
      },
      bnb() {
        return getApproveToken()
      },
      bnbBalance() {
        return `${this.currentBalance}${this.bnb.symbol}`
      },
      poolAddress() {
        return contract_address
      }
    },
    methods: {
      remove(index) {
        // this.apps[index].status = 1
        // logiz
      },
      async connectWallet() {
        await this.$store.dispatch('connect', 1);
      },
      async userStake() {
        if (!this.stakeAmount) return
        await this.$store.dispatch('userStakeToken', { amount: this.stakeAmount, account: this.account});
      },
      async mintNFT() {
        try {
          console.log('HEREEEE');
          const mint = await this.NFTContract.mint(this.account);
          const a = await mint.wait();
          console.log('min success', a);
          this.newNFT = a;
        } catch(err) {
          console.log('Min err', err)
        }
      },
      sellNFT() {
        const params = {
          ver: 721,
          address: this.sellObj.address,
          tokenId: this.sellObj.tokenId,
          unit: this.account,
          openPrice: this.sellObj.price,
          closePrice: 1,
          startTime: new Date('2021-01-11 01:00:00').getTime(),
          duration: 0,
          keep: false,
          account: this.account
        }
        this.$store.dispatch('sellNFT', params);
      }
    },
    async mounted() {
      await this.$store.dispatch('initialize');
      await this.$store.dispatch('getMartketPlaceContract', this.account);
      await this.$store.dispatch('martketOrders', this.account);
      // await this.$store.dispatch('getNFTContract');
      // await this.$store.dispatch('martketOffers');
      // console.log(this.martketContract, '>>>m');
      // console.log(this.NFTContract, '>>>nft');
      // await this.mintNFT();
      // await this.sellNFT();
      console.log(this.orders, '>>>>>///oooo')
    }
  }
</script>

<style lang="scss" scoped>
  .app-success {
    text-decoration: line-through;
  }
</style>

<style lang="scss">
  .title {
    color: red;
  }
</style>







