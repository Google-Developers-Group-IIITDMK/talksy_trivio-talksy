import React, { useRef, useContext, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Link} from "react-router-dom";

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
    <div className="flex justify-center items-center w-full h-screen bg-amber-800">
      <div
      ref={fullScreenRef}
      id="fullscreennav"
      className="absolute inset-0 bg-white h-[38rem] w-[70rem] z-400 pt-[10rem] left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%]"
    >
      <div ref={fullNavLinksRef} className="relative">

        <div
          id="all-links"
        >
          <Link to="/doremon">
            <div className="h-28 origin-top cursor-pointer link relative border-y border-black uppercase overflow-hidden mt-[-90px]">
              <h1 className="text-center font-[font1] font-black text-[6vw] text-black mt-[-12px]">
                doremon
              </h1>
              
              <div className="moveLink absolute top-0 left-0 w-full flex bg-[#D3FD50] text-black">
                <div className="moveX flex items-center whitespace-nowrap animate-moveX">
                  <h2 className="mx-8 font-[font1] font-black text-[6vw]">
                    Heyyy! I’m Doraemon—ready with a gadget or two. Wanna chat before Nobita calls me?
                  </h2>
                  <img
                    src="https://upload.wikimedia.org/wikipedia/en/b/bd/Doraemon_character.png"
                    className="h-18 w-48 shrink-0 rounded-full object-cover mx-8"
                  />
                  
                  <h2 className="mx-8 font-[font1] font-black text-[6vw]">
                    Heyyy! I’m Doraemon—ready with a gadget or two. Wanna chat before Nobita calls me?
                  </h2>
                  <img
                    src="https://upload.wikimedia.org/wikipedia/en/b/bd/Doraemon_character.png"
                    className="h-18 w-48 shrink-0 rounded-full object-cover mx-8"
                  />
                  
                </div>

                <div className="moveX flex items-center whitespace-nowrap animate-moveX">
                  <h2 className="mx-8 font-[font1] font-black text-[6vw]">
                    Heyyy! I’m Doraemon—ready with a gadget or two. Wanna chat before Nobita calls me?
                  </h2>
                  <img
                    src="https://upload.wikimedia.org/wikipedia/en/b/bd/Doraemon_character.png"
                    className="h-18 w-48 shrink-0 rounded-full object-cover mx-8"
                  />
                  
                  <h2 className="mx-8 font-[font1] font-black text-[6vw]">
                    Heyyy! I’m Doraemon—ready with a gadget or two. Wanna chat before Nobita calls me?
                  </h2>
                  <img
                    src="https://upload.wikimedia.org/wikipedia/en/b/bd/Doraemon_character.png"
                    className="h-18 w-48 shrink-0 rounded-full object-cover mx-8"
                  />
                </div>
              </div>
            </div>
          </Link>

          <Link
            to="/agence"
          >
            <div className="h-28 origin-top cursor-pointer link relative border-y border-black uppercase overflow-hidden">
              <h1 className="text-center font-[font1] font-black text-[6vw] text-black mt-[-12px]">
                Harry
              </h1>
            
              <div className="moveLink absolute top-0 left-0 w-full flex bg-[#D3FD50] text-black">
            
                <div className="moveX flex items-center whitespace-nowrap animate-moveX">
                  <h2 className="mx-8 font-[font1] font-black text-[6vw]">
                    I promise no spells—just friendly conversation (unless you’re a Death Eater 😜).
                  </h2>
                  
                  <h2 className="mx-8 font-[font1] font-black text-[6vw]">
                    I promise no spells—just friendly conversation (unless you’re a Death Eater 😜).
                  </h2>
                  
                </div>

                
                <div className="moveX flex items-center whitespace-nowrap animate-moveX">
                  <h2 className="mx-8 font-[font1] font-black text-[6vw]">
                    I promise no spells—just friendly conversation (unless you’re a Death Eater 😜).
                  </h2>
                 
                  <h2 className="mx-8 font-[font1] font-black text-[6vw]">
                    I promise no spells—just friendly conversation (unless you’re a Death Eater 😜).
                  </h2>
                  
                </div>
              </div>
            </div>
          </Link>
          <div className="h-28 origin-top cursor-pointer link relative border-y border-white uppercase overflow-hidden">
            <h1 className="text-center font-[font1] font-black text-[6vw] text-black mt-[-12px]">
              VOLmaort
            </h1>
           
            <div className="moveLink absolute top-0 left-0 w-full flex bg-[#D3FD50] text-black">
              
              <div className="moveX flex items-center whitespace-nowrap animate-moveX">
                <h2 className="mx-8 font-[font1] font-black text-[6vw]">
                  You dare hover over the Dark Lord? Bold move… I like it.
                </h2>
                
                <h2 className="mx-8 font-[font1] font-black text-[6vw]">
                  You dare hover over the Dark Lord? Bold move… I like it.
                </h2>
                
              </div>

            
              <div className="moveX flex items-center whitespace-nowrap animate-moveX">
                <h2 className="mx-8 font-[font1] font-black text-[6vw]">
                  You dare hover over the Dark Lord? Bold move… I like it.
                </h2>
                
                <h2 className="mx-8 font-[font1] font-black text-[6vw]">
                  You dare hover over the Dark Lord? Bold move… I like it.
                </h2>
                
              </div>
            </div>
          </div>
          <div className="h-28 origin-top cursor-pointer link relative border-y border-black uppercase overflow-hidden">
            <h1 className="text-center font-[font1] font-black text-[6vw] text-black mt-[-12px]">
              Tom
            </h1>
            
            <div className="moveLink absolute top-0 left-0 w-full flex bg-[#D3FD50] text-black">
              
              <div className="moveX flex items-center whitespace-nowrap animate-moveX">
                <h2 className="mx-8 font-[font1] font-black text-[6vw]">
                  Pssst… keep quiet or Jerry will hear us!
                </h2>
                
                <h2 className="mx-8 font-[font1] font-black text-[6vw]">
                  Pssst… keep quiet or Jerry will hear us!
                </h2>
                
              </div>

              
              <div className="moveX flex items-center whitespace-nowrap animate-moveX">
                <h2 className="mx-8 font-[font1] font-black text-[6vw]">
                  Pssst… keep quiet or Jerry will hear us!
                </h2>
                
                <h2 className="mx-8 font-[font1] font-black text-[6vw]">
                  Pssst… keep quiet or Jerry will hear us!
                </h2>
                
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