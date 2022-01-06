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
  import { getApproveTokenBuni, getApproveToken, contract_address } from '@/utils/constants';

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
        scanUrl: 'https://testnet.bscscan.com/tx/'
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
        loading: state => state.web3.loading
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
        console.log(this.stakeAmount)
        await this.$store.dispatch('userStakeToken', { amount: this.stakeAmount, account: this.account});
      }
    },
    async mounted() {
      await this.$store.dispatch('initialize');
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







