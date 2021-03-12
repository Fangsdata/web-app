import React from 'react';
import { string } from 'prop-types';
import VesselMap from '../Map';
import LandingsTable from '../LandingsTable';
import LandingsTableControlls from '../LandingsTableControlls';
import { 
  normalizeCase,
  normalizeLength,
  normalizeWeight,
  normalizeDateForWeb, 
  normalizeDate
} from '../../services/TextTools';
import {
  getBoatById,
  getBoatLocation,
  getBoatNameHistory,
  getBoatOffladsTimeframe,
  getBoatsOwners
} from '../../services/OffloadService';
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
      toDate: today,
      today: today,
      nameHistory: [],
      ownerHistory: [],
    };
  }

  async componentDidMount() {
    const { boatname } = this.props;
    const { pageNo, resultCount, fromDate, toDate } = this.state;
    const { boatOffloadPageCount,boatOffloadPageNo } = this.context;

    this.setState({
      pageNo: boatOffloadPageNo,
      resultCount: boatOffloadPageCount,
    });
    this.getBoatDetails(boatname);
    this.updateOffloadList(fromDate, toDate);
    }


  async componentDidUpdate(prevProps, prevState) {
    const { pageNo, resultCount, fromDate, toDate } = this.state;
    const { boatname } = this.props;
    if (pageNo !== prevState.pageNo || resultCount !== prevState.resultCount) {
      this.updateOffloadList(fromDate, toDate);
    }
    if (boatname !== prevProps.boatname) {
      this.getBoatDetails(boatname);
      this.updateOffloadList(fromDate, toDate);
    }
  }

  getBoatDetails(boatname){
    this.setState({ boatOffloadLoaded: false, boatDetailError: false, boatOffloadError: false, mapData: [] });
    getBoatById(boatname)
    .then((boat)=>{
      this.setState({boat: boat, boatDetailLoaded: true});
        getBoatLocation(boat.RadioSignalID)
          .then(map => {
            if( map !== [] ||
                map[0]['latitude'] !== undefined ||
                map[0]['longitude'] !== undefined ){
              this.setState({mapData: map}); 
            }
          })
    })
    .catch(() => this.setState({ boatDetailError: true }));
    getBoatNameHistory(boatname)
    .then((names)=>{
      this.setState({nameHistory : names});
    })
    getBoatsOwners(boatname)
    .then((history)=>{
      this.setState({ownerHistory : history});
    })

  }

  updateOffloadList(fromDate, toDate){
    const { boatname } = this.props;
    this.setState({ boatOffloadLoaded: false, boatDetailError: false, boatOffloadError: false });
    this.setState({ landings: [] });
    console.log("from",fromDate);
    console.log("TO",toDate);
    console.log("bn",boatname);

    getBoatOffladsTimeframe(  boatname, normalizeDateForWeb(fromDate), normalizeDateForWeb(toDate))
      .then(landings => {
        console.log("landin",landings)
        if(landings === null){
          this.setState({ landings: [], boatOffloadLoaded: true })
        }
        else{
          this.setState({ landings: landings, boatOffloadLoaded: true })
        }

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
      today,
      nameHistory,
      ownerHistory
    } = this.state;
    const {
      Name,
      State,
      Town,
      Length,
      Weight,
      BuiltYear,
      EnginePower,
      FishingGear,
      RegistrationID,
      RadioSignalID,
      ID
    } = boat;
    console.log("owner ", ownerHistory)
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
                      <p className="boat-header">{ Name !== '' ? normalizeCase(Name) : boatname }</p>
                      { ownerHistory.length === 0
                        ? <></>
                      :<p className="boat-details"> Eieren: <a href={`/owner/${ownerHistory[0].ID}`}>
                          {`${normalizeCase(ownerHistory[0].Name)}`}
                        </a>
                      </p>}
                      <p className="boat-details">
                        { `Radiokallesignal: ${RadioSignalID}` }
                      </p>
                      <p className="boat-details">
                        { `Registreringsmerke: ${RegistrationID}` }
                      </p>
                      <p className="boat-details">
                        { `Lengde: ${normalizeLength(Length)}` }
                      </p>
                      <p className="boat-details">
                        { `Vekt: ${normalizeWeight(Weight * 1000)}` }
                      </p>
                      <p className="boat-details">
                        { `År bygd: ${BuiltYear !== 0 ? BuiltYear : 'ikke registrert'}` }
                      </p>
                      <p className="boat-details">
                        { `Fylke: ${State !== '' ? State : 'ikke registrert'}` }
                      </p>
                      <p className="boat-details">
                        { `Kommune: ${Town !== '' ? normalizeCase(Town) : 'ikke registrert'}` }
                      </p>
                      <p className="boat-details">
                        { `Motor kraft: ${EnginePower !== 0 ? `${EnginePower} hp` : 'ikke registrert'}` }
                      </p>
                      <p className="boat-details">
                        { `Redskap: ${FishingGear !== '' ? FishingGear : 'ikke registrer`'}`}
                      </p>
                      <br />
                      { cleanMapData.length !== 0
                        ? (
                          <p className="boat-details">
                            Breddegrad / Lengdegrad:
                            <br />
                            {`${mapData[0].latitude} ° / ${mapData[0].longitude} °`}
                          </p>
                        )
                        : <></>}
                      <br />
                      { nameHistory[1] !== undefined
                      ? <><p className="boat-details">Eldre navn: </p>
                      {nameHistory.map(({boatName,boatNameChangedDate})=>(<p className="boat-details" >{normalizeDate(boatNameChangedDate)} - {normalizeCase(boatName)}</p>))}</>
                      :<></>
                      }
                    <br/>
                    { ownerHistory[1] !== undefined
                      ? <><p className="boat-details">Tidligere eiere: </p>
                        {ownerHistory.map((owner)=>(
                          <p className="boat-details" >{owner.Year} - 
                            <a href={`/owner/${owner.ID}`}> {normalizeCase(owner.Name)}
                            </a>
                           </p>))}</>
                      :<></>
                      }

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
              <VesselMap mapData={[[mapData[0].latitude,mapData[0].longitude]] }/>
            </div>
          )
          : <></>}

            <LandingsOverView
            data={landings}
            graphTitle={"Siste landings"}
            graphHeight={ 350 } 
            graphWidth={ 750 }/>
        <div className="controls-container-date">
           <DatePicker
                selected={fromDate}
                onChange={(date) => {
                  const { toDate } = this.state;
                  this.setState({fromDate: date});
                  this.updateOffloadList( date, toDate );
                }}
                dateFormat="MM/yyyy"
                minDate={new Date( 2000, 0 )}
                maxDate={today}
                showMonthYearPicker
                showYearArrows
                showFullMonthYearPicker
              />
            <DatePicker
                selected={toDate}
                onChange={(date) => {
                  const { fromDate } = this.state;
                  date.setDate(0);
                  date.setMonth(date.getMonth() + 1 );

                  this.setState({toDate: date});
                  this.updateOffloadList(fromDate, date);
                }}
                dateFormat="MM/yyyy"
                minDate={new Date( 2000, 0 )}
                maxDate={ new Date(today.getFullYear(), today.getMonth()+1)}
                showMonthYearPicker
                showYearArrows
                showFullMonthYearPicker
              />
          </div>

        <LandingsTable
          landings={landings}
          boatId={ID}
          landingNo={(pageNo - 1) * resultCount}
          boatOffloadLoaded={boatOffloadLoaded}
          boatOffloadError={boatOffloadError}
        />
      
        
        
        {false // Depricated code 
          ?<LandingsTableControlls
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
          :<></>
        }
      </div>
    );
  }
}


BoatDetails.propTypes = {
  boatname: string.isRequired,
};

BoatDetails.defaultProps = {
}

export default BoatDetails;
