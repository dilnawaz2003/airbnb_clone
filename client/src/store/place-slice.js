import { createSlice } from "@reduxjs/toolkit";



const placeSlice = createSlice(
    {
        name:'place',
        initialState:{
            perks:{
                'wifi':false,
                'parking':false,
                'kitchen':false,
                'washer':false,
                'elevator':false,
                'security_cameras':false
    
            },
            places:[],
            allPlaces:[],
        },
        reducers:{
            setPerks(state,action){
                // console.log(state.perks);
                // console.log(action);
                 state.perks[action.payload.name] = action.payload.checked;
            },

            setPlaces(state,action){
                 console.log(action);
                 state.places = action.payload.places
                // state.places.push(action.payload.place);
            },
            setAllPlaces(state,action){
                state.allPlaces = action.payload;
            }
        },
    }
);



export const uploadPhotoByLink  = (imageLink,setAddedPhotos) => {
     return async (dispatch) =>{
        try{
           const response =  await fetch(
                'http://localhost:4000/upload-photo-by-link',
                {
                    method:'POST',
                    credentials:'include',
                    headers:{
                        'Content-Type':'application/json',
                    },
                    body:JSON.stringify({imageLink})
                }
            );

            if(!response.ok) throw new Error('Error Uploading Image');

            const data = await response.json();
            console.log(data);
            return data;
        }catch(e){
            console.log(e);
        }
    }
}


export const uploadLocalPhoto = (files) => {
    return async (dispatch) => {
        try{
            // console.log(files);
            // console.log(JSON.stringify({files}));

            const response =  await fetch(
                 'http://localhost:4000/upload-local-photo',
                 {
                     method:'POST',
                     credentials:'include',
                    //  headers:{
                    //     // "Content-Type": "multipart/form-data",
                    //     "Access-Control-Allow-Origin": "*"
                         
                    //  },
                     body:files
                 }
             );
 
             if(!response.ok) throw new Error('Error Uploading Image');
 
             const data = await response.json();
             console.log(data);
             return data;
         }catch(e){
             console.log(e);
         }
    }
}


export const addPlace = (place) => {
    return async (dispatch) => {
        console.log(place);
        try{
            const response = await fetch(
                'http://localhost:4000/place/new',
                {
                    method:'POST',
                    credentials:'include',
                    headers:{
                        'Content-Type':'application/json',
                    },
                    body:JSON.stringify(place)
                }
            );
            if(!response.ok) throw new Error('Error Adding Place');
            const placeData = await response.json();
            // dispatch(placeActions.setPlaces({place:placeData}));
            return true;

        }catch(e){
            console.log('error in add place');
            console.log(e);
        }
    }
}



export const  getPlaces = (single=false,id=null) => {
    return async (dispatch) => {
        try{
            const response = await fetch('http://localhost:4000/places',
            {credentials:'include'}
            );

            if(!response.ok) throw new Error('Error Getting Places');

            const places = await response.json();

            if(single && id){
               const place =  places.find((place) => place._id === id);
               console.log(place);
               if(place) return place;
               return null;
            }else{
                dispatch(placeActions.setPlaces({places}))
            }
        }catch(e){
            console.log('error getting places');
            console.log(e);
        }
    }
}


export const getAllPlaces = (single=false , id=null) => {
    return async (dispatch) => {
        try{

            const response = await fetch('http://localhost:4000/places/all',
            {credentials:'include'}
            );

            if(!response.ok) throw new Error('Error Getting Places');

            const places = await response.json();

            if(single && id){
               const place = places.find((place) => place._id === id)
               if(place) return place;
               return null;
            }else{

                dispatch(placeActions.setAllPlaces(places))
            }


        }catch(e){
            console.log('Error Geting All Places');
            console.log(e);
        }
    }
}

export const placeActions = placeSlice.actions;
export const placeReducers = placeSlice.reducer;