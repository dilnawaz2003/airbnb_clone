import { useEffect, useRef, useState } from "react";
import { getAllPlaces, getPlaces } from "../store/place-slice";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import  {faPizzaSlice,faStairs, faShirt , faCarSide , faVideo , faWifi}  from '@fortawesome/free-solid-svg-icons';

import styles from './PlaceDetailPage.module.css';
import {differenceInCalendarDays} from 'date-fns';
import { addBooking } from "../store/booking-slice";

const PlaceDetailPage = () => {

    const params = useParams();
    const serachParams = useSearchParams();
    const dispatch = useDispatch();
    const [place,setPlace] = useState(null);
    const navigate = useNavigate();


    const [checkInDate, setCheckInDate] = useState(null); 
    const [checkOutDate, setCheckOutDate] = useState(null); 
    const [totalPrice ,setTotalPrice] = useState(null);


    // const date = new Date('2022-01-01');
    // date.toLocaleDateString

    console.log(serachParams[0].get('auth'));

    useEffect(() => {

        if(serachParams?.[0].get('auth') === 'none'){
            dispatch(getAllPlaces(true,params.id)).then(
                (res) => {
                    setPlace(res);
                }
            )
        }else{
            dispatch(getPlaces(true,params.id)).then(
                (res) => {   
                setPlace(res);
                }
            );

        }
    },[]);

    useEffect(
        () => {
            if(checkInDate && checkOutDate){
                const nights = differenceInCalendarDays(checkOutDate,checkInDate);
                if(nights > 0){
                    setTotalPrice(nights * place.pricePerNight);
                }
            }
        },
        [checkInDate,checkOutDate]
    );



    const checkInTimeHandler = (event) => {
        setCheckInDate(event.target.value);
        console.log(event.target.value);
    }

    const checkOutTimeHandler = (event) => {
        setCheckOutDate(event.target.value);
    }

    const reservationHandler = () => {
        if(checkInDate && checkOutDate && totalPrice && place){
            // make request
            console.log(checkInDate);
            dispatch(addBooking(
                {
                    placeId:place._id,
                      checkInDate,
                      checkOutDate,
                }
            )).then((res) => {
                if(res){
                    alert('resrvation Succesful');
                    navigate('/account/bookings');
                    
                }
            }).catch((e) => {
                alert('resrvation failed');
            });
        }
    }
    

    if(!place){
        return <h1>Loading</h1>
    }
    
    return (
       <div className={styles['place']}>
            <h2>{place.title}</h2>
            <div className={styles['grid-container']}>
                 <div className={styles['item-1']}>
                    <img src={'http://localhost:4000/uploads/'+place.photos[0]} ></img>
                 </div>
                 <div className={`${styles['item-2']} ${styles['item']}`}>
                    <img src={'http://localhost:4000/uploads/'+place.photos[1]} ></img>

                 </div>
                 <div className={`${styles['item-3']} ${styles['item']}`}>
                    <img src={'http://localhost:4000/uploads/'+place.photos[2]} ></img>

                 </div>
                 <div className={`${styles['item-4']} ${styles['item']}`}>
                    <img src={'http://localhost:4000/uploads/'+place.photos[3]} ></img>

                 </div>
                 <div className={`${styles['item-5']} ${styles['item']}`}>
                    <img src={'http://localhost:4000/uploads/'+place.photos[4]} ></img>
                 </div>
            </div>

            <div  className={`${styles['col']} ${styles['m-10']}`}>
                <div className={styles['con-1']}>
                        <div className={`${styles['address-con']}  `}>
                            <h3>{place.address}</h3>
                            <p>{place.maxGuests} guests  | ${place.pricePerNight} Per Night</p>
                        </div>

                        <div className={`${styles['owner-con']} ${styles['m-10']}`}>
                            <p>Hosted by {place.ownerId.name}</p>
                        </div>
                </div>
                <div className={styles['revervation-con']}>
                   <p><b>${place.pricePerNight}</b> night</p>
                   <div className={styles['date-con']}>
                        <div className={styles['date-con__first']} onClick={checkInTimeHandler} >
                            <label><b>Check in</b></label>
                            <input type="date"   onChange={checkInTimeHandler} value={checkInDate} ></input>
                        </div>
                        <div className={styles['date-con__second']}>
                            <label><b>Check Out</b></label>
                            <input type="date"  value={checkOutDate} onChange={checkOutTimeHandler}></input>
                        </div>
                        
                   </div>
                   { totalPrice && <p className={styles['tp-container']}>Total Price :{totalPrice} </p>}
                   <button onClick={reservationHandler}>Reserve</button>
                </div>
            </div>
            
            <div className={`${styles['m-10']}`}>
                <h3>Description</h3>
                <p>{place.description}</p>
            </div>
            <div className={`${styles['perks-con']} ${styles['m-10']}`}>
                <h3>What this Place offer</h3>
                
                    <p className={styles[place.perks.wifi ? 'include' : 'not-include']}>
                        <FontAwesomeIcon icon={faWifi} style={{color:"gray"}}  />
                            Wifi
                    </p>
                    <p className={styles[place.perks.washer ? 'include' : 'not-include']}>
                            <FontAwesomeIcon icon={faShirt} style={{color:"gray"}} />
                            Washer
                    </p>
                    <p className={styles[place.perks.parking ? 'include' : 'not-include']}>
                        <FontAwesomeIcon icon={faCarSide} style={{color:"gray"}} />

                         Parking
                    </p>
                    <p className={styles[place.perks.kitchen ? 'include' : 'not-include']}>
                             <FontAwesomeIcon icon={faPizzaSlice} style={{color:"gray"}} />
                            Kitchen
                    </p>
                    <p className={styles[place.perks.elevator ? 'include' : 'not-include']}>
                            <FontAwesomeIcon icon={faStairs} style={{color:"gray"}}/>
                            Elevator
                    </p>
                    <p className={styles[place.perks.security_cameras ? 'include' : 'not-include']}>
                        <FontAwesomeIcon icon={faVideo} style={{color:"gray"}}/>

                        Security cameras
                    
                    </p>
                
            </div>

            <div styles={`${styles['m-10']}`}>
                <h3>Extra Info</h3>
                <p>{place.extraInformation}</p>
            </div>
       </div>
    );
}



export default PlaceDetailPage;