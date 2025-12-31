"use client";

import { assets } from "@/assets/assets";
import Image from "next/image";
import React, { useState } from "react";
import { useClerk, UserButton } from "@clerk/nextjs";
import { useAppContext } from "@/context/AppContext";
import ChatLabel from "./ChatLabel";

const Sidebar = ({ expand, setExpand }) => {
  const { openSignIn } = useClerk();
  const { user } = useAppContext();
  const [openMenu, setOpenMenu] = useState({ id: 0, open: false });

  return (
    <>
      {/* ===== MOBILE OVERLAY ===== */}
      {expand && (
        <div
          onClick={() => setExpand(false)}
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
        />
      )}

      {/* ===== SIDEBAR ===== */}
      <div
        className={`fixed md:static top-0 left-0 h-screen flex flex-col justify-between bg-[#212327] pt-7 z-50
        transition-transform duration-300
        ${expand ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
        ${expand ? "p-4 w-64" : "md:w-20 w-64"}
      `}
      >
        {/* ===== TOP ===== */}
        <div>
          <div
            className={`flex ${
              expand ? "flex-row gap-10" : "flex-col items-center gap-8"
            }`}
          >
            <Image
              className={expand ? "w-36" : "w-10"}
              src={expand ? assets.logo_text : assets.logo_icon}
              alt=""
            />

            {/* MENU BUTTON */}
            <div
              onClick={() => setExpand(!expand)}
              className="group relative flex items-center justify-center hover:bg-gray-500/20 h-9 w-9 rounded-lg cursor-pointer"
            >
              <Image src={assets.menu_icon} alt="" className="md:hidden" />
              <Image
                src={expand ? assets.sidebar_close_icon : assets.sidebar_icon}
                alt=""
                className="hidden md:block w-7"
              />
            </div>
          </div>

          {/* NEW CHAT */}
          <button
            onClick={() => setExpand(false)}
            className={`mt-8 flex items-center justify-center cursor-pointer ${
              expand
                ? "bg-primary hover:opacity-90 rounded-2xl gap-2 p-2.5 w-max"
                : "group relative h-9 w-9 mx-auto hover:bg-gray-900/30 rounded-lg"
            }`}
          >
            <Image
              className={expand ? "w-6" : "w-7"}
              src={expand ? assets.chat_icon : assets.chat_icon_dull}
              alt=""
            />
            {expand && <p className="text-white font-medium">New chat</p>}
          </button>

          {/* RECENTS */}
          {expand && (
            <div className="mt-8 text-white/25 text-sm">
              <p className="my-1">Recents</p>
              <ChatLabel
                openMenu={openMenu}
                setOpenMenu={setOpenMenu}
                closeSidebar={() => setExpand(false)}
              />
            </div>
          )}
        </div>

        {/* ===== BOTTOM ===== */}
        <div>
          {/* GET APP */}
          <div
            className={`flex items-center cursor-pointer ${
              expand
                ? "gap-1 text-white/80 text-sm p-2.5 border border-primary rounded-lg hover:bg-white/10"
                : "h-10 w-10 mx-auto hover:bg-gray-500/30 rounded-lg"
            }`}
          >
            <Image
              className={expand ? "w-5" : "w-6.5 mx-auto"}
              src={expand ? assets.phone_icon : assets.phone_icon_dull}
              alt=""
            />
            {expand && (
              <>
                <span>Get App</span>
                <Image alt="" src={assets.new_icon} />
              </>
            )}
          </div>

          {/* PROFILE */}
          <div
            onClick={user ? () => setExpand(false) : openSignIn}
            className={`flex items-center ${
              expand ? "hover:bg-white/10 rounded-lg" : "justify-center"
            } gap-3 text-white/60 text-sm p-2 mt-2 cursor-pointer`}
          >
            {user ? <UserButton /> : <Image src={assets.profile_icon} alt="" className="w-7" />}
            {expand && <span>My Profile</span>}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

