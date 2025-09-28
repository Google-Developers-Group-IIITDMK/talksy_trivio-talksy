import React, { Suspense, useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Stage, OrbitControls, useGLTF } from "@react-three/drei";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

// Model Component is unchanged
function Model(props) {
  const { scene } = useGLTF("/doremon.glb");
  return <primitive object={scene} {...props} />;
}

const ChatPage = () => {
  const mainRef = useRef(null);
  const [recordingStatus, setRecordingStatus] = useState("idle");

  useGSAP(() => {
    gsap.from("[data-anim='fade-in']", {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      stagger: 0.2,
      delay: 0.5,
    });
  }, { scope: mainRef });


  const handleMicClick = () => {
    if (recordingStatus === "idle") {
      setRecordingStatus("listening");
    } else if (recordingStatus === "listening") {
      setRecordingStatus("processing");
      setTimeout(() => {
        setRecordingStatus("idle");
      }, 3000); // Simulate processing
    }
  };

  return (
    // --- 1. Main container is now a responsive flexbox ---
    <div ref={mainRef} className="w-full h-screen bg-[#f1f1f1] flex flex-col md:flex-row">

      {/* --- 2. LEFT COLUMN for the 3D Model --- */}
      <div className="w-full md:w-1/2 h-1/2 md:h-full">
        <Canvas dpr={[1, 2]} camera={{ position: [0, 1, 10], fov: 45 }}>
          <Suspense fallback={null}>
            <Stage environment="apartment" intensity={0.8} contactShadow shadowBias={-0.0015}>
              <Model scale={1.5} position={[0, -1.5, 0]} />
            </Stage>
          </Suspense>
          <OrbitControls makeDefault autoRotate autoRotateSpeed={0.8} enableZoom={true} enablePan={false} minPolarAngle={Math.PI / 2.8} maxPolarAngle={Math.PI / 2} />
        </Canvas>
      </div>

      
      <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col justify-between p-8 text-black">
        
       
        <div data-anim="fade-in" className="text-center font-black uppercase">
          <h1 className="text-4xl md:text-6xl tracking-tighter">Talk with</h1>
          <h1 className="text-6xl md:text-8xl tracking-tighter -mt-2 md:-mt-4">Doraemon</h1>
        </div>

        
        <div data-anim="fade-in" className="flex flex-col items-center">
            <div 
                className="link-container h-20 w-full max-w-sm cursor-pointer relative uppercase overflow-hidden border-2 border-black"
                onClick={handleMicClick}
            >
                <h1 className="text-center font-black text-3xl text-black mt-6">
                    {recordingStatus === 'idle' && 'TALK'}
                    {recordingStatus === 'listening' && 'STOP'}
                    {recordingStatus === 'processing' && '...'}
                </h1>
                
                <div className={`moveLink absolute top-0 left-0 w-full flex bg-[#D3FD50] text-black ${recordingStatus === 'listening' ? 'translate-y-0' : 'translate-y-full'}`}>
                    <div className="moveX flex items-center whitespace-nowrap animate-moveX">
                        <h2 className="mx-8 font-black text-5xl py-6">
                            LISTENING
                        </h2>
                        <h2 className="mx-8 font-black text-5xl py-6">
                            LISTENING
                        </h2>
                    </div>
                    <div className="moveX flex items-center whitespace-nowrap animate-moveX">
                        <h2 className="mx-8 font-black text-5xl py-6">
                            LISTENING
                        </h2>
                        <h2 className="mx-8 font-black text-5xl py-6">
                            LISTENING
                        </h2>
                    </div>
                </div>
            </div>
            <p className="mt-4 text-gray-600 text-sm">
                {recordingStatus === 'processing' ? 'Doraemon is thinking...' : 'Tap to start or stop the conversation'}
            </p>
        </div>

      </div>
    </div>
  );
};

export default ChatPage;