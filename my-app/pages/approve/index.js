import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { ethers } from "ethers";
import { useState } from "react";
import ABI from "../../contracts/mpc.json"
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useProvider, useSigner } from 'wagmi';

export default function Approve() {
    const defaultSnapOrigin = `local:http://localhost:8080`;
    const provider = useProvider();
  const {data:signer} = useSigner();
  console.log(signer)
  const[approval,setApproval] = useState("");


const mpcContract = new ethers.Contract("0x29931323e11EC65De81cd6C1b5bCe64A13483D9e",ABI,signer)
   console.log(mpcContract)

   const handleApprove = async() => {
    
    console.log(signer._address)
   const owners = await mpcContract.getOwners();
   let tx;
    console.log(owners)
    for(let i = 0;i<owners[i];i++)
    {
        if(owners[i]===signer._address)
        {
           tx = await mpcContract.setApproval(signer._address);
          await tx.wait();
          console.log("Transaction:", tx.hash);
            console.log("Owner found")
            break;
        }
        else{
            console.log("You are not approved!")

        }

    }
   
   }
   const approvalCount = async () => {
    const Count = await mpcContract.getApproval();
    const approve = Count.toString();
    setApproval(approve)
    console.log(approve)
   
    


   }
   approvalCount()

  
 


   
   
    
      

    
    return (
        <>
        <Head>
       
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link href="/dist/output.css" rel="stylesheet"/>
        
      </Head>
      
     
        


      <div class="grid my-8 ml-4  place-items-stretch  h-48"> 
        <ConnectButton/>
      <div class="w-full max-w-xs  place-self-center">
  <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
   
    
    <div class="flex items-center justify-between">
      <button class="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={()=>handleApprove()} type="button">
       I Approve
      </button>
      
      <div class="inline-block align-baseline font-bold text-sm text-black hover:text-blue-800" href="#">
       Approval Count: {approval}
      </div>
    </div>
   
  </form>
 
</div>
</div>





    </>
  )
}