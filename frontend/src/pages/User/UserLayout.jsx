import Header from '@/components/Header'
import Login from '@/components/Login'
import React from 'react'
import { Routes, Route,Link } from 'react-router-dom'
const UserLayout = () => {
  return (
    <div>
        <Header />
        <Link to={"/user/login"}><Login /></Link>
    </div>
  )
}

export default UserLayout