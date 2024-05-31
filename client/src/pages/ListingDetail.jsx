import React, { useEffect, useState } from 'react';
// import '../style/ListingDetail.css';
import '../style/ListingDatail.css'
import { useParams, useNavigate } from 'react-router-dom';
import { facilities } from '../data';
import 'react-date-range/dist/theme/default.css';
import { DateRange } from 'react-date-range';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import { useSelector } from 'react-redux';
import Footer from '../components/Footer';

const ListingDetails = () => {
  const [loading, setLoading] = useState(true);
  const { listingId } = useParams();
  const [listing, setListing] = useState(null);

  const getListingDetails = async () => {
    try {
      const response = await fetch(`http://localhost:4000/properties/${listingId}`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setListing(data);
    } catch (err) {
      console.error("Fetch Listing Details Failed", err.message);
      alert("Failed to fetch listing details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getListingDetails();
  }, [listingId]);

  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const handleSelect = (ranges) => {
    setDateRange([ranges.selection]);
  };

  const start = new Date(dateRange[0].startDate);
  const end = new Date(dateRange[0].endDate);
  const dayCount = Math.round((end - start) / (1000 * 60 * 60 * 24)); 

  const customerId = useSelector((state) => state?.user?._id);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const bookingForm = {
        customerId,
        listingId,
        hostId: listing?.creator?._id,
        startDate: dateRange[0].startDate.toDateString(),
        endDate: dateRange[0].endDate.toDateString(),
        totalPrice: listing.price * dayCount,
      };

      const response = await fetch("http://localhost:4000/bookings/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingForm),
      });

      if (response.ok) { 
        navigate(`/${customerId}/trips`);
      } else {
        throw new Error('Booking failed');
      }
    } catch (err) {
      console.log("Submit Booking Failed.", err.message);
      alert("Failed to submit booking. Please try again later.");
    }
  };

  return loading ? (
    <Loader />  
  ) : (
    <>
      <Navbar />
      <div className="listing-details">
        <div className="title">
          <h1>{listing.title}</h1>
        </div>
        <div className="photos">
          {listing.listingPhotoPaths?.map((item, index) => (
            <img
              key={index}
              src={`http://localhost:4000/${item.replace("public", "")}`}
              alt="listing photo"
            />
          ))}
        </div>
        <h2>
          {listing.type} in {listing.city}, {listing.province}, {listing.country}
        </h2>
        <p>
          {listing.guestCount} guests - {listing.bedroomCount} bedroom(s) - {listing.bedCount} bed(s) - {listing.bathroomCount} bathroom(s)
        </p>
        <hr />
        <div className="profile">
          <img
            src={`http://localhost:4000/${listing.creator.profileImagePath.replace("public", "")}`}
            alt="host profile"
          />
          <h3>
            Hosted by {listing.creator.firstName} {listing.creator.lastName}
          </h3>
        </div>
        <hr />
        <h3>Description</h3>
        <p>{listing.description}</p>
        <hr />
        <h3>{listing.highlight}</h3>
        <p>{listing.highlightDesc}</p>
        <hr />
        <div className="booking">
          <div>
            <h2>What this place offers?</h2>
            <div className="amenities">
              {listing.amenities.map((item, index) => {
                const facility = facilities.find(facility => facility.name === item);
                return (
                  <div className="facility" key={index}>
                    <div className="facility_icon">
                      {facility && facility.icon && React.isValidElement(facility.icon) ? facility.icon : null}
                    </div>
                    <p>{item.name}</p>
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            <h2>How long do you want to stay?</h2>
            <div className="date-range-calendar">
              <DateRange ranges={dateRange} onChange={handleSelect} />
              <h2>${listing.price} x {dayCount} {dayCount > 1 ? 'nights' : 'night'}</h2>
              <h2>Total price: ${listing.price * dayCount}</h2>
              <p>Start Date: {dateRange[0].startDate.toDateString()}</p>
              <p>End Date: {dateRange[0].endDate.toDateString()}</p>
              <button className="button" type="submit" onClick={handleSubmit}>BOOKING</button>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default ListingDetails;
