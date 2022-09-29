import { Component } from 'react'
import { connect } from "react-redux";
import { RootState } from "../../app/store";

import { GET_ONE_PRODUCT } from "../../query/shop"
import {
   AttributeObject,
   CurrencyObject,
   getOneProductAsync,
   PriceObject,
   ProductObject,
   setCurrentProduct,
   setCart,
   InCartProductObject
} from "../../app/shopSlice";
import ProductPosterLoader from "../../components/ProductPosterLoader/ProductPosterLoader";
import AttributeItem from "../../components/AttributeItem/AttributeItem";
import { SelectedPropertyObject } from "../../components/AttributeItem/AttributePropertyItem/AttributePropertyItem";
import "./ProductDetailsPage.scss"

type Props = {
   setCurrentProduct: any,
   getOneProductAsync: any,
   currentProduct: ProductObject,
   currentCurrency: CurrencyObject,
   selectedAttributes: SelectedPropertyObject[],
   setCart: any,
   cart: InCartProductObject[]
}

type State = {
   defaultPoster: string,
   posterIsLoaded: boolean,
   inCartId: number
}

class ProductDetailsPage extends Component<Props, State> {
   constructor(props: any) {
      super(props)

      this.state = {
         defaultPoster: "",
         posterIsLoaded: false,
         inCartId: Date.now()
      }

      this.defaultPosterSourceHandler = this.defaultPosterSourceHandler.bind(this);
      this.defaultPosterLoadingStateHandler = this.defaultPosterLoadingStateHandler.bind(this);
      this.addProductIntoCart = this.addProductIntoCart.bind(this);
   }

   UNSAFE_componentWillMount(): void {
      const id = window.location.pathname.split("/")[2]
      this.props.getOneProductAsync({ query: GET_ONE_PRODUCT, variables: { id } })
   }

   componentDidUpdate(prevProps: Readonly<Props>): void {
      if (this.props.currentProduct !== prevProps.currentProduct) {
         this.setState({
            defaultPoster: this.props.currentProduct.gallery[0]
         })
      }

      if (JSON.stringify(this.props.selectedAttributes) !== JSON.stringify(prevProps.selectedAttributes)) {
         this.setState({
            inCartId: Date.now()
         })
      }
   }

   componentWillUnmount(): void {
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

   defaultPosterSourceHandler(source: string) {
      this.setState({
         defaultPoster: source,
         posterIsLoaded: false
      })
   }

   defaultPosterLoadingStateHandler() {
      this.setState({
         posterIsLoaded: true
      })
   }

   addProductIntoCart() {
      if (this.props.currentProduct.attributes.length !== this.props.selectedAttributes.length) return

      const newInCartProduct = {
         id: this.state.inCartId,
         inCartProductData: this.props.currentProduct,
         selectedAttributes: this.props.selectedAttributes
      }

      this.props.setCart([...this.props.cart, newInCartProduct])
   }
   render() {
      return (
         <div className="product-details-page-wrapper">
            <div className="posters-container">
               {this.props.currentProduct.gallery && this.props.currentProduct.gallery.map((poster, index) => {
                  return <div
                     className="poster-item"
                     onClick={() => this.defaultPosterSourceHandler(poster)}
                     key={index}>
                     <img
                        draggable={false}
                        src={poster}
                        alt="product appearance preview" />
                  </div>
               })}
            </div>

            <div className="default-poster-wrapper">
               {(!this.state.defaultPoster && !this.state.posterIsLoaded) &&
                  <ProductPosterLoader />}
               {this.state.defaultPoster &&
                  <img
                     src={this.state.defaultPoster}
                     draggable={false}
                     onLoad={this.defaultPosterLoadingStateHandler}
                     alt="this product large size preview" />}
            </div>

            <div className="side-container">
               <p className="product-brand-paragraph">{this.props.currentProduct.brand}</p>
               <p className="product-name-paragraph">{this.props.currentProduct.name}</p>
               <div className="attributes-container">
                  {(this.props.currentProduct.attributes?.length > 0) &&
                     this.props.currentProduct.attributes.map((attribute: AttributeObject) => {
                        return <AttributeItem
                           attributeData={attribute}
                           inCartProductSelectedAttributes={[]}
                           inCartMode={false}
                           cartItemId={Number(this.props.currentProduct.id)}
                           key={attribute.id} />
                     })}

                  {this.props.currentProduct.prices &&
                     <div className="attribute-block price">
                        <p className="attribute-header">PRICE:</p>
                        <p className="price-paragraph">
                           <span>
                              {`${this.props.currentProduct.prices.find((price: PriceObject) => {
                                 return price.currency.label === this.props.currentCurrency.label
                              })?.currency.symbol}${this.props.currentProduct.prices.find((price: PriceObject) => {
                                 return price.currency.label === this.props.currentCurrency.label
                              })?.amount.toFixed(2)}`}
                           </span>
                        </p>
                     </div>}

                  <button
                     type="button"
                     className="add-to-cart-button"
                     onClick={this.addProductIntoCart}>
                     ADD TO CART
                  </button>

                  {this.props.currentProduct.description &&
                     <div className="description-container"
                        dangerouslySetInnerHTML={{ __html: this.props.currentProduct.description }}>
                     </div>}
               </div>
            </div>
         </div>
      )
   }
}

function mapStateToProps(state: RootState) {
   return {
      currentProduct: state.shop.currentProduct,
      currentCurrency: state.shop.currentCurrency,
      selectedAttributes: state.shop.selectedAttributes,
      cart: state.shop.cart
   }
}

const mapDispatchToProps = {
   setCurrentProduct,
   getOneProductAsync,
   setCart
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetailsPage)