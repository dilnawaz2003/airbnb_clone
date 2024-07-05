import './App.css';
import NavBar from './Components/NavBar';


import {Routes , Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authActions, getUserData } from './store/auth-slice';
import HomePage from './pages/HomePage';
import AccountPage from './pages/AccountPage';
import MyPlacesPage from './pages/NewPlacePage';
import ProfilePage from './pages/ProfilePage';
import PlacesPage from './pages/PlacesPage';
import NewPlacePage from './pages/NewPlacePage';
import PlaceDetailPage from './pages/PlaceDetailPage';
import BookingPage from './pages/BookingPage';





// Bbcv9klIZX9sFK6N ---> PASSWORD

function App() {

  const user = useSelector(state => state.auth.user);
  const userIsRequested = useSelector(state => state.auth.userIsRequested);
  const isLoading = useSelector(state => state.auth.isLoading);
  const dispatch = useDispatch()

  if(!user && !userIsRequested){
    dispatch(getUserData());
  }

  if(isLoading){
    return <h1>Is Loading</h1>
  }

  return (
    <div className="App">
        
        <Routes>
          <Route   element={<NavBar/>}>
              <Route path='/' element={<HomePage/>}></Route>
              <Route path='account' element={<AccountPage/>}>
                  <Route index path='profile' element={<ProfilePage/>}></Route>
                  <Route path='bookings' element={<BookingPage/>}></Route>
                  <Route path='places' element={<PlacesPage/>}></Route>
                  <Route path='places/new' element={<NewPlacePage/>}></Route>
              </Route>
              <Route path="account/places/:id" element={<PlaceDetailPage/>}></Route>
          </Route>
          
          <Route path='auth' element={<AuthPage/>}> </Route>
          <Route path='*' element={<h1>Page Not Found</h1>}></Route>
        </Routes>
    </div>
  );
}

export default App;
