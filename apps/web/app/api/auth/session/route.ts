import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { sessionCookieName } from "@/lib/auth";
import { sessionSchema } from "@/lib/schemas";
export async function POST(request:Request){const result=sessionSchema.safeParse(await request.json().catch(()=>null));if(!result.success)return NextResponse.json({error:"Invalid credentials."},{status:400});try{const decoded=await adminAuth.verifyIdToken(result.data.idToken);if(decoded.admin!==true)return NextResponse.json({error:"This account is not authorized."},{status:403});const expiresIn=5*24*60*60*1000;const cookie=await adminAuth.createSessionCookie(result.data.idToken,{expiresIn});const response=NextResponse.json({ok:true});response.cookies.set(sessionCookieName,cookie,{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/",maxAge:expiresIn/1000});return response}catch{return NextResponse.json({error:"Sign-in failed."},{status:401})}}
