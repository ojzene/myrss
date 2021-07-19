import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import M from "materialize-css/dist/js/materialize.min.js";

export default function NavBar() {
  useEffect(() => {
    var elem = document.querySelector(".sidenav");
    M.Sidenav.init(elem, {
      edge: "left",
      inDuration: 250,
    });
  }, []);

  return (
    <>
      <nav className="light-green">
        <div className="nav-wrapper container">
          <span className="brand-logo">
            <Link to="/">RSS Feed Reader</Link>
            <i className="large material-icons"></i>
          </span>
          <a href="/" data-target="mobile-sidebar" className="sidenav-trigger">
            <i className="material-icons">menu</i>
          </a>
          <ul className="right hide-on-med-and-down">
            <li>
              <Link to="/">Your Feed</Link>
            </li>
          </ul>
        </div>
      </nav>

      <ul className="sidenav" id="mobile-sidebar">
        <li>
          <div className="user-view">
            <div
              className="drawer-background"
              style={{ height: "35px" }}
            >
              <h5>RSS Reader</h5>
            </div>
          </div>
        </li>
        <li>
          <Link to="/">Your Feed</Link>
        </li>
      </ul>
    </>
  );
}
