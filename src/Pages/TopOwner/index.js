import React,{useState,useEffect} from 'react'
import FiltersContainer from '../../compoments/FiltersContainer2';
import LoadingAnimation from '../../compoments/LoadingAnimation';
import downArrow from './arrow_drop_down-24px.svg';
import upArrow from './arrow_drop_up-24px.svg';
import FilterCheckBox from '../../compoments/FilterCheckBox';
import {getOwners,getValue,getFilter} from '../../services/OffloadService';
import ResultTable from '../../compoments/ResultTable';
import {normalizeCase, normalizeWeight} from '../../services/TextTools';
import {UpdateRadioButtonSelect, UpdateCheckBoxSelect} from '../../services/filtersService';

import DatePicker from 'react-datepicker';

function TopOwner() {

    const [ownerList, setownerList] = useState([]);
    const [updatedOn, setupdatedOn] = useState('');

    const [selectedFilters, setSelectedFilters] = useState({
        fromdate: ["2021-1-1"],
        todate: ["2021-12-30"]
    });

    const [stateFilter, setStateFilter] = useState([
        {title:"Alt",           value:"0000,9999", checkState:true},
        {title:"Oslo",          value:"0000,1299",checkState:false},
        {title:"Nordland",      value:"9400,9499",checkState:false},
        {title:"Finnmark",      value:"9500,9999",checkState:false},
    ]);
    
    const [fishingGearFilter, setFishingGearFilter] = useState([]);


    const [monthOrYear, setMonthOrYear] = useState([
        { title: 'måned', checkState: true, value: 'month' },
        { title: 'år', checkState: false, value: 'year' }]);
    const [selectedDate, setSelectedDate] = useState(new Date());

    useEffect(() => {
        Promise.all([
            getOwners(),
            getValue('last_updated'),
            getFilter('fishinggear')
          ]).then(resp => {
            let owners = resp[0].map(({
                EierID,
                Fartøyeier,
                Rundvekt,
                Poststed,
                Båt
            }) => ({
                rows: {
                    Navn : normalizeCase(Fartøyeier),
                    Kommune : normalizeCase(Poststed),
                    Båt,
                    'Total Vekt' : normalizeWeight(Rundvekt),
                },
                link: `/owner/${EierID}`
            }));

            let fishingGear= resp[2].map(({FishingGearGroup}) =>({
                title: FishingGearGroup,
                value: FishingGearGroup,
                checkState: false
            }));

            setFishingGearFilter(fishingGear);
            setownerList(owners);
            setupdatedOn(resp[1]);

        })
    }, []);

    const updateSelectedList = () => {
        getOwners(selectedFilters).then(resp => {
            const owners = resp.map(({
                EierID,
                Fartøyeier,
                Rundvekt,
                Poststed,
                Båt
            }) => ({
                rows: {
                    Navn : normalizeCase(Fartøyeier),
                    Kommune : normalizeCase(Poststed),
                    Båt,
                    'Total Vekt' : normalizeWeight(Rundvekt),
                },
                link: `/owner/${EierID}`
            }))
            setownerList(owners);
        })


    }

    const updateFilters = (newFilters) => {

        setSelectedFilters(newFilters);
        updateSelectedList();
    } 

    const FilterService = (e, selectedName, filter, setFilter, updateButtonFunc) => {
        const sel = updateButtonFunc(e, filter,setFilter);

        let newSelectedFilter = selectedFilters;

        console.log(Array.isArray(sel.selected))
        if(Array.isArray(sel.selected)){
            newSelectedFilter[selectedName] = sel.selected.map( i => i.value) 
        }
        else {
            newSelectedFilter[selectedName] = [sel.selected.value];
        }
        updateFilters(newSelectedFilter)
    }
    return (
        <div>
            <h1>Dette er en eksperimentell funksjon, og dataene her kan være feil!</h1>
            <FiltersContainer>
                <Filter filterName="Fylke">
                    <FilterCheckBox
                        key="state"
                        items={stateFilter}
                        group="state"
                        inputEvent={e=> {
                            FilterService(e, 'state', stateFilter,setStateFilter, UpdateRadioButtonSelect);
                        }}
                        checkBoxType="radio" />
                </Filter>
                <Filter filterName="Redskap">
                    <FilterCheckBox
                        inputEvent={ e => {
                            FilterService(e, 'fishingGear', fishingGearFilter, setFishingGearFilter, UpdateCheckBoxSelect);
                        }}
                        items={fishingGearFilter}
                        key="fishingGear"
                        group="fishingGear"
                    />
                </Filter>
               <Filter filterName="Dato">
                    <FilterCheckBox
                            key="monthOrYear"
                            items={monthOrYear}
                            group="monthOrYear"
                            inputEvent={(e)=>{UpdateRadioButtonSelect(e,monthOrYear, setMonthOrYear);}}
                            checkBoxType="radio"
                            cssFilterContainer = '' />
                            { monthOrYear[0].checkState
                                ? <DatePicker
                                selected={selectedDate}
                                onChange={(date) => {
                                    setSelectedDate(date);
                                    let newFilters = selectedFilters;
                                    newFilters['fromdate'] = [`${date.getFullYear()}-${date.getMonth()}-01`];
                                    newFilters['todate'] = [`${date.getFullYear()}-${date.getMonth()}-31`];
                                    updateFilters(newFilters);
                                }}
                                dateFormat="MM/yyyy"
                                showMonthYearPicker
                                showFullMonthYearPicker
                                />
                            : <DatePicker
                                selected={selectedDate}
                                onChange={(date) => {
                                    setSelectedDate(date);
                                    let newFilters = selectedFilters;
                                    newFilters['fromdate'] = [`${date.getFullYear()}-01-01`];
                                    newFilters['todate'] = [`${date.getFullYear()}-12-31`];
                                    updateFilters(newFilters);
                                }}
                                dateFormat="yyyy"
                                showYearPicker
                            />
                            } 
                        </Filter>
            </FiltersContainer>
            { ownerList.length !== 0
            ? <ResultTable
                title={"Topp fiskefirma"}
                headers={["Navn", "Kommune", "Båter", "Total vekt"]}
                items={ownerList}
                tag={`Oppdatert ${updatedOn}`}
            />
            : <LoadingAnimation rowCount={20} 
            containerClass='top-offload-loading-container'/>
            }
        </div>
    )
}

function Filter({children, filterName, inputEvent, type, data, group}){

    const [hidden, sethidden] = useState(true);

    return (<>{hidden
        ?<div className="filter-dropdown closed">
            <p className="f-headers" onClick={() => sethidden(!hidden)}>
                {filterName}
                <img className="arrow-icon" src={downArrow} alt="" />
            </p>
      </div>
     :<div className="filter-dropdown">
        <p className="f-headers" onClick={() => sethidden(!hidden)}>
            {filterName}
            <img className="arrow-icon" src={upArrow} alt="" />
        </p> {children}

   </div>
    }</>)
}


export default TopOwner