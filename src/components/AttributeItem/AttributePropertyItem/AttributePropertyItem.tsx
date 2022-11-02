import { Component } from 'react'
import { connect } from "react-redux";
import { RootState } from "../../../app/store";

import {
  AttributeItemObject,
  ProductObject,
  setSelectedAttributes,
  setCart,
  InCartProductObject,
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
  cartItemId: number,
  inMiniCartMode: boolean,
  productName: string
}

class AttributePropertyItem extends Component<Props> {
  constructor(props: any) {
    super(props)

    this.selectionPropertyHandler = this.selectionPropertyHandler.bind(this);
    this.selectionPropertyInCartHandler = this.selectionPropertyInCartHandler.bind(this);
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

  sortCartProductsAttributesMethod = (previous: any, next: any) => {
    switch (true) {
      case previous.name > next.name:
        return 1
      case previous.name < next.name:
        return -1
      default:
        return 0
    }
  }

  selectionPropertyInCartHandler() {
    const updatedCart = this.props.cart.map((cartItem: InCartProductObject) => {
      if (cartItem.inCartProductData.name !== this.props.productName) {
        return cartItem
      } else {
        if (JSON.stringify(cartItem.selectedAttributes)
          !== JSON.stringify(this.props.inCartProductSelectedAttributes)) {
          return cartItem
        }

        return {
          ...cartItem, selectedAttributes: cartItem.selectedAttributes
            .map<AttributeItemObject>((attribute: any) => {
              if (attribute.name === this.props.attributeName) {
                return { name: this.props.attributeName, value: this.props.propertyData.value }
              } else {
                return attribute
              }
            })
            .sort(this.sortCartProductsAttributesMethod)
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
            ? this.props.inMiniCartMode
              ? "attribute-property active mini-cart"
              : "attribute-property active"
            : this.props.inMiniCartMode
              ? "attribute-property mini-cart"
              : "attribute-property"}
          onClick={this.selectionPropertyInCartHandler} >
          {this.props.attributeName === "Color"
            ? <div
              className={this.props.propertyData.displayValue === "White"
                ? this.props.inMiniCartMode
                  ? "color-square white-color mini-cart"
                  : "color-square white-color"
                : this.props.inMiniCartMode
                  ? "color-square mini-cart"
                  : "color-square"}
              style={{ backgroundColor: this.props.propertyData.value }}></div>
            : <>
              <span>{this.props.propertyData.value}</span>
            </>
          }
        </div >
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
