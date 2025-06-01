import * as React from "react";
import { cn, withRef } from "@udecode/cn";
import { Link } from "react-router-dom";
import { useRenderInterval } from "../hooks/use-render-interval";
import { useOnScroll } from "../hooks/use-on-scroll";
import SloppyContainer from "./sloppy-container";

import Logo from "../assets/logo.min.webp";
import { scrollToHash } from "../utils/scroll-to-hash";

const ResizingNavbarWrapper = withRef<"nav">(({ className, style, ...props }, reference) => {
  const [fillBg, setFillBg] = React.useState(false);
  const [fillAmount, setFillAmount] = React.useState(0);

  useOnScroll(() => {
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
  });

  return (
    <nav 
      {...props}
      ref={reference}
      className={cn(
        "fixed select-none top-0 left-0 w-screen z-40 lg:h-32 h-20 transition-[height] duration-500 flex flex-row items-center bg-gradient-to-b from-[#000d04aa] to-transparent lg:px-16 px-4",
        // fillBg && "from-[#000d04ee] to-[#000d04ee] h-20 backdrop-blur-sm",
        fillBg && "from-transparent to-transparent !h-20 backdrop-blur-sm",
        className
      )} 
      style={{
        ...style,
        backgroundColor: fillBg ? `rgba(0, 13, 4, ${fillAmount})` : "transparent",
      }}
    />
  );
});

function GetInTouch() {
  useRenderInterval(1000);

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
  );
}

export function Navbar() {
  // On load handle scrolling to the relevant section if the URL has a hash
  React.useEffect(() => {
    scrollToHash(window.location.hash);
  }, []);

  return (
    <ResizingNavbarWrapper>
      <div className="flex flex-row items-center lg:gap-16 gap-8">
        <Link 
          className="transition duration-300 hover:sepia hover:brightness-75"
          to="/"
          onClick={() => {
            // Scroll to top when clicking the logo
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <img src={Logo} alt="Shopow" className="lg:h-14 h-10 w-auto" />
        </Link>
        <div className="lg:contents hidden">
          <Link to="/#about-me" onClick={() => scrollToHash("about-me")} className="font-fun transition duration-300 hover:text-[#fde1af] text-neutral-200">About Me</Link>
          {/* <Link to="/#featured" className="font-fun transition duration-300 hover:text-[#fde1af] text-neutral-200">Featured Works</Link> */}
          {/* <Link to="/#projects" className="font-fun transition duration-300 hover:text-[#fde1af]">Projects</Link> */}
        </div>
      </div>

      <div className="ml-auto lg:block hidden">
        <GetInTouch />
      </div>
      {/* <button className="lg:hidden flex ml-auto">
        <Menu className="size-7" />
      </button> */}
    </ResizingNavbarWrapper>
  );
}
