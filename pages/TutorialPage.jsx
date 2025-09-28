import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";

const BG_IMAGE = "/Background.jpeg";
const LOGO_IMAGE = "/bicycle-icon.svg"; // Placeholder logo

const storySteps = [
  {
    speaker: "Companion Duck",
    dialogue: "🦆 Welcome, brave volunteer! Ready for an adventure with Ageless Bicyclists?",
  },
  {
    speaker: "You",
    dialogue: "Uh... I think so? What will I be doing here?",
  },
  {
    speaker: "Companion Duck",
    dialogue: "You'll help organize, cheer, and support riders! But first, let's get you familiar with your quest.",
  },
  {
    speaker: "Companion Duck",
    dialogue: "We have a few key roles: Check-in, Route Support, and Cheer Squad. Each is vital to our success!",
  },
  {
    speaker: "Companion Duck",
    dialogue: "We have a couple of event types: Arts & Crafts Fairs, and our big one, the Expedition Ride that happens around Singapore.",
  },
  {
    speaker: "Narrator",
    dialogue:
      "You arrive early, set up the check-in desk, greet fellow volunteers, and get a cool badge.",
  },
  {
    speaker: "Narrator",
    dialogue:
      "You may even stand a chance to win attractive prizes if you are the top few!",
  },
  {
    speaker: "Companion Duck",
    dialogue:
      "During the ride, you'll cheer at checkpoints, hand out water, and make sure everyone feels welcomed.",
  },
  {
    speaker: "You",
    dialogue: "Sounds fun! Any tips for first-timers?",
  },
  {
    speaker: "Companion Duck",
    dialogue:
      "Stay positive, ask questions, and remember: You’re part of a team. Ready to start your journey?",
  },
  {
    speaker: "Companion Duck",
    dialogue:
      "The more you volunteer, the more badges you unlock! Every month if you're within the leaderboard , you'll stand to win attractive prizes!",
  },
  {
    speaker: "Narrator",
    dialogue: "Good luck, hero! Click 'Finish' as we process your application to begin your adventure on the real platform.",
  },
];

export default function Tutorial() {
  const [step, setStep] = useState(0);
  const duckRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Animate the duck icon linearly back and forth
    const anim = gsap.to(duckRef.current, {
      x: 40,
      duration: 1.2,
      yoyo: true,
      repeat: -1,
      ease: "power1.inOut",
    });
    return () => anim.kill();
  }, []);

  useEffect(() => {
    // Fade in dialogue when step changes
    gsap.fromTo(
      ".story-dialogue",
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power1.out" }
    );
  }, [step]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 font-sans">
      {/* Centered RPG dialogue block */}
      <div
        className="relative w-[500px] h-[620px] border-[3px] border-black rounded-xl overflow-hidden shadow-lg bg-black/10 flex flex-col"
        style={{
          background: `url(${BG_IMAGE}) center/cover no-repeat`,
        }}
      >
        {/* Status bar top */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 pt-6 z-10 w-auto flex flex-col items-center">
          <div className="text-white font-bold text-lg drop-shadow bg-black/40 px-6 py-2 rounded-lg">
            DAY 0 | {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
        </div>
        {/* Company Logo stays top right */}
        <div className="absolute top-0 right-0 px-6 pt-6 z-10">
          <img
            src={LOGO_IMAGE}
            alt="Ageless Bicyclists Logo"
            className="w-8 h-8 bg-white rounded-lg p-1 border border-gray-300"
          />
        </div>
        {/* Back Button */}
        <button
          onClick={() => navigate("/home")}
          className="absolute top-0 left-0 m-4 px-3 py-1 bg-primary-500 text-white font-semibold rounded shadow hover:bg-primary-700 transition z-30"
        >
          ← Back
        </button>
        {/* Dialogue Box - Centered Vertically */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full px-6 flex flex-col items-center z-20">
          <div className="story-dialogue bg-white/90 border-b-4 border-primary-500 rounded-xl shadow-lg px-5 py-4 max-w-lg w-full font-mono text-lg text-gray-800 text-center">
            <span className="font-bold text-primary-700">{storySteps[step].speaker}:</span>
            <br />
            {storySteps[step].dialogue}
          </div>
          <div className="flex gap-4 mt-4 justify-center">
            <button
              disabled={step === 0}
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              className="px-4 py-2 bg-secondary-200 text-secondary-800 rounded hover:bg-secondary-300 transition disabled:opacity-50 border border-secondary-400"
            >
              Previous
            </button>
            <button
              onClick={() => {
                if (step === storySteps.length - 1) {
                  navigate("/home");
                } else {
                  setStep((s) => Math.min(storySteps.length - 1, s + 1));
                }
              }}
              className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-700 transition border border-primary-700"
            >
              {step === storySteps.length - 1 ? "Finish" : "Next"}
            </button>
          </div>
        </div>
        {/* Duck Companion (not moved, stays at bottom) */}
        <div className="absolute left-1/2 bottom-20 transform -translate-x-1/2 flex flex-col items-center z-10">
          <img
            ref={duckRef}
            src="/companion-icon.png"
            alt="Companion Duck"
            className="w-36 h-36 mx-auto block"
            style={{ imageRendering: "pixelated" }}
          />
        </div>
      </div>
      {/* Status notice below the RPG block */}
      <div className="mt-8 text-sm text-gray-500 max-w-md text-center shadow rounded-lg bg-white px-6 py-3">
        You can exit at any time, but we recommend following the whole tutorial for the best experience!
      </div>
    </div>
  );
}