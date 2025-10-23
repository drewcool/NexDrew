import { Button } from '@/components/ui/button'
import { OnSaveContext } from '@/context/OnSaveContext';
import Image from 'next/image'
import React, { useContext } from 'react'
import Link from 'next/link'
import ShinyText from '@/components/ShinyText';

function PlaygroundHeader() {
  const {onSaveData, setOnSaveData} = useContext(OnSaveContext);
  return (
    <div className='flex items-center justify-between p-3 sm:p-4 shadow'>
      
      <Link href={'/workspace'} className='flex items-center gap-1'>
        <Image src={'/Nexdrew_log.png'} alt='logo' width={40} height={40} className="sm:w-[50px] sm:h-[50px] md:w-[60px] md:h-[60px]" />
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold"><ShinyText text="NexDrew" speed={5} /></h2>
      </Link>
      
      <Button onClick={()=> setOnSaveData(Date.now())} size="sm" className="sm:size-default text-xs sm:text-sm">Save</Button>
    </div>
  )
}

export default PlaygroundHeader