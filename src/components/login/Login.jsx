import React, { useState } from "react";
import styled from "./login.module.css";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword , signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import upload from "../../lib/upload";

function Login() {
  const [avatar, setAvatar] = useState({
    file: null,
    url: "",
  });

  const [loading , setLoading] = useState(false)

  const avatarHandler = (e) => {
    if (e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    setLoading(true)
    const formData = new FormData(e.target);
    const {email, password } = Object.fromEntries(formData);
    try{
      await signInWithEmailAndPassword(auth,email,password)
      toast.success("Login Successfull")
    }
    catch(err){
      console.log(err)
      toast.error(err.message)
    }
    finally{
      setLoading(false)
    }
  };
  const registerHandler = async (e) => {
    e.preventDefault();
    setLoading(true)
    const formData = new FormData(e.target);
    const { username, email, password } = Object.fromEntries(formData);
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const imgUrl = await upload(avatar.file)

      await setDoc(doc(db, "users", response.user.uid), {
        username,
        email,
        avatar : imgUrl,
        id: response.user.uid,
        blocked: [],
      });
      await setDoc(doc(db, "userchats", response.user.uid), {
        chats: [],
      });

      toast.success("Register Successfully . You can log in now");
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
    finally{
      setLoading(false)
    }
  };

  return (
    <div className={styled.login}>
      <div className={styled.item}>
        <h1>Login</h1>
        <form onSubmit={loginHandler}>
          <input type="text" placeholder="Email..." name="email" />
          <input type="password" placeholder="Password..." name="password" />
          <button disabled={setLoading}>{loading?"Loading....":"Sign In"}</button>
        </form>
      </div>
      <div className={styled.seperator}></div>
      <div className={styled.item}>
        <h1>Create Account</h1>
        <form onSubmit={registerHandler}>
          <label htmlFor="file">
            <img src={avatar.url || "public/avatar.png"} />
            Upload Avatar
          </label>
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={avatarHandler}
          />
          <input type="text" placeholder="Username..." name="username" />
          <input type="text" placeholder="Email..." name="email" />
          <input type="password" placeholder="Password..." name="password" />
          <button disabled={setLoading}>{loading?"Loading....":"Sign Up"}</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
