import React, { useContext, useEffect, useState } from 'react'
import { BiMailSend } from "react-icons/bi";
import { AuthUserContext } from '../App';
import { url } from './url';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Triangle } from "react-loader-spinner"
import { BiSolidEditAlt } from "react-icons/bi";
import { RiDeleteBin5Fill } from "react-icons/ri";
import EditReminder from './EditReminder';


function TodayEvents() {
    const { token } = useContext(AuthUserContext)
    const [Events, setEvents] = useState([]);
    const [loader, setLoader] = useState(false)
    const [Edit, setEdit] = useState([])
    // console.log("events", Events)

    const getEvents = async () => {
        setLoader(true)
        await axios.get(`${url}today`, {
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

    const clearEdit = () => {
        setEdit([]);
    }

    useEffect(() => {
        getEvents()
    }, [])

    return (
        <>{loader ?
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
                                    <div className='container layout1 '>
                                        <h3 className=' text-center mb-4 '>Today Events</h3>
                                        {Events.map((item, index) => (
                                            <div key={index} className='mb-3 d-flex align-items-center justify-content-center'>
                                                <div className='py-2 px-4 col-lg-6 col-12 box d-flex align-items-center rounded-4 '>
                                                    <div className='profile'>
                                                        <img src={item.profileUrl} alt="" />
                                                    </div>
                                                    <div className='ms-4 col d-flex align-items-center justify-content-between '>
                                                        <div className=' d-flex  flex-column'>
                                                            <div className='fw-bold'>{item.personName}</div>
                                                            <div className='d-flex  '>
                                                                {item.day2go === 0 ? (<div className='size'>today</div>) :
                                                                    (<div className='size'>{item.day2go}</div>)}
                                                                <div className='ms-4 size color'>
                                                                    <BiMailSend className='me-2' />
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
                                    :
                                    <>
                                        <div className='d-flex align-items-center justify-content-center mt-5'>
                                            <h2 className=' mt-5'>Today you have no birthday events!</h2>
                                        </div>
                                    </>
                            }
                        </>
                        :
                        <div className=' position-absolute top-0 w-100  '>
                            <EditReminder item={Edit} Clear={clearEdit} getEvents={getEvents} />
                        </div>
                }

            </div>
        }



        </>
    )
}

export default TodayEvents