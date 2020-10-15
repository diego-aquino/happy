import React from 'react';
import { useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

import happyIcon from '../images/map-marker.svg';

import '../styles/components/Sidebar.css';

function Sidebar() {
  const { goBack } = useHistory();

  return (
    <aside className="sidebar">
      <img
        src={happyIcon}
        alt="Happy"
        className="sidebar__happyIcon"
      />

      <footer>
        <button
          type="button"
          onClick={goBack}
          className="sidebar__goBack"
        >
          <FiArrowLeft className="arrowLeft" />
        </button>
      </footer>
    </aside>
  );
}

export default Sidebar;
