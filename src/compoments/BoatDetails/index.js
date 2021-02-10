import React from 'react';
import { string } from 'prop-types';
import VesselMap from '../Map';
import LandingsTable from '../LandingsTable';
import LandingsTableControlls from '../LandingsTableControlls';
import { normalizeCase, normalizeLength, normalizeWeight,normalizeDateForWeb } from '../../services/TextTools';
import boaticon from './boat.png';
import selectionsContext from '../../Context/selectionsContext';
import LandingsOverView from '../LandingsOverView';
import DatePicker from 'react-datepicker';

class BoatDetails extends React.Component {
  static contextType = selectionsContext;
  constructor(props) {
    super(props);
    const today = new Date();
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
      fromDate: new Date(today.getFullYear(),0), 
      toDate: today
    };
  }

  async componentDidMount() {
    const { boatname, boatRadio } = this.props;
    const { pageNo, resultCount, fromDate, toDate } = this.state;
    const { boatOffloadPageCount,boatOffloadPageNo } = this.context;

    this.setState({
      pageNo: boatOffloadPageNo,
      resultCount: boatOffloadPageCount,
    });

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
    this.updateOffloadList(fromDate, toDate);

    if(boatRadio !== ""){
      fetch(`https://fangsdata-api.herokuapp.com/api/maps/boats/radio/${boatRadio}`)
        .then(res => res.json())
        .then(res => this.setState({mapData: res}))
        .catch(()=>{})
      }
    }


  async componentDidUpdate(prevProps, prevState) {
    const { pageNo, resultCount, fromDate, toDate } = this.state;
    const { boatname,boatRadio } = this.props;
    if (pageNo !== prevState.pageNo || resultCount !== prevState.resultCount) {
      this.updateOffloadList(fromDate, toDate);
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


      this.updateOffloadList(fromDate, toDate);
    }
  }

  updateOffloadList(fromDate, toDate){
    const { boatname } = this.props;
    this.setState({ boatOffloadLoaded: false, boatDetailError: false, boatOffloadError: false });
    this.setState({ landings: [] });
    fetch(`https://fangsdata-api.herokuapp.com/api/offloads/${boatname}/date/${normalizeDateForWeb(fromDate)}/${normalizeDateForWeb(toDate)}`)
    .then((res2) => res2.json())
    .then((res2) => {
      this.setState({ landings: res2, boatOffloadLoaded: true });
    }); 
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
      mapData,
      fromDate,
      toDate,
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
      registrationId,
      radioSignalId
    } = boat;
    
    const { boatname } = this.props;

    const {setBoatOffloadPageNo, setBoatOffloadPageCount} = this.context;

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
                        { `Radiokallesignal: ${radioSignalId}` }
                      </p>
                      <p className="boat-details">
                        { `Registreringsmerke: ${registrationId}` }
                      </p>
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
          registrationId={registrationId}
          landingNo={(pageNo - 1) * resultCount}
          boatOffloadLoaded={boatOffloadLoaded}
          boatOffloadError={boatOffloadError}
        />{false
          ? <LandingsTableControlls
                nextPage={() => {
                  let page = pageNo;
                  page += 1;
                  setBoatOffloadPageNo(page);
                  this.setState({ pageNo: page });
                }}
                prevPage={() => {
                  let page = pageNo;
                  if (page > 1) {
                    page -= 1;
                    setBoatOffloadPageNo(page);
                    this.setState({ pageNo: page });
                  }
                }}
                resultNo={(no) => {
                  let page = pageNo;
                  page = 1;
                  setBoatOffloadPageNo(page);
                  setBoatOffloadPageCount(no);
                  this.setState({ resultCount: no, pageNo: page });
                }}
                page={pageNo}
                defaultPageSize={resultCount}
              />
          :<div className="controls-container">
           <DatePicker
                selected={fromDate}
                dateFormat="MM/yyyy"
                onChange={(date) => {
                  const {  toDate } = this.state;
                  this.setState({fromDate: date});
                  this.updateOffloadList( date, toDate );
                }}
                showMonthYearPicker
                showFullMonthYearPicker
              />
            <DatePicker
                selected={toDate}
                dateFormat="MM/yyyy"
                onChange={(date) => {
                  const { fromDate } = this.state;
                  this.setState({toDate: date});

                  this.updateOffloadList(fromDate, date);
                }}
                showMonthYearPicker
                showFullMonthYearPicker
              />
          </div>

        }

        <LandingsOverView
          data={landings}
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
