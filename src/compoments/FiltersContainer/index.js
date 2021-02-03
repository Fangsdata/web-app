import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import PropTypes, { func } from 'prop-types';
import FilterCheckBox from '../FilterCheckBox';
import downArrow from './arrow_drop_down-24px.svg';
import upArrow from './arrow_drop_up-24px.svg';
import filterIcon from './filter_list-24px.svg';
import 'react-datepicker/dist/react-datepicker.css';


const FiltersContainer = ({ inputEvent, allFilters, updateDate }) => {
  const [showFishingGear, setShowFishingGear] = useState(true);
  const [showBoatLength, setShowBoatLength] = useState(true);
  const [showFishName, setShowFishName] = useState(true);
  const [showLandingState, setShowLandingState] = useState(true);
  const [monthOrYear, setMonthOrYear] = useState('month');
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div>
      <div className="filter-all-filters">
        <div className="f-header">
          <p className="f-header-title">
            <img className="filter-icon" src={filterIcon} alt="" />
            Filtre:
          </p>
        </div>
        <div className="dropdowns-container">

          {showFishingGear
            ? (
              <div className="filter-dropdown closed">
                <p className="f-headers" onClick={() => setShowFishingGear(!showFishingGear)}>
                  Redskap
                  <img className="arrow-icon" src={downArrow} alt="" />
                </p>
              </div>
            )
            : (
              <div className="filter-dropdown">
                <p className="f-headers" onClick={() => setShowFishingGear(!showFishingGear)}>
                  Redskap
                  <img className="arrow-icon" src={upArrow} alt="" />
                </p>
                <FilterCheckBox
                  key="fishingGear"
                  items={allFilters.fishingGear}
                  group="fishingGear"
                  inputEvent={inputEvent}
                  checkBoxType="checkbox"
                />
              </div>
            )}
          {showBoatLength
            ? (
              <div className="filter-dropdown closed">
                <p className="f-headers" onClick={() => setShowBoatLength(!showBoatLength)}>
                  Båt lengde
                  <img className="arrow-icon" src={downArrow} alt="" />
                </p>
              </div>
            )
            : (
              <div className="filter-dropdown">
                <p className="f-headers" onClick={() => setShowBoatLength(!showBoatLength)}>
                  Båt lengde
                  <img className="arrow-icon" src={upArrow} alt="" />
                </p>
                <FilterCheckBox
                  key="boatLength"
                  items={allFilters.boatLength}
                  group="boatLength"
                  inputEvent={inputEvent}
                  checkBoxType="radio"
                />
              </div>
            )}
          {showFishName
            ? (
              <div className="filter-dropdown closed">
                <p className="f-headers" onClick={() => setShowFishName(!showFishName)}>
                  Fisketype
                  <img className="arrow-icon" src={downArrow} alt="" />
                </p>
              </div>
            )
            : (
              <div className="filter-dropdown">
                <p className="f-headers" onClick={() => setShowFishName(!showFishName)}>
                  Fisketype
                  <img className="arrow-icon" src={upArrow} alt="" />
                </p>
                <FilterCheckBox
                  key="fishName"
                  items={allFilters.fishName}
                  group="fishName"
                  inputEvent={inputEvent}
                  checkBoxType="checkbox"
                />
                
              </div>
            )}
          {showLandingState
            ? (
              <div className="filter-dropdown closed">
                <p className="f-headers" onClick={() => setShowLandingState(!showLandingState)}>
                  Fylke
                  <img className="arrow-icon" src={downArrow} alt="" />
                </p>
              </div>
            )
            : (
              <div className="filter-dropdown">
                <p className="f-headers" onClick={() => setShowLandingState(!showLandingState)}>
                  Fylke
                  <img className="arrow-icon" src={upArrow} alt="" />
                </p>
                <FilterCheckBox
                  key="landingState"
                  items={allFilters.landingState}
                  group="landingState"
                  inputEvent={inputEvent}
                  checkBoxType="checkbox"
                />
              </div>
            )}
           <div className="filter-dropdown closed">

            { monthOrYear === 'month'
              ? <DatePicker
                  selected={selectedDate}
                  onChange={(date) => {
                    setSelectedDate(date);
                    updateDate(date,true);
                  }}
                  dateFormat="MM/yyyy"
                  showMonthYearPicker
                  showFullMonthYearPicker
                />
              : <DatePicker
                selected={selectedDate}
                onChange={(date) => {
                  setSelectedDate(date);
                  updateDate(date,false);
                }}
                dateFormat="yyyy"
                showYearPicker
              />
            }
              </div>
        </div>
      </div>
    </div>
  );
};

FiltersContainer.propTypes = {
  inputEvent: func.isRequired,
  allFilters: PropTypes.object.isRequired,
  updateDate: func.isRequired,
};


export default FiltersContainer;
