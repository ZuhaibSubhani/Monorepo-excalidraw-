import RoomCanvas from "@/app/component/RoomCanvas";
import { HTTP_BACKEND } from "@/config";
import axios from "axios";
async function getRoom(slug:string) {
    const response= await axios.get(`${HTTP_BACKEND}/room/${slug}`)
    console.log(response.data.id)
    return response.data.id
  
  }
export default async function Canvas({params}:{params:{
    slug:string
}}){
    console.log("params")
    console.log(await params)
    const slug=(await params).slug
    console.log("slug")
    console.log(slug)
    const roomId=await getRoom(slug)

   console.log(roomId)
    return <div>
        <RoomCanvas roomId={roomId}/>
    </div>
}