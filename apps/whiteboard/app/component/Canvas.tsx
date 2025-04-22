import { useEffect, useRef, useState } from "react";
import { initDraw } from "../draw";

import { Circle, Paperclip, Pencil, Square, Type } from "lucide-react";

export function Canvas({ roomId, socket }: { roomId: string; socket: WebSocket }) {
  const [tools, setTools] = useState("pencil");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    
    window.tools = tools;
  }, [tools]);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      initDraw(canvas, roomId, socket);
    }
  }, [canvasRef,roomId, socket]);

  return (
    <div className="relative w-full h-screen">
      <canvas className="absolute inset-0 bg-black" ref={canvasRef} width={window.innerWidth} height={window.innerHeight}></canvas>
      <TopBar tools={tools} setTools={setTools} />
    </div>
  );
}

function TopBar({ tools, setTools }: { tools: string; setTools: (tool: string) => void }) {
  return (
    <div className="fixed top-5 left-5 flex gap-2 bg-gray-800 p-2 rounded-lg shadow-lg">
      <ToolButton tool="pencil" activeTool={tools} setTools={setTools} icon={<Pencil size={20} />} />
      <ToolButton tool="rect" activeTool={tools} setTools={setTools} icon={<Square size={20} />} />
      <ToolButton tool="oval" activeTool={tools} setTools={setTools} icon={<Circle size={20} />} />
      <ToolButton tool="text" activeTool={tools} setTools={setTools} icon={<Type size={20} />} />
      <ToolButton tool="stickyNote" activeTool={tools} setTools={setTools} icon={<Paperclip size={20}/>}/>
    </div>
  );
}

function ToolButton({ tool, activeTool, setTools, icon }: { tool: string; activeTool: string; setTools: (tool: string) => void; icon: React.ReactNode }) {
  return (
    <button
      onClick={() => setTools(tool)}
      className={`p-2 rounded-md transition-all ${activeTool === tool ? "bg-blue-500 text-white" : "bg-gray-700 hover:bg-gray-600 text-gray-300"}`}
    >
      {icon}
    </button>
  );
}
