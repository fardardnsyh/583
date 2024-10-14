"use client";

import { useState, useEffect } from 'react';
import { Button } from '../ui/button';

type ProfileLinkProps = {
    username: string;  
};

const ProfileLink = ({ username }: ProfileLinkProps) => {
    const [profileUrl, setProfileUrl] = useState('');
    const [isCopy, setIsCopy] = useState(false);

    // Generate profile link on client-side after session is loaded
    useEffect(() => {
        if (username) {
            const baseUrl = `${window.location.protocol}//${window.location.host}`;
            setProfileUrl(`${baseUrl}/user/${username}`);
        }
    }, [username]);

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(profileUrl);
        setIsCopy(true);
    };

    return (
        <div className='mb-4'>
            <h2 className='text-lg font-semibold mb-2'>Copy Your Unique Link</h2>
            <div className='flex text-center'>
                <input
                    type='text'
                    value={profileUrl}
                    disabled
                    className='input input-bordered w-full p-2 mr-2'
                    aria-label='profile link'
                />
                <Button onClick={copyToClipboard} aria-label='copy profile link'>
                    {isCopy ? 'Copied!' : 'Copy'}
                </Button>
            </div>
        </div>
    );
};

export default ProfileLink;
