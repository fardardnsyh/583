'use client'

import { useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { messageSchema } from '@/schemas'
import { Separator } from "@/components/ui/separator"
import SuggestMessageBtn from "@/components/user/suggest-message-btn"
import dynamic from 'next/dynamic'
const LoadSuggestMessages = dynamic(() => import('@/components/user/load-suggest-messages'), { ssr: true })
import SendMessage from "@/components/user/send-message"
import { Button } from "@/components/ui/button"
import { useMemo, useState } from "react"
import Link from "next/link"
import * as z from 'zod'

const Page = () => {
  const { username } = useParams<{ username: string }>()
  const [text, setText] = useState<string>("")

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: ''
    }
  })

  const watchMessageContent = form.watch('content')
  const initialSuggestMessages = "Hi bro, whats up || You are a good person || What's your favorite movie?";
  const seperator = "||"

  // method for splitting message based on seperator
  const splitMessages = (message: string) => {
    return message.split(seperator).map(message => message.trim())
  }

  // Memoized messages to improve performance
  const messagesToDisplay = useMemo(() => {
    return text ? splitMessages(text) : splitMessages(initialSuggestMessages);
  }, [text]);

  return (
    <section className="max-w-3xl mx-auto px-4 md:px-6 py-10">
      <SendMessage
        username={username}
        watchMessageContent={watchMessageContent}
        form={form}
      />
      <div className="w-full space-y-4 mt-12">
        <LoadSuggestMessages setText={setText} />
        <div className="rounded-lg  bg-card text-card-foreground sm:border sm:shadow-sm px-2 sm:px-6 pt-6">
          <div className="flex flex-col space-y-1.5">
            <h3 className="text-2xl font-semibold leading-none tracking-tight">Messages</h3>
            <p className="text-sm  text-primary">Click on any message below to select it.</p>
          </div>
          <div className="space-y-2 py-6">
            {messagesToDisplay.map((message, index) => (
              <SuggestMessageBtn
                key={index}
                message={message}
                setValue={() => form.setValue('content', message)}
              />
            ))}
          </div>
        </div>
      </div>
      <Separator className="my-6" />
      <div className="text-center">
        <div className="mb-4">Get Your Message Board</div>
        <Link href={'/register'}>
          <Button>Create Your Account</Button>
        </Link>
      </div>
    </section>
  )
}

export default Page