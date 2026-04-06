import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
// @ts-ignore
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// @ts-ignore
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Button } from '@/components/ui/button';
import { Copy, Code2 } from 'lucide-react';
import { toast } from 'sonner';

function ViewBlockCode({children,code}:any) {

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    toast.success('Source code copied to clipboard!')
  }

  const language = code?.includes('<html') ? 'html' : 'jsx';

  return (
    <Dialog>
      {/* If child is already a button, use asChild to prevent nesting buttons */}
      <DialogTrigger asChild>{children}</DialogTrigger>
      
      {/* Force max width override and center layout */}
      <DialogContent className='!max-w-[95vw] md:!max-w-[75vw] w-full h-[85vh] flex flex-col p-0 overflow-hidden bg-[#1E1E1E] border border-neutral-800 text-white shadow-2xl rounded-xl'>
        
        {/* Sticky Header with fixed spacing to avoid Close button overlap */}
        <DialogHeader className="p-4 py-3 border-b border-neutral-800 bg-[#161616] flex-none">
          <div className="flex flex-row items-center justify-between w-full pr-10">
            <DialogTitle className="flex items-center gap-2 text-md font-medium text-neutral-200 m-0">
               <Code2 className="w-5 h-5 text-indigo-400" />
               Source Code
            </DialogTitle>
            <Button 
              onClick={handleCopy} 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2 h-8 bg-[#2A2A2A] border-neutral-700 hover:bg-[#3A3A3A] hover:text-white text-neutral-300 transition-all shadow-sm"
            >
              <Copy className="w-4 h-4" /> Copy Code
            </Button>
          </div>
        </DialogHeader>
          
        {/* Code Content with Stylized Scrollbar */}
        <DialogDescription asChild>
          <div className="flex-1 w-full relative overflow-auto bg-[#1E1E1E] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-neutral-600 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
            <SyntaxHighlighter
              language={language}
              style={vscDarkPlus}
              showLineNumbers={true}
              wrapLines={false}
              customStyle={{
                margin: 0,
                padding: '1.5rem',
                background: 'transparent',
                fontSize: '14px',
                lineHeight: '1.6',
              }}
              lineNumberStyle={{
                minWidth: '3.5em',
                paddingRight: '1.5em',
                color: '#6e7681',
                textAlign: 'right',
                userSelect: 'none',
              }}
            >
              {code || "No code to display."}
            </SyntaxHighlighter>
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
}

export default ViewBlockCode