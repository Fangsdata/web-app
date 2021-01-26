import React from 'react';
import { object } from 'prop-types';

const Container = ({ children }) => <div className="container">{children}</div>;

Container.propTypes = {
  children: object,
};

Container.defaultProps = {
  children: {},
};

export default Container;
