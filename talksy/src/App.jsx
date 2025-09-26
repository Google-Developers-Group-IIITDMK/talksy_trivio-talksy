import React, { useState, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "remixicon/fonts/remixicon.css";

const App = () => {
  const [showContent, setShowContent] = useState(false);
  const mainRef = useRef(null);
  useGSAP(() => {
    const tl = gsap.timeline();

    tl.to(".talksy-mask-group", {
      rotate: 10,
      ease: "power4.inOut",
      transformOrigin: "50% 50%",
    }).to(".talksy-mask-group", {
      scale: 10,
      duration: 2,
      delay: 0.5,
      ease: "expo.inOut",
      transformOrigin: "50% 50%",
      opacity: 0,
      onUpdate: function () {
        if (this.progress() >= 0.9) {
          document.querySelector(".svg").remove();
          setShowContent(true);
          this.kill();
        }
      },
    });
  });

  const moveIntensity = 60;
  const rotateIntensity = 1;

  useGSAP(() => {
    const main = mainRef.current;
    if (!main) return;
    const container = document.querySelector(".main");
    const imageElement = document.querySelector(".character");
    // const handler = (e) => {
    //   const xMove = (e.clientX / window.innerWidth - 0.5) * 40;
    //   gsap.to(".imagesdiv .text", { x: `${xMove * 0.7}%` });
    // };

    // main.addEventListener("mousemove", handler);

    const handler = (e) => {
      const xPercent = e.clientX / window.innerWidth - 0.5;
      const yPercent = e.clientY / window.innerHeight - 0.5;

      const xMove = xPercent * moveIntensity;
      const yMove = yPercent * moveIntensity;

      const yRotate = xPercent * rotateIntensity;
      const xRotate = -1 * yPercent * rotateIntensity;

      gsap.to(imageElement, {
        x: xMove,
        y: yMove,
        rotateY: yRotate,
        rotateX: xRotate,
        ease: "power1.out",
        duration: 0.8,
      });
      gsap.to(".imagesdiv .text", {
        x: xMove,
        ease: "power1.out",
        duration: 0.8,
      });
    };
    main.addEventListener("mousemove", handler);

    return () => main.removeEventListener("mousemove", handler);
  }, [showContent]);
  return (
    <>
      <div className="svg flex items-center justify-center fixed top-0 left-0 z-[100] w-full h-screen overflow-hidden bg-[#000]">
        <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
          <defs>
            <mask id="talksyMask">
              <rect width="100%" height="100%" fill="black" />
              <g className="talksy-mask-group">
                <text
                  x="50%"
                  y="50%"
                  fontSize="120"
                  textAnchor="middle"
                  fill="white"
                  dominantBaseline="middle"
                  fontFamily="Arial Black"
                >
                  TALKSY
                </text>
              </g>
            </mask>
          </defs>
          <image
            href="./kprchar1.png"
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid slice"
            mask="url(#talksyMask)"
          />

          <rect width="100%" height="100%" fill="white" />

          <image
            href="./kprchar1.png"
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid slice"
            mask="url(#talksyMask)"
          />
        </svg>
      </div>
      {showContent && (
        <>
          <div ref={mainRef} className="main w-full">
            <div className="relative landing w-full h-screen bg-white overflow-hidden">
              <div className="navbar absolute top-0 left-0 z-10 w-full p-10">
                <div className="logo flex gap-5 items-center">
                  <div className="lines flex flex-col gap-1">
                    <div className="line w-10 h-1 bg-white"></div>
                    <div className="line w-8 h-1 bg-white"></div>
                    <div className="line w-5 h-1 bg-white"></div>
                  </div>
                  <h3 className="text-5xl text-white font-[pricedown]">
                    TALKSY
                  </h3>
                </div>
              </div>
              <div className="imagesdiv w-full h-screen realtive overflow-hidden">
                <img
                  className="character scale-[1.2] absolute top-0 left-0 w-full h-full object-cover"
                  src="./kprchar1.png"
                ></img>
                <div className="text absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col space-y-[-80px]">
                  <h1 className="text-[160px] text-white font-[pricedown] translate-x-[-300px]">
                    WHERE
                  </h1>
                  <h1 className="text-[160px] text-white font-[pricedown] translate-x-[-20px]">
                    CHARACTERS
                  </h1>
                  <h1 className="text-[160px] text-white font-[pricedown] translate-x-[280px]">
                    COMES ALIVE
                  </h1>
                </div>
              </div>
            </div>
          </div>
          <div className="relative w-full h-screen">
            <div className="absolute top-0 left-0 w-full h-screen bg-no-repeat">
              <img src="./0.png" className="w-full h-screen object-cover" alt="" />
            </div>
            <div className="absolute top-0 left-0 w-full h-screen bg-no-repeat">
              <img src="./1.png" className="w-full h-screen object-cover" alt="" />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default App;
