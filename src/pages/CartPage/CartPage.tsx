import { Component } from 'react'
import { connect } from "react-redux";
import { RootState } from "../../app/store";

import { CurrencyObject, InCartProductObject, ProductObject } from "../../app/shopSlice";
import { SelectedPropertyObject } from "../../components/AttributeItem/AttributePropertyItem/AttributePropertyItem";
import CartItem from "../../components/CartItem/CartItem";
import OrderButton from "../../components/OrderButton/OrderButton";
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
               cartTotalAmount: cartTotal,
               cartTaxAmount: cartTotal * 0.21
            })
         }

         const modifiedCart = this.props.cart
            .map((product: InCartProductObject, index, array) => {
               const productId: number = product.id

               return {
                  id: product.id,
                  inCartProductData: product.inCartProductData,
                  selectedAttributes: product.selectedAttributes,
                  quantity: array.filter((product: InCartProductObject) => product.id === productId).length
               }
            })
            .sort(sortCartProductsMethod)
            .reduce((unique: any[], cartItemModified: any) => {
               return unique.find((uniqueElement: any) => uniqueElement.id === cartItemModified.id) ? unique : [...unique, cartItemModified]
            }, [])

         this.setState({
            cartDataModified: modifiedCart
         })
      }
   }

   componentDidUpdate(prevProps: Readonly<Props>): void {
      if (prevProps.cart.length !== this.props.cart.length) {
         window.localStorage.setItem("cart-data", JSON.stringify([...this.props.cart]))

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
                  const productId: number = product.id

                  return {
                     id: product.id,
                     inCartProductData: product.inCartProductData,
                     selectedAttributes: product.selectedAttributes,
                     quantity: array.filter((product: InCartProductObject) => product.id === productId).length
                  }
               })
               .sort(sortCartProductsMethod)
               .reduce((unique: any[], cartItemModified: any) => {
                  return unique.find((uniqueElement: any) => uniqueElement.id === cartItemModified.id) ? unique : [...unique, cartItemModified]
               }, [])

            this.setState({
               cartDataModified: modifiedCart
            })
         }
      }
   }
   render() {
      return (
         <div className="cart-page-wrapper">
            <div className="category-name-container">
               <span>CART</span>
            </div>
            <div className="cart-data">
               {this.props.cart.length
                  ? this.state.cartDataModified.map((inCartProduct: InCartProductObjectModified, index) => {
                     return <CartItem cartItemData={inCartProduct} index={index} key={inCartProduct.id} />
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
      currentCurrency: state.shop.currentCurrency
   }
}

export default connect(mapStateToProps, null)(CartPage)
