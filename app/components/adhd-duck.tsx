"use client";

import type React from "react";

import { useState, useEffect, useRef, useCallback } from "react";

interface ADHDDuckProps {
  soundEnabled: boolean;
  mode: "normal" | "debug" | "army";
  heroRef: React.RefObject<HTMLElement>;
  projectsRef: React.RefObject<HTMLElement>;
  contactRef: React.RefObject<HTMLElement>;
}

export default function ADHDDuck({
  soundEnabled,
  mode,
  heroRef,
  projectsRef,
  contactRef,
}: ADHDDuckProps) {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const [state, setState] = useState<
    | "normal"
    | "chasing"
    | "bored"
    | "excited"
    | "dizzy"
    | "sleeping"
    | "yawning"
    | "jumping"
  >("normal");
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [animation, setAnimation] = useState("");
  const [showBubble, setShowBubble] = useState("");
  const [lastInteraction, setLastInteraction] = useState(Date.now());
  const [isZooming, setIsZooming] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 });
  const [mouthOpen, setMouthOpen] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  const [jumpHeight, setJumpHeight] = useState(0);
  const [blinkState, setBlinkState] = useState(false);
  const [headTilt, setHeadTilt] = useState(0);
  const [excitement, setExcitement] = useState(0);

  const duckRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const animationFrame = useRef<number>();
  const yawnTimeout = useRef<NodeJS.Timeout>();
  const blinkInterval = useRef<NodeJS.Timeout>();

  // Random blinking
  useEffect(() => {
    blinkInterval.current = setInterval(() => {
      if (state !== "sleeping" && Math.random() > 0.7) {
        setBlinkState(true);
        setTimeout(() => setBlinkState(false), 150);
      }
    }, 3000);

    return () => {
      if (blinkInterval.current) clearInterval(blinkInterval.current);
    };
  }, [state]);

  // Eye tracking
  useEffect(() => {
    const updateEyePosition = () => {
      if (duckRef.current && state !== "sleeping") {
        const duckRect = duckRef.current.getBoundingClientRect();
        const duckCenterX = duckRect.left + duckRect.width / 2;
        const duckCenterY = duckRect.top + duckRect.height / 2;

        const deltaX = mousePos.current.x - duckCenterX;
        const deltaY = mousePos.current.y - duckCenterY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        // Limit eye movement within the eye socket
        const maxEyeMovement = 3;
        const eyeX = Math.max(
          -maxEyeMovement,
          Math.min(maxEyeMovement, (deltaX / distance) * maxEyeMovement || 0)
        );
        const eyeY = Math.max(
          -maxEyeMovement,
          Math.min(maxEyeMovement, (deltaY / distance) * maxEyeMovement || 0)
        );

        setEyePosition({ x: eyeX, y: eyeY });

        // Head tilt based on cursor position
        const tilt = Math.max(-15, Math.min(15, deltaX / 20));
        setHeadTilt(tilt);
      }
    };

    const interval = setInterval(updateEyePosition, 50);
    return () => clearInterval(interval);
  }, [state]);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      setLastInteraction(Date.now());

      if (state === "sleeping" || state === "bored" || state === "yawning") {
        setState("normal");
        setShowBubble("");
        if (yawnTimeout.current) clearTimeout(yawnTimeout.current);
      }

      // Increase excitement based on mouse speed
      const speed = Math.sqrt(
        e.movementX * e.movementX + e.movementY * e.movementY
      );
      setExcitement((prev) => Math.min(100, prev + speed * 0.1));
    };

    const handleClick = (e: MouseEvent) => {
      setLastInteraction(Date.now());

      // Check if click is on duck
      if (duckRef.current) {
        const rect = duckRef.current.getBoundingClientRect();
        const isOnDuck =
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom;

        if (isOnDuck) {
          handleDuckClick();
        } else if (Math.random() > 0.5) {
          triggerBackflip();
        }
      }
    };

    const handleScroll = () => {
      setLastInteraction(Date.now());
      if (Math.random() > 0.7) {
        setState("dizzy");
        setAnimation("spin");
        setTimeout(() => {
          setState("normal");
          setAnimation("");
        }, 2000);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [state]);

  // Excitement decay
  useEffect(() => {
    const interval = setInterval(() => {
      setExcitement((prev) => Math.max(0, prev - 1));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Duck AI behavior
  const updateDuckPosition = useCallback(() => {
    if (isZooming || isJumping) return;

    const now = Date.now();
    const timeSinceInteraction = now - lastInteraction;

    // Boredom and sleep states
    if (
      timeSinceInteraction > 8000 &&
      state !== "yawning" &&
      state !== "sleeping"
    ) {
      setState("yawning");
      setAnimation("yawn");
      setShowBubble("*yawn*");

      yawnTimeout.current = setTimeout(() => {
        setState("bored");
        setShowBubble("HELLO?!");
        setAnimation("");
      }, 3000);
    } else if (
      timeSinceInteraction > 15000 &&
      state !== "sleeping" &&
      state !== "yawning"
    ) {
      // else if (timeSinceInteraction > 15000 && state !== "sleeping") {
      setState("sleeping");
      setShowBubble("Zzz...");
      setAnimation("");
    }

    // Cursor chasing logic
    const dx = mousePos.current.x - position.x;
    const dy = mousePos.current.y - position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 50 && state === "normal") {
      setState("chasing");

      // Update direction based on movement
      if (dx > 0) setDirection("right");
      else setDirection("left");

      // Apply momentum with overshoot
      const force = Math.min(distance / 100, 3);
      setVelocity((prev) => ({
        x: prev.x + (dx / distance) * force,
        y: prev.y + (dy / distance) * force,
      }));
    }

    // Apply physics
    setPosition((prev) => ({
      x: Math.max(0, Math.min(window.innerWidth - 80, prev.x + velocity.x)),
      y: Math.max(0, Math.min(window.innerHeight - 80, prev.y + velocity.y)),
    }));

    // Apply friction
    setVelocity((prev) => ({
      x: prev.x * 0.9,
      y: prev.y * 0.9,
    }));

    // Random behaviors based on excitement
    if (excitement > 50 && Math.random() > 0.995) {
      triggerRandomJump();
    } else if (Math.random() > 0.998 && !isZooming) {
      triggerZoomies();
    }

    animationFrame.current = requestAnimationFrame(updateDuckPosition);
  }, [
    position,
    velocity,
    state,
    lastInteraction,
    isZooming,
    isJumping,
    excitement,
  ]);

  useEffect(() => {
    animationFrame.current = requestAnimationFrame(updateDuckPosition);
    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [updateDuckPosition]);

  const triggerRandomJump = () => {
    if (isJumping) return;

    setIsJumping(true);
    setAnimation("jump");

    // Jump animation
    let jumpProgress = 0;
    const jumpAnimation = () => {
      jumpProgress += 0.1;
      const height = Math.sin(jumpProgress * Math.PI) * 30;
      setJumpHeight(height);

      if (jumpProgress < 1) {
        requestAnimationFrame(jumpAnimation);
      } else {
        setIsJumping(false);
        setJumpHeight(0);
        setAnimation("");
      }
    };

    requestAnimationFrame(jumpAnimation);
  };

  const triggerZoomies = () => {
    setIsZooming(true);
    setState("excited");
    setAnimation("zoom");

    // Random corner destination
    const corners = [
      { x: 50, y: 50 },
      { x: window.innerWidth - 100, y: 50 },
      { x: 50, y: window.innerHeight - 100 },
      { x: window.innerWidth - 100, y: window.innerHeight - 100 },
    ];

    const target = corners[Math.floor(Math.random() * corners.length)];
    setPosition(target);

    setTimeout(() => {
      setIsZooming(false);
      setState("normal");
      setAnimation("");
      setShowBubble("*wheeze*");
      setTimeout(() => setShowBubble(""), 2000);
    }, 1500);
  };

  const triggerBackflip = () => {
    setAnimation("backflip");

    // 50% chance to fail
    if (Math.random() > 0.5) {
      setTimeout(() => {
        setAnimation("crash");
        setShowBubble("Ouch!");
        setTimeout(() => {
          setAnimation("");
          setShowBubble("");
        }, 1500);
      }, 500);
    } else {
      setTimeout(() => {
        setAnimation("");
        setShowBubble("Ta-da!");
        setTimeout(() => setShowBubble(""), 1500);
      }, 800);
    }
  };

  const handleDuckClick = () => {
    setLastInteraction(Date.now());

    // Open mouth and jump when clicked
    setMouthOpen(true);
    setShowBubble("QUACK!");
    triggerRandomJump();

    // Add some excitement
    setExcitement((prev) => Math.min(100, prev + 20));

    setTimeout(() => {
      setMouthOpen(false);
      setShowBubble("");
    }, 1000);

    // Toggle debug mode
    if (mode === "normal") {
      setDebugMode(!debugMode);
      setTimeout(() => {
        setShowBubble(debugMode ? "Debug OFF" : "Debug ON!");
        setTimeout(() => setShowBubble(""), 2000);
      }, 1200);
    }
  };

  return (
    <>
      {/* Duck */}
      <div
        ref={duckRef}
        className={`fixed z-30 cursor-pointer transition-all duration-300 ${
          animation === "zoom" ? "transition-all duration-1000" : ""
        } ${excitement > 70 ? "animate-wiggle" : ""}`}
        style={{
          left: position.x,
          top: position.y - jumpHeight,
          transform: `
            scaleX(${direction === "left" ? -1 : 1})
            rotate(${headTilt}deg)
            ${animation === "spin" ? "rotate(720deg)" : ""}
            ${animation === "backflip" ? "rotateY(360deg)" : ""}
            ${animation === "crash" ? "rotate(45deg)" : ""}
            ${animation === "jump" ? `scale(${1 + jumpHeight / 100})` : ""}
          `,
          transformOrigin: "center bottom",
        }}
        onClick={(e) => {
          e.stopPropagation();
          handleDuckClick();
        }}
      >
        {/* Duck Body */}
        <div className="relative">
          {/* Main body */}
          <div className="w-16 h-12 bg-yellow-400 rounded-full relative">
            {/* Bedhead feathers */}
            <div className="absolute -top-2 left-2 w-3 h-3 bg-yellow-500 rounded-full transform rotate-12"></div>
            <div className="absolute -top-1 left-5 w-2 h-2 bg-yellow-500 rounded-full transform -rotate-12"></div>
            <div className="absolute -top-2 left-8 w-3 h-3 bg-yellow-500 rounded-full transform rotate-45"></div>

            {/* Eyes with tracking */}
            <div className="absolute top-2 left-3 w-4 h-4 bg-white rounded-full overflow-hidden">
              <div
                className={`w-2 h-2 bg-black rounded-full transition-all duration-200 ${
                  state === "sleeping" || blinkState ? "w-4 h-1" : ""
                }`}
                style={{
                  transform:
                    state !== "sleeping" && !blinkState
                      ? `translate(${eyePosition.x}px, ${eyePosition.y}px)`
                      : "none",
                  marginTop: state === "sleeping" || blinkState ? "6px" : "4px",
                  marginLeft: "4px",
                }}
              ></div>
            </div>
            <div className="absolute top-2 left-8 w-4 h-4 bg-white rounded-full overflow-hidden">
              <div
                className={`w-2 h-2 bg-black rounded-full transition-all duration-200 ${
                  state === "sleeping" || blinkState ? "w-4 h-1" : ""
                }`}
                style={{
                  transform:
                    state !== "sleeping" && !blinkState
                      ? `translate(${eyePosition.x}px, ${eyePosition.y}px)`
                      : "none",
                  marginTop: state === "sleeping" || blinkState ? "6px" : "4px",
                  marginLeft: "4px",
                }}
              ></div>
            </div>

            {/* Beak/Mouth */}
            <div
              className={`absolute top-4 left-6 bg-orange-400 rounded-sm transition-all duration-200 ${
                mouthOpen ? "w-4 h-3 rounded-full" : "w-3 h-2"
              } ${animation === "yawn" ? "w-5 h-4 rounded-full" : ""}`}
            ></div>

            {/* Graduation cap */}
            <div className="absolute -top-3 left-4 w-8 h-1 bg-black rounded transform rotate-12">
              <div className="absolute -top-1 left-2 w-4 h-4 bg-black"></div>
              <div className="absolute -top-1 right-0 w-2 h-2 bg-yellow-300 rounded-full"></div>
            </div>

            {/* Excitement indicator */}
            {excitement > 30 && (
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                {[...Array(Math.floor(excitement / 20))].map((_, i) => (
                  <span
                    key={i}
                    className="text-yellow-500 animate-bounce"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    ⭐
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Sneakers */}
          <div className="absolute -bottom-2 -left-2 w-6 h-4 bg-white rounded-lg border-2 border-gray-300">
            {/* Untied laces */}
            <div className="absolute -top-1 left-1 w-4 h-1 bg-gray-600 transform rotate-12"></div>
            <div className="absolute -top-1 left-2 w-3 h-1 bg-gray-600 transform -rotate-12"></div>
          </div>
          <div className="absolute -bottom-2 -right-2 w-6 h-4 bg-white rounded-lg border-2 border-gray-300">
            <div className="absolute -top-1 left-1 w-4 h-1 bg-gray-600 transform rotate-12"></div>
            <div className="absolute -top-1 left-2 w-3 h-1 bg-gray-600 transform -rotate-12"></div>
          </div>
        </div>

        {/* Speech bubble */}
        {showBubble && (
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white rounded-lg px-3 py-1 border-2 border-gray-300 text-sm font-bold whitespace-nowrap animate-bounce-in">
            {showBubble}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
          </div>
        )}

        {/* Debug mode indicator */}
        {debugMode && (
          <div className="absolute -top-6 -left-2 text-xs bg-red-500 text-white px-1 rounded animate-pulse">
            DEBUG
          </div>
        )}

        {/* Jump shadow */}
        {isJumping && (
          <div
            className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-black rounded-full opacity-30"
            style={{
              width: `${60 - jumpHeight}px`,
              height: `${20 - jumpHeight / 3}px`,
            }}
          ></div>
        )}
      </div>

      {/* Whoosh trails for zoomies */}
      {animation === "zoom" && (
        <div className="fixed inset-0 pointer-events-none z-20">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute w-8 h-2 bg-yellow-300 rounded-full opacity-50 animate-pulse"
              style={{
                left: position.x - i * 20,
                top: position.y + 20,
                animationDelay: `${i * 0.1}s`,
              }}
            ></div>
          ))}
        </div>
      )}

      {/* Excitement particles */}
      {excitement > 80 && (
        <div className="fixed inset-0 pointer-events-none z-25">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute text-2xl animate-bounce"
              style={{
                left: position.x + Math.random() * 40 - 20,
                top: position.y + Math.random() * 40 - 20,
                animationDelay: `${i * 0.3}s`,
              }}
            >
              💫
            </div>
          ))}
        </div>
      )}
    </>
  );
}
