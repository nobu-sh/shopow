import { PropsWithChildren, useEffect, useState } from "react";
import Logo from "./assets/logo.min.webp"
import { Link } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { interactedState } from "./states/interacted";
import { cn } from "@udecode/cn";
import { MouseIcon } from "lucide-react";
import SloppyContainer from "./components/SloppyContainer";
import { useRenderInterval } from "./hooks/use-render-interval";

function Interactive() {
  const [interacted, setInteracted] = useRecoilState(interactedState)
  const [grabbing, setGrabbing] = useState(false)

  return (
    <div 
      onClick={() => setInteracted(true)} 
      onMouseDown={(event) => {
        event.preventDefault();
        setGrabbing(true)
      }} 
      onMouseUp={(event) => {
        event.preventDefault();
        setGrabbing(false)
        if (event.button !== 0) {
          setInteracted(true)
        }
      }}
      onContextMenu={(event) => {
        event.preventDefault();
      }}
      className={cn(
        "fixed top-0 left-0 w-screen h-screen z-50 select-none cursor-grab bg-[#000d04f5] backdrop-blur-md transition-opacity duration-500 flex flex-col justify-center items-center",
        interacted && "opacity-0 pointer-events-none",
        grabbing && "cursor-grabbing"
      )}
    >
      <div className="flex flex-col gap-1 items-center ">
      <MouseIcon className="w-16 h-16 mb-4 animate-pulse text-[#fde1af]" />
      <p className="text-xl text-[#fde1af]">Interactive Experience</p>
      <p className="sepia text-[#968161]">Please click to Continue!</p>
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

function Navbar() {
  return (
    <nav className="fixed select-none top-0 left-0 w-screen z-40 h-32 flex flex-row justify-between items-center bg-gradient-to-b from-[#000d04aa] to-transparent px-16 p-6">
      <div className="flex flex-row items-center gap-16">
        <Link to="/#home" className="transition duration-300 hover:sepia hover:brightness-75">
          <img src={Logo} className="h-14 w-auto" />
        </Link>
        <Link to="/#about" className="font-fun transition duration-300 text-lg hover:text-[#fde1af]">About Me</Link>
        <Link to="/#featured" className="font-fun transition duration-300 text-lg hover:text-[#fde1af]">Featured Works</Link>
        <Link to="/#projects" className="font-fun transition duration-300 text-lg hover:text-[#fde1af]">Projects</Link>
      </div>
      <GetInTouch />
      {/* <Link to="/#contact" className="font-fun transition duration-300 hover:sepia hover:brightness-75 text-xl border border-neutral-400 rounded-lg py-2 px-4">Get in Touch</Link> */}
    </nav>
  )
}

export default function Layout({ children }: PropsWithChildren) {
  const interacted = useRecoilValue(interactedState)

  useEffect(() => {
    if (!document.body.parentElement) return;
    document.body.parentElement.style.overflow = interacted ? "auto" : "hidden"
  }, [interacted])

  return (
    <main className="size-full">
      <Interactive />
      <Navbar />
      {children}
    </main>
  )
}