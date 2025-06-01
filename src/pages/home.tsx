import * as React from "react";
import { cn } from "@udecode/cn";
import { ArrowDown, ExternalLink, MouseIcon } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem } from "../components/carousel";
import { useRenderInterval } from "../hooks/use-render-interval";
import { CarouselWorld, CarouselWorlds } from "../constants";
import { useCanAutoplay } from "../hooks/use-can-autoplay";
import { useBreakpoint } from "../hooks/use-breakpoint";
import { useDoOnce } from "../hooks/use-do-once";
import { useDoAt } from "../hooks/use-do-at";
import SloppyContainer from "../components/sloppy-container";
import Autoplay from "embla-carousel-autoplay";

import HeaderVideo from "../assets/banner_vid.mp4";
import HeaderVideoShort from "../assets/banner_short.mp4";
import HeaderThumb from "../assets/header_thumb.webp";
import VRCatStare from "../assets/vrcat-stare.webp";
import VRCatHappy from "../assets/vrcat-happy.webp";

function HeaderVideoSection() {
  const canAutoplay = useCanAutoplay();
  const [playing, setPlaying] = React.useState(false);
  const [playNextAt, setPlayNextAt] = React.useState<number | null>(null);

  const refLong = React.useRef<HTMLVideoElement>(null);
  const refShort = React.useRef<HTMLVideoElement>(null);

  useDoOnce(canAutoplay, () => {
    if (!refLong.current) return;
    refLong.current.muted = false;
    refLong.current.volume = 0.15;
    refLong.current.play();
  });

  useDoAt(playNextAt, () => {
    if (refLong.current) {
      refLong.current.muted = true;
      refLong.current.play();
    }
    setPlayNextAt(null);
  });

  // h-[75vh] aspect-[2.5/1]
  return (
    <header className="relative select-none flex w-full flex-col min-h-[24rem] sm:min-h-[32rem] aspect-[2.5/1] sm:h-[78vh]">
      <div className="sm:header-video-mask header-video-mask-mobile absolute size-full">
        <video
          ref={refShort}
          disablePictureInPicture
          disableRemotePlayback
          autoPlay
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
            "absolute size-full object-cover !transition-none opacity-0",
            playing && "opacity-100 animate-in fade-in-0 duration-1000"
          )}
          controls={false}
          poster={HeaderThumb}
          src={HeaderVideo}
          onPlay={() => {
            if (playing) return;
            setPlaying(true);
          }}
          onEnded={() => {
            if (refShort.current) {
              refShort.current.currentTime = 0;
              if (refShort.current.paused) {
                refShort.current.play();
              }
            }
            setPlaying(false);

            // Set a random playback between 1 and 5 minutes (60 to 300 seconds)
            const randomPlayback = Math.floor(Math.random() * (300 - 60 + 1)) + 60;
            setPlayNextAt(randomPlayback);
          }}
        />
        <div className="sm:header-video-gradient header-video-gradient-mobile absolute size-full" />
      </div>
      <div className="relative flex size-full max-w-7xl flex-1 flex-col lg:px-16 px-4 justify-center gap-10">
        <div className="transition, duration-500 brightness-200 mix-blend-hard-light">
          <h1 className="font-semibold leading-tight text-4xl sm:text-7xl">
            Angelo
          </h1>
          <h1 className="font-semibold -mt-2 leading-tight text-4xl sm:text-7xl">
            Lanticse-Peralta
          </h1>
          <p className="text-[#968161] ml-0 sm:ml-1 mt-2 sm:mt-4 opacity-75 mb-8 sm:-mb-8 font-fun font-bold tracking-wide sm:text-xl text-sm">3D Artist // Level Designer // Environmental Artist</p>
        </div>
      </div>
    </header>
  );
}

function ScrollToViewMore() {
  return (
    <div className="w-full hidden flex-col items-center sm:flex h-16 gap-2 animate-bounce opacity-50 duration-2000 justify-center">
      <MouseIcon className="sm:size-10 size-6 text-[#fde1af]" />
      <ArrowDown strokeWidth={2.5} className="sm:size-6 size-4 text-[#968161]" />
    </div>
  );
}

function WorldDisplay({ world }: { world: CarouselWorld }) {
  const small = useBreakpoint("sm");
  useRenderInterval(1000);

  return (
    <SloppyContainer
      containerClassName="group fill-transparent stroke-[#c0a87e] sm:stroke-[#968161] sm:hover:stroke-[#e6cb9e] p-2 transition cursor-pointer"
      sizeMode="parent"
      sloppiness={small ? 3.5 : 5}
      waviness={small ? 1.45 : 2}
      strokeWidth={small ? 3 : 6}
      borderRadius={25}
      asChild
    >
      <a href={world.url} target="_blank" aria-label={`More about ${world.name}`} >
        <img 
          className="transition absolute top-0 left-0 size-full rounded-[24px] scale-[104%] sm:scale-[101%] brightness-90 group-hover:brightness-[20%] object-cover object-center"
          src={world.thumbnail + "?height=1024"}
          alt={world.name}
        />
        <div className="absolute top-2 left-2 flex flex-col w-[calc(100%-1rem)] h-[calc(100%-1rem)] overflow-hidden">
          <div className="size-full relative flex-1 flex flex-col items-start sm:p-4 p-2 justify-end transition opacity-0 scale-105 group-hover:opacity-100 group-hover:scale-100">
            <h2 className="sm:text-2xl font-bold font-fun">{world.name}</h2>
            <p className="text-[#cbb696] sm:text-sm text-xs line-clamp-1">{world.description}</p>
            <ExternalLink className="absolute sm:top-4 sm:right-4 top-2 right-2 sm:size-6 size-5 opacity-100 text-[#fde1af]" />
          </div>
        </div>
      </a>
    </SloppyContainer>
  );
}

