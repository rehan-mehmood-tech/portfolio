"use client";
import { FormEvent, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getClientAuth } from "@/lib/firebase-client";
export function LoginForm(){const [error,setError]=useState("");const [busy,setBusy]=useState(false);async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();setBusy(true);setError("");const data=new FormData(e.currentTarget);try{const credential=await signInWithEmailAndPassword(getClientAuth(),String(data.get("email")),String(data.get("password")));const res=await fetch("/api/auth/session",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({idToken:await credential.user.getIdToken()})});const json=await res.json();if(!res.ok)throw new Error(json.error);location.assign("/admin")}catch(e){setError(e instanceof Error?e.message:"Sign-in failed.");setBusy(false)}}return <form onSubmit={submit}><label><span>Email</span><input name="email" type="email" autoComplete="username" required/></label><label><span>Password</span><input name="password" type="password" autoComplete="current-password" required/></label>{error&&<p className="form-error" role="alert">{error}</p>}<button className="button primary full" disabled={busy}>{busy?"Signing in…":"Sign in"}</button></form>}


