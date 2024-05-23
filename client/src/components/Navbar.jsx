import React, { useState } from 'react'
import { IconButton } from '@mui/material'
import { Search, Person, Menu } from '@mui/icons-material'
// import {variables} from '../style/Variables.css'
import '../style/Navbar.css'
import { useSelector,useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { setLogout } from '../redux/state'

function Navbar() {
    const [dropdownMenu, setdropdownMenu] = useState(false)
    const user = useSelector((state) => state.user)

    const dispatch=useDispatch( )

    return (
        <div className='navbar'>
            <a href="">
                <img src="../public/logo.png" alt="logo" />
            </a>
            <div className="navbar_search">
                <input type="text" placeholder='Search....' />
                <IconButton>
                    <Search  />
                </IconButton>
            </div>

            <div className='navbar_right'>
                {
                    user ? (
                        <a href="/create-listing">Become a Host</a>
                    ) : null
                }

                <button className='navbar_right_account' onClick={()=>setdropdownMenu(true)}>
                    <Menu/>
                    {
                        !user ? (
                            <Person style={{color:"darkgrayx"}} />
                        ) : (
                            // <img src={`http://localhost:4000/${user.profileImagePath.replace("public", "")}`} alt="profile photo" style={{ objectFit: "cover", borderRadius: "50%" }} />
                            <img
                            src={`http://localhost:4000/${user.profileImagePath.replace(
                              "public",
                              ""
                            )}`}
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
                            <Link to=''>Trip List</Link>
                            <Link to=''>Wish List</Link>
                            <Link to=''>Property List</Link>
                            <Link to=''>Reservation List</Link>
                            <Link to=''>Become A Host</Link>
                            <Link to='/login' onClick={()=>{
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
