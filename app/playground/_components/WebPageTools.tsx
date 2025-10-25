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
        <meta name="description" content="Modern AI Website Builder - React + TailwindCSS + shadcn/ui">
        <title>NexDrew</title>
        
        <!-- Tailwind CSS -->
        <script src="https://cdn.tailwindcss.com"></script>
        <script>
          tailwind.config = {
            darkMode: 'class',
            theme: {
              extend: {
                colors: {
                  border: "hsl(var(--border))",
                  input: "hsl(var(--input))",
                  ring: "hsl(var(--ring))",
                  background: "hsl(var(--background))",
                  foreground: "hsl(var(--foreground))",
                  primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))"
                  },
                  secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))"
                  },
                  destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))"
                  },
                  muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))"
                  },
                  accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))"
                  },
                  popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))"
                  },
                  card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))"
                  }
                },
                borderRadius: {
                  lg: "var(--radius)",
                  md: "calc(var(--radius) - 2px)",
                  sm: "calc(var(--radius) - 4px)"
                },
                keyframes: {
                  "accordion-down": {
                    from: { height: 0 },
                    to: { height: "var(--radix-accordion-content-height)" }
                  },
                  "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: 0 }
                  },
                  shimmer: {
                    "0%": { transform: "translateX(-100%)" },
                    "100%": { transform: "translateX(100%)" }
                  },
                  meteor: {
                    "0%": { transform: "rotate(215deg) translateX(0)", opacity: 1 },
                    "70%": { opacity: 1 },
                    "100%": { transform: "rotate(215deg) translateX(-500px)", opacity: 0 }
                  }
                },
                animation: {
                  "accordion-down": "accordion-down 0.2s ease-out",
                  "accordion-up": "accordion-up 0.2s ease-out",
                  shimmer: "shimmer 2s infinite",
                  meteor: "meteor 5s linear infinite"
                }
              }
            }
          }
        </script>
        
        <!-- React & ReactDOM -->
        <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
        <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
        
        <!-- Babel Standalone for JSX -->
        <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
        
        <!-- Lucide Icons -->
        <script src="https://unpkg.com/lucide@latest"></script>
        
        <!-- Framer Motion -->
        <script src="https://unpkg.com/framer-motion@10/dist/framer-motion.js"></script>
        
        <!-- GSAP & ScrollTrigger -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
        
        <!-- Chart.js -->
        <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
        
        <!-- Recharts -->
        <script src="https://unpkg.com/recharts@2.10.3/dist/Recharts.js"></script>
        
        <!-- Swiper -->
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
        <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
        
        <!-- AOS (Animate On Scroll) -->
        <link href="https://unpkg.com/aos@2.3.4/dist/aos.css" rel="stylesheet">
        <script src="https://unpkg.com/aos@2.3.4/dist/aos.js"></script>
        
        <!-- Lottie -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js"></script>
        
        <!-- Three.js for 3D effects -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
        
        <!-- Custom CSS Variables for shadcn/ui -->
        <style>
          :root {
            --background: 0 0% 100%;
            --foreground: 222.2 84% 4.9%;
            --card: 0 0% 100%;
            --card-foreground: 222.2 84% 4.9%;
            --popover: 0 0% 100%;
            --popover-foreground: 222.2 84% 4.9%;
            --primary: 221.2 83.2% 53.3%;
            --primary-foreground: 210 40% 98%;
            --secondary: 210 40% 96.1%;
            --secondary-foreground: 222.2 47.4% 11.2%;
            --muted: 210 40% 96.1%;
            --muted-foreground: 215.4 16.3% 46.9%;
            --accent: 210 40% 96.1%;
            --accent-foreground: 222.2 47.4% 11.2%;
            --destructive: 0 84.2% 60.2%;
            --destructive-foreground: 210 40% 98%;
            --border: 214.3 31.8% 91.4%;
            --input: 214.3 31.8% 91.4%;
            --ring: 221.2 83.2% 53.3%;
            --radius: 0.5rem;
          }
          
          .dark {
            --background: 222.2 84% 4.9%;
            --foreground: 210 40% 98%;
            --card: 222.2 84% 4.9%;
            --card-foreground: 210 40% 98%;
            --popover: 222.2 84% 4.9%;
            --popover-foreground: 210 40% 98%;
            --primary: 217.2 91.2% 59.8%;
            --primary-foreground: 222.2 47.4% 11.2%;
            --secondary: 217.2 32.6% 17.5%;
            --secondary-foreground: 210 40% 98%;
            --muted: 217.2 32.6% 17.5%;
            --muted-foreground: 215 20.2% 65.1%;
            --accent: 217.2 32.6% 17.5%;
            --accent-foreground: 210 40% 98%;
            --destructive: 0 62.8% 30.6%;
            --destructive-foreground: 210 40% 98%;
            --border: 217.2 32.6% 17.5%;
            --input: 217.2 32.6% 17.5%;
            --ring: 224.3 76.3% 48%;
          }
          
          * {
            border-color: hsl(var(--border));
          }
          
          body {
            background-color: hsl(var(--background));
            color: hsl(var(--foreground));
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          }
          
          /* Smooth scrolling */
          html {
            scroll-behavior: smooth;
          }
          
          /* Custom scrollbar */
          ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          
          ::-webkit-scrollbar-track {
            background: hsl(var(--muted));
          }
          
          ::-webkit-scrollbar-thumb {
            background: hsl(var(--primary));
            border-radius: 4px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: hsl(var(--primary) / 0.8);
          }
        </style>
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
    // Remove closing body and html tags
    cleaned = cleaned.replace(/<\/body>[\s\S]*$/i, '');
    
    // Don't remove trailing braces - they might be part of React components!
    cleaned = cleaned.trim();
    
    // For React components, wrap in a script tag with Babel
    const isReactComponent = cleaned.includes("'use client'") || 
                             cleaned.includes('"use client"') ||
                             /const\s+\w+\s*=\s*\(\s*\)\s*=>/i.test(cleaned);
    
    let bodyContent = cleaned;
    if (isReactComponent) {
      // Wrap React code in a script tag for Babel to transform
      bodyContent = `<script type="text/babel" data-type="module">
${cleaned}
</script>`;
    }
    
    const finalCode = HTML_CODE.replace('{code}', bodyContent);
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
    <div className='p-2 shadow rounded-xl w-full flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0'>
      <div className='flex gap-1.5 sm:gap-2'>
        <Button variant={'ghost'} size="sm" className={`${selectedScreenSize == 'web' ? 'border border-primary':''} text-xs sm:text-sm`} onClick={()=>setselectedScreenSize('web')}><Monitor className="w-4 h-4 sm:w-5 sm:h-5" /></Button>
        <Button variant={'ghost'} size="sm" className={`${selectedScreenSize == 'mobile' ? 'border border-primary':''} text-xs sm:text-sm`} onClick={()=>setselectedScreenSize('mobile')}><TabletSmartphone className="w-4 h-4 sm:w-5 sm:h-5" /></Button>
      </div>
      <div className='flex gap-1.5 sm:gap-2 flex-wrap justify-center'>
        <Button variant={'outline'} size="sm" className="text-xs sm:text-sm" onClick={()=>ViewInNewTab()}> View <SquareArrowOutUpRight className="w-3 h-3 sm:w-4 sm:h-4" /></Button>
        <ViewBlockCode code={finalCode}>
        <Button size="sm" className="text-xs sm:text-sm"> Code <Code2Icon className="w-3 h-3 sm:w-4 sm:h-4" /></Button>
        </ViewBlockCode>
        <Button onClick={downloadCode} size="sm" className="text-xs sm:text-sm">Download <Download className="w-3 h-3 sm:w-4 sm:h-4" /></Button>
      </div>
    </div>
  )
}

export default WebPageTools