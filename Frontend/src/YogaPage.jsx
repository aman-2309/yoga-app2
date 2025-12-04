import React, { useMemo, useState, useEffect } from "react";
import { Link, NavLink, useSearchParams } from "react-router-dom";
import exercises from "../yogaExercises.json";
import { motion, AnimatePresence } from "framer-motion";
import { listReferencePoses, getReferencePose } from "./services/reference";
import Header from "./Header";
import { useDarkMode } from "./DarkModeContext";

export default function Page() {
  const { darkMode } = useDarkMode();

  // state
  const [direction, setDirection] = useState(1);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [showDifficultyMenu, setShowDifficultyMenu] = useState(false);
  const [aiFilterEnabled, setAiFilterEnabled] = useState(false);
  const [showAiFilterModal, setShowAiFilterModal] = useState(false);
  const [userAge, setUserAge] = useState("");
  const [selectedHealthIssues, setSelectedHealthIssues] = useState([]);
  const perPage = 12;
  const [referenceImages, setReferenceImages] = useState({});

  const [loaded, setLoaded] = useState(false); // first-load animation
  const [searchParams, setSearchParams] = useSearchParams();

  // initialize query & page from URL
  useEffect(() => {
    const q = searchParams.get("q");
    const p = parseInt(searchParams.get("page") || "1", 10) - 1;
    if (q !== null) setQuery(q);
    if (!Number.isNaN(p)) setPage(Math.max(0, p));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  // small mount delay to allow initial entrance animations
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 20);
    return () => clearTimeout(t);
  }, []);

  // Close difficulty menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        showDifficultyMenu &&
        !e.target.closest(".difficulty-filter-container")
      ) {
        setShowDifficultyMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDifficultyMenu]);

  // Load reference images for all exercises
  useEffect(() => {
    const loadReferenceImages = async () => {
      try {
        // First get all available poses
        const posesResponse = await listReferencePoses();
        if (!posesResponse.success || !posesResponse.poses) {
          console.error("Failed to load poses list");
          return;
        }

        const poses = posesResponse.poses;
        const imageMap = {};

        for (const exercise of exercises) {
          try {
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
              if (
                response.success &&
                response.pose &&
                response.pose.thumbnail
              ) {
                imageMap[exercise.id] = response.pose.thumbnail;
              }
            } else {
              console.log(
                `No matching pose found for: ${exercise.name} (bName: ${
                  exercise.bName || "not set"
                })`
              );
            }
          } catch (error) {
            console.error(
              `Failed to load reference image for ${exercise.name}:`,
              error
            );
          }
        }

        setReferenceImages(imageMap);
      } catch (error) {
        console.error("Failed to load reference images:", error);
      }
    };

    loadReferenceImages();
  }, []);

  // filtered items
  const filtered = useMemo(() => {
    const q = (query || "").trim().toLowerCase();
    let result = exercises;

    // Filter by search query
    if (q) {
      result = result.filter((e) => (e.name || "").toLowerCase().includes(q));
    }

    // Filter by difficulty (single selection)
    if (selectedDifficulty) {
      result = result.filter((e) => e.difficulty === selectedDifficulty);
    }

    // AI Filter: age and health conditions
    if (aiFilterEnabled && userAge && selectedHealthIssues.length > 0) {
      result = result.filter((e) => {
        // Parse age group (e.g., "12-60")
        const ageRange = (e.ageGroup || "").split("-");
        if (ageRange.length === 2) {
          const minAge = parseInt(ageRange[0]);
          const maxAge = parseInt(ageRange[1]);
          const age = parseInt(userAge);
          if (age < minAge || age > maxAge) return false;
        }

        // Check contraindications
        const exerciseContraindications = e.contraindicationCategories || [];
        const hasConflict = selectedHealthIssues.some((issue) =>
          exerciseContraindications.includes(issue)
        );
        return !hasConflict;
      });
    }

    return result;
  }, [
    query,
    selectedDifficulty,
    aiFilterEnabled,
    userAge,
    selectedHealthIssues,
  ]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageItems = filtered.slice(page * perPage, page * perPage + perPage);

  // keep URL in sync when page changes
  useEffect(() => {
    const params = {};
    if (query) params.q = query;
    params.page = String(page + 1);
    setSearchParams(params, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, query]);

  // navigation helpers (update direction and page)
  const next = () => {
    if (page >= totalPages - 1) return;
    setDirection(1);
    setPage((p) => Math.min(p + 1, totalPages - 1));
  };

  const prev = () => {
    if (page <= 0) return;
    setDirection(-1);
    setPage((p) => Math.max(p - 1, 0));
  };

  const onSearchChange = (e) => {
    const v = e.target.value;
    setQuery(v);
    setPage(0);
  };

  const toggleDifficulty = (difficulty) => {
    setSelectedDifficulty((prev) => (prev === difficulty ? "" : difficulty));
    setPage(0);
    setShowDifficultyMenu(false);
  };

  const handleAiFilterToggle = () => {
    if (!aiFilterEnabled) {
      setShowAiFilterModal(true);
    } else {
      setAiFilterEnabled(false);
      setUserAge("");
      setSelectedHealthIssues([]);
      setPage(0);
    }
  };

  const handleAiFilterApply = () => {
    if (userAge && selectedHealthIssues.length > 0) {
      setAiFilterEnabled(true);
      setShowAiFilterModal(false);
      setPage(0);
    }
  };

  const toggleHealthIssue = (issue) => {
    setSelectedHealthIssues((prev) => {
      if (prev.includes(issue)) {
        return prev.filter((i) => i !== issue);
      } else {
        return [...prev, issue];
      }
    });
  };

  const goToPage = (newPage) => {
    setDirection(newPage > page ? 1 : -1);
    setPage(Math.max(0, Math.min(newPage, totalPages - 1)));
  };

  // framer motion variants
  const pageVariants = {
    enter: (dir) => ({ opacity: 0, x: dir === 1 ? 80 : -80 }),
    center: { opacity: 1, x: 0 },
    exit: (dir) => ({ opacity: 0, x: dir === 1 ? -80 : 80 }),
  };

  const gridVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.06, delayChildren: loaded ? 0 : 0.1 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 18, scale: 0.99 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.1, ease: "easeOut" },
    },
    exit: { opacity: 0, y: 8, transition: { duration: 0.1 } },
  };

  // helper to compute card shadow/green glow
  const glowStyle = (dark) =>
    dark
      ? { boxShadow: "0 30px 60px rgba(0,160,96,0.09)" }
      : { boxShadow: "0 30px 60px rgba(16,185,129,0.06)" };

  return (
    <div
      className={`${
        darkMode
          ? "bg-gradient-to-br from-[#0D1931] via-[#0a1628] to-[#0D1931] text-white"
          : "bg-gradient-to-br from-white via-slate-50 to-white text-gray-900"
      } min-h-screen font-sans transition-all duration-500 overflow-x-hidden`}
    >
      <div className="min-h-screen overflow-x-hidden">
        {/* NAVBAR */}
        <Header />

        {/* MAIN */}
        <div className="max-w-7xl mx-auto px-0 py-6">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 animate-fadeIn">
            Yoga{" "}
            <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              Exercises
            </span>
          </h1>

          <div className="flex justify-center mb-10 gap-4 items-center flex-wrap px-10">
            <input
              type="search"
              placeholder="Search exercises..."
              value={query}
              onChange={onSearchChange}
              className={`flex-1 min-w-[250px] md:min-w-[350px] px-5 py-3 rounded-xl ${
                darkMode
                  ? "bg-[#1a2942]/60 border-blue-500/30 text-gray-200 placeholder-gray-500"
                  : "bg-white border-gray-200 text-gray-800 placeholder-gray-500"
              } backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500/50 transition-all duration-300 shadow-lg hover:shadow-blue-500/20 hover:shadow-2xl`}
            />

            {/* AI Filter Button */}
            <button
              onClick={handleAiFilterToggle}
              className={`px-4 py-2.5 rounded-xl cursor-pointer flex items-center gap-3 transition-all duration-300 ${
                darkMode
                  ? "bg-[#1a2942]/60 hover:bg-[#1a2942] border border-blue-500/20 hover:border-blue-500/40"
                  : "bg-gray-100 hover:bg-gray-200"
              } backdrop-blur-xl shadow-lg hover:shadow-blue-500/20 hover:shadow-xl hover:scale-105 focus:outline-none`}
            >
              {/* Toggle Switch */}
              <div
                className={`relative w-11 h-6 rounded-full transition-all duration-300 ${
                  aiFilterEnabled
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg shadow-blue-500/50"
                    : "bg-gray-600"
                }`}
              >
                <div
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-all duration-300 shadow-md ${
                    aiFilterEnabled
                      ? "translate-x-5 scale-110"
                      : "translate-x-0"
                  }`}
                />
              </div>
              <span
                className={`text-sm ${
                  darkMode ? "text-gray-300" : "text-gray-800"
                }`}
              >
                AI Filter
              </span>
            </button>

            <div className="relative difficulty-filter-container">
              <button
                onClick={() => setShowDifficultyMenu(!showDifficultyMenu)}
                className={`px-5 py-3 rounded-xl cursor-pointer flex items-center gap-2 ${
                  darkMode
                    ? "bg-[#1a2942]/60 border border-blue-500/30 text-gray-200"
                    : "bg-white border border-gray-200 text-gray-800"
                } backdrop-blur-xl hover:border-blue-500/60 hover:shadow-blue-500/20 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 shadow-lg hover:scale-105`}
              >
                <span>{selectedDifficulty || "All Levels"}</span>
                <svg
                  className={`w-4 h-4 transition-transform ${
                    showDifficultyMenu ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {showDifficultyMenu && (
                <div
                  className={`absolute top-full mt-2 right-0 w-full rounded-xl shadow-2xl border z-50 animate-slideDown ${
                    darkMode
                      ? "bg-[#1a2942]/95 backdrop-blur-xl border-blue-500/30"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <div className="p-3 space-y-2">
                    {["Beginner", "Intermediate", "Advanced"].map(
                      (difficulty) => (
                        <label
                          key={difficulty}
                          className="flex items-center gap-2 cursor-pointer hover:bg-green-500/10 p-2 rounded transition"
                        >
                          <input
                            type="radio"
                            name="difficulty"
                            checked={selectedDifficulty === difficulty}
                            onChange={() => toggleDifficulty(difficulty)}
                            className="w-4 h-4 border-gray-600 text-green-500 focus:ring-green-500"
                          />
                          <span className="text-sm">{difficulty}</span>
                        </label>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Animated cards with page sliding */}
          <div className="relative ml-10 mr-10">
            {/* Previous Button - Left Side */}
            <button
              onClick={() => {
                setDirection(-1);
                prev();
              }}
              disabled={page === 0}
              className={`fixed left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-xl border shadow-lg transition-all duration-300 z-40 ${
                page === 0
                  ? "opacity-40 cursor-not-allowed bg-white/10 border-white/10"
                  : darkMode
                  ? "hover:scale-125 hover:shadow-blue-500/30 hover:shadow-2xl bg-blue-500/20 border-blue-500/40 hover:bg-blue-500/30 hover:border-blue-400"
                  : "hover:scale-125 bg-gray-200 border-gray-300"
              }`}
            >
              <span className="text-2xl">⟨</span>
            </button>

            {/* Next Button - Right Side */}
            <button
              onClick={() => {
                setDirection(1);
                next();
              }}
              disabled={page >= totalPages - 1}
              className={`fixed right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-xl border shadow-lg transition-all duration-300 z-40 ${
                page >= totalPages - 1
                  ? "opacity-40 cursor-not-allowed bg-white/10 border-white/10"
                  : darkMode
                  ? "hover:scale-125 hover:shadow-blue-500/30 hover:shadow-2xl bg-blue-500/20 border-blue-500/40 hover:bg-blue-500/30 hover:border-blue-400"
                  : "hover:scale-125 bg-gray-200 border-gray-300"
              }`}
            >
              <span className="text-2xl">⟩</span>
            </button>

            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={page}
                custom={direction}
                variants={pageVariants}
                initial={loaded ? "enter" : "center"}
                animate="center"
                exit="exit"
                transition={{ duration: 0.1, ease: "easeInOut" }}
              >
                <motion.div
                  variants={gridVariants}
                  initial={loaded ? false : "hidden"}
                  animate="visible"
                  className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                >
                  {pageItems.map((ex) => (
                    <motion.article
                      key={ex.id}
                      variants={cardVariants}
                      whileHover={{ y: -8, scale: 1.03 }}
                      className={`rounded-2xl p-5 ${
                        darkMode
                          ? "bg-gradient-to-br from-[#1a2942]/80 to-[#1a2942]/60 border-blue-500/30"
                          : "bg-white border-gray-100"
                      } backdrop-blur-xl border shadow-xl hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:border-blue-500/50`}
                    >
                      <Link to={`/exercise/${ex.id}`}>
                        <div className="w-full h-40 rounded-xl overflow-hidden mb-3 flex items-center justify-center relative">
                          {referenceImages[ex.id] ? (
                            <>
                              {/* Blurred background */}
                              <img
                                src={referenceImages[ex.id]}
                                alt=""
                                className="absolute inset-0 w-full h-full object-cover blur-3xl scale-110 opacity-50"
                                aria-hidden="true"
                              />
                              {/* Main image */}
                              <img
                                src={referenceImages[ex.id]}
                                alt={ex.name}
                                className="relative w-full h-full object-contain z-10"
                              />
                            </>
                          ) : (
                            <div className="text-gray-400 text-xs">
                              Loading...
                            </div>
                          )}
                        </div>

                        <h3 className="text-xl font-semibold text-blue-300 text-center mb-1 wrap-break-words whitespace-normal leading-tight hover:text-blue-200 transition-colors duration-300">
                          {ex.name || "Untitled"}
                        </h3>
                        <h3 className="text-xl font-semibold text-blue-400 text-center mb-1 wrap-break-words whitespace-normal leading-tight hover:text-blue-300 transition-colors duration-300">
                          ({ex.hindi || "Untitled"})
                        </h3>
                      </Link>

                      <p className="text-gray-400 text-sm text-center">
                        {ex.short_description ||
                          "Short description not available."}
                      </p>
                    </motion.article>
                  ))}
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Google-style Pagination */}
          <div className="flex justify-center items-center mt-12 gap-3">
            {/* Previous Button */}
            <button
              onClick={() => {
                setDirection(-1);
                prev();
              }}
              disabled={page === 0}
              className={`px-4 py-2 text-sm font-medium transition-all duration-300 ${
                page === 0
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:text-blue-400 hover:scale-105"
              } ${darkMode ? "text-gray-300" : "text-gray-700"}`}
            >
              <span className="text-lg mr-1">‹</span> Previous
            </button>

            {/* Logo with Page Numbers */}
            <div className="flex items-center">
              <div className="text-2xl font-bold tracking-tight flex items-center">
                <span className="text-blue-400">Y</span>
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => goToPage(idx)}
                    className={`transition-all duration-300 ${
                      idx === page
                        ? "text-blue-400 scale-125"
                        : darkMode
                        ? "text-gray-600 hover:text-blue-300 hover:scale-110"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    o
                  </button>
                ))}
                <span className={darkMode ? "text-gray-300" : "text-gray-700"}>
                  ga
                </span>
              </div>
            </div>

            {/* Next Button */}
            <button
              onClick={() => {
                setDirection(1);
                next();
              }}
              disabled={page >= totalPages - 1}
              className={`px-4 py-2 text-sm font-medium transition-all duration-300 ${
                page >= totalPages - 1
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:text-blue-400 hover:scale-105"
              } ${darkMode ? "text-gray-300" : "text-gray-700"}`}
            >
              Next <span className="text-lg ml-1">›</span>
            </button>
          </div>

          {/* Page Number Indicator */}
          <div className="flex justify-center mt-4">
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToPage(idx)}
                  className={`text-sm font-medium transition-all duration-300 ${
                    idx === page
                      ? "text-blue-400 scale-125 font-bold"
                      : darkMode
                      ? "text-gray-400 hover:text-blue-300 hover:scale-110"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* AI Filter Modal */}
        {showAiFilterModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-fadeIn">
            <div
              className={`relative max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-3xl p-8 ${
                darkMode
                  ? "bg-gradient-to-br from-[#1a2942]/95 to-[#0D1931]/95 backdrop-blur-2xl border border-blue-500/30"
                  : "bg-white"
              } shadow-2xl animate-scaleUp
              [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]`}
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <button
                onClick={() => setShowAiFilterModal(false)}
                className="absolute top-4 right-4 text-2xl hover:text-blue-400 transition-all duration-300 hover:scale-125 hover:rotate-90"
              >
                ✕
              </button>

              <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                AI Personalized Filter
              </h2>

              {/* Age Input */}
              <div className="mb-6">
                <label className="block text-lg font-semibold mb-2">
                  Your Age
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={userAge}
                  onChange={(e) => setUserAge(e.target.value)}
                  placeholder="Enter your age"
                  className={`w-full px-4 py-3 rounded-xl ${
                    darkMode
                      ? "bg-[#0D1931]/60 border-blue-500/30 text-gray-200"
                      : "bg-gray-50 border-gray-300 text-gray-800"
                  } backdrop-blur-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300`}
                />
              </div>

              {/* Health Issues */}
              <div className="mb-6">
                <label className="block text-lg font-semibold mb-3">
                  Any Health Conditions? (Select all that apply)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-2">
                  {[
                    "Ankle Issues",
                    "Back Issues",
                    "Balance Disorders",
                    "Digestive Issues",
                    "Elbow Issues",
                    "Glaucoma",
                    "Hamstring Issues",
                    "Heart Conditions",
                    "Hernia",
                    "High Blood Pressure",
                    "Hip Issues",
                    "Knee Issues",
                    "Low Blood Pressure",
                    "Lower Back Issues",
                    "Mental Health Conditions",
                    "Migraine",
                    "Neck Issues",
                    "Pregnancy",
                    "Recent Surgery",
                    "Retinal Issues",
                    "Shoulder Issues",
                    "Vertigo",
                    "Wrist Issues",
                  ].map((issue) => (
                    <label
                      key={issue}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                        selectedHealthIssues.includes(issue)
                          ? "bg-blue-500/20 border-blue-400/60 scale-105"
                          : darkMode
                          ? "bg-[#0D1931]/40 hover:bg-[#0D1931]/60 border-blue-500/20"
                          : "bg-gray-50 hover:bg-gray-100"
                      } border hover:scale-105`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedHealthIssues.includes(issue)}
                        onChange={() => toggleHealthIssue(issue)}
                        className="w-4 h-4 text-blue-500 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm">{issue}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Apply Button */}
              <div className="flex gap-4">
                <button
                  onClick={handleAiFilterApply}
                  disabled={!userAge || selectedHealthIssues.length === 0}
                  className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                    userAge && selectedHealthIssues.length > 0
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 hover:scale-105 shadow-lg shadow-blue-500/50"
                      : "bg-gray-400 text-gray-200 cursor-not-allowed"
                  }`}
                >
                  Apply AI Filter
                </button>
                <button
                  onClick={() => setShowAiFilterModal(false)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 ${
                    darkMode
                      ? "bg-[#1a2942]/80 border border-blue-500/30 hover:bg-[#1a2942] hover:border-blue-500/50"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  Cancel
                </button>
              </div>

              {(!userAge || selectedHealthIssues.length === 0) && (
                <p className="text-sm text-red-400 mt-3 text-center">
                  Please fill in your age and select at least one health
                  condition
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
