import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import React from "react";
import NavBar from "./components/NavBar";
import ShowRss from "./components/ShowRss";
import { SettingsProvider } from "./contexts/SettingsContext";

export default function App() {
  return (
    <SettingsProvider>
     <Router>
      <div className="App">
        <NavBar></NavBar>
        <div className="container">
          <Switch>
            <Route path="/" exact component={ShowRss}></Route>
          </Switch>
        </div>
      </div>
    </Router>
    </SettingsProvider>       
  );
}
