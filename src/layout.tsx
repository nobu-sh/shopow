import { PropsWithChildren, useEffect, useRef, useState } from "react";
import Logo from "./assets/logo.min.webp"
import { Link } from "react-router-dom";
import { useRecoilState } from "recoil";
import { readyState } from "./states/ready";
import { cn, withRef } from "@udecode/cn";
import { MouseIcon } from "lucide-react";
import SloppyContainer from "./components/container";
import { useRenderInterval } from "./hooks/use-render-interval";

import TinyTestVideo from "./assets/tiny.mp4?inline"

function Interactive() {
  const [ready, setReady] = useRecoilState(readyState)
  const [interacted, setInteracted] = useState(true)
  const [grabbing, setGrabbing] = useState(false)
  const testRef = useRef<HTMLVideoElement>(null);
  

  useEffect(() => {
    if (!document.body.parentElement) return;
    document.body.parentElement.style.overflow = interacted ? "auto" : "hidden"
  }, [interacted])

  // useEffect(() => {
  //   // Check if the URL has a hash
  //   const hasHash = location.hash.length > 0;
  //   setHashInUrl(hasHash);

  //   // If there is a hash in the URL, set interacted to true
  //   if (hasHash) {
  //     setInteracted(true);
  //     setReady(true);

  //     // If there is a hash then we dont show the interactive screen but we need to still listen for an interaction so we can autoplay.

  //   }
  // }, [location, setReady])

  useEffect(() => {
    if (ready) return;
    if (!testRef.current) return;
    testRef.current.volume = 0.15;
    testRef.current.muted = false;
    testRef.current.playsInline = true;

    const events = ["click", "touchstart", "keydown", "mousedown", "pointerdown"] as const;
    const onInteract = () => {
      setReady(true);
      setInteracted(true);
    }

    testRef.current.play()
      .then(() => {
        console.debug("Test video played successfully. Setting ready automatically.");
        setReady(true);
      })
      .catch(() => {
        const isHashInUrl = location.hash.length > 0;
        if (isHashInUrl) {
          console.debug("Hash is present in URL, bypassing interaction requirement.");

          // Register event listeners for a valid interaction for autoplay
          events.forEach(event => document.addEventListener(event, onInteract, { once: true }))
        } else {
           console.debug("Failed to play test video. Setting interacted as false.");
          setInteracted(false);
        }
      });

    return () => {
      // Clean up event listeners
      events.forEach(event => document.removeEventListener(event, onInteract));
    }
  }, [ready, setReady])

  return (
    <div 
      onClick={() => {
        setInteracted(true)
        setReady(true)
      }} 
      onMouseDown={(event) => {
        event.preventDefault();
        setGrabbing(true)
      }} 
      onMouseUp={(event) => {
        event.preventDefault();
        setGrabbing(false)
        if (event.button !== 0) {
          setInteracted(true)
          setReady(true)
        }
      }}
      onContextMenu={(event) => {
        event.preventDefault();
      }}
      className={cn(
        "fixed top-0 left-0 w-screen h-screen z-50 select-none cursor-grab bg-[#000d04f5] backdrop-blur-md transition-opacity duration-500 flex flex-col justify-center items-center",
        (interacted) && "opacity-0 pointer-events-none",
        grabbing && "cursor-grabbing"
      )}
    >
      <video ref={testRef} className="absolute top-0 left-0 z-0 pointer-events-none opacity-0 w-0 h-0" src={TinyTestVideo} />
      <div className="flex flex-col gap-1 items-center ">
      <MouseIcon className="w-16 h-16 mb-4 animate-pulse text-[#fde1af]" />
      <p className="text-xl animate-pulse text-[#fde1af]">Interactive Experience</p>
      <p className="sepia animate-pulse text-[#968161]">Please click to Continue!</p>
      </div>
    </div>
  )
}

function GetInTouch() {
  useRenderInterval(1000)

  return (
    <SloppyContainer
      containerClassName="fill-transparent transition duration-300 stroke-[#fde1af99] hover:stroke-[#fde1af] hover:fill-[#96816125]"
      sizeMode="children"
      sloppiness={3}
      waviness={1.5}
      strokeWidth={2}
      borderRadius={15}
      asChild
    >
      <Link to="/#contact" className="font-fun px-6 py-4 text-lg text-[#fde1af]">Get in Touch</Link>
    </SloppyContainer>
  )
}

const NavbarWrapper = withRef<"nav">(({ className, style, ...props }, reference) => {
  const [fillBg, setFillBg] = useState(false);
  const [fillAmount, setFillAmount] = useState(0);

  useEffect(() => {
    const scroll = () => {
      // Get window height if we have scrolled down 1 window height then enable fill background
      const scrolled = window.scrollY;
      const target = window.innerHeight * 0.05;
      if (scrolled >= target) {
        setFillBg(true);
      } else {
        setFillBg(false);
      }

      // Scale fill amount from 0 to 1 based on the page height
      setFillAmount(Math.min(0.9, scrolled / (window.innerHeight * 0.75)));
    }

    window.addEventListener("scroll", scroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", scroll)
    }
  }, [])

  return (
    <nav 
      {...props}
      ref={reference}
      className={cn(
        "fixed select-none top-0 left-0 w-screen z-40 h-32 transition-[height] duration-500 flex flex-row justify-between items-center bg-gradient-to-b from-[#000d04aa] to-transparent px-16",
        // fillBg && "from-[#000d04ee] to-[#000d04ee] h-20 backdrop-blur-sm",
        fillBg && "from-transparent to-transparent h-20 backdrop-blur-sm",
        className
      )} 
      style={{
        ...style,
        backgroundColor: fillBg ? `rgba(0, 13, 4, ${fillAmount})` : "transparent",
      }}
    />
  )
})

function Navbar() {
  return (
    <NavbarWrapper>
      <div className="flex flex-row items-center gap-16">
        <Link to="/#home" className="transition duration-300 hover:sepia hover:brightness-75">
          <img src={Logo} alt="Shopow" className="h-14 w-auto" />
        </Link>
        <Link to="/#about" className="font-fun transition duration-300 hover:text-[#fde1af] text-neutral-200">About Me</Link>
        <Link to="/#featured" className="font-fun transition duration-300 hover:text-[#fde1af] text-neutral-200">Featured Works</Link>
        {/* <Link to="/#projects" className="font-fun transition duration-300 hover:text-[#fde1af]">Projects</Link> */}
      </div>
      <GetInTouch />
    </NavbarWrapper>
  )
}

export default function Layout({ children }: PropsWithChildren) {
  return (
    <main className="size-full">
      <Interactive />
      <Navbar />
      {children}
    </main>
  )
}