"use client"
import { createContext, useContext, useEffect, useState } from "react"
import { useAuth, useUser } from "@clerk/nextjs"
import axios from "axios"
import toast from "react-hot-toast"

export const AppContext = createContext(null)

export const useAppContext = () => useContext(AppContext)

export const AppContextProvider = ({ children }) => {
    const { user } = useUser()
    const { getToken } = useAuth()

    const [chats, setChats] = useState([])
    const [selectedChat, setSelectedChat] = useState(null)

    const createNewChat = async () => {
        try {
            if (!user) return

            const token = await getToken()

            await axios.post(
                "/api/chat/create",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            fetchUsersChats()
        } catch (err) {
            toast.error(err.message)
        }
    }

    const fetchUsersChats = async () => {
        try {
            const token = await getToken()

            const { data } = await axios.get(
                "/api/chat/get",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            if (!data.success) {
                toast.error(data.message)
                return []
            }

            const sortedChats = data.data.sort(
                (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
            )

            setChats(sortedChats)

            if (sortedChats.length === 0) {
                await createNewChat()
                return []
            } else {
                setSelectedChat(sortedChats[0])
                return sortedChats
            }
        } catch (err) {
            toast.error(err.message)
            return []
        }
    }

    const ensureChatExists = async () => {
        try {
            if (!user) return null

            // If we already have a selected chat, return it
            if (selectedChat) return selectedChat

            // Try to fetch chats
            const token = await getToken()
            const { data } = await axios.get(
                "/api/chat/get",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            if (data.success && data.data && data.data.length > 0) {
                const sortedChats = data.data.sort(
                    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
                )
                setChats(sortedChats)
                setSelectedChat(sortedChats[0])
                return sortedChats[0]
            }

            // No chats exist, create one
            const createResponse = await axios.post(
                "/api/chat/create",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            if (createResponse.data.success) {
                // Fetch the newly created chat
                const { data: fetchData } = await axios.get(
                    "/api/chat/get",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )

                if (fetchData.success && fetchData.data && fetchData.data.length > 0) {
                    const sortedChats = fetchData.data.sort(
                        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
                    )
                    setChats(sortedChats)
                    setSelectedChat(sortedChats[0])
                    return sortedChats[0]
                }
            }

            return null
        } catch (err) {
            toast.error(err.message)
            return null
        }
    }

    useEffect(() => {
        if (user) {
            fetchUsersChats()
        }
    }, [user])

    return (
        <AppContext.Provider
            value={{
                user,
                chats,
                setChats,
                selectedChat,
                setSelectedChat,
                fetchUsersChats,
                createNewChat,
                ensureChatExists,
            }}
        >
            {children}
        </AppContext.Provider>
    )
}
