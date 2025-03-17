import  express from 'express';
import { authMiddleware } from './authMiddleware';
import {prismaClient} from '@repo/db/client' 
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@repo/common/config';
import cors from 'cors'



const app=express();
app.use(cors())
app.use(express.json())
app.post('/signup',async(req,res)=>{
   const {email,password,name}=req.body;

   try {
      const user=await prismaClient.user.create({
         data:{
            email,
            password,
            name

         }
      })
      const token =jwt.sign({userId:user?.id},JWT_SECRET)
      res.json({token})
   } catch (error) {
      res.status(411).json({message:"some error"})
   }

})

app.post('/signin',async(req,res)=>{
    const {email,password }=req.body;
    try {
      const user=await prismaClient.user.findFirst({where:{email,password}})
      if(!user){
         res.status(403).json({message:"not authorized"})
      }
      const token=jwt.sign({userId:user?.id},JWT_SECRET)
      res.json({token})
    } catch (error) {
      res.status(411).json({message:"exception error"})   
    }
 
 })

 app.post('/room',authMiddleware,async(req,res)=>{
    const { slug}=req.body;
    //@ts-ignore
    const userId=req.userId
    try {
      
      const room=await prismaClient.room.create({
         data:{
            slug,
            adminId:userId
         }
      })
      res.json({roomId:room.id})
    } catch (error) {
      
    }
 
 })

 app.get('/chats/:roomId',async(req,res)=>{
   const roomId=Number(req.params.roomId);
   const messages=await prismaClient.chat.findMany({
      where:{
         roomId
      },
      orderBy:{
         id:'desc'
      },
      take:50
   })
   res.json({messages})
 })


 app.get('/shapes/:roomId',authMiddleware,async(req,res)=>{
   try {
   
      const roomId=Number(req.params.roomId);
      console.log(roomId)
   const messages=await prismaClient.shape.findMany({
      where:{
         roomId
      },
      orderBy:{
         id:'desc'
      },
      take:50
   })
   res.json({messages})
   } catch (error) {
      
   }
   
 })

 app.get('/room/:slug',async(req,res)=>{
   try {
      const slug=req.params.slug
   const room=await prismaClient.room.findFirst({
      where:{
         slug
      },
    
   })
   console.log(room?.id)
   res.json({id:room?.id})
   } catch (error) {
      res.status(404).json({message:'Room not found'})
      
   }
   
 })


app.listen(process.env.PORT || 3001
)