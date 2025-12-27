import { assets } from '@/assets/assets'
import React, { useState } from 'react'
import Image from 'next/image'
import { useAppContext } from '@/context/AppContext';
import toast from 'react-hot-toast';
import axios from 'axios';


const PromptBox = ({setIsLoading, isLoading}) => {
    const [prompt, setPrompt] = useState('');
    const {user, chats, setChats, selectedChat, setSelectedChat} = useAppContext();

    const sendPrompt = async (e)=>{
        const promptCopy = prompt;

        try {
            e.preventDefault();
            if(!user) return toast.error('Login to send message');
            if(isLoading) return toast.error('Wait for the previous prompt responce');

            setIsLoading(true)
            setPrompt("")

            const usetPrompt = {
                role: "user",
                content: prompt,
                timestamp: Date.now,
            }

            // Saving user prompt in chats array 

            setChats((prevChats)=> prevChats.map((chat)=> chat._id === selectedChat._id ? {
                ...chat,
                messages: [...chat.messages, userPrompt]
            }: chat
        ))

        // Saving user prompt in selected chat 

        setSelectedChat((prve)=> ({
            ...prev,
            messages: [...prev.messages, userPrompt]
        }))
        

        const {data} = await axios.post('/api/chat/ai', {
            chatId: selectedChat._id,
            prompt
        })

        if(data.success){
            setChats((prevChats)=>prevChats.map(chat._id === selectedChat._id ? {...chat, messages: [...chat.messages, data.data]} : chat))
        }else{
            
        }
        } catch (error) {
            
        }
    }
    const [isExpanded,setIsExpanded] = useState(false)

    return (
        <form
            className={`w-full ${
                isExpanded ? 'max-w-3xl' : 'max-w-2xl'
            } bg-[#404045] p-4 rounded-3xl mt-4 transition-all`}
        >
            <textarea
                className="outline-none w-full resize-none overflow-hidden break-words bg-transparent text-white"
                rows={2}
                placeholder="Message Deepseek"
                onChange={(e)=> setPrompt(e.target.value)} value={prompt}
            />

           <div className='flex items-center justify-between text-sm'>
             <div className='flex items-center gap-2'>
                <p className="flex items-center gap-2 text-xs border border-gray-300/40 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition">
                <Image className="h-5"   src={assets.deepthink_icon} alt="Search" />
                {/* <Image className="h-5" src="https://images.seeklogo.com/logo-png/61/2/deepseek-ai-icon-logo-png_seeklogo-611473.png" height={20} width={20} alt="Search" /> */}

                DeepThink (R1)
                </p>
                <p className="flex items-center gap-2 text-xs border border-gray-300/40 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition">
                <Image className="h-5" src={assets.search_icon} alt='search-image' />
                Search
                </p>
            </div>
            <div className='flex items-center gap-2'>
                <Image className="w-4 cursor-pointer" src={assets.pin_icon} alt=''  />
                <button className={`${prompt ? "bg-primary" : "bg-[#71717a]"} rounded-full p-2 cursor-pointer`}>
                    <Image className="w-4 cursor-pointer" src={prompt ? assets.pin_icon : assets.arrow_icon_dull} alt=''  />
                </button>
            </div>
           </div>
        </form>
    )
}

export default PromptBox
