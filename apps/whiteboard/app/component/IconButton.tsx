import { ReactNode } from "react"

export function IconButton({icon, onClick}:{
    icon: ReactNode,
    onClick: () => void
})
{
    return <div className="pointer rounded-full border-none bg-black hover:bg-gray text-white" onClick={onClick}>
        {icon}
    </div>
}