import { db } from "@/config/db";
import { chatTable, frameTable, projectTable, usersTable } from "@/config/schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
    const {projectId, frameId, messages,credits}= await req.json();
    const user = await currentUser();
    const {has} =await auth();
    const hasUnlimitedAccess = has&&has({ plan: 'unlimited' })

    //create Project
    const projecrResult = await db.insert(projectTable).values({
      projectId:projectId,
      createdBy:user?.primaryEmailAddress?.emailAddress
    })

    //create Frame
    const frameResult = await db.insert(frameTable).values({
      frameId:frameId,
      projectId:projectId,
    })

    //save user message
    const chatResult = await db.insert(chatTable).values({
      chatMessages:messages,
      createdBy:user?.primaryEmailAddress?.emailAddress,
      frameId:frameId
    })

    //Update User Credits

    if(!hasUnlimitedAccess){
      const userResult=await db.update(usersTable).set({
        credits: (isNaN(Number(credits)) ? 0 : Number(credits) - 1)
        //@ts-ignore
      }).where(eq(usersTable.email,user?.primaryEmailAddress?.emailAddress))
    }

    return NextResponse.json({
      projectId, frameId, messages
    })
}

// export async function GET(req: NextRequest) {
//   const {searchParams} = new URL(req.url);
//   const projectId = searchParams.get('projectId');

//   const proejctResult = await db.select().from(projectTable).
//   //@ts-ignore
//   where(eq(projectTable.projectId,projectId));

//   const frameResult = await db.select().from(frameTable).
//   //@ts-ignore
//   where(eq(frameTable.projectId,projectId));

//   const finalResult = {
//     ...proejctResult[0],
//     frames:frameResult
    
//   }

//   return NextResponse.json(finalResult);
// }