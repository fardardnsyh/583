import { auth } from '@/auth'
import React from 'react'
import Logo from './logo';
import MenuBtn from './menu-btn';

const Navbar = async () => {
    const session = await auth();
    return (
        <nav className=' h-20 shadow-md'>
            <div className='max-w-screen-xl mx-auto h-full flex  justify-between items-center px-4'>
                <Logo />
                <MenuBtn session={session} />
            </div>
        </nav>
    )
}

export default Navbar