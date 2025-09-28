import React, { Suspense, useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Stage, OrbitControls, useGLTF } from "@react-three/drei";

// --- Model Component remains the same ---
function Model(props) {
  const { scene } = useGLTF("/doremon.glb"); // Path to your model
  return <primitive object={scene} {...props} />;
}

const ChatPage = () => {
  const controlsRef = useRef();
  
  // --- 1. State to manage the voice interaction UI ---
  // 'idle': Waiting for user to press mic
  // 'listening': Mic is on and recording user's voice
  // 'processing': AI is thinking of a response
  const [recordingStatus, setRecordingStatus] = useState("idle");

  // Placeholder function to handle mic button clicks
  const handleMicClick = () => {
    if (recordingStatus === "idle") {
      setRecordingStatus("listening");
      // TODO: Add logic to start recording audio
    } else if (recordingStatus === "listening") {
      setRecordingStatus("processing");
      // TODO: Add logic to stop recording and send to AI
      
      // Simulate processing and then going back to idle
      setTimeout(() => {
        setRecordingStatus("idle");
      }, 3000); // Fake processing time
    }
  };

  return (
    <div className="w-full h-screen relative bg-[#f1f1f1]">
      {/* --- 3D Canvas with refined settings --- */}
      <Canvas dpr={[1, 2]} camera={{ position: [0, 2, 8], fov: 45 }}>
        <Suspense fallback={null}>
          <Stage
            environment="apartment"
            intensity={0.8}
            contactShadow
            shadowBias={-0.0015}
          >
            <Model scale={1.5} position={[0, -1.5, 0]} />
          </Stage>
        </Suspense>
        <OrbitControls
          ref={controlsRef}
          makeDefault
          autoRotate
          autoRotateSpeed={0.8}
          enableZoom={true}
          enablePan={false}
          minPolarAngle={Math.PI / 2.8}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>

      {/* --- 2. Sleek, dedicated HTML Voice UI --- */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="w-full max-w-2xl mx-auto h-full flex flex-col justify-between p-4 md:p-8">
          {/* Top Header */}
          <div className="text-center pt-4">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
              Talk with Doraemon
            </h1>
            <p className="text-gray-500 italic mt-2">
              "I'm ready with a gadget or two. Ask me anything!"
            </p>
          </div>

          {/* This empty div pushes the button to the bottom */}
          <div className="flex-grow"></div>

          {/* Bottom Voice Interaction Area */}
          <div className="flex flex-col items-center mb-8 pointer-events-auto">
            <p className="text-gray-600 mb-4">
              {recordingStatus === 'listening' && 'Listening...'}
              {recordingStatus === 'processing' && 'Thinking...'}
              {recordingStatus === 'idle' && 'Tap the mic to speak'}
            </p>
            <button
              onClick={handleMicClick}
              className={`rounded-full p-5 transition-all duration-300 ease-in-out shadow-lg
                ${recordingStatus === 'listening' ? 'bg-red-500 text-white animate-pulse' : ''}
                ${recordingStatus === 'processing' ? 'bg-gray-400 text-white cursor-not-allowed' : ''}
                ${recordingStatus === 'idle' ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}
              `}
              disabled={recordingStatus === 'processing'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
                <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.75 6.75 0 11-13.5 0v-1.5a.75.75 0 01.75-.75z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;