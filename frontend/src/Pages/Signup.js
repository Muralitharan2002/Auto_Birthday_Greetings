import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { url } from '../Components/url';
import axios from "axios"
import { toast } from 'react-toastify';
import { Triangle } from "react-loader-spinner"

function Signup() {
    const navigate = useNavigate();
    const [loader, setLoader] = useState(false)
    const [Name, setName] = useState("");
    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoader(true)
        await axios.post(`${url}create`, { Name, Email, Password }, { withCredentials: true })
            .then((res) => {
                if (res.data.status === "success") {
                    // console.log(res.data.status)
                    toast.success("Done 👍")
                    navigate("/")
                } else if (res.data.status === "warning") {
                    // console.log(res.data.status)
                    toast.warning("Already you Created")
                    navigate("/")
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
            <div className='lg-page vh-100 d-flex align-items-center justify-content-center ' >
                <div className='container d-flex align-items-center justify-content-center'>
                    <form className=' col-lg-4 col-md-8 col-11 ' onSubmit={handleSubmit}>
                        <h2 className=' text-center pb-2 '> Auto Birthday Greets</h2>
                        <h2 className=' text-center pb-2'>Sign up</h2>
                        <div className="mb-4">
                            <label className="form-label">Name</label>
                            <input type="text" className="form-control" value={Name} onChange={(e) => setName(e.target.value)} required />
                        </div>
                        <div className="mb-4">
                            <label className="form-label">Email address</label>
                            <input type="email" className="form-control" value={Email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="mb-4">
                            <label className="form-label">Password</label>
                            <input type="password" className="form-control" value={Password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>

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
                                    <button type="submit" className="btn btn-primary">Sign up</button>
                            }
                        </center>

                        <p className='mt-4 text-center'>Already have an account ? <Link to={"/"} className=' text-dark'>Sign in</Link> here</p>
                    </form>
                </div>
            </div>

        </>
    )
}

export default Signup