/*
  This is an SPA that displays information about NFTs on the BCH blockchain.
*/

// Global npm libraries
import React from 'react'
// import { Container, Row, Col } from 'react-bootstrap'
import { useQueryParam, StringParam } from 'use-query-params'

// Local libraries
import './App.css'
import LoadScripts from './components/load-scripts'
import WaitingModal from './components/waiting-modal'
import AsyncLoad from './services/async-load'
import ServerSelect from './components/servers'
import Footer from './components/footer'
import NavMenu from './components/nav-menu'
import AppBody from './components/app-body'

// Default restURL for a back-end server.
let serverUrl = 'https://free-bch.fullstack.cash'
let queryParamExists = false

let _this

class App extends React.Component {
  constructor (props) {
    super(props)

    // Encasulate dependencies
    this.asyncLoad = new AsyncLoad()

    // Working array for storing modal output.
    this.modalBody = []

    this.state = {
      walletInitialized: false,
      bchWallet: false,
      avaxWallet: false,
      modalBody: this.modalBody,
      hideSpinner: false,
      menuState: 0,
      queryParamExists: false,
      serverUrl,
      bchMnemonic: '',
      avaxMnemonic: ''
    }

    this.cnt = 0

    _this = this
  }

  async componentDidMount () {
    try {
      this.addToModal('Loading minimal-slp-wallet')

      await this.asyncLoad.loadBchWalletLib()

      this.addToModal('Loading minimal-avax-wallet')

      await this.asyncLoad.loadAvaxWalletLib()

      this.addToModal('Getting Wallet Mnemonic from Server')

      const mnemonics = await this.asyncLoad.getMnemonics()
      console.log('mnemonics: ', mnemonics)

      this.addToModal('Initializing BCH wallet')

      const bchWallet = await this.asyncLoad.initBchWallet(mnemonics.bch, serverUrl)

      this.addToModal('Initializing AVAX wallet')

      const avaxWallet = await this.asyncLoad.initAvaxWallet(mnemonics.avax)

      this.setState({
        bchWallet,
        avaxWallet,
        walletInitialized: true,
        serverUrl,
        queryParamExists,
        bchMnemonic: mnemonics.bch,
        avaxMnemonic: mnemonics.avax
      })

      // Kick off the wallet balance retrieval, but do not wait for them to
      // complete (no await).
      avaxWallet.utxos.initUtxoStore(avaxWallet.walletInfo.address)
      bchWallet.utxos.initUtxoStore(bchWallet.walletInfo.address)
    } catch (err) {
      this.modalBody = [
        `Error: ${err.message}`,
        'Try selecting a different back end server using the drop-down menu at the bottom of the app.'
      ]

      this.setState({
        modalBody: this.modalBody,
        hideSpinner: true
      })
    }
  }

  render () {
    // console.log('App component rendered. this.state.wallet: ', this.state.wallet)
    // console.log(`App component menuState: ${this.state.menuState}`)
    // console.log(`render() this.state.serverUrl: ${this.state.serverUrl}`)

    return (
      <>
        <GetRestUrl />
        <LoadScripts />
        <NavMenu menuHandler={this.onMenuClick} />
        {this.state.walletInitialized ? <InitializedView bchWallet={this.state.bchWallet} avaxWalet={this.state.avaxWallet} menuState={this.state.menuState} /> : <UninitializedView modalBody={this.state.modalBody} hideSpinner={this.state.hideSpinner} />}
        <ServerSelect displayUrl={this.state.serverUrl} queryParamExists={queryParamExists} />
        <Footer />
      </>
    )
  }

  // Add a new line to the waiting modal.
  addToModal (inStr) {
    this.modalBody.push(inStr)

    this.setState({
      modalBody: this.modalBody
    })
  }

  // This handler is passed into the child menu component. When an item in the
  // nav menu is clicked, this handler will update the state. The state is
  // used by the AppBody component to determine which View component to display.
  onMenuClick (menuState) {
    // console.log('menuState: ', menuState)

    _this.setState({
      menuState
    })
  }
}

// This is rendered *before* the BCH wallet is initialized.
function UninitializedView (props) {
  // console.log('UninitializedView props: ', props)

  const heading = 'Loading Blockchain Data...'

  return (
    <WaitingModal heading={heading} body={props.modalBody} hideSpinner={props.hideSpinner} />
  )
}

// This is rendered *after* the BCH wallet is initialized.
function InitializedView (props) {
  // console.log(`InitializedView props.menuState: ${props.menuState}`)
  // console.log(`InitializedView _this.state.menuState: ${_this.state.menuState}`)

  return (
    <>
      <br />
      <AppBody menuState={_this.state.menuState} bchWallet={_this.state.bchWallet} avaxWallet={_this.state.avaxWallet} />
    </>
  )
}

// Get the restURL query parameter.
function GetRestUrl (props) {
  const [restURL] = useQueryParam('restURL', StringParam)
  // console.log('restURL: ', restURL)

  if (restURL) {
    serverUrl = restURL
    queryParamExists = true
  }

  return (<></>)
}

export default App
