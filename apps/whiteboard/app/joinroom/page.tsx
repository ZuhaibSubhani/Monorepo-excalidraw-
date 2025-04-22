"use client"
import { useRouter } from "next/navigation"
import { useRef } from "react"
function Page() {
    const router = useRouter()
    const slugRef = useRef<HTMLInputElement>(null);
  return (
    <div className='bg-black h-screen w-screen flex justify-center items-center '>
        <div>
           <input ref={slugRef} type="text" placeholder="room name" />
        </div>
        <div>
            <button className="bg-gray-50" onClick={()=>{
                router.push(`canvas/${slugRef.current}`)
            }}>join</button>
        </div>
    </div>
  )
}

export default Page
