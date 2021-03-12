import React from 'react';
import PropTypes, { number } from 'prop-types';
import OffladsListItem from '../OffladsListItem';


const OffladsList = ({ offloads, title,pageNo, updatedOn }) => (
  <div className="offload-table">
    <div className="offload-header">{title}</div>
    <OffladsListItem
      item={{
        BoatName: 'Navn',
        FishingGear: 'Redskap',
        BoatLength: 'Båt lengde',
        TotalWeight: 'Total vekt',
      }}
      index="#"
    />

    { offloads.map((item, index) => (
      <OffladsListItem
        key={item.id}
        item={item}
        index={(index + 1) + (pageNo *  offloads.length) - offloads.length}
      />
    ))
    }
    <div className="offload-updated-time"><p>{updatedOn}</p></div>
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
  updatedOn: PropTypes.string,
  pageNo: number
};

OffladsList.defaultProps = {
  title: '',
  offloads: [],
  pageNo: 1,
  updatedOn: '',
};


export default OffladsList;
