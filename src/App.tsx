import { Component } from 'react'

import { AppRouter } from "./AppRouter/AppRouter";
import Header from "./components/Header/Header";

class App extends Component {
  render() {
    return <>
      <Header />
      <AppRouter />
    </>
  }
}

export default App;
