import React, { useState, useEffect, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import icon from './search-24px.svg';
import { OFFLOADAPI } from '../../Constants';

let timeOut;
const SearchBar = () => {
  const [search, updateSearch] = useState('');
  const [foundBoats, setFoundBoats] = useState([]);
  const [foundOwner, setFoundOwner] = useState([]);
  const [isSearchOpen, setSearchStatus] = useState(false);
  
  const UpdateQuickSearch = (searchTerm) => {
    if (searchTerm.length > 2) {
      fetch(`${OFFLOADAPI}/search/boats/${searchTerm}`)
        .then((res) => res.json())
        .then((res) => {
          if(res == null){
            setFoundBoats([]);
          }
          else{
            setFoundBoats(res);
          }
        });

      fetch(`${OFFLOADAPI}/search/owners/${searchTerm}`)
        .then((res) => res.json())
        .then((res) => {
          if(res == null){
            setFoundOwner([]);
          }
          else{
            setFoundOwner(res);
          }
        });

    } else {
      setFoundBoats([]);
      setFoundOwner([]);
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
        { foundBoats.length !== 0 && !isSearchOpen || foundOwner.length !== 0 && !isSearchOpen 
          ? (
            <div className="quick-search">
              <div className="line" />
              <p className="search-result" style={{fontWeight: 'bold'}}  >Båter</p>
              <>{ foundBoats.map((boat) => (
                <QuickSearchItem
                  searchItemTitle={`${boat.Name} - ${boat.RegistrationID}`}
                  id={boat.ID}
                  ClickedEvent={() => {
                    updateSearch('');
                    setFoundBoats([]);
                    setFoundOwner([]);
                  }}
                  
                />
              )) }</>
              <br></br>
              <p className="search-result" style={{fontWeight: 'bold'}} >Fiskefirma</p>
              { foundOwner.map((owner) => (
                <QuickSearchItem
                  searchItemTitle={`${owner.Fartøyeier}`}
                  id={owner.EierID}
                  ClickedEvent={() => {
                    updateSearch('');
                    setFoundBoats([]);
                    setFoundOwner([]);
                  }
                }
                />)) }
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
