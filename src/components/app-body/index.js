/*
  This Body component is a container for all the different Views of the app.
  Views are equivalent to 'pages' in a multi-page app. Views are hidden or
  displayed to simulate the use of pages in an SPA.
  The Body app contains all the Views and chooses which to show, based on
  the state of the Menu component.
*/

// Global npm libraries
import React from 'react'

// Local libraries
import GetBalance from '../balance'
import Placeholder2 from '../placeholder2'
import Wallets from '../wallets'

let _this

class AppBody extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      activeView: 0,
      menuState: props.menuState,
      bchWallet: props.bchWallet,
      avaxWallet: props.avaxWallet
    }

    _this = this
  }

  render () {
    // console.log(`AppBody menu state: ${this.props.menuState}`)

    return (
      <>
        {this.chooseView(this.props.menuState)}
      </>
    )
  }

  chooseView (menuState) {
    // console.log(`chooseView() menuState: ${menuState}`)

    switch (menuState) {
      case 0:
        return (<GetBalance wallet={_this.state.bchWallet} />)
      case 1:
        return (<Placeholder2 />)
      case 2:
        return (<Wallets bchWallet={_this.state.bchWallet} avaxWallet={_this.state.avaxWallet} />)
      default:
        return (<GetBalance wallet={_this.state.wallet} />)
    }
  }
}

export default AppBody
