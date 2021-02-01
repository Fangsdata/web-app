import React from 'react';
import { Link } from 'react-router-dom';
import { getOffloads,getValue } from '../../services/OffloadService';
import OffloadsList from '../OffloadsList';
import { normalizeMonth } from '../../services/TextTools';
import FilterCheckBox from '../FilterCheckBox';

// https://fangsdata-api.herokuapp.com/api/offloads?fishingGear=Garn&Count=5

class FrontPage extends React.Component {
  constructor() {
    super();
    const today = new Date();
    let month = today.getMonth() + 1;
    const year = today.getFullYear();
    const day = today.getDay();
    // if it is the first of the month then there is no data to look at for that month 
    // then i will look at the month before
    if (day === 1) {
      month -= 1;
    }

    this.state = {
      offLoads0: [],
      offLoads1: [],
      offLoads2: [],
      offLoads3: [],
      offLoads4: [],
      tableLoaded0: false,
      tableLoaded1: false,
      tableLoaded2: false,
      tableLoaded3: false,
      tableLoaded4: false,
      tableTitle0: "Top 10 krokredskap landing i " + normalizeMonth(month),
      tableTitle1: "Top 10 trål landing i " + normalizeMonth(month),
      tableTitle2: "Top 10 snurrevad landing i " + normalizeMonth(month),
      tableTitle3: "Top 10 garn landing i " + normalizeMonth(month),
      tableTitle4: "Top 10 pelagisk landing i " + normalizeMonth(month),
      month: month,
      year: year,
      monthOrYear:[ { title: 'måned', checkState: true, value: 'month' }, { title: 'år', checkState: false, value: 'year' }]
    };
  }

  populateTables ( tables = [
    { count: [10], fishingGear: ['Krokredskap'] },
    { count: [10], fishingGear: ['Trål'] },
    { count: [10], fishingGear: ['Snurrevad'] },
    { count: [10], fishingGear: ['Garn'] },
    { count: [10], fishingGear: ['Pelagisk'] },
  ],
  titles = [
     "Top 10 krokredskap landing",
     "Top 10 trål landing",
     "Top 10 snurrevad landing", 
     "Top 10 garn landing",
     "Top 10 pelagisk landing",
  ] ) {
    this.setState({
      tableLoaded0: false,
      tableLoaded1: false,
      tableLoaded2: false,
      tableLoaded3: false,
      tableLoaded4: false,
      tableTitle0: titles[0],
      tableTitle1: titles[1],
      tableTitle2: titles[2],
      tableTitle3: titles[3],
      tableTitle4: titles[4], 
    })
    Promise.all([
      getOffloads(tables[0]),
      getOffloads(tables[1]),
      getOffloads(tables[2]),
      getOffloads(tables[3]),
      getOffloads(tables[4]),
      getValue('last_updated')
    ]).then((val => {
      this.setState({
        offLoads0: val[0],
        offLoads1: val[1],
        offLoads2: val[2],
        offLoads3: val[3],
        offLoads4: val[4],
        upDatedOn: val[5],
        tableLoaded0: true,
        tableLoaded1: true,
        tableLoaded2: true,
        tableLoaded3: true,
        tableLoaded4: true,

      })
    }))

  }

  async componentDidMount() {
    const { month,year } = this.state;
    this.populateTables(
      [
        { count: [10], fishingGear: ['Krokredskap'], month: [`${month},${month}`],year:[`${year},${year}`] },
        { count: [10], fishingGear: ['Trål'], month: [`${month},${month}`],year:[`${year},${year}`] },
        { count: [10], fishingGear: ['Snurrevad'], month: [`${month},${month}`],year:[`${year},${year}`] },
        { count: [10], fishingGear: ['Garn'], month: [`${month},${month}`],year:[`${year},${year}`] },
        { count: [10], fishingGear: ['Pelagisk'], month: [`${month},${month}`],year:[`${year},${year}`] },
      ],
      [
        "Top 10 krokredskap landing i " + normalizeMonth(month),
        "Top 10 trål landing i " + normalizeMonth(month),
        "Top 10 snurrevad landing i " + normalizeMonth(month),
        "Top 10 garn landing i " + normalizeMonth(month),
        "Top 10 pelagisk landing i " + normalizeMonth(month),
     ]   
    ); 
  }

