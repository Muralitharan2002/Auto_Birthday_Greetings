import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios';
import { url } from './url';
import { AuthUserContext } from '../App';
import { Triangle } from "react-loader-spinner"
import { Link } from 'react-router-dom';

function Intro() {
    const { token } = useContext(AuthUserContext)
    console.log("token got", token)
    const [Name, setName] = useState("")
    const [loader, setLoader] = useState(true)

    const Authuser = async () => {
        const tokens = token;
        await axios.get(`${url}user`, {
            headers: {
                "Content-Type": "application/json",
                "x-secure-auth": tokens
            },
            withCredentials: true
        })
            .then((res) => {
                if (res.data.status === "success") {
                    console.log(res.data.Name)
                    setName(res.data.Name)
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

    useEffect(() => {
        Authuser()
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
                    <div className='container mt-lg-5 mt-4 d-flex align-items-center justify-content-center '>
                        <div className='container col-lg-10 col-12 text-center'>
                            <h4>Hello, {Name}</h4>
                            <h4>Welcome to Automate Birthday Greetings</h4>
                            <h5 className='mt-lg-4 mt-3'>Never Miss a Birthday you loved one!</h5>
                            <p className='mt-lg-4 mt-3' style={{ fontSize: "17px", fontWeight: "500" }}>
                                Ever struggled to remember your friends' birthdays and send them heartfelt greetings on time? Say goodbye to that hassle with our automated birthday greeting system.

                                At BirthdayGreets, we understand the importance of celebrating those special moments. Our platform allows users to effortlessly manage their friends' birthdays by simply adding their names, email addresses, and birthdates. Once added, our backend system takes care of the rest.

                                Using advanced cron technology, our backend continuously monitors the birthdays of everyone on your list. As soon as the special day arrives, our system springs into action, sending personalized birthday greetings and exclusive coupons directly to your friends' email inboxes.

                                But the magic doesn't stop there. Each greeting email contains a unique link and coupon code, allowing the birthday boy or girl to claim their wishes with a simple click. It's a seamless and delightful experience that ensures your loved ones feel cherished on their big day.

                                With BirthdayGreets, never miss another birthday again. Join us and spread joy one birthday at a time.
                            </p>

                            <button className='btn btn-primary fw-medium m-2 mt-lg-4'><Link to={"/home/add_events"} className=" text-decoration-none text-light">Send Greets</Link></button>
                        </div>
                    </div>
            }
        </>
    )
}

export default Intro