import { gql } from "@apollo/client"

export const GET_ALL_CATEGORIES = gql`
query {
   categories {
      name
   }
}
`

export const GET_PRODUCTS = gql`
query category($input: CategoryInput) {
   category(input: $input) {
    products {
      id, name, inStock, gallery, description, category, attributes {
        id, name, type, items {
          displayValue, value, id
        }
      }, prices {
        currency {
          label, symbol
        }, amount
      }, brand
    }
   }
}
`

export const GET_ONE_PRODUCT = gql`
query product($id: String!) {
   product(id: $id) {
    id, name, inStock, gallery, description, category, attributes {
      id, name, type, items {
        id, value, displayValue
      }
    }, prices {
      currency {
        label, symbol
      }, amount
    }, brand
    }
}
`

export const GET_ALL_CURRENCIES = gql`
query {
   currencies {
      label, symbol
   }
}
`
