import { Component } from 'react';
import { Route, Routes } from "react-router-dom";

import CartPage from "./../pages/CartPage/CartPage"
import ShopPage from "../pages/ShopPage/ShopPage";
import ProductDetailsPage from "../pages/ProductDetailsPage/ProductDetailsPage";

export class AppRouter extends Component {
   render() {
      return (
         <Routes>
            <Route path={"/"} element={<ShopPage currentCategory="" currentCurrency={{ label: "", symbol: "" }} products={[]} />}></Route>
            <Route path={"/product/:id"} element={<ProductDetailsPage />}></Route>
            <Route path={"/cart"} element={<CartPage currentCurrency={{ label: "", symbol: "" }} cart={[]} />}></Route>
            <Route path={"*"} element={<ShopPage currentCategory="" currentCurrency={{ label: "", symbol: "" }} products={[]} />}></Route>
         </Routes >
      )
   }
}