import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
const Logout = () => {

  const token = localStorage.getItem("token")
  const navigate = useNavigate()

  axios.post(`${import.meta.env.VITE_BASE_URL}/api/v1/users/logout`, {
    headers:{
      Authorization: `Bearer ${token}`
    }
  }).then((response) => {
    if(response.status === 200 || response.status === 201){
      localStorage.removeItem("token")
      navigate("/user/home")
    }
  })
  return (
    <div>User Logged Out successfully...</div>
  )
}

export default Logout