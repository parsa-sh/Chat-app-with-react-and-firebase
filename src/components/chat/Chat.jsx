import React, { useEffect, useRef, useState } from "react";
import styled from "./chat.module.css";
import EmojiPicker from "emoji-picker-react";
import { db } from "./../../lib/firebase";
import {
  arrayUnion,
  doc,
  onSnapshot,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { useChatStore } from "./../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import upload from "../../lib/upload";

function chat() {
  const [openPicker, setOpenPicker] = useState(false);
  const [chat, setchat] = useState("");
  const [text, setText] = useState("");
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } =
    useChatStore();
  const { currentUser } = useUserStore();
  const [img, setImg] = useState({
    file: null,
    url: "",
  });
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current.scrollIntoView();
  }, []);

  useEffect(() => {
    const sub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setchat(res.data());
    });
    return () => {
      sub();
    };
  }, [chatId]);

  const addEmoji = (e) => {
    setText((prev) => prev + e.emoji);
  };
  const imageHandler = (e) => {
    if (e.target.files[0]) {
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const sendHandle = async () => {
    if (text === "") return;

    let imgUrl = null;

    try {
      if (img.file) {
        imgUrl = await upload(img.file);
      }

      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text,
          createdAt: new Date(),
          ...(imgUrl && { img: imgUrl }),
        }),
      });

      const userIDs = [currentUser.id, user.id];
      userIDs.forEach(async (id) => {
        const userChatsRef = doc(db, "userchats", id);
        const userChatsSnapshot = await getDoc(userChatsRef);
        if (userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data();
          const chatIndex = userChatsData.chats.findIndex(
            (r) => r.chatId === chatId
          );
          userChatsData.chats[chatIndex].lastMessage = text;
          userChatsData.chats[chatIndex].isSeen =
            id === currentUser.id ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();
          await updateDoc(userChatsRef, {
            chats: userChatsData.chats,
          });
        }
      });
    } catch (err) {
      console.log(err);
    }
    setImg({
      file: null,
      url: "",
    });
    setText("");
  };

  return (
    <div className={styled.chatContainer}>
      <div className={styled.top}>
        <div className={styled.user}>
          <img src={user?.avatar || "public/avatar.png"} />
          <div className={styled.text}>
            <span>{user?.username}</span>
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit.
              Temporibus, dignissimos?
            </p>
          </div>
        </div>
        <div className={styled.icons}>
          <img src="public/phone.png" />
          <img src="public/video.png" />
          <img src="public/info.png" />
        </div>
      </div>
      <div className={styled.center}>
        {chat?.messages?.map((message) => (
          <div
            className={
              message.senderId === currentUser?.id
                ? styled.messageOwner
                : styled.message
            }
            key={message?.createdAt}
          >
            <div className={styled.text}>
              {message.img && <img src={message.img} />}
              <p>{message.text}</p>
              {/* <span className={styled.time}>{message}</span> */}
            </div>
          </div>
        ))}
        {img.url && (
          <div className={styled.messageOwner}>
            <div className={styled.text}>
              <img src={img.url} alt="" />
            </div>
          </div>
        )}
        <div ref={endRef}></div>
      </div>
      <div className={styled.bottom}>
        <div className={styled.icons}>
          <label htmlFor="file">
            <img src="public/img.png" alt="" />
          </label>
          <input
            type="file"
            name="file"
            id="file"
            style={{ display: "none" }}
            onChange={imageHandler}
          />
          <img src="public/camera.png" alt="" />
          <img src="public/mic.png" alt="" />
        </div>
        <input
          className={styled.input}
          type="text"
          placeholder={(isCurrentUserBlocked || isReceiverBlocked) ? "You are Blocked !":"Type a message....."}
          onChange={(e) => setText(e.target.value)}
          value={text}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        />
        <div className={styled.emoji}>
          <img
            src="public/emoji.png"
            onClick={() => setOpenPicker((prev) => !prev)}
          />
          <div className={styled.emojiPicker}>
            <EmojiPicker open={openPicker} onEmojiClick={addEmoji} />
          </div>
        </div>
        <button
          className={styled.sendBtn}
          onClick={sendHandle}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default chat;
