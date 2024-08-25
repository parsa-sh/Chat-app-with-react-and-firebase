import React from "react";
import styled from "./detail.module.css";
import { auth, db } from "../../lib/firebase";
import { useChatStore  } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";

function Detail() {
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked ,changeBlock } = useChatStore();
    
  const { currentUser } = useUserStore();
  const blockHandler = async () => {
    if (!user) return;

    const userDocRef = doc(db , "users" ,currentUser.id)

    try{
      await updateDoc(userDocRef,{
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id)
      })
      changeBlock()
    }
    catch (err){
      console.log(err)
    }
  };

  return (
    <div className={styled.detailContainer}>
      <div className={styled.user}>
        <img src={user?.avatar || "public/avatar.png"} />
        <h2>{user?.username}</h2>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt,
          aspernatur.
        </p>
      </div>
      <div className={styled.info}>
        <div className={styled.option}>
          <div className={styled.title}>
            <span>Chat Setting</span>
            <img src="public/arrowUp.png" />
          </div>
        </div>
        <div className={styled.option}>
          <div className={styled.title}>
            <span>Chat Setting</span>
            <img src="public/arrowUp.png" />
          </div>
        </div>
        <div className={styled.option}>
          <div className={styled.title}>
            <span>Privacy & Help</span>
            <img src="public/arrowUp.png" />
          </div>
        </div>
        <div className={styled.option}>
          <div className={styled.title}>
            <span>Shared Photos</span>
            <img src="public/arrowDown.png" />
          </div>
        </div>
        <div className={styled.photos}>
          <div className={styled.photoItem}>
            <div className={styled.photoDetail}>
              <img src="public/favicon.png" />
              <span>photo_20.png</span>
            </div>
            <img className={styled.downloadImg} src="public/download.png" />
          </div>
          <div className={styled.photoItem}>
            <div className={styled.photoDetail}>
              <img src="public/favicon.png" />
              <span>photo_20.png</span>
            </div>
            <img className={styled.downloadImg} src="public/download.png" />
          </div>
          <div className={styled.photoItem}>
            <div className={styled.photoDetail}>
              <img src="public/favicon.png" />
              <span>photo_20.png</span>
            </div>
            <img className={styled.downloadImg} src="public/download.png" />
          </div>
        </div>
        <div className={styled.option}>
          <div className={styled.title}>
            <span>Shared Files</span>
            <img src="public/arrowUp.png" />
          </div>
        </div>
        <button onClick={blockHandler}>{
          isCurrentUserBlocked
          ? "You are blocked !"
          : isReceiverBlocked
          ? "User blocked"
          : "Block user"
          }</button>
        <button className={styled.logOut} onClick={() => auth.signOut()}>
          Log Out
        </button>
      </div>
    </div>
  );
}

export default Detail;
