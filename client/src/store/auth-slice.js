import { createSlice } from "@reduxjs/toolkit";
import { disconnect } from "mongoose";



const authSlice = createSlice(
    {
        name:'auth',
        initialState:{
            isLogin:false,
            errorMessage : '',
            isLoading:false,
            user:null,
            userIsRequested:false,
        },
        reducers:{
            toggleLogin(state){
                state.isLogin = !state.isLogin;
            },

            setErrorMessage(state,action){
                state.errorMessage = action.payload;
                
            },

            toggleISLoading(state){
                state.isLoading = !state.isLoading;
            },

            setUser(state,action){
                // console.log(action.payload.user);
                state.user = action.payload.user;
            },

            setUserIsRequested(state,action){
                // console.log(action.payload);
                state.userIsRequested =action.payload;
            }
        }
    }
);


export const authenticateUser = (isLogin,userData)=> {

    return async (dispatch) => {

        dispatch(authActions.toggleISLoading());

        try{
            // if(isLogin){
            //     const response =await  fetch('http://localhost:4000/login',
            //     {
            //         method:'POST',
            //         headers:{
            //             'Content-Type':'application/json',
            //         },
            //         body:JSON.stringify({email:userData.email,password:userData.password}),
            //     }
            //     );

            //     if(!response.ok) {
            //         console.log(response);
            //         throw new Error('Some Thing went wrong');
            //     }
    
            //     const data = await  response.json();
            //     console.log(data);
            //     return data;
                
            // }else{
            //     console.log('authinticate');
            //   const response =await  fetch('http://localhost:4000/signup',
            //     {
            //         method:'POST',
            //         headers:{
            //             'Content-Type':'application/json',
            //         },
            //         body:JSON.stringify(userData)
            //     }
            //     )
    
            //     if(!response.ok) {
            //         console.log(response);
            //         throw new Error('Some Thing went wrong');
            //     }
    
            //     const data = await  response.json();
            //     console.log(data);
            //     return data;
               
            // }

            const sendRequest = async ()=>{
                let user = userData;
                let url = 'http://localhost:4000/signup';
                
                if(isLogin){
                    user = {email:userData.email,password:userData.password};
                    url = 'http://localhost:4000/login';
                }

                const response = await fetch(url,
                    {
                        method:'POST',
                        credentials: "include",
                        headers:{
                            'Content-Type':'application/json',
                            "Access-Control-Allow-Credentials": true,
                            
                        },
                        body:JSON.stringify(user)
                    }
                    )
        
                    if(!response.ok) {
                        console.log(response);
                        throw new Error('Some Thing went wrong');
                    }
        
                    const data = await  response.json();
                    // console.log(data);

                    // if user login so we should fetch his data

                    dispatch(getUserData());
                    return data; 
            }

            return sendRequest();
        }catch(e){
            console.log(e);
            dispatch(authActions.setErrorMessage(e.message));
        }finally{
            dispatch(authActions.toggleISLoading());
        }
        
        

    }
}



export const getUserData = () => {
    return async (dispatch) => {
        // console.log('get user data');
        dispatch(authActions.setUserIsRequested(true))
        // dispatch(authActions.toggleISLoading());
        try{
            const response = await fetch('http://localhost:4000/profile',
            {
                credentials:"include",
                // headers:{
                //     "Access-Control-Allow-Credentials": true,
                // }
            }
            );

            if(!response.ok) throw new Error('Some Thing Went Wrong');

            const data = await response.json();
            
            dispatch(authActions.setUser({user:data}))
        }catch(e){
            console.log('error profile');
            // console.log(e);
            // dispatch(authActions.setErrorMessage(e.message));
        }finally{
            // dispatch(authActions.toggleISLoading());
            
        }
    }
}


export const logoutUser = () => {

    return async (dispatch) => {
        try{
            const response = await fetch('http://localhost:4000/logout',
            {
                method:'POST',
                credentials:'include',
                headers:{
                    'Content-Type':'application/json'
                },
            }
            );

            if(!response.ok) throw new Error('Some Thing WEnt Wrong');
            dispatch(authActions.setUser({user:null}));
            dispatch(authActions.setUserIsRequested(false));
            return true;

        }catch(e){
            dispatch(authActions.setErrorMessage('Logout Failed'));
        }
    }
}

export const authReducers = authSlice.reducer;
export const authActions = authSlice.actions;



