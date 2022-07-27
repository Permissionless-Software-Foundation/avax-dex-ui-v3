/*
  This is a placeholder View
*/

// Global npm libraries
import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

// Local libraries
import AvaxTokenCard from './avax-token-card'

class AvaxTokens extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      avaxWallet: props.avaxWallet,
      tokens: []
    }
  }

  async componentDidMount () {
    try {
      // Wait for the wallet to load.
      await this.state.avaxWallet.walletInfoPromise

      const avaxBalances = await this.state.avaxWallet.utxos.getBalance(this.state.avaxWallet.walletInfo.address)
      console.log('avaxBalances: ', avaxBalances)

      const tokens = []

      for (let i = 0; i < avaxBalances.length; i++) {
        const thisToken = avaxBalances[i]

        // Skip AVAX. Just count tokens.
        if (thisToken.symbol === 'AVAX') continue

        const symbol = thisToken.symbol
        const name = thisToken.name
        const qty = thisToken.amount / Math.pow(10, thisToken.denomination)

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

  render (props) {
    const tokens = []
    for (let i = 0; i < this.state.tokens.length; i++) {
      const thisToken = this.state.tokens[i]

      // tokens.push(<li key={`token-${i}`}>{thisToken.symbol}</li>)
      tokens.push(<AvaxTokenCard key={`token-${i}`} symbol={thisToken.symbol} name={thisToken.name} qty={thisToken.qty} />)
    }

    return (
      <>
        <Container>
          <Row>
            <Col>
              <h2>AVAX Tokens</h2>
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

export default AvaxTokens
