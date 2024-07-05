import { useRef, useState } from 'react';
import styles from './NewPlacePage.module.css';
import { useDispatch, useSelector} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addPlace, placeActions, uploadLocalPhoto, uploadPhotoByLink } from '../store/place-slice';

const NewPlacePage = (props) => {



     const titleRef = useRef();
     const addressRef = useRef();
     const descriptionRef = useRef();
     const extraInfoRef = useRef();
     const checkInTimeRef = useRef();
     const checkOutTimeRef = useRef();
     const maxGuestsRef = useRef();
     const photoLinkRef = useRef();
     const fileInputRef = useRef();
     const priceRef = useRef();


     const [addedPhotos,setAddedPhotos] = useState([]);
     const perks = useSelector(state => state.place.perks);
     const dispatch = useDispatch();
     const navigate = useNavigate();


     const addPhotoByLinkHandler = (event) => {
        event.preventDefault();

        const imageLink = photoLinkRef.current.value;

        if(!imageLink) return;

        const newFilePath = dispatch(uploadPhotoByLink(imageLink)).then((newFilePath) => {
            setAddedPhotos((prevState) => {
                return [...prevState,newFilePath];
            });
        });
       

        photoLinkRef.current.value = '';
     }


     const addLocalPhoto = (event) => {
        event.preventDefault();
        const files = event?.target?.files;
        if(files){
            const data = new FormData();

            for (let i = 0 ; i < files.length ; i++){
                data.append('files',files[i]);
            }

           
            dispatch(uploadLocalPhoto(data))
            .then((res) => {
                // console.log(res);
                setAddedPhotos((prevState) => {
                    return [...prevState,...res];
                })
            })
            .catch(e => console.log(e))
        }
     }
     

     const perksHandler =(event) => {
        // event.preventDefault();

        const {name,checked} = event.target;
        dispatch(placeActions.setPerks({name,checked}));

     }


     const formSubmitHandler = (event) => {
        event.preventDefault();

        const place = {
            title :titleRef.current.value,
            address:addressRef.current.value,
            description:descriptionRef.current.value,
            extraInformation:extraInfoRef.current.value,
            checkInTime:checkInTimeRef.current.value,
            checkOutTime:checkOutTimeRef.current.value,
            maxGuests : maxGuestsRef.current.value,
            pricePerNight : Number(priceRef.current.value),
            photos:addedPhotos,
            perks:perks,
        };


        if(addedPhotos.length < 5){
            alert('Add at least 5 photos')
        }else{
            dispatch(addPlace(place)).then(
                (res) => {
                    if(res){
                        navigate('/account/places');
                    }
                }
            ).catch(
                (e) => {
                    console.log(e);
                }
            );
        }
        
     }
     
    return (
        <form className={styles['form']} onSubmit={formSubmitHandler}>
            <div className={styles['form__item']}>
                <label className={styles['item-header']}>Title</label>
                <input type='text' ref={titleRef} required></input>
            </div>

            <div className={styles['form__item']}>
                <label className={styles['item-header']}>Address</label>
                <input type='text' ref={addressRef} required></input>
            </div>

            <div className={styles['form__item']}>
                <label className={styles['item-header']}>Photos</label>
                <div className={styles['photo-input']}>
                    <div className={styles['photo-input__con-1']}>
                        <input type='text' ref={photoLinkRef}></input>
                        <button className={styles['photo-btn']} onClick={addPhotoByLinkHandler}>Add</button>
                    </div>
                    <div className={styles['photo-input__con-2']}>

                    {
                        addedPhotos.map(
                            
                            (image)=>{
                                return  <img key={image} className={styles['image-container']} src={'http://localhost:4000/uploads/'+image}>
                                </img>
                            }

                           
                        )
                    }
                       <div className={styles['add-image-container']} onClick={()=>{fileInputRef.current.click()}} >
                            <input type='file'  name='files' onChange={addLocalPhoto} ref={fileInputRef} ></input>
                            <p>Add Photo</p>
                       </div>
                      
                    </div>
                    
                </div>
            </div>

            <div className={styles['form__item']}>
                <label className={styles['item-header']}>Description</label>
                <textarea type='text' ref={descriptionRef} required></textarea>
            </div>

            <div className={styles['perks-container']}>
                <label className={styles['item-header']}>Perks</label>

                <div className={styles['perks-content-con-1']} >
                    <div className={styles['perks-content-item']}>
                        <input type='checkbox' name='wifi'  onChange={perksHandler} checked={perks.wifi}></input>
                        <p>Wifi</p>
                    </div>
                    <div className={styles['perks-content-item']}>
                        <input type='checkbox' name='parking'  onChange={perksHandler} checked={perks.parking}></input>
                        <p>Parking</p>
                    </div>
                    <div className={styles['perks-content-item']}>
                        <input type='checkbox'name='kitchen' onChange={perksHandler} checked={perks.kitchen}></input>
                        <p>Kitchen</p>
                    </div>
                </div>

                <div className={styles['perks-content-con-1']} >
                <div className={styles['perks-content-item']}>
                    <input type='checkbox' name='security_cameras' onChange={perksHandler} checked={perks.security_cameras}></input>
                    <p>Security cameras</p>
                </div>
                <div className={styles['perks-content-item']}>
                    <input type='checkbox' name='washer' onChange={perksHandler} checked={perks.washer}></input>
                    <p>Washer</p>
                </div>
                <div className={styles['perks-content-item']}>
                    <input type='checkbox' name='elevator' onChange={perksHandler} checked={perks.elevator}></input>
                    <p>Elevator</p>
                </div>
            </div>
                
            </div>


            <div className={styles['form__item']}>
                <label className={styles['item-header'] }>Extra Info</label>
                <textarea type='text' ref={extraInfoRef} required></textarea>
            </div>

            <div className={styles['form__item']}>
                <label className={styles['item-header']}>Check In Time</label>
                <input type='date' ref={checkInTimeRef} required></input>
            </div>

            <div className={styles['form__item']}>
                <label className={styles['item-header']}>Check Out Time</label>
                <input type='date' ref={checkOutTimeRef} required></input>
            </div>

            <div className={styles['form__item']}>
                <label className={styles['item-header']}>Max Guests</label>
                <input type='number' ref={maxGuestsRef} required min='1'></input>
            </div>

            <div className={styles['form__item']}>
                <label className={styles['item-header']}>Price Per Night</label>
                <input type='number' ref={priceRef} min='1' required></input>
            </div>
            <div className={styles['form__item']}>
                <button className={styles['btn']} >Save</button>
            </div>
        </form>
    );
}


export default NewPlacePage;