import { NextFetchEvent, NextRequest } from "next/server";

export async function middleware(req: NextRequest, ev: NextFetchEvent) {

    const token = req.cookies.get('token')?.value;

    console.log(token);
    



}