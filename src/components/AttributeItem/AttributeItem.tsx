import { Component } from 'react'

import { AttributeItemObject, AttributeObject } from "../../app/shopSlice"
import AttributePropertyItem, { SelectedPropertyObject } from "./AttributePropertyItem/AttributePropertyItem"

type Props = {
   attributeData: AttributeObject,
   inCartMode: boolean,
   inCartProductSelectedAttributes: SelectedPropertyObject[]
}

class AttributeItem extends Component<Props> {
   render() {
      return (
         <div className="attribute-block">
            <p className="attribute-header">{`${this.props.attributeData.name.toUpperCase()}:`}</p>
            {this.props.attributeData.name !== "Color"
               ? <div className="attribute-items-container">
                  {this.props.attributeData.items.map((attributeItem: AttributeItemObject) => {
                     return <AttributePropertyItem
                        attributeName={this.props.attributeData.name}
                        inCartMode={this.props.inCartMode}
                        inCartProductSelectedAttributes={this.props.inCartProductSelectedAttributes}
                        propertyData={attributeItem}
                        key={attributeItem.id} />
                  })}
               </div>
               : <div className="attribute-color-items-container">
                  {this.props.attributeData.items.map((attributeItem: AttributeItemObject) => {
                     return <AttributePropertyItem
                        attributeName={this.props.attributeData.name}
                        inCartMode={this.props.inCartMode}
                        inCartProductSelectedAttributes={this.props.inCartProductSelectedAttributes}
                        propertyData={attributeItem}
                        key={attributeItem.id} />
                  })}
               </div>}
         </div>
      )
   }
}

export default AttributeItem