"use client"
import { Button } from '@/components/ui/button'
import { Code2Icon, Download, Monitor, SquareArrowOutDownLeft, SquareArrowOutUpRight, TabletSmartphone } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import ViewBlockCode from './ViewBlockCode'

const HTML_CODE=`<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="AI Website Builder - Modern TailwindCSS + Flowbite Template">
        <title>NexDrew</title>
        <!-- Tailwind CSS -->
        <script src="https://cdn.tailwindcss.com"></script>
        <!-- Flowbite CSS & JS -->
        <link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.css" rel="stylesheet">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.js"></script>
        <!-- Font Awesome / Lucide -->
        <script src="https://unpkg.com/lucide@latest/dist/und/lucide.js"></script>
        <!-- Chart.js -->
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <!-- ADS -->
        <link href="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css" rel="stylesheet">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js"></script>
        <!-- GSAP -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
        <!-- Lottie -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.11.2/lottie.min.js"></script>
        <!-- Swiper -->
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.css" />
        <script src="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.js"></script>
        <!-- Tippy.js -->
        <link rel="stylesheet" href="https://unpkg.com/tippy.js@6/dist/tippy.css" />
        <script src="https://unpkg.com/@popperjs/core@2"></script>
        <script src="https://unpkg.com/tippy.js@6"></script>
      </head>
      <body id="root">
      {code}
      </body>
      </html>`

function WebPageTools({selectedScreenSize, setselectedScreenSize,generatedCode}:any) {
  const [finalCode,setFinalCode] = useState<string>();

  useEffect(()=>{
    let cleaned = generatedCode || '';
    // Remove code fences
    cleaned = cleaned.replace(/```html/gi, '').replace(/```/g, '');
    // Remove everything before body content
    cleaned = cleaned.replace(/^[\s\S]*?<body[^>]*>/i, '');
    // Remove closing body and html tags and trailing braces
    cleaned = cleaned.replace(/<\/body>[\s\S]*$/i, '').replace(/}\s*$/,'');
    const finalCode = HTML_CODE.replace('{code}', cleaned);
    setFinalCode(finalCode)
  },[generatedCode])

  const ViewInNewTab = () =>{
    if(!finalCode) return;

    const blob = new Blob([finalCode??''],{type:'text/html'});
    const url = URL.createObjectURL(blob);

    window.open(url,"_blank")
  }

  const downloadCode = () =>{
    const blob = new Blob([finalCode??''],{type:'text/html'});
    const url = URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.href=url;
    a.download='code.html'
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  return (
    <div className='p-2 shadow rounded-xl w-full flex items-center justify-between'>
      <div className='flex gap-2'>
        <Button variant={'ghost'} className={`${selectedScreenSize == 'web' ? 'border border-primary':''}`} onClick={()=>setselectedScreenSize('web')}><Monitor /></Button>
        <Button variant={'ghost'} className={`${selectedScreenSize == 'mobile' ? 'border border-primary':''}`} onClick={()=>setselectedScreenSize('mobile')}><TabletSmartphone /></Button>
      </div>
      <div className='flex gap-2'>
        <Button variant={'outline'} onClick={()=>ViewInNewTab()}> View <SquareArrowOutUpRight /></Button>
        <ViewBlockCode code={finalCode}>
        <Button> Code <Code2Icon /></Button>
        </ViewBlockCode>
        <Button onClick={downloadCode}>Download <Download /></Button>
      </div>
    </div>
  )
}

export default WebPageTools