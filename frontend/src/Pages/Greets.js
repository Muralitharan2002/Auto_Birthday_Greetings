import React, { useState, } from 'react'
import { useParams } from 'react-router-dom';
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'
import axios from 'axios';
import { url } from '../Components/url';
import { toast } from 'react-toastify';
import { Triangle } from "react-loader-spinner"

const Greets = () => {
    const { _id, _idO, name } = useParams()
    const { width, height } = useWindowSize()
    const [code, setCode] = useState("")
    const [show, setShow] = useState(false);
    const [sender, setsender] = useState("")
    const [loader, setLoader] = useState(false)


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoader(true)
        await axios.post(`${url}greet`, { _id, _idO, code }, { withCredentials: true })
            .then((res) => {
                if (res.data.status === "success") {
                    setsender(res.data.Data.senderName)
                    setShow(true)
                } else if (res.data.status === "warnings") {
                    toast.warning("Invalid coupon")
                } else if (res.data.status === "warning") {
                    toast.warning("coupon Expired")
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

    return (
        <>
            <div className='lg-page overflow-hidden  vh-100 d-flex align-items-center justify-content-center'>
                {show && <Confetti
                    width={width}
                    height={height}
                    numberOfPieces={100}
                />}
                <div className='container  d-flex  justify-content-center'>
                    <div className=' greet rounded-4 p-4 d-flex align-items-center justify-content-center'>
                        {show ? <div className=''>
                            <h2 className='text-center mb-4'>🎉 Happy Birthday, {name} 🎂</h2>
                            <div className=' fw-medium'>
                                Wishing you a day filled with laughter, love, and unforgettable moments. May this year be the start of something beautiful and exciting for you. Dream big, smile often, and never stop believing in yourself. You're amazing just the way you are!
                            </div>
                            <div className=' mt-3 mb-4  fw-medium'>
                                🎈 Cheers to another year of adventures, growth, and making memories. May your birthday be as special and wonderful as you are!
                            </div>
                            <div className='text-center fw-medium '>
                                Best wishes,
                                <br />
                                {sender}
                            </div>
                        </div>
                            :
                            <div className=' col-12'>
                                <form onSubmit={handleSubmit}>
                                    <h3 className='text-center fw-medium '>Enter the coupon</h3>
                                    <input type="text" className="form-control m-3" value={code} onChange={(e) => setCode(e.target.value)} required />
                                    <center>
                                        {
                                            loader ?
                                                <Triangle
                                                    visible={true}
                                                    height="40"
                                                    width="40"
                                                    color="#4fa94d"
                                                    ariaLabel="triangle-loading"
                                                    wrapperStyle={{}}
                                                    wrapperClass="d-flex align-items-center justify-content-center"
                                                />
                                                :
                                                <button type="submit" className="btn btn-primary">Open</button>
                                        }
                                    </center>
                                </form>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}






export default Greets
