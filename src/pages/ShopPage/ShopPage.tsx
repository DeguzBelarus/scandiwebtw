import { Component } from 'react'
import { connect } from "react-redux";
import { RootState } from "../../app/store";

import { CurrencyObject, ProductObject } from "../../app/shopSlice";
import ProductCard from "../../components/ProductCard/ProductCard";
import "./ShopPage.scss"

type Props = {
   currentCategory: string,
   products: ProductObject[],
   currentCurrency: CurrencyObject
}

class ShopPage extends Component<Props> {
   render() {
      return (
         <div className="shop-page-wrapper">
            <div className="category-name-container">
               <span>{this.props.currentCategory.charAt(0).toUpperCase()
                  + this.props.currentCategory.slice(1)}</span>
            </div>
            <div className="products-container">
               {this.props.products.map((product: any) => {
                  return <ProductCard
                     productData={product}
                     currentCurrency={this.props.currentCurrency}
                     key={product.id} />
               })}
            </div>
         </div>
      )
   }
}

function mapStateToProps(state: RootState) {
   return {
      currentCategory: state.shop.currentCategory,
      products: state.shop.products,
      currentCurrency: state.shop.currentCurrency,
   }
}

export default connect(mapStateToProps, null)(ShopPage)