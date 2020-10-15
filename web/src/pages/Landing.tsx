import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

import logoImg from '../images/logo.svg';
import '../styles/pages/Landing.css';

function Landing() {
  return (
    <div className="pageLanding">
      <div className="pageLanding__contentWrapper">
        <div className="pageLanding__heading">
          <img className="pageLanding__logo" src={logoImg} alt="Happy" />

          <div className="pageLanding__location">
            <b className="pageLanding__city">Campina Grande</b>
            <span className="pageLanding__state">Paraíba</span>
          </div>
        </div>

        <main>
          <div className="pageLanding__hero">
            <h1 className="pageLanding__heroTitle">
              Leve felicidade para o mundo
            </h1>
            <p className="pageLanding__heroDescription">
              Visite orfanatos e mude o dia de muitas crianças.
            </p>
          </div>

          <Link to="/app" className="pageLanding__enterApp">
            <FiArrowRight className="arrowRight" />
          </Link>
        </main>
      </div>
    </div>
  );
}

export default Landing;
