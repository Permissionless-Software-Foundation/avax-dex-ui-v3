/*
  This library gets data that requires an async wait.
*/

// Global npm libraries
import axios from 'axios'

class AsyncLoad {
  constructor () {
    this.BchWallet = false
    this.AvaxWallet = false
  }

  // Load the minimal-slp-wallet which comes in as a <script> file and is
  // attached to the global 'window' object.
  async loadBchWalletLib () {
    do {
      if (typeof window !== 'undefined' && window.SlpWallet) {
        this.BchWallet = window.SlpWallet

        return this.BchWallet
      } else {
        console.log('Waiting for BCH wallet library to load...')
      }

      await sleep(1000)
    } while (!this.BchWallet)
  }

  // Load the minimal-avax-wallet which comes in as a <script> file and is
  // attached to the global 'window' object.
  async loadAvaxWalletLib () {
    do {
      if (typeof window !== 'undefined' && window.SlpWallet) {
        this.AvaxWallet = window.AvaxWallet

        return this.AvaxWallet
      } else {
        console.log('Waiting for AVAX wallet library to load...')
      }

      await sleep(1000)
    } while (!this.AvaxWallet)
  }

  // Get the BCH and AVAX Mnemonics from the DEX server
  async getMnemonics () {
    // TODO: Add the axios.get() method to get the mnemonics from the server.
    // For now, simulating the mnemonics.

    const avax = 'rabbit window lyrics panel joke pudding approve promote arrest ten arctic ring midnight cancel true focus pet million lab duty pyramid sad soul verify'
    const bch = 'tackle mail mushroom relax shed vehicle start obvious worry disorder chair vocal'

    return { bch, avax }
  }

  // Initialize the BCH wallet
  async initBchWallet (mnemonic, restURL) {
    const options = {
      interface: 'consumer-api',
      restURL,
      noUpdate: true
    }

    const wallet = new this.BchWallet(mnemonic, options)

    await wallet.walletInfoPromise
    // console.log(`mnemonic: ${wallet.walletInfo.mnemonic}`)

    this.wallet = wallet

    return wallet
  }

  // Initialize the BCH wallet
  async initAvaxWallet (mnemonic) {
    const options = {
      // interface: 'consumer-api',
      // restURL,
      noUpdate: true
    }

    const wallet = new this.AvaxWallet(mnemonic, options)

    await wallet.walletInfoPromise
    // console.log(`mnemonic: ${wallet.walletInfo.mnemonic}`)

    this.wallet = wallet

    return wallet
  }

  // Get token data for a given Token ID
  async getTokenData (tokenId) {
    const tokenData = await this.wallet.getTokenData(tokenId)

    // Convert the IPFS CIDs into actual data.
    tokenData.immutableData = await this.getIpfsData(tokenData.immutableData)
    tokenData.mutableData = await this.getIpfsData(tokenData.mutableData)

    return tokenData
  }

  // Get data about a Group token
  async getGroupData (tokenId) {
    const tokenData = await this.getTokenData(tokenId)

    const groupData = {
      immutableData: tokenData.immutableData,
      mutableData: tokenData.mutableData,
      nfts: tokenData.genesisData.nfts,
      tokenId: tokenData.genesisData.tokenId
    }

    return groupData
  }

  // Given an IPFS URI, this will download and parse the JSON data.
  async getIpfsData (ipfsUri) {
    const cid = ipfsUri.slice(7)

    const downloadUrl = `https://${cid}.ipfs.dweb.link/data.json`

    const response = await axios.get(downloadUrl)
    const data = response.data

    return data
  }
}

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export default AsyncLoad
