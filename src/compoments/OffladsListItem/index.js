import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes, { number } from 'prop-types';
import { normalizeWeight, normalizeLength, shortinString } from '../../services/TextTools';

const OffloadListItem = ({ item, index }) => (
  <Link className="offload-link" to={`/boats/${item.ID}`}>
    <div className="offload-row">
      <p className="offload-index">{index}</p>
      <p className="offload-name">
        {item.BoatName ? item.BoatName : item.BoatRegistrationID}
      </p>
      <p className="offload-group">
        {shortinString(item.FishingGear,11)}
      </p>
      <p className="offload-group">
        {`${normalizeLength(item.BoatLength)}`}
      </p>
      <p className="offload-group">
        {normalizeWeight(item.TotalWeight)}
      </p>
    </div>
  </Link>
);

OffloadListItem.propTypes = {
  item: PropTypes.shape({
    Avrage: PropTypes.number,
    FishingGear: PropTypes.string,
    BoatImage: PropTypes.string,
    BoatLandingState: PropTypes.string,
    BoatLandingTown: PropTypes.string,
    BoatLength: PropTypes.number,
    BoatName: PropTypes.string,
    BoatNationality: PropTypes.string,
    BoatRadioSignalID: PropTypes.string,
    BoatRegistrationID: PropTypes.string,
    ID: PropTypes.number,
    LargestLanding: PropTypes.number,
    Smallest: PropTypes.number,
    State: PropTypes.string,
    TotalWeight: PropTypes.number,
    Town: PropTypes.string,
    Trips: PropTypes.number,
  }).isRequired,
  index: number.isRequired,
};

export default OffloadListItem;
