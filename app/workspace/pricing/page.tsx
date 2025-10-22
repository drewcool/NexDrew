import { PricingTable } from '@clerk/nextjs'
import React from 'react'

function pricing() {
  return (
    <div className='flex flex-col justify-center items-center h-[70%]'>
      <h2 className='font-bold text-3xl my-5'>Pricing</h2>
      <div className='flex w-[800px]'>
        <PricingTable />
      </div>
      
    </div>
  )
}

export default pricing