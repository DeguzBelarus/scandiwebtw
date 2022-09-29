import { Component } from 'react'
import { connect } from "react-redux";
import { RootState } from "../../app/store";

import { AttributeObject, CurrencyObject, InCartProductObject, setCart } from "../../app/shopSlice";
import { InCartProductObjectModified } from "../../pages/CartPage/CartPage";
import AttributeItem from "../AttributeItem/AttributeItem";
import plusSquareLogo from "../../assets/plus-square.svg"
import minusSquareLogo from "../../assets/minus-square.svg"
import previousPosterButtonLogo from "../../assets/previous-poster-icon.svg"
import nextPosterButtonLogo from "../../assets/next-poster-icon.svg"
import "./CartItem.scss"

type Props = {
   cartItemData: InCartProductObjectModified,
   index: number,
   currentCurrency: CurrencyObject,
   setCart: any,
   cart: InCartProductObject[],
}

type State = {
   posterPosition: number
}

class CartItem extends Component<Props, State> {
   constructor(props: any) {
      super(props)

      this.state = {
         posterPosition: 0
      }

      this.nextPosterApply = this.nextPosterApply.bind(this);
      this.previousPosterApply = this.previousPosterApply.bind(this);
      this.removeOneProductFromCart = this.removeOneProductFromCart.bind(this);
      this.addTheSameProductIntoCart = this.addTheSameProductIntoCart.bind(this);
   }

   nextPosterApply() {
      if (this.state.posterPosition === this.props.cartItemData.inCartProductData.gallery.length - 1) {
         this.setState({
            posterPosition: 0
         })
      } else {
         this.setState({
            posterPosition: this.state.posterPosition + 1
         })
      }
   }

   previousPosterApply() {
      if (this.state.posterPosition === 0) {
         this.setState({
            posterPosition: this.props.cartItemData.inCartProductData.gallery.length - 1
         })
      } else {
         this.setState({
            posterPosition: this.state.posterPosition - 1
         })
      }
   }

   removeOneProductFromCart() {
      const beingDeletedProductIndex = this.props.cart.findIndex((productInCart: InCartProductObject) => productInCart.id === this.props.cartItemData.id);
      const updatedCart = this.props.cart.filter((product: InCartProductObject, index) => index !== beingDeletedProductIndex)
      this.props.setCart([...updatedCart])
   }

   addTheSameProductIntoCart() {
      const theSameProductInCart = this.props.cart.find((product: InCartProductObject) => product.id === this.props.cartItemData.id)
      this.props.setCart([...this.props.cart, theSameProductInCart])
   }
   render() {
      return (
         <div className={this.props.index === 0 ? "cart-item-wrapper first" : "cart-item-wrapper"}>
            <div className="cart-item-data-containers">
               <div className="cart-item-information-container">
                  <p className="brand-paragraph">{this.props.cartItemData.inCartProductData.brand}</p>
                  <p className="name-paragraph">{this.props.cartItemData.inCartProductData.name}</p>
                  <p className="price-paragraph">
                     <span>
                        {this.props.cartItemData.inCartProductData.prices.find((price: any) => {
                           return price.currency.label === this.props.currentCurrency.label
                        })?.currency.symbol}
                     </span>
                     <span>
                        {this.props.cartItemData.inCartProductData.prices.find((price: any) => {
                           return price.currency.label === this.props.currentCurrency.label
                        })?.amount.toFixed(2)}
                     </span>
                  </p>

                  <div className="attributes-container">
                     {(this.props.cartItemData.inCartProductData.attributes?.length > 0) &&
                        this.props.cartItemData.inCartProductData.attributes.map((attribute: AttributeObject) => {
                           return <AttributeItem
                              attributeData={attribute}
                              inCartProductSelectedAttributes={this.props.cartItemData.selectedAttributes}
                              cartItemId={this.props.cartItemData.id}
                              inCartMode={true}
                              key={attribute.id} />
                        })}
                  </div>
               </div>

               <div className="cart-item-quantity-and-poster-container">
                  <div className="product-count-block">
                     <div className="increment-decrement-button" onClick={this.addTheSameProductIntoCart}>
                        <img src={plusSquareLogo} alt="increment product in cart button in form of square with plus" />
                     </div>
                     <p className="quantity-paragraph">{this.props.cartItemData.quantity}</p>
                     <div className="increment-decrement-button" onClick={this.removeOneProductFromCart}>
                        <img src={minusSquareLogo} alt="decrement product in cart button in form of square with minus" />
                     </div>
                  </div>

                  <div className="product-posters-container">
                     <img
                        src={this.props.cartItemData.inCartProductData.gallery[this.state.posterPosition]}
                        alt="product appearance preview" />
                     {this.props.cartItemData.inCartProductData.gallery.length > 1 &&
                        <div className="poster-slider-container">
                           <div className="next-previous-button" onClick={this.previousPosterApply}>
                              <img src={previousPosterButtonLogo} alt="left arrow" />
                           </div>
                           <div className="next-previous-button" onClick={this.nextPosterApply}>
                              <img src={nextPosterButtonLogo} alt="right arrow" />
                           </div>
                        </div>}
                  </div>
               </div>
            </div>
         </div>
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
   setCart
}

export default connect(mapStateToProps, mapDispatchToProps)(CartItem)