import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import '../style/Createlisting.css';
import { categories, types, facilities } from '../data';
import { IoIosImages } from 'react-icons/io';
import { RemoveCircleOutline, AddCircleOutline } from '@mui/icons-material';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Createlisting() {
  const [photos, setPhotos] = useState([]);
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');
  const [amenities, setAmenities] = useState([]); // Initialize as an array
  const [formLocation, setFormLocation] = useState({
    streetAddress: '',
    aptSuite: '',
    city: '',
    province: '', // Ensure the field name matches what the server expects
    country: '',
  });

  const [guestCount, setGuestCount] = useState(1);
  const [bedroomCount, setBedroomCount] = useState(1);
  const [bedCount, setBedCount] = useState(1);
  const [bathroomCount, setBathroomCount] = useState(1);

  const handleSelectAmenities = (facility) => {
    if (amenities.includes(facility)) {
      setAmenities((prevAmenities) =>
        prevAmenities.filter((option) => option !== facility)
      );
    } else {
      setAmenities((prev) => [...prev, facility]);
    }
  };

  const handleChangeLocation = (e) => {
    const { name, value } = e.target;
    setFormLocation({
      ...formLocation,
      [name]: value,
    });
  };

  const handleUploadPhotos = (e) => {
    const newPhotos = Array.from(e.target.files); // Ensure it's an array
    setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
  };

  const handleDragPhoto = (result) => {
    if (!result.destination) return;

    const items = Array.from(photos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setPhotos(items);
  };

  const handleRemovePhoto = (indexToRemove) => {
    setPhotos((prevPhotos) =>
      prevPhotos.filter((_, index) => index !== indexToRemove)
    );
  };

  const [formDescription, setFormDescription] = useState({
    title: '',
    description: '',
    highlight: '',
    highlightDesc: '',
    price: 0,
  });

  const handlechangeDescription = (e) => {
    const { name, value } = e.target;
    setFormDescription({
      ...formDescription,
      [name]: value,
    });
  };

  const creatorId = useSelector((state) => state.user?._id);
  const navigate = useNavigate();

  useEffect(() => {
    if (!creatorId) {
      navigate('/login');
    }
  }, [creatorId, navigate]);

  const handlePost = async (e) => {
    e.preventDefault();

    if (!creatorId) {
      console.log('User not logged in');
      return;
    }

    try {
      const listingForm = new FormData();
      listingForm.append('creator', creatorId);
      listingForm.append('category', category);
      listingForm.append('type', type);
      listingForm.append('streetAddress', formLocation.streetAddress);
      listingForm.append('aptSuite', formLocation.aptSuite);
      listingForm.append('city', formLocation.city);
      listingForm.append('province', formLocation.province); // Correct key name
      listingForm.append('country', formLocation.country);
      listingForm.append('guestCount', guestCount);
      listingForm.append('bedroomCount', bedroomCount);
      listingForm.append('bedCount', bedCount);
      listingForm.append('bathroomCount', bathroomCount);
      listingForm.append('amenities', JSON.stringify(amenities)); // Send as JSON string
      listingForm.append('title', formDescription.title);
      listingForm.append('description', formDescription.description);
      listingForm.append('highlight', formDescription.highlight);
      listingForm.append('highlightDesc', formDescription.highlightDesc);
      listingForm.append('price', formDescription.price);

      photos.forEach((photo) => {
        listingForm.append('listingPhotos', photo);
      });

      const response = await fetch('http://localhost:4000/properties/create', {
        method: 'POST',
        body: listingForm,
      });

      const responseData = await response.json();
      if (response.ok) {
        navigate('/');
      } else {
        console.log('Error:', responseData);
      }
    } catch (err) {
      console.log('Publish Listing failed', err.message);
    }
  };
  return (
    <>
      <Navbar />

      <div className="create-listing">
        <h1>Publish your place</h1>
        <form action="" onSubmit={handlePost}>
          <div className="create-listing_step1">
            <h2>Step 1: Tell us about your place</h2>
            <hr />
            <h3>Which of these categories best describes your place?</h3>
            <div className="category-list">
              {
                categories?.map((item, index) => (
                  <div className={`category ${category ===item.label ? "selescted" : ""}`} key={index} onClick={()=>setCategory(item.label)}>
                    <div className='category_icon'>
                      {
                        item.icon
                      }
                    </div>
                    <p>{item.label}</p>
                  </div>
                ))
              }
            </div>

            <h3>What type of place will guests have?</h3>
            <div className="type-list">
              {
                types?.map((item, index) => (
                  <div className={`type ${type===type.name ? "selected" : ""}`} key={index} onClick={()=>setType(item.name)}>
                    <div className="type_text">
                      <h4>{item.name}</h4>
                      <p>{item.description}</p>
                    </div>
                    <div className="type_icons">
                      {
                        item.icon
                      }
                    </div>
                  </div>
                ))
              }
            </div>

            <h3>Where's your place located?</h3>
            <div className="full">
              <div className="location">
                <p>Street Address</p>
                <input type="text" placeholder='Street Address' name='streetAddress' value={formLocation.streetAddress} onChange={handleChangeLocation} required />
              </div>
            </div>

            <div className="half">
              <div className="location">
                <p>Apartment, suite, etc. (if applicable)</p>
                <input type="text" placeholder='Apt, suite, etc. (if applicable)' name='aptSuite' value={formLocation.aptSuite} onChange={handleChangeLocation} />
              </div>
              <div className="location">
                <p>City</p>
                <input type="text" placeholder='City' name='city' value={formLocation.city} onChange={handleChangeLocation} required />
              </div>
            </div>

            <div className="half">
              <div className="location">
                <p>Province</p>
                <input type="text" placeholder='Province' name='province' value={formLocation.province} onChange={handleChangeLocation} />
              </div>
              <div className="location">
                <p>Country</p>
                <input type="text" placeholder='Country' name='country' value={formLocation.country} onChange={handleChangeLocation} required />
              </div>
            </div>

            <h3>Share some basics about your place</h3>
            <div className="basics">
              <div className="basic">
                <p>Guests</p>
                <div className="basic_count">
                  <RemoveCircleOutline onClick={()=>setGuestCount(guestCount -1)} sx={{ fontSize: "25px", cursor: "pointer", color: "red" }} />
                  <p>{guestCount}</p>
                  <AddCircleOutline onClick={()=>setGuestCount(guestCount +1)} sx={{ fontSize: "25px", cursor: "pointer", color: 'red' }} />
                </div>
              </div>
              <div className="basic">
                <p>Bedrooms</p>
                <div className="basic_count">
                  <RemoveCircleOutline onClick={()=> 1 && setBedroomCount(bedroomCount -1)} sx={{ fontSize: "25px", cursor: "pointer", color: "red" }} />
                  <p>{bedroomCount}</p>
                  <AddCircleOutline onClick={()=>{setBedroomCount(bedroomCount +1)}} sx={{ fontSize: "25px", cursor: "pointer", color: 'red' }} />
                </div>
              </div>
              <div className="basic">
                <p>bed</p>
                <div className="basic_count">
                  <RemoveCircleOutline 
                  onClick={()=>{guestCount>1 && setBedCount(bedCount -1)}}
                   sx={{ fontSize: "25px", cursor: "pointer", color: "red" }} />
                  <p>{bedCount}</p>
                  <AddCircleOutline
                  onClick={()=>{setBedCount(bedCount + 1)}}
                   sx={{ fontSize: "25px", cursor: "pointer", color: 'red' }} />
                </div>
              </div>
              <div className="basic">
                <p>bathroom</p>
                <div className="basic_count">
                  <RemoveCircleOutline onClick={()=>setBathroomCount(bathroomCount -1)} sx={{ fontSize: "25px", cursor: "pointer", color: "red" }} />
                  <p>{bathroomCount}</p>
                  <AddCircleOutline onClick={()=>setBathroomCount(bathroomCount +1)} sx={{ fontSize: "25px", cursor: "pointer", color: 'red' }} />
                </div>
              </div>
            </div>
          </div>


          <div className="create-listing_step2">
            <h2>Step 2: Make your place stand out</h2>
            <br />
            <h3>Tell guests what your place has to offer</h3>
            <div className="amenities">
              {
                facilities?.map((item,index)=>(
                  <div className={`facility &{amenities.includes(item)? "selected" : ""`} key={index} onClick={()=>handleSelectAmenities(item)}>
                    <div className="facility _icon">
                      {item.icon}
                    </div>
                    <p>{item.name}</p>
                  </div>
                ))
              }

            </div>

            <h3>Add some photos of your place</h3>
            <DragDropContext onDragEnd={handleDragPhoto}>
              <Droppable droppableId='photos' direction='horizontal'>
                {
                  (provided)=>(
                    <div className="photos" {...provided.droppableProps} ref={provided.innerRef}>
                      {photos.length<1 && (
                        <>
                        <input id='image' type="file" style={{display:'none'}} accept='image/*' onChange={handleUploadPhotos} multiple />
                        <label htmlFor="image" className='alone'>
                          <div className="icon">
                          <IoIosImages/>
                          </div>
                          <p>Upload from your device</p>
                          
                        </label>
                        </>
                      )}
                      {photos.length >= 1 && (
                        <>
                        {photos.map((photo, index)=>{
                          return (
                            <Draggable key={index} draggableId={index.toString()} index={index}>
                              {(provided)=>(
                                <div className="photo" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                  <img src={URL.createObjectURL(photo)}  alt="place" />
                                  <button type='button' onClick={()=>handleRemovePhoto(index)} style={{color:"red",backgroundColor:'whitesmoke'}}>Remove </button>
                                </div>
                              )}
                            </Draggable>
                          )
                        })}


<input id='image' type="file" style={{display:'none'}} accept='image/*' onChange={handleUploadPhotos} multiple />
                        <label htmlFor="image" className='together'>
                          <div className="icon">
                          <IoIosImages/>
                          </div>
                          <p>Upload from your device</p>
                          
                        </label>
                        </>
                      )}

                    </div>

                  )
                }
              </Droppable>
            </DragDropContext>

            <h3>What make your place attractive  and exciting ?</h3>
            <div className="description">
              <p>Title</p>
              <input type="text" placeholder='Title' name='title' value={formDescription.title} onChange={handlechangeDescription} required />
              <p>Description</p>
              <input type="text" onChange={handlechangeDescription} placeholder='Description' value={formDescription.description} name='description' required />
              <p>HighLight</p>
              <input type="text" onChange={handlechangeDescription} placeholder='HighLight' value={formDescription.highlight} name='highlight' required />
              <p>Highlight details</p>
              <textarea type="text" onChange={handlechangeDescription} placeholder='High light deatails' value={formDescription.highlightDesc} name='highlightDesc' required / >
            </div> 
            <p>Now , set your PRICE</p>
            <span>$</span>
            <input type="number" onChange={handlechangeDescription} placeholder='100' value={formDescription.price} name='price' className='price' required />



 

          </div>





<button type='submit' className='submit_btn'>CREATE YOUR LISTING</button>
</form> 

      </div>
    </>
  )
}

export default Createlisting
