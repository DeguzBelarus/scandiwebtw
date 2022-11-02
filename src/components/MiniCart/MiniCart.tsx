import { createRef, RefObject } from "react";
import { Component } from 'react'
import { connect } from "react-redux";
import { RootState } from "../../app/store";
import { Link } from "react-router-dom";

import { CurrencyObject, InCartProductObject, setIsMiniCartShown } from "../../app/shopSlice";
import { InCartProductObjectModified } from "../../pages/CartPage/CartPage";
import CartItem from "../CartItem/CartItem";
import { SelectedPropertyObject } from "../AttributeItem/AttributePropertyItem/AttributePropertyItem";
import { ShopDataInLocalStorage } from "../../components/Header/Header";
import "./MiniCart.scss";

type Props = {
  cart: InCartProductObject[],
  currentCurrency: CurrencyObject,
  setCart: any,
  setIsMiniCartShown: any,
  currentCategory: string
}

type State = {
  cartDataModified: InCartProductObjectModified[],
  cartTotalAmount: number,
}

class MiniCart extends Component<Props, State> {
  private darkArea: RefObject<HTMLDivElement>

  constructor(props: any) {
    super(props)
    this.darkArea = createRef()

    this.state = {
      cartDataModified: [],
      cartTotalAmount: 0,
    }

    this.acceptOrder = this.acceptOrder.bind(this);
    this.miniCartHide = this.miniCartHide.bind(this);
  }

  componentDidMount(): void {
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
          cartTotalAmount: cartTotal
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
          cartTotalAmount: cartTotal
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
          cartTotalAmount: cartTotal
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

  miniCartHide(event: any) {
    if (event.target !== this.darkArea.current) return
    this.props.setIsMiniCartShown(false)

  }

  acceptOrder() {
    console.log(`Your order was confirmed. Thank you! Order details:`,
      this.state.cartDataModified);
    this.props.setCart([])
    this.setState({
      cartTotalAmount: 0
    })
  }
  render() {
    return (
      <div className="mini-cart-grey-area" onClick={this.miniCartHide} ref={this.darkArea}>
        <div className="mini-cart-wrapper">
          <p className="product-count-paragraph">My Bag,<span>{` ${this.props.cart.length} item(s)`}</span>
          </p>
          {!!this.props.cart.length && <div className="mini-cart-data">
            {this.state.cartDataModified.map((inCartProduct: InCartProductObjectModified, index) => {
              return <CartItem
                cartItemData={inCartProduct}
                inMiniCartMode={true}
                index={index}
                key={inCartProduct.id} />
            })}
          </div>}
          <div className="total-block">
            <span>Total</span>
            <span>{`${this.props.currentCurrency.symbol}${this.state.cartTotalAmount.toFixed(2)}`}</span>
          </div>
          <div className="buttons-block">
            <Link to={"/cart"} className="view-bag-button">View bag</Link>
            <button
              type="button"
              className="check-out-button"
              onClick={this.acceptOrder}
              disabled={!(!!this.props.cart.length)}>
              CHECK OUT
            </button>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state: RootState) {
  return {
    cart: state.shop.cart,
    currentCurrency: state.shop.currentCurrency,
    currentCategory: state.shop.currentCategory
  }
}

const mapDispatchToProps = {
  setIsMiniCartShown,
}

export default connect(mapStateToProps, mapDispatchToProps)(MiniCart)