import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../Components/Header'

function Home() {

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