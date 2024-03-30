import axios from 'axios'
import React, { useContext, useState } from 'react'
import { url } from './url'
import { AuthUserContext } from '../App'
import { toast } from 'react-toastify'
import { Triangle } from "react-loader-spinner"

function AddReminder() {
    const { token } = useContext(AuthUserContext)
    const [loader, setLoader] = useState(false)
    const [Name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [dob, setDOB] = useState("")
    const [file, setFile] = useState(null)

    const clearState = () => {
        setName("");
        setEmail("");
        setDOB("");
        setFile(null);
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("Name", Name)
        formData.append("email", email)
        formData.append("dob", dob)
        formData.append("file", file)
        for (const key of formData.values()) {
            console.log(key);
        }
        setLoader(true)
        await axios.post(`${url}add`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "x-secure-auth": token
            },
            withCredentials: true
        })
            .then((res) => {
                if (res.data.status === "success") {
                    toast.success("Reminder saved")
                    clearState()
                } else if (res.data.status === "warning") {
                    toast.success("Already Remindered")
                    clearState()
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
            <div className=' container mt-5 d-flex align-items-center justify-content-center'>
                <div className=' container form col-lg-5 col-12 py-4 px-lg-4 rounded-4 '>
                    <h3 className=' text-center'>Add Events</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="my-4">
                            <label className="form-label">Name</label>
                            <input type="text" className="form-control border-2" value={Name} onChange={(e) => setName(e.target.value)} required />
                        </div>
                        <div className="mb-4">
                            <label className="form-label">Email</label>
                            <input type="email" className="form-control border-2" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="mb-4">
                            <label className="form-label">DOB</label>
                            <input type="date" className="form-control border-2" value={dob} onChange={(e) => setDOB(e.target.value)} required />
                        </div>
                        <div className=" mb-4">
                            <label className="form-label">Upload Photo</label>
                            <input type="file" className="form-control border-2" onChange={(e) => setFile(e.target.files[0])} />
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
                                    <button type="submit" className="btn btn-primary">Set Event</button>
                            }
                        </center>
                    </form>
                </div>
            </div>
        </>
    )
}

export default AddReminder