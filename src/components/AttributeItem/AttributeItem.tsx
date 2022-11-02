import { Component } from 'react'

import { AttributeItemObject, AttributeObject } from "../../app/shopSlice"
import AttributePropertyItem, { SelectedPropertyObject } from "./AttributePropertyItem/AttributePropertyItem"

type Props = {
  attributeData: AttributeObject,
  inCartMode: boolean,
  inCartProductSelectedAttributes: SelectedPropertyObject[],
  cartItemId: number,
  inMiniCartMode: boolean,
  productName: string
}

class AttributeItem extends Component<Props> {
  render() {
    return (
      <div className="attribute-block">
        <p className={!this.props.inMiniCartMode
          ? "attribute-header"
          : "attribute-header mini-cart"}>
          {`${this.props.attributeData.name.toUpperCase()}:`}
        </p>
        {this.props.attributeData.name !== "Color"
          ? <div className={!this.props.inMiniCartMode
            ? "attribute-items-container"
            : "attribute-items-container mini-cart"}>
            {this.props.attributeData.items.map((attributeItem: AttributeItemObject) => {
              return <AttributePropertyItem
                productName={this.props.productName}
                attributeName={this.props.attributeData.name}
                inCartMode={this.props.inCartMode}
                inMiniCartMode={this.props.inMiniCartMode}
                inCartProductSelectedAttributes={this.props.inCartProductSelectedAttributes}
                propertyData={attributeItem}
                cartItemId={this.props.cartItemId}
                key={attributeItem.id} />
            })}
          </div>
          : <div className={!this.props.inMiniCartMode
            ? "attribute-color-items-container"
            : "attribute-color-items-container mini-cart"}>
            {this.props.attributeData.items.map((attributeItem: AttributeItemObject) => {
              return <AttributePropertyItem
                productName={this.props.productName}
                attributeName={this.props.attributeData.name}
                inCartMode={this.props.inCartMode}
                inMiniCartMode={this.props.inMiniCartMode}
                inCartProductSelectedAttributes={this.props.inCartProductSelectedAttributes}
                propertyData={attributeItem}
                cartItemId={this.props.cartItemId}
                key={attributeItem.id} />
            })}
          </div>}
      </div>
    )
  }
}

export default AttributeItem