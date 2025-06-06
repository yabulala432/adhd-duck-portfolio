"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface Position {
  x: number;
  y: number;
}

interface DuckState {
  position: Position;
  targetPosition: Position;
  direction: "left" | "right";
  state: "running" | "bored" | "yawning" | "sleeping";
  isJumping: boolean;
  headRotation: number;
  eyeDirection: Position;
}

export default function ADHDDuck() {
  const [duckState, setDuckState] = useState<DuckState>({
    position: { x: 100, y: 400 },
    targetPosition: { x: 100, y: 400 },
    direction: "right",
    state: "running",
    isJumping: false,
    headRotation: 0,
    eyeDirection: { x: 0, y: 0 },
  });

  const [windowSize, setWindowSize] = useState({
    width: 800,
    height: 600,
  });

  const [cursorPosition, setCursorPosition] = useState<Position>({
    x: 0,
    y: 0,
  });
  // Set actual window size and duck position after mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      setDuckState((prev) => ({
        ...prev,
        position: { x: 100, y: window.innerHeight - 100 },
        targetPosition: { x: 100, y: window.innerHeight - 100 },
      }));
    }
  }, []);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [blinkState, setBlinkState] = useState(false);
  const [jumpHeight, setJumpHeight] = useState(0);
  const [showBubble, setShowBubble] = useState<string | null>(null);
  const [mouthSize, setMouthSize] = useState({ width: 6, height: 3 });
  const [debugMode] = useState(false);

  const animationRef = useRef<number | undefined>(undefined);
  const inactivityTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const blinkTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Calculate edge zones
  const getEdgeZones = useCallback(() => {
    const { width, height } = windowSize;
    return {
      leftZone: width * 0.25,
      rightZone: width * 0.75,
      topZone: height * 0.25,
      bottomZone: height * 0.75,
    };
  }, [windowSize]);

  // Check if cursor is in edge zone
  const isInEdgeZone = useCallback(
    (cursor: Position) => {
      const { leftZone, rightZone, topZone, bottomZone } = getEdgeZones();
      return (
        cursor.x < leftZone ||
        cursor.x > rightZone ||
        cursor.y < topZone ||
        cursor.y > bottomZone
      );
    },
    [getEdgeZones]
  );

  // Calculate target position based on cursor
  const calculateTargetPosition = useCallback(
    (cursor: Position) => {
      const { leftZone, rightZone, topZone, bottomZone } = getEdgeZones();
      const { width, height } = windowSize;

      let targetX = duckState.position.x;
      let targetY = duckState.position.y;

      // Determine which edge zone cursor is in
      const inLeft = cursor.x < leftZone;
      const inRight = cursor.x > rightZone;
      const inTop = cursor.y < topZone;
      const inBottom = cursor.y > bottomZone;

      // Prioritize horizontal edges for corners
      if (inLeft || inRight) {
        targetX = inLeft ? 50 : width - 50;
        targetY = Math.max(50, Math.min(height - 50, cursor.y));
      } else if (inTop || inBottom) {
        targetY = inBottom ? height - 50 : 50;
        targetX = Math.max(50, Math.min(width - 50, cursor.x));
      }

      return { x: targetX, y: targetY };
    },
    [duckState.position, getEdgeZones, windowSize]
  );

  // Update cursor position and activity
  const handleMouseMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      setCursorPosition({ x: clientX, y: clientY });
      setLastActivity(Date.now());

      if (isInEdgeZone({ x: clientX, y: clientY })) {
        setDuckState((prev) => ({
          ...prev,
          state: "running",
          targetPosition: calculateTargetPosition({ x: clientX, y: clientY }),
        }));
      }
    },
    [isInEdgeZone, calculateTargetPosition]
  );

  // Handle click/tap for jump
  const handleClick = useCallback(() => {
    setLastActivity(Date.now());
    setDuckState((prev) => ({
      ...prev,
      isJumping: true,
      state: "running",
    }));

    // Show a random message when clicked
    const messages = [
      "Quack!",
      "Hello!",
      "Hi there!",
      "Waddle waddle!",
      "Got bread?",
    ];
    setShowBubble(messages[Math.floor(Math.random() * messages.length)]);

    // Hide the bubble after 2 seconds
    setTimeout(() => {
      setShowBubble(null);
    }, 2000);

    // Jump animation
    let jumpProgress = 0;
    const jumpDuration = 600;
    const startTime = Date.now();

    const animateJump = () => {
      const elapsed = Date.now() - startTime;
      jumpProgress = Math.min(elapsed / jumpDuration, 1);

      // Sine curve for smooth jump arc
      const jumpValue = Math.sin(jumpProgress * Math.PI) * 40;
      setJumpHeight(jumpValue);

      if (jumpProgress < 1) {
        requestAnimationFrame(animateJump);
      } else {
        setJumpHeight(0);
        setDuckState((prev) => ({ ...prev, isJumping: false }));
      }
    };

    requestAnimationFrame(animateJump);
  }, []);

  // Animation loop
  const animate = useCallback(() => {
    setDuckState((prev) => {
      const dx = prev.targetPosition.x - prev.position.x;
      const dy = prev.targetPosition.y - prev.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 5 && prev.state === "running") {
        const speed = 3;
        const moveX = (dx / distance) * speed;
        const moveY = (dy / distance) * speed;

        // Update direction based on movement
        const newDirection =
          moveX > 0 ? "right" : moveX < 0 ? "left" : prev.direction;

        // Calculate head rotation and eye direction
        const headRotation =
          Math.atan2(
            cursorPosition.y - prev.position.y,
            cursorPosition.x - prev.position.x
          ) *
          (180 / Math.PI);
        const clampedRotation = Math.max(-15, Math.min(15, headRotation * 0.1));
        const eyeDx = cursorPosition.x - prev.position.x;
        const eyeDy = cursorPosition.y - prev.position.y;
        const eyeDist = Math.sqrt(eyeDx * eyeDx + eyeDy * eyeDy);
        const maxEyeMove = 2; // max px offset for the pupil
        let eyeDir = { x: 0, y: 0 };
        if (eyeDist > 0) {
          eyeDir = {
            x: (eyeDx / eyeDist) * maxEyeMove,
            y: (eyeDy / eyeDist) * maxEyeMove,
          };
        }

        return {
          ...prev,
          position: {
            x: prev.position.x + moveX,
            y: prev.position.y + moveY,
          },
          direction: newDirection,
          headRotation: clampedRotation,
          eyeDirection: eyeDir,
        };
      }

      return prev;
    });

    animationRef.current = requestAnimationFrame(animate);
  }, [cursorPosition]);

  // Inactivity timer
  useEffect(() => {
    const checkInactivity = () => {
      const now = Date.now();
      const timeSinceActivity = now - lastActivity;

      if (timeSinceActivity > 5000 && duckState.state === "running") {
        setDuckState((prev) => ({ ...prev, state: "bored" }));

        setTimeout(() => {
          setDuckState((prev) => {
            if (prev.state === "bored") {
              // Start yawning - animate mouth size
              const yawnAnimation = () => {
                setMouthSize((prev) => {
                  if (prev.height < 15) {
                    return {
                      width: prev.width + 0.5,
                      height: prev.height + 0.8,
                    };
                  }
                  return prev;
                });
              };

              const yawnInterval = setInterval(yawnAnimation, 50);

              setTimeout(() => {
                clearInterval(yawnInterval);
                // Reset mouth size after yawn
                setMouthSize({ width: 6, height: 3 });

                // Move to sleeping state
                setDuckState((prev) =>
                  prev.state === "yawning"
                    ? { ...prev, state: "sleeping" }
                    : prev
                );
              }, 1000);

              return { ...prev, state: "yawning" };
            }
            return prev;
          });
        }, 2000);
      }
    };

    inactivityTimerRef.current = setInterval(checkInactivity, 1000);
    return () => {
      if (inactivityTimerRef.current) {
        clearInterval(inactivityTimerRef.current);
      }
    };
  }, [lastActivity, duckState.state]);

  // Blinking effect
  useEffect(() => {
    const startBlinking = () => {
      // Random blink interval between 2-6 seconds
      const blinkInterval = 2000 + Math.random() * 4000;

      blinkTimerRef.current = setTimeout(() => {
        setBlinkState(true);

        // Blink duration ~150ms
        setTimeout(() => {
          setBlinkState(false);
          startBlinking();
        }, 150);
      }, blinkInterval);
    };

    startBlinking();

    return () => {
      if (blinkTimerRef.current) {
        clearTimeout(blinkTimerRef.current);
      }
    };
  }, []);

  // Event listeners
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleMouseMove);
    window.addEventListener("click", handleClick);
    window.addEventListener("touchstart", handleClick);
    window.addEventListener("resize", handleResize);

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleMouseMove);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("touchstart", handleClick);
      window.removeEventListener("resize", handleResize);

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [handleMouseMove, handleClick, animate]);

  const isYawning = duckState.state === "yawning";

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <style jsx>{`
        @keyframes running {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes legMove {
          0%,
          100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(-20deg);
          }
          75% {
            transform: rotate(20deg);
          }
        }

        @keyframes headScan {
          0%,
          100% {
            transform: rotate(-10deg);
          }
          50% {
            transform: rotate(10deg);
          }
        }

        @keyframes sleep {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        @keyframes zzz {
          0% {
            opacity: 0;
            transform: translateY(0px) scale(0.5);
          }
          50% {
            opacity: 1;
            transform: translateY(-20px) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-40px) scale(1.2);
          }
        }

        .duck-container {
          transition: transform 0.1s ease-out;
        }

        .running .duck-body {
          animation: running 0.3s infinite;
        }

        .bored .duck-head {
          animation: headScan 2s infinite;
        }

        .sleeping {
          animation: sleep 2s infinite;
        }

        .zzz {
          animation: zzz 2s infinite;
        }
      `}</style>

      <div
        className={`duck-container absolute cursor-pointer ${duckState.state}`}
        style={{
          left: `${duckState.position.x}px`,
          top: `${duckState.position.y - jumpHeight}px`,
          transform: `rotate(${duckState.headRotation}deg)`,
          transformOrigin: "center center",
          transition: "transform 0.3s ease-out",
        }}
        onClick={handleClick}
      >
        {/* Duck Body */}
        <div className="duck-body relative">
          {/* Main body */}
          <div className="w-16 h-12 bg-yellow-400 rounded-full relative">
            {/* Bedhead feathers */}
            <div className="absolute -top-2 left-2 w-3 h-3 bg-yellow-500 rounded-full transform rotate-12"></div>
            <div className="absolute -top-1 left-5 w-2 h-2 bg-yellow-500 rounded-full transform -rotate-12"></div>
            <div className="absolute -top-2 left-8 w-3 h-3 bg-yellow-500 rounded-full transform rotate-45"></div>

            {/* Eyes with improved tracking */}
            <div
              className="absolute top-2 left-3 w-4 h-4 bg-white rounded-full overflow-hidden"
              style={{
                transform: isYawning ? "translateY(-1px)" : "",
              }}
            >
              <div
                className="bg-black rounded-full transition-all duration-100"
                style={{
                  transform:
                    duckState.state !== "sleeping" && !blinkState
                      ? `translate(${duckState.eyeDirection.x * 1.3}px, ${
                          duckState.eyeDirection.y * 1.3
                        }px)`
                      : "",
                  width:
                    duckState.state === "sleeping" || blinkState
                      ? "6px"
                      : "10px",
                  height:
                    duckState.state === "sleeping" || blinkState
                      ? "3px"
                      : "10px",
                  marginTop:
                    duckState.state === "sleeping" || blinkState
                      ? "6px"
                      : "4px",
                  marginLeft: "4px",
                }}
              ></div>
            </div>
            <div
              className="absolute top-2 left-8 w-4 h-4 bg-white rounded-full overflow-hidden"
              style={{
                transform: isYawning ? "translateY(-1px)" : "",
              }}
            >
              <div
                className="bg-black rounded-full transition-all duration-100"
                style={{
                  // rounded eye if duck is awake
                  borderRadius:
                    duckState.state !== "sleeping" && !blinkState
                      ? "50%"
                      : "0%",

                  transform:
                    duckState.state !== "sleeping" && !blinkState
                      ? `translate(${duckState.eyeDirection.x * 1.3}px, ${
                          duckState.eyeDirection.y * 1.3
                        }px)`
                      : "",
                  width:
                    duckState.state === "sleeping" || blinkState
                      ? "6px"
                      : "10px",
                  height:
                    duckState.state === "sleeping" || blinkState
                      ? "3px"
                      : "10px",
                  marginTop:
                    duckState.state === "sleeping" || blinkState
                      ? "6px"
                      : "4px",
                  marginLeft: "4px",
                }}
              ></div>
            </div>

            {/* Mouth/Beak */}
            <div
              className="absolute transition-all duration-200"
              style={{
                bottom: `calc(20% - ${mouthSize.height / 2}px)`,
                left: `calc(50% - ${mouthSize.width / 2}px)`,
                width: `${mouthSize.width}px`,
                height: `${mouthSize.height}px`,
                borderRadius: "50%",
                backgroundColor: "black",
                boxShadow:
                  isYawning && mouthSize.height > 8
                    ? "inset 0 -4px 4px rgba(0,0,0,0.2)"
                    : "none",
              }}
            >
              {/* Tongue visible during big yawn */}
              {isYawning && mouthSize.height > 10 && (
                <div
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-red-400 rounded-b-full"
                  style={{
                    width: `${mouthSize.width * 0.6}px`,
                    height: `${mouthSize.height * 0.4}px`,
                  }}
                ></div>
              )}
            </div>

            {/* Graduation cap */}
            <div
              className="absolute -top-3 left-4 w-8 h-1 bg-black rounded"
              style={{
                transform: `rotate(${12 + (isYawning ? 5 : 0)}deg)`,
              }}
            >
              <div className="absolute -top-1 left-2 w-4 h-4 bg-black"></div>
              <div className="absolute -top-1 right-0 w-2 h-2 bg-yellow-300 rounded-full"></div>
            </div>
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
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white rounded-lg px-3 py-1 border-2 border-gray-300 text-sm font-bold whitespace-nowrap">
            {showBubble}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
          </div>
        )}

        {/* Debug mode indicator */}
        {debugMode && (
          <div className="absolute -top-6 -left-2 text-xs bg-red-500 text-white px-1 rounded">
            DEBUG
          </div>
        )}

        {/* Jump shadow */}
        {jumpHeight > 0 && (
          <div
            className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-black rounded-full opacity-30"
            style={{
              width: `${60 - jumpHeight}px`,
              height: `${20 - jumpHeight / 3}px`,
            }}
          ></div>
        )}

        {/* Sleep Zzz bubbles */}
        {duckState.state === "sleeping" && (
          <div className="absolute -top-8 left-8">
            <div
              className="zzz text-blue-400 text-xs font-bold"
              style={{ animationDelay: "0s" }}
            >
              Z
            </div>
            <div
              className="zzz text-blue-400 text-sm font-bold absolute left-2"
              style={{ animationDelay: "0.5s" }}
            >
              z
            </div>
            <div
              className="zzz text-blue-400 text-xs font-bold absolute left-4"
              style={{ animationDelay: "1s" }}
            >
              z
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
