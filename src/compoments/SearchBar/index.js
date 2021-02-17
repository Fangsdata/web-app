import React, { useState, useEffect, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import icon from './search-24px.svg';
import { OFFLOADAPI } from '../../Constants';

let timeOut;
const SearchBar = () => {
  const [search, updateSearch] = useState('');
  const [foundBoats, setFoundBoats] = useState([]);
  const [isSearchOpen, setSearchStatus] = useState(false);
  
  const UpdateQuickSearch = (searchTerm) => {
    if (searchTerm.length > 2) {
      fetch(`${OFFLOADAPI}/search/boats/${searchTerm}`)
        .then((res) => res.json())
        .then((res) => {
          setFoundBoats(res);
        });
    } else {
      setFoundBoats([]);
    }
  };

  const history = useHistory();
            
  const node = useRef();

  useEffect(() => {
    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, []);

  const handleClick = (e) => {
    if (node.current.contains(e.target)) {
      setSearchStatus(false);
      return;
    }
    setSearchStatus(true);
  };

  return (
    <div ref={node} className="search-container">
      <div className={`searchbar ${foundBoats.length !== 0 && !isSearchOpen ? 'open' : ''}`}>
        <input
          className="search-inp"
          placeholder="Søk etter båter"
          value={search}
          onInput={(e) => {
            updateSearch(e.target.value);
            clearTimeout(timeOut);
            const searchTerm = e.target.value;
            timeOut = setTimeout(() => UpdateQuickSearch(searchTerm), 200);
          }}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              history.push(`/search/${search}`);
              updateSearch(''); 
              setSearchStatus(true);
            }
          }}
          type="text"
        />
        <button
          onClick={()=>{               
            updateSearch(''); 
            setSearchStatus(true);
          }}
          className="search-btn">

          <Link to={`/search/${search}`}><img className="search-icon" src={icon} alt="" /></Link>
        </button>
        { foundBoats.length !== 0 && !isSearchOpen
          ? (
            <div className="quick-search">
              <div className="line" />
              { foundBoats.map((boat) => (
                <QuickSearchItem
                  searchItemTitle={`${boat.name} - ${boat.registration_id}`}
                  id={boat.id}
                  ClickedEvent={() => {
                    updateSearch('');
                    setFoundBoats([]);
                  }}
                />
              )) }
              <div className="result-bottom" />
            </div>
          )
          : <></>}
      </div>
    </div>
  );
};
const QuickSearchItem = ({ searchItemTitle, id, ClickedEvent }) => (
  <Link to={`/boats/${id}`} onClick={() => { ClickedEvent(id); }}>
    <div className="search-result">
      {searchItemTitle}
    </div>
  </Link>
);

QuickSearchItem.propTypes = {
  searchItemTitle: PropTypes.string,
  RegistrationId: PropTypes.string,
  ClickedEvent: PropTypes.func.isRequired,
};

QuickSearchItem.defaultProps = {
  searchItemTitle: '',
  RegistrationId: '',
};

export default SearchBar;
