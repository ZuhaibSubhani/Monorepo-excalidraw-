"use client"
import { useEffect, useState } from "react"
import { NavComponent } from "./NavComponent"
import JoinRoom from "./JoinRoom"
function IsLogged() {
   
    const [token,setToken]=useState<string|null>(null)



    useEffect(()=>{
        setToken(localStorage.getItem("token"))
        
    },[])
   
    if(token){
        return <div className="flex">
            <JoinRoom/>
            <button className="py-2 px-4 mx-4 border-2 border-gray-700 rounded-lg text-gray-700 hover:bg-gray-900 transition duration-300 text-white " onClick={()=>{
              localStorage.removeItem("token")
              setToken(null)
              }}>
              logout
            </button>
        </div>
    }
  return (
    <div>
      <NavComponent/>
    </div>
  )
}

export default IsLogged
