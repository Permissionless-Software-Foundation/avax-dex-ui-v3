/*
  This app displays the wallet data.
*/

// Global npm libraries
import React from 'react'
import { Button } from 'react-bootstrap'

let _this

class Wallets extends React.Component {
  constructor (props) {
    super(props)

    // console.log('Placeholder 3 loaded.')

    this.state = {
      bchWallet: props.bchWallet,
      avaxWallet: props.avaxWallet,
      bchBalance: 0,
      avaxBalance: 0
    }

    _this = this
  }

  async componentDidMount () {
    try {
      await this.state.avaxWallet.walletInfoPromise

      const avaxBalances = await this.state.avaxWallet.utxos.getBalance(this.state.avaxWallet.walletInfo.address)
      console.log('avaxBalances: ', avaxBalances)

      // Filter out just the AVAX
      let avaxBalance = avaxBalances.filter(x => x.symbol === 'AVAX')
      avaxBalance = avaxBalance[0].amount / Math.pow(10, avaxBalance[0].denomination)
      console.log('avaxBalance: ', avaxBalance)

      this.setState({
        avaxBalance
      })
    } catch (err) {
      console.error('Error in wallets.js component when trying to load AVAX wallet balances: ', err)
    }

    try {
      await this.state.bchWallet.walletInfoPromise

      const bchBalance = await this.state.bchWallet.getBalance()
      console.log('bchBalance: ', bchBalance)

      this.setState({
        bchBalance
      })
    } catch (err) {
      console.error('Error in wallets.js component when trying to load BCH wallet balances: ', err)
    }
  }

  render () {
    return (
      <>
        <h3>AVAX Wallet</h3>
        <ul>
          <li>
            Address: {this.state.avaxWallet.walletInfo.address}
          </li>
          <li>
            Balance: {this.state.avaxBalance}
          </li>
          <li>
            <Button variant='primary' onClick={this.handleRefreshAvax}>Refresh</Button>
          </li>
        </ul>

        <h3>BCH Wallet</h3>
        <ul>
          <li>
            Address: {this.state.bchWallet.walletInfo.address}
          </li>
          <li>
            Balance: {this.state.bchBalance}
          </li>
          <li>
            <Button variant='primary' onClick={this.handleRefreshBch}>Refresh</Button>
          </li>
        </ul>
      </>
    )
  }

  async handleRefreshBch () {
    try {
      await _this.state.bchWallet.walletInfoPromise

      const bchBalance = await _this.state.bchWallet.getBalance()
      console.log('bchBalance: ', bchBalance)

      _this.setState({
        bchBalance
      })
    } catch (err) {
      console.error('Error in wallets.js handleRefreshBch() when trying to load BCH wallet balances: ', err)
    }
  }

  async handleRefreshAvax () {
    try {
      await _this.state.avaxWallet.walletInfoPromise

      const avaxBalances = await _this.state.avaxWallet.utxos.getBalance(_this.state.avaxWallet.walletInfo.address)
      console.log('avaxBalances: ', avaxBalances)

      // Filter out just the AVAX
      let avaxBalance = avaxBalances.filter(x => x.symbol === 'AVAX')
      avaxBalance = avaxBalance[0].amount / Math.pow(10, avaxBalance[0].denomination)
      console.log('avaxBalance: ', avaxBalance)

      _this.setState({
        avaxBalance
      })
    } catch (err) {
      console.error('Error in wallets.js handleRefreshAvax() when trying to load AVAX wallet balances: ', err)
    }
  }
}

export default Wallets
