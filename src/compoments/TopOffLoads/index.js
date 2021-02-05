import React from 'react';
import { getOffloads,getValue } from '../../services/OffloadService';
import OffloadsList from '../OffloadsList';
import FilterContainer from '../FiltersContainer';
import { normalizeMonth,generateObjectFromQueryParameters, generateQueryParamFromObject, translateGroupNames } from '../../services/TextTools';
import LandingsTableControlls from '../LandingsTableControlls';
import LoadingAnimation from '../LoadingAnimation';
import selectionsContext from '../../Context/selectionsContext';


let filterTimeOut;

class TopOffLoads extends React.Component {
  static contextType = selectionsContext;

  constructor(props) {
    super(props);

    const paramsFromQuery = generateObjectFromQueryParameters(props.location.search);
    const today = new Date();
    let month = today.getMonth() + 1;
    const day = today.getDay();
    if(day === 1){
      month -= 1;
    }
    this.state = {
      offLoads: [],
      filter: {
        fishingGear:  paramsFromQuery['redskap'] || [],
        boatLength:   paramsFromQuery['lengde'] || [],
        fishName:     paramsFromQuery['fisketype'] || [],
        month:        paramsFromQuery['maned'] || [month,month],
        year:         paramsFromQuery['ar'] || [],
        landingState: paramsFromQuery['fylke'] || [],
        pageNo:       paramsFromQuery['pageNo'] || [1],
        count:        paramsFromQuery['count'] || [10]
      },
      allFilters: {
        /* eslint-disable */
        fishingGear: [{ title: 'Not', checkState: paramsFromQuery['redskap'] == 'not' || false, value: 'Not' },
          { title: 'Trål', checkState: paramsFromQuery['redskap'] == 'trål' || false, value: 'Trål' },
          { title: 'Pelagisk', checkState: paramsFromQuery['redskap'] == 'pelagisk' || false, value: 'Pelagisk' },
          { title: 'Bur og ruser', checkState: paramsFromQuery['redskap'] == 'bur og ruser' || false, value: 'Bur og ruser' },
          { title: 'Andre redskap', checkState: paramsFromQuery['redskap'] == 'andre redskap' || false, value: 'Andre redskap' },
          { title: 'Krokredskap', checkState: paramsFromQuery['redskap'] == 'krokredskap' || false, value: 'Krokredskap' },
          { title: 'Garn', checkState: paramsFromQuery['redskap'] == 'garn' || false, value: 'Garn' },
          { title: 'Snurrevad', checkState: paramsFromQuery['redskap'] == 'snurrevad' || false, value: 'Snurrevad' },
          { title: 'Oppdrett/uspesifisert', checkState: paramsFromQuery['redskap'] == 'oppdrett/uspesifisert' || false, value: 'Oppdrett/uspesifisert' }],
        boatLength: [{ title: 'under 11m', value: 'under 11m', checkState: paramsFromQuery['lengde'] == 'under 11m' || false },
          { title: '11m - 14,99m', value: '11m - 14,99m', checkState: paramsFromQuery['lengde'] == '11m - 14,99m' || false },
          { title: '15m - 20,99m', value: '15m - 20,99m', checkState: paramsFromQuery['lengde'] == '15m - 20,99m' || false },
          { title: '21m - 27,99m', value: '21m - 27,99m', checkState: paramsFromQuery['lengde'] == '21m - 27,99m' || false },
          { title: '28m og over', value: '28 m og over', checkState: paramsFromQuery['lengde'] == '28 m og over' || false }],
        fishName: [{ title: 'Pelagisk fisk', value: 'Pelagisk fisk', checkState: paramsFromQuery['fisketype'] == 'pelagisk fisk' || false },
          { title: 'Torsk og torskeartet fisk', value: 'Torsk og torskeartet fisk', checkState: paramsFromQuery['fisketype'] == 'torsk og torskeartet fisk' || false },
          { title: 'Flatfisk, annen bunnfisk og dypvannsfisk', value: 'Flatfisk, annen bunnfisk og dypvannsfisk', checkState: paramsFromQuery['fisketype'] == 'flatfisk, annen bunnfisk og dypvannsfisk' ||false },
          { title: 'Bruskfisk (haifisk, skater, rokker og havmus)', value: 'Bruskfisk (haifisk, skater, rokker og havmus)', checkState:paramsFromQuery['fisketype'] == 'bruskfisk (haifisk, skater, rokker og havmus)' || false },
          { title: 'Skalldyr, bløtdyr og pigghuder', value: 'Skalldyr, bløtdyr og pigghuder', checkState:paramsFromQuery['fisketype'] == 'skalldyr, bløtdyr og pigghuder' || false },],
        landingState: [{ title: 'Troms og Finnmark', checkState:paramsFromQuery['fylke'] == 'Troms og Finnmark' || false, value: 'Troms og Finnmark' },
          { title: 'Nordland', checkState: paramsFromQuery['fylke'] == 'nordland' || false, value: 'Nordland' },
          { title: 'Nord-Trøndelag', checkState: paramsFromQuery['fylke'] == 'nord-trøndelag' || false, value: 'Nord-Trøndelag' },
          { title: 'Møre og Romsdal', checkState: paramsFromQuery['fylke'] == 'møre og romsdal' || false, value: '"Møre og Romsdal"' },
          { title: 'Rogaland', checkState: paramsFromQuery['fylke'] == 'rogaland' || false, value: 'Rogaland' },
          { title: 'Vest-Agder', checkState: paramsFromQuery['fylke'] == 'vest-agder' || false, value: 'Vest-Agder' },
          { title: 'Aust-Agder', checkState: paramsFromQuery['fylke'] == 'aust-agder' || false, value: 'Aust-Agder' },
          { title: 'Sør-Trøndelag', checkState: paramsFromQuery['fylke'] == 'sør-trøndelag' || false, value: 'Sør-Trøndelag' },
          { title: 'Hordaland', checkState:paramsFromQuery['fylke'] == 'hordaland' ||  false, value: 'Hordaland' },
          { title: 'Troms', checkState: paramsFromQuery['fylke'] == 'troms' || false, value: 'Troms' },
          { title: 'Finnmark', checkState: paramsFromQuery['fylke'] == 'finnmark' || false, value: 'Finnmark' },
          { title: 'Sogn og Fjordane', checkState: paramsFromQuery['fylke'] == 'sogn og fjordane' || false, value: '"Sogn og Fjordane"' },
          { title: 'unknown', checkState: paramsFromQuery['fylke'] == 'unknown' || false, value: '??' },
          { title: 'Telemark', checkState: paramsFromQuery['fylke'] == 'telemark' || false, value: 'Telemark' },
          { title: 'Østfold', checkState:paramsFromQuery['fylke'] == 'østfold' ||  false, value: 'Østfold' },
          { title: 'Vestfold', checkState:paramsFromQuery['fylke'] == 'vestfold' ||  false, value: 'Vestfold' },
          { title: 'Akershus', checkState:paramsFromQuery['fylke'] == 'akershus' ||  false, value: 'Akershus' },
          { title: 'Oslo', checkState: paramsFromQuery['fylke'] == 'oslo' || false, value: 'Oslo' },
          { title: 'Buskerud', checkState: paramsFromQuery['fylke'] == 'buskerud' || false, value: 'Buskerud' }],
          /* eslint-enable */
      },
      topOffloadsLoaded: false,
      topOfflodError: false,
      selectedMonth: paramsFromQuery['maned'] || [month,month],
      selectedYear: paramsFromQuery['ar'] || [today.getFullYear(),today.getFullYear()],
    };
  }

