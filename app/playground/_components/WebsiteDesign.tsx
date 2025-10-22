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
        <meta name="description" content="AI Website Builder - Modern TailwindCSS + Flowbite Template">
        <title>AI Website Builder</title>
        <!-- Tailwind CSS -->
        <script src="https://cdn.tailwindcss.com"></script>
        <!-- Flowbite CSS & JS -->
        <link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.css" rel="stylesheet">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.js"></script>
        <!-- Font Awesome / Lucide -->
        <script src="https://unpkg.com/lucide@latest/dist/und/lucide.js"></script>
        <!-- Chart.js -->
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        
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
      root.innerHTML = cleaned;

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
    }
  }, [generatedCode]);

  useEffect(()=>{
    onSaveData&& onSaveCode();
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
    <div className="flex gap-2 w-full">
      <div className="p-2 w-full flex items-center flex-col">
        <iframe
          ref={iframeRef}
          className={`${selectedScreenSize == 'web' ? 'w-full' : 'w-130'} h-[600px] border-2 rounded-xl`}
          sandbox="allow-scripts allow-same-origin allow-forms"
        />
        <WebPageTools
          selectedScreenSize={selectedScreenSize}
          setselectedScreenSize={(v: string) => setselectedScreenSize(v)}
          generatedCode={generatedCode}
        />
      </div>
      {/* Setting section */}
      <div ref={settingsRef}>
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