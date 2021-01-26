import React, { useEffect, useState } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import PropTypes, { func } from 'prop-types';
import MapContainer from '../Map';
import { normalizeCase, normalizeWeight, normalizeDate } from '../../services/TextTools';
import Anchor from './anchor.svg';
import filterImg from './filter_list-24px.svg';
import UpArrowImg from './arrow_drop_up-24px.svg';
import DownArrowImg from './arrow_drop_down-24px.svg';

const OffloadDetails = ({ offloadId }) => {
  const [chartData, setChartData] = useState(
    {
      labels: ['NON'],
      datasets: [{
        label: '',
        backgroundColor: ['#2B59C3'],
        data: [1],
      }],
    },
  );
  const [pieSize, setPieSize] = useState(500);
  const [filteredData, setFilteredData] = useState();
  const [offloadLoading, setOffloadLoad] = useState(false);
  const [offloadError, setOffloadError] = useState(false);
  const [offloadDetail, setOffloadDetails] = useState({});
  const [showEdit, setShowEdit] = useState(false);
  const [colums, setColums] = useState({
    art: true,
    Produkttilstand :true,
    Kvalitet: true,
    Anvendelse : false,
    Landingsmåte: false,
    Konserveringsmåte: false,
    Rundvekt: true
  })

  const generateColors = (size) => {
    const colorExample = ['#2B59C3', '#B7DFB3', '#DCB8B8', '#DCD8B8'];
    const retData = [];
    for (let i = 0; i < size; i++) {
      retData.push(colorExample[i % colorExample.length]);
    }
    return retData;
  };
  const CreatePieChartDataset = (data, dataInputCutoff) => {
    
    // ATH skítamix til að geta notað FilterOffloadDataSet
    data = FilterOffloadDataSet(data.map((item)=>{ return { type: item.label, weight: item.value } }), {
      art: true,
      Produkttilstand :false,
      Kvalitet: false,
      Anvendelse : false,
      Landingsmåte: false,
      Konserveringsmåte: false,
      Rundvekt: true
    });
    data = data.map((item)=>{ return { label: item.type, value: item.weight }})


    const totalWeight = data.reduce((a,b)=>{return { value: a.value + b.value} });
    data = data
      .sort((a,b)=>{ 
        return b.value - a.value })
      .filter((item)=> {
        if(item.value / totalWeight.value > dataInputCutoff){
          return item;
        }
      });
    
    const rest = { label: 'resten',  value: totalWeight.value - data.reduce((a,b)=>{return { value: a.value + b.value}}).value};
    if(rest.value !== 0) data.push(rest);
    const pieData = {
      labels: data.map((d) => d.label),
      datasets: [{
        label: 'fish dataset',
        backgroundColor: generateColors(data.length),
        data: data.map((d) => d.value),
      }],
    };
    setChartData(pieData);
  };

  const FilterOffloadDataSet = (fish, colums) => {

    // Merge same colums
    let tempFish = fish.map((item)=>{
      let tempFish = {};
      if(colums["art"]){ tempFish["type"] = item.type; }
      if(colums["Produkttilstand"]){ tempFish["condition"] = item.condition; }
      if(colums["Kvalitet"]){ tempFish["quality"] = item.quality; }
      if(colums["Anvendelse"]){ tempFish["application"] = item.application; }
      if(colums["Landingsmåte"]){ tempFish["packaging"] = item.packaging; }
      if(colums["Konserveringsmåte"]){ tempFish["preservation"] = item.preservation; }
      tempFish["weight"] = item.weight
      return tempFish;
    });

    let mergedFish = [];

    for(let i = 0; i < tempFish.length; i++){
      let found = false;
      for(let j = 0; j < mergedFish.length; j++){
        let noWeightTemp = tempFish[i];
        let noWeightMerged = mergedFish[j];
        let stubitPointersMerged = mergedFish[j].weight;
        let stubitPointersTemp = tempFish[i].weight;
        noWeightMerged.weight = 0; 
        noWeightTemp.weight = 0;
        if( JSON.stringify(noWeightTemp) === JSON.stringify(noWeightMerged)){
          mergedFish[j].weight = stubitPointersTemp + stubitPointersMerged; 
          found = true;
        }
        tempFish[i].weight = stubitPointersTemp;
        if(mergedFish[j].weight === 0){ 
          mergedFish[j].weight = stubitPointersMerged }
      }
      if(!found){
        mergedFish.push(tempFish[i]);
      }
    }

    return mergedFish;
  }

  const UpdateData = (fishData) => {
    const filteredData = FilterOffloadDataSet(fishData, colums);
    setFilteredData(filteredData);
    const lable = Object.getOwnPropertyNames(filteredData[0])[0];
    const data = filteredData.map((item) => {
      const rObj = {
        label: item[lable],
        value: item.weight,
      }
      return rObj;
    });

    CreatePieChartDataset(data, 0.015);
  }

  useEffect(() => {
    if(window.innerWidth < 540){
      setColums({
        art: true,
        Produkttilstand :false,
        Kvalitet: false,
        Anvendelse : false,
        Landingsmåte: false,
        Konserveringsmåte: false,
        Rundvekt: true
      });
      setPieSize(window.innerWidth * 0.9);
    }
    setOffloadLoad(false);
    fetch(`https://fangsdata-api.herokuapp.com/api/offloads/details/${offloadId}`)
      .then((res) => res.json())
      .then((json) => {
        setOffloadDetails(json);
        UpdateData(json.fish);
        setOffloadLoad(true);
      })
      .catch(() => {
        setOffloadError(true);
      });
  }, []);

  return (
    <div className="boat-container landing">
      { !offloadError
        ? (
          <>
            {' '}
            { offloadLoading
              ? (
                <>
                  <div className="info-wrapper">
                    <img src={Anchor} className="anchor-img" alt="boat" />
                    <div className="landing-info-container">
                      <div className="landings-header">{`${normalizeCase(offloadDetail.town)} i ${offloadDetail.state}`}</div>

                      <Link
                        to={`/boats/${offloadDetail.boat.registration_id}`}
                      >
                        { `${normalizeCase(offloadDetail.boat.name)} - ${offloadDetail.boat.registration_id} `}
                      </Link>
                      <p>
                        {`Redskap : ${offloadDetail.boat.fishingGear}`}
                      </p>
                      <p>
                        {`Landins dato : ${normalizeDate(offloadDetail.landingDate)}`}
                      </p>
                    </div>
                  </div>
                  <div className="map-container">
                    <MapContainer
                      lat={offloadDetail.mapData[0].latitude}
                      lng={offloadDetail.mapData[0].longitude}
                    />
                  </div>
                  <div className="landing-table-container">
                    {!showEdit
                      ?<div className="offload-edit closed" onClick={()=>setShowEdit(!showEdit)}>
                        <div>
                          <img src={filterImg} alt="edit"/>
                          <img className="offload-arrow" src={DownArrowImg} alt="arrow"/>
                        </div>
                      </div>
                      :<div className="offload-edit open" ><div onClick={()=>setShowEdit(!showEdit)}><img src={filterImg} alt="edit"/><img className="offload-arrow" src={UpArrowImg} alt="arrow"/></div>
                       <Edit items={colums} 
                       inputEvent={(e)=>{
                         let newColums = colums;
                         newColums[e] = !newColums[e];
                         setColums(newColums);
                         UpdateData(offloadDetail.fish);
                       }}/></div>
                    }
                    <LandingsTable
                      totalWeight={offloadDetail.totalWeight}
                      fish={filteredData}
                      headers={colums}
                    />
                  </div>
                  
                  <div className="pie-chart">
                    <Pie
                      data={chartData}
                      legend={{ display: true, position: 'left' }}
                      redraw
                      width={pieSize}
                      height={pieSize}
                    />
                  </div>
                </>
              )
              : (
                <div className="loader-container">
                  <div className="placeholder-info-container landings">
                    <div className="placeholder-item header" />
                    <div className="placeholder-item info" />
                    <div className="placeholder-item info" />
                    <div className="placeholder-item info" />
                    <div className="placeholder-item info" />
                  </div>
                  <div className="placeholder-item mapload" />
                  <div className="loader-container"><div className="loader" /></div>
                </div>
              )}
          </>
        )
        : (
          <>
            <Redirect to="/404" />
          </>
        )}
    </div>
  );
};

