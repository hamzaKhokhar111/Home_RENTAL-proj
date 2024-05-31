import React, { useState } from 'react'
import { IconButton } from '@mui/material'
import { Search, Person, Menu } from '@mui/icons-material'
import '../style/Navbar.css'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { setLogout } from '../redux/state'

function Navbar() {
    const [dropdownMenu, setDropdownMenu] = useState(false)
    const user = useSelector((state) => state.user)
    const [search, setSearch] = useState("")
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Handle click event for search
    const handleSearch = () => {
        if (search.trim() !== '') {
            navigate(`/properties/search/${search}`)
        }
    }

    return (
        <div className='navbar'>
            <a href="/">
                <img src="/logo.png" alt="logo" />
            </a>
            <div className="navbar_search">
                <input type="text" placeholder='Search....' value={search} onChange={(e) => setSearch(e.target.value)} />
                <IconButton disabled={search.trim() === ''} onClick={handleSearch}>
                    <Search />
                </IconButton>
            </div>

            <div className='navbar_right'>
                {
                    user ? (
                        <Link to='/create-listing'>Become a Host</Link>
                    ) : null
                }

                <button className='navbar_right_account' onClick={() => setDropdownMenu(true)}>
                    <Menu />
                    {
                        !user ? (
                            <Person style={{ color: "darkgray" }} />
                        ) : (
                            <img
                                src={`http://localhost:4000/${user.profileImagePath.replace("public", "")}`}
                                alt="profile photo"
                                style={{ objectFit: "cover", borderRadius: "50%" }}
                            />
                        )
                    }
                </button>
                {
                    dropdownMenu && !user &&
                    (
                        <div className="navbar_right_accountmenu">
                            <Link to='/login'>Log in</Link>
                            <Link to='/register'>Sign up</Link>
                        </div>
                    )
                }

                {
                    dropdownMenu && user && (
                        <div className="navbar_right_accountmenu">
                            <Link to={`/${user._id}/trips`}>Trip List</Link>
                            <Link to={`/${user._id}/wishList`}>Wish List</Link>
                            <Link to={`/${user._id}/properties`}>Property List</Link>
                            <Link to={`/${user._id}/reservations`}>Reservation List</Link>
                            <Link to="/create-listing">Become A Host</Link>
                            <Link to='/login' onClick={() => {
                                dispatch(setLogout())
                            }}>Log Out</Link>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default Navbar
