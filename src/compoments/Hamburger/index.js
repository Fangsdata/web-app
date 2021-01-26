import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';

const Hamburger = () => {
  const [isSidebarOpen, setSidebarStatus] = useState(false);

  useEffect(() => {
    document.addEventListener('mousedown', handleMenuButtonClick);
    return () => {
      document.removeEventListener('mousedown', handleMenuButtonClick);
    };
  }, []);

  const handleMenuButtonClick = (e) => {
    if (node.current.contains(e.target)) {
      setSidebarStatus(!isSidebarOpen);
    } else {
      setSidebarStatus(false);
    }
  };

  const node = useRef();

  return (
    <div className="navlink-container">
      <div ref={node} className={`burger-container ${isSidebarOpen ? 'change' : ''}`}>
        <div className="line1" />
        <div className="line2" />
        <div className="line3" />
      </div>

      <nav className={`nav-${isSidebarOpen ? 'show' : 'hide'}`}>
        <div className="navlinks">
          <NavLink
            exact
            to="/"
          >
            Home
          </NavLink>
          {/* <NavLink
                    exact
                    to="/boats">Boat</NavLink> */}
          <NavLink
            exact
            to="/contact"
          >
            Contact us
          </NavLink>
          <NavLink
            exact
            to="/about"
          >
            About us
          </NavLink>
        </div>
      </nav>

      {/* <ul className="navlinks">
            <li>
                <NavLink
                exact
                to="/">Home</NavLink>
            </li>
            <li>
            <NavLink
                exact
                to="/boats">Boat</NavLink>
            </li>
        </ul> */}
    </div>
  );
};

export default Hamburger;
