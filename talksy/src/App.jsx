import React from "react";

import LocomotiveScroll from "locomotive-scroll";
import "locomotive-scroll/dist/locomotive-scroll.css";

const LocomotiveScrollComponent = () => {
  const scrollRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const locoScroll = new LocomotiveScroll({
      el: scrollRef.current,
      smooth: true,
    });

    locoScroll.on("scroll", ScrollTrigger.update);

    ScrollTrigger.scrollerProxy(scrollRef.current, {
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
      pinType: scrollRef.current.style.transform ? "transform" : "fixed",
    });

    ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
    ScrollTrigger.refresh();

    // Cleanup on unmount
    return () => {
      ScrollTrigger.removeEventListener("refresh", () => locoScroll.update());
      locoScroll.destroy();
    };
  }, []);
};

const App = () => {
  return (
    <>
      <div
        id="nav"
        className="flex justify-between items-center w-full h-24 fixed px-10 z-99"
      >
        <h3 className="font-[gilroy] font-400 text-5xl cursor-pointer">
          TALKSY
        </h3>
        <button className="px-5 py-5 bg-black text-white text-4xl border-none font-[gilroy] rounded-4xl mt-0.5 cursor-pointer">
          TRY NOW
        </button>
      </div>
      <div className="main relative overflow-hidden">
        <div id="page" className="w-full h-screen relative bg-[#f1f1f1]">
          <div id="loop">
            <h1>
              <b>TALKSY</b> IS WHERE{" "}
              <b>
                <i>CHARACTERS</i>
              </b>{" "}
              <span>
                COME <b>ALIVE</b>
              </span>{" "}
              IN THE{" "}
              <span>
                <i>METAVERSE.</i>
              </span>
            </h1>
            <h1>
              <b>TALKSY</b> IS WHERE{" "}
              <b>
                <i>CHARACTERS</i>
              </b>{" "}
              <span>
                COME <b>ALIVE</b>
              </span>{" "}
              IN THE{" "}
              <span>
                <i>METAVERSE.</i>
              </span>
            </h1>
            <h1>
              <b>TALKSY</b> IS WHERE{" "}
              <b>
                <i>CHARACTERS</i>
              </b>{" "}
              <span>
                COME <b>ALIVE</b>
              </span>{" "}
              IN THE{" "}
              <span>
                <i>METAVERSE.</i>
              </span>
            </h1>
          </div>
          <h3 className="absolute top-[55%] font-400 text-[#7c7c7c] left-[5%]">
            TALKSY AIMS TO BE A LIVING PLATFORM WHERE YOU CAN <br />
            CHAT, PLAY, AND CONNECT WITH CHARACTERS IN A <br />
            TRULY INTERACTIVE WORLD.
          </h3>
          <h4 className="absolute top-[62%] left-[25%] font-500">
            ...SCROLL TO EXPLORE
          </h4>
        </div>
      </div>
    </>
  );
};

export default App;
