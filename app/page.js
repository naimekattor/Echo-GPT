'use client';
import { useEffect, useState } from 'react';
import { BiSolidMessageAdd } from "react-icons/bi";
import { FaArrowUp } from "react-icons/fa";
import { HiOutlineBars3BottomLeft } from "react-icons/hi2";
const Page = () => {
  const [input,setInput]=useState('');
  const [messages,setMessages]=useState([]);
  const [messageHistory,setMessageHistory]=useState([]);
  const [isLoading,setIsLoading]=useState(false);
  const [isError,setIsError]=useState(false);
  const [showSidebar,setShowSidebar]=useState(false);


const apiKey=process.env.ECHOGPT_API_KEY;


// handle chat history
useEffect(()=>{
      localStorage.setItem('messageHistory',JSON.stringify(messageHistory));
},[messageHistory]);


useEffect(()=>{
     const savedHistory=localStorage.getItem('messageHistory');
     if (savedHistory) {
      setMessageHistory(JSON.parse(savedHistory))
     }
},[])


  const handleSubmit=async (e) =>{
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    try{
      // Add User Message
      const userMessage={
        role:'user',
        content:input,
        timestamp:Date.now()
      }
      const updatedMessages=[...messages,userMessage];
      setMessages(updatedMessages);
      setInput('');
      setIsLoading(true);
      setIsError('');
      // Api Call & handle response
   const response=await fetch('https://api.echogpt.live/v1/chat/completions', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey
      },
      body: JSON.stringify({
          messages: [{ role: 'system', content: 'You are a helpful assistant.' }],
          "model": "EchoGPT"
      })
  })
  const data=await response.json();
  

  // Add Assistant Message
  const assistantMessage={
    role:'system',
        content:data.choices[0].message.content ,
        timestamp:Date.now()
  }
  setMessages(prev=>[...prev,assistantMessage]);
  // Update Message History
  if (updatedMessages.length>0) {
    setMessageHistory(prev=>[...prev, {
      id : Date.now().toString(),
      title:input.substring(0,50),
      message:[userMessage,assistantMessage]
    }])
  }
  //console.log(messageHistory);
  
  setIsLoading(false)
    }
    
catch(error){
  console.log('Error found',error);
  
}
  }
  return (
    <div className='bg-gradient-to-b   from-[#f8f5f2] from-0%  to-[#fdeee1] to-100% flex flex-col md:flex-row min-h-screen'>
      {/* Sidebar */}
      <div className='w-64 bg-amber-50 border-r-2 border-amber-200 md:block hidden'>
        {/* history */}
        <div className=' flex flex-col '>
          <div className=' flex items-center justify-between p-2 space-x-2'>
          <h1 className=' text-[26px] text-black font-bold'>EchoGPT</h1>
          <div className='flex items-center space-x-1 hover:bg-amber-300 rounded-2xl bg-amber-100 p-2 cursor-pointer'>
          <span><BiSolidMessageAdd /></span>
          <button className='  font-semibold cursor-pointer' onClick={()=>setMessages([])}> New Chat</button>
          </div>
          </div>
          <div className='space-y-2'>
            {
              messageHistory.map((history)=>(
                <div key={history.id} className='p-3 hover:bg-amber-300 rounded-lg cursor-pointer transition-colors' onClick={()=>setMessages(history.message)}>
                  <p className=' truncate'>{history.title}</p>
                  <span className='text-xs text-gray-400'>{new Date(history.message[0].timestamp).toLocaleDateString()}</span>
                </div>
              ))
            }
          </div>
          
        </div>
      </div>
      
       {/* responsive sidebar */}
       <div className='flex md:hidden justify-between p-4'>
        <button className=' text-2xl text-black font-bold' onClick={()=>setShowSidebar(!showSidebar)}><HiOutlineBars3BottomLeft/></button>
        <h1 className=' text-2xl text-black font-bold'>EchoGPT</h1>
        <button className=' text-2xl text-black font-bold' onClick={()=>setMessages([])}><BiSolidMessageAdd /></button>
       </div>
       <div className={`w-36 bg-[#f7f1eb] h-screen fixed z-10  ${showSidebar?' translate-x-0':' -translate-x-full'} transition-transform duration-300`}>
       {
        showSidebar && (
          <div >
          <div className=' flex flex-col '>
             <div className=' flex items-center justify-between p-2 space-x-2'>
             <button className= {`text-2xl text-black font-bold`} onClick={()=>setShowSidebar(!showSidebar)}><HiOutlineBars3BottomLeft/></button>
             <button className=' text-2xl text-black font-bold' onClick={()=>setMessages([])}><BiSolidMessageAdd /></button>
             </div>
             <div className='space-y-2'>
               {
                 messageHistory.map((history)=>(
                   <div key={history.id} className='p-3 hover:bg-amber-300 rounded-lg cursor-pointer transition-colors' onClick={()=>setMessages(history.message)}>
                     <p className=' truncate'>{history.title}</p>
                     <span className='text-xs text-black'>{new Date(history.message[0].timestamp).toLocaleDateString()}</span>
                   </div>
                 ))
               }
             </div>
             
           </div>
          </div>
        )
       }
       </div>
       
        
      {/* Main Chat Area */}
      <div className='flex flex-col flex-1'>
        {/* message area */}
        <div className='flex-1  overflow-y-auto p-4 space-y-4'>
          {
            messages.map((message,index)=>(
              <div key={index} className={`flex gap-2 p-4 ${message.role === 'user'?'justify-end':' justify-start'}  `}>
              <div className={`max-w-3xl p-4 rounded-lg ${message.role === 'user'?'bg-amber-200 rounded-br-none':' bg-amber-300 rounded-bl-none'}`}>
            <p className='text-sm whitespace-pre-wrap '>{message.content}</p>
            
            <span className=' text-xs mt-1 block text-right opacity-75'>{new Date(message.timestamp).toLocaleTimeString()}</span>
            </div>
            </div>
            ))
          }
          {
            isLoading && (
              <div className="mx-auto w-full max-w-sm rounded-md border border-blue-300 p-4">
  <div className="flex animate-pulse space-x-4">
    <div className="size-10 rounded-full bg-amber-300"></div>
    <div className="flex-1 space-y-6 py-1">
      <div className="h-2 rounded bg-amber-300"></div>
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 h-2 rounded bg-amber-300"></div>
          <div className="col-span-1 h-2 rounded bg-amber-300"></div>
        </div>
        <div className="h-2 rounded bg-amber-300"></div>
      </div>
    </div>
  </div>
</div>
            )
          }
          
        </div>
        <div className='flex justify-center mb-6 sticky bottom-0'>
        <form onSubmit={handleSubmit} className='md:w-1/2 w-full  drop-shadow-2xl bg-[#f8f1ea] p-4 rounded-full border-t border-white mb-8 '>
          <div className='flex space-x-2'>
            <input 
            onChange={(e)=>setInput(e.target.value)} 
            value={input} 
            disabled={isLoading}
            className='w-full bg-white p-2 rounded-full focus:outline-0 disabled:cursor-not-allowed disabled:opacity-50' type='text' placeholder='Ask Anything'></input>
            <button className='text-white bg-black p-2 size-8 rounded-full hover:bg-amber-300 hover:text-black cursor-pointer'><FaArrowUp /></button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
};

export default Page;