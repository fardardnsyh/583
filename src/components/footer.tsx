import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <footer className='text-center text-primary py-4 text-sm font-medium space-y-2'>
      <p>©{new Date().getFullYear()} GhostMessage. All rights reserved</p>
      <p className='underline'>
        <Link href="https://github.com/Suresh1061" target="_blank">
          Designed and developed by @Suresh61
        </Link>
      </p>
    </footer>
  )
}

export default Footer