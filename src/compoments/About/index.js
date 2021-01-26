import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './FangstDataLogo.svg';
import DataIllustration from './data.svg';

const About = () => (
  <div className="about-container">
    <img className="about-logo" src={Logo} alt="" />
    <div className="about-text-container">
      <h1 className="about-header">Om oss</h1>
      <div className="about-content">
        <div className="about-text">
          <p>
            <strong>FangstData</strong>
            {' '}
            Er et nettsted med mål om å gi deg diverse fiskedata.
            {' '}
          </p>
          <p>
            Vi får dataene våre fra en åpen database, ikke alle vet det
            hvordan du får tilgang til denne informasjonen, og det kan være vanskelig å tyde.
          </p>
          <p>
            Vi ønsker å gi enkel tilgang til denne informasjonen
            på en måte som er forståelig for alle.
          </p>
          <p>
            Hvis du har spørsmål eller kommentarer, ikke nøl med å gjøre deto
            <Link to="/contact"> kontakt oss</Link>
            .
          </p>
        </div>
        <img className="data-illustration" src={DataIllustration} alt="" />
      </div>
    </div>
  </div>
);

export default About;
