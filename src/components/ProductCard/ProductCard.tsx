import { Component } from 'react'
import { Link } from "react-router-dom"

import ProductPosterLoader from "../ProductPosterLoader/ProductPosterLoader"
import productDetailsLogo from "../../assets/add-to-cart-icon.svg"
import { CurrencyObject } from "../../app/shopSlice"
import "./ProductCard.scss"

type Props = {
   productData: any,
   currentCurrency: CurrencyObject
}

type State = {
   posterIsLoaded: boolean,
   cardIsHovered: boolean
}

class ProductCard extends Component<Props, State> {
   constructor(props: any) {
      super(props)

      this.state = {
         posterIsLoaded: false,
         cardIsHovered: false
      }

      this.posterLoadingStateHandler = this.posterLoadingStateHandler.bind(this);
      this.cardIsHovered = this.cardIsHovered.bind(this);
      this.cardIsNotHovered = this.cardIsNotHovered.bind(this);
   }

   posterLoadingStateHandler(event: any) {
      event.target.style.display = "inline"

      this.setState({
         posterIsLoaded: true
      })
   }

   cardIsHovered() {
      this.setState({
         cardIsHovered: true
      })
   }

   cardIsNotHovered() {
      this.setState({
         cardIsHovered: false
      })
   }
   render() {
      return (
         <div
            className={this.props.productData.inStock
               ? "product-card-wrapper"
               : "product-card-wrapper out-of-stock"}
            onMouseOver={this.cardIsHovered}
            onMouseLeave={this.cardIsNotHovered}>
            <div className="poster-wrapper">
               <img
                  className="product-poster"
                  src={this.props.productData.gallery[0]}
                  draggable={false}
                  alt="product preview"
                  onLoad={this.posterLoadingStateHandler} />
               {!this.state.posterIsLoaded && <ProductPosterLoader />}
               {!this.props.productData.inStock &&
                  <span className="out-of-stock-title">
                     OUT OF STOCK
                  </span>}
            </div>
            <div className="product-title-wrapper">
               <p className="product-title">
                  {`${this.props.productData.brand} ${this.props.productData.name}`}
               </p>
               {(this.state.cardIsHovered && this.props.productData.inStock) && <Link
                  to={`/product/${this.props.productData.id}`}
                  draggable={false}
                  className="product-details-button">
                  <img draggable={false} src={productDetailsLogo} alt="a cart logo" />
               </Link>}
            </div>
            <p className="product-price">
               <span>
                  {this.props.currentCurrency.symbol}
               </span>
               <span>
                  {this.props.productData.prices.find((price: any) => {
                     return price.currency.label === this.props.currentCurrency.label
                  }).amount}
               </span>
            </p>
         </div>
      )
   }
}

export default ProductCard