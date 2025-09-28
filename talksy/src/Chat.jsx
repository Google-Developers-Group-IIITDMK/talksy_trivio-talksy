import React, { useRef, useContext, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Link } from "react-router-dom";

const FullScreenNav = () => {
  const fullNavLinksRef = useRef(null);
  const fullScreenRef = useRef(null);
  const [navOpen, setNavOpen] = useState(true);

  function gsapAnimation() {
    const tl = gsap.timeline();
    tl.set("#fullscreennav", { autoAlpha: 1, pointerEvents: "auto" });
    tl.to(".stairing", { height: "100%", stagger: { amount: -0.3 } });
    tl.to(".link", { opacity: 1, rotateX: 0, stagger: { amount: 0.2 } });
  }

  function gsapAnimationReverse() {
    const tl = gsap.timeline({
      defaults: { ease: "power2.inOut" },
    });

    tl.to(".link", {
      opacity: 0,
      rotateX: 90,
      stagger: { amount: 0.2, from: "end" },
    });

    tl.to(
      ".stairing",
      {
        height: 0,
        stagger: { amount: -0.3, from: "end" },
      },
      "+=0.2"
    );

    tl.to("#fullscreennav", {
      autoAlpha: 0,
      pointerEvents: "none",
    });
  }

  useGSAP(
    function () {
      if (navOpen) {
        gsapAnimation();
      } else {
        gsapAnimationReverse();
      }
    },
    [navOpen]
  );

  return (
    <div className="flex justify-center items-center w-full h-screen">
      <div
        ref={fullScreenRef}
        id="fullscreennav"
        className="absolute inset-0 bg-black h-[50rem] w-1/2 z-400 pt-[10rem]"
      >
        <div ref={fullNavLinksRef} className="relative">
          <div id="all-links">
            <Link to="/projects">
              <div className="h-28 origin-top cursor-pointer link relative border-y border-white uppercase overflow-hidden mt-[-90px]">
                <h1 className="text-center font-[font1] font-black text-[6vw] text-white mt-[-12px]">
                  Work
                </h1>

                <div className="moveLink absolute top-0 left-0 w-full flex bg-[#D3FD50] text-black">
                  <div className="moveX flex items-center whitespace-nowrap animate-moveX">
                    <h2 className="mx-8 font-[font1] font-black text-[6vw]">
                      See Everything
                    </h2>
                    <img
                      src="https://k72.ca/uploads/caseStudies/PJC/Thumbnails/PJC_SiteK72_Thumbnail_1280x960-1280x960.jpg"
                      className="h-24 w-48 shrink-0 rounded-full object-cover mx-8"
                    />
                    <h2 className="mx-8 font-[font1] font-black text-[6vw]">
                      See Everything
                    </h2>
                    <img
                      src="https://k72.ca/uploads/caseStudies/WIDESCAPE/WS---K72.ca---Thumbnail-1280x960.jpg"
                      className="h-24 w-48 shrink-0 rounded-full object-cover mx-8"
                    />
                  </div>

                  <div className="moveX flex items-center whitespace-nowrap animate-moveX">
                    <h2 className="mx-8 font-[font1] font-black text-[6vw]">
                      See Everything
                    </h2>
                    <img
                      src="https://k72.ca/uploads/caseStudies/PJC/Thumbnails/PJC_SiteK72_Thumbnail_1280x960-1280x960.jpg"
                      className="h-24 w-48 shrink-0 rounded-full object-cover mx-8"
                    />
                    <h2 className="mx-8 font-[font1] font-black text-[6vw]">
                      See Everything
                    </h2>
                    <img
                      src="https://k72.ca/uploads/caseStudies/WIDESCAPE/WS---K72.ca---Thumbnail-1280x960.jpg"
                      className="h-24 w-48 shrink-0 rounded-full object-cover mx-8"
                    />
                  </div>
                </div>
              </div>
            </Link>

            <Link
              to="/agence"
              onClick={() => {
                setNavOpen(false);
              }}
            >
              <div className="h-28 origin-top cursor-pointer link relative border-y border-white uppercase overflow-hidden">
                <h1 className="text-center font-[font1] font-black text-[6vw] text-white mt-[-12px]">
                  agency
                </h1>
                {/* Infinite Moving Strip */}
                <div className="moveLink absolute top-0 left-0 w-full flex bg-[#D3FD50] text-black">
                  {/* First loop */}
                  <div className="moveX flex items-center whitespace-nowrap animate-moveX">
                    <h2 className="mx-8 font-[font1] font-black text-[6vw]">
                      Know Us
                    </h2>
                    <img
                      src="https://k72.ca/uploads/caseStudies/PJC/Thumbnails/PJC_SiteK72_Thumbnail_1280x960-1280x960.jpg"
                      className="h-24 w-48 shrink-0 rounded-full object-cover mx-8"
                    />
                    <h2 className="mx-8 font-[font1] font-black text-[6vw]">
                      Know us
                    </h2>
                    <img
                      src="https://k72.ca/uploads/caseStudies/WIDESCAPE/WS---K72.ca---Thumbnail-1280x960.jpg"
                      className="h-24 w-48 shrink-0 rounded-full object-cover mx-8"
                    />
                  </div>

                  {/* Duplicate for seamless loop */}
                  <div className="moveX flex items-center whitespace-nowrap animate-moveX">
                    <h2 className="mx-8 font-[font1] font-black text-[6vw]">
                      Know us
                    </h2>
                    <img
                      src="https://k72.ca/uploads/caseStudies/PJC/Thumbnails/PJC_SiteK72_Thumbnail_1280x960-1280x960.jpg"
                      className="h-24 w-48 shrink-0 rounded-full object-cover mx-8"
                    />
                    <h2 className="mx-8 font-[font1] font-black text-[6vw]">
                      know us
                    </h2>
                    <img
                      src="https://k72.ca/uploads/caseStudies/WIDESCAPE/WS---K72.ca---Thumbnail-1280x960.jpg"
                      className="h-24 w-48 shrink-0 rounded-full object-cover mx-8"
                    />
                  </div>
                </div>
              </div>
            </Link>
            <div className="h-28 origin-top cursor-pointer link relative border-y border-white uppercase overflow-hidden">
              <h1 className="text-center font-[font1] font-black text-[6vw] text-white mt-[-12px]">
                contact
              </h1>
              {/* Infinite Moving Strip */}
              <div className="moveLink absolute top-0 left-0 w-full flex bg-[#D3FD50] text-black">
                {/* First loop */}
                <div className="moveX flex items-center whitespace-nowrap animate-moveX">
                  <h2 className="mx-8 font-[font1] font-black text-[6vw]">
                    send us fax
                  </h2>
                  <img
                    src="https://k72.ca/uploads/caseStudies/PJC/Thumbnails/PJC_SiteK72_Thumbnail_1280x960-1280x960.jpg"
                    className="h-24 w-48 shrink-0 rounded-full object-cover mx-8"
                  />
                  <h2 className="mx-8 font-[font1] font-black text-[6vw]">
                    send us fax
                  </h2>
                  <img
                    src="https://k72.ca/uploads/caseStudies/WIDESCAPE/WS---K72.ca---Thumbnail-1280x960.jpg"
                    className="h-24 w-48 shrink-0 rounded-full object-cover mx-8"
                  />
                </div>

                {/* Duplicate for seamless loop */}
                <div className="moveX flex items-center whitespace-nowrap animate-moveX">
                  <h2 className="mx-8 font-[font1] font-black text-[6vw]">
                    send us fax
                  </h2>
                  <img
                    src="https://k72.ca/uploads/caseStudies/PJC/Thumbnails/PJC_SiteK72_Thumbnail_1280x960-1280x960.jpg"
                    className="h-24 w-48 shrink-0 rounded-full object-cover mx-8"
                  />
                  <h2 className="mx-8 font-[font1] font-black text-[6vw]">
                    send us fax
                  </h2>
                  <img
                    src="https://k72.ca/uploads/caseStudies/WIDESCAPE/WS---K72.ca---Thumbnail-1280x960.jpg"
                    className="h-24 w-48 shrink-0 rounded-full object-cover mx-8"
                  />
                </div>
              </div>
            </div>
            <div className="h-28 origin-top cursor-pointer link relative border-y border-white uppercase overflow-hidden">
              <h1 className="text-center font-[font1] font-black text-[6vw] text-white mt-[-12px]">
                blog
              </h1>
              {/* Infinite Moving Strip */}
              <div className="moveLink absolute top-0 left-0 w-full flex bg-[#D3FD50] text-black">
                {/* First loop */}
                <div className="moveX flex items-center whitespace-nowrap animate-moveX">
                  <h2 className="mx-8 font-[font1] font-black text-[6vw]">
                    read article
                  </h2>
                  <img
                    src="https://k72.ca/uploads/caseStudies/PJC/Thumbnails/PJC_SiteK72_Thumbnail_1280x960-1280x960.jpg"
                    className="h-24 w-48 shrink-0 rounded-full object-cover mx-8"
                  />
                  <h2 className="mx-8 font-[font1] font-black text-[6vw]">
                    read article
                  </h2>
                  <img
                    src="https://k72.ca/uploads/caseStudies/WIDESCAPE/WS---K72.ca---Thumbnail-1280x960.jpg"
                    className="h-24 w-48 shrink-0 rounded-full object-cover mx-8"
                  />
                </div>

                {/* Duplicate for seamless loop */}
                <div className="moveX flex items-center whitespace-nowrap animate-moveX">
                  <h2 className="mx-8 font-[font1] font-black text-[6vw]">
                    read article
                  </h2>
                  <img
                    src="https://k72.ca/uploads/caseStudies/PJC/Thumbnails/PJC_SiteK72_Thumbnail_1280x960-1280x960.jpg"
                    className="h-24 w-48 shrink-0 rounded-full object-cover mx-8"
                  />
                  <h2 className="mx-8 font-[font1] font-black text-[6vw]">
                    read article
                  </h2>
                  <img
                    src="https://k72.ca/uploads/caseStudies/WIDESCAPE/WS---K72.ca---Thumbnail-1280x960.jpg"
                    className="h-24 w-48 shrink-0 rounded-full object-cover mx-8"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullScreenNav;
