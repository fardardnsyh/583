'use client'

import { logOut } from '@/lib/signInAction'
import { Gauge, Menu, Power } from 'lucide-react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from 'next/navigation'
import { Session } from 'next-auth'

type MenuBtnProps = {
    session: Session | null
}

const MenuBtn = ({ session }: MenuBtnProps) => {
    const router = useRouter()
    return (
        <>
            {/* For large devices */}
            <div className='sm:flex hidden'>
                {session?.user ? (
                    <div className="flex gap-x-5">
                        <Link href={'/dashboard'}>
                            <Button>Dashboard</Button>
                        </Link>
                        <Button className='flex items-center' onClick={() => logOut()}>
                            <Power className="h-4 w-4 mr-2" />
                            Logout
                        </Button>
                    </div>
                )
                    : (
                        <div className="flex gap-x-5">
                            <Link href={'/login'}>
                                <Button>Log in</Button>
                            </Link>
                            <Link href={'/register'}>
                                <Button>Register</Button>
                            </Link>
                        </div>
                    )}
            </div>

            {/* for small devices */}
            <div className='block sm:hidden'>
                <DropdownMenu>
                    <DropdownMenuTrigger className="!ring-0 !border-none !shadow-none !focus:border-none !focus:ring-0 !outline-none" asChild >
                        <Button variant="outline" className='px-3' aria-label='menu button'>
                            <Menu className='h-6 w-6 flex-shrink-0' />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="min-w-[10rem] p-2 text-base" align="end">
                        {session?.user ? (
                            <div className="flex flex-col items-start space-y-1">
                                <DropdownMenuItem onClick={() => router.push(`/dashboard`)}>
                                    <Gauge className="h-4 w-4 mr-2" />
                                    Dashboard
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => logOut()}>
                                    <Power className="h-4 w-4 mr-2" />
                                    Logout
                                </DropdownMenuItem>
                            </div>
                        ) : (
                                <div className="w-full flex flex-col items-start space-y-1">
                                <DropdownMenuItem onClick={() => router.push(`/login`)}>
                                    Log in
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => router.push(`/register`)}>
                                    Register
                                </DropdownMenuItem>
                            </div>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </>
    )
}

export default MenuBtn