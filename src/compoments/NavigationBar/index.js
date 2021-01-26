import React from 'react';
import { NavLink } from 'react-router-dom';
import SearchBar from '../SearchBar';
import NavLinks from '../NavLinks';
import Logo from './FangstDataLogo.svg';


class NavigationBar extends React.Component {
  constructor() {
    super();
    this.state = {
      logoClass: 'logo',
    };
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll());
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll());
  }

  handleScroll() {
    const shrinkOn = 50;
    const yOffset = window.pageYOffset || document.documentElement.scrollTop;
    if (yOffset > shrinkOn) {
      this.setState({
        logoClass: 'small-logo',
      });
    } else {
      this.setState({
        logoClass: 'logo',
      });
    }
  }

  render() {
    const { logoClass } = this.state;
    return (
      <>
        <NavLink exact to="/">
          <img className={logoClass} src={Logo} alt="Logo" />
        </NavLink>
        <nav className="navbar">
          <div className="logo-placeholder" />
          <SearchBar />
          <NavLinks />
        </nav>
      </>
    );
  }
}

export default NavigationBar;
