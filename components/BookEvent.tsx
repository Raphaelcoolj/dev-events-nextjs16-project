"use client"

import { useState } from "react"



const BookEvent = () => {

    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you can handle the booking logic, e.g., send the email to the server
        //console.log("Booking submitted for email:", email);
        setTimeout(() => {
            setSubmitted(true);
        }, 1000)
    }


  return (
    <div id="book-event">
        {submitted ? (
            <p className="text-sm">Thank you for booking your spot!</p>
        ) : (
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email Address</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} id="email" placeholder="Enter you Email address" />

                </div>
                <button type="submit" className="button-submit">Submit</button>
            </form>
        )}
    </div>
  )
}

export default BookEvent