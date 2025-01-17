import HeaderVideo from "../assets/banner_vid.mp4"
import HeaderVideoShort from "../assets/banner_short.mp4"
import HeaderThumb from "../assets/header_thumb.jpg"
import VRCat from "../assets/vrcat.min.webp"
import { useEffect, useRef, useState } from "react";
import { cn } from "@udecode/cn";
import { useRecoilValue } from "recoil";
import { interactedState } from "../states/interacted";
import { ArrowDown, ExternalLink, MouseIcon } from "lucide-react";
import SloppyContainer from "../components/SloppyContainer";
import { Carousel, CarouselContent, CarouselItem } from "../components/carousel";
import Autoplay from "embla-carousel-autoplay"
import { useRenderInterval } from "../hooks/use-render-interval";
import { CarouselWorld, CarouselWorlds } from "../constants";

function HeaderVideoSection() {
  const interacted = useRecoilValue(interactedState)
  const [ended, setEnded] = useState(false)
  const refLong = useRef<HTMLVideoElement>(null)
  const refShort = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (ended) {
      refShort.current?.play()
    }
  }, [ended])

  useEffect(() => {
    if (!interacted || !refLong.current) return;
    refLong.current.volume = 0.15
    refLong.current.play()
  }, [interacted]);

  return (
    <header className="relative select-none flex w-full flex-col aspect-[2.5/1]" id="home">
      <div className="header-video-mask absolute size-full">
        <video
          ref={refShort}
          disablePictureInPicture
          disableRemotePlayback
          muted
          loop
          className="absolute size-full object-cover"
          controls={false}
          src={HeaderVideoShort}
        />
        <video
          ref={refLong}
          disablePictureInPicture
          disableRemotePlayback
          className={cn(
            "absolute size-full object-cover transition-opacity duration-500 opacity-100",
            ended && "opacity-0"
          )}
          controls={false}
          poster={HeaderThumb}
          src={HeaderVideo}
          onEnded={() => {
            setEnded(true)
          }}
        />
        <div className="header-video-gradient absolute size-full" />
      </div>
      <div className="relative flex size-full max-w-7xl flex-1 flex-col px-16 justify-center gap-10">
        <div className={cn("transition, duration-500 mix-blend-exclusion brightness-200", ended && "mix-blend-hard-light")}>
          <h1 className="font-semibold leading-tight text-7xl font-fun">
            Angelo
          </h1>
          <h1 className="font-semibold -mt-4 leading-tight text-7xl font-fun">
            Lanticse-Peralta
          </h1>
          <p className="text-[#968161] ml-1.5 mt-2 opacity-75 -mb-8 font-fun font-bold tracking-wide text-xl">3D Artist // Level Designer // Environmental Artist</p>
        </div>
      </div>
    </header>
  )
}

function ScrollToViewMore() {
  return (
    <div className="w-full flex flex-col items-center gap-2 animate-bounce opacity-50 duration-2000 justify-center">
      <MouseIcon className="size-10 text-[#fde1af]" />
      <ArrowDown strokeWidth={2.5} className="size-6 text-[#968161]" />
    </div>
  )
}

function WorldDisplay({ world }: { world: CarouselWorld }) {
  useRenderInterval(1000)

  return (
    <SloppyContainer
      containerClassName="group stroke-[#fde1af] hover:stroke-[#968161] p-2 transition cursor-pointer"
      sizeMode="parent"
      sloppiness={5}
      waviness={2}
      strokeWidth={6}
      borderRadius={25}
      asChild
    >
      <a href={world.url} target="_blank">
        <img 
          className="transition absolute top-0 left-0 size-full rounded-[24px] scale-[101%] brightness-95 group-hover:sepia group-hover:brightness-[35%] object-cover object-center mix-blend-lighten"
          src={world.src}
        />
        <div className="absolute top-2 left-2 flex flex-col w-[calc(100%-1rem)] h-[calc(100%-1rem)] overflow-hidden">
          <div className="size-full relative flex-1 flex flex-col items-start p-4 justify-end transition opacity-0 scale-105 group-hover:opacity-100 group-hover:scale-100">
            <h2 className="text-2xl font-fun font-bold">{world.title}</h2>
            <p className="text-[#cbb696] font-fun line-clamp-1">{world.description}</p>
            <ExternalLink className="absolute top-4 right-4 size-6 text-[#fde1af]" />
          </div>
        </div>
      </a>
    </SloppyContainer>
  )
}

function WorldsCarousel() {
  return (
    <Carousel 
      className="w-full select-none" 
      opts={{ loop: true, dragFree: true }} 
      plugins={[
        Autoplay({
          delay: 3000,
          stopOnInteraction: true
        })
      ]}>
      <CarouselContent className="-ml-6">
        {CarouselWorlds.map((world, index) => (
          <CarouselItem key={index} className="aspect-video size-full pl-6 basis-[30%]">
            <WorldDisplay world={world} />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}

function AboutMe() {
  return (
    <div className="px-16 w-full grid grid-cols-2 gap-6 items-center">
      <div className="flex flex-col gap-4 font-fun text-[#c8b494] max-w-lg h-fit">
        <h2 className="font-fun text-3xl font-bold text-[#e6d0af]">About Me</h2>
        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. At quaerat nulla itaque, eveniet expedita sequi repudiandae aliquid magni ea impedit iure maxime sint eaque tenetur maiores dolorem ullam natus voluptates.</p>
        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. At quaerat nulla itaque, eveniet expedita sequi repudiandae aliquid magni ea impedit iure maxime sint eaque tenetur maiores dolorem ullam natus voluptates.</p>
        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. At quaerat nulla itaque, eveniet expedita sequi repudiandae aliquid magni ea impedit iure maxime sint eaque tenetur maiores dolorem ullam natus voluptates.</p>
      </div>
      <img className="" src={VRCat} alt="VRCat" />
    </div>
  )
}

function FeaturedWorks() {
  return (
    <div className="flex flex-col gap-8 py-16 px-16 bg-gradient-to-b from-[#000d04] via-[#001204] to-[#000d04]">
      <h2 className="font-fun text-3xl text-right font-bold text-[#e6d0af]">Featured Works</h2>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  )
}

function ContactMe() {
  return (
    <div className="flex flex-col gap-8 px-16">
      <h2 className="font-fun text-3xl text-center font-bold text-[#e6d0af]">Contact Me</h2>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  )
}

function Footer() {
  return (
    <footer className="mt-auto select-none w-full p-16 pb-8 bg-gradient-to-b from-transparent to-black flex flex-row items-center">
      <p className="text-xs text-[#a08e6f] font-fun">© Shopow 2025 - All Rights Reserved</p>
      <a href="https://github.com/nobu-sh/shopow" target="_blank" className="flex transition text-[#8f516c] hover:text-[#e594b7] flex-row gap-2 ml-auto">
        <p className="text-xs font-fun">made with {"<3"} by nobu-sh</p>
        <ExternalLink className="size-3" />
      </a>
    </footer>
  )
}

export default function Home() {
  return (
    <div className="flex flex-col size-full flex-1 gap-16 *:shrink-0">
      <div className="flex flex-col w-full">
        <HeaderVideoSection />
        <ScrollToViewMore />
      </div>
      <WorldsCarousel />
      <AboutMe />
      <FeaturedWorks />
      <ContactMe />
      <Footer />
    </div>
  )
}