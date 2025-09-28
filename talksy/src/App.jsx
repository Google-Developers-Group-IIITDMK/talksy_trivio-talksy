import React from "react";
import LocomotiveScroll from "locomotive-scroll";
import "locomotive-scroll/dist/locomotive-scroll.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useGSAP } from "@gsap/react";
import { useRef, useEffect } from "react";
import CircularText from './components/CircularText.jsx';

gsap.registerPlugin(ScrollTrigger);

const App = () => {
  const mainRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const locoScroll = new LocomotiveScroll({
      el: mainRef.current,
      smooth: true,
    });

    locoScroll.on("scroll", ScrollTrigger.update);

    ScrollTrigger.scrollerProxy(mainRef.current, {
      scrollTop(value) {
        return arguments.length
          ? locoScroll.scrollTo(value, 0, 0)
          : locoScroll.scroll.instance.scroll.y;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      pinType: mainRef.current.style.transform ? "transform" : "fixed",
    });

    function handleRefresh() {
      locoScroll.update();
    }
    ScrollTrigger.addEventListener("refresh", handleRefresh);
    ScrollTrigger.refresh();

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const frameCount = 300;
    const images = [];
    const imageSeq = { frame: 0 };

    const files = (i) => `./male${String(i + 1).padStart(4, "0")}.png`;

    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = files(i);
      images.push(img);
    }

    function setCanvasSize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      render();
    }

    window.addEventListener("resize", setCanvasSize);
    setCanvasSize();

    gsap.to(imageSeq, {
      frame: frameCount - 1,
      snap: "frame",
      ease: "none",
      scrollTrigger: {
        scrub: 0.15,
        trigger: canvas,
        start: "top top",
        end: "600% top",
        scroller: mainRef.current,
        invalidateOnRefresh: true,
      },
      onUpdate: render,
    });

    images[0].onload = render;

    function render() {
      scaleImage(images[imageSeq.frame], context);
    }

    function scaleImage(img, ctx) {
      var canvas = ctx.canvas;
      const hRatio = canvas.width / img.width;
      const vRatio = canvas.height / img.height;
      const ratio = Math.max(hRatio, vRatio);
      const centerShiftX = (canvas.width - img.width * ratio) / 2;
      const centerShiftY = (canvas.height - img.height * ratio) / 2;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(
        img,
        0,
        0,
        img.width,
        img.height,
        centerShiftX,
        centerShiftY,
        img.width * ratio,
        img.height * ratio
      );
    }

    ScrollTrigger.create({
      trigger: canvas,
      pin: true,
      scroller: mainRef.current,
      start: "top top",
      end: "600% top",
    });

    ["#page1", "#page2", "#page3"].forEach((id) => {
      gsap.to(id, {
        scrollTrigger: {
          trigger: id,
          start: "top top",
          end: "bottom top",
          pin: true,
          scroller: mainRef.current,
          pinType: mainRef.current.style.transform ? "transform" : "fixed",
          invalidateOnRefresh: true,
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
      window.removeEventListener("resize", setCanvasSize);
      ScrollTrigger.removeEventListener("refresh", handleRefresh);
      locoScroll.destroy();
    };
  }, []);

  useGSAP(() => { }, []);

  return (
    <>
      <div
        id="nav"
        className="flex justify-between items-center w-full h-24 fixed px-10 py-10 z-[99] "
      >
        <h3 className="font-[Avenir] font-400 text-5xl cursor-pointer text-white">
          TALKSY
        </h3>
        <button className="px-5 py-5 bg-black text-white text-4xl border-none font-[Avenir] rounded-4xl cursor-pointer hover:bg-white hover:text-black">
          TRY NOW
        </button>
      </div>
      <div
        ref={mainRef}
        className="main relative overflow-hidden data-scroll-container bg-black"
      >
        <div id="page" className="w-full h-screen relative bg-black">
          <div
            id="loop"
            className="flex absolute top-[20%] h-[25%] w-full text-[10rem] whitespace-nowrap text-white"
          >
            <h1 className="font-normal [animation-name:anim] [animation-duration:15s] ease-linear animate-infinite">
              <b>TALKSY</b> IS WHERE{" "}
              <b>
                <i>CHARACTERS</i>
              </b>{" "}
              <span className="font-medium">
                COME <b>ALIVE</b>
              </span>{" "}
              IN THE{" "}
              <span>
                <i>METAVERSE.</i>
              </span>
            </h1>
            <h1 className="font-normal [animation-name:anim] [animation-duration:15s] ease-linear animate-infinite">
              <b>TALKSY</b> IS WHERE{" "}
              <b>
                <i>CHARACTERS</i>
              </b>{" "}
              <span className="text-transparent font-medium [-webkit-text-stroke:1.2px_#111] ">
                COME <b>ALIVE</b>
              </span>{" "}
              IN THE{" "}
              <span>
                <i>METAVERSE.</i>
              </span>
            </h1>
            <h1 className="font-normal [animation-name:anim] [animation-duration:15s] ease-linear animate-infinite">
              <b>TALKSY</b> IS WHERE{" "}
              <b>
                <i>CHARACTERS</i>
              </b>{" "}
              <span className="text-white font-medium">
                COME <b>ALIVE</b>
              </span>{" "}
              IN THE{" "}
              <span className="text-white">
                <i>METAVERSE.</i>
              </span>
            </h1>
          </div>
          <h3 className="absolute top-[55%] font-normal text-[20px] text-[#7c7c7c] left-[5%]">
            TALKSY AIMS TO BE A LIVING PLATFORM WHERE YOU CAN <br />
            CHAT, PLAY, AND CONNECT WITH CHARACTERS IN A <br />
            TRULY INTERACTIVE WORLD.
          </h3>
          <h4 className="absolute top-[65%] left-[20%] font-500 text-white">
            <br />...SCROLL TO EXPLORE
          </h4>
          <canvas
            ref={canvasRef}
            className="absolute inset-0 z-20 max-w-full max-h-screen"
          ></canvas>
        </div>

        <div className="relative w-full h-screen bg-black" id="page1">
          <div className="absolute top-[30%] left-[5%]" id="right-text">
            <h3 className=" font-normal text-[#7c7c7c] text-[30px]">
              TALKSY / KEY VISION
            </h3>
            <h1 className="text-[50px] leading-[1.5] text-white">
              TALK FREELY
              <br />
              MEET CHARACTERS
              <br />
              EXPLORE WORLDS
            </h1>
          </div>
          <div
            className="absolute top-[50%] right-[5%] text-end"
            id="left-text"
          >
            <h1 className="font text-[40px] leading-[1.5] text-white">
              CREATE STORIES
              <br />
              BUILD CONNECTIONS
              <br />
              OWN YOUR EXPERIENCE
            </h1>
            <h3 className="text-[#7c7c7c] font-normal text-[30px]">
              ..AND CELEBRATE TRUE INTERACTION
            </h3>
          </div>
        </div>
        <div className="relative w-full h-screen bg-black" id="page2">
          <div className="absolute top-[30%] left-[10%]" id="text1">
            <h3 className="text-[#7c7c7c] text-[30px] font-normal">
              TALKSY / COME ALIVE
            </h3>
            <h1 className="text-[60px] leading-[1.5] text-white">
              LET'S
              <br />
              TALK
              <br />
              TOGETHER
            </h1>
          </div>
          <div text-align="center"
            className="absolute top-[55%] -right-[65px] w-4xl text-center text-3xl"
            id="text2"
          >
            <p className="text-[#7c7c7c] font-light text-[25px] leading-[1.5]">
              STEP INTO A SPACE WHERE CHARACTERS <br /> AREN’T JUST AVATARS —THEY <br />
              LISTEN, RESPOND, AND GROW WITH YOU.<br /> AGE, REGION, STATUS <br />NONE OF IT
              MATTERS HERE.<br /> CHAT, LAUGH, AND PLAY WITHOUT LIMITS,<br /> CREATING
              STORIES THAT BELONG<br /> TO EVERYONE. <br />THE FUTURE OF CONVERSATION<br /> STARTS
              WITH US.
            </p>
          </div>
        </div>

        <div className="relative h-screen w-full bg-black" id="page3 ">
          <div className="absolute top-[40%] right-[10%] text-end" id="text3">
            <h3 className="font-normal text-[#7c7c7c] text-[40px]">
              TALKSY <br />DIGITAL PLAYGROUND
            </h3>
            <h1 className="text-[70px] text-white ">
              THE METAVERSE
              <br />
              IS OUR
              <br />
              CONVERSATION SPACE
            </h1>
          </div>
        </div>
        <footer>
          <div className=" w-full h-48 text-white flex justify-start relative">
            <div className="m-0 mx-auto -my-3 absolute top-1 left-1.5 cursor-pointer w-48 h-48 z-20">
            <CircularText
              text="TALKSY*TRIVIO*"
              onHover="speedUp"
              spinDuration={20}
              className="custom-class"
            />
            </div>
          </div>
        </footer>
      </div>

    </>
  );
};

export default App;
