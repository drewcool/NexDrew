import { Button } from '@/components/ui/button'
import { OnSaveContext } from '@/context/OnSaveContext';
import Image from 'next/image'
import React, { useContext } from 'react'
import Link from 'next/link'
import ShinyText from '@/components/ShinyText';

function PlaygroundHeader() {
  const {onSaveData, setOnSaveData} = useContext(OnSaveContext);
  return (
    <div className='flex items-center justify-between p-4 shadow'>
      
      <Link href={'/workspace'} className='flex items-center gap-1'>
        <Image src={'/Nexdrew_log.png'} alt='logo' width={60} height={60} />
        <h2 className="text-2xl font-bold"><ShinyText text="NexDrew" speed={5} /></h2>
      </Link>
      
      <Button onClick={()=> setOnSaveData(Date.now())}>Save</Button>
    </div>
  )
}

export default PlaygroundHeader