import React from 'react';
import Illustration from './email.svg';

const Contact = () => (
  <div className="contact-container">
    <div className="contact-info">
      <h1 className="contact-header">Kontakt oss</h1>
      <p>Hvis du har spørsmål eller kommentarer, kan du sende oss en linje.</p>
      <a className="mail" href="mailto:post@fangstdata.no">Send e-post</a>
    </div>
    <img className="email-icon" src={Illustration} alt="" />
  </div>
);

export default Contact;
