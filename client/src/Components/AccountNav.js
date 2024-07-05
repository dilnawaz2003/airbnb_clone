import { Fragment } from "react"
import { NavLink, Outlet,useLocation,useParams, } from 'react-router-dom';
import styles from './AccountNav.module.css';
import { useSelector } from 'react-redux';



const AccountNav = (props) => {
   
    const location = useLocation();


    const isActiveLink  = (linkName) => {
        const currLink = location.pathname.split('/')?.[2];

        return currLink === linkName ? 'active':'not-active';
    }

    return (
        <Fragment>
        <div className={styles.menu}>
            <div className={styles[`${isActiveLink('profile')}`]}>
            <NavLink  to='/account/profile'  className={styles['menu__link']}>My Profile </NavLink>
            </div>
            <div className={styles[`${isActiveLink('bookings')}`]} >

            <NavLink  to='/account/bookings' className={styles['menu__link']}  > My Bookings</NavLink>

            </div>
            <div className={styles[`${isActiveLink('places')}`]}>
              <NavLink  to='/account/places' className={styles['menu__link']}  > My Places</NavLink>
            </div>
            
        </div>
        <Outlet></Outlet>
        </Fragment>
    );
}

export default AccountNav;