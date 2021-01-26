import React from 'react';
import PropTypes, { number } from 'prop-types';
import OffladsListItem from '../OffladsListItem';


const OffladsList = ({ offloads, title,pageNo }) => (
  <div className="offload-table">
    <div className="offload-header">{title}</div>
    <OffladsListItem
      item={{
        boatName: 'Navn',
        boatFishingGear: 'Redskap',
        boatLength: 'Båt lengde',
        totalWeight: 'Total vekt',
      }}
      index="#"
    />

    { offloads.map((item, index) => (
      <OffladsListItem
        key={item.boatRegistrationId}
        item={item}
        index={(index + 1) + (pageNo *  offloads.length) - offloads.length}
      />
    ))}
  </div>
);

OffladsList.propTypes = {
  offloads: PropTypes.arrayOf(PropTypes.shape({
    avrage: PropTypes.number,
    boatFishingGear: PropTypes.string,
    boatImage: PropTypes.string,
    boatLandingState: PropTypes.string,
    boatLandingTown: PropTypes.string,
    boatLength: PropTypes.number,
    boatName: PropTypes.string,
    boatNationality: PropTypes.string,
    boatRadioSignalId: PropTypes.string,
    boatRegistrationId: PropTypes.string,
    id: PropTypes.number,
    largestLanding: PropTypes.number,
    smallest: PropTypes.number,
    state: PropTypes.string,
    totalWeight: PropTypes.number,
    town: PropTypes.string,
    trips: PropTypes.number,
  })),
  title: PropTypes.string,
  pageNo: number
};

OffladsList.defaultProps = {
  title: '',
  offloads: [],
  pageNo: 1
};


export default OffladsList;
