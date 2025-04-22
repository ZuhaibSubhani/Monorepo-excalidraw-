"use client"
import Link from "next/link";
import IsLogged from "./component/IsLogged";
import Animation from "./component/Animation";

function App() {
  return (

    <div className="bg-gradient-to-b from-gray-900 to-black h-screen w-screen">
       <div className=" min-h-screen flex flex-col font-manrope text-white">
      <header className=" shadow-md">
        
        <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
          <a href="#" className="text-2xl font-bold  font-manrope text-white">Pin-Board</a>
          <IsLogged/>
         
        </nav>
      </header>
      <div className="border border-gray-800"></div>

      <main className="container mx-auto px-4 py-16 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-extrabold text-white mb-4">Unleash Your Ideas with Our pin-board</h1>
            <p className="text-lg text-white mb-8 font-manrope">
             in real-time and bring your thoughts to life with our intuitive, stickynotes drawing application.
            </p>
            <Link href="/signin" className="inline-block py-3 px-6 bg-blue-700 text-white rounded-md hover:bg-blue-900 transition duration-300">
              Start Drawing Now
            </Link >
          </div>
          <div className="">
           <Animation/>
          </div>
        </div>
      </main>
    
      <div className="border border-gray-900"></div>
      <footer className="bg-black shadow-md mt-2">
        <div className="container mx-auto px-4 py-4 text-center text-white">
        
          &copy; 2025 pin-board. All rights reserved.
        </div>
      
      </footer>
    </div>
    </div>
   
  );
}

export default App;