function WorldsCarousel() {
  return (
    <Carousel 
      data-hash="vrchat-worlds"
      data-scroll-origin="center"
      data-scroll-position="1/2"
      className="w-full select-none sm:mb-0 sm:mt-0 -my-4 -mt-16" 
      opts={{ loop: true, dragFree: true }} 
      plugins={[
        Autoplay({
          delay: 4000,
          stopOnInteraction: true
        })
      ]}>
      <CarouselContent className="sm:-ml-6 -ml-2">
        {CarouselWorlds.map((world, index) => (
          <CarouselItem key={index} className="aspect-video size-full sm:pl-6 pl-2 max-w-[36rem] min-w-[18rem] basis-[60%]">
            <WorldDisplay world={world} />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}

function AboutMe() {
  const [grabbing, setGrabbing] = React.useState(false);

  return (
    <section data-hash="about-me" className="flex flex-col lg:p-16 p-4 items-center overflow-hidden">
      <div className="w-full grid lg:grid-cols-2 lg:gap-0 max-[440px]:gap-4 gap-24 grid-cols-1 items-center max-w-[84rem]">
        <div className="flex flex-col sm:gap-4 gap-2 text-[#a5967e] *:max-w-xl sm:text-lg h-fit">
          <h2 className="sm:text-4xl text-2xl font-bold mb-2 font-fun text-[#e6d0af]">About Me</h2>
          <p>With 2+ years of experience in immersive 3D world design, I specialize in crafting standout environments for VR—especially VRChat. My work blends technical precision with creative flair, and has been recognized across the VRChat community and beyond.</p>
          <p>I’ve built 25+ worlds—five officially VRChat-approved—including hits like <i>Crypt Babylonica</i> and <i>Aeterna Visio Nocturne</i>. Several reached #1 on the Popular tab, with three surpassing 100k visits and 10k favorites. Collectively, my projects have drawn over 1 million visits and have been featured in VRChat promo materials, developer updates, and the Pico 4 launch.</p>
          <p>My collaborations span HashStudios LLC, Dubby.gg, VR events like VKET Winter 2024, and galleries in Tokyo and London. I’ve also led a VRChat community of 3,000+, run a Creator Economy Store, and been honored with awards including Spookality (twice) and VRCA 2024 nominations.</p>
        </div>
        <div 
          className={cn("group relative right-[5%] lg:-right-[15%] xl:right-0 cursor-grab h-64 min-[450px]:h-48 lg:h-full", grabbing && "cursor-grabbing")}
          onMouseDown={(event) => {
            event.preventDefault();
            setGrabbing(true);
          }} 
          onMouseUp={(event) => {
            event.preventDefault();
            setGrabbing(false);
          }}
        >
          <img className="max-w-xl w-full ml-auto group-hover:opacity-0 absolute right-0 top-1/2 -translate-y-1/2" src={VRCatStare} alt="VRCatStare" />
          <img className="max-w-xl w-full ml-auto opacity-0 group-hover:opacity-100 absolute right-0 top-1/2 -translate-y-1/2" src={VRCatHappy} alt="VRCatHappy" />
        </div>
      </div>
    </section>
  );
}

// function FeaturedWorks() {
//   return (
//     <div className="flex flex-col p-16 items-center bg-gradient-to-b from-[#000d04] via-[#001204] to-[#000d04]">
//       <div className="flex flex-col gap-8 w-full max-w-[84rem]">
//         <h2 className="font-fun text-4xl mb-2 text-right font-bold text-[#e6d0af]">Featured Works</h2>
//         <div></div>
//         <div></div>
//         <div></div>
//         <div></div>
//         <div></div>
//         <div></div>
//         <div></div>
//         <div></div>
//         <div></div>
//         <div></div>
//         <div></div>
//         <div></div>
//         <div></div>
//         <div></div>
//       </div>
//     </div>
//   )
// }

// function ContactMe() {
//   return (
//     <div className="flex flex-col p-16 items-center">
//       <div className="flex flex-col gap-8 w-full max-w-[84rem]">
//         <h2 className="font-fun text-4xl mb-2 text-center font-bold text-[#e6d0af]">Get In Touch</h2>
//         <div></div>
//         <div></div>
//         <div></div>
//         <div></div>
//         <div></div>
//         <div></div>
//         <div></div>
//         <div></div>
//         <div></div>
//         <div></div>
//       </div>
//     </div>
//   )
// }

function Footer() {
  return (
    <footer className="mt-auto select-none w-full lg:p-16 p-4 lg:pb-8 bg-gradient-to-b gap-1 from-transparent to-black flex lg:flex-row flex-col items-center">
      <p className="text-xs text-[#a08e6f] font-fun">© Shopow 2025 - All Rights Reserved</p>
      <a href="https://github.com/nobu-sh/shopow" target="_blank" className="flex transition text-[#8f516c] hover:text-[#e594b7] flex-row gap-2 lg:ml-auto" aria-label="View source code on GitHub">
        <p className="text-xs font-fun">made with {"<3"} by nobu-sh</p>
        <ExternalLink className="size-3" />
      </a>
    </footer>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col size-full flex-1 lg:gap-32 gap-16 *:shrink-0">
      <div className="flex flex-col size-full flex-1 gap-0 sm:gap-16 *:shrink-0">
        <div className="flex flex-col w-full">
          <HeaderVideoSection />
          <ScrollToViewMore />
        </div>
        <WorldsCarousel />
      </div>
      <AboutMe />
      {/* <FeaturedWorks /> */}
      {/* <ContactMe /> */}
      <Footer />
    </div>
  );
}