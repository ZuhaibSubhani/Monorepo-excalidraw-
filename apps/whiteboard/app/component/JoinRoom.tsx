"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { HTTP_BACKEND } from "@/config";
import { SidebarIcon } from "lucide-react";
function JoinRoom() {
  const [isOpen, setIsOpen] = useState(false);
  const [create, setCreate]=useState(false)
  
  return (
    <div className="space-x-4 relative">
      {/* Join Room Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="py-2 px-4 mx-2 bg-white text-black rounded-md hover:bg-slate-200 transition duration-300"
      >
        Join Room
      </button>
      <button
        onClick={() => setCreate(true)}
        className="py-2 px-4  bg-white text-black rounded-md hover:bg-slate-200 transition duration-300"
      >
        Create room
      </button>
     

      {/* Join Room Modal */}

      {isOpen && <Join setIsOpen={setIsOpen} />}
      {create && <Create setCreate={setCreate} />}
      
    </div>
  );
}

function Join({ setIsOpen }: { setIsOpen: (value: boolean) => void }) {
  const [room, setRoom]=useState("")
  const router=useRouter();
  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-md flex justify-center items-center"
      onClick={() => setIsOpen(false)} // Close when clicking outside
    >
      {/* Modal Box */}
      <div
        className="bg-white text-black p-6 rounded-lg shadow-lg w-96"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <h2 className="text-xl font-bold mb-4">Enter Room Code</h2>
        <input
          type="text"
          placeholder="Room Code"
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e)=>{
            setRoom(e.target.value)
          }}
        />
        <div className="flex justify-end mt-4 space-x-3">
          <button
            className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </button>
          <button
            onClick={()=>{
              router.push(`/canvas/${room}`)
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Join
          </button>
        </div>
      </div>
    </div>
  );
}

function Create({ setCreate }: { setCreate: (value: boolean) => void }) {
  const [room, setRoom]=useState("")
  const router=useRouter();
  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-md flex justify-center items-center"
      onClick={() => setCreate(false)} // Close when clicking outside
    >
      {/* Modal Box */}
      <div
        className="bg-white text-black p-6 rounded-lg shadow-lg w-96"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <h2 className="text-xl font-bold mb-4">Enter Room slug</h2>
        <input
          type="text"
          placeholder="Room Code"
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e)=>{
            setRoom(e.target.value)
          }}
        />
        <div className="flex justify-end mt-4 space-x-3">
          <button
            className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400"
            onClick={() => setCreate(false)}
          >
            Cancel
          </button>
          <button
            onClick={async()=>{
            await axios.post(`${HTTP_BACKEND}/room`,{
              slug:room
             },{
              headers:{
                Authorization:`Bearer ${await localStorage.getItem("token")}`
              }
             })
             router.push(`canvas/${room}`)
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}




export default JoinRoom;
