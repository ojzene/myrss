// export default App;

// Font size
// The color of the headline of the RSS blocks
// The color of the text in the RSS blocks
// The color of the background of the blocks
// The dimensions (width and height) of the RSS content boxes
// (the default will show 3 results in a row, and if the user makes the dimensions bigger or the browser smaller - there will be less)

import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

import React from "react";
import NavBar from "./components/NavBar";

import Settings from "./components/Settings";
import ShowRss from "./components/ShowRss";

import { SettingsProvider } from "./contexts/SettingsContext";

// const MAX_CONTENT_LENGTH = 150;

export default function App() {
  return (
    <SettingsProvider>
     <Router>
      <div className="App">
        <NavBar></NavBar>
        <div className="container">
          <Switch>
            <Route path="/" exact component={ShowRss}></Route>
            <Route path="/settings" component={Settings}></Route>
          </Switch>
        </div>
      </div>
    </Router>
    </SettingsProvider>   
        
  );

  // function trimContent(snippet) {
  //   if (snippet.length > MAX_CONTENT_LENGTH) {
  //     snippet = snippet.substring(0, MAX_CONTENT_LENGTH);
  //     snippet += " [...]";
  //   }
  //   return snippet;
  // }

}