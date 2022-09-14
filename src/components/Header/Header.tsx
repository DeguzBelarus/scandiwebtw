import { Component } from 'react'
import { connect } from "react-redux";
import { RootState } from "../../app/store";
import { Link } from "react-router-dom"

import { CurrencyObject, setCurrentCurrency, setCart, InCartProductObject } from "../../app/shopSlice";
import CategoriesContainer from "../CategoriesContainer/CategoriesContainer"
import CurrenciesContainer from "../CurrenciesContainer/CurrenciesContainer";
import logo from "../../assets/logo.svg"
import currencySwitcherIcon from "../../assets/currency-switcher-icon.svg"
import cartLogo from "../../assets/cart-logo.svg"
import "./Header.scss"

type Props = {
   currentCurrency: CurrencyObject,
   cart: InCartProductObject[],
   setCart: any
}

type State = {
   currencyChangeMode: boolean
}

class Header extends Component<Props, State> {
   constructor(props: any) {
      super(props)

      this.state = {
         currencyChangeMode: false
      }

      this.currencyChangeModeHandler = this.currencyChangeModeHandler.bind(this);
   }

   componentDidMount(): void {
      if (window.localStorage.getItem("cart-data")) {
         this.props.setCart(JSON.parse(window.localStorage.getItem("cart-data") || ""))
      }
   }

   componentDidUpdate(prevProps: Readonly<Props>): void {
      if (prevProps.cart.length !== this.props.cart.length) {
         window.localStorage.setItem("cart-data", JSON.stringify([...this.props.cart]))
      }
   }

   currencyChangeModeHandler() {
      if (this.state.currencyChangeMode) {
         this.setState({
            currencyChangeMode: false
         })
      } else {
         this.setState({
            currencyChangeMode: true
         })
      }
   }
   render() {
      return (
         <header>
            <CategoriesContainer />
            <Link to={"/"} draggable="false">
               <img src={logo} draggable="false" alt="a logo in the form of a basket" />
            </Link>
            <div className="cart-currency-container">
               <div className="currency-switch-container" onClick={this.currencyChangeModeHandler}>
                  <span className="currency-type-indicator">
                     {this.props.currentCurrency.symbol}
                  </span>
                  <img
                     className={this.state.currencyChangeMode
                        ? "currency-switcher active"
                        : "currency-switcher"}
                     src={currencySwitcherIcon}
                     alt="currency switcher in the form of an arrow" />
               </div>
               {this.state.currencyChangeMode && <CurrenciesContainer />}
               <div className="cart-icon-wrapper">
                  <Link to={"/cart"}>
                     <img src={cartLogo} alt="a shopping cart icon" />
                     {this.props.cart.length > 0 &&
                        <div className="products-count-indicator">
                           <span>{this.props.cart.length}</span>
                        </div>}
                  </Link>
               </div>
            </div>
         </header>
      )
   }
}

function mapStateToProps(state: RootState) {
   return {
      currentCurrency: state.shop.currentCurrency,
      cart: state.shop.cart
   }
}

const mapDispatchToProps = {
   setCurrentCurrency,
   setCart
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)