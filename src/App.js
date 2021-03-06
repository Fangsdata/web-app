import React, { useEffect,useState, useMemo } from 'react';
import { Switch, Route, Redirect,useLocation } from 'react-router-dom';
import NavigationBar from './compoments/NavigationBar';
import TopOffloads from './compoments/TopOffLoads';
import Container from './compoments/Container';
import BoatDetails from './compoments/BoatDetails';
import OffloadBoatDetails from './compoments/OffloadBoatDetails';
import Contact from './compoments/Contact';
import About from './compoments/About';
import Search from './compoments/Search';
import OffloadDetails from './compoments/OffloadDetails';
import NotFound from './compoments/NotFound';
import FrontPage from './compoments/FrontPage';
import Footer from './compoments/Footer';
import reactGa from 'react-ga';
import {GOOGLE_ANALITIC_STRING} from './Constants';
import selectionsContext from './Context/selectionsContext';

import OwnerDetails from './Pages/OwnerDetails';
import TopOwner from './Pages/TopOwner';



function App() {
  const location = useLocation();

  useEffect(()=>{
    reactGa.initialize(GOOGLE_ANALITIC_STRING);
  },[])

  useEffect(()=>{
    reactGa.pageview(location.pathname + location.search); 
  },[location]);

  const [isMonth,               setIsMonth] = useState(true);
  const [boatOffloadPageNo,     setBoatOffloadPageNo] = useState(1);
  const [boatOffloadPageCount,  setBoatOffloadPageCount] = useState(5);
  const [topLandingsPageNo,     setTopLandingPageNo] = useState(1);
  const [topLandingsPageCount,  setTopLandingPageCount] = useState(10);
  const [consivertionMethood,   setConsivertionMethood] = useState('all');
   
  const value = useMemo(()=>({
    isMonth,              setIsMonth,
    boatOffloadPageNo,    setBoatOffloadPageNo,
    boatOffloadPageCount, setBoatOffloadPageCount,
    topLandingsPageNo,    setTopLandingPageNo,
    topLandingsPageCount, setTopLandingPageCount,
    consivertionMethood,   setConsivertionMethood,
  }),[
    isMonth,              setIsMonth,
    boatOffloadPageNo,    setBoatOffloadPageNo,
    boatOffloadPageCount, setBoatOffloadPageCount,
    topLandingsPageNo,    setTopLandingPageNo,
    topLandingsPageCount, setTopLandingPageCount,
    consivertionMethood,   setConsivertionMethood
  ])

  return (
    <div className="App">
      <NavigationBar />
      <Container>
              <selectionsContext.Provider value={value}>
            <Switch>
                <Route exact path="/" component={FrontPage} />
                <Route exact path="/topoffloads" component={TopOffloads} />
                <Route exact path="/home" render={() => <Redirect to="/" />} />
                <Route exact path="/contact" component={Contact} />
                <Route exact path="/about" component={About} />
                <Route exact path="/Search/:term" render={(e) => <Search term={e.match.params.term} />}  />

                <Route exact path="/owner/:ownerId" render={(e) => <OwnerDetails ownerId={e.match.params.ownerId} />} />
                <Route exact path="/topowners" render={(e) => <TopOwner/>} />

                <Route exact path="/boats/:boatname" render={(e) => <BoatDetails boatname={e.match.params.boatname} />} />
                <Route exact path="/offloads/:boatId" render={(e) => <OffloadBoatDetails boatId={e.match.params.boatId}/>} />
                <Route exact path="/offload/:date/:registrationId" render={(e) => <OffloadDetails date={e.match.params.date} registrationId={e.match.params.registrationId}/>} />
                <Route path="/*" component={NotFound} />
            </Switch>
            </selectionsContext.Provider>
      </Container>
      <Footer />
    </div>
  );
}

export default App;
