import React from 'react';
import { NavLink } from 'react-router-dom';

class NavLinks extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isSidebarOpen: false,
    };
  }

  handleMenuButtonClick() {
    const { isSidebarOpen } = this.state;
    this.setState({ isSidebarOpen: !isSidebarOpen });
  }

  render() {
    const { isSidebarOpen } = this.state;
    return (
      <div className="navlink-container">
        <div
          className={`burger-container ${isSidebarOpen ? 'change' : ''}`}
          onClick={() => this.handleMenuButtonClick()}
          onKeyDown={this.handleKeyDown}
        >
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
              Hjem
            </NavLink>
            <NavLink
              exact
              to="/topoffloads"
            >
              Topp landing
            </NavLink>
            <NavLink
              exact
              to="/contact"
            >
              Kontakt oss
            </NavLink>
            <NavLink
              exact
              to="/about"
            >
              Om oss
            </NavLink>
          </div>
        </nav>
      </div>
    );
  }
}

export default NavLinks;
