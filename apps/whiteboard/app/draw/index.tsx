import axios from "axios";
import { HTTP_BACKEND } from "@/config";
declare global {
    interface Window {
      tools: string;
    }
  }
  
type Shape={
    type:'rect',
    x:number;
    y:number;
    width:number;
    height:number;
} | {
    type:'oval',
    centerX:number;
    centerY:number;
    radiusX:number;
    radiusY:number;

} |{
    type:'pencil',
    points:{x:number,y:number}[];
}|{
    type:"text",
    x:number,
    y:number,
    text:string,
}|{
    type:"stickyNote",
    x:number,
    y:number,
    width:number,
    height:number,
    text:string,
    heading:string
};

export async function initDraw(canvas:HTMLCanvasElement,roomId:string,socket:WebSocket){
    
    const ctx=canvas.getContext('2d');
    
    const existingShape: Shape[]=await getExistingShape(roomId)
    let currentStroke: { x: number; y: number }[] = [];

    
    if(!ctx){
        return
    }
    clearCanvas(existingShape,canvas,ctx)

    socket.onmessage=(event)=>{
        const message=JSON.parse(event.data);
        console.log(message.type)
        if(message.type==='draw'){
            console.log("yes true")
            const parsedShape=JSON.parse(message.message).shape
            console.log("message received", parsedShape);

            existingShape.push(parsedShape)
            clearCanvas(existingShape,canvas,ctx)
        }
    }

    ctx.fillStyle="rgba(0,0,0)"
    ctx?.fillRect(0,0,canvas.width,canvas.height)

    clearCanvas(existingShape,canvas,ctx)

    let clicked=false;
    let x=0;
    let y=0;
   
    
    window.addEventListener("resize",()=>{
        const tempShape=[...existingShape]
        canvas.width=window.innerWidth
        canvas.height=window.innerHeight
        clearCanvas(tempShape,canvas,ctx)
    })
    
    canvas.addEventListener("mousedown",(e)=>{
        clicked=true;
        x=e.clientX;
        y=e.clientY;
        console.log(x)
        
        const selectedTool = window.tools;

        if (selectedTool === "pencil") {
            ctx.beginPath(); // Start a new path
            ctx.moveTo(x, y); // Move to the initial position
            currentStroke=[{x,y}]
        }
    })
    canvas.addEventListener("mouseup",(e)=>{
        clicked=false;
        const x1 = Math.min(x, e.clientX);
        const y1 = Math.min(y, e.clientY);
        const width = Math.abs(e.clientX - x);
        const height = Math.abs(e.clientY - y);
      
        const selectedTool=window.tools
        let shape:Shape | null=null

        if(selectedTool==='rect'){
              shape={
            
            type:'rect',
            x:x1,
            y:y1,
            width:width,
            height:height
        } 
        
        }
        else if(selectedTool==='oval'){
            
            shape={
          
           type:'oval',
           radiusY:height/2,
           radiusX:width/2,
           centerX:(x+e.clientX)/2,
           centerY:(y+e.clientY)/2,
       } 
      
       }
       if (selectedTool === "pencil"&&currentStroke.length>1) {
         shape={
            type:'pencil',
            points:currentStroke
         }
        ctx.closePath(); // Stop drawing
        
    }
    if(selectedTool==="text"){
        clearTextInput(canvas,ctx,x,y,socket,roomId)
    }
    else if(selectedTool === "stickyNote"){
        createStickyNote(canvas, ctx, x, y, 100, 100, socket, roomId);
    }

       if(!shape){
        return
       }
       
       existingShape.push(shape)
        socket.send(JSON.stringify({
            type:'draw',
            message:JSON.stringify({shape}),
            roomId:Number(roomId)
        }))
        
        clearCanvas(existingShape,canvas,ctx)
        
    })
    canvas.addEventListener("mousemove",(e)=>{
        if(clicked){
            const selectedTool=window.tools
            if (selectedTool === "pencil") {
              
            currentStroke.push({ x: e.clientX, y: e.clientY });
            ctx.lineTo(e.clientX, e.clientY);
            ctx.stroke();
               
            }else{

            console.log(e.clientX)
            const x1 = Math.min(x, e.clientX);
            const y1 = Math.min(y, e.clientY);
            const width = Math.abs(e.clientX - x);
            const height = Math.abs(e.clientY - y);
            clearCanvas(existingShape,canvas,ctx)
            ctx.strokeStyle="rgba(255,255,255)"
           
            
            if(selectedTool==='rect'){ 
                ctx.strokeRect(x1,y1,width,height);
            }
            else if(selectedTool==='oval'){
                const centerX=(x+e.clientX)/2;
                const centerY=(y+e.clientY)/2;
                ctx.beginPath();
                ctx.ellipse(centerX,centerY,width/2, height/2,0,0,Math.PI*2)
                ctx.stroke()
                ctx.closePath()
            }
            // else if(selectedTool==='text'){
            //     const text=prompt("enter text")
            //     ctx.font = "20px Arial";
            //     ctx.fillStyle = "white";
            //     ctx.fillText(text as string , x, y);

            // }

            
            
        }}
    })
}
function clearCanvas(existingShape: Shape[], canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    // Clear canvas and set background
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Redraw existing shapes
    existingShape.forEach((shape) => {
        if (shape.type === "rect") {
            ctx.strokeStyle = "white"; // Ensure stroke color is white
            ctx.lineWidth = 2;
            ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        } else if (shape.type === "oval") {
            ctx.beginPath();
            ctx.strokeStyle = "white"; // Ensure oval outline is white
            ctx.lineWidth = 2;
            ctx.ellipse(shape.centerX, shape.centerY, shape.radiusX, shape.radiusY, 0, 0, Math.PI * 2);
            ctx.stroke();
            ctx.closePath();
        } else if (shape.type === "pencil") {
            ctx.beginPath();
            ctx.strokeStyle = "white"; // Ensure pencil strokes are white
            ctx.lineWidth = 2;
            shape.points.forEach((point, index) => {
                if (index === 0) {
                    ctx.moveTo(point.x, point.y);
                } else {
                    ctx.lineTo(point.x, point.y);
                }
            });
            ctx.stroke();
            ctx.closePath();
        } else if (shape.type === "text") {
            ctx.font = "20px Arial";
            ctx.fillStyle = "white"; // Ensure text is white
            ctx.fillText(shape.text, shape.x, shape.y);
        } else if (shape.type === "stickyNote") {
            if (!shape.text.trim()) return; // Skip empty notes

            // Sticky Note Background
            ctx.fillStyle = "#fffd75"; // Yellow background
            ctx.fillRect(shape.x, shape.y, shape.width, shape.height);

            // Sticky Note Border
            ctx.strokeStyle = "#d4d13b"; // Darker yellow border
            ctx.lineWidth = 2;
            ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);

            // Sticky Note Text
            ctx.fillStyle = "black"; // Ensure text is black
            ctx.font = "16px Arial";
            drawWrappedText(ctx, shape.text, shape.x + 10, shape.y + 25, shape.width - 20, 20);
        }
    });
}


