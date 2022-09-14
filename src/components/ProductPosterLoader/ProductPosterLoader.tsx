import { Component } from 'react'

import "./ProductPosterLoader.scss"

class ProductPosterLoader extends Component {
   render() {
      return (
         <div className="product-poster-loader">
            <span>
               loading...
            </span>
         </div>
      )
   }
}

export default ProductPosterLoader