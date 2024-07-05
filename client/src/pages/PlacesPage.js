import { useDispatch, useSelector } from 'react-redux';
import styles from './PlacesPage.module.css';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { placeActions } from '../store/place-slice';
import { getPlaces } from '../store/place-slice';

const PlacesPage = () => {

    const navigate = useNavigate();
    const places = useSelector(state => state.place.places);
    const dispatch = useDispatch();
    console.log(places);
     console.log(places.length > 0)



    useEffect(() => {
        dispatch(getPlaces());
    },[]);

    const buttonHandler = () => {
        navigate('/account/places/new');
    }


    const navigateToDetailPage = (id) => {
        navigate('/account/places/'+id)
    }
    return (
        <div className={styles['places-con']}>
            <div className={styles['btn-con']}>
                <button onClick={buttonHandler} >Add New Place</button>
            </div>

            <h1> My Places</h1>
            {
               places && places.length > 0 && 
                places.map(
                    (place) => {
                        console.log(place.photos);
                       return  <div className={styles['place']} onClick={() => navigateToDetailPage(place._id)}>
                            <div className={styles['place-img']}>
                                <img src={`http://localhost:4000/uploads/${place.photos[0]}`}></img>
                            </div>
                            <div className={styles['place-content']}> 
                                <h3>{place.title}</h3>
                                <p >{place.description}</p>
                            </div>
                       </div>
                    }
                )
            }
        </div>
    );
}

export default PlacesPage;