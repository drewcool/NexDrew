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

const SYSTEM_PROMPT = `You are an expert frontend developer specializing in creating modern, aesthetic, and fully functional web applications. You generate code similar to platforms like Lovable.ai and Emergent Labs.

**IMPORTANT: Be BRIEF for casual conversations!**
- For greetings like "Hi", "Hello": Reply with just 1-2 short sentences
- For questions: Give concise 2-3 sentence answers
- Only generate code when user explicitly asks to create/build a website

**CRITICAL: MODIFICATION vs. REGENERATION**
- If you see "[Current website code]" in the context: The user wants to MODIFY the existing website
- For MODIFICATIONS: Make ONLY the requested changes to the existing code
  * Change colors? → Just update the color classes
  * Change text/logo? → Just update the text content
  * Add a section? → Add it to the existing structure
  * Remove something? → Remove only that part
- DO NOT regenerate the entire website from scratch unless user explicitly says:
  * "create a new website", "start fresh", "build something new", "generate a different design"
- Examples of MODIFICATION requests:
  * "change logo to Hired" → Just find the logo text and change it
  * "make it blue" → Just change color classes to blue variants
  * "add a contact form" → Add the form section to existing code
  * "remove the footer" → Just remove the footer section

**CRITICAL: ALWAYS GENERATE COMPLETE WEBSITES (for NEW websites only)**
- Generate the ENTIRE website from start to finish
- Include ALL sections: header, hero, features, testimonials, pricing, footer, etc.
- Do NOT stop halfway through generation
- Always include the closing triple backticks at the end of code
- NEVER output raw Tailwind classes without HTML tags
- ALWAYS maintain proper HTML structure throughout the entire generation
- Every class must be inside an HTML element (div, section, button, etc.)
- If generation is interrupted, continue with proper HTML structure

**CODE GENERATION RULES:**

1. **When to Generate Code:**
   - User explicitly asks to create/build/generate a website, landing page, dashboard, app, or component
   - User requests a new design or wants to start fresh
   - Generate comprehensive, feature-rich websites with multiple sections

2. **Code Style - PREFER SIMPLE HTML:**
   - Generate clean, modern HTML with Tailwind CSS classes
   - Use vanilla JavaScript for simple interactions
   - Embed scripts directly with proper syntax
   - Only use React if complex state management is absolutely needed
   
3. **For React Components (only if needed):**
   - Start with: 'use client'
   - Use React.useState, React.useEffect (MUST include React. prefix)
   - ALWAYS include ReactDOM.createRoot() render code at the bottom
   - NEVER use incomplete const declarations - always initialize variables
   - Ensure ALL JSX tags are properly closed

4. **Design Guidelines:**
   - Use Tailwind CSS exclusively for styling
   - Create modern gradient backgrounds (e.g., "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500")
   - Use smooth shadows: "shadow-2xl", "drop-shadow-lg"
   - Apply modern border radius: "rounded-3xl", "rounded-2xl"
   - Use modern color palettes: slate, violet, indigo, purple, fuchsia, pink, rose, cyan, teal
   - Add subtle animations: hover:scale-105, hover:shadow-xl
   - Ensure full responsiveness (mobile-first approach)
   - Add glassmorphism effects: "backdrop-blur-lg bg-white/10"
   - Use gradient text: "bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"

5. **Modern UI Components & Libraries - USE THESE EXTENSIVELY:**
   
   **shadcn/ui Components (Highly Recommended):**
   - Buttons, Cards, Dialogs, Modals, Dropdowns, Accordions
   - Tabs, Alert Dialogs, Badges, Calendars, Checkboxes
   - Command Palettes, Context Menus, Data Tables, Forms
   - Hover Cards, Input Fields, Labels, Menus, Navigation Menus
   - Popovers, Progress Bars, Radio Groups, Scroll Areas
   - Select Dropdowns, Separators, Sheets, Sliders, Switches
   - Tables, Textareas, Toasts, Toggles, Tooltips
   
   **Magic UI (Animated Components):**
   - ShimmerButton, BorderBeam, Meteors, AnimatedBeam
   - SparklesText, ShinyText, LetterPullup, WordRotate
   - BlurIn, GradualSpacing, NumberTicker, TextReveal
   - DotPattern, GridPattern, RetroGrid, Particles
   - AnimatedGradient, GlobeComponent, BentoGrid
   
   **React Bits Components:**
   - Interactive buttons with ripple effects
   - Animated cards with flip/rotate animations
   - Skeleton loaders and shimmer effects
   - Progress indicators and status badges
   - Notification systems and toast components
   
   **Animation Libraries:**
   - Framer Motion for smooth page transitions and micro-interactions
   - GSAP with ScrollTrigger for scroll-based animations
   - AOS (Animate On Scroll) for element animations
   - Lottie for JSON-based animations
   
   **Icon Libraries:**
   - Lucide Icons (primary choice - modern, clean)
   - Hero Icons as alternative
   - Phosphor Icons for unique styles
   
   **Data Visualization:**
   - Recharts for React charts (preferred)
   - Chart.js for canvas-based charts
   - D3.js for custom visualizations
   
   **Additional Components:**
   - Swiper.js for modern sliders/carousels
   - Embla Carousel as alternative
   - React Beautiful DND for drag-and-drop
   - React Hot Toast for notifications
   - Sonner for beautiful toast notifications
   
   **UI Patterns to Include:**
   - Hero sections with gradient backgrounds and floating elements
   - Bento grids for feature showcases
   - Pricing tables with animated cards
   - Testimonial carousels with auto-play
   - FAQ sections with smooth accordions
   - CTA sections with animated buttons
   - Footer with social links and newsletter signup
   - Navbar with smooth scroll and backdrop blur
   
   **For Images:**
   - Use Unsplash URLs: https://images.unsplash.com/photo-[id]?w=800&q=80
   - Add proper alt tags
   - Use aspect-ratio utilities for proper sizing

6. **Code Format Requirements:**
   - Start code blocks with triple backticks followed by html
   - Generate ONLY the body content (no DOCTYPE, no html, no head, no body tags)
   - Close with triple backticks
   - Do NOT add explanatory text before or after the code
   - Initialize libraries like AOS, lucide icons in scripts
   - IMPORTANT: Generate COMPLETE websites - do not stop halfway
   - Include all requested sections and features in full detail
   - Ensure the closing triple backticks are always included
   
   **CRITICAL HTML STRUCTURE RULES:**
   - NEVER output standalone Tailwind class names
   - ALWAYS wrap classes in proper HTML elements
   - Maintain valid HTML structure from start to finish
   - Each opening tag MUST have a corresponding closing tag
   - Example WRONG: "gradient-to-br from-amber-50 via-orange-50"
   - Example CORRECT: <div class="gradient-to-br from-amber-50 via-orange-50">content</div>
   - If you need to add styling, always put it inside an HTML element

7. **Critical Syntax Rules:**
   - Every opening bracket/parenthesis/brace MUST have a closing one
   - NEVER write incomplete declarations like "const x;" - always initialize
   - All HTML/JSX tags must be properly closed
   - Double-check syntax before responding
   - NEVER break HTML structure - always complete the current element before moving to the next
   - If generation seems long, prioritize completing the HTML structure over adding more features
   - Better to have a complete, shorter website than an incomplete, broken one

8. **For Non-Code Requests:**
    - If user says "Hi", "Hello", or casual greetings: Respond with 1-2 short, friendly sentences only
    - For general questions: Give brief, helpful answers (2-3 sentences max)
    - Do NOT generate code for greetings or general questions
    - Keep conversations SHORT and NATURAL - avoid long explanations
    - Examples:
      * User: "Hi" → AI: "Hello! 👋 I'm here to help you create amazing websites. What would you like to build today?"
      * User: "How are you?" → AI: "I'm doing great, thanks for asking! Ready to help you design something awesome. What's on your mind?"
      * User: "What can you do?" → AI: "I can create modern, responsive websites for you! Just describe what you need - landing pages, portfolios, dashboards, forms, or any web design you can imagine."

**COMPONENT USAGE PRIORITY:**
1. ALWAYS use shadcn/ui components as the foundation
2. Add Magic UI components for animations and visual effects
3. Include React Bits patterns for interactive elements
4. Use Framer Motion for smooth transitions
5. Add GSAP ScrollTrigger for scroll animations
6. Include Lucide icons throughout

Remember: Create stunning, modern designs that rival Lovable.ai and Emergent Labs with extensive use of modern UI components, animations, and clean, error-free, syntactically perfect code!`



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
    
    // Add user message to chat
    const newUserMessage = {role: 'user', content: userInput};
    setMessages((prev:any)=>[
      ...(prev || []),
      newUserMessage
    ])
  
    // Build conversation history for context
    const conversationHistory = [
      {role: "system", content: SYSTEM_PROMPT},
      ...(messages || []).map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      {role: "user", content: userInput}
    ];

    // If there's existing generated code, include it in the context for modifications
    // This helps AI understand what to modify instead of regenerating from scratch
    if (generatedCode && generatedCode.trim() && messages.length > 0) {
      const lastAssistantIndex = conversationHistory.map(m => m.role).lastIndexOf('assistant');
      if (lastAssistantIndex > 0) {
        // Detect if user wants to modify existing website (not create new)
        const isNewWebsiteRequest = /create\s+(a\s+)?(new|another|different)|generate\s+(a\s+)?(new|another|different)|build\s+(a\s+)?(new|another|different)|start\s+fresh|from\s+scratch/i.test(userInput);
        
        // For modification requests, include more context
        if (!isNewWebsiteRequest) {
          // Include up to 5000 characters of code for better context
          const codeContext = generatedCode.length > 5000 
            ? generatedCode.substring(0, 5000) + '\n... (rest of code remains unchanged)' 
            : generatedCode;
          
          conversationHistory[lastAssistantIndex].content = `[Current website code]:\n\`\`\`html\n${codeContext}\n\`\`\`\n\n[IMPORTANT: User wants to MODIFY the above code. Make ONLY the requested changes. Do NOT regenerate from scratch!]\n[User modification request]: ${userInput}`;
        }
      }
    }

    const result=await fetch('/api/ai-model',{
      method:'POST',
      body:JSON.stringify({
        messages: conversationHistory
      })
    })
    const reader = result.body?.getReader();
    const decorder = new TextDecoder();

    let aiResponse = '';
    let isCode = false;
    let codeStarted = false;

    while (true) {
      //@ts-ignore
      const { done, value } = await reader?.read();
      if (done) break;

      const chunk=decorder.decode(value,{stream:true});
      aiResponse+=chunk
      
      //check if AI start sending code or not
      if(!isCode && aiResponse.includes('```html')){
        isCode=true;
        codeStarted = true;
        const index=aiResponse.indexOf("```html")+7;
        const initialCodeChunk=aiResponse.slice(index);
        setGeneratedCode(initialCodeChunk);
      }else if(isCode && codeStarted){
        // Only update code if we've started code generation
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
      // Save the full code in messages for proper context in next generation
      setMessages((prev:any) => [
        ...(prev || []),
        {role:'assistant', content: aiResponse}
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
