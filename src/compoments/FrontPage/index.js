import React from 'react';
import { Link } from 'react-router-dom';
import { getOffloads,getValue } from '../../services/OffloadService';
import OffloadsList from '../OffloadsList';
import { normalizeMonth,generateQueryParamFromObject } from '../../services/TextTools';
import FilterCheckBox from '../FilterCheckBox';

// https://fangsdata-api.herokuapp.com/api/offloads?fishingGear=Garn&Count=5

class FrontPage extends React.Component {
  constructor() {
    super();
    const today = new Date();
    let month = today.getMonth() + 1;
    const year = today.getFullYear();
    const day = today.getDay();
    if (day === 1) {
      month -= 1;
    }

    this.state = {
      offloads: [
        {
          data: [],
          loaded: false,
          title: "Top 10 krokredskap landing",
          link: "",
        },
        {
          data: [],
          loaded: false,
          title: "Top 10 snurrevad landing",
          link: "",
        },
        {
          data: [],
          loaded: false,
          title: "Top 10 krokredskap landing",
          link: "",
        },
        {
          data: [],
          loaded: false,
          title: "Top 10 garn landing",
          link: "",
        },
        {
          data: [],
          loaded: false,
          title: "Top 10 pelagisk landing",
          link: "",
        },
      ],
      month: month,
      year: year,
      monthOrYear:[ { title: 'måned', checkState: true, value: 'month' }, { title: 'år', checkState: false, value: 'year' }]
    };
  }


  populateTables2 ( 
    data = [
      { 
        query: { count: [10], fishingGear: ['Krokredskap'] },
        title: "Top 10 krokredskap landing" 
      },
      { 
        query: {  count: [10], fishingGear: ['Trål'] },
        title: "Top 10 trål landing" 
      },
      { 
        query: { count: [10], fishingGear: ['Snurrevad'] },
        title: "Top 10 snurrevad landing" 
      },
      { 
        query: { count: [10], fishingGear: ['Garn'] },
        title: "Top 10 garn landing" 
      },
      { 
        query: { count: [10], fishingGear: ['Pelagisk']},
        title: "Top 10 Pelagisk landing" 
      },
    ]
  ){
    const {offloads} =this.state;

    // Initilze a empty list 
    let emptyList = [];
    data.forEach(() => {
      emptyList.push({loaded:false})

    });
    this.setState ({offloads: emptyList} );


    Promise.all(
      data.map( async (item)=>{ return getOffloads(item['query'])}),
     ).then(resps => {
       let updated = [];
       resps.forEach((resp,i) => {
         updated.push( {
           loaded:true,
           title: data[i]['title'],
           data:resp,
           link: generateQueryParamFromObject(data[i]['query'])
         })
       });
       this.setState ({offloads: updated} );
     });
    getValue('last_updated').then(resp => {
      this.setState({upDatedOn:resp})
    });
  }

  async componentDidMount() {
    const { month,year } = this.state;
    this.populateTables2(
      [
        {
          query: {  count: [10], fishingGear: ['Krokredskap'], month: [`${month},${month}`],year:[`${year},${year}`] },
          title:  "Top 10 krokredskap landing i " + normalizeMonth(month),
        },
        {
          query: { count: [10], fishingGear: ['Trål'], month: [`${month},${month}`],year:[`${year},${year}`] },
          title:  "Top 10 trål landing i " + normalizeMonth(month),
        },
        { 
          query: { count: [10], fishingGear: ['Snurrevad'], month: [`${month},${month}`],year:[`${year},${year}`] },
          title:  "Top 10 snurrevad landing i " + normalizeMonth(month),
        },
        { 
          query: { count: [10], fishingGear: ['Garn'], month: [`${month},${month}`],year:[`${year},${year}`] },
          title:  "Top 10 garn landing i " + normalizeMonth(month),
        },
        { 
          query: { count: [10], fishingGear: ['Pelagisk'], month: [`${month},${month}`],year:[`${year},${year}`] },
          title:  "Top 10 pelagisk landing i " + normalizeMonth(month),
        },
      ],
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
        this.populateTables2 (
        [
          {
            query: {  count: [10], fishingGear: ['Krokredskap'], month: [`1,12`],year:[`${year},${year}`] },
            title: "Top 10 krokredskap landing i " + year,
          },
          {
            query: { count: [10], fishingGear: ['Trål'], month: [`1,12`],year:[`${year},${year}`] },
            title:  "Top 10 trål landing i " + year,
          },
          { 
            query: { count: [10], fishingGear: ['Snurrevad'], month: [`1,12`],year:[`${year},${year}`] },
            title:  "Top 10 snurrevad landing i " + year
          },
          { 
            query: { count: [10], fishingGear: ['Garn'], month: [`1,12`],year:[`${year},${year}`] },
            title: "Top 10 garn landing i " + year,
          },
          { 
            query: { count: [10], fishingGear: ['Pelagisk'], month: [`1,12`],year:[`${year},${year}`] },
            title: "Top 10 pelagisk landing i " + year,
          }]);
      }
      else { // month
        this.populateTables2(
          [
            {
              query: {  count: [10], fishingGear: ['Krokredskap'], month: [`${month},${month}`],year:[`${year},${year}`] },
              title:  "Top 10 krokredskap landing i " + normalizeMonth(month),
            },
            {
              query: { count: [10], fishingGear: ['Trål'], month: [`${month},${month}`],year:[`${year},${year}`] },
              title:  "Top 10 trål landing i " + normalizeMonth(month),
            },
            { 
              query: { count: [10], fishingGear: ['Snurrevad'], month: [`${month},${month}`],year:[`${year},${year}`] },
              title:  "Top 10 snurrevad landing i " + normalizeMonth(month),
            },
            { 
              query: { count: [10], fishingGear: ['Garn'], month: [`${month},${month}`],year:[`${year},${year}`] },
              title:  "Top 10 garn landing i " + normalizeMonth(month),
            },
            { 
              query: { count: [10], fishingGear: ['Pelagisk'], month: [`${month},${month}`],year:[`${year},${year}`] },
              title:  "Top 10 pelagisk landing i " + normalizeMonth(month),
            },
          ]
        );
      }
    });
  }

  render() {
    const {
      offloads,
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
        {offloads.map( offload => (
          <FrontPageList 
            tableLoaded = {offload.loaded}
            offladItems= {offload.data}
            headerText={offload.title}
            fooderText={`Oppdatert ${upDatedOn}`}
            btnLink={`/topoffloads?${offload.link}`}  
          />
        ))}

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
