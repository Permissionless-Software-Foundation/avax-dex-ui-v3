/*
  Display any SLP tokens on the BCH network.
*/

// Global npm libraries
import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

// Local libraries
import BchTokenCard from './bch-token-card'

class BchTokens extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      bchWallet: props.bchWallet,
      tokens: []
    }
  }

  async componentDidMount () {
    try {
      const wallet = this.state.bchWallet

      // Wait for the wallet to load.
      await wallet.walletInfoPromise

      const tokenList = await wallet.listTokens()
      console.log('SLP tokens: ', tokenList)

      // const avaxBalances = await this.state.avaxWallet.utxos.getBalance(this.state.avaxWallet.walletInfo.address)
      // console.log('avaxBalances: ', avaxBalances)

      const tokens = []

      for (let i = 0; i < tokenList.length; i++) {
        const thisToken = tokenList[i]

        const symbol = thisToken.ticker
        const name = thisToken.name
        const qty = thisToken.qty

        tokens.push({
          symbol,
          name,
          qty
        })
      }

      this.setState({
        tokens
      })
    } catch (err) {
      console.error('Error in wallets.js component when trying to load AVAX wallet balances: ', err)
    }
  }

  render () {
    const tokens = []
    for (let i = 0; i < this.state.tokens.length; i++) {
      const thisToken = this.state.tokens[i]

      // tokens.push(<li key={`token-${i}`}>{thisToken.symbol}</li>)
      tokens.push(<><BchTokenCard key={`token-${i}`} symbol={thisToken.symbol} name={thisToken.name} qty={thisToken.qty} /><br /></>)
    }

    return (
      <>
        <Container>
          <Row>
            <Col>
              <h2>BCH (SLP) Tokens</h2>
            </Col>
          </Row>

          <Row>
            <Col>
              {tokens}
            </Col>
          </Row>
        </Container>
      </>
    )
  }
}

export default BchTokens