  async inputEvent(event) {
    const { target } = event;
    const { monthOrYear, year, month } = this.state;

    monthOrYear.forEach((item) => {
      if (item.value !== target.value) {
        item.checkState = false;
      } else {
        item.checkState = true;

      }
      this.setState(monthOrYear);
      if (target.value === "year"){
        this.populateTables ( [
          { count: [10], fishingGear: ['Krokredskap'], year:[`${year},${year}`], month:['1,12']},
          { count: [10], fishingGear: ['Trål'], year:[`${year},${year}`], month:['1,12'] },
          { count: [10], fishingGear: ['Snurrevad'], year:[`${year},${year}`], month:['1,12'] },
          { count: [10], fishingGear: ['Garn'], year:[`${year},${year}`], month:['1,12'] },
          { count: [10], fishingGear: ['Pelagisk'], year:[`${year},${year}`], month:['1,12'] },
        ],
        [
          "Top 10 krokredskap landing i " + year,
          "Top 10 trål landing i " + year,
          "Top 10 snurrevad landing i " + year,
          "Top 10 garn landing i " + year,
          "Top 10 pelagisk landing i " + year,
       ] );
      }
      else { // month
        this.populateTables(
          [
            { count: [10], fishingGear: ['Krokredskap'], month: [`${month},${month}`] },
            { count: [10], fishingGear: ['Trål'], month: [`${month},${month}`] },
            { count: [10], fishingGear: ['Snurrevad'], month: [`${month},${month}`] },
            { count: [10], fishingGear: ['Garn'], month: [`${month},${month}`] },
            { count: [10], fishingGear: ['Pelagisk'], month: [`${month},${month}`] },
          ],
          [
            "Top 10 krokredskap landing i " + normalizeMonth(month),
            "Top 10 trål landing i " + normalizeMonth(month),
            "Top 10 snurrevad landing i " + normalizeMonth(month),
            "Top 10 garn landing i " + normalizeMonth(month),
            "Top 10 pelagisk landing i " + normalizeMonth(month),
         ]
        );
      }
    });
  }

  render() {
    const {
      offLoads0,
      offLoads1,
      offLoads2,
      offLoads3,
      offLoads4,
      tableLoaded0,
      tableLoaded1,
      tableLoaded2,
      tableLoaded3,
      tableLoaded4,
      tableTitle0,
      tableTitle1,
      tableTitle2,
      tableTitle3,
      tableTitle4,
      month,
      upDatedOn,
      monthOrYear 
    } = this.state;
    return (
      <>
        <FilterCheckBox
          key="monthOrYear"
          items={monthOrYear}
          group="monthOrYear"
          inputEvent={(e)=>{ this.inputEvent(e)}}
          checkBoxType="radio"
          cssFilterContainer = 'front-list-time-period'
        />
      <div className="front-page">
      <FrontPageList
          tableLoaded = {tableLoaded0}
          offladItems= {offLoads0}
          headerText={tableTitle0}
          fooderText={`Oppdatert ${upDatedOn}`}
          btnLink={'/topoffloads?redskap=krokredskap'} 
        />
        <FrontPageList
          tableLoaded = {tableLoaded1}
          offladItems= {offLoads1}
          headerText={tableTitle1}
          fooderText={`Oppdatert ${upDatedOn}`}
          btnLink={'/topoffloads?redskap=trål'} 
        />
        <FrontPageList
          tableLoaded = {tableLoaded2}
          offladItems= {offLoads2}
          headerText={tableTitle2 }
          fooderText={`Oppdatert ${upDatedOn}`}
          btnLink={'/topoffloads?redskap=snurrevad'} 
        />
        <FrontPageList
          tableLoaded = {tableLoaded3}
          offladItems= {offLoads3}
          headerText={tableTitle3}
          fooderText={`Oppdatert ${upDatedOn}`}
          btnLink={'/topoffloads?redskap=garn'} 
        />
        <FrontPageList
          tableLoaded = {tableLoaded4}
          offladItems= {offLoads4}
          headerText={tableTitle4}
          fooderText={`Oppdatert ${upDatedOn}`}
          btnLink={'/topoffloads?redskap=pelagisk'} 
        />
      </div>
      </>
    );
  }
}

const FrontPageList = (({tableLoaded, offladItems, headerText, fooderText, btnLink, btnText, loadAnimationRows})=>{

  const loadingAnimations = ((totalRows)=>{
    let rows = [];
    for (let i = 0; i < totalRows; i++) {
      rows.push(<div className="placeholder-item" />);
    } 

    return rows;
  })
  return (tableLoaded
    ?
      <div className="front-list-container">
        <OffloadsList
          offloads={ offladItems }
          title={ headerText }
          updatedOn={ fooderText }
        />
        <Link to={btnLink}><div className="more-btn">{btnText}</div></Link>
      </div>
    :(
      <div className="front-loading-container">
        <div className="offload-header" />
        {loadingAnimations(loadAnimationRows)}
        <div className="placeholder-item more" />
      </div>
    )
  );
})
FrontPageList.defaultProps = {
  tableLoaded:false,
  headerText:'',
  fooderText:'',
  btnLink:'/',
  btnText:'Se mer',
  loadAnimationRows:'11'
}

export default FrontPage;
