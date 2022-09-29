import { Component } from 'react'
import { connect } from "react-redux";
import { RootState } from "../../app/store";
import { Link } from "react-router-dom"

import { GET_ONE_PRODUCT } from "../../query/shop";
import { setCart, InCartProductObject, getOneProductAsync, setCurrentProduct } from "../../app/shopSlice";
import ProductPosterLoader from "../ProductPosterLoader/ProductPosterLoader"
import productDetailsLogo from "../../assets/add-to-cart-icon.svg"
import { CurrencyObject, ProductObject } from "../../app/shopSlice"
import "./ProductCard.scss"

type Props = {
   productData: ProductObject,
   currentCurrency: CurrencyObject,
   setCart: any,
   cart: InCartProductObject[],
   getOneProductAsync: any,
   currentProduct: ProductObject,
   setCurrentProduct: any
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
      this.addDefaultProductToCart = this.addDefaultProductToCart.bind(this);
   }

   componentWillUnmount(): void {
      if (this.props.currentProduct.id) {
         this.props.setCurrentProduct({
            id: "",
            name: "",
            inStock: false,
            gallery: [],
            description: "",
            attributes: [],
            prices: [],
            brand: ""
         })
      }
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

   async addDefaultProductToCart() {
      if (this.props.currentProduct.id !== this.props.productData.id) {
         await this.props.getOneProductAsync({ query: GET_ONE_PRODUCT, variables: { id: this.props.productData.id } })
      }

      const defaultProduct: any = {
         id: Date.now(),
         inCartProductData: this.props.currentProduct,
         selectedAttributes: this.props.currentProduct.attributes.map((attribute: any) => {
            return { name: attribute.name, value: attribute.items[0].value }
         })
      }

      this.props.setCart([...this.props.cart, defaultProduct])
   }
   render() {
      return (
         <div className="product-wrapper" onMouseOver={this.cardIsHovered}
            onMouseLeave={this.cardIsNotHovered}>
            <Link to={`/product/${this.props.productData.id}`}
               draggable={false}
               className={this.props.productData.inStock
                  ? "product-card-wrapper"
                  : "product-card-wrapper out-of-stock"}>
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
               </div>
               <p className="product-price">
                  <span>
                     {this.props.currentCurrency.symbol}
                  </span>
                  <span>
                     {this.props.productData.prices.find((price: any) => {
                        return price.currency.label === this.props.currentCurrency.label
                     })?.amount.toFixed(2)}
                  </span>
               </p>
            </Link>
            {this.state.cardIsHovered &&
               <div
                  draggable={false}
                  className="product-details-button"
                  onClick={this.addDefaultProductToCart}>
                  <img draggable={false} src={productDetailsLogo} alt="a cart logo" />
               </div>}
         </div>
      )
   }
}

function mapStateToProps(state: RootState) {
   return {
      cart: state.shop.cart,
      currentProduct: state.shop.currentProduct
   }
}

const mapDispatchToProps = {
   setCart,
   getOneProductAsync,
   setCurrentProduct
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductCard)
