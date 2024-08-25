import React from 'react'
import styled from './list.module.css'
import UserInfo from './userInfo/UserInfo'
import ChatList from './chatList/ChatList'

function list() {
  return (
    <div className={styled.listContainer}>
      <UserInfo />
      <ChatList />
    </div>
  )
}

export default list