  async componentDidMount() {

    const {filter} = this.state;
    const {topLandingsPageCount,topLandingsPageNo} = this.context;


    filter['count'] = [topLandingsPageCount];
    filter['pageNo'] = [topLandingsPageNo];

    this.setState(filter);

    Promise.all([
      getOffloads(filter),
      getValue('last_updated')
    ]).then(resp =>{
      this.setState({
        offloads: resp[0],
        upDatedOn: resp[1],        
        topOffloadsLoaded: true,
      });

    })

    this.setState({ offLoads: await getOffloads(filter), topOffloadsLoaded: true});
    this.setState({ upDatedOn: await getValue('last_updated') })
  }

  async inputEvent(event) {
    const { target } = event;
    const { filter, allFilters } = this.state;

    const index = allFilters[target.name].findIndex((value) => value.title === target.id);
    if (index !== -1 && target.type !== 'radio') {
      allFilters[target.name][index].checkState = !allFilters[target.name][index].checkState;
      this.setState({ allFilters, topOffloadsLoaded: false });
    } else if (target.type === 'radio') {
      allFilters[target.name].forEach((item) => {
        if (item.value !== target.value) {
          item.checkState = false;
        } else {
          item.checkState = true;
        }
      });
      this.setState({ allFilters, topOffloadsLoaded: false });
    }

    if (target.type === 'radio') {
      const currState = filter[target.name];
      currState[0] = target.value;
      filter[target.name] = currState;
      this.setState(filter);


      clearTimeout(filterTimeOut);
      filterTimeOut = setTimeout(async () => {
        this.setState({ offLoads: await getOffloads(filter), topOffloadsLoaded: true });
      }, 1000);
    } else if (target.checked) {
      const currState = filter[target.name];
      currState.push(target.value);
      filter[target.name] = currState;
      this.setState(filter);

      clearTimeout(filterTimeOut);
      filterTimeOut = setTimeout(async () => {
        this.setState({ topOffloadsLoaded: false });
        this.setState({ offLoads: await getOffloads(filter), topOffloadsLoaded: true });
      }, 1000);
    } else {
      const currState = filter[target.name];
      const itemIndex = currState.indexOf(target.value);
      currState.splice(itemIndex, 1);
      filter[target.name] = currState;
      this.setState(filter);

      clearTimeout(filterTimeOut);
      filterTimeOut = setTimeout(async () => {
        this.setState({ offLoads: await getOffloads(filter), topOffloadsLoaded: true });
      }, 1000);
    }
    this.GenerateQueryParam();
  }
  GenerateQueryParam(iMonths = false, iYears = false){
    const { allFilters, selectedMonth,selectedYear } = this.state;
    
    let months = iMonths;
    let years = iYears;

    if (months === false){
      months = selectedMonth; 
    }

    if (years === false){
      years = selectedYear; 
    }

    let selected = {};
    Object.keys(allFilters).forEach((keyGroup)=>{
      allFilters[keyGroup].forEach((item)=>{
        if(item.checkState === true){
          if(selected[translateGroupNames(keyGroup)] === undefined){
            selected[translateGroupNames(keyGroup)] = [item['value']];
          }
          else{
            selected[translateGroupNames(keyGroup)].push(item['value']);
          }
        }
      })
    })
    selected['maned'] = months;
    selected['ar'] = years;
    

    this.props.history.push('topoffloads' + generateQueryParamFromObject(selected));
  }

