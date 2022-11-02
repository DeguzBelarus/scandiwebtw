import { Component } from 'react'
import { connect } from "react-redux";
import { RootState } from "../../app/store";

import { AttributeObject, CurrencyObject, InCartProductObject, setCart } from "../../app/shopSlice";
import { InCartProductObjectModified } from "../../pages/CartPage/CartPage";
import AttributeItem from "../AttributeItem/AttributeItem";
import plusSquareLogo from "../../assets/plus-square.svg"
import minusSquareLogo from "../../assets/minus-square.svg"
import plusSquareLogoMiniCart from "../../assets/plus-square-minicart.svg"
import minusSquareLogoMiniCart from "../../assets/minus-square-minicart.svg"
import previousPosterButtonLogo from "../../assets/previous-poster-icon.svg"
import nextPosterButtonLogo from "../../assets/next-poster-icon.svg"
import "./CartItem.scss"

type Props = {
  cartItemData: InCartProductObjectModified,
  index: number,
  currentCurrency: CurrencyObject,
  setCart: any,
  cart: InCartProductObject[],
  inMiniCartMode: boolean
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
      <div className={this.props.index === 0
        ? this.props.inMiniCartMode
          ? "cart-item-wrapper first mini-cart"
          : "cart-item-wrapper first"
        : this.props.inMiniCartMode
          ? "cart-item-wrapper mini-cart"
          : "cart-item-wrapper"}>
        <div className={!this.props.inMiniCartMode
          ? "cart-item-data-containers"
          : "cart-item-data-containers mini-cart"}>
          <div className="cart-item-information-container">
            <p className={!this.props.inMiniCartMode
              ? "brand-paragraph"
              : "brand-paragraph mini-cart"}>
              {this.props.cartItemData.inCartProductData.brand}
            </p>
            <p className={!this.props.inMiniCartMode
              ? "name-paragraph"
              : "name-paragraph mini-cart"}>
              {this.props.cartItemData.inCartProductData.name}
            </p>
            <p className={!this.props.inMiniCartMode
              ? "price-paragraph"
              : "price-paragraph mini-cart"}>
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

            <div className={!this.props.inMiniCartMode
              ? "attributes-container"
              : "attributes-container mini-cart"}>
              {(this.props.cartItemData.inCartProductData.attributes?.length > 0) &&
                this.props.cartItemData.inCartProductData.attributes.map((attribute: AttributeObject) => {
                  return <AttributeItem
                    productName={this.props.cartItemData.inCartProductData.name}
                    attributeData={attribute}
                    inCartProductSelectedAttributes={this.props.cartItemData.selectedAttributes}
                    cartItemId={this.props.cartItemData.id}
                    inCartMode={true}
                    inMiniCartMode={this.props.inMiniCartMode}
                    key={attribute.id} />
                })}
            </div>
          </div>

          <div className={!this.props.inMiniCartMode
            ? "cart-item-quantity-and-poster-container"
            : "cart-item-quantity-and-poster-container mini-cart"}>
            <div className={!this.props.inMiniCartMode
              ? "product-count-block"
              : "product-count-block mini-cart"}>
              <div className={!this.props.inMiniCartMode
                ? "increment-decrement-button"
                : "increment-decrement-button mini-cart"}
                onClick={this.addTheSameProductIntoCart}>
                <img src={!this.props.inMiniCartMode
                  ? plusSquareLogo
                  : plusSquareLogoMiniCart}
                  alt="increment product in cart button in form of square with plus" />
              </div>
              <p className={!this.props.inMiniCartMode
                ? "quantity-paragraph"
                : "quantity-paragraph mini-cart"}>
                {this.props.cartItemData.quantity}
              </p>
              <div className={!this.props.inMiniCartMode
                ? "increment-decrement-button"
                : "increment-decrement-button mini-cart"}
                onClick={this.removeOneProductFromCart}>
                <img src={!this.props.inMiniCartMode
                  ? minusSquareLogo
                  : minusSquareLogoMiniCart}
                  alt="decrement product in cart button in form of square with minus" />
              </div>
            </div>

            <div className={!this.props.inMiniCartMode
              ? "product-posters-container"
              : "product-posters-container mini-cart"}>
              <img
                src={this.props.cartItemData.inCartProductData.gallery[this.state.posterPosition]}
                alt="product appearance preview" />
              {this.props.cartItemData.inCartProductData.gallery.length > 1 &&
                <div className={!this.props.inMiniCartMode
                  ? "poster-slider-container"
                  : "poster-slider-container mini-cart"}>
                  <div className={!this.props.inMiniCartMode
                    ? "next-previous-button"
                    : "next-previous-button mini-cart"}
                    onClick={this.previousPosterApply}>
                    <img className={!this.props.inMiniCartMode
                      ? "arrow-image"
                      : "arrow-image mini-cart"}
                      src={previousPosterButtonLogo}
                      alt="left arrow" />
                  </div>
                  <div className={!this.props.inMiniCartMode
                    ? "next-previous-button"
                    : "next-previous-button mini-cart"}
                    onClick={this.nextPosterApply}>
                    <img className={!this.props.inMiniCartMode
                      ? "arrow-image"
                      : "arrow-image mini-cart"}
                      src={nextPosterButtonLogo}
                      alt="right arrow" />
                  </div>
                </div>}
            </div>
          </div>
        </div>
      </div >
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