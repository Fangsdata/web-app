import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes, {
  string, arrayOf, shape, bool, number,
} from 'prop-types';
import { normalizeWeight, normalizeDate, normalizeCase } from '../../services/TextTools';

const LandingsTable = ({
  landings,boatId, landingNo, boatOffloadLoaded, boatOffloadError,
}) => (
  <div className="offload-table landing-table">
    <div className="offload-header">Siste lendinger</div>
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
              <Link to={`/offload/${landing.LandingDate}/${boatId} `}>
                <div className="offload-row">
                  <p className="offload-index">
                    {i + 1 + landingNo}
                    .
                  </p>
                  <p className="offload-name">{normalizeDate(landing.LandingDate)}</p>
                  <p className="offload-group">{normalizeCase(landing.Town)}</p>
                  <p className="offload-group">{landing.State}</p>
                  <p className="offload-group">{normalizeWeight(landing.TotalWeight)}</p>
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
        <a>
        <div className="offload-row">
            <p className="offload-index"> <Link to= {`/offloads/${boatId}`} ><div style={{marginTop:'0px', marginLeft:'1rem'}} className="more-btn">ser mer</div></Link> </p>
            <p className="offload-name"></p>
            <p className="offload-group"></p>
            <p className="offload-group"> Total : </p>
            <p className="offload-group">{normalizeWeight( landings.reduce((a,b)=>(b.TotalWeight + a),0))}</p>
          </div>
          </a>
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
  boatId: string.isRequired,
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