OffloadDetails.propTypes = {
  offloadId: PropTypes.number.isRequired,
};

class Edit extends React.Component {

  constructor(props) {
    super(props);
    const {items} = this.props;
    this.state = {
      items: items
    };
  }
  render() {
    const {inputEvent} = this.props;
    const {items} = this.state;
    return (
      <>
        {Object.keys(items).map((item)=>(
          <div className="offload-edit-item">
            <input
              className="checkbox"
              type="checkbox"
              name="filters"
              id={item}
              value={item}
              onChange={()=>{
                inputEvent(item);
                let newItems = items;
                if(newItems[item]){
                  newItems[item] = true;
                }
                else{
                  newItems[item] = false;
                }
                this.setState({items: newItems})
              }}
              checked={items[item]}
            />
            <label htmlFor={item}>{item}</label>
          </div>
        ))}
      </>);
  }
}

Edit.propTypes = {
  items: PropTypes.object,
  inputEvent: func
};

const LandingsTable = (({headers, fish, totalWeight })=>{

  const offloadWidthIndex = () => {
    let i = 0;
    Object.keys(headers).map((head) => { if (headers[head]) i++ })
    return i;
  }
  return( <table className="landing-table detail">
  <tr>
    <th className="landing-table-header" colSpan="7">Landing Detaljer</th>
  </tr>
  <tr>
  { Object.keys(headers).map((head)=>(
    <>
      {headers[head]
      ?<td>{head}</td>
      :<></>}
    </>
  ))}
  </tr>
  {
    fish.map((fish, i) => (
      <tr key={i}>
        {headers["art"] ?<td>{fish.type}</td> :<></>}
        {headers["Produkttilstand"] ?<td>{fish.condition}</td>: <></>}
        {headers["Kvalitet"] ?<td>{fish.quality}</td>: <></>}
        {headers["Anvendelse"] ?<td>{fish.application}</td>: <></>}
        {headers["Landingsmåte"] ?<td>{normalizeCase(fish.packaging)}</td>: <></>}
        {headers["Konserveringsmåte"] ?<td>{fish.preservation}</td>: <></>}
        {headers["Rundvekt"] ?<td>{normalizeWeight(fish.weight)}</td>: <></>}
      </tr>
    ))
  }
  <tr>
    { offloadWidthIndex() !== 1
   ?<>
      <td colSpan={ offloadWidthIndex() - 1 }>Total Rundvekt</td>
      <td>{normalizeWeight(totalWeight)}</td>
    </>
    :<td>Total Rundvekt {normalizeWeight(totalWeight)}</td>}
  </tr>
</table>)
});

export default OffloadDetails;
