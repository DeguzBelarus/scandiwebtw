import { Component } from 'react'
import { connect } from "react-redux";
import { RootState } from "../../../app/store";

import {
   AttributeItemObject,
   ProductObject,
   setSelectedAttributes
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
   inCartMode: boolean
}

type State = {
   inCartId: number
}

class AttributePropertyItem extends Component<Props, State> {
   constructor(props: any) {
      super(props)

      this.selectionPropertyHandler = this.selectionPropertyHandler.bind(this);
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
                  : "attribute-property"}>
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
      currentProduct: state.shop.currentProduct
   }
}

const mapDispatchToProps = {
   setSelectedAttributes,
}

export default connect(mapStateToProps, mapDispatchToProps)(AttributePropertyItem)
