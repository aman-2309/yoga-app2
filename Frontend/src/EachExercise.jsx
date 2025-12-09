import React, { useState, useRef, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import exercises from "../yogaExercises.json";
import Camera from "./Camera";
import { listReferencePoses, getReferencePose } from "./services/reference";
import Header from "./Header";
import { useDarkMode } from "./DarkModeContext";

// SVG Icon Components
const CameraIcon = ({ size = 20, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

const CloseIcon = ({ size = 20, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// Instagram-style Typing Indicator Component
const TypingIndicator = ({ darkMode }) => {
  return (
    <div className="flex justify-start">
      <div
        className={`px-4 py-3 rounded-2xl flex items-center gap-1 ${
          darkMode
            ? "bg-white/10 backdrop-blur-xl border border-blue-500/30"
            : "bg-gray-200/80 backdrop-blur-xl"
        }`}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={`w-2 h-2 rounded-full ${
              darkMode ? "bg-blue-400" : "bg-gray-600"
            }`}
            animate={{
              y: [0, -8, 0],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
};

function Typing({
  text,
  speed = 15,
  onDone,
  showIcon = false,
  isTyping: globalTyping = false,
}) {
  const [visible, setVisible] = React.useState("");

  React.useEffect(() => {
    setVisible("");
    let index = 0;

    const interval = setInterval(() => {
      index++;

      // Always clamp value safely
      const nextText = text.substring(0, index);
      setVisible(nextText);

      if (nextText === text) {
        clearInterval(interval);
        if (onDone) onDone();
      }
    }, speed);

    return () => {
      clearInterval(interval);
    };
  }, [text]);

  return (
    <span className="whitespace-pre-line flex items-start gap-2">
      {showIcon && (
        <img
          src="/images/icon.svg"
          alt="veda"
          className={`w-10 h-10 mt-1 flex-shrink-0 transition-all duration-300 ${
            globalTyping ? "animate-pulse scale-110" : "scale-100"
          }`}
        />
      )}
      <span>{visible}</span>
    </span>
  );
}

export default function EachExercise() {
  const { darkMode } = useDarkMode();

  const [step, setStep] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [allTypingDone, setAllTypingDone] = useState(false);
  const [referenceImage, setReferenceImage] = useState(null);

  const { id } = useParams();
  const exercise = exercises.find((ex) => ex.id === parseInt(id));
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // chat modal
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMounted, setChatMounted] = useState(false);
  const chatEndRef = useRef(null);

  // camera modal
  const [isCamOpen, setIsCamOpen] = useState(false);
  const [camMounted, setCamMounted] = useState(false);
  const cameraRef = useRef(null);
  const shouldReopenCamera = useRef(false);
  const selectedExerciseIdRef = useRef(null); // Track which exercise was selected in camera

  const ANIM_DURATION = 100;

  // navigate back helper
  const goBack = () => {
    try {
      if (window.history.length > 1) navigate(-1);
      else navigate("/yoga", { replace: true });
    } catch {
      navigate("/yoga", { replace: true });
    }
  };

  // Close camera if clicked outside
  useEffect(() => {
    function handleOutsideClick(e) {
      if (isCamOpen) {
        const panel = document.getElementById("camera-panel");
        const cameraButton = e.target.closest("button");
        // Don't close if clicking the camera button itself
        if (
          cameraButton &&
          (cameraButton.textContent.includes("📷") ||
            cameraButton.textContent.includes("✕"))
        ) {
          return;
        }
        if (panel && !panel.contains(e.target)) {
          closeCameraModal();
        }
      }
      if (isChatOpen) {
        const chatPanel = document.getElementById("chat-panel");
        const chatBar = e.target.closest('input[placeholder*="Ask anything"]');
        // Don't close if clicking on the chat input bar
        if (chatBar) {
          return;
        }
        if (chatPanel && !chatPanel.contains(e.target)) {
          setIsChatOpen(false);
        }
      }
    }
    window.addEventListener("mousedown", handleOutsideClick);
    return () => window.removeEventListener("mousedown", handleOutsideClick);
  }, [isCamOpen, isChatOpen]);

  // chat mount/unmount
  useEffect(() => {
    if (isChatOpen) setChatMounted(true);
    else {
      const t = setTimeout(() => setChatMounted(false), ANIM_DURATION);
      return () => clearTimeout(t);
    }
  }, [isChatOpen]);

  // camera mount/unmount
  useEffect(() => {
    if (isCamOpen) setCamMounted(true);
    else {
      const t = setTimeout(() => setCamMounted(false), ANIM_DURATION);
      return () => clearTimeout(t);
    }
  }, [isCamOpen]);

  useEffect(() => {
    if (chatEndRef.current)
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Reopen camera after navigation if it was open
  useEffect(() => {
    if (shouldReopenCamera.current && exercise) {
      shouldReopenCamera.current = false;
      setTimeout(() => {
        openCameraModal();
      }, 300);
    }
  }, [id]); // Use id instead of exercise so it triggers on route change

  const openChat = () => {
    setChatMounted(true);
    setTimeout(() => setIsChatOpen(true), 20);
  };
  const openCameraModal = () => {
    setCamMounted(true);
    setTimeout(() => setIsCamOpen(true), 20);
  };
  const closeCameraModal = () => {
    // Stop camera first
    if (cameraRef.current?.stopCamera) {
      cameraRef.current.stopCamera();
    }
    // Then close modal with animation
    setIsCamOpen(false);
    setTimeout(() => {
      setCamMounted(false);
      // Navigate to selected exercise if it changed
      if (
        selectedExerciseIdRef.current &&
        selectedExerciseIdRef.current !== exercise.id
      ) {
        navigate(`/exercise/${selectedExerciseIdRef.current}`, {
          replace: true,
        });
        selectedExerciseIdRef.current = null;
      }
    }, ANIM_DURATION);
  };

  const handlePoseChangeInCamera = (exerciseId, exerciseName) => {
    console.log("Pose changed in camera to:", exerciseName, "ID:", exerciseId);
    selectedExerciseIdRef.current = exerciseId;
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages((prev) => [
      ...prev,
      { from: "user", text: userMsg, id: Date.now() },
    ]);
    setInput("");
    // Only open chat if it's not already open
    if (!isChatOpen && !chatMounted) {
      openChat();
    }

    // Show typing indicator after user message animation completes (500ms)
    setTimeout(() => {
      setIsTyping(true);
    }, 500);

    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: "That's great! Need tips for improvement?",
          id: Date.now() + 1,
        },
      ]);
    }, 1700);
  };

  // Reset on navigation
  useEffect(() => {
    setStep(0);
    setHasScrolled(false);
    setAllTypingDone(false);
    window.scrollTo(0, 0);

    // Load reference image with pose matching
    const loadReferenceImage = async () => {
      if (!exercise) return;

      try {
        // First get all available poses
        const posesResponse = await listReferencePoses();
        if (!posesResponse.success || !posesResponse.poses) {
          console.error("Failed to load poses list");
          return;
        }

        const poses = posesResponse.poses;
        let matchingPose = null;

        // First try using bName if available
        if (exercise.bName) {
          const bNameLower = exercise.bName.toLowerCase();
          matchingPose = poses.find((p) => {
            const poseId = (p.pose_id || "").toLowerCase();
            return poseId.startsWith(bNameLower);
          });
        }

        // Fallback to name-based matching if bName doesn't work
        if (!matchingPose) {
          const searchName = exercise.name.toLowerCase();

          matchingPose = poses.find((p) => {
            const poseName = (p.name || "").toLowerCase();
            const baseName = (p.base_pose_name || "").toLowerCase();
            const poseId = (p.pose_id || "").toLowerCase();

            // Remove common words and punctuation for better matching
            const cleanSearch = searchName
              .replace(/\s+or\s+/gi, " ")
              .replace(/[()]/g, "")
              .trim();
            const cleanPoseName = poseName
              .replace(/\s+or\s+/gi, " ")
              .replace(/[()]/g, "")
              .trim();

            return (
              cleanPoseName.includes(cleanSearch) ||
              cleanSearch.includes(cleanPoseName) ||
              baseName.includes(cleanSearch) ||
              poseId.includes(searchName.replace(/\s+/g, "_"))
            );
          });
        }

        if (matchingPose) {
          const response = await getReferencePose(matchingPose.pose_id);
          if (response.success && response.pose && response.pose.thumbnail) {
            setReferenceImage(response.pose.thumbnail);
          }
        } else {
          console.log(
            "No matching pose found for:",
            exercise.name,
            "(bName:",
            exercise.bName || "not set",
            ")"
          );
        }
      } catch (error) {
        console.error("Failed to load reference image:", error);
        setReferenceImage(null);
      }
    };

    loadReferenceImage();
  }, [id, exercise]);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setHasScrolled(true);
      }
    };

    // Check if page has enough content to scroll
    const checkScrollable = () => {
      const hasScrollableContent =
        document.documentElement.scrollHeight > window.innerHeight + 50;

      if (hasScrollableContent) {
        // If page is scrollable, wait for scroll
        // Check initial scroll position
        if (window.scrollY > 50) {
          setHasScrolled(true);
        }
      } else {
        // If page is not scrollable, start typing immediately
        setHasScrolled(true);
      }
    };

    // Small delay to ensure DOM is fully rendered
    setTimeout(checkScrollable, 100);

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [id]); // Only re-run when exercise ID changes

  // Check if exercise exists
  if (!exercise) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0D1931] via-[#0a1628] to-[#0D1931] text-white flex items-center justify-center">
        <div className="text-center animate-scaleUp">
          <h1 className="text-3xl font-bold text-red-400">
            Exercise Not Found
          </h1>
          <button
            onClick={() => navigate("/yoga")}
            className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-500/50"
          >
            Back to Yoga Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        darkMode
          ? "bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 text-white"
          : "bg-gradient-to-br from-white via-slate-50 to-white text-gray-900"
      } font-sans transition-all duration-500`}
    >
      {/* NAVBAR */}
      <Header />

      {/* CONTENT */}
      <div className="max-w-5xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6 pb-20 sm:pb-24">
        {/* IMAGE AND VIDEO SECTION */}
        <div className="flex flex-col md:flex-row gap-3 sm:gap-4 w-full mt-4 sm:mt-0">
          {/* IMAGE - 70% */}
          <div
            className={`relative w-full md:w-[50%] overflow-hidden rounded-xl sm:rounded-2xl backdrop-blur-xl border transition-all duration-300 h-[200px] sm:h-[250px] md:h-[300px] lg:h-[340px] flex items-center justify-center ${
              darkMode
                ? "bg-gradient-to-br from-[#1a2942]/60 to-[#1a2942]/40 border-blue-500/30 shadow-[0_1px_3px_rgba(255,255,255,0.05)] hover:shadow-[0_4px_10px_rgba(255,255,255,0.12)] hover:border-blue-500/50"
                : "bg-white/90 border-blue-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_10px_rgba(0,0,0,0.12)] hover:border-blue-400/70"
            }`}
          >
            {referenceImage ? (
              <>
                {/* Blurred background */}
                <img
                  src={referenceImage}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover blur-3xl scale-110 opacity-50"
                  aria-hidden="true"
                />
                {/* Main image */}
                <img
                  src={referenceImage}
                  alt={exercise.name}
                  className="relative w-full h-full object-contain z-10"
                />
              </>
            ) : (
              <div className="text-gray-400 text-sm">Loading image...</div>
            )}
          </div>

          {/* VIDEO - 30% */}
          <div
            className={`relative w-full md:w-[50%] overflow-hidden rounded-xl sm:rounded-2xl backdrop-blur-xl border transition-all duration-300 h-[200px] sm:h-[250px] md:h-[300px] lg:h-[340px] flex items-center justify-center mt-6 sm:mt-0 ${
              darkMode
                ? "bg-gradient-to-br from-[#1a2942]/60 to-[#1a2942]/40 border-blue-500/30 shadow-[0_1px_3px_rgba(255,255,255,0.05)] hover:shadow-[0_4px_10px_rgba(255,255,255,0.12)] hover:border-blue-500/50"
                : "bg-white/90 border-blue-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_10px_rgba(0,0,0,0.12)] hover:border-blue-400/70"
            }`}
          >
            <iframe
              key={exercise.id}
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${exercise.elink}?enablejsapi=1&origin=${window.location.origin}`}
              title={`${exercise.name} - Yoga Exercise Video`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        {/* NAME - No typing effect */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center py-2 mt-2 sm:mt-3 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent animate-fadeIn px-2">
          {exercise.name} ({exercise.hindi})
        </h1>

        {/* SHORT DESCRIPTION with BLINKING ICON - Only show after scroll */}
        {hasScrolled && (
          <div className="mt-4 sm:mt-6 flex items-start gap-3 sm:gap-4 px-2 sm:px-0">
            <img
              src="/images/icon2.png"
              alt="veda"
              className={`w-9 sm:w-10 md:w-11 mt-1 flex-shrink-0 transition-all duration-500 ${
                !allTypingDone
                  ? "animate-pulse brightness-150 drop-shadow-[0_0_15px_rgba(74,222,128,0.8)] scale-110"
                  : "brightness-100 scale-100"
              }`}
            />
            <p className="text-sm sm:text-base md:text-lg opacity-80 text-left flex-1">
              <Typing
                key={exercise.id + "-shrtdes"}
                text={exercise.short_description}
                speed={5}
                onDone={() => setStep((s) => s + 1)}
                showIcon={false}
                isTyping={!allTypingDone}
              />
            </p>
          </div>
        )}

        {/* BENEFITS - Only show after scroll */}
        {hasScrolled && step >= 1 && (
          <div className="mt-4 sm:mt-6 ml-8 sm:ml-10 md:ml-14 px-2 sm:px-0">
            <h2
              className={`text-xl sm:text-2xl font-semibold mb-2 transition-colors duration-300 ${
                darkMode
                  ? "text-blue-400 hover:text-blue-300"
                  : "text-blue-600 hover:text-blue-700"
              }`}
            >
              Benefits
            </h2>
            <div className="text-sm sm:text-base opacity-90">
              <Typing
                key={exercise.id + "-benifits"}
                text={exercise.benefits.map((s) => `• ${s}`).join("\n")}
                speed={5}
                onDone={() => setStep((s) => s + 1)}
              />
            </div>
          </div>
        )}

        {/* STEPS - Only show after scroll */}
        {hasScrolled && step >= 2 && (
          <div className="mt-4 sm:mt-6 ml-8 sm:ml-10 md:ml-14 px-2 sm:px-0">
            <h2
              className={`text-xl sm:text-2xl font-semibold mb-2 transition-colors duration-300 ${
                darkMode
                  ? "text-blue-400 hover:text-blue-300"
                  : "text-blue-600 hover:text-blue-700"
              }`}
            >
              Steps
            </h2>
            <div className="text-sm sm:text-base opacity-90">
              <Typing
                key={exercise.id + "-steps"}
                text={exercise.steps.map((s) => `→ ${s}`).join("\n")}
                speed={5}
                onDone={() => setStep((s) => s + 1)}
              />
            </div>
          </div>
        )}

        {/* MUSCLES - Only show after scroll */}
        {hasScrolled && step >= 3 && (
          <div className="mt-4 sm:mt-6 ml-8 sm:ml-10 md:ml-14 px-2 sm:px-0">
            <h2
              className={`text-xl sm:text-2xl font-semibold mb-2 transition-colors duration-300 ${
                darkMode
                  ? "text-blue-400 hover:text-blue-300"
                  : "text-blue-600 hover:text-blue-700"
              }`}
            >
              Muscles Targeted
            </h2>
            <div className="text-sm sm:text-base opacity-90">
              <Typing
                key={exercise.id + "-musc"}
                text={exercise.muscles_targeted.map((s) => `• ${s}`).join("\n")}
                speed={5}
                onDone={() => setStep((s) => s + 1)}
              />
            </div>
          </div>
        )}

        {/* BREATHING - Only show after scroll */}
        {hasScrolled && step >= 4 && (
          <div className="mt-4 sm:mt-6 ml-8 sm:ml-10 md:ml-14 px-2 sm:px-0">
            <h2
              className={`text-xl sm:text-2xl font-semibold mb-2 transition-colors duration-300 ${
                darkMode
                  ? "text-blue-400 hover:text-blue-300"
                  : "text-blue-600 hover:text-blue-700"
              }`}
            >
              Breathing
            </h2>
            <div className="text-sm sm:text-base opacity-90">
              <Typing
                key={exercise.id + "-breath"}
                text={exercise.breathing}
                speed={5}
                onDone={() => setStep((s) => s + 1)}
              />
            </div>
          </div>
        )}

        {/* DURATION - Only show after scroll */}
        {hasScrolled && step >= 5 && (
          <div className="mt-4 sm:mt-6 ml-8 sm:ml-10 md:ml-14 px-2 sm:px-0">
            <h2
              className={`text-lg sm:text-xl font-semibold mb-1 transition-colors duration-300 ${
                darkMode
                  ? "text-blue-400 hover:text-blue-300"
                  : "text-blue-600 hover:text-blue-700"
              }`}
            >
              Duration
            </h2>
            <div className="text-sm sm:text-base opacity-90">
              <Typing
                key={exercise.id + "-dur"}
                text={exercise.duration}
                speed={5}
                onDone={() => setStep((s) => s + 1)}
              />
            </div>
          </div>
        )}

        {/* DIFFICULTY - Only show after scroll */}
        {hasScrolled && step >= 6 && (
          <div className="mt-4 sm:mt-6 ml-8 sm:ml-10 md:ml-14 px-2 sm:px-0">
            <h2
              className={`text-lg sm:text-xl font-semibold mb-1 transition-colors duration-300 ${
                darkMode
                  ? "text-blue-400 hover:text-blue-300"
                  : "text-blue-600 hover:text-blue-700"
              }`}
            >
              Difficulty
            </h2>
            <div className="text-sm sm:text-base opacity-90">
              <Typing
                key={exercise.id + "-diff"}
                text={exercise.difficulty}
                speed={5}
                onDone={() => setStep((s) => s + 1)}
              />
            </div>
          </div>
        )}

        {/* COMMON MISTAKES - Only show after scroll */}
        {hasScrolled && step >= 7 && (
          <div className="mt-4 sm:mt-6 ml-8 sm:ml-10 md:ml-14 px-2 sm:px-0">
            <h2 className="text-xl sm:text-2xl font-semibold text-red-500 mb-2">
              Common Mistakes
            </h2>
            <div className="text-sm sm:text-base opacity-90 text-red-400">
              <Typing
                key={exercise.id + "-comm"}
                text={exercise.common_mistakes.map((s) => `• ${s}`).join("\n")}
                speed={5}
                onDone={() => setStep((s) => s + 1)}
              />
            </div>
          </div>
        )}

        {/* CONTRAINDICATIONS - Only show after scroll */}
        {hasScrolled && step >= 8 && (
          <div className="mt-4 sm:mt-6 ml-8 sm:ml-10 md:ml-14 px-2 sm:px-0">
            <h2 className="text-xl sm:text-2xl font-semibold text-red-500 mb-2">
              Contraindications
            </h2>
            <div className="text-sm sm:text-base opacity-90 text-red-400">
              <Typing
                key={exercise.id + "-cont"}
                text={exercise.contraindications
                  .map((s) => `• ${s}`)
                  .join("\n")}
                speed={5}
                onDone={() => {
                  setStep((s) => s + 1);
                  setAllTypingDone(true);
                }}
              />
            </div>
          </div>
        )}

        {/* EXTRA SPACE TO ENSURE SCROLLING */}
        <div className="h-[20vh] sm:h-[25vh] md:h-[30vh]"></div>
      </div>

      {/* Prev/Next with replace - hide when camera OR chat is open */}
      {!isCamOpen && !isChatOpen && (
        <div className="fixed top-[40%] sm:top-[45%] md:top-1/2 left-1 sm:left-2 md:left-4 -translate-y-1/2 z-[70]">
          <button
            disabled={exercise.id <= 1}
            onClick={() => {
              // Store camera state before navigation
              if (isCamOpen) {
                shouldReopenCamera.current = true;
              }
              navigate(`/exercise/${exercise.id - 1}`, { replace: true });
            }}
            className={`w-10 h-10 sm:w-12 sm:h-12 text-lg sm:text-2xl rounded-full flex items-center justify-center backdrop-blur-xl border transition-all duration-300 ${
              exercise.id <= 1
                ? "opacity-40 cursor-not-allowed bg-white/10 border-white/10"
                : darkMode
                ? "hover:scale-125 bg-blue-500/20 border-blue-500/40 hover:bg-blue-500/30 hover:border-blue-400 shadow-[0_4px_16px_rgba(255,255,255,0.15)] hover:shadow-[0_8px_24px_rgba(255,255,255,0.2)]"
                : "hover:scale-125 bg-white/90 border-blue-400/60 hover:bg-white hover:border-blue-500/80 shadow-[0_4px_16px_rgba(0,0,0,0.18)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.25)]"
            }`}
          >
            ⟨
          </button>
        </div>
      )}
      {!isCamOpen && !isChatOpen && (
        <div className="fixed top-[40%] sm:top-[45%] md:top-1/2 right-1 sm:right-2 md:right-4 -translate-y-1/2 z-[70]">
          <button
            disabled={exercise.id >= exercises.length}
            onClick={() => {
              // Store camera state before navigation
              if (isCamOpen) {
                shouldReopenCamera.current = true;
              }
              navigate(`/exercise/${exercise.id + 1}`, { replace: true });
            }}
            className={`w-10 h-10 sm:w-12 sm:h-12 text-lg sm:text-2xl rounded-full flex items-center justify-center backdrop-blur-xl border transition-all duration-300 ${
              exercise.id >= exercises.length
                ? "opacity-40 cursor-not-allowed bg-white/10 border-white/10"
                : darkMode
                ? "hover:scale-125 bg-blue-500/20 border-blue-500/40 hover:bg-blue-500/30 hover:border-blue-400 shadow-[0_4px_16px_rgba(255,255,255,0.15)] hover:shadow-[0_8px_24px_rgba(255,255,255,0.2)]"
                : "hover:scale-125 bg-white/90 border-blue-400/60 hover:bg-white hover:border-blue-500/80 shadow-[0_4px_16px_rgba(0,0,0,0.18)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.25)]"
            }`}
          >
            ⟩
          </button>
        </div>
      )}

      {/* Chat bar with Camera button - always visible, only hide when camera is open */}
      {!isCamOpen && (
        <div
          className="fixed bottom-1 sm:bottom-3 left-1/2 -translate-x-1/2 
    w-[calc(100vw-1rem)] sm:w-[calc(100vw-2rem)] md:w-[100vw] px-1 sm:px-2 md:px-0 max-w-3xl z-[10001]"
        >
          <div
            className={`backdrop-blur-2xl rounded-full p-2 sm:p-3 flex items-center gap-1.5 sm:gap-2 transition-all duration-300 border ${
              darkMode
                ? "bg-[#0D1931]/60 border-blue-500/30 hover:border-blue-500/50 shadow-[0_4px_16px_rgba(255,255,255,0.1)] hover:shadow-[0_6px_24px_rgba(255,255,255,0.15)]"
                : "bg-white/70 border-blue-300/50 hover:border-blue-400 shadow-[0_4px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.2)]"
            }`}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (isChatOpen) setIsChatOpen(false);
                if (isCamOpen) {
                  closeCameraModal();
                } else {
                  openCameraModal();
                }
              }}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center backdrop-blur-xl border shadow-lg transition-all duration-300 flex-shrink-0 hover:scale-110 ${
                isCamOpen
                  ? "bg-red-600 hover:bg-red-700 border-red-400"
                  : darkMode
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-blue-400 shadow-[0_2px_8px_rgba(255,255,255,0.15)]"
                  : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-blue-400 shadow-[0_2px_8px_rgba(0,0,0,0.15)]"
              }`}
            >
              {isCamOpen ? (
                <CloseIcon size={18} className="text-white" />
              ) : (
                <CameraIcon size={18} className="text-white" />
              )}
            </button>

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onClick={(e) => {
                // Prevent closing chat if it's already open
                if (isChatOpen) {
                  e.stopPropagation();
                  return;
                }
                // Close camera if open
                if (isCamOpen) setIsCamOpen(false);
                // Only open chat if it's completely closed
                if (!isChatOpen && !chatMounted) {
                  openChat();
                }
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask anything about this exercise…"
              className={`flex-grow px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm rounded-full bg-transparent focus:outline-none ${
                darkMode
                  ? "text-white placeholder-gray-400"
                  : "text-gray-900 placeholder-gray-500"
              }`}
            />

            <button
              onClick={handleSend}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex-shrink-0 text-xs sm:text-sm hover:scale-105 shadow-lg ${
                darkMode
                  ? "shadow-[0_4px_16px_rgba(255,255,255,0.3)]"
                  : "shadow-[0_4px_16px_rgba(0,0,0,0.3)]"
              }`}
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* Blurred strip below chat bar - hide when camera is open */}
      {!isCamOpen && (
        <div className="fixed bottom-0 left-0 right-0 h-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-3xl bg-black/15 z-[59]" />
      )}

      {/* Chat Modal */}
      {chatMounted && (
        <div className="fixed inset-0 z-[9999] flex justify-center pointer-events-auto animate-fadeIn">
          <div
            className="absolute inset-0 backdrop-blur-md bg-black/60"
            onClick={() => setIsChatOpen(false)}
          />
          <div
            id="chat-panel"
            className={`pointer-events-auto fixed z-[10000] left-1/2 w-[calc(100vw-1rem)] sm:w-[calc(100vw-2rem)] md:w-[100vw] max-w-3xl flex flex-col backdrop-blur-2xl rounded-2xl sm:rounded-3xl overflow-hidden border ${
              darkMode
                ? "bg-gradient-to-br from-[#1a2942]/80 to-[#0D1931]/80 border-blue-500/30 shadow-[0_12px_48px_rgba(255,255,255,0.15)]"
                : "bg-gradient-to-br from-white/85 to-blue-50/85 border-blue-300/50 shadow-[0_12px_48px_rgba(0,0,0,0.2)]"
            }`}
            style={{
              top: "0rem", // navbar height
              bottom: "4rem", // aligned with chat bar top edge
              transform: isChatOpen
                ? "translate(-50%, 0)"
                : "translate(-50%, 120vh)",
              transition: `transform ${ANIM_DURATION}ms cubic-bezier(.2,.9,.2,1), opacity ${ANIM_DURATION}ms ease`,
              opacity: isChatOpen ? 1 : 0,
            }}
          >
            <div
              className={`relative p-3 sm:p-4 text-center ${
                darkMode
                  ? "border-b border-blue-500/20 text-white"
                  : "border-b border-blue-300/30 text-gray-900"
              }`}
            >
              <button
                onClick={() => setIsChatOpen(false)}
                className="absolute right-3 top-3 sm:right-4 sm:top-4 w-8 h-8 sm:w-9 sm:h-9 text-lg sm:text-xl bg-red-600 hover:bg-red-700 text-white rounded-full transition-all duration-300 hover:scale-125 hover:rotate-90 shadow-lg"
              >
                ✕
              </button>
              <h2 className="text-base sm:text-lg font-semibold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Chat about {exercise.name}
              </h2>
            </div>

            <div className="flex-1 p-3 sm:p-4 space-y-2 sm:space-y-3 overflow-y-auto">
              <AnimatePresence mode="popLayout">
                {messages.map((msg, i) => (
                  <motion.div
                    key={msg.id || i}
                    initial={{
                      opacity: 0,
                      y: 15,
                      x: msg.from === "user" ? 20 : -20,
                      scale: 0.95,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      x: 0,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.9,
                      transition: { duration: 0.2 },
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                      delay: i * 0.08,
                    }}
                    className={`flex ${
                      msg.from === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl max-w-[85%] sm:max-w-[75%] text-xs sm:text-sm ${
                        msg.from === "user"
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                          : darkMode
                          ? "bg-white/10 backdrop-blur-xl text-white border border-blue-500/30 shadow-md"
                          : "bg-gray-200/90 backdrop-blur-xl text-gray-900 shadow-md"
                      }`}
                    >
                      {msg.text}
                    </motion.div>
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TypingIndicator darkMode={darkMode} />
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={chatEndRef} />
            </div>
          </div>
        </div>
      )}

      {/* Camera Modal */}
      {camMounted && (
        <div className="fixed inset-0 z-50 flex justify-center pointer-events-none animate-fadeIn">
          <div className="absolute inset-0 backdrop-blur-md bg-black/60" />
          <div
            id="camera-panel"
            className="pointer-events-auto fixed z-[10000] left-1/2 top-0 w-[100vw] max-w-[1100px] h-screen bg-gradient-to-br from-[#1a2942]/95 to-[#0D1931]/95 backdrop-blur-2xl shadow-2xl border-0 sm:border border-blue-500/30 overflow-hidden flex flex-col"
            style={{
              transform: isCamOpen
                ? "translate(-50%, 0)"
                : "translate(-50%, 110vh)",
              transition: `transform ${ANIM_DURATION}ms cubic-bezier(.2,.9,.2,1), opacity ${ANIM_DURATION}ms ease`,
              opacity: isCamOpen ? 1 : 0,
            }}
          >
            <div className="flex-1 overflow-y-auto p-1 sm:p-2">
              <Camera
                ref={cameraRef}
                open={isCamOpen}
                selectedPoseId={exercise.bName}
                onPoseChange={handlePoseChangeInCamera}
                onClose={closeCameraModal}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
