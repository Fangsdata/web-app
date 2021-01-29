import React from 'react';
import { Link } from 'react-router-dom';
import { getOffloads,getValue } from '../../services/OffloadService';
import OffloadsList from '../OffloadsList';
import { normalizeMonth } from '../../services/TextTools';
import { th } from 'date-fns/locale';

// https://fangsdata-api.herokuapp.com/api/offloads?fishingGear=Garn&Count=5

class FrontPage extends React.Component {
  constructor() {
    super();
    const today = new Date();
    const month = today.getMonth() + 1;
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
    };
  }


  async componentDidMount() {

    Promise.all([
      getOffloads({ count: [10], fishingGear: ['Krokredskap'] }),
      getOffloads({ count: [10], fishingGear: ['Trål'] }),
      getOffloads({ count: [10], fishingGear: ['Snurrevad'] }),
      getOffloads({ count: [10], fishingGear: ['Garn'] }),
      getOffloads({ count: [10], fishingGear: ['Pelagisk'] }),
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

   /* this.setState({
      offLoads0:
          await getOffloads({ count: [10], fishingGear: ['Krokredskap'] }),
      tableLoaded0: true,
      offLoads1: await getOffloads({ count: [10], fishingGear: ['Trål'] }),
      tableLoaded1: true,
      upDatedOn: await getValue('last_updated'),
    });
    this.setState({
      offLoads2: await getOffloads({ count: [10], fishingGear: ['Snurrevad'] }),
      tableLoaded2: true,
      offLoads3: await getOffloads({ count: [10], fishingGear: ['Garn'] }),
      tableLoaded3: true,
    });

    this.setState({
      offLoads4: await getOffloads({ count: [10], fishingGear: ['Pelagisk'] }),
      tableLoaded4: true,
    });*/
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
      upDatedOn
    } = this.state;
    return (
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
    );
  }
}

export default FrontPage;
