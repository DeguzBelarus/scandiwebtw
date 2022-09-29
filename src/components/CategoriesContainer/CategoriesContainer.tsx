import { Component } from 'react'
import { connect } from "react-redux";
import { RootState } from "../../app/store";

import { GET_ALL_CATEGORIES, GET_PRODUCTS, GET_ALL_CURRENCIES } from "../../query/shop"
import {
   getAllCategoriesAsync,
   getProductsAsync,
   setCurrentCategory,
   getAllCurrenciesAsync
} from "../../app/shopSlice";
import "./CategoriesContainer.scss"

type Props = {
   getAllCategoriesAsync: any,
   getProductsAsync: any,
   setCurrentCategory: any,
   categories: string[],
   currentCategory: string,
   getAllCurrenciesAsync: any
}

class CategoriesContainer extends Component<Props> {
   componentDidMount(): void {
      this.props.getAllCategoriesAsync(GET_ALL_CATEGORIES)
      this.props.getAllCurrenciesAsync(GET_ALL_CURRENCIES)
      this.props.getProductsAsync({ query: GET_PRODUCTS, variables: { title: "all" } })
   }

   componentDidUpdate(prevProps: Readonly<Props>): void {
      this.props.getProductsAsync({ query: GET_PRODUCTS, inputVariables: { title: this.props.currentCategory } })

      if (prevProps.currentCategory !== this.props.currentCategory) {
         if (!window.location.pathname.includes("/product")) {
            switch (true) {
               case this.props.currentCategory === "all":
                  window.history.replaceState(null, "New Page Title", "/all")
                  break
               case this.props.currentCategory === "clothes":
                  window.history.replaceState(null, "New Page Title", "/clothes")
                  break
               case this.props.currentCategory === "tech":
                  window.history.replaceState(null, "New Page Title", "/tech")
            }
         }
      }
   }

   render() {
      return (
         <div className="categories-container">
            {this.props.categories.map((category: string, index) => {
               return <div
                  className={category === this.props.currentCategory
                     ? "category-selector active"
                     : "category-selector"}
                  onClick={() => this.props.setCurrentCategory(category)}
                  key={index}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
               </div>
            })
            }
         </div >
      )
   }
}

function mapStateToProps(state: RootState) {
   return {
      categories: state.shop.categories,
      currentCategory: state.shop.currentCategory
   }
}

const mapDispatchToProps = {
   getAllCategoriesAsync,
   getProductsAsync,
   setCurrentCategory,
   getAllCurrenciesAsync
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoriesContainer)