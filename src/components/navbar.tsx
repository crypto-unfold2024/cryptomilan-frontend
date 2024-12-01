'use client'
import useSignWithGoogle from "@/app/hooks/useSignWithGoogle"
import { Button } from "@/components/ui/button"
import useGlobalStorage from "@/store"
import { Bell, Calendar, Compass, Search, Star } from 'lucide-react'
import AddressDisplay from "./address-display"

export default function Navbar() {
  const { signInWithGoogle } = useSignWithGoogle()
  const { address } = useGlobalStorage()

  return (
    <nav className="flex h-14 items-center justify-between px-4 bg-zinc-900 border-b border-zinc-800">
      {/* Left section */}
      <div className="flex items-center space-x-4">
        <Star className="h-5 w-5 text-zinc-400" />
      </div>

      {/* Center section */}
      <div className="flex items-center space-x-8">
        <Button variant="ghost" className=" text-white bg-zinc-800">
          <Calendar className="mr-2 h-4 w-4" />
          Events
        </Button>
        <Button variant="ghost" className="text-zinc-400 hover:text-white hover:bg-zinc-800">
          <Compass className="mr-2 h-4 w-4" />
          Discover
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-zinc-800">
          <Search className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-zinc-800">
          <Bell className="h-5 w-5" />
        </Button>
        {/* <Avatar className="h-8 w-8">
          <AvatarImage src="/placeholder.svg" />
          <AvatarFallback>U</AvatarFallback
          Fallback>
        </Avatar> */}
        {address ? <AddressDisplay address={address} /> : <AddressDisplay address="Sign in to continue" truncate={false} onClick={signInWithGoogle} />}
      </div>
    </nav>
  )
}

