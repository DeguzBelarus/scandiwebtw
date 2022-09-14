import { Component } from 'react'
import { connect } from "react-redux";
import { RootState } from "../../app/store";

import { CurrencyObject, setCurrentCurrency } from "../../app/shopSlice";
import "./CurrenciesContainer.scss"

type Props = {
   currencies: CurrencyObject[],
   setCurrentCurrency: any
}

type State = {
   currencyChangeMode: boolean
}

class CurrenciesContainer extends Component<Props, State> {
   render() {
      return (
         <div className="currencies-container">
            {this.props.currencies.map((currency: CurrencyObject, index) => {
               return <div
                  className="currency-selection-container"
                  key={index}
                  onClick={() => this.props.setCurrentCurrency(currency)}>
                  <span>{`${currency.symbol} ${currency.label}`}</span>
               </div>
            })}
         </div>
      )
   }
}

function mapStateToProps(state: RootState) {
   return {
      currencies: state.shop.currencies
   }
}

const mapDispatchToProps = {
   setCurrentCurrency
}

export default connect(mapStateToProps, mapDispatchToProps)(CurrenciesContainer)