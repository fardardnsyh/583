import 'next-auth';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: {
            _id?: string;
            username?: string;
            isVerified?: boolean;
            isAcceptingMessage?: boolean;
        } & DefaultSession['user'];
    }

    interface User {
        _id?: string;
        username?: string;
        isVerified?: boolean;
        isAcceptingMessage?: boolean;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        _id?: string;
        username?: string;
        isVerified?: boolean;
        isAcceptingMessage?: boolean;
    }
}

declare type OAuthProfile = {
    email: string;
    name: string;
    picture?: string;
    avatar_url: string;
    sub?: string; // Unique identifier for the user from the provider
};

