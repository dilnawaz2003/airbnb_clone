import { useDispatch, useSelector } from 'react-redux';
import styles from './ProfilePage.module.css';
import { logoutUser } from '../store/auth-slice';
import { useNavigate } from 'react-router-dom';

const ProfilePage = (props) => {


    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(state => state.auth.user);

    const logoutHandler = () => {
       if(dispatch(logoutUser())){
            navigate('/');
       }
    }

    if(!user){
        return <h1>No User Found</h1>
    }
    return (
        <div>
                <h1>Profile page</h1>
                <p>{user.name}</p>
                <p>{user.email}</p>
                <button className={styles['button']} onClick={logoutHandler}>Logout</button>
            </div>
    );
}

export default ProfilePage;