import { Component } from 'react'
import { connect } from "react-redux";
import { RootState } from "../../app/store";
import { Link } from "react-router-dom";

import { GET_ALL_CATEGORIES, GET_PRODUCTS, GET_ALL_CURRENCIES } from "../../query/shop"
import {
  getAllCategoriesAsync,
  getProductsAsync,
  setCurrentCategory,
  getAllCurrenciesAsync,
  setProducts,
} from "../../app/shopSlice";
import "./CategoriesContainer.scss"

type Props = {
  getAllCategoriesAsync: any,
  getProductsAsync: any,
  setCurrentCategory: any,
  categories: string[],
  currentCategory: string,
  getAllCurrenciesAsync: any,
  setProducts: any,
}

class CategoriesContainer extends Component<Props> {
  componentDidMount(): void {
    this.props.getAllCategoriesAsync(GET_ALL_CATEGORIES)
    this.props.getAllCurrenciesAsync(GET_ALL_CURRENCIES)
    this.props.setProducts([])
    this.props.getProductsAsync({ query: GET_PRODUCTS, inputVariables: { title: this.props.currentCategory } })
  }

  componentDidUpdate(prevProps: Readonly<Props>): void {
    if (prevProps.currentCategory !== this.props.currentCategory) {
      this.props.setProducts([])
      this.props.getProductsAsync({ query: GET_PRODUCTS, inputVariables: { title: this.props.currentCategory } })
    }
  }
  render() {
    return (
      <div className="categories-container">
        {this.props.categories.map((category: string, index) => {
          return <Link to={`/${category}`}
            className={category === this.props.currentCategory
              ? "category-selector active"
              : "category-selector"}
            key={index}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Link>
        })
        }
      </div >
    )
  }
}

function mapStateToProps(state: RootState) {
  return {
    categories: state.shop.categories,
    currentCategory: state.shop.currentCategory,
  }
}

const mapDispatchToProps = {
  getAllCategoriesAsync,
  getProductsAsync,
  setCurrentCategory,
  getAllCurrenciesAsync,
  setProducts
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoriesContainer)