import React from 'react';
import { Link } from 'react-router-dom';
import { getOffloads,getValue } from '../../services/OffloadService';
import OffloadsList from '../OffloadsList';
import { normalizeMonth } from '../../services/TextTools';
import FilterCheckBox from '../FilterCheckBox';
import { th } from 'date-fns/locale';

// https://fangsdata-api.herokuapp.com/api/offloads?fishingGear=Garn&Count=5

class FrontPage extends React.Component {
  constructor() {
    super();
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
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
      tableError: false,
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
  ] ) {
    this.setState({
      tableLoaded0: false,
      tableLoaded1: false,
      tableLoaded2: false,
      tableLoaded3: false,
      tableLoaded4: false,
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
    this.populateTables(); 
  }

  async inputEvent(event) {
    const { target } = event;
    const { monthOrYear,year } = this.state;

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
        ]);
      }
      else { // month
        this.populateTables();
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
      tableError,
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

        {!tableError
          ? (
            <>
              { tableLoaded0
                ? (
                  <>
                    <div className="front-list-container">
                      <OffloadsList
                        offloads={offLoads0}
                        title={"Top 10 krokredskap landing i " + normalizeMonth(month)}
                        updatedOn={`Oppdatert ${upDatedOn}`}
                      />
                      <Link to="/topoffloads?redskap=krokredskap"><div className="more-btn">Se Mer</div></Link>
                    </div>
                  </>
                )
                : (
                  <div className="front-loading-container">
                    <div className="offload-header" />
                    <div className="placeholder-item" />
                    <div className="placeholder-item" />
                    <div className="placeholder-item" />
                    <div className="placeholder-item" />
                    <div className="placeholder-item" />
                    <div className="placeholder-item" />
                    <div className="placeholder-item" />
                    <div className="placeholder-item" />
                    <div className="placeholder-item" />
                    <div className="placeholder-item" />
                    <div className="placeholder-item" />
                    <div className="placeholder-item more" />
                  </div>
                )}
            </>
          )
          : <><p>here was an error</p></>}
        {!tableError
          ? (
            <>
              { tableLoaded1
                ? (
                  <>
                    <div className="front-list-container">
                      <OffloadsList
                        offloads={offLoads1}
                        title={"Top 10 trål landing i " +  normalizeMonth(month)}
                        updatedOn={`Oppdatert ${upDatedOn}`}
                      />
                      <Link to="/topoffloads?redskap=trål"><div className="more-btn">Se Mer</div></Link>
                    </div>
                  </>
                )
                : (
                  <div className="front-loading-container">
                    <div className="offload-header" />
                    <div className="placeholder-item" />
                    <div className="placeholder-item" />
                    <div className="placeholder-item" />
                    <div className="placeholder-item" />
                    <div className="placeholder-item" />
                    <div className="placeholder-item" />
                    <div className="placeholder-item" />
                    <div className="placeholder-item" />
                    <div className="placeholder-item" />
                    <div className="placeholder-item" />
                    <div className="placeholder-item" />
                    <div className="placeholder-item more" />
                  </div>
                )}
            </>
          )
          : <><p>here was an error</p></>}
        {!tableError
          ? (
            <>
              { tableLoaded2
                ? (
                  <>
                    <div className="front-list-container">
                      <OffloadsList
                        offloads={offLoads2}
                        title={"Top 10 snurrevad landing i " +  normalizeMonth(month) }
                        updatedOn={`Oppdatert ${upDatedOn}`}
                      />
                      <Link to="/topoffloads?redskap=snurrevad"><div className="more-btn">Se Mer</div></Link>
                    </div>
                  </>
                )
                : (
                  <div className="front-loading-container">
                    <div className="offload-header" />
                    <div className="placeholder-item" />
                    <div className="placeholder-item" />
                    <div className="placeholder-item" />
                    <div className="placeholder-item" />
                    <div className="placeholder-item" />
                    <div className="placeholder-item" />
                    <div className="placeholder-item" />
                    <div className="placeholder-item" />
                    <div className="placeholder-item" />
                    <div className="placeholder-item" />
                    <div className="placeholder-item" />
                    <div className="placeholder-item more" />
                  </div>
                )}
            </>
          )
          : <><p>here was an error</p></>}
        {!tableError
          ? (
            <>
              { tableLoaded3
                ? (
                  <>
                    <div className="front-list-container">
                      <OffloadsList
                        offloads={offLoads3}
                        title={"Top 10 garn landing i " + normalizeMonth(month) }
                        updatedOn={`Oppdatert ${upDatedOn}`}
                      />
                      <Link to="/topoffloads?redskap=garn"><div className="more-btn">Se Mer</div></Link>
                    </div>
                  </>
                )
                : (
                  <div className="front-loading-container">
                    <div className="offload-header" />
                    <div className="placeholder-item" />
                    <div className="placeholder-item" />
                    <div className="placeholder-item" />
                    <div className="placeholder-item" />
                    <div className="placeholder-item" />
                    <div className="placeholder-item" />
                    <div className="placeholder-item" />
                    <div className="placeholder-item" />
                    <div className="placeholder-item" />
                    <div className="placeholder-item" />
                    <div className="placeholder-item" />
                    <div className="placeholder-item more" />
                  </div>
                )}
            </>
          )
          : <><p>here was an error</p></>}
                  {!tableError
          ? (
            <>
              { tableLoaded4
                ? (
                  <>
                    <div className="front-list-container">
                      <OffloadsList
                        offloads={offLoads4}
                        title={"Top 10 pelagisk landing i " + normalizeMonth(month) }
                        updatedOn={`Oppdatert ${upDatedOn}`}
                      />
                      <Link to="/topoffloads?redskap=pelagisk"><div className="more-btn">Se Mer</div></Link>
                    </div>
                  </>
                )
                : (
                  <div className="front-loading-container">
                    <div className="offload-header" />
                    <div className="placeholder-item" />
                    <div className="placeholder-item" />
                    <div className="placeholder-item" />
                    <div className="placeholder-item" />
                    <div className="placeholder-item" />
                    <div className="placeholder-item" />
                    <div className="placeholder-item" />
                    <div className="placeholder-item" />
                    <div className="placeholder-item" />
                    <div className="placeholder-item" />
                    <div className="placeholder-item" />
                    <div className="placeholder-item more" />
                  </div>
                )}
            </>
          )
          : <><p>here was an error</p></>}

      </div>
      </>
    );
  }
}

export default FrontPage;
