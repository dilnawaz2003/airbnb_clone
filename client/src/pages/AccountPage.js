import { NavLink, Outlet,useParams, } from 'react-router-dom';
import styles from './AccountPage.module.css';
import { Fragment } from 'react';
import { useSelector } from 'react-redux';

import ProfilePage from './ProfilePage';
import MyPlacesPage from './NewPlacePage';
import AccountNav from '../Components/AccountNav';


const AccountPage  = (props) => {



    return (
        <AccountNav></AccountNav>
    );
   
        // {
        //     profilePage && 
        //     <ProfilePage name={user.name} email={user.email} id={user._id}></ProfilePage>
        // }
        // {
        //     bookingsPage && <h1>My Bookings</h1>
        // }
        // {
        //     placesPage && <MyPlacesPage></MyPlacesPage>
        // }
        
    
}





export default AccountPage