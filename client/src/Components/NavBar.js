import styles from './NavBar.module.css';

import { faAirbnb } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Fragment } from 'react';
// import { faMagnifyingGlass } from '@fortawesome/free-brands-svg-icons'
import { faBars, faHamburger, faMagnifyingGlass, faPerson, faUser } from '@fortawesome/free-solid-svg-icons'
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
// import { faMagnifyingGlass } from '@fortawesome/free-regular-svg-icons'

const NavBar = (props) => {




    const user = useSelector(state => state.auth.user);
    const navigate = useNavigate();


    const onAccountClickHandler = (event) => {

        console.log('user',user);
        // navigate('/account');
        if(user){
            navigate('/account/profile');
        }else{
            navigate('auth');

        }
    }

    const navigateToHome = () => {
        navigate('/');
    }


    return (
        <Fragment>
        <nav className={styles.nav}>
            <div className={styles['nav__logo']} onClick={navigateToHome}>
                <FontAwesomeIcon icon={faAirbnb} style={{color:'#FF385C',height:'35px'}} />
                <h3>Airbnb</h3>
            </div>

            <div className={styles['nav__menu']}>
               <p>Any where</p>
               <div className={styles['seperator']}></div>
               <p>Any week</p>
               <div className={styles['seperator']}></div>
               <p>Add guests</p>
               <button className={styles['nav__menu--search']}>
                    <FontAwesomeIcon icon={faMagnifyingGlass} style={{
                       color:'white',
                       height:'15px'
                    }}/>
               </button>
            </div>


            <div className={styles['nav__account']} onClick={onAccountClickHandler} >
                <FontAwesomeIcon icon={faBars} />
                <div className={styles['user-icon-container']}> 
                    <FontAwesomeIcon icon={faUser} />
                </div>
                    <p>{user && user.name}</p>
            </div>
        </nav>
        <Outlet></Outlet>
        </Fragment>
    );
}

export default NavBar;