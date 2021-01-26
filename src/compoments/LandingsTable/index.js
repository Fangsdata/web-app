import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes, {
  string, arrayOf, shape, bool, number,
} from 'prop-types';
import { normalizeWeight, normalizeDate, normalizeCase } from '../../services/TextTools';

const LandingsTable = ({
  landings, landingNo, boatOffloadLoaded, boatOffloadError,
}) => (
  <div className="offload-table landing-table">
    <div className="offload-header">Siste landinger</div>
    {/* <td>Dato</td>
      <td>Kommune</td>
      <td>Fylke</td>
      <td>Total vekt</td> */}
    <div className="offload-row">
      <p className="offload-index">#</p>
      <p className="offload-name">Dato</p>
      <p className="offload-group">Kommune</p>
      <p className="offload-group">Fylke</p>
      <p className="offload-group">Total vekt</p>
    </div>
    { !boatOffloadError
      ? (
        <>
          { boatOffloadLoaded
            ? landings.map((landing, i) => (
              <Link to={`/offloads/${landing.id}`}>
                <div className="offload-row">
                  <p className="offload-index">
                    {i + 1 + landingNo}
                    .
                  </p>
                  <p className="offload-name">{normalizeDate(landing.landingDate)}</p>
                  <p className="offload-group">{normalizeCase(landing.town)}</p>
                  <p className="offload-group">{landing.state}</p>
                  <p className="offload-group">{normalizeWeight(landing.totalWeight)}</p>
                </div>
              </Link>
            ))
            : (
              <div className="loader">
                Loading
              </div>
            )}
        </>
      )
      : <p>there was an error here</p>}
  </div>
);

LandingsTable.propTypes = {
  landings: arrayOf(shape({
    id: number.isRequired,
    landingDate: PropTypes.instanceOf(Date).isRequired,
    town: string.isRequired,
    state: string.isRequired,
    totalWeight: number.isRequired,
  }).isRequired).isRequired,
  landingNo: number,
  boatOffloadLoaded: bool,
  boatOffloadError: bool,
};

LandingsTable.defaultProps = {
  boatOffloadLoaded: true,
  boatOffloadError: false,
  landingNo: 0,
};

export default LandingsTable;
