import React from 'react';
import { string } from 'prop-types';
import VesselMap from '../Map';
import LandingsTable from '../LandingsTable';
import LandingsTableControlls from '../LandingsTableControlls';
import { normalizeCase, normalizeLength, normalizeWeight } from '../../services/TextTools';
import boaticon from './boat.png';

class BoatDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      boat: {
        id: '',
        registrationId: '',
        radioSignalId: '',
        name: '',
        state: '',
        town: '',
        length: '',
        weight: '',
        builtYear: '',
        enginePower: '',
        fishingGear: '',
        image: '',
      },
      landings: [/* {
                town: "",
                state: "",
                landingDate: "",
                totalWeight: 0,
                id: ""
            } */],
      mapData: [],
      pageNo: 1,
      resultCount: 5,
      boatDetailLoaded: false,
      boatOffloadLoaded: false,
      boatDetailError: false,
      boatOffloadError: false,
    };
  }

  async componentDidMount() {
    const { boatname, boatRadio } = this.props;
    const { pageNo, resultCount } = this.state;
    fetch(`http://fangsdata-api.herokuapp.com/api/Boats/registration/${boatname}`)
      .then((res) => res.json())
      .then((res) => {
        if(boatRadio === "" ){
          fetch(`https://fangsdata-api.herokuapp.com/api/maps/boats/radio/${res.radioSignalId}`)
              .then(res => res.json())
              .then(res => {
                if( res[0]['latitude'] !== undefined || res[0]['longitude'] !== undefined )
                this.setState({mapData: res})
              })
              .catch(()=>{}) 
          this.setState({ boat: res, boatDetailLoaded: true });
        }

      })
      .catch(() => this.setState({ boatDetailError: true }));

    fetch(`https://fangsdata-api.herokuapp.com/api/offloads/${boatname}/${resultCount}/${pageNo}`)
      .then((res2) => res2.json())
      .then((res2) => this.setState({ landings: res2, boatOffloadLoaded: true }))
      .catch((() => this.setState({ boatOffloadLoaded: true })));
    if(boatRadio !== ""){
      fetch(`https://fangsdata-api.herokuapp.com/api/maps/boats/radio/${boatRadio}`)
        .then(res => res.json())
        .then(res => this.setState({mapData: res}))
        .catch(()=>{})
      }
    }


  async componentDidUpdate(prevProps, prevState) {
    const { pageNo, resultCount } = this.state;
    const { boatname,boatRadio } = this.props;
    if (pageNo !== prevState.pageNo || resultCount !== prevState.resultCount) {
      this.setState({ boatOffloadLoaded: false, boatDetailError: false, boatOffloadError: false });
      this.setState({ landings: [] });
      fetch(`https://fangsdata-api.herokuapp.com/api/offloads/${boatname}/${resultCount}/${pageNo}`)
        .then((res2) => res2.json())
        .then((res2) => {
          this.setState({ landings: res2, boatOffloadLoaded: true });
        });
    }
    if (boatname !== prevProps.boatname) {
      this.setState({ boatOffloadLoaded: false, boatDetailError: false, boatOffloadError: false });
      fetch(`http://fangsdata-api.herokuapp.com/api/Boats/registration/${boatname}`)
      .then((res) => res.json())
      .then((res) => {
        if(boatRadio === "" ){
          fetch(`https://fangsdata-api.herokuapp.com/api/maps/boats/radio/${res.radioSignalId}`)
              .then(res => res.json())
              .then(res => {
                if( res[0]['latitude'] === undefined && res[0]['longitude'] === undefined )
                this.setState({mapData: res})
              })
              .catch(()=>{}) 
          this.setState({ boat: res, boatDetailLoaded: true });
        }
      })
      .catch(() => this.setState({ boatDetailError: true }));

      fetch(`https://fangsdata-api.herokuapp.com/api/offloads/${boatname}/${resultCount}/${pageNo}`)
        .then((res2) => res2.json())
        .then((res2) => {
          this.setState({ landings: res2, boatOffloadLoaded: true });
        });
    }
  }

  render() {
    const {
      landings,
      pageNo,
      resultCount,
      boatDetailLoaded,
      boatOffloadLoaded,
      boatDetailError,
      boatOffloadError,
      boat,
      mapData
    } = this.state;

    const {
      name,
      state,
      town,
      length,
      weight,
      builtYear,
      enginePower,
      fishingGear,
    } = boat;

    const { boatname } = this.props;

    let cleanMapData = mapData;
    if (mapData === undefined) {
      cleanMapData = [];
    }
    if (mapData === null) {
      cleanMapData = [];
    }
    return (
      <div className="boat-container">
        {!boatDetailError
          ? (
            <>
              { boatDetailLoaded
                ? (
                  <>
                    <img src={boaticon} className="boat-img" alt="boat" />
                    <div className="boat-info">
                      <p className="boat-header">{ name !== '' ? normalizeCase(name) : boatname }</p>
                      <p className="boat-details">

                        { `Lengde: ${normalizeLength(length)}` }
                      </p>
                      <p className="boat-details">
                        { `Vekt: ${normalizeWeight(weight * 1000)}` }
                      </p>
                      <p className="boat-details">
                        { `År bygd: ${builtYear !== 0 ? builtYear : 'ikke registrert'}` }
                      </p>
                      <p className="boat-details">
                        { `Fylke: ${state !== '' ? state : 'ikke registrert'}` }
                      </p>
                      <p className="boat-details">
                        { `Kommune: ${town !== '' ? normalizeCase(town) : 'ikke registrert'}` }
                      </p>
                      <p className="boat-details">
                        { `Motor kraft: ${enginePower !== 0 ? `${enginePower} hp` : 'ikke registrert'}` }
                      </p>
                      <p className="boat-details">

                        { `Redskap: ${fishingGear !== '' ? fishingGear : 'ikke registrer`'}`}
                      </p>
                      <br />
                      { cleanMapData.length !== 0
                        ? (
                          <p className="boat-details">
                            Breddegrad / Lengdegrad:
                            <br />
                            {`${mapData[0].latitude} / ${mapData[0].longitude}`}
                          </p>
                        )
                        : <></>}
                      <br />

                    </div>
                  </>
                )
                : (
                  <div className="loader-container">
                    <div className="placeholder-item" />
                    <div className="placeholder-info-container">
                      <div className="placeholder-item header" />
                      <div className="placeholder-item info" />
                      <div className="placeholder-item info" />
                      <div className="placeholder-item info" />
                      <div className="placeholder-item info" />
                    </div>
                  </div>
                )}
            </>
          )
          : <><p>here was an error</p></>}
        { cleanMapData.length !== 0
          ? (
            <div className="map-container">
              <VesselMap lat={mapData[0].latitude} lng={mapData[0].longitude} />
            </div>
          )
          : <></>}
        <LandingsTable
          landings={landings}
          landingNo={(pageNo - 1) * resultCount}
          boatOffloadLoaded={boatOffloadLoaded}
          boatOffloadError={boatOffloadError}
        />
        <LandingsTableControlls
          nextPage={() => {
            let page = pageNo;
            page += 1;
            this.setState({ pageNo: page });
          }}
          prevPage={() => {
            let page = pageNo;
            if (page > 1) {
              page -= 1;
              this.setState({ pageNo: page });
            }
          }}
          resultNo={(no) => {
            let page = pageNo;
            page = 1;
            this.setState({ resultCount: no, pageNo: page });
          }}
          page={pageNo}
        />
      </div>
    );
  }
}


BoatDetails.propTypes = {
  boatname: string.isRequired,
  boatRadio: string.isRequired
};

BoatDetails.defaultProps = {
  boatRadio: ""
}

export default BoatDetails;