async function getExistingShape(roomId: string) {
    const token =await localStorage.getItem("token")
    const res = await axios.get(`${HTTP_BACKEND}/shapes/${roomId}`,{
        headers:{
            Authorization:`Bearer ${token}`
        }
    }); // Fixed backticks
    const messages = res.data.messages;

    const shapes = messages.map((x: { message: string }) => {
        const messageData = JSON.parse(x.message);
        return messageData.shape;
    });

    console.log(shapes);
    return shapes;
}

function clearTextInput(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, x1: number, y1: number,socket:WebSocket,roomId:string) {
    const input = document.createElement("input");
    input.type = "text";
    input.style.position = "fixed"; // Ensures correct placement even when scrolling
    input.style.left = `${x1}px`;
    input.style.top = `${y1}px`;
    input.style.fontSize = "20px";
    input.style.color = "white";
    input.style.background = "rgba(255,255,255,0.2)"; // Light semi-transparent background
    input.style.border = "1px solid white"; // Visible border
    input.style.padding = "2px"; // Padding for readability
    input.style.width = "150px"; // Set a reasonable width
    input.style.outline = "none";
    input.style.zIndex = "1000";
    

    document.body.appendChild(input);
    input.focus();
    
    input.addEventListener("blur", () => {
        drawText(canvas, ctx, x1, y1, input.value,socket,roomId);
       
        document.body.removeChild(input);
    });

    input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            drawText(canvas, ctx, x1, y1,input.value,socket, roomId);
            document.body.removeChild(input);
        }
    });
}


function drawText(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, x: number, y: number, text: string,socket:WebSocket,roomId:string) {
    if (!text.trim()) return;
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(text, x, y);
    let shape:Shape|null=null
    shape={
        type:"text",
        x:x,
        y:y,
        text:text
    }
    socket.send(JSON.stringify({
        type:'draw',
        message:JSON.stringify({shape}),
        roomId:Number(roomId)
    }))
}

function drawWrappedText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
    const words = text.split(" ");
    let line = "";
    let yOffset = 0;
    
    for (let i = 0; i < words.length; i++) {
       const testLine = line + words[i] + " ";
       const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        
        if (testWidth > maxWidth && i > 0) {
            ctx.fillText(line, x, y + yOffset);
            line = words[i] + " ";
            yOffset += lineHeight;
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line, x, y + yOffset);
}

function createStickyNote(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, socket: WebSocket, roomId: string) {
    const textArea = document.createElement("textarea");
    textArea.style.position = "absolute";
    textArea.style.left = `${x}px`;
    textArea.style.top = `${y}px`;
    textArea.style.width = `${width}px`;
    textArea.style.height = `${height}px`;
    textArea.style.backgroundColor = "#fffd75";
    textArea.style.border = "2px solid #d4d13b";
    textArea.style.fontSize = "16px";
    textArea.style.padding = "5px";
    textArea.style.zIndex = "1000";
    textArea.placeholder = "Enter text...";
    document.body.appendChild(textArea);
    
    textArea.focus();
    textArea.addEventListener("blur", () => {
        const text = textArea.value.trim();
        document.body.removeChild(textArea);
        if (!text) return;
        
        drawStickyNote(canvas, ctx, x, y, width, height, "", text, socket, roomId);
    });
}

function drawStickyNote(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, heading: string, text: string, socket: WebSocket, roomId: string) {
    if (!text.trim()) return;
    ctx.fillStyle = "#fffd75";
    ctx.fillRect(x, y, width, height);
    ctx.strokeStyle = "#d4d13b";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);
    ctx.fillStyle = "black";
    ctx.font = "16px Arial";
    drawWrappedText(ctx, text, x + 10, y + 25, width - 20, 20);
    
    const shape: Shape = { type: "stickyNote", x, y, width, height, heading, text };
    socket.send(JSON.stringify({ type:'draw', message:JSON.stringify({shape}), roomId:Number(roomId) }));
}
