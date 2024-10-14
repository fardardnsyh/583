import Footer from "@/components/footer"
import MessageCarousel from "@/components/message-carousel"


const Home = () => {
  return (
    <>
      <div className='flex flex-grow flex-col items-center sm:justify-center px-4 md:px-12 py-20 sm:py-12'>
        <section className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-center">
            Experience the freedom of anonymous messaging and say what&apos;s on your mind
          </h1>
          <p className="mt-4 text-sm sm:text-base md:text-lg">
            Where your identity remains secret... 😜
          </p>
        </section>
        <MessageCarousel />
      </div >
      <Footer />
    </>
  )
}

export default Home