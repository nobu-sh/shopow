import * as React from "react";
import { cn } from "@udecode/cn";
import { ArrowDown, ExternalLink, MouseIcon } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem } from "../components/carousel";
import { useInterval, useRenderInterval } from "../hooks/use-render-interval";
import { CarouselWorld, CarouselWorlds } from "../constants";
import { useCanAutoplay } from "../hooks/use-can-autoplay";
import { useBreakpoint } from "../hooks/use-breakpoint";
import { useDoOnce } from "../hooks/use-do-once";
import { useDoAt } from "../hooks/use-do-at";
import SloppyContainer, { randomSeed } from "../components/sloppy-container";
import Autoplay from "embla-carousel-autoplay";

import { SocialIcon } from "react-social-icons/component";
import "react-social-icons/x";
import "react-social-icons/discord";
import "react-social-icons/tiktok";
import "react-social-icons/youtube";
import "react-social-icons/instagram";
import "react-social-icons/linkedin";
import "react-social-icons/linktree";

import HeaderVideo from "../assets/banner_vid.mp4";
import HeaderVideoShort from "../assets/banner_short.mp4";
import HeaderThumb from "../assets/header_thumb.webp";
import VRCatStare from "../assets/vrcat-stare.webp";
import VRCatHappy from "../assets/vrcat-happy.webp";
import { isValidEmail } from "../utils/email";
import { sendInquiry } from "../utils/webhook";

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
          <CarouselItem key={index} className="aspect-video size-full sm:pl-6 pl-2 max-w-[36rem] min-w-[16rem] basis-[60%]">
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
          <h2 className="sm:text-4xl text-2xl font-bold mb-2 font-fun text-[#e6d0af] select-none">About Me</h2>
          <p>With 2+ years of experience in immersive 3D world design, I specialize in crafting standout environments for VR—especially VRChat. My work blends technical precision with creative flair, and has been recognized across the VRChat community and beyond.</p>
          <p>I’ve built 25+ worlds—five officially VRChat-approved—including hits like <i>Crypt Babylonica</i> and <i>Aeterna Visio Nocturne</i>. Several reached #1 on the Popular tab, with three surpassing 100k visits and 10k favorites. Collectively, my projects have drawn over 1 million visits and have been featured in VRChat promo materials, developer updates, and the Pico 4 launch.</p>
          <p>My collaborations span HashStudios LLC, Dubby.gg, VR events like VKET Winter 2024, and galleries in Tokyo and London. I’ve also led a VRChat community of 3,000+, run a Creator Economy Store, and been honored with awards including Spookality (twice) and VRCA 2024 nominations.</p>
        </div>
        <div 
          className={cn("group relative select-none right-[5%] lg:-right-[15%] xl:right-0 cursor-grab h-64 min-[450px]:h-48 lg:h-full", grabbing && "cursor-grabbing")}
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

// Use seeded generation for these so when the user types it doesn't change every time.
function InputContainer({ children }: React.PropsWithChildren) {
  const seed = useInterval(1000, () => randomSeed());

  return (
    <SloppyContainer
      containerClassName="relative fill-[#96816120] transition duration-300 stroke-[#fde1af99] focus-within:stroke-[#fde1af] focus-within:fill-[#96816125]"
      sizeMode="widthParentHeightChildren"
      sloppiness={3}
      waviness={1.5}
      strokeWidth={2}
      borderRadius={15}
      seed={seed}
    >
      {children}
    </SloppyContainer>
  )
}

function ButtonContainer({ children, disabled = false }: React.PropsWithChildren<{ disabled?: boolean }>) {
  const seed = useInterval(1000, () => randomSeed());

  return (
    <SloppyContainer
      containerClassName={cn(
        "ml-auto fill-transparent transition duration-300 stroke-[#fde1af99] hover:stroke-[#fde1af] hover:fill-[#96816125]",
        disabled && "pointer-events-none !opacity-50"
      )}
      sizeMode="children"
      sloppiness={3}
      waviness={1.5}
      strokeWidth={2}
      borderRadius={15}
      seed={seed}
      asChild
    >
      {children}
    </SloppyContainer>
  )
}