  updateDate(selectedDate, isYearMode = false) {
    const years = [selectedDate.getFullYear(), selectedDate.getFullYear()];
    let months = [1,1];
    if(isYearMode){ 
      months = [1,12];
    }
    else {
      months = [selectedDate.getMonth() + 1, selectedDate.getMonth() + 1];
    }
    const { filter } = this.state;
    filter.month = months;
    filter.year = years;
    this.setState({ 
      filter, offLoads: [],
       topOffloadsLoaded: false,
       selectedMonth: months,
       selectedYear: years, });

    this.GenerateQueryParam(months,years);
    clearTimeout(filterTimeOut);
    filterTimeOut = setTimeout(async () => {
      this.setState({
        offLoads: await getOffloads(filter),

        topOffloadsLoaded: true,
      });
    }, 1000);

  }

  render() {
    const {
      topOffloadsLoaded, 
      topOfflodError, 
      selectedMonth, 
      selectedYear, 
      offLoads, 
      allFilters, 
      filter,
      upDatedOn
    } = this.state;

    const { setTopLandingPageNo, 
            setTopLandingPageCount } = this.context;

    return (
      <div>
        <FilterContainer
          inputEvent={(e) => {
            this.inputEvent(e);
          }}
          updateDate={(d, m) => this.updateDate(d, m)}
          allFilters={allFilters}
        />
        {!topOfflodError
          ? (
            <>
              { topOffloadsLoaded

                ? <OffloadsList
                    offloads={offLoads}
                    pageNo={filter.pageNo[0]}
                    title={`Største landing i ${normalizeMonth(selectedMonth[0])} ${selectedYear[0]}`}
            
                    updatedOn={`Oppdatert ${upDatedOn}`}
                  />
                : <LoadingAnimation rowCount={filter.count[0]}
                containerClass='top-offload-loading-container' /> 
              }
            </>
          )
          : <><p>error Loading toplist</p></>}
            <LandingsTableControlls
              nextPage={async() => {
                let page = filter.pageNo[0];
                page += 1;
                let newFilter = filter;
                newFilter.pageNo = [page];
                setTopLandingPageNo(newFilter.pageNo);
                this.setState({ filter: newFilter, offLoads: await getOffloads(newFilter) });
              }}
              prevPage={ async ()=>{
                let page = filter.pageNo[0];
                if(page > 1 ){
                  page -= 1;
                  let newFilter = filter;
                  newFilter.pageNo = [page];
                  setTopLandingPageNo(newFilter.pageNo);
                  this.setState({ filter: newFilter, offLoads: await getOffloads(newFilter) });
                }
              }}
              resultNo={ async (no)=>{
                let newFilter = filter;
                newFilter.pageNo = [1];
                newFilter.count = [no];
                setTopLandingPageNo(newFilter.pageNo);
                setTopLandingPageCount(no);
                this.setState({ filter: newFilter, offLoads: await getOffloads(newFilter) });
              }}
              page={filter.pageNo[0]}
              defaultPageSize={filter.count[0]}
              pageSizeOptions={[10,25,50]}
            />
      </div>
    );
  }
}

export default TopOffLoads;
