import { assets } from '@/assets/assets'
import React, { useState } from 'react'
import Image from 'next/image'
import { useAppContext } from '@/context/AppContext'
import toast from 'react-hot-toast'
import axios from 'axios'

const PromptBox = ({ setIsLoading, isLoading }) => {
    const [prompt, setPrompt] = useState('')
    const { user, chats, setChats, selectedChat, setSelectedChat } = useAppContext()

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            sendPrompt(e)
        }
    }

    const sendPrompt = async (e) => {
        e.preventDefault()

        if (!user) return toast.error('Login to send message')
        if (!selectedChat) return toast.error('Chat not ready yet')
        if (isLoading) return toast.error('Wait for the previous response')
        if (!prompt.trim()) return

        const promptCopy = prompt
        const chatId = selectedChat._id

        try {
            setIsLoading(true)
            setPrompt('')

            const userPrompt = {
                role: 'user',
                content: prompt,
                timestamp: Date.now(),
            }

            /* ---------- optimistic update (user message) ---------- */

            setChats((prev) =>
                prev.map((chat) =>
                    chat._id === chatId
                        ? { ...chat, messages: [...chat.messages, userPrompt] }
                        : chat
                )
            )

            setSelectedChat((prev) => ({
                ...prev,
                messages: [...prev.messages, userPrompt],
            }))

            /* ---------- AI request ---------- */

            const { data } = await axios.post('/api/chat/ai', {
                chatId,
                prompt,
            })

            if (!data.success) {
                toast.error(data.message)
                setPrompt(promptCopy)
                return
            }

            /* ---------- add empty assistant message ---------- */

            const assistantMessage = {
                role: 'assistant',
                content: '',
                timestamp: Date.now(),
            }

            setChats((prev) =>
                prev.map((chat) =>
                    chat._id === chatId
                        ? { ...chat, messages: [...chat.messages, assistantMessage] }
                        : chat
                )
            )

            setSelectedChat((prev) => ({
                ...prev,
                messages: [...prev.messages, assistantMessage],
            }))

            /* ---------- typing animation ---------- */

            const tokens = data.data.content.split(' ')

            tokens.forEach((_, index) => {
                setTimeout(() => {
                    setSelectedChat((prev) => {
                        const messages = [...prev.messages]
                        const lastIndex = messages.length - 1

                        messages[lastIndex] = {
                            ...messages[lastIndex],
                            content: tokens.slice(0, index + 1).join(' '),
                        }

                        return { ...prev, messages }
                    })
                }, index * 80)
            })
        } catch (err) {
            toast.error(err.message)
            setPrompt(promptCopy)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form
            onSubmit={sendPrompt}
            className="w-full max-w-2xl bg-[#404045] p-4 rounded-3xl mt-4"
        >
            <textarea
                onKeyDown={handleKeyDown}
                className="outline-none w-full resize-none bg-transparent text-white"
                rows={2}
                placeholder="Message Deepseek"
                onChange={(e) => setPrompt(e.target.value)}
                value={prompt}
            />

            <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                    <p className="flex items-center gap-2 text-xs border border-gray-300/40 px-2 py-1 rounded-full">
                        <Image src={assets.deepthink_icon} alt="" width={16} height={16} />
                        DeepThink (R1)
                    </p>
                    <p className="flex items-center gap-2 text-xs border border-gray-300/40 px-2 py-1 rounded-full">
                        <Image src={assets.search_icon} alt="" width={16} height={16} />
                        Search
                    </p>
                </div>

                <button
                    type="submit"
                    className={`rounded-full p-2 ${
                        prompt ? 'bg-primary' : 'bg-[#71717a]'
                    }`}
                >
                    <Image
                        src={prompt ? assets.arrow_icon : assets.arrow_icon_dull}
                        alt=""
                        width={16}
                        height={16}
                    />
                </button>
            </div>
        </form>
    )
}

export default PromptBox
