import React, { useState, useEffect } from 'react';
import { categories } from '../data';
import '../style/Listings.css';
import Loader from './Loader';
import { useDispatch, useSelector } from 'react-redux';
import { setListing } from '../redux/state';
import ListingCard from './ListingCard';

function Listings() {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const listings = useSelector((state) => state.listings);

    const getfeedListings = async () => {
        try {
            const response = await fetch(
                selectedCategory !== "All"
                    ? `http://localhost:4000/properties?category=${selectedCategory}`
                    : "http://localhost:4000/properties",
                {
                    method: "GET",
                }
            );

            const data = await response.json();
            dispatch(setListing({ listings: data }));
            setLoading(false);
        } catch (error) {
            console.log("Fetched listing failed", error.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        getfeedListings();
    }, [selectedCategory]);

    if (loading) {
        return <Loader />;
    }

    return (
        <div>
            <div className='category-list'>
                {categories?.map((category, index) => (
                    <div
                        className="category"
                        key={index}
                        onClick={() => setSelectedCategory(category.label)}
                    >
                        <div className="category_icon">{category.icon}</div>
                        <p>{category.label}</p>
                    </div>
                ))}
            </div>
            <div className="listing">
                {listings.map((
                    {
                        _id,
              creator,
              listingPhotoPaths,
              city,
              province,
              country,
              category,
              type,
              price,
              booking=false
                    }
                ) => (
                    <ListingCard 
                    listingId={_id}
                    creator={creator}
                    listingPhotoPaths={listingPhotoPaths}
                    city={city}
                    province={province}
                    country={country}
                    category={category}
                    type={type}
                    price={price}
                    booking={booking}
                    />
                ))}
            </div>
        </div>
    );
}

export default Listings;
