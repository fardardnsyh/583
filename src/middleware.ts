import { NextRequest, NextResponse } from 'next/server';
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { authRoutes, privateRoutes, publicRoutes } from "./_router";

const { auth } = NextAuth(authConfig);

export async function middleware(request: NextRequest) {
    const session = await auth(); //get session from next-auth
    const { nextUrl } = request;
    const isAuthenticated = !!session?.user; // Check if user is authenticated

    const isAuthRoute = authRoutes.includes(nextUrl.pathname);
    const isPrivateRoute = privateRoutes.includes(nextUrl.pathname);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);

    //user is not authenticated and try to access private route then redired to login
    if(isPrivateRoute && !isAuthenticated) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    //user is authenticated and try to access auth route then redired to dashboard
    if(isAuthRoute && isAuthenticated) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    //user can access pulic routes with or without authentication
    if (isPublicRoute) {
        return NextResponse.next();
    }

    //default behavior for all other routes
    return NextResponse.next();
}