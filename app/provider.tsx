 "use client"
 import React from 'react'
 import { useEffect, useState } from 'react';
 import { useUser } from '@clerk/nextjs';
 import axios from 'axios'  
import { UserDetailContext } from '@/context/UserDetailContext';
import { OnSaveContext } from '@/context/OnSaveContext';
 
 function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const {user} = useUser();
  const [userDetail,setUserDetail] = useState<any>();
  const [onSaveData, setOnSaveData] = useState<any>(null);
  useEffect(() => {
    user && CreateNewUser();
  }, [user])

  const CreateNewUser = async () => {
    const result = await axios.post('/api/users', {
    })
    
    setUserDetail(result.data?.user);

  }
   return (
     <div>
        <UserDetailContext.Provider value = {{userDetail, setUserDetail}}>
          <OnSaveContext.Provider value = {{onSaveData, setOnSaveData}}>
            {children}
            </OnSaveContext.Provider>
        </UserDetailContext.Provider>
     </div>
   )
 }
 
 export default Provider