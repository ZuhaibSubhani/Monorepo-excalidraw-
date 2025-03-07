"use client"
import axios from "axios";
import { useState } from "react";
import Link from "next/link";
import { HTTP_BACKEND } from "@/config";
import { useRouter } from "next/navigation";
export default function SignIn(){

    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("")
    const router=useRouter()


    return <div className="bg-gradient-to-b from-gray-900 to-black h-screen w-screen flex justify-center items-center rounded-md">
        <div className="bg-gray-900 text-white inline-block p-4 ">
        <div className="text-3xl my-2 flex justify-center">SignIn</div>
        <div className="m-4 ">
            <div className="py-2">
            <input className="rounded-sm px-2 text-black" type="text" placeholder="Email" onChange={(e)=>{
                setEmail(e.target.value)
            }}/>
            </div>
           
            <div>
            <input  className="rounded-sm px-2 text-black"  type="password" placeholder="Password" onChange={(e)=>{
                setPassword(e.target.value)
            }}/>
            </div>
        </div>
        <div className="flex justify-center">

            <button className="py-2 px-4 bg-white text-black rounded hover:bg-slate-200 transition duration-300"  onClick={async()=>{
              const res=await axios.post(`${HTTP_BACKEND}/signin`,{
                    email:email,      
                    password:password
                })
                const token=res.data?.token
                if(token){
                    localStorage.setItem("token",token)
                    console.log(token)
                    router.push('/')
                    }
                
            }}>SignIn</button>
            

        </div>
        <div className="flex justify-center">
                <Link href={"/signup"}>dont have a account? signup</Link>
            </div>
        
    </div></div>
}