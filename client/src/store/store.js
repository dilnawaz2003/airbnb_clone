import { configureStore } from '@reduxjs/toolkit';


import { authReducers } from './auth-slice';
import { placeReducers } from './place-slice';
import { bookingReducers } from './booking-slice';

const store =  configureStore(
    {
        reducer:{
            auth:authReducers,
            place:placeReducers,
            booking:bookingReducers,
        }
    }
);

export default store;