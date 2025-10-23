"use client"
import React, { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { SignInButton, useUser } from '@clerk/nextjs'
import { toast } from 'sonner'
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"
import { useTheme } from 'next-themes'
import { ShimmerButton } from "@/components/ui/shimmer-button"
import { AuroraText } from "@/components/ui/aurora-text"
import ShinyText from '@/components/ShinyText'
import VariableProximity from '@/components/VariableProximity'
import { useRef } from 'react'


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
        <Image src={"/Nexdrew_log.png"} alt="logo" width={50} height={50} />
        <h2 className="text-2xl font-bold"><ShinyText text="NexDrew" speed={5} /></h2>
      </div>

      {/* Menu Options with VariableProximity */}
      <div className="flex items-center gap-6" ref={containerRef} style={{position:'relative', fontVariationSettings: "'wght' 400, 'opsz' 14"}}>
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

      {/* {Toggle Button} */}
      

      {/* Get Started Button */}
      <div className='flex items-center gap-4'>
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
    </div>
  )
}

export default Header