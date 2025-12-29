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

            const { data } = await axios.post(
                "/api/chat/get",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            if (!data.success) {
                toast.error(data.message)
                return
            }

            const sortedChats = data.data.sort(
                (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
            )

            setChats(sortedChats)

            if (sortedChats.length === 0) {
                await createNewChat()
            } else {
                setSelectedChat(sortedChats[0])
            }
        } catch (err) {
            toast.error(err.message)
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
            }}
        >
            {children}
        </AppContext.Provider>
    )
}
