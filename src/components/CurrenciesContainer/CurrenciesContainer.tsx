import { Component } from 'react'
import { connect } from "react-redux";
import { RootState } from "../../app/store";

import { CurrencyObject, setCurrentCurrency, setIsCurrenciesShown } from "../../app/shopSlice";
import "./CurrenciesContainer.scss"

type Props = {
  currencies: CurrencyObject[],
  setCurrentCurrency: any,
  setIsCurrenciesShown: any
}

type State = {
  currencyChangeMode: boolean
}

class CurrenciesContainer extends Component<Props, State> {
  constructor(props: any) {
    super(props)

    this.selectCurrentCurrency = this.selectCurrentCurrency.bind(this);
  }

  selectCurrentCurrency(currency: CurrencyObject) {
    this.props.setCurrentCurrency(currency)
    this.props.setIsCurrenciesShown(false)
  }
  render() {
    return (
      <div className="currencies-container">
        {this.props.currencies.map((currency: CurrencyObject, index) => {
          return <div
            className="currency-selection-container"
            key={index}
            onClick={() => this.selectCurrentCurrency(currency)}>
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
  setCurrentCurrency,
  setIsCurrenciesShown
}

export default connect(mapStateToProps, mapDispatchToProps)(CurrenciesContainer)