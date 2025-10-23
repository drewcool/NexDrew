"use client"
import React, { useState } from 'react'
import { Messages } from '../[projectId]/page'
import { ArrowUp } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Props = {
  messages:Messages[]
  onSend: any,
  loading:boolean
}

function ChatSection({messages, onSend,loading}:Props) {
  const [input,setInput]=useState<string>();

  const handleSend=()=>{
    if(!input?.trim()) return;
    onSend(input);
    setInput('');
  }
  return (
    <div className='w-full md:w-96 shadow h-auto md:h-[91vh] p-3 sm:p-4 flex flex-col'>
      {/* Message Section */}
      <div className='flex-1 overflow-y-auto p-2 sm:p-4 space-y-2 sm:space-y-3 flex flex-col max-h-[50vh] md:max-h-none'>
        {messages?.length===0?
        (
            <p className='text-gray-400 text-center text-sm sm:text-base'>No Message Yet!</p>
        ):(
            messages.map((msg,index)=>(
              <div key={index} className= {`flex ${msg.role=='user'?'justify-end':'justify-start'}`}>
                <div className={`p-2 rounded-lg max-w-[85%] sm:max-w-[80%] text-sm sm:text-base ${msg.role==='user'?
                  "bg-gray-100 text-black":
                  "bg-gray-300 text-black"
                }`}>
                  {msg.content}
                </div>
              </div>
            ))
        )}
        {loading && <div className='flex justify-center items-center p-2 sm:p-4'>
          <div className='animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-gray-600 dark:border-gray-300'></div>
          <span className='ml-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300'>Thinking... Working on your request</span>
        </div>}

      </div>

      {/* Footer Section */}
      <div className='p-2 sm:p-3 border-t flex items-center gap-2'>
        <textarea
        value={input}
        placeholder='Describe your website design idea!'
        className='flex-1 resize-none border rounded-lg px-2 sm:px-3 py-1 sm:py-2 focus:outline-none focus:ring-2 text-sm sm:text-base'
        onChange={(event)=>setInput(event.target.value)}
        onKeyDown={(e)=>{ if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); handleSend(); } }}
        />
        <Button onClick={handleSend} size="sm" className="sm:size-default"><ArrowUp className="w-4 h-4 sm:w-5 sm:h-5" /></Button>
        

      </div>
    </div>
  )
}

export default ChatSection