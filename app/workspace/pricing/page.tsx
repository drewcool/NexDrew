import { PricingTable } from '@clerk/nextjs'
import React from 'react'

function pricing() {
  return (
    <div className='flex flex-col justify-center items-center min-h-[70vh] px-4 py-6'>
      <h2 className='font-bold text-2xl sm:text-3xl my-3 sm:my-5 text-center'>Pricing</h2>
      <div className='flex w-full max-w-[800px]'>
        <PricingTable />
      </div>
      
    </div>
  )
}

export default pricing