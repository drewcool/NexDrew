"use client"
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Menu, X } from 'lucide-react'
import { SignInButton, useUser } from '@clerk/nextjs'
import { toast } from 'sonner'
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"
import { useTheme } from 'next-themes'
import { ShimmerButton } from "@/components/ui/shimmer-button"
import { AuroraText } from "@/components/ui/aurora-text"
import ShinyText from '@/components/ShinyText'
import VariableProximity from '@/components/VariableProximity'
import { useRef } from 'react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'


const MenuOptions=[
  {
    name:'Pricing',
    path:'/pricing'
  },
  {
    name:'Contact Us',
    path:'/contact-us'
  }
]

function Header() {
  const { user } = useUser()
  const { setTheme } = useTheme()
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  // Set dark as default on first visit without overriding saved preference
  useEffect(()=>{
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem('theme');
    if (!stored) {
      document.documentElement.classList.add('dark');
      setTheme('dark');
    }
  },[setTheme])
  
  return (
    <div className="flex items-center justify-between p-4 shadow">
      {/* logo */}
      <div className="flex items-center gap-1">
        <Image src={"/Nexdrew_log.png"} alt="logo" width={40} height={40} className="sm:w-[50px] sm:h-[50px]" />
        <h2 className="text-xl sm:text-2xl font-bold"><ShinyText text="NexDrew" speed={5} /></h2>
      </div>

      {/* Desktop Menu - Hidden on mobile */}
      <div className="hidden md:flex items-center gap-6" ref={containerRef} style={{position:'relative', fontVariationSettings: "'wght' 400, 'opsz' 14"}}>
        <Link href={'/workspace/pricing'}>
          <VariableProximity
            label={'Pricing'}
            fromFontVariationSettings="'wght' 400, 'opsz' 14"
            toFontVariationSettings="'wght' 900, 'opsz' 24"
            containerRef={containerRef}
            radius={100}
            className="cursor-pointer"
          />
        </Link>
        <button onClick={()=>toast.info('Currently unavailable! We are working on it.')} className="bg-transparent">
          <VariableProximity
            label={'Contact Us'}
            fromFontVariationSettings="'wght' 400, 'opsz' 14"
            toFontVariationSettings="'wght' 900, 'opsz' 24"
            containerRef={containerRef}
            radius={100}
            className="cursor-pointer"
          />
        </button>
      </div>

      {/* Desktop Actions - Hidden on mobile */}
      <div className='hidden md:flex items-center gap-4'>
        <AnimatedThemeToggler />
        {!user ? 
          <SignInButton mode='modal' forceRedirectUrl={'/workspace'}>
            <ShimmerButton className="px-4 py-2 text-sm">
              <span className="flex items-center gap-1">Workspace <ArrowRight size={18} /></span>
            </ShimmerButton>
          </SignInButton>
         : 
          <Link href={'/workspace'}>
            <ShimmerButton className="px-4 py-2 text-sm">
              <span className="flex items-center gap-1">Workspace <ArrowRight size={18} /></span>
            </ShimmerButton>
          </Link>
        }
      </div>

      {/* Mobile Menu Button */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] sm:w-[400px]">
          <div className="flex flex-col gap-6 mt-8 px-4">
            <Link href={'/workspace/pricing'} onClick={() => setIsOpen(false)} className="text-lg font-medium hover:text-primary text-center">
              Pricing
            </Link>
            <button onClick={()=>{toast.info('Currently unavailable! We are working on it.'); setIsOpen(false)}} className="text-lg font-medium hover:text-primary text-center">
              Contact Us
            </button>
            <div className="flex justify-center py-4">
              <AnimatedThemeToggler />
            </div>
            <div className="border-t pt-6 px-6">
              {!user ? 
                <SignInButton mode='modal' forceRedirectUrl={'/workspace'}>
                  <ShimmerButton className="w-full px-3 py-1.5 text-xs">
                    <span className="flex items-center justify-center gap-1">Workspace <ArrowRight size={16} /></span>
                  </ShimmerButton>
                </SignInButton>
               : 
                <Link href={'/workspace'} onClick={() => setIsOpen(false)}>
                  <ShimmerButton className="w-full px-3 py-1.5 text-xs">
                    <span className="flex items-center justify-center gap-1">Workspace <ArrowRight size={16} /></span>
                  </ShimmerButton>
                </Link>
              }
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default Header