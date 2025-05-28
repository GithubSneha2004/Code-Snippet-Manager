import React from 'react'
import gifUrl from "../assets/login.gif"

export default function LoginReminder() {


    return (
      <div className="login-reminder container ">
        <h3>You are not logged in</h3>
        <p>Please log in to access this section.</p>
        <img src={gifUrl} alt="Login Reminder" />
      </div>
    );
}
