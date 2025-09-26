import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const App = () => {
  const container = useRef();
  const heroRef = useRef(); 

  useGSAP(() => {
    
    gsap.set(".panel", {
      rotationY: -90,
      transformOrigin: "center center",
    });

    
    const tl = gsap.timeline({
        defaults: { duration: 1.8, ease: "power3.inOut" }
    });

   
    tl.to(heroRef.current, {
      width: "100vw",
      height: "100vh",
      borderRadius: "0px",
    });

   
    tl.to(".panel", {
      rotationY: 0,
    }, "<");

  }, { scope: container });

  return (
   
    <div ref={container} style={{ perspective: '1200px' }} className="main bg-white w-full h-screen flex items-center justify-center">
      
      <div 
        ref={heroRef} 
        className="hero relative w-[50vw] h-[80vh] md:w-[30vw] md:h-[75vh] rounded-3xl overflow-hidden"
      >
        <div
          className="absolute left-0 top-0 panel w-full h-full"
          style={{
            backgroundImage: `url(./kprchar1.png)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </div>
    </div>
  );
};

export default App;