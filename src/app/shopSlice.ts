import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { QueryOptions } from "@apollo/client";

import { queryRequest, queryRequestGetAllProducts, queryRequestGetOneProduct } from "./shopAPI"
import { SelectedPropertyObject } from "../components/AttributeItem/AttributePropertyItem/AttributePropertyItem";

export interface CurrencyObject {
  label: string,
  symbol: string
}


export interface AttributeItemObject {
  id: string,
  value: string,
  displayValue: string
}


export interface AttributeObject {
  id: string,
  name: string,
  type: string,
  items: AttributeItemObject[]
}

export interface PriceObject {
  amount: number,
  currency: {
    label: string,
    symbol: string
  }
}

export interface ProductObject {
  id: string,
  name: string,
  inStock: boolean,
  gallery: string[],
  description: string,
  attributes: AttributeObject[],
  prices: PriceObject[],
  brand: string,
}

export interface InCartProductObject {
  id: number,
  inCartProductData: ProductObject,
  selectedAttributes: SelectedPropertyObject[]
}

interface ShopState {
  categories: string[],
  currencies: CurrencyObject[],
  currentCurrency: CurrencyObject,
  currentCategory: string,
  products: ProductObject[],
  currentProduct: ProductObject,
  selectedAttributes: {}[],
  cart: InCartProductObject[],
  isCartPageShown: boolean,
  isProductDetailsPageShown: boolean,
  isMiniCartShown: boolean,
  isCurrenciesShown: boolean,
  status: "idle" | "loading" | "failed",
}

const initialState = {
  categories: [],
  currencies: [],
  currentCurrency: { label: "USD", symbol: "$" },
  currentCategory: "all",
  products: [],
  currentProduct: {
    id: "",
    name: "",
    inStock: false,
    gallery: [],
    description: "",
    attributes: [],
    prices: [],
    brand: ""
  },
  selectedAttributes: [],
  cart: [],
  isCartPageShown: false,
  isProductDetailsPageShown: false,
  isMiniCartShown: false,
  isCurrenciesShown: false,
  status: "idle",
} as ShopState

// thunks
export const getAllCategoriesAsync = createAsyncThunk(
  "shop/get/categories",
  async (query: QueryOptions) => {
    const response: any = await queryRequest(query)
    return response
  }
)

export const getAllCurrenciesAsync = createAsyncThunk(
  "shop/get/currencies",
  async (query: QueryOptions) => {
    const response: any = await queryRequest(query)
    return response
  }
)

interface QueryRequestGetAllProductsObject {
  query: QueryOptions,
  inputVariables: {}
}

export const getProductsAsync = createAsyncThunk(
  "shop/get/products",
  async (data: QueryRequestGetAllProductsObject) => {
    const response: any = await queryRequestGetAllProducts(data.query, data.inputVariables)
    return response
  }
)

interface QueryRequestGetOneProductObject {
  query: QueryOptions,
  variables: {
    id: string
  }
}

export const getOneProductAsync = createAsyncThunk(
  "shop/get/product",
  async (data: QueryRequestGetOneProductObject) => {
    const response: any = await queryRequestGetOneProduct(data.query, data.variables.id)
    return response
  }
)
// thunks

