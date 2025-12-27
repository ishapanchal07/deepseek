"use client";
import { createContext, useContext, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

export const AppContext = createContext(null);

export const useAppContext = () => {
  return useContext(AppContext);
};

export const AppContextProvider = ({ children }) => {
  const { user } = useUser()
  const {getToken} = useAuth()

  const [chats, setChats] = useState([]);
  const [selectedChat, setselectedChat] = useState(null);

  const createNewChat = async ()=>{
    try {
      if(!user) return null;

      const token = await getToken();

      await axios.post('/api/chat/create', {}, {headers:{
        Authorization: `Bearer ${token}`
      }})
    } catch (error) {
      toast.error(error.message)
    }
  }

  const fetchUsersChats = async ()=>{
    try {
      const token = await getToken();
      const {data} = await axios.post('/api/chat/get', {}, {headers:{
        Authorization: `Bearer ${token}`
      }})
      if(data.success){
        console.log(data.data);
        setChats(data.data)

        // If the user has no chats, create one
        if(data.data.length === 0){
          await createNewChat();
          return fetchUsersChats();
        }else{
          // sort chats by updated data
          data.data.sort((a,b)=> new Date(b.updatedAt) - new Date(a.updatedAt));

          // Set recently updated chat as selected
          setselectedChat(data.data[0]);
          console.log(data.data[0]);
        }
      }else{
        toast.error(data.message)
      }
    } catch (error) {
     toast.error(error.message) 
    }
  }

  const value = { user };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
