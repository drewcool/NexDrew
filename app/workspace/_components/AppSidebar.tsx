"use client"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import { UserDetailContext } from "@/context/UserDetailContext"
import { useAuth, UserButton } from "@clerk/nextjs"
import axios from "axios"
import Image from "next/image"
import Link from "next/link"
import { useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { v4 as uuidv4 } from 'uuid'
import ShinyText from "@/components/ShinyText"


export function AppSidebar() {
  const [projectList,setProjectList]=useState([]);
  const {userDetail,setUserDetail} = useContext(UserDetailContext);
  const [loading,setLoading]=useState(false);
  const {has} = useAuth();
  const router = useRouter();

  useEffect(()=>{
    GetProjectList();
  },[]);

  const hasUnlimitedAccess = has&&has({ plan: 'unlimited' })

  const GetProjectList=async()=>{
    setLoading(true);
    const result = await axios.get('/api/get-all-projects');
    setProjectList(result.data);
    setLoading(false);
  }

  const CreateNewProject = async() => {
    if(!hasUnlimitedAccess && userDetail?.credits <= 0){
      toast.error('You have no credits left. Please upgrade to unlimited plan.')
      return;
    }

    setLoading(true);
    const projectId=uuidv4();
    const frameId=generateRandomFrameNumber();
    const messages = [
      {
        role:'user',
        content:'Hi'
      }
    ]
    try{
      const result = await axios.post('/api/projects',{
        projectId: projectId,
        frameId:frameId,
        messages:messages,
        credits: userDetail?.credits
      });
      
      toast.success('project created!')
      router.push(`/playground/${projectId}?frameId=${frameId}`)
      setUserDetail((prev:any)=>({...prev,credits:prev?.credits! -1}))
      setLoading(false);
    } catch (e) {
      toast.error('Internal server error!')
      
      setLoading(false);
    }
  }
  return (
    <Sidebar>
      <SidebarHeader className="p-3 sm:p-5">
        <div className="items-center flex gap-2">
          <Link href={'/workspace'} className="flex items-center gap-2">
          <Image src={'/Nexdrew_log.png'} alt="logo" width={40} height={40} className="sm:w-[50px] sm:h-[50px]" />
          <h2 className="text-lg sm:text-xl font-bold"><ShinyText text="NexDrew" speed={5} /></h2>
          </Link>
        </div>
        <Button className="w-full mt-3 sm:mt-5 text-sm sm:text-base" onClick={CreateNewProject} disabled={loading}>
          + Add New Project
        </Button>

      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs sm:text-sm">Projects</SidebarGroupLabel>
          {!loading && projectList.length == 0 &&
          <h2 className="text-xs sm:text-sm px-2 text-gray-500">No Project Found</h2>}

          <div>
            {(!loading&&projectList.length>0) ? projectList.map((project:any,index)=>(
              <Link href={`/playground/${project.projectId}?frameId=${project.frameId}`} key={index} className="my-2 hover:bg-secondary p-2 rounded-lg cursor-pointer block border-none outline-none">
                <h2 className="line-clamp-1 text-sm sm:text-base">{project.chats?.[0]?.chatMessages?.[0]?.content}</h2>
              </Link>
            )) :
            [1,2,3,4,5].map((_,index)=>(
              <Skeleton key={index} className="w-full h-8 sm:h-10 rounded-lg mt-2" />
            ))
            }
          </div>
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter className="p-2">
        {!hasUnlimitedAccess &&
        <div className="p-2 sm:p-3 border rounded-xl space-y-2 sm:space-y-3 bg-secondary">
        
          <h2 className="flex justify-between items-center text-xs sm:text-sm">Remaining Credits <span className="font-bold">{userDetail?.credits}</span></h2>
          <Progress value={(userDetail?.credits/4)*100} />
          <Link href={'/workspace/pricing'}>
            <Button className="w-full text-xs sm:text-sm">
              Upgrade to Unlimited
            </Button>
          </Link>
        </div>}
        <div className="flex items-center gap-2 mt-2">
          <UserButton />
          <Button variant={'ghost'} className="text-xs sm:text-sm">Settings</Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

const generateRandomFrameNumber = ()=> {
  const num = Math.floor(Math.random()*10000);
  return num
}