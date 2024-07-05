import { useDispatch, useSelector } from 'react-redux';
import styles from './AuthPage.module.css';

import { authActions } from '../store/auth-slice';
import { Fragment, useRef } from 'react';
import { authenticateUser } from '../store/auth-slice';
import { useNavigate } from 'react-router-dom';


const AuthPage = (props) => {


    const isLogin = useSelector(state => state.auth.isLogin);
    const errorMessage = useSelector(state => state.auth.errorMessage);
    const isLoading = useSelector(state => state.auth.isLoading);

    const dispath = useDispatch();
    const navigate = useNavigate();
    const userNameRef = useRef();
    const userEmailRef = useRef();
    const userPasswordRef = useRef();


    const toggleAuthHandler = (event) => {
        event.preventDefault();
        dispath(authActions.toggleLogin());
    }

    const submitHandler = async (event) => {
        event.preventDefault();

        dispath(authActions.setErrorMessage(''));
        // dispath(authActions.toggleISLoading());
        
        const name = userNameRef?.current?.value;
        const email = userEmailRef.current.value;
        const password = userPasswordRef.current.value;



        if(name?.length < 3){
            dispath(authActions.setErrorMessage('name must not be less than 6 characters'));
            return;
        }
        if(!email.includes('@')){
            dispath(authActions.setErrorMessage('please enter valie email'));
            return;

        }
        if(password < 6 ){
            dispath(authActions.setErrorMessage('password must not be less than 6 characters'));
            return;
        }


        dispath(authenticateUser(isLogin,{name,email,password})).then(
            (response)=>{
              if(response?.successful) navigate('/');
            } 
        ).catch((e) => {
            alert('Authitication failed')
        });
        

        
    }

    const title = isLogin ? 'Login' : 'Signup'; 
    return (
        <Fragment>
        {errorMessage !== '' && <p>{errorMessage}</p>}
        <h1 className={styles['title']}>{title}</h1>
        <form className={styles.form} onSubmit={submitHandler}>
            {!isLogin && <div className={styles['form__control']}>
                <label>User Name</label>
                <input placeholder="Dil nawaz" type='text' id='name' ref={userNameRef}></input>
            </div>}
            
            
            <div className={styles['form__control']}>
                <label>Email</label>
                <input placeholder="nawaz@eamil.com" type='email' ref = {userEmailRef}></input>
            </div>
           
            <div className={styles['form__control']}>
                <label>Password</label>
                <input type="password" placeholder='123456' ref={userPasswordRef}></input>
            </div>
        

            <button className={styles['form__button']} type='submit'>{isLoading ? 'loading': title}</button>
            <p className={styles['gray']}>
                {isLogin? "Don't have an account ?":'Already have an account?'}
            <i onClick={toggleAuthHandler} className={styles['primary']}>{isLogin? "Signup":'Login'}</i></p>
        </form>
       
        </Fragment>
    );
}


export default AuthPage;