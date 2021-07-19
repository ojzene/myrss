import 'materialize-css/dist/css/materialize.min.css';
import 'materialize-css/dist/js/materialize.min';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://kanmitrssserver.herokuapp.com/graphql",
  cache: new InMemoryCache()
});
const brand = "My RSS Feed"
const reactStrict = (
  <ApolloProvider client={client}>
    <React.StrictMode>
      <App brand={brand} />
    </React.StrictMode>
  </ApolloProvider>
)
ReactDOM.render(reactStrict, document.getElementById('kanmit'));

reportWebVitals();
