import { cn } from '@/lib/utils'
import { Asterisk } from 'lucide-react'

interface AddressDisplayProps {
  address: string
  className?: string,
  truncate?: boolean,
  onClick?: () => void
}

export default function AddressDisplay({
  address = "0xb3e8c0d6a0d6a0d6a0d6a0d6a0d6a0d6a0d6a",
  className,
  onClick,
  truncate = true
}: AddressDisplayProps) {
  // Function to truncate address
  const truncateAddress = (addr: string) => {
    if (addr.length <= 12) return addr
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <div className={cn("inline-flex items-center gap-2 bg-zinc-900 px-3 py-2 rounded-lg", className)} onClick={onClick}>
      <Asterisk className="h-5 w-5 text-orange-500" />
      <span className="font-mono text-sm text-zinc-100">
        {truncate ? truncateAddress(address) : address}
      </span>
    </div>
  )
}

