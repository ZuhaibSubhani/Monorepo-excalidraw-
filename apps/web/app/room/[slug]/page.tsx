
import { BACKEND_URL } from "../../config";
import axios from "axios";
import { ChatRoom } from "../../components/ChatRoom";

async function getRoom(slug:string) {
  const response= await axios.get(`${BACKEND_URL}/room/${slug}`)
  console.log(response.data.id)
  return response.data.id

}

export default async function ChatRoom1({params}:{params:{slug:string}}){
const slug=(await params).slug;
console.log(slug)
const roomId = await getRoom(slug);



return <div>
    <ChatRoom id={roomId}/> 
</div>
}