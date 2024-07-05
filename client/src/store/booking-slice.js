import { createSlice } from "@reduxjs/toolkit";


const bookingSlice = createSlice(
    {
        name:'booking',
        initialState:{
            bookings:[],
        },
        reducers:{
            setBookings(state,action){
                state.bookings = action.payload;
            }
        }
    }
);


export const addBooking = (reservationData) => {
    return async (dispatch) => {
        try{
            const response =  await fetch('http://localhost:4000/booking',
            {
                method:'POST',
                credentials:'include',
                headers:{
                    'Content-Type':'application/json',
                },
                body:JSON.stringify(reservationData),
            }
            );

            if(!response.ok) throw new Error('Error Booking Place');

            return true;

        }catch(e){
            console.log(e);
            return false;
        }
    }
}



export const  getBookings = () => {
    return async (dispatch) => {
        try{
            const response = await fetch('http://localhost:4000/booking',
            
            {
                credentials:'include',
            });

            if(!response.ok) throw new Error('Error Getting Bookings');

            const bookings = await response.json();

            dispatch(bookingActions.setBookings(bookings));

        }catch(e){
            console.log('Error Getting Bookings ');
            console.log(e);
        }
    }
}


export const bookingActions = bookingSlice.actions;
export const bookingReducers = bookingSlice.reducer;