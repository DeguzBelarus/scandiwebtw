import { Component } from 'react'
import { connect } from "react-redux";
import { RootState } from "../../app/store";

import {
  CurrencyObject,
  setCurrentCurrency,
  setCart,
  InCartProductObject,
  setCurrentCategory,
  setIsMiniCartShown,
  setIsCurrenciesShown
} from "../../app/shopSlice";
import CategoriesContainer from "../CategoriesContainer/CategoriesContainer"
import CurrenciesContainer from "../CurrenciesContainer/CurrenciesContainer";
import logo from "../../assets/logo.svg"
import currencySwitcherIcon from "../../assets/currency-switcher-icon.svg"
import cartLogo from "../../assets/cart-logo.svg"
import "./Header.scss"
import MiniCart from "../MiniCart/MiniCart";

type Props = {
  currentCurrency: CurrencyObject,
  cart: InCartProductObject[],
  setCart: any,
  currentCategory: string,
  setCurrentCategory: any,
  setCurrentCurrency: any,
  isCartPageShown: boolean,
  setIsMiniCartShown: any,
  isMiniCartShown: boolean,
  setIsCurrenciesShown: any,
  isCurrenciesShown: boolean
}

type State = {
  currencyChangeMode: boolean,
}

export interface ShopDataInLocalStorage {
  cart: InCartProductObject[],
  currentCurrency: CurrencyObject,
  currentCategory: string
}

class Header extends Component<Props, State> {
  constructor(props: any) {
    super(props)

    this.currencyChangeModeHandler = this.currencyChangeModeHandler.bind(this);
    this.isMiniCartShownHandler = this.isMiniCartShownHandler.bind(this);
  }

  componentDidMount(): void {
    if (window.localStorage.getItem("shop-data")) {
      const shopData: ShopDataInLocalStorage = JSON.parse(window.localStorage.getItem("shop-data") || "")
      if (shopData?.currentCategory) {
        this.props.setCurrentCategory(shopData.currentCategory)
      }
      if (shopData?.currentCurrency) {
        this.props.setCurrentCurrency(shopData.currentCurrency)
      }
      if (shopData?.cart?.length) {
        this.props.setCart(shopData.cart)
      }
    } else {
      const shopData: ShopDataInLocalStorage = {
        cart: [...this.props.cart],
        currentCategory: this.props.currentCategory,
        currentCurrency:
          { label: this.props.currentCurrency.label, symbol: this.props.currentCurrency.symbol }
      }
      window.localStorage.setItem("shop-data", JSON.stringify(shopData))
    }
  }

  componentDidUpdate(prevProps: Readonly<Props>): void {
    if (prevProps.cart.length !== this.props.cart.length ||
      prevProps.currentCategory !== this.props.currentCategory ||
      prevProps.currentCurrency !== this.props.currentCurrency) {
      const shopData: ShopDataInLocalStorage = {
        cart: [...this.props.cart],
        currentCategory: this.props.currentCategory,
        currentCurrency:
          { label: this.props.currentCurrency.label, symbol: this.props.currentCurrency.symbol }
      }
      window.localStorage.setItem("shop-data", JSON.stringify(shopData))
    }

    if (prevProps.isCartPageShown !== this.props.isCartPageShown) {
      if (this.props.isCartPageShown === false) {
        this.props.setIsMiniCartShown(false)
      }
    }
  }

  currencyChangeModeHandler() {
    if (this.props.isCurrenciesShown) {
      this.props.setIsCurrenciesShown(false)
    } else {
      this.props.setIsCurrenciesShown(true)
    }
  }

  isMiniCartShownHandler() {
    if (this.props.isMiniCartShown) {
      this.props.setIsMiniCartShown(false)
    } else {
      this.props.setIsMiniCartShown(true)
    }
  }
  render() {
    return (
      <header>
        {this.props.isMiniCartShown && !this.props.isCartPageShown &&
          <MiniCart setCart={this.props.setCart} />}
        <CategoriesContainer />
        <img src={logo} draggable="false" alt="a logo in the form of a basket" />
        <div className="cart-currency-container">
          <div className="currency-switch-container" onClick={this.currencyChangeModeHandler}>
            <span className="currency-type-indicator">
              {this.props.currentCurrency.symbol}
            </span>
            <img
              className={this.props.isCurrenciesShown
                ? "currency-switcher active"
                : "currency-switcher"}
              src={currencySwitcherIcon}
              alt="currency switcher in the form of an arrow" />
          </div>
          {this.props.isCurrenciesShown && <CurrenciesContainer />}
          <div className={this.props.isCartPageShown
            ? "cart-icon-wrapper active"
            : "cart-icon-wrapper"}>
            <div onClick={this.isMiniCartShownHandler}>
              <img src={cartLogo} alt="a shopping cart icon" />
              {this.props.cart.length > 0 &&
                <div className="products-count-indicator">
                  <span>{this.props.cart.length}</span>
                </div>}
            </div>
          </div>
        </div>
      </header>
    )
  }
}

function mapStateToProps(state: RootState) {
  return {
    currentCurrency: state.shop.currentCurrency,
    cart: state.shop.cart,
    currentCategory: state.shop.currentCategory,
    isCartPageShown: state.shop.isCartPageShown,
    isMiniCartShown: state.shop.isMiniCartShown,
    isCurrenciesShown: state.shop.isCurrenciesShown
  }
}

const mapDispatchToProps = {
  setCurrentCurrency,
  setCart,
  setCurrentCategory,
  setIsMiniCartShown,
  setIsCurrenciesShown
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)