function ContactMe() {
  const [sending, setSending] = React.useState(false);
  const [sent, setSent] = React.useState(false);
  const [failed, setFailed] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");

  return (
    <section data-hash="contact" className="flex flex-col lg:p-16 p-4 items-center bg-gradient-to-b from-[#000d04] via-[#001204] to-[#000d04]">
      <div className="flex flex-col sm:gap-16 gap-12 max-w-[84rem] w-full">
        <h2 className="sm:text-4xl text-2xl font-bold mb-2 font-fun text-[#e6d0af] select-none">Interested in Me?</h2>
        <div className="w-full grid lg:grid-cols-[1fr_0.75fr] grid-cols-1 sm:gap-32 gap-16">
          <div className="flex flex-col gap-16 text-[#a5967e] *:max-w-xl sm:text-lg h-fit">
            <div className="flex flex-col gap-4">
              <h2 className="sm:text-2xl text-xl font-bold font-fun text-left text-[#e6d0af] select-none">What I Can Do For You</h2>
              <p>I create visually striking and technically sound 3D environments for games, virtual experiences, and interactive media. I build worlds that tell stories—whether in Unity, Unreal, or Blender. Need optimized assets, immersive level design, or a complete virtual space? I deliver end-to-end solutions tailored to your vision.</p>
            </div>
            <div className="flex flex-col gap-6">
              <h2 className="sm:text-2xl text-xl font-bold font-fun text-left text-[#e6d0af] select-none">Keep Up With My Socials</h2>
              <div className="sm:flex sm:flex-row sm:items-center sm:gap-8 grid grid-cols-6">
                <SocialIcon 
                  url="https://x.com/ShopowVR"
                  borderRadius="25%"
                  className="hover:scale-110 transition-all"
                  style={{ width: "2.5rem", height: "2.5rem" }}
                />
                <SocialIcon
                  url="https://www.tiktok.com/@shopow"
                  borderRadius="25%"
                  className="hover:scale-110 transition-all"
                  style={{ width: "2.5rem", height: "2.5rem" }}
                />
                <SocialIcon
                  url="https://www.youtube.com/@shopowvr"
                  borderRadius="25%"
                  className="hover:scale-110 transition-all"
                  style={{ width: "2.5rem", height: "2.5rem" }}
                />
                <SocialIcon
                  url="https://www.instagram.com/sho.pow"
                  borderRadius="25%"
                  className="hover:scale-110 transition-all"
                  style={{ width: "2.5rem", height: "2.5rem" }}
                />
                <SocialIcon
                  url="https://www.linkedin.com/in/angelo-lanticse-peralta-ab1580265"
                  className="hover:scale-110 transition-all"
                  borderRadius="25%"
                  style={{ width: "2.5rem", height: "2.5rem" }}
                />
                <SocialIcon
                  url="https://linktr.ee/Shopow"
                  network="linktree"
                  borderRadius="25%"
                  className="hover:scale-110 transition-all"
                  style={{ width: "2.5rem", height: "2.5rem" }}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="sm:text-2xl text-xl font-bold font-fun text-left text-[#e6d0af] select-none">Get in Touch</h2>
            <form className="flex flex-col gap-4" onSubmit={async (event) => {
              event.preventDefault();
              setSending(true);
              
              try {
                await sendInquiry(email, message);
                setSent(true);
              } catch {
                setFailed(true);
              }

              setSending(false);
            }}>
              <InputContainer>
                <input 
                  className="!bg-transparent !border-none !outline-none text-[#e6d0af] placeholder:text-[#e6d0af75] px-4 py-4"
                  type="email"
                  placeholder="email"
                  readOnly={sending || sent || failed}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </InputContainer>
              <InputContainer>
                <textarea
                  className="min-h-52 w-full !bg-transparent !border-none !outline-none text-[#e6d0af] placeholder:text-[#e6d0af75] px-4 py-4"
                  placeholder="Reason of contact..."
                  readOnly={sending || sent || failed}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  autoComplete="off"
                  maxLength={2048}
                />
                <p className="absolute bottom-4 right-4 font-fun text-xs pointer-events-none text-[#e6d0afbb]">{2048 - message.length}</p>
              </InputContainer>
              <div className="flex flex-row gap-4 items-center">
                {failed && <p className="text-red-500/75">You cannot send at this time!</p>}
                <ButtonContainer disabled={!isValidEmail(email) || sending || sent || failed}>
                  <button type="submit" className="font-fun px-6 py-4 text-lg text-[#fde1af] !w-44">{sent ? "Sent!" : "Send Inquiry"}</button>
                </ButtonContainer>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

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
      <ContactMe />
      <Footer />
    </div>
  );
}