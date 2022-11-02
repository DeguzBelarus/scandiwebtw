import { Component } from 'react';
import { Route, Routes } from "react-router-dom";

import ShopPage from "../pages/ShopPage/ShopPage";
import ProductDetailsPage from "../pages/ProductDetailsPage/ProductDetailsPage";
import CartPage from "./../pages/CartPage/CartPage"

export class AppRouter extends Component {
  render() {
    return (
      <Routes>
        <Route path={"/all"} element={<ShopPage type="all" />}></Route>
        <Route path={"/clothes"} element={<ShopPage type="clothes" />}></Route>
        <Route path={"/tech"} element={<ShopPage type="tech" />}></Route>
        <Route path={"/product/:id"} element={<ProductDetailsPage />}></Route>
        <Route path={"/cart"} element={<CartPage />}></Route>
        <Route path={"*"} element={<ShopPage type="all" />}></Route>
      </Routes >
    )
  }
}