export const shopSlice = createSlice({
  name: "shop",
  initialState,
  reducers: {
    setCategories(state: any, action: PayloadAction<any>) {
      if (action.payload) {
        state.categories = action.payload
      } else {
        state.categories = initialState.categories
      }
    }, setProducts(state: any, action: PayloadAction<any>) {
      if (action.payload) {
        state.products = action.payload
      } else {
        state.products = initialState.products
      }
    }, setCurrentCategory(state: any, action: PayloadAction<any>) {
      if (action.payload) {
        state.currentCategory = action.payload
      } else {
        state.currentCategory = initialState.currentCategory
      }
    }, setCurrentCurrency(state: any, action: PayloadAction<any>) {
      if (action.payload) {
        state.currentCurrency = action.payload
      } else {
        state.currentCurrency = initialState.currentCurrency
      }
    }, setCurrentProduct(state: any, action: PayloadAction<any>) {
      if (action.payload) {
        state.currentProduct = action.payload
      } else {
        state.currentProduct = initialState.currentProduct
      }
    }, setCart(state: any, action: PayloadAction<any>) {
      if (action.payload) {
        state.cart = action.payload
      } else {
        state.cart = initialState.cart
      }
    }, setSelectedAttributes(state: any, action: PayloadAction<any>) {
      if (action.payload) {
        state.selectedAttributes = action.payload
      } else {
        state.selectedAttributes = initialState.selectedAttributes
      }
    }, setIsCartPageShown(state: any, action: PayloadAction<any>) {
      if (action.payload) {
        state.isCartPageShown = action.payload
      } else {
        state.isCartPageShown = initialState.isCartPageShown
      }
    }, setIsMiniCartShown(state: any, action: PayloadAction<any>) {
      if (action.payload) {
        state.isMiniCartShown = action.payload
      } else {
        state.isMiniCartShown = initialState.isMiniCartShown
      }
    }, setIsCurrenciesShown(state: any, action: PayloadAction<any>) {
      if (action.payload) {
        state.isCurrenciesShown = action.payload
      } else {
        state.isCurrenciesShown = initialState.isCurrenciesShown
      }
    }, setIsProductDetailsPageShown(state: any, action: PayloadAction<any>) {
      if (action.payload) {
        state.isProductDetailsPageShown = action.payload
      } else {
        state.isProductDetailsPageShown = initialState.isProductDetailsPageShown
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // get all categories
      .addCase(getAllCategoriesAsync.pending, (state) => {
        state.status = "loading"
      })
      .addCase(getAllCategoriesAsync.fulfilled, (state, action) => {
        state.status = "idle"

        const categories: string[] = []
        action.payload.data.categories.forEach((category: any) => categories.push(category.name))
        state.categories = categories
      })
      .addCase(getAllCategoriesAsync.rejected, (state, action) => {
        state.status = "failed"
        console.error("\x1b[40m\x1b[31m\x1b[1m", action.error.message);
      })
      // get all categories

      // get all currencies
      .addCase(getAllCurrenciesAsync.pending, (state) => {
        state.status = "loading"
      })
      .addCase(getAllCurrenciesAsync.fulfilled, (state, action) => {
        state.status = "idle"

        const currencies: CurrencyObject[] = []
        action.payload.data.currencies.forEach((currency: CurrencyObject) => currencies.push(currency))
        state.currencies = currencies
      })
      .addCase(getAllCurrenciesAsync.rejected, (state, action) => {
        state.status = "failed"
        console.error("\x1b[40m\x1b[31m\x1b[1m", action.error.message);
      })
      // get all currencies

      // get products by category
      .addCase(getProductsAsync.pending, (state) => {
        state.status = "loading"
      })
      .addCase(getProductsAsync.fulfilled, (state, action) => {
        state.status = "idle"

        const products: ProductObject[] = []
        action.payload.data.category.products.forEach((product: any) => products.push(product))
        state.products = products
      })
      .addCase(getProductsAsync.rejected, (state, action) => {
        state.status = "failed"
        console.error("\x1b[40m\x1b[31m\x1b[1m", action.error.message);
      })
      // get products by category

      // get one product
      .addCase(getOneProductAsync.pending, (state) => {
        state.status = "loading"
      })
      .addCase(getOneProductAsync.fulfilled, (state, action) => {
        state.status = "idle"

        state.currentProduct = action.payload.data.product
      })
      .addCase(getOneProductAsync.rejected, (state, action) => {
        state.status = "failed"
        console.error("\x1b[40m\x1b[31m\x1b[1m", action.error.message);
      })
    // get one product
  }
})

export const {
  setCategories,
  setProducts,
  setCurrentCategory,
  setCurrentCurrency,
  setCurrentProduct,
  setCart,
  setSelectedAttributes,
  setIsCartPageShown,
  setIsCurrenciesShown,
  setIsMiniCartShown,
  setIsProductDetailsPageShown
} = shopSlice.actions

export default shopSlice.reducer