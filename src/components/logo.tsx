import Image from "next/image"
import logo from "@/assets/ghostmessage.png"
import Link from "next/link"

type LogoProps = {
    className?: string
}

const Logo = ({ className = "w-52" }: LogoProps) => {
    return (
        <Link href={"/"}>
            <Image
                src={logo}
                alt="GhostMessage Logo"
                width={500} 
                height={500} 
                className={`${className}`}
                priority={true} // Load eagerly for important images
                sizes="(max-width: 640px) 200px, 220px" // Adjust based on screen width
            />
        </Link>
    )
}

export default Logo