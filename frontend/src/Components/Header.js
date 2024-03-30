import React, { useContext } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import { MdOutlineLogout } from "react-icons/md";
import axios from 'axios';
import { url } from './url';
import { AuthUserContext } from '../App';
import { toast } from 'react-toastify';

function Header() {
    const navigate = useNavigate()
    const { token } = useContext(AuthUserContext)
    const logout = async () => {
        await axios.post(`${url}logout`, {}, {
            headers: {
                "Content-Type": "application/json",
                "x-secure-auth": token
            },
            withCredentials: true
        })
            .then((res) => {
                if (res.data.status === "success") {
                    sessionStorage.clear()
                    navigate("/")
                    toast.success("logout")
                } else {
                    console.log(res.data)
                }
            })
            .catch((err) => {
                console.log(err)
            })

    }

    return (
        <>

            <nav className="navbar container-lg navbar-expand-lg p-2 header rounded-3 position-sticky top-0 z-3 ">
                <div className="container-lg">
                    <div className="navbar-brand fw-bolder title" href="#">BirthdayGreets</div>

                    <div className="offcanvas offcanvas-end bg" tabindex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
                        <div className="offcanvas-header">
                            {/* <p className='navbar-nav me-auto profile'>
                                M
                            </p> */}
                            <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                        </div>
                        <div className="offcanvas-body">
                            <ul className="navbar-nav justify-content-center flex-grow-1 pe-3">
                                <li className="nav-item pe-3">
                                    <NavLink to={"/home"} className="nav-link">Home</NavLink>
                                </li>
                                <li className="nav-item pe-3">
                                    <NavLink to={"/home/add_events"} className="nav-link" >Add Events</NavLink>
                                </li>
                                <li className="nav-item pe-3">
                                    <NavLink to={"/home/today_events"} className="nav-link" >Today Events</NavLink>
                                </li>
                                <li className="nav-item pe-3">
                                    <NavLink to={"/home/upcoming"} className="nav-link" >Upcoming Events</NavLink>
                                </li>
                            </ul>
                        </div>
                    </div>



                    <div className="navbar-nav ms-auto me-lg-4 me-2 fs-4 point">
                        <MdOutlineLogout onClick={logout} />
                    </div>

                    <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                </div>
            </nav>
        </>
    )
}

export default Header