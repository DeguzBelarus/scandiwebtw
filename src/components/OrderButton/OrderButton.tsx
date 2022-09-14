import { Component } from 'react'
import { connect } from "react-redux";

import { InCartProductObjectModified } from "../../pages/CartPage/CartPage";
import { setCart } from "../../app/shopSlice";

type Props = {
   setCart: any,
   cartDataModified: InCartProductObjectModified[]
}

class AttributeItem extends Component<Props> {
   constructor(props: any) {
      super(props)

      this.acceptOrder = this.acceptOrder.bind(this);
   }

   acceptOrder() {
      console.log(`Your order was confirmed. Thank you! Order details:`,
         this.props.cartDataModified);
      this.props.setCart([])
   }
   render() {
      return (
         <div className="order-button" onClick={this.acceptOrder}>ORDER</div>
      )
   }
}

const mapDispatchToProps = {
   setCart
}

export default connect(null, mapDispatchToProps)(AttributeItem)
