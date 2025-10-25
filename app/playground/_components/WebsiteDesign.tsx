import React, { useContext, useEffect, useRef, useState } from "react";
import WebPageTools from "./WebPageTools";
import ElementSettingSection from "./ElementSettingSection";
import ImageSettingSection from "./ImageSettingsSection";
import { OnSaveContext } from "@/context/OnSaveContext";
import axios from "axios";
import { toast } from "sonner";
import { useParams, useSearchParams } from "next/navigation";

type Props = {
  generatedCode: string;
};

const HTML_CODE = `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Modern AI Website Builder - React + TailwindCSS + shadcn/ui">
        <title>NexDrew - AI Website Builder</title>
        
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
      </body>
      </html>`

function WebsiteDesign({ generatedCode }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [selectedScreenSize, setselectedScreenSize] = useState('web')
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
  const selectedElRef = useRef<HTMLElement | null>(null);
  const settingsRef = useRef<HTMLDivElement | null>(null);
  const {onSaveData, setOnSaveData} = useContext(OnSaveContext);

  const { projectId } = useParams();
  const params = useSearchParams();
  const frameId = params.get('frameId');

  const clearSelection = () => {
    if (selectedElRef.current) {
      selectedElRef.current.style.outline = '';
      selectedElRef.current.removeAttribute('contenteditable');
      selectedElRef.current = null;
    }
    setSelectedElement(null);
  };

  // Initialize iframe shell once
  useEffect(() => {
    if (!iframeRef.current) return;
    const doc = iframeRef.current.contentDocument;
    if (!doc) return;

    doc.open();
    doc.write(HTML_CODE);
    doc.close();

    let hoverEl: HTMLElement | null = null;

    const handleMouseOver = (e: MouseEvent) => {
      if (selectedElRef.current) return;
      const target = e.target as HTMLElement;
      if (hoverEl && hoverEl !== target) {
        hoverEl.style.outline = '';
      }
      hoverEl = target;
      hoverEl.style.outline = '2px dotted blue';
    };

    const handleMouseOut = (e: MouseEvent) => {
      if (selectedElRef.current) return;
      if (hoverEl) {
        hoverEl.style.outline = '';
        hoverEl = null;
      }
    };

    const handleClick = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const target = e.target as HTMLElement;
      // toggle off if clicking the same selected element
      if (selectedElRef.current && selectedElRef.current === target) {
        clearSelection();
        return;
      }
      if (selectedElRef.current && selectedElRef.current !== target) {
        selectedElRef.current.style.outline = '';
        selectedElRef.current.removeAttribute('contenteditable');
      }
      selectedElRef.current = target;
      selectedElRef.current.style.outline = '2px solid red';
      selectedElRef.current.setAttribute('contenteditable', 'true');
      selectedElRef.current.focus();
      setSelectedElement(selectedElRef.current);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedElRef.current) {
        clearSelection();
      }
    };

    if (doc.body) {
      doc.body.addEventListener('mouseover', handleMouseOver);
      doc.body.addEventListener('mouseout', handleMouseOut);
      doc.body.addEventListener('click', handleClick);
    }
    doc.addEventListener('keydown', handleKeyDown);

    return () => {
      if (doc.body) {
        doc.body.removeEventListener('mouseover', handleMouseOver);
        doc.body.removeEventListener('mouseout', handleMouseOut);
        doc.body.removeEventListener('click', handleClick);
      }
      doc.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // outside clicks should not hide settings (per requirement)
  useEffect(() => {
    // no-op
  }, []);

  // Update body only when code changes
  useEffect(() => {
    if (!iframeRef.current) return;
    const doc = iframeRef.current.contentDocument;
    if (!doc) return;

    const root = doc.getElementById("root");
    if (root) {
      let cleaned = generatedCode || '';
      
      // Remove code fences
      cleaned = cleaned.replace(/```html/gi, '').replace(/```/g, '');
      // Remove everything before body content (DOCTYPE, html tag, head, body opening tag)
      cleaned = cleaned.replace(/^[\s\S]*?<body[^>]*>/i, '');
      // Remove closing body and html tags
      cleaned = cleaned.replace(/<\/body>[\s\S]*$/i, '');
      
      // Additional cleanup for common AI mistakes
      cleaned = cleaned.trim();
      
      // Fix common syntax errors
      // Remove incomplete const declarations
      cleaned = cleaned.replace(/const\s+\w+\s*;/g, '');
      // Remove incomplete let declarations
      cleaned = cleaned.replace(/let\s+\w+\s*;/g, '');
      
      // Skip rendering if code is clearly incomplete or malformed
      if (!cleaned || cleaned.length < 10) {
        // Too short to be valid code, likely still streaming
        return;
      }
      
      // Check if the code contains React component (starts with 'use client' or has const/function Component)
      const isReactComponent = cleaned.includes("'use client'") || 
                               cleaned.includes('"use client"') ||
                               /const\s+\w+\s*=\s*\(\s*\)\s*=>/i.test(cleaned) ||
                               /function\s+\w+\s*\(/i.test(cleaned);
      
      if (isReactComponent) {
        // Handle React component rendering with robust error handling
        root.innerHTML = '';
        
        try {
          // Remove any existing script tags to prevent duplicates
          const existingScripts = doc.querySelectorAll('script[data-component="true"]');
          existingScripts.forEach(script => script.remove());
          
          // Validate the code before transformation
          if (!cleaned.trim()) {
            console.error('Empty component code received');
            root.innerHTML = '<div class="p-4 text-red-500">Error: Empty code generated</div>';
            return;
          }
          
          // Additional validation - check for basic syntax issues
          const hasComponentDefinition = /const\s+\w+\s*=\s*\(\s*\)\s*=>\s*\{/.test(cleaned) || 
                                        /function\s+\w+\s*\(\s*\)\s*\{/.test(cleaned);
          const hasReactDOMRender = cleaned.includes('ReactDOM.createRoot') || 
                                   cleaned.includes('ReactDOM.render');
          
          if (!hasComponentDefinition || !hasReactDOMRender) {
            console.warn('Code missing component definition or render call, attempting to render as HTML');
            // Fallback to HTML rendering
            const htmlContent = cleaned.replace(/'use client'|"use client"/g, '');
            root.innerHTML = htmlContent;
            
            // Initialize any scripts that might be in the HTML
            const scripts = root.querySelectorAll('script');
            scripts.forEach(oldScript => {
              try {
                const scriptContent = oldScript.textContent?.trim();
                if (scriptContent && oldScript.parentNode) {
                  const newScript = doc.createElement('script');
                  newScript.textContent = scriptContent;
                  oldScript.parentNode.replaceChild(newScript, oldScript);
                }
              } catch (scriptErr) {
                console.warn('Failed to initialize script:', scriptErr);
                // Silently skip problematic scripts
              }
            });
            return;
          }
          
          // Create a script tag with type="text/babel" for Babel to transpile
          const scriptTag = doc.createElement('script');
          scriptTag.type = 'text/babel';
          scriptTag.setAttribute('data-type', 'module');
          scriptTag.setAttribute('data-component', 'true');
          scriptTag.textContent = cleaned;
          
          // Append and let Babel transform it
          doc.body.appendChild(scriptTag);
          
          // Trigger Babel transformation with error handling
          if ((doc.defaultView as any)?.Babel) {
            try {
              (doc.defaultView as any).Babel.transformScriptTags();
            } catch (e: any) {
              console.error('Babel transformation error:', e);
              
              // Fallback: Try to render as HTML
              scriptTag.remove();
              const htmlFallback = cleaned.replace(/'use client'|"use client"/g, '');
              
              // Try to extract just the JSX/HTML content
              const returnMatch = htmlFallback.match(/return\s*\(([\s\S]*)\);?\s*\}/);
              if (returnMatch) {
                try {
                  const jsxContent = returnMatch[1].trim();
                  root.innerHTML = jsxContent;
                } catch (htmlErr) {
                  console.error('Failed to render extracted JSX:', htmlErr);
                  root.innerHTML = `<div class="p-4 bg-yellow-50 border border-yellow-300 rounded text-yellow-800">
                    <h3 class="font-bold mb-2">⚠️ Rendering Issue</h3>
                    <p class="text-sm">The generated code has syntax errors.</p>
                  </div>`;
                }
              } else {
                root.innerHTML = `<div class="p-4 bg-yellow-50 border border-yellow-300 rounded text-yellow-800">
                  <h3 class="font-bold mb-2">⚠️ Rendering Issue</h3>
                  <p class="text-sm">The generated code has syntax errors. Try asking the AI to regenerate with simpler code.</p>
                  <details class="mt-2 text-xs">
                    <summary class="cursor-pointer font-semibold">Error Details</summary>
                    <pre class="mt-1 bg-white p-2 rounded overflow-auto">${e?.message || 'Unknown error'}</pre>
                  </details>
                </div>`;
              }
            }
          } else {
            // Fallback: Extract and render HTML content
            scriptTag.remove();
            const returnMatch = cleaned.match(/return\s*\(([\s\S]*)\);?\s*\}/);
            if (returnMatch) {
              try {
                root.innerHTML = returnMatch[1].trim();
              } catch (htmlErr) {
                console.error('Fallback render failed:', htmlErr);
                root.innerHTML = '<div class="p-4 text-yellow-700 bg-yellow-50 border border-yellow-300 rounded">Babel not loaded and fallback render failed.</div>';
              }
            } else {
              root.innerHTML = '<div class="p-4 text-yellow-700 bg-yellow-50 border border-yellow-300 rounded">Babel not loaded. Unable to render React component.</div>';
            }
          }
        } catch (err: any) {
          console.error('Component rendering error:', err);
          root.innerHTML = `<div class="p-4 bg-red-50 border border-red-300 rounded text-red-700">
            <h3 class="font-bold mb-2">Rendering Error</h3>
            <p class="text-sm">${err?.message || 'Failed to render component'}</p>
            <p class="text-xs mt-2">Try regenerating or asking for a simpler design.</p>
          </div>`;
        }
      } else {
        // Handle regular HTML rendering
        try {
          // Validate HTML before rendering
          if (!cleaned || cleaned.length < 10) {
            root.innerHTML = '<div class="p-4 text-gray-500">Generating content...</div>';
            return;
          }
          
          root.innerHTML = cleaned;
          
          // Initialize any embedded scripts in plain HTML
          const scripts = root.querySelectorAll('script');
          scripts.forEach(oldScript => {
            try {
              const scriptContent = oldScript.textContent?.trim();
              if (oldScript.parentNode) {
                const newScript = doc.createElement('script');
                if (oldScript.src) {
                  newScript.src = oldScript.src;
                } else if (scriptContent) {
                  newScript.textContent = scriptContent;
                }
                oldScript.parentNode.replaceChild(newScript, oldScript);
              }
            } catch (scriptErr) {
              console.warn('Failed to initialize script:', scriptErr);
              // Silently skip problematic scripts
            }
          });
        } catch (err: any) {
          console.error('HTML rendering error:', err);
          // Only show error if it's not just incomplete streaming
          if (cleaned && cleaned.length > 50) {
            root.innerHTML = `<div class="p-4 text-yellow-600">Rendering... (${err?.message || 'Processing'})</div>`;
          }
        }
      }

      // Re-attach event listeners after content update
      let hoverEl: HTMLElement | null = null;

      const handleMouseOver = (e: MouseEvent) => {
        if (selectedElRef.current) return;
        const target = e.target as HTMLElement;
        if (hoverEl && hoverEl !== target) {
          hoverEl.style.outline = '';
        }
        hoverEl = target;
        hoverEl.style.outline = '2px dotted blue';
      };

      const handleMouseOut = (e: MouseEvent) => {
        if (selectedElRef.current) return;
        if (hoverEl) {
          hoverEl.style.outline = '';
          hoverEl = null;
        }
      };

      const handleClick = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const target = e.target as HTMLElement;
        if (selectedElRef.current && selectedElRef.current === target) {
          clearSelection();
          return;
        }
        if (selectedElRef.current && selectedElRef.current !== target) {
          selectedElRef.current.style.outline = '';
          selectedElRef.current.removeAttribute('contenteditable');
        }
        selectedElRef.current = target;
        selectedElRef.current.style.outline = '2px solid red';
        selectedElRef.current.setAttribute('contenteditable', 'true');
        selectedElRef.current.focus();
        setSelectedElement(selectedElRef.current);
      };

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && selectedElRef.current) {
          clearSelection();
        }
      };

      if (doc.body) {
        doc.body.addEventListener('mouseover', handleMouseOver);
        doc.body.addEventListener('mouseout', handleMouseOut);
        doc.body.addEventListener('click', handleClick);
      }
      doc.addEventListener('keydown', handleKeyDown);

      // CRITICAL FIX: Cleanup function to remove event listeners
      return () => {
        if (doc.body) {
          doc.body.removeEventListener('mouseover', handleMouseOver);
          doc.body.removeEventListener('mouseout', handleMouseOut);
          doc.body.removeEventListener('click', handleClick);
        }
        doc.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [generatedCode]);

  useEffect(()=>{
    onSaveData&& onSaveCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[onSaveData]);

  const onSaveCode=async()=>{
    if(iframeRef.current){
      try{
        const iframeDoc=iframeRef.current.contentDocument || 
        iframeRef.current.contentWindow?.document;
        if(iframeDoc){
          // Get only the body content from #root to match AI save format
          const rootEl = iframeDoc.getElementById('root');
          if (!rootEl) return;
          
          // Clean up any outlines in the root content
          const AllEls = rootEl.querySelectorAll<HTMLElement>('*');
          AllEls.forEach((el)=>{
            el.style.outline='';
            el.style.cursor='';
          })
          
          // Save with ```html prefix to match AI format and loader expectations
          const bodyContent = rootEl.innerHTML;
          const designCode = '```html\n' + bodyContent;

          const result=await axios.put('/api/frames',{
            designCode:designCode,
            frameId:frameId,
            projectId:projectId
          });
          
          toast.success('saved successfully!')
        }
      }catch(err){
          
      }
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-2 w-full">
      <div className="p-2 w-full flex items-center flex-col">
        <iframe
          ref={iframeRef}
          className={`${selectedScreenSize == 'web' ? 'w-full' : 'w-full sm:w-130'} h-[400px] sm:h-[500px] md:h-[600px] border-2 rounded-xl`}
          sandbox="allow-scripts allow-same-origin allow-forms"
        />
        <WebPageTools
          selectedScreenSize={selectedScreenSize}
          setselectedScreenSize={(v: string) => setselectedScreenSize(v)}
          generatedCode={generatedCode}
        />
      </div>
      {/* Setting section */}
      <div ref={settingsRef} className="w-full lg:w-auto">
      {selectedElement?.tagName == 'IMG' ?
      //@ts-ignore
        <ImageSettingSection selectedEL={selectedElement} />
        : selectedElement ? <ElementSettingSection selectedEl={selectedElement}
          clearSelection={clearSelection} /> : null
      }
      </div>
    </div>
  );
}

export default WebsiteDesign