import React, { useContext } from 'react'
import { AuthContext } from '../Context/AuthProvidor'

const useAuthInfo = () => {
   
  return (
    useContext(AuthContext)
  )
}

export default useAuthInfo