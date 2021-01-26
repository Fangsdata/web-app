import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import NavigationBar from './compoments/NavigationBar';
import TopOffloads from './compoments/TopOffLoads';
import Container from './compoments/Container';
// import Boat from './compoments/Boat';
import BoatDetails from './compoments/BoatDetails';
import Contact from './compoments/Contact';
import About from './compoments/About';
import OffloadDetails from './compoments/OffloadDetails';
import NotFound from './compoments/NotFound';
import FrontPage from './compoments/FrontPage';
import Footer from './compoments/Footer';

function App() {
  return (
    <div className="App">
      <NavigationBar />
      <Container>
        <Switch>
          <Route exact path="/" component={FrontPage} />
          <Route exact path="/topoffloads" component={TopOffloads} />
          <Route exact path="/home" render={() => <Redirect to="/" />} />
          <Route exact path="/contact" component={Contact} />
          <Route exact path="/about" component={About} />
          <Route exact path="/boats/:boatname" render={(e) => <BoatDetails boatname={e.match.params.boatname} />} />
          <Route exact path="/offloads/:offloadId" render={(e) => <OffloadDetails offloadId={e.match.params.offloadId} />} />
          <Route path="/*" component={NotFound} />
        </Switch>
      </Container>
      <Footer />
    </div>
  );
}

export default App;
