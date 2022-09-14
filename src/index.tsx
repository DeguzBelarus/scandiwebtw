import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from "react-router-dom"
import { store } from './app/store';
import { ApolloClient, InMemoryCache } from "@apollo/client";

import App from './App';
import './index.scss';

const container = document.getElementById('root')!;
const root = createRoot(container);

export const apolloClient = new ApolloClient({
   uri: "http:localhost:4000/",
   cache: new InMemoryCache(),
   defaultOptions: {
      watchQuery: {
         fetchPolicy: "cache-and-network",
         errorPolicy: "ignore"
      },
      query: {
         fetchPolicy: "network-only",
         errorPolicy: "all"
      },
      mutate: {
         errorPolicy: "all"
      }
   }
})
const app =
   <Provider store={store}>
      <BrowserRouter>
         <App />
      </BrowserRouter>
   </Provider>
root.render(app);
