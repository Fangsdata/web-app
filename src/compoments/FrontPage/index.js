import React from 'react';
import selectMonthContext from '../../Context/selectionsContext'; 
import { Link } from 'react-router-dom';
import { getOffloads,getValue } from '../../services/OffloadService';
import OffloadsList from '../OffloadsList';
import { norweganQueryParam } from '../../services/TextTools';
import FilterCheckBox from '../FilterCheckBox';
import LoadingAnimation from '../LoadingAnimation';

class FrontPage extends React.Component {
  static contextType = selectMonthContext;

  constructor() {
    super();
    const today = new Date();
    let month = today.getMonth() + 1;
    const year = today.getFullYear();
    const day = today.getDate();
    if (day === 1) {
      month -= 1;
    }
    this.state = {
      offloads: [
        {
          data: [],
          loaded: false,
          title: "Top 10 Fersk krokredskap landing",
          link: "",
        },
        {
          data: [],
          loaded: false,
          title: "Top 10 Frozen krokredskap landing",
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
    };
  }
/**
 * [
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
        }
  ]
 * @param {} data 
 */
  populateTables2 ( data ){
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
             link: norweganQueryParam(data[i]['query'])
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
    const { isMonth,consivertionMethood } = this.context;
    if(isMonth !== null){
      this.setState({
        monthOrYear: [ { title: 'måned', checkState: isMonth, value: 'month' }, { title: 'år', checkState: !isMonth, value: 'year' } ],
      });
    if(consivertionMethood != null){
      this.setState({
        preservationMethod:[
          { title: 'all', checkState: consivertionMethood === 'all', value: 'all' }, 
          { title: 'frozen', checkState: consivertionMethood === 'frozen', value: 'frozen' },
          { title: 'fersk', checkState: consivertionMethood === 'fresh', value: 'fresh' },
         ]

      })
    }
      let timeFrameSelector = [`${month},${month}`];
      if (!isMonth){
        timeFrameSelector = [`1,12`];
      }

      let consivertionMethoodSelector = [consivertionMethood];
      if (consivertionMethood === 'frozen' ){
        consivertionMethoodSelector = ['Frossen'];
      }
      else if(consivertionMethood === 'fresh' ){
        consivertionMethoodSelector = ['Fersk/ukonservert,Iset'];
      }
      else if ( consivertionMethood === 'all' ){
        consivertionMethoodSelector = [];
      }


      this.populateTables2(
        [
          {
            query: { count: [10], fishingGear: ['Krokredskap'], 
            preservationMethod: consivertionMethoodSelector, 
            month: timeFrameSelector,year:[`${year},${year}`] },
            title:  "Top 10 krokredskap landing",
          },
          {
            query: { count: [10], fishingGear: ['Trål'],
            preservationMethod: consivertionMethoodSelector,
            month: timeFrameSelector,year:[`${year},${year}`] },
            title:  "Top 10 trål landing ",
          },
          { 
            query: { count: [10], fishingGear: ['Snurrevad'],
            preservationMethod: consivertionMethoodSelector,
            month: timeFrameSelector,year:[`${year},${year}`] },
            title:  "Top 10 snurrevad landing" ,
          },
          { 
            query: { count: [10], fishingGear: ['Garn'],
            preservationMethod: consivertionMethoodSelector,
            month: timeFrameSelector,year:[`${year},${year}`] },
            title:  "Top 10 garn landing",
          },
          { 
            query: { count: [10], fishingGear: ['Pelagisk'],
            preservationMethod: consivertionMethoodSelector,
            month: timeFrameSelector,year:[`${year},${year}`] },
            title:  "Top 10 pelagisk landing",
          }]); 
    }
  }

  inputEvent(event, radioGroup) {
    const { target } = event;
    const { monthOrYear, preservationMethod, year, month } = this.state;
    const { setIsMonth,setConsivertionMethood, isMonth, consivertionMethood } = this.context;

    
    if(radioGroup === 'monthOrYear'){
      setIsMonth(!monthOrYear[0].checkState);

      monthOrYear.forEach((item) => {
        if (item.value !== target.value) {
          item.checkState = false;
        } else {
          item.checkState = true;
        }
        this.setState(monthOrYear);
      });
    }
    else if (radioGroup === 'consivertionMethood') {
      
      setConsivertionMethood(target.value);
    
      preservationMethod.forEach((item)=>{
          if (item.value !== target.value) {
            item.checkState = false;
          } else {
            item.checkState = true;
          }
          this.setState(preservationMethod);
        })
      }
      

      let timeFrameSelector = [];
      if (isMonth){
        timeFrameSelector = [`${month},${month}`]; 
      }
      else {
        timeFrameSelector = [`1,12`];
      }

      if (target.value === "year" ){
        timeFrameSelector = [`1,12`];
      }
      else if (target.value === "month" ){
        timeFrameSelector = [`${month},${month}`]; 
      }

      let consivertionMethoodSelector = [consivertionMethood];
      if (consivertionMethood === 'frozen'  ){
        consivertionMethoodSelector = ['Frossen'];
      }
      else if(consivertionMethood === 'fresh' ){
        consivertionMethoodSelector = ['Fersk/ukonservert,Iset'];
      }
      else if ( consivertionMethood === 'all' ){
        consivertionMethoodSelector = [];
      }

      if (target.value === 'frozen'  ){
        consivertionMethoodSelector = ['Frossen'];
      }
      else if(target.value === 'fresh' ){
        consivertionMethoodSelector = ['Fersk/ukonservert,Iset'];
      }
      else if ( target.value === 'all' ){
        consivertionMethoodSelector = [];
      }

      this.populateTables2 (
      [
        {
          query: {  
            count: [10], fishingGear: ['Krokredskap'],
            preservationMethod: consivertionMethoodSelector,
            month: timeFrameSelector,year:[`${year},${year}`] },
          title: "Top 10 krokredskap landing",
        },
        {
          query: { 
            count: [10], fishingGear: ['Trål'], 
            preservationMethod: consivertionMethoodSelector, 
            month: timeFrameSelector,year:[`${year},${year}`] },
          title:  "Top 10 trål landing ",
        },
        { 
          query: { 
            count: [10], fishingGear: ['Snurrevad'], 
            preservationMethod: consivertionMethoodSelector, 
            month: timeFrameSelector,year:[`${year},${year}`] },
          title:  "Top 10 snurrevad landing"
        },
        { 
          query: { 
            count: [10], fishingGear: ['Garn'],
            preservationMethod: consivertionMethoodSelector, 
            month: timeFrameSelector,year:[`${year},${year}`] },
          title: "Top 10 garn landing",
        },
        { 
          query: { count: [10], fishingGear: ['Pelagisk'],preservationMethod: consivertionMethoodSelector, month: timeFrameSelector,year:[`${year},${year}`] },
          title: "Top 10 pelagisk landing",
        }]);
  }
  render() {
    const {
      offloads,
      upDatedOn,
      monthOrYear,
      preservationMethod 
    } = this.state;
    return (
       <>
       <div style={{
         display: "flex",
         flexDirection: "column",
         justifyContent: "center"
        }}>
          <div style={{ height:'1.5rem'}}>
          <FilterCheckBox
            key="monthOrYear"
            items={monthOrYear}
            group="monthOrYear"
            inputEvent={(e)=>{
              this.inputEvent(e, 'monthOrYear');

            }}
            checkBoxType="radio"
            cssFilterContainer = 'front-list-time-period'
          />
          </div>
          <div style={{ height:'0em'}}>
          <FilterCheckBox
            key="consivertionMethood"
            items={preservationMethod}
            group="consivertionMethood"
            inputEvent={(e)=>{
              this.inputEvent(e, 'consivertionMethood');

            }}
            checkBoxType="radio"
            cssFilterContainer = 'front-list-time-period'
          />
          </div>
        </div>
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
    :<LoadingAnimation rowCount={loadAnimationRows}/>
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
