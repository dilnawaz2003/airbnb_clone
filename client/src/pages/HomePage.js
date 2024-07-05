import { useDispatch, useSelector } from "react-redux";
import { getUserData } from "../store/auth-slice";
import { useEffect, useState } from "react";
import { getAllPlaces } from "../store/place-slice";
import {useNavigate, useSearchParams} from 'react-router-dom';

import { faArrowLeft,faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


import styles from './HomePage.module.css';

const HomePage = (props) => {


    const [loading , setIsLoading] = useState(true);
    const dispatch = useDispatch();
    const allPlaces = useSelector(state => state.place.allPlaces);
    const [picIndex,setPicIndex] = useState(0);

    const navigate = useNavigate();
    

    useEffect(()=>{
      dispatch(getAllPlaces()).then(() => {
        setIsLoading(false);
      }).catch(()=>{
        return <h1>Some Thing Went Wrong</h1>
      })

    },[]);

    const changePicHandler = (value,currPlace) => {
      // console.log(currBooking.place.photos.length -1)


      if(value === 1 && picIndex !== currPlace.photos.length -1){
          setPicIndex((prevState) => {
              return prevState + value;
          })
      }

      if(value === -1 && picIndex !== 0 ){
          setPicIndex((prevState) => {
              return prevState + value;
          })
         
      }
  }



    const placeOnClick = (placeId) => {
      navigate('/account/places/'+placeId+'?auth=none');
    }


    if(loading){
      return <h1>Loading</h1>
    }

    if(allPlaces.length === 0){
      return <h1>No Places Found Please Try Again</h1>
    }

    console.log(allPlaces);
    return (
      <div className={styles['grid-container']}>

      {
        allPlaces.map((place) => {
          return <div className={styles['grid-item']} onClick={() => {placeOnClick(place._id)}}>
                <div> 
                    <img src={"http://localhost:4000/uploads/"+place.photos[picIndex]} className={styles['grid-item__img']} >
                    </img>
                    <h4 className={styles['grid-item__address']}>{place.address}</h4>
                    <p className={styles['grid-item__title']}>{place.title}</p>
                    <h4 className={styles['grid-item__price']}>${place.pricePerNight} Price per night</h4>
                </div>

                <div className={styles['booking-con__btns']}>
                                        <button onClick={(e) => {
                                          e.stopPropagation();
                                          changePicHandler(-1,place)
                                        }} >
                                            <FontAwesomeIcon icon={faArrowLeft}/>
                                        </button>
                                        <button onClick={(e) => {
                                          e.stopPropagation();
                                          changePicHandler(1,place)
                                        }} value={1}>
                                            <FontAwesomeIcon icon={faArrowRight}/>
                                        </button>
                                    </div>
                
            </div>
        })
      }
          
          
      </div>
    );
}




export default HomePage;