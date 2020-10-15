import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Landing from './pages/Landing';
import OrphanagesMap from './pages/OrphanagesMap';
import CreateOrphanage from './pages/CreateOrphanage';
import OrphanageDetails from './pages/OrphanageDetails';

function Router() {
  return (
    <BrowserRouter>
      {/* Switch: allows only one route to be loaded at a given time */}
      <Switch>
        <Route path="/" exact component={Landing} />
        <Route path="/app" component={OrphanagesMap} />
        <Route path="/orphanages/create" component={CreateOrphanage} />
        <Route path="/orphanages/:id" component={OrphanageDetails} />
      </Switch>
    </BrowserRouter>
  );
}

export default Router;
