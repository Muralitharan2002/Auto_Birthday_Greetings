import axios from 'axios'
import React, { useContext, useState } from 'react'
import { url } from './url'
import { AuthUserContext } from '../App'
import { toast } from 'react-toastify'

function EditReminder({ item, Clear, getEvents }) {
    const { token } = useContext(AuthUserContext)

    const date = new Date(item.dob).toLocaleDateString();
    // console.log(date)
    const newformat = date.split("/")
    // console.log(newformat)
    const newDate = `${newformat[2]}-${newformat[0].length === 1 ? "0" + newformat[0] : newformat[0]}-${newformat[1].length === 1 ? "0" + newformat[1] : newformat[1]}`
    // console.log(newDate)

    const [Name, setName] = useState(item.personName)
    const [email, setEmail] = useState(item.email)
    const [dob, setDOB] = useState(newDate)
    const [file, setFile] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("Name", Name)
        formData.append("email", email)
        formData.append("dob", dob)
        formData.append("file", file)
        // for (const key of formData.values()) {
        //     console.log(key);
        // }
        await axios.put(`${url}changes?target=${item._id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "x-secure-auth": token
            },
            withCredentials: true
        })
            .then((res) => {
                if (res.data.status === "success1") {
                    toast.success("Updated")
                } else if (res.data.status === "success2") {
                    toast.success("No Changes!")
                } else {
                    console.log(res.data)
                }
            })
            .catch((err) => {
                console.log(err)
            })
            .finally(() => {
                getEvents()
                Clear()
            })
    }

    return (
        <>
            <div className=' container layout d-flex align-items-center justify-content-center'>
                <div className=' container form col-lg-5 col-12 py-4 px-lg-4 rounded-4 '>
                    <h3 className=' text-center'>Edit Events</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="my-4">
                            <label className="form-label">Name</label>
                            <input type="text" className="form-control border-2" value={Name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="mb-4">
                            <label className="form-label">Email</label>
                            <input type="email" className="form-control border-2" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="mb-4">
                            <label className="form-label">DOB</label>
                            <input type="date" className="form-control border-2" value={dob} onChange={(e) => setDOB(e.target.value)} />
                        </div>
                        <div className=" mb-4">
                            <label className="form-label">Upload Photo</label>
                            <input type="file" className="form-control border-2" onChange={(e) => setFile(e.target.files[0])} />
                        </div>
                        <center> <button type="button" className="btn btn-primary me-3" onClick={() => Clear()}>Cancel</button>
                            <button type="submit" className="btn btn-primary">Update</button>
                        </center>
                    </form>
                </div>
            </div>
        </>
    )
}

export default EditReminder