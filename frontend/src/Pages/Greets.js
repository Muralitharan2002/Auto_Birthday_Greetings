// import React from 'react'

// function Greets() {
//     return (
//         <div className='lg-page vh-100'>
//             <div>Greets</div>
//         </div>
//     )
// }

// export default Greets


import React, { useState } from 'react'
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'

const Greets = () => {
    const { width, height } = useWindowSize()
    const [code, setCode] = useState("")
    const [show, setShow] = useState(true);
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
                            <h2 className='text-center mb-4'>🎉 Happy Birthday, name! 🎂</h2>
                            <div className=' fw-medium'>
                                Wishing you a day filled with laughter, love, and unforgettable moments. May this year be the start of something beautiful and exciting for you. Dream big, smile often, and never stop believing in yourself. You're amazing just the way you are!
                            </div>
                            <div className=' mt-3 mb-4  fw-medium'>
                                🎈 Cheers to another year of adventures, growth, and making memories. May your birthday be as special and wonderful as you are!
                            </div>
                            <div className='text-center fw-medium '>
                                Best wishes,
                                <br />
                                [Your Name]
                            </div>
                        </div>
                            :
                            <div className=' col-12'>
                                <h3 className='text-center fw-medium '>Enter the coupon</h3>
                                <input type="text" className="form-control mt-3" value={code} onChange={(e) => setCode(e.target.value)} required />
                                <center><button type="submit" className="btn btn-primary mt-3">check</button></center>
                            </div>
                        }
                    </div>
                </div>
            </div>

        </>
    )
}






export default Greets
