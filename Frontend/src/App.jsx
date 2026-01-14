import React from 'react'
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import VisitorLayout from './layouts/VisitorLayout';

import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import MarketPage from './pages/MarketPage';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import CommunityPage from './pages/CommunityPage';
import BusinessRegistrationPage from './pages/BusinessRegistrationPage';

import ProductPage from './pages/ProductPage';
import MarketActionPage from './pages/MarketActionPage';
import CommunityActionPage from './pages/CommunityActionPage';
import MarketListPage from './pages/MarketListPage';
import CategoryPage from './pages/CategoryPage';
import BusinessMarketSpacePage from './pages/BusinessMarketSpacePage';
import AdminPage from './pages/AdminPage';
import { LocationProvider } from './context/LocationContext';

import NotificationPage from './pages/NotificationPage';
import MarketFloorPlanPage from './pages/MarketFloorPlanPage';
import MarketSpacePage from './pages/MarketSpacePage';
import ProductActionPage from './pages/ProductActionPage';
import VendorMarketSpacePage from './pages/VendorMarketSpacePage';
import BusinessMarketspaceAvailablePage from './pages/BusinessMarketspaceAvailablePage';
import MarketSpaceActionPage from './pages/MarketSpaceActionPage';
import MarketspaceApplicationPage from './pages/MarketspaceApplicationPage';
import MarketHistoryPage from './pages/MarketHistoryPage';
import MarketBookmarkPage from './pages/MarketBookmarkPage';
import MarketReviewActionPage from './pages/MarketReviewActionPage';
import BusinessMarketReviewPage from './pages/BusinessMarketReviewPage';
import BusinessMarketStatisticPage from './pages/BusinessMarketStatisticPage';
import VendorStatisticPage from './pages/VendorStatisticPage';
import LandingPage from './pages/LandingPage';
import MapPageMapbox from './pages/MapPageMapbox';
import BusinessMarketStatisticReport from './pages/BusinessMarketStatisticReport';
import VendorStatisticReport from './pages/VendorStatisticReport';
import VisitorProductPage from './pages/VisitorProductPage';
import VisitorProductReviewActionPage from './pages/VisitorProductReviewActionPage';
import VisitorProductReviewPage from './pages/VisitorProductReviewPage';
import VendorProductReviewPage from './pages/VendorProductReviewPage';
import VisitProfilePage from './pages/VisitProfilePage';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/'>
      <Route path='/' element={<VisitorLayout />}>
        <Route index element={<HomePage />}/>
        <Route path='/search' element={<SearchPage />}/>
        <Route path='/map' element={<MapPageMapbox />}/>
        <Route path='/profile' element={<ProfilePage />}/>
        <Route path='/community' element={<CommunityPage />}/>

      </Route>

      <Route path='/category/:id' element={<CategoryPage />} />
      <Route path='/hello' element={<LandingPage />} />
      <Route path='/notifications' element={<NotificationPage />}/>
      <Route path='/business/marketspace' element={<BusinessMarketSpacePage />}/>
      <Route path='/business/marketspace/application' element={<MarketspaceApplicationPage/>}/>
      <Route path='/business/marketspace/available' element={<BusinessMarketspaceAvailablePage />}/>
      <Route path='/business/marketspace/:id' element={<VendorMarketSpacePage />}/>
      <Route path='/business/marketspace/:id/apply' element={<MarketSpaceActionPage />}/>
      <Route path='/community/add' element={<CommunityActionPage />}/>
      <Route path='/business/product' element={<ProductPage />}/>
      <Route path='/business/product/add' element={<ProductActionPage />}/>
      <Route path='/business/product/:id/edit' element={<ProductActionPage />}/>
      <Route path='/business/product/:product_id' element={<VisitorProductPage isOwnProfile={true}/>}/>
      <Route path='/admin/market/add' element={<MarketActionPage />}/>
      <Route path='/:role/registration' element={<BusinessRegistrationPage />}/>
      <Route path='/auth' element={<AuthPage />}/>
      <Route path='/market-review/:review_id' element={<MarketReviewActionPage />}/>
      <Route path='/market' element={<MarketListPage />}/>
      <Route path='/market/history' element={<MarketHistoryPage />}/>
      <Route path='/market/bookmark' element={<MarketBookmarkPage/>}/>
      <Route path='/market/:market_id/review' element={<MarketReviewActionPage />}/>
      <Route path='/market/:id' element={<MarketPage />}/>
      <Route path='/admin' element={<AdminPage />}/>

      <Route path='/product-review' element={<VisitorProductReviewPage />}/>
      <Route path='/product-review/:review_id' element={<VisitorProductReviewActionPage />}/>
      <Route path='/vendor/:id' element={<VisitProfilePage />}/>
      <Route path='/vendor/:vendor_id/product/:product_id' element={<VisitorProductPage />}/>
      <Route path='/vendor/:vendor_id/product/:product_id/review' element={<VisitorProductReviewActionPage />}/>
      <Route path='/visitor/:id' element={<VisitProfilePage />}/>
      <Route path='/organizer/:id' element={<VisitProfilePage />}/>

      <Route path='/business/vendor/:vendor_id/statistic' element={<VendorStatisticPage />}/>
      <Route path='/business/vendor/:vendor_id/statistic-download' element={<VendorStatisticReport />}/>
      <Route path='/business/market' element={<BusinessMarketSpacePage />}/>

      <Route path='/business/market/apply' element={<MarketActionPage />}/>
      <Route path='/business/market/:id/edit' element={<MarketActionPage />}/>
      <Route path='/business/market/:id/plan' element={<MarketFloorPlanPage />}/>
      <Route path='/business/market/:id/space' element={<MarketSpacePage />}/>
      <Route path='/business/market/:id/edit-plan' element={<MarketFloorPlanPage edit={true}/>}/>
      <Route path='/business/market/:market_id/review' element={<BusinessMarketReviewPage />}/>
      <Route path='/business/market/:market_id/statistic' element={<BusinessMarketStatisticPage />}/>
      <Route path='/business/market/:market_id/statistic-download' element={<BusinessMarketStatisticReport />}/>
    </Route>
  )
);

const App = () => {
  return (
    <LocationProvider>
      <RouterProvider router={router}/>
    </LocationProvider>
  )
};

export default App;