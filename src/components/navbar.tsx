'use client';
import { Button } from '@/components/ui/button';
import useGlobalStorage from '@/store';
import { Bell, Calendar, Compass, Search, Star } from 'lucide-react';
import { HoverBorderGradientDemo } from './ui/wallet-button';
import Image from 'next/image';
import logo from '../../public/logo.webp';
import logoImage from '../../public/logo-image.webp';
import useSignWithGoogle from '@/app/hooks/useSignWithGoogle';
export default function Navbar() {
    const { signInWithGoogle } = useSignWithGoogle();
    const { address } = useGlobalStorage();
    return (
        <nav className="flex h-14 items-center justify-between px-4 bg-zinc-900 border-b border-zinc-800">
            {/* Left section */}
            <div className="flex items-center space-x-4">
                <Image src={logoImage} alt="logoImage" height={40} width={40} />
                <Image src={logo} alt="logo" height={150} width={150} />
            </div>

            {/* Center section */}
            <div className="hidden md:block">
                <div className="flex items-center space-x-8">
                    <Button variant="ghost" className=" text-white bg-zinc-800">
                        <Calendar className="mr-2 h-4 w-4" />
                        Events
                    </Button>
                    <Button
                        variant="ghost"
                        className="text-zinc-400 hover:text-white hover:bg-zinc-800"
                    >
                        <Compass className="mr-2 h-4 w-4" />
                        Discover
                    </Button>
                </div>
            </div>
            <div>
                <div className="flex items-center space-x-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-zinc-400 hover:text-white  hover:bg-zinc-800"
                    >
                        <Search className="h-5 w-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-zinc-400 hover:text-white hover:bg-zinc-800"
                    >
                        <Bell className="h-5 w-5" />
                    </Button>

                    {window.location.pathname !== '/' && (
                        <HoverBorderGradientDemo title={address} />
                    )}
                </div>
            </div>
        </nav>
    );
}
