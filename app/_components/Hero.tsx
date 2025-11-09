"use client"
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { UserDetailContext } from '@/context/UserDetailContext'
import { SignInButton, useAuth, useUser } from '@clerk/nextjs'
import axios from 'axios'
import { ArrowUp, HomeIcon, ImagePlus, Key, LayoutDashboard, Loader2Icon, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, {useContext, useState} from 'react'
import { BorderBeam } from "@/components/ui/border-beam"
import ShinyText from "@/components/ShinyText"
import { toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid';





const suggestions = [
    {
    label: 'Dashboard',
    prompt: 'Create an analytics dashboard to track customers and revenue data for a SaaS',
    icon: LayoutDashboard
    },
    {
    label: 'SignUp Form',
    prompt: 'Create a modern sign up form with email/password fields, Google and Github login options, and terms checkbox',
    icon: Key
    },
    {
    label: 'Hero',    
    prompt: 'Create a modern header and centered hero section for a productivity SaaS. Include a badge for feature announcement, a title with a subtle gradient effect, subtitle, CTA, small social proof and an image.', icon: HomeIcon
    },
    {
    label: 'User Profile Card',
    prompt: 'Create a modern user profile card component for a social media website', icon: User
    }
]

function Hero() {
  const [userInput,setUserInput]=useState<string>();
  const { user } = useUser()
  const router = useRouter();
  const [loading,setLoading]=useState(false);
  const {has} = useAuth();
  const {userDetail,setUserDetail} = useContext(UserDetailContext);
  const hasUnlimitedAccess = has&&has({ plan: 'unlimited' })

  const CreateNewProject = async() => {
    if(!hasUnlimitedAccess && userDetail?.credits <= 0){
      toast.error('You have no credits left. Please upgrade to unlimited plan.')
      return;
    }

    setLoading(true);
    const projectId=uuidv4();
    const frameId=generateRandomFrameNumber();
    const messages = [
      {
        role:'user',
        content:userInput
      }
    ]
    try{
      const result = await axios.post('/api/projects',{
        projectId: projectId,
        frameId:frameId,
        messages:messages,
        credits: userDetail?.credits
      });
      
      toast.success('project created!')
      //Navigate to playground
      router.push(`/playground/${projectId}?frameId=${frameId}`)
      setUserDetail((prev:any)=>({...prev,credits:prev?.credits! -1}))
      setLoading(false);

    } catch (e) {
      toast.error('Internal server error!')
      
      setLoading(false);
    }
  }
  return (
    <div className='flex flex-col items-center min-h-[80vh] justify-center px-4 py-8 sm:px-6 lg:px-8'>
      {/* Header & description */}
      <h2 className='font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-center'>
        <ShinyText text="What should we Design?" speed={5} />
      </h2>
      <p className='text-base sm:text-lg md:text-xl mt-2 text-gray-500 text-center max-w-2xl px-4'>Generate, Edit and Explore design with AI, Export code as well</p>

      {/* input box */}
      <div className='relative w-full max-w-2xl p-4 sm:p-5 border mt-5 rounded-2xl overflow-hidden'>
        <BorderBeam duration={12} />
        <textarea placeholder='Describe your page design...'
        value={userInput}
        onChange={(event)=>setUserInput(event.target.value)}
        className='w-full h-20 sm:h-24 focus:outline-none focus:ring-0 resize-none text-sm sm:text-base'
        />
        <div className='flex items-center justify-end'>
          {/* <Button variant={'ghost'} size={'icon'}><ImagePlus /></Button>  */}
          {!user ? <SignInButton mode='modal' forceRedirectUrl='/workspace'>
              <Button disabled={!userInput} size="sm" className="sm:size-default"><ArrowUp className="w-4 h-4 sm:w-5 sm:h-5" /></Button>
          </SignInButton> :

              <Button disabled={!userInput || loading} onClick={CreateNewProject} size="sm" className="sm:size-default">{loading?<Loader2Icon className='animate-spin w-4 h-4 sm:w-5 sm:h-5' /> : <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5" />}</Button>
            }

        </div>

      </div>


      {/* suggestion list */}
      <div className='mt-4 flex flex-wrap gap-2 sm:gap-3 justify-center max-w-2xl'>
        {suggestions.map((suggestion,index)=>(
          <Button key={index} variant={'outline'}
          onClick={()=> setUserInput(suggestion.prompt)}
          className="text-xs sm:text-sm flex-shrink-0"
          size="sm"
          >
            <suggestion.icon className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">{suggestion.label}</span>
            <span className="sm:hidden">{suggestion.label.split(' ')[0]}</span>
          </Button>
        ))}
      </div>

      {/* Copyright */}
      <div className='mt-6 sm:mt-8'>
        <p className='text-xs sm:text-sm text-gray-500 text-center'>© Made By Ashish Barnwal with ❤️</p>
      </div>

    </div>
  )
}

export default Hero


const generateRandomFrameNumber = ()=> {
  const num = Math.floor(Math.random()*10000);
  return num
}