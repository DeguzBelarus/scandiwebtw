import { Component } from 'react'

import "./ProductPosterLoader.scss"

class ProductPosterLoader extends Component {
  render() {
    return (
      <div className="poster-loader-wrapper">
        <div className="product-poster-loader">
          <span>
            loading...
          </span>
        </div>
      </div>
    )
  }
}

export default ProductPosterLoader