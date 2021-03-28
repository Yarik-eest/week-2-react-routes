import React from 'react'
import { Link } from 'react-router-dom'

const DashBoardMain = () => {
  return (
    <div>
      <div id="title">Main</div>
      <Link to="/dashboard/profile/dda3ec26-90b3-4233-87cb-6a23f0e1faab">Go To Profile</Link>
      <Link to="/dashboard">Go To Root</Link>
    </div>
  )
}

DashBoardMain.propTypes = {}

export default DashBoardMain
