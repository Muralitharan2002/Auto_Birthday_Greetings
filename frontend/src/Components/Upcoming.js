import React, { useContext, useEffect, useState } from 'react'
import { LiaHourglassEndSolid } from "react-icons/lia";
import { BiSolidEditAlt } from "react-icons/bi";
import { RiDeleteBin5Fill } from "react-icons/ri";
import axios from 'axios';
import { Link } from 'react-router-dom';
import { url } from './url';
import { AuthUserContext } from '../App';
import { toast } from 'react-toastify';
import { Triangle } from "react-loader-spinner"
import EditReminder from './EditReminder';

function Upcoming() {
    const { token } = useContext(AuthUserContext)
    const [Events, setEvents] = useState([]);
    const [loader, setLoader] = useState(false)
    const [Edit, setEdit] = useState([])
    // console.log("Edit", Edit)

    const clearEdit = () => {
        setEdit([]);
    }

    const getEvents = async () => {
        setLoader(true)
        await axios.get(`${url}upcoming`, {
            headers: {
                "Content-Type": "application/json",
                "x-secure-auth": token
            },
            withCredentials: true
        })
            .then((res) => {
                if (res.data.status === "success") {
                    setEvents(res.data.Events)
                } else if (res.data.status === "warning") {
                    console.log(res.data)
                } else {
                    console.log(res.data)
                }
            })
            .catch((err) => {
                console.log(err)
            })
            .finally(() => {
                setLoader(false)
            })
    }

    const remove = async (key) => {
        await axios.delete(`${url}remove?target=${key}`, {
            headers: {
                "Content-Type": "application/json",
                "x-secure-auth": token
            },
            withCredentials: true
        }).then((res) => {
            if (res.data.status === "success") {
                getEvents()
                toast.success("Removed")
            } else {
                console.log(res.data)
            }
        })
            .catch((err) => {
                console.log(err)
            })
    }

    useEffect(() => {
        getEvents()
    }, [])



    return (
        <>
            {
                loader ?
                    <div className='d-flex align-items-center justify-content-center'>
                        <Triangle
                            visible={true}
                            height="70"
                            width="70"
                            color="#4fa94d"
                            ariaLabel="triangle-loading"
                            wrapperStyle={{}}
                            wrapperClass="load d-flex align-items-center justify-content-center"
                        />
                    </div>
                    :
                    <div className='position-relative'>

                        {
                            Edit.length === 0 ?
                                <>
                                    {
                                        Events.length !== 0 ?
                                            <>
                                                <div className='container mt-5 '>
                                                    <h3 className=' text-center mb-4 '>Upcoming Events</h3>
                                                    {Events.map((item, index) => (

                                                        <div key={index} className='mb-3 d-flex align-items-center justify-content-center' >
                                                            <div className='py-2 px-lg-4 px-2 col-lg-6 col-12 box d-flex align-items-center rounded-4 '>
                                                                <div className='profile'>
                                                                    <img src={item.profileUrl} alt="profile_image" />
                                                                </div>
                                                                <div className='ms-lg-4 ms-2 col d-flex align-items-center justify-content-between '>
                                                                    <div className=' d-flex  flex-column'>
                                                                        <div className='fw-bold'>{item.personName}</div>
                                                                        <div className='d-flex'>
                                                                            {item.day2go === 1 ? (<div className='size'>tomorrow</div>) :
                                                                                (<div className='size '>{item.day2go} days to go</div>)}
                                                                            <div className='ms-lg-4 ms-2  size status'>
                                                                                <LiaHourglassEndSolid />
                                                                                {item.status}
                                                                            </div>

                                                                        </div>
                                                                    </div>
                                                                    <div className=' align-items-end fw-bold d-flex gap-3'>
                                                                        <BiSolidEditAlt className='icon1' onClick={() => setEdit(item)} />
                                                                        <RiDeleteBin5Fill className='icon2' onClick={() => remove(item._id)} />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                            :
                                            <div className='container d-flex align-items-center justify-content-center mt-5'>
                                                <div>
                                                    <h2 className=' mt-5 text-center'>No upcoming Events!</h2>
                                                    <center>
                                                        <button className='btn btn-primary fw-medium m-2 mt-lg-4'>
                                                            <Link to={"/home/add_events"} className=" text-decoration-none text-light">Add Events</Link>
                                                        </button>
                                                    </center>
                                                </div>
                                            </div>
                                    }
                                </>
                                :
                                <div className=' position-absolute top-0 w-100'>
                                    <EditReminder item={Edit} Clear={clearEdit} getEvents={getEvents} />
                                </div>
                        }
                    </div >
            }
        </>
    )
}

export default Upcoming