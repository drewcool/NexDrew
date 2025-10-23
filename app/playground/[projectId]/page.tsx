"use client"
import React, { useEffect, useState } from 'react'
import PlaygroundHeader from '../_components/PlaygroundHeader'
import ChatSection from '../_components/ChatSection'
import WebsiteDesign from '../_components/WebsiteDesign'
import ElementSettingSection from '../_components/ElementSettingSection'
import { useParams, useSearchParams } from 'next/navigation'
import axios from 'axios'
import { toast } from 'sonner'

export type Frame={
  projectId:string,
  frameId:string,
  designCode:string,
  chatMessages: Messages[]
}
export type Messages = {
  role: string,
  content: string
}

const Prompt=`userInput: {userInput}
Instructions:
1. If the user input is explicitly asking to generate
code, design, or HTML/CSS/JS output (e.g., "Create a
landing page", "Build a dashboard", "Generate HTML
Tailwind CSS code"), then:
- Generate a complete HTML Tailwind CSS code using
Flowbite UI components.
- Use a modern design with **blue as the primary
color theme**.
- Only include the <body> content (do not add
<head> or <title>).
- Make it fully responsive for all screen sizes.
- All primary components must match the theme
color.
- Add proper padding and margin for each element.
- Components should be independent; do not connect
them.
- Use placeholders for all images:
- Light mode:
https://community.softr.io/uploads/db9110/original/2X/
7/74e6e7e382d0ff5d7773ca9a87e6f6f8817a68a6.jpeg
- Dark mode: https://www.cibaky.com/wp-
content/uploads/2015/12/placeholder-3.jpg
- Add alt tag describing the image prompt.
- Use the following libraries/components where
appropriate:
- FontAwesome icons (fa fa-)
- Flowbite UI components: buttons, modals,
forms, tables, tabs, alerts, cards, dialogs,
dropdowns, accordions, etc.
- Chart.js for charts & graphs
- Swiper.js for sliders/carousels
- Tippy.js for tooltips & popovers
- Include interactive components like modals,
dropdowns, and accordions.
- Ensure proper spacing, alignment, hierarchy, and
theme consistency.
- Ensure charts are visually appealing and match
the theme color.
- Header menu options should be spread out and not
connected.
- Do not include broken links.
- Do not add any extra text before or after the
HTML code.
2. If the user input is **general text or greetings**
(e.g., "Hi", "Hello", "How are you?") **or does not
explicitly ask to generate code**, then:
- Respond with a simple, friendly text message
instead of generating any code.
Example:
- User: "Hi" → Response: "Hello! How can I help you
today?"
- User: "Build a responsive landing page with Tailwind
CSS" → Response: [Generate full HTML code as per
instructions above]
`



function PlayGround() {
  const { projectId } = useParams();
  const params = useSearchParams();
  const frameId = params.get('frameId');

  const [frameDetail,setFrameDetail] = useState<Frame>();
  const [loading,setLoading] = useState(false);
  const [messages,setMessages]=useState<Messages[]>([]);
  const [generatedCode,setGeneratedCode]=useState<any>();

  useEffect(()=>{
    frameId && GetFrameDetails();
  }, [frameId])

  const GetFrameDetails = async () => {
    const result = await axios.get('/api/frames?frameId=' + frameId+"&projectId="+projectId)
    setFrameDetail(result.data);
    
    const designCode = result.data?.designCode;
    if(designCode && designCode.includes("```html")){
      const index = designCode.indexOf("```html") + 7;
      const formattedCode = designCode.slice(index);
      setGeneratedCode(formattedCode);
    }

    if(result.data?.chatMessages?.length==1){
      const userMsg=result.data?.chatMessages[0].content;
      SendMessage(userMsg)
    }else{
      setMessages(result.data?.chatMessages)
    }
  }

  const SendMessage = async(userInput: string) => {
    setLoading(true);
    // keep existing generated code until new code actually streams
    //Add user message to chat
    setMessages((prev:any)=>[
      ...(prev || []),
      {role: 'user', content: userInput}
    ])
  
    const result=await fetch('/api/ai-model',{
      method:'POST',
      body:JSON.stringify({
        messages:[{role:"user",content: Prompt?.replace('{userInput}',userInput)}]//pass prompt
      })
    })
    const reader = result.body?.getReader();
    const decorder = new TextDecoder();

    let aiResponse = '';
    let isCode = false;

    while (true) {
      //@ts-ignore
      const { done, value } = await reader?.read();
      if (done) break;

      const chunk=decorder.decode(value,{stream:true});
      aiResponse+=chunk
      //check if AI start sending code or not
      if(!isCode && aiResponse.includes('```html')){
        isCode=true;
        const index=aiResponse.indexOf("```html")+7;
        const initialCodeChunk=aiResponse.slice(index);
        setGeneratedCode(initialCodeChunk);
      }else if(isCode){
        setGeneratedCode((prev:any)=>(prev ?? '')+chunk);
      }
    }
    await SaveGeneratedCode(aiResponse);
     //After streaming ends
     if (!isCode) {
      setMessages((prev:any) => [
        ...(prev || []),
        {role:'assistant', content: aiResponse}
      ])
    }else{
      setMessages((prev:any) => [
        ...(prev || []),
        {role:'assistant', content: 'Your code is ready!'}
      ])
    }
    setLoading(false);
  }

  useEffect(()=>{
    if (messages.length>0){
      SaveMessages();
    }
  },[messages])

  const SaveMessages = async()=>{
    const result=await axios.put('/api/chats',{
      messages:messages,
      frameId:frameId
    });
    
  }


  const SaveGeneratedCode = async(code:string)=>{
    const result=await axios.put('/api/frames',{
      designCode:code,
      frameId:frameId,
      projectId:projectId
    });
    
    toast.success('Response Received!!')
  }

  
  return (
    <div>
        <PlaygroundHeader />
      <div className='flex flex-col md:flex-row overflow-hidden'>
        {/* chat section */}
        <ChatSection messages={messages ?? []} onSend={(input:string)=>SendMessage(input)} loading={loading} />
        {/* websiteDesign */}
        <WebsiteDesign generatedCode={generatedCode}/>
        
      </div>
    </div>
  )
}

export default PlayGround