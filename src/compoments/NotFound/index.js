import React from 'react';
import { Link } from 'react-router-dom';
import NotFoundImg from './404.png';

const NotFound = () => (
  <div className="not-found-container">
    <img src={NotFoundImg} className="not-found-img" alt="404" />
    <h1 className="not-found-header">Page not found!</h1>
    <Link to="/"><div className="not-found-btn">Go back to home</div></Link>
  </div>
);

export default NotFound;
