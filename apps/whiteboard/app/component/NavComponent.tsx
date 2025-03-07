"use client"

export function NavComponent() {
  return (
    <div>
      <div className="space-x-4">
            <a href="signup" className="py-2 px-4 bg-white text-black rounded hover:bg-slate-200 transition duration-300">Sign Up</a>
            
            <a href="signin" className="py-2 px-4 border-2 border-gray-700 rounded-lg text-gray-700 hover:bg-gray-900 transition duration-300 text-white ">Log In</a>
          </div>
    </div>
  )
}


