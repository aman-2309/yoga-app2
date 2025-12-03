import React, { useState, useRef, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import exercises from "../yogaExercises.json";
import Camera from "./Camera";
import { listReferencePoses, getReferencePose } from "./services/reference";

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
  const [step, setStep] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [allTypingDone, setAllTypingDone] = useState(false);
  const [referenceImage, setReferenceImage] = useState(null);

  const { id } = useParams();
  const exercise = exercises.find((ex) => ex.id === parseInt(id));
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

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

  const ANIM_DURATION = 150;
  const [darkMode, setDarkMode] = useState(true);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) document.documentElement.classList.remove("dark");
    else document.documentElement.classList.add("dark");
  };

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
    setMessages((prev) => [...prev, { from: "user", text: userMsg }]);
    setInput("");
    // Only open chat if it's not already open
    if (!isChatOpen && !chatMounted) {
      openChat();
    }
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "That's great! Need tips for improvement?" },
      ]);
    }, 800);
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
      <div className="min-h-screen bg-[#0D1117] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-400">
            Exercise Not Found
          </h1>
          <button
            onClick={() => navigate("/yoga")}
            className="mt-4 px-6 py-3 bg-green-600 rounded-xl hover:bg-green-700 transition"
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
        darkMode ? "bg-[#0D1117] text-white" : "bg-white text-gray-900"
      } font-sans`}
    >
      {/* NAVBAR */}
      <header className="w-full backdrop-blur-xl bg-[#0d1117]/80 border-b border-white/10 shadow-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-2">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/images/icon2.png"
              className="h-12 object-cover"
              alt="veda logo"
            />
            <span className="text-lg font-bold tracking-tight">veda</span>
          </Link>
          <nav className="flex items-center gap-3 text-base font-medium">
            <button
              onClick={toggleDarkMode}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 border border-white/20 text-gray-300 hover:bg-white/20 transition shadow-md text-sm"
            >
              {darkMode ? "🌙" : "☀️"}
            </button>
            <Link to="/" className="hover:text-green-400 transition">
              Home
            </Link>
            <Link to="/chat" className="hover:text-green-400 transition">
              Chat
            </Link>
            <Link to="/yoga" className="hover:text-green-400 transition">
              Yoga
            </Link>
            <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
              <i className="fas fa-user text-gray-300 text-sm"></i>
            </div>
          </nav>
        </div>
      </header>

      {/* CONTENT */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-2 pb-10 ">
        {/* IMAGE AND VIDEO SECTION */}
        <div className="flex gap-4 w-full">
          {/* IMAGE - 70% */}
          <div
            className="relative w-[50%] overflow-hidden rounded-3xl 
    bg-white/10 backdrop-blur-lg border border-white/10 shadow-xl
    h-[248px] sm:h-[311px] md:h-[350px] lg:h-[340px] flex items-center justify-center"
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
            className="relative w-[50%] overflow-hidden rounded-3xl 
    bg-white/10 backdrop-blur-lg border border-white/10 shadow-xl
    h-[248px] sm:h-[311px] md:h-[350px] lg:h-[340px] flex items-center justify-center"
          >
            <iframe
              width="656"
              height="369"
              src={`https://www.youtube.com/embed/${exercise.elink}`}
              title="Halasana for Beginners | How To Do Plow Yoga Pose | Step-by-Step guide"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerpolicy="strict-origin-when-cross-origin"
              allowfullscreen
            ></iframe>
          </div>
        </div>

        {/* NAME - No typing effect */}
        <h1 className="text-4xl font-bold text-center text-green-400 mt-5">
          {exercise.name} ( {exercise.hindi} )
        </h1>

        {/* SHORT DESCRIPTION with BLINKING ICON - Only show after scroll */}
        {hasScrolled && (
          <div className="mt-6 flex items-start gap-4">
            <img
              src="/images/icon2.png"
              alt="veda"
              className={`w-11  mt-1 flex-shrink-0 transition-all duration-500 ${
                !allTypingDone
                  ? "animate-pulse brightness-150 drop-shadow-[0_0_15px_rgba(74,222,128,0.8)] scale-110"
                  : "brightness-100 scale-100"
              }`}
            />
            <p className="text-lg opacity-80 text-left flex-1">
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
          <div className="mt-6 ml-14">
            <h2 className="text-2xl font-semibold text-green-400 mb-2">
              Benefits
            </h2>
            <div className="text-base opacity-90">
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
          <div className="mt-6 ml-14">
            <h2 className="text-2xl font-semibold text-green-400 mb-2">
              Steps
            </h2>
            <div className="text-base opacity-90">
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
          <div className="mt-6 ml-14">
            <h2 className="text-2xl font-semibold text-green-400 mb-2">
              Muscles Targeted
            </h2>
            <div className="text-base opacity-90">
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
          <div className="mt-6 ml-14">
            <h2 className="text-2xl font-semibold text-green-400 mb-2">
              Breathing
            </h2>
            <div className="text-base opacity-90">
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
          <div className="mt-6 ml-14">
            <h2 className="text-xl font-semibold text-green-400 mb-1">
              Duration
            </h2>
            <div className="text-base opacity-90">
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
          <div className="mt-6 ml-14">
            <h2 className="text-xl font-semibold text-green-400 mb-1">
              Difficulty
            </h2>
            <div className="text-base opacity-90">
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
          <div className="mt-6 ml-14">
            <h2 className="text-2xl font-semibold text-red-400 mb-2">
              Common Mistakes
            </h2>
            <div className="text-base opacity-90 text-red-300">
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
          <div className="mt-6 ml-14">
            <h2 className="text-2xl font-semibold text-red-400 mb-2">
              Contraindications
            </h2>
            <div className="text-base opacity-90 text-red-300">
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
        <div className="h-[30vh]"></div>
      </div>

      {/* Prev/Next with replace - hide when camera OR chat is open */}
      {!isCamOpen && !isChatOpen && (
        <div className="fixed top-[45%] sm:top-1/2 left-2 sm:left-4 -translate-y-1/2 z-[70]">
          <button
            disabled={exercise.id <= 1}
            onClick={() => {
              // Store camera state before navigation
              if (isCamOpen) {
                shouldReopenCamera.current = true;
              }
              navigate(`/exercise/${exercise.id - 1}`, { replace: true });
            }}
            className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-xl border shadow-lg transition ${
              exercise.id <= 1
                ? "opacity-40 cursor-not-allowed bg-white/10 border-white/10"
                : "hover:scale-110 bg-white/20 border-white/30"
            }`}
          >
            <span className="text-2xl">⟨</span>
          </button>
        </div>
      )}
      {!isCamOpen && !isChatOpen && (
        <div className="fixed top-[45%] sm:top-1/2 right-2 sm:right-4 -translate-y-1/2 z-[70]">
          <button
            disabled={exercise.id >= exercises.length}
            onClick={() => {
              // Store camera state before navigation
              if (isCamOpen) {
                shouldReopenCamera.current = true;
              }
              navigate(`/exercise/${exercise.id + 1}`, { replace: true });
            }}
            className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-xl border shadow-lg transition ${
              exercise.id >= exercises.length
                ? "opacity-40 cursor-not-allowed bg-white/10 border-white/10"
                : "hover:scale-110 bg-white/20 border-white/30"
            }`}
          >
            <span className="text-2xl">⟩</span>
          </button>
        </div>
      )}

      {/* Chat bar with Camera button - always visible, only hide when camera is open */}
      {!isCamOpen && (
        <div
          className="fixed bottom-1 sm:bottom-3 left-1/2 -translate-x-1/2 
    w-[100vw] px-2 sm:px-0 max-w-3xl z-[10001]"
        >
          <div className="bg-white/10 backdrop-blur-xl shadow-xl rounded-full border border-white/20 p-3 flex items-center gap-2">
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
              className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-xl border shadow-lg transition flex-shrink-0 text-sm ${
                isCamOpen
                  ? "bg-red-600 hover:bg-red-700 border-red-400"
                  : "bg-green-600 hover:bg-green-700 border-green-400"
              }`}
            >
              {isCamOpen ? "✕" : "📷"}
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
              className="flex-grow px-3 py-2 rounded-full bg-transparent text-white focus:outline-none placeholder-gray-400 text-sm"
            />

            <button
              onClick={handleSend}
              className="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition flex-shrink-0 text-sm"
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* Blurred strip below chat bar - hide when camera is open */}
      {!isCamOpen && (
        <div className="fixed bottom-0 left-0 right-0 h-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-2xl bg-black/40 z-[59]" />
      )}

      {/* Chat Modal */}
      {chatMounted && (
        <div className="fixed inset-0 z-[9999] flex justify-center pointer-events-auto">
          <div
            className="absolute inset-0 backdrop-blur-sm bg-black/60"
            onClick={() => setIsChatOpen(false)}
          />
          <div
            id="chat-panel"
            className="pointer-events-auto fixed z-[10000] left-1/2 w-[100vw] max-w-3xl flex flex-col bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden"
            style={{
              top: "0rem", // navbar height
              bottom: "4.5rem", // aligned with chat bar top edge
              transform: isChatOpen
                ? "translate(-50%, 0)"
                : "translate(-50%, 120vh)",
              transition: `transform ${ANIM_DURATION}ms cubic-bezier(.2,.9,.2,1), opacity ${ANIM_DURATION}ms ease`,
              opacity: isChatOpen ? 1 : 0,
            }}
          >
            <div className="relative p-4 border-b border-white/10 text-center text-white">
              <button
                onClick={() => setIsChatOpen(false)}
                className="absolute right-4 top-4 w-9 h-9 bg-red-600 hover:bg-red-700 text-white rounded-full transition"
              >
                ✕
              </button>
              <h2 className="text-lg font-semibold">
                Chat about {exercise.name}
              </h2>
            </div>

            <div className="flex-1 p-4 space-y-3 overflow-y-auto">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.from === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-4 py-2 rounded-2xl max-w-[75%] text-sm ${
                      msg.from === "user"
                        ? "bg-green-600 text-white"
                        : "bg-white/30 backdrop-blur-xl text-white border border-white/20"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
          </div>
        </div>
      )}

      {/* Camera Modal */}
      {camMounted && (
        <div className="fixed inset-0 z-50 flex justify-center pointer-events-none">
          <div className="absolute inset-0 backdrop-blur-sm bg-black/30" />
          <div
            id="camera-panel"
            className="pointer-events-auto fixed z-[10000] left-1/2 top-0 w-[100vw] max-w-[1100px] h-screen bg-white/10 backdrop-blur-2xl shadow-2xl border border-white/10 overflow-hidden flex flex-col"
            style={{
              transform: isCamOpen
                ? "translate(-50%, 0)"
                : "translate(-50%, 110vh)",
              transition: `transform ${ANIM_DURATION}ms cubic-bezier(.2,.9,.2,1), opacity ${ANIM_DURATION}ms ease`,
              opacity: isCamOpen ? 1 : 0,
            }}
          >
            <div className="flex-1 overflow-y-auto p-2">
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
