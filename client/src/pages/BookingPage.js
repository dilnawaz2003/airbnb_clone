import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBookings } from "../store/booking-slice";
import { differenceInCalendarDays } from "date-fns";
import { faArrowLeft,faArrowRight } from "@fortawesome/free-solid-svg-icons";
import styles from './BookingPage.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const BookingPage = () => {


    const dispatch = useDispatch();
    const bookings = useSelector(state => state.booking.bookings);
    const [loading,setLoading] = useState(true);
    const [picIndex,setPicIndex] = useState(0);

    useEffect(
        () => {
            dispatch(getBookings()).then(()=> {
                setLoading(false);
            });
        },[]
    );

    const changePicHandler = (value,currBooking) => {
        // console.log(currBooking.place.photos.length -1)

        if(value === 1 && picIndex !== currBooking.place.photos.length -1){
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

    if(loading){
        return <h1>Loading</h1>
    }

    if(bookings.length === 0){
        return <h1>No Bookings Found</h1>
    }



    console.log(picIndex);

    return (
        <div>
            {
                bookings.map(
                    (booking) => {
                        return <div className={styles['booking-con']}> 
                                <div className={styles['booking-con__first']}>
                                    <img src={"http://localhost:4000/uploads/" + booking.place.photos[picIndex]} ></img>
                                    <div className={styles['booking-con__btns']}>
                                        <button onClick={() => changePicHandler(-1,booking)} >
                                            <FontAwesomeIcon icon={faArrowLeft}/>
                                        </button>
                                        <button onClick={() => changePicHandler(1,booking)} value={1}>
                                            <FontAwesomeIcon icon={faArrowRight}/>
                                        </button>
                                    </div>
                                    {
                                        booking.place.photos.map((photo,index) => {
                                            console.log(index,photo);
                                            return <div key={index} className={`${styles['circle']} ${styles[picIndex === index ? 'active-circle' :'']}`} style={{left:`${30+index*10}%`}}> </div>
                                        })
                                    }
                                </div>
                                <div className={styles['booking-con__second']}>
                                    <h3>{booking.place.title}</h3>
                                    <div> 
                                        <p>{differenceInCalendarDays(booking.checkOutTime,booking.checkInTime)} nights</p>
                                        <p>{new Date(booking.checkInTime).toLocaleDateString()} to {new Date(booking.checkOutTime).toLocaleDateString()}</p>
                                    </div>
                                    <h3>
                                        Total Price : {booking.price}
                                    </h3>
                                </div>
                        </div>                            

                    }
                )
            }
        </div>

    );
}

export default BookingPage;