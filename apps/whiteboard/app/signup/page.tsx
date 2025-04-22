"use client"
import axios from "axios";
import { useState } from "react";
import Link from "next/link";
import { HTTP_BACKEND } from "@/config";
export default function SignIn(){

    const [email,setEmail]=useState("");
    const [name,setName]=useState("");
    const [password,setPassword]=useState("")


    return <div className="bg-gradient-to-b from-gray-900 to-black h-screen w-screen flex justify-center items-center font-manrope">
        <div className="bg-gray-900 text-white rounded-md  inline-block p-4">
        <div className="text-3xl my-2 flex justify-center">SignUp</div>
        <div className="m-4 ">
            <div className="">
            <input className="rounded-sm px-2 bg-slate-300" type="text" placeholder="Email" onChange={(e)=>{
                setEmail(e.target.value)
            }}/>
            </div>
            <div className="py-2">
            <input className="rounded-sm px-2 bg-slate-300" type="text" placeholder="name" onChange={(e)=>{
                setName(e.target.value)
            }}/>
            </div>
            <div>
            <input className="rounded-sm px-2 bg-slate-300" type="password" placeholder="Password" onChange={(e)=>{
                setPassword(e.target.value)
            }}/>
            </div>
        </div>
        <div className="flex justify-center">

            <button className="py-2 px-4 bg-white text-black rounded hover:bg-slate-200 transition duration-300" onClick={()=>{
              const res= axios.post(`${HTTP_BACKEND}/signup`,{
                    email:email,
                    name:name,
                    password:password
                })
                alert(res)
            }}>SignUp</button>
            
        </div>
        <div>
                <Link href={"/signin"}>
                 Already have an account? Login</Link>
            </div>

        
    </div></div>
}