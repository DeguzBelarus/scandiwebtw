import { Component } from 'react'
import { connect } from "react-redux";
import { RootState } from "../../app/store";

import {
  CurrencyObject,
  InCartProductObject,
  ProductObject,
  setIsCartPageShown,
  setIsCurrenciesShown
} from "../../app/shopSlice";
import { SelectedPropertyObject } from "../../components/AttributeItem/AttributePropertyItem/AttributePropertyItem";
import CartItem from "../../components/CartItem/CartItem";
import OrderButton from "../../components/OrderButton/OrderButton";
import { ShopDataInLocalStorage } from "../../components/Header/Header";
import "./CartPage.scss"

export interface InCartProductObjectModified {
  id: number,
  inCartProductData: ProductObject,
  selectedAttributes: SelectedPropertyObject[],
  quantity: number,
}

type Props = {
  cart: InCartProductObject[],
  currentCurrency: CurrencyObject,
  setIsCartPageShown: any,
  setIsCurrenciesShown: any,
  isCurrenciesShown: boolean,
  currentCategory: string
}

type State = {
  cartDataModified: InCartProductObjectModified[],
  cartTotalAmount: number,
  cartTaxAmount: number
}

class CartPage extends Component<Props, State> {
  constructor(props: any) {
    super(props)

    this.state = {
      cartDataModified: [],
      cartTotalAmount: 0,
      cartTaxAmount: 0
    }

    this.currenciesHide = this.currenciesHide.bind(this);
  }

  componentDidMount(): void {
    this.props.setIsCartPageShown(true)
    const sortCartProductsMethod = (previous: any, next: any) => {
      switch (true) {
        case previous.id > next.id:
          return 1
        case previous.id < next.id:
          return -1
        default:
          return 0
      }
    }

    if (this.props.cart.length) {
      const cartTotal = this.props.cart.reduce((sum, product: InCartProductObject) => {
        const productPrice = product.inCartProductData.prices.find((price: any) => {
          return price.currency.label === this.props.currentCurrency.label
        })
        return Number(((sum += productPrice?.amount || 0)))
      }, 0)

      if (cartTotal) {
        this.setState({
          cartTotalAmount: cartTotal,
          cartTaxAmount: cartTotal * 0.21
        })
      }

      const modifiedCart = this.props.cart
        .map((product: InCartProductObject, index, array) => {
          const productName: string = product.inCartProductData.name
          const selectedAttributes: SelectedPropertyObject[] = product.selectedAttributes

          return {
            id: product.id,
            inCartProductData: product.inCartProductData,
            selectedAttributes: product.selectedAttributes,
            quantity: array.filter((product: InCartProductObject) => {
              if (product.inCartProductData.name === productName
                && JSON.stringify(product.selectedAttributes)
                === JSON.stringify(selectedAttributes)) {
                return product
              }
            }).length
          }
        })
        .sort(sortCartProductsMethod)
        .reduce((unique: InCartProductObjectModified[], cartItemModified: InCartProductObjectModified) => {
          return unique.find((uniqueElement: InCartProductObjectModified) =>
            uniqueElement.inCartProductData.name
            === cartItemModified.inCartProductData.name
            && JSON.stringify(uniqueElement.selectedAttributes)
            === JSON.stringify(cartItemModified.selectedAttributes))
            ? unique
            : [...unique, cartItemModified]
        }, [])

      this.setState({
        cartDataModified: modifiedCart
      })
    }
  }

  componentDidUpdate(prevProps: Readonly<Props>): void {
    if (prevProps.currentCurrency.symbol !== this.props.currentCurrency.symbol) {
      const cartTotal = this.props.cart.reduce((sum, product: InCartProductObject) => {
        const productPrice = product.inCartProductData.prices.find((price: any) => {
          return price.currency.label === this.props.currentCurrency.label
        })
        return Number(((sum += productPrice?.amount || 0)))
      }, 0)

      if (cartTotal) {
        this.setState({
          cartTotalAmount: cartTotal,
          cartTaxAmount: cartTotal * 0.21
        })
      }
    }

    if (JSON.stringify(prevProps.cart) !== JSON.stringify(this.props.cart)) {
      const cartTotal = this.props.cart.reduce((sum, product: InCartProductObject) => {
        const productPrice = product.inCartProductData.prices.find((price: any) => {
          return price.currency.label === this.props.currentCurrency.label
        })
        return Number(((sum += productPrice?.amount || 0)))
      }, 0)

      if (cartTotal) {
        this.setState({
          cartTotalAmount: cartTotal,
          cartTaxAmount: cartTotal * 0.21
        })
      }

      const sortCartProductsMethod = (previous: any, next: any) => {
        switch (true) {
          case previous.id > next.id:
            return 1
          case previous.id < next.id:
            return -1
          default:
            return 0
        }
      }

      if (this.props.cart.length) {
        const modifiedCart = this.props.cart
          .map((product: InCartProductObject, index, array) => {
            const productName: string = product.inCartProductData.name
            const selectedAttributes: SelectedPropertyObject[] = product.selectedAttributes

            return {
              id: product.id,
              inCartProductData: product.inCartProductData,
              selectedAttributes: product.selectedAttributes,
              quantity: array.filter((product: InCartProductObject) => {
                if (product.inCartProductData.name === productName
                  && JSON.stringify(product.selectedAttributes)
                  === JSON.stringify(selectedAttributes)) {
                  return product
                }
              }).length
            }
          })
          .sort(sortCartProductsMethod)
          .reduce((unique: InCartProductObjectModified[], cartItemModified: InCartProductObjectModified) => {
            return unique.find((uniqueElement: InCartProductObjectModified) =>
              uniqueElement.inCartProductData.name
              === cartItemModified.inCartProductData.name
              && JSON.stringify(uniqueElement.selectedAttributes)
              === JSON.stringify(cartItemModified.selectedAttributes))
              ? unique
              : [...unique, cartItemModified]
          }, [])

        this.setState({
          cartDataModified: modifiedCart
        })

        const shopData: ShopDataInLocalStorage = {
          cart: [...this.props.cart],
          currentCategory: this.props.currentCategory,
          currentCurrency:
            { label: this.props.currentCurrency.label, symbol: this.props.currentCurrency.symbol }
        }
        window.localStorage.setItem("shop-data", JSON.stringify(shopData))
      }
    }
  }

  componentWillUnmount(): void {
    this.props.setIsCartPageShown(false)
  }

  currenciesHide() {
    if (!this.props.isCurrenciesShown) return
    this.props.setIsCurrenciesShown(false)
  }
  render() {
    return (
      <div className="cart-page-wrapper" onClick={this.currenciesHide}>
        <div className="category-name-container">
          <span>CART</span>
        </div>
        <div className="cart-data">
          {this.props.cart.length
            ? this.state.cartDataModified.map((inCartProduct: InCartProductObjectModified, index) => {
              return <CartItem
                cartItemData={inCartProduct}
                inMiniCartMode={false}
                index={index}
                key={inCartProduct.id} />
            })
            : <p>Your cart is empty ;(</p>}
        </div>

        {this.props.cart.length > 0 &&
          <>
            <div className="total-information-container">
              <span>Tax 21%:</span>
              <strong>
                {`${this.props.currentCurrency.symbol}${this.state.cartTaxAmount.toFixed(2)}`}
              </strong>
            </div>
            <div className="total-information-container">
              <span>Quantity:</span>
              <strong>
                {`${this.props.cart.length}`}
              </strong>
            </div>
            <div className="total-information-container total">
              <span>Total:</span>
              <strong>
                {`${this.props.currentCurrency.symbol}${this.state.cartTotalAmount.toFixed(2)}`}
              </strong>
            </div>

            <OrderButton cartDataModified={this.state.cartDataModified} />
          </>}
      </div>
    )
  }
}

function mapStateToProps(state: RootState) {
  return {
    cart: state.shop.cart,
    currentCurrency: state.shop.currentCurrency,
    isCurrenciesShown: state.shop.isCurrenciesShown,
    currentCategory: state.shop.currentCategory
  }
}

const mapDispatchToProps = {
  setIsCartPageShown,
  setIsCurrenciesShown
}

export default connect(mapStateToProps, mapDispatchToProps)(CartPage)
