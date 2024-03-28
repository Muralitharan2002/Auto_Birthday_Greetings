import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../Components/Header'
import { Triangle } from "react-loader-spinner"

function Home() {
    // const token = useContext(AuthUserContext)
    // console.log(token)

    return (
        <>
            <div className="pt-lg-3 lg-page vh-100">
                <Header />
                <Outlet />
            </div>

        </>
    )
}

export default Home