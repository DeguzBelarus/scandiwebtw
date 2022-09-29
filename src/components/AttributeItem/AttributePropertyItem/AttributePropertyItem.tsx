import { Component } from 'react'
import { connect } from "react-redux";
import { RootState } from "../../../app/store";

import {
   AttributeItemObject,
   ProductObject,
   setSelectedAttributes,
   setCart,
   InCartProductObject,
   AttributeObject
} from "../../../app/shopSlice";

export interface SelectedPropertyObject {
   name: string,
   value: string
}

type Props = {
   propertyData: AttributeItemObject,
   attributeName: string,
   setSelectedAttributes: any,
   selectedAttributes: SelectedPropertyObject[],
   inCartProductSelectedAttributes: SelectedPropertyObject[]
   currentProduct: ProductObject,
   inCartMode: boolean,
   setCart: any,
   cart: InCartProductObject[],
   cartItemId: number
}

class AttributePropertyItem extends Component<Props> {
   constructor(props: any) {
      super(props)

      this.selectionPropertyHandler = this.selectionPropertyHandler.bind(this);
      this.selectionPropertyInCartHandler = this.selectionPropertyInCartHandler.bind(this);
   }

   componentWillUnmount(): void {
      this.props.setSelectedAttributes([])
   }

   selectionPropertyHandler() {
      const foundSelectedProperty = this.props.selectedAttributes
         .find((selectedProperty: SelectedPropertyObject) => (
            selectedProperty.name === this.props.attributeName &&
            selectedProperty.value === this.props.propertyData.value
         ))

      if (foundSelectedProperty) return

      this.props.setSelectedAttributes([...this.props.selectedAttributes
         .filter((selectedProperty: SelectedPropertyObject) => (
            selectedProperty.name !== this.props.attributeName
         )),
      {
         name: this.props.attributeName,
         value: this.props.propertyData.value
      }
      ])
   }

   selectionPropertyInCartHandler() {
      // console.log(this.props.cartItemId);
      // console.log(this.props.attributeName);
      // console.log(this.props.cart);


      // console.log(this.props.cart.find((cartItem: InCartProductObject) => cartItem.id === this.props.cartItemId));
      const updatedCart = this.props.cart.map((cartItem: InCartProductObject) => {
         if (cartItem.id !== this.props.cartItemId) {
            return cartItem
         } else {
            return {
               ...cartItem, selectedAttributes: cartItem.selectedAttributes.map<AttributeItemObject>((attribute: any) => {
                  if (attribute.name === this.props.attributeName) {
                     return { name: this.props.attributeName, value: this.props.propertyData.value }
                  } else {
                     return attribute
                  }
               })
            }
         }
      })

      this.props.setCart([...updatedCart])
   }
   render() {
      if (this.props.inCartMode) {
         return (
            <div
               className={this.props.inCartProductSelectedAttributes
                  .find((selectedProperty: SelectedPropertyObject) => (
                     selectedProperty.name === this.props.attributeName &&
                     selectedProperty.value === this.props.propertyData.value
                  ))
                  ? "attribute-property active"
                  : "attribute-property"}
               onClick={this.selectionPropertyInCartHandler}>
               {this.props.attributeName === "Color"
                  ? <div
                     className={this.props.propertyData.displayValue === "White"
                        ? "color-square white-color"
                        : "color-square"}
                     style={{ backgroundColor: this.props.propertyData.value }}></div>
                  : <>
                     <span>{this.props.propertyData.value}</span>
                  </>}
            </div>
         )
      } else {
         return (
            <div
               className={this.props.selectedAttributes
                  .find((selectedProperty: SelectedPropertyObject) => (
                     selectedProperty.name === this.props.attributeName &&
                     selectedProperty.value === this.props.propertyData.value
                  ))
                  ? "attribute-property active"
                  : "attribute-property"}
               onClick={this.selectionPropertyHandler}>
               {this.props.attributeName === "Color"
                  ? <div
                     className={this.props.propertyData.displayValue === "White"
                        ? "color-square white-color"
                        : "color-square"}
                     style={{ backgroundColor: this.props.propertyData.value }}></div>
                  : <>
                     <span>{this.props.propertyData.value}</span>
                  </>}
            </div>
         )
      }
   }
}

function mapStateToProps(state: RootState) {
   return {
      selectedAttributes: state.shop.selectedAttributes,
      currentProduct: state.shop.currentProduct,
      cart: state.shop.cart
   }
}

const mapDispatchToProps = {
   setSelectedAttributes,
   setCart
}

export default connect(mapStateToProps, mapDispatchToProps)(AttributePropertyItem)
