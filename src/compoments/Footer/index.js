import React from 'react';
import { Link } from 'react-router-dom';
import FooterLogo from './logofooter.svg';

const Footer = () => (
  <div className="footer">
    <div className="footer-content">
      <Link exact to="/" className="footer-logo"><img src={FooterLogo} alt="" /></Link>
      <div className="footer-text">
        <Link exact to="/about" className="footer-link">Om oss</Link>
        <Link exact to="/contact" className="footer-link">Kontakt oss</Link>
        <Link exact to="/" className="footer-link">fangstdata.no</Link>
      </div>
    </div>
  </div>

);

export default Footer;
