import React from 'react'
import styled from './userInfo.module.css'
import { useUserStore } from '../../../lib/userStore'

function UserInfo() {
  const { currentUser} = useUserStore()
  return (
    <div className={styled.UinfoContainer}>
      <div className={styled.user}>
        <img src={currentUser.avatar || "public/avatar.png"}/>
        <h3>{currentUser.username}</h3>
      </div>
      <div className={styled.icons}>
        <img src="public/more.png"/>
        <img src="public/video.png"/>
        <img src="public/edit.png"/>
      </div>
    </div>
  )
}

export default UserInfo