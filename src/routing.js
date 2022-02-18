import React from 'react';
import { Switch } from 'react-router';
import { Route } from 'react-router-dom';
import HomeLayout from './components/Layouts/home';
import CollectionDetails from './pages/Collection/index';
import LoginPage from './pages/Login/index';
import MarketplaceDetails from './pages/Marketplaces/details/index';
import CreateNft from './pages/NFT/create/index';
import NftDetails from './pages/NFT/details/index';
import NftResell from './pages/NFT/resell/index';
import NoMatch from './pages/NoMatch/index';
import ProfilePage from './pages/Profile/index';
import SearchPage from './pages/SearchPage/index';
import * as RoutePaths from './utils/constants/routings';

function Routings() {
  return (
    <HomeLayout>
      <Switch>
        <Route exact path={RoutePaths.CREATE_NFT} component={CreateNft} />
        <Route exact path={RoutePaths.NFT_DETAILS} component={NftDetails} />
        <Route exact path={RoutePaths.PROFILE} component={ProfilePage} />
        <Route exact path={RoutePaths.COLLECTION} component={CollectionDetails} />
        <Route exact path={RoutePaths.COLLECTION_DETAILS} component={CollectionDetails} />
        <Route exact path={RoutePaths.NFT_RESELL} component={NftResell} />
        <Route exact path={RoutePaths.SEARCH_PAGE} component={SearchPage} />
        <Route exact path={RoutePaths.AUTH_LOGIN} component={LoginPage} />
        <Route path={RoutePaths.HOME} component={MarketplaceDetails} />
        <Route component={NoMatch} />
      </Switch>
    </HomeLayout>
  );
}

export default Routings;
