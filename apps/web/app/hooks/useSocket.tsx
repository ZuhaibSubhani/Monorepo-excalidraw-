"use client"
import { useEffect, useState } from "react";
import { WS_URL } from "../config";

export function useSocket(){
    const [loading,setLoading]=useState(true);
    const [socket,setSocket]=useState<WebSocket>()

    useEffect(()=>{
        const ws= new WebSocket(WS_URL+"?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3MzlkZmZjNi1kNDg4LTRhMGEtYThmMy00YjFjNWM3YzYwNTIiLCJpYXQiOjE3Mzk2MTQ5MTN9.4_CdqsMXT6vxHuaG3gYh5XgoseI8j-7PQfbrFve4eQU");
        ws.onopen=()=>{
            setLoading(false)
            setSocket(ws)
        }
    },[])
    return {
        socket,loading
    }
}