import React, { useEffect, useState } from "react";
import styled from "./chatList.module.css";
import AddUser from "./addUser/AddUser";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "./../../../lib/firebase";
import { useUserStore } from "./../../../lib/userStore";
import { useChatStore } from "./../../../lib/chatStore";

function ChatList() {
  const [addMode, setAddMode] = useState(false);
  const [input, setInput] = useState(false);
  const [chats, setChats] = useState([]);
  const { currentUser } = useUserStore();
  const { changeChat, chatId } = useChatStore();

  useEffect(() => {
    const unSub = onSnapshot(
      doc(db, "userchats", currentUser.id),
      async (res) => {
        const items = res.data().chats;
        const promises = items.map(async (item) => {
          const userDocRef = doc(db, "users", item.receiverId);
          const userDocSnap = await getDoc(userDocRef);
          const user = userDocSnap.data();
          return { ...item, user };
        });
        const chatData = await Promise.all(promises);
        setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
      }
    );
    return () => {
      unSub();
    };
  }, [currentUser.id]);

  const selectHandle = async (chat) => {
    const userChats = chats.map((item) => {
      const { user, ...rest } = item;
      return rest;
    });

    const chatIndex = userChats.findIndex(
      (item) => item.chatId === chat.chatId
    );
    userChats[chatIndex].isSeen = true;
    const userChatsRef = doc(db, "userchats", currentUser.id);
    try {
      await updateDoc(userChatsRef, {
        chats: userChats,
      });
      changeChat(chat.chatId, chat.user);
    } catch (err) {
      console.log(err);
    }
    
  };



  
  return (
    <div className={styled.chatListContainer}>
      <div className={styled.search}>
        <div className={styled.searchBar}>
          <img src="public/search.png" />
          <input type="text" placeholder="Search" onChange={(e)=>setInput(e.target.value)}/>
        </div>
        <img
          src={addMode ? "public/minus.png" : "public/plus.png"}
          className={styled.add}
          onClick={() => setAddMode((prev) => !prev)}
        />
      </div>
      {chats.map((chat) => (
        <div
          className={styled.item}
          key={chat.chatId}
          onClick={() => selectHandle(chat)}
          style={{
            backgroundColor: chat?.isSeen ? "transparent" : "#373881c9",
          }}
        >
          <img src={
            chat.user.blocked.includes(currentUser.id)
            ? "public/avatar.png"
            :chat.user.avatar || "public/avatar.png"} alt="" />
          <div className={styled.text}>
            <span>{chat.user.blocked.includes(currentUser.id)
              ? "User"
              : chat.user.username
              }</span>
            <p>{chat.lastMessage}</p>
          </div>
        </div>
      ))}
      {addMode && <AddUser />}
    </div>
  );
}

export default ChatList;
