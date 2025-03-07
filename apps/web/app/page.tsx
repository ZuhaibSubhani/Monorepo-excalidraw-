"use client"
import { useState } from "react";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";


export default function Home() {
  const [roomId,setRoomId]=useState("")
  const router=useRouter()
  return (
    <div className={styles.page}>

    <input type="text" placeholder="room Id" onChange={e=>
      setRoomId(e.target.value)
    }></input>

    <button onClick={()=>{
      router.push(`/room/${roomId}`)
    }}>join room</button>

    </div>
  );
}
