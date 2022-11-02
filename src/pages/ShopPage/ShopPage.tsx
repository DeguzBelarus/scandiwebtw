import { Component } from 'react'
import { connect } from "react-redux";
import { RootState } from "../../app/store";

import {
  CurrencyObject,
  ProductObject,
  setIsCurrenciesShown,
  setCurrentCategory,
  setProducts
} from "../../app/shopSlice";
import ProductCard from "../../components/ProductCard/ProductCard";
import "./ShopPage.scss"

type Props = {
  currentCategory: string,
  products: ProductObject[],
  currentCurrency: CurrencyObject,
  setIsCurrenciesShown: any,
  type: string,
  setCurrentCategory: any,
  isCurrenciesShown: boolean,
  setProducts: any
}

class ShopPage extends Component<Props> {
  constructor(props: any) {
    super(props)

    this.currenciesHide = this.currenciesHide.bind(this);
  }

  componentDidMount(): void {
    this.props.setCurrentCategory(`${this.props.type}`)
  }

  componentDidUpdate(prevProps: Readonly<Props>): void {
    if (prevProps.type !== this.props.type) {
      this.props.setCurrentCategory(`${this.props.type}`)
    }
  }

  currenciesHide() {
    if (!this.props.isCurrenciesShown) return
    this.props.setIsCurrenciesShown(false)
  }
  render() {
    if (!(this.props.products.length > 0)) {
      return (
        <div className="loading-wrapper">
          <h2>Loading...</h2>
        </div>
      )
    }

    return (
      <div className="shop-page-wrapper" onClick={this.currenciesHide}>
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
    isCurrenciesShown: state.shop.isCurrenciesShown
  }
}

const mapDispatchToProps = {
  setIsCurrenciesShown,
  setCurrentCategory,
  setProducts
}

export default connect(mapStateToProps, mapDispatchToProps)(ShopPage)