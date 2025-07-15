import React, { createContext, useState, useEffect } from "react"
import axios from "axios"

export const UserContext = createContext()

export const UserProvider = ({ children }) => {
    const user = JSON.parse(localStorage.getItem('user')) || {}
    const [userProfile, setUserProfile] = useState({})

    const fetchProfile = async () => {
        try {
            const res = await axios.get(`http://localhost:9999/users/${user.id}`)
            setUserProfile(res.data)
        } catch (error) {
            console.error("Error fetching user profile:", error)
        }
    }

    useEffect(() => {
        if (user?.id) {
            fetchProfile()
        }
    }, [user?.id])
    console.log("user ", user, "User Profile:", userProfile)

    return (
        <UserContext.Provider value={{ userProfile, fetchProfile }}>
            {children}
        </UserContext.Provider>
    )
}
