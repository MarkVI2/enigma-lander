import { useState, useEffect } from "react";
import { getApiUrl } from "../utils/config";

// Define the quiz question type
interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
}

// Define participant type
interface Participant {
  name: string;
  email: string;
  teamName: string;
}

const csQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "What does CPU stand for?",
    options: [
      "Central Processing Unit",
      "Computer Personal Unit",
      "Central Process Utility",
      "Central Processor Unit",
    ],
    correctAnswer: "Central Processing Unit",
  },
  {
    id: 2,
    question: "Which data structure operates on a LIFO principle?",
    options: ["Queue", "Stack", "Linked List", "Tree"],
    correctAnswer: "Stack",
  },
  {
    id: 3,
    question: "What is the time complexity of binary search?",
    options: ["O(n)", "O(n²)", "O(log n)", "O(n log n)"],
    correctAnswer: "O(log n)",
  },
  {
    id: 4,
    question: "What does the HTTP status code 418 represent?",
    options: [
      "Not Found",
      "I'm a teapot",
      "Internal Server Error",
      "Bad Request",
    ],
    correctAnswer: "I'm a teapot",
  },
  {
    id: 5,
    question:
      "Which programming paradigm treats computation as the evaluation of mathematical functions?",
    options: [
      "Object-Oriented Programming",
      "Procedural Programming",
      "Functional Programming",
      "Event-Driven Programming",
    ],
    correctAnswer: "Functional Programming",
  },
  // Add more questions as needed
];

// Quiz settings
const QUIZ_TIME_LIMIT = 30 * 60; // 30 minutes in seconds

export const Preliminary = () => {
  const [email, setEmail] = useState("");
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [participantVerified, setParticipantVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // New states for quiz timer and instructions
  const [showInstructions, setShowInstructions] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(QUIZ_TIME_LIMIT);
  const [timerActive, setTimerActive] = useState(false);

  // Timer effect
  useEffect(() => {
    let interval: number | undefined;

    if (timerActive && timeRemaining > 0) {
      interval = window.setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            // Time's up, submit quiz
            clearInterval(interval);
            setTimerActive(false);
            const finalScore = calculateScore();
            setQuizCompleted(true);
            submitQuizResults(finalScore);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timeRemaining <= 0 && timerActive) {
      setTimerActive(false);
      const finalScore = calculateScore();
      setQuizCompleted(true);
      submitQuizResults(finalScore);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timeRemaining]);

  // Format time to MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Verify if the participant exists and if they've taken the quiz
  const verifyParticipant = async () => {
    if (!email) {
      setError("Please enter your email");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log("Verifying participant with email:", email);
      const response = await fetch(
        getApiUrl(`/api/verify-participant?email=${encodeURIComponent(email)}`)
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to verify participant");
      }

      const data = await response.json();
      console.log("Verification response:", data);

      if (!data.found) {
        setError(data.message || "Participant not found");
        setLoading(false);
        return;
      }

      setParticipant(data.participant);
      setParticipantVerified(true);

      if (data.quizCompleted) {
        setQuizCompleted(true);
        // Fetch their quiz results
        try {
          const quizResponse = await fetch(
            getApiUrl(`/api/verify-quiz?email=${encodeURIComponent(email)}`)
          );
          const quizData = await quizResponse.json();

          if (quizData.completed && quizData.result) {
            setScore(quizData.result.score);
          }
        } catch (err) {
          console.error("Error fetching quiz results:", err);
        }
      }
    } catch (err) {
      console.error("Verification error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to verify participant. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Submit quiz results to backend
  const submitQuizResults = async (finalScore?: number) => {
    if (!participant) return;

    try {
      const completedAt = new Date().toISOString();
      const scoreToSubmit = finalScore !== undefined ? finalScore : score;

      const response = await fetch(getApiUrl("/api/submit-quiz"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: participant.email,
          name: participant.name,
          teamName: participant.teamName,
          answers,
          score: scoreToSubmit,
          quizAttempted: true,
          completedAt,
          updatedAt: completedAt,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to submit quiz results:", errorData);
      }
    } catch (err) {
      console.error("Failed to submit quiz results", err);
    }
  };

  // Start the quiz with timer
  const startQuizWithTimer = () => {
    if (!participant) {
      setError("Participant information is missing");
      return;
    }
    setQuizStarted(true);
    setShowInstructions(false);
    setAnswers(new Array(csQuestions.length).fill(""));
    setTimeRemaining(QUIZ_TIME_LIMIT);
    setTimerActive(true);
  };

  // Show instructions first, then quiz
  const startQuiz = () => {
    if (!participant) {
      setError("Participant information is missing");
      return;
    }
    setShowInstructions(true);
  };

  // Handle answer selection
  const handleAnswerSelect = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  // Move to the next question
  const handleNextQuestion = () => {
    if (currentQuestion < csQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const finalScore = calculateScore();
      setQuizCompleted(true);
      submitQuizResults(finalScore);
    }
  };

  // Calculate the final score
  const calculateScore = () => {
    let newScore = 0;
    answers.forEach((answer, index) => {
      if (answer === csQuestions[index].correctAnswer) {
        newScore++;
      }
    });
    setScore(newScore);
    return newScore; // Return the calculated score
  };

  return (
    <section
      id="preliminary"
      className="container min-h-screen flex items-center justify-center py-12 sm:py-16 font-mono"
    >
      <div className="w-full max-w-3xl mx-auto">
        <div className="pixel-border bg-black text-green-400 border-4 border-green-500 rounded-none p-8 shadow-[8px_8px_0px_0px_rgba(34,197,94,0.5)]">
          {/* Back to Home Button - Always visible */}
          <div className="absolute top-4 left-4 md:top-8 md:left-8">
            <a
              href="/"
              className="bg-green-600 text-black px-4 py-2 rounded-none hover:bg-green-400 transition pixel-button flex items-center gap-2"
            >
              <span>&lt;&lt;</span> HOME
            </a>
          </div>

          <div className="px-6">
            {/* 8-bit style header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold pixel-text">
                <span className="text-yellow-400 blink">418</span>{" "}
                <span className="text-green-400">HACKATHON</span>
              </h2>
              <div className="mt-2 pixel-divider"></div>
              <p className="text-xl mt-4 pixel-text">PRELIMINARY SCREENING</p>
            </div>

            {/* Email verification form (initial state) */}
            {!participantVerified && !quizCompleted && (
              <div className="pixel-container">
                <h3 className="text-xl text-center font-semibold mb-4 text-yellow-400 pixel-text">
                  VERIFY YOUR REGISTRATION
                </h3>
                <div className="flex flex-col gap-4 max-w-md mx-auto">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ENTER YOUR EMAIL"
                    className="px-4 py-2 bg-black border-2 border-green-500 text-green-400 rounded-none pixel-input"
                    disabled={loading}
                  />
                  <button
                    onClick={verifyParticipant}
                    disabled={loading}
                    className="bg-green-600 text-black px-6 py-2 rounded-none hover:bg-green-400 transition pixel-button disabled:opacity-50"
                  >
                    {loading ? "VERIFYING..." : "VERIFY"}
                  </button>
                  {error && (
                    <p className="text-red-500 mt-2 pixel-text text-center">
                      {error}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Instructions page */}
            {participantVerified &&
              !quizStarted &&
              !quizCompleted &&
              !showInstructions && (
                <div className="mt-8 pixel-container">
                  <h3 className="text-xl font-semibold mb-4 text-yellow-400 pixel-text">
                    PARTICIPANT VERIFIED
                  </h3>
                  <div className="mb-6 space-y-2">
                    <p className="text-green-400 pixel-text">
                      <span className="text-yellow-400">NAME:</span>{" "}
                      {participant?.name}
                    </p>
                    <p className="text-green-400 pixel-text">
                      <span className="text-yellow-400">EMAIL:</span>{" "}
                      {participant?.email}
                    </p>
                    <p className="text-green-400 pixel-text">
                      <span className="text-yellow-400">TEAM:</span>{" "}
                      {participant?.teamName}
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <button
                      onClick={startQuiz}
                      className="bg-green-600 text-black px-6 py-2 rounded-none hover:bg-green-400 transition pixel-button"
                    >
                      VIEW INSTRUCTIONS
                    </button>
                  </div>
                  {error && (
                    <p className="text-red-500 mt-2 pixel-text text-center">
                      {error}
                    </p>
                  )}
                </div>
              )}

            {/* Quiz instructions */}
            {participantVerified &&
              showInstructions &&
              !quizStarted &&
              !quizCompleted && (
                <div className="mt-8 pixel-container">
                  <h3 className="text-xl font-semibold mb-4 text-yellow-400 pixel-text">
                    QUIZ INSTRUCTIONS
                  </h3>
                  <div className="pixel-divider mb-4"></div>
                  <div className="space-y-4 text-green-400 pixel-text">
                    <p>
                      1. This quiz contains {csQuestions.length} multiple-choice
                      questions.
                    </p>
                    <p>
                      2. You have{" "}
                      <span className="text-yellow-400">
                        {formatTime(QUIZ_TIME_LIMIT)}
                      </span>{" "}
                      minutes to complete the quiz.
                    </p>
                    <p>
                      3. Once you start the quiz, the timer cannot be paused.
                    </p>
                    <p>4. Each question has only one correct answer.</p>
                    <p>
                      5. You must select an answer to proceed to the next
                      question.
                    </p>
                    <p>
                      6. Your quiz will be submitted automatically when the time
                      expires.
                    </p>
                  </div>
                  <div className="flex justify-center mt-8">
                    <button
                      onClick={startQuizWithTimer}
                      className="bg-green-600 text-black px-8 py-3 rounded-none hover:bg-green-400 transition pixel-button"
                    >
                      START QUIZ
                    </button>
                  </div>
                </div>
              )}

            {/* Quiz interface with timer */}
            {quizStarted && !quizCompleted && (
              <div className="mt-8 pixel-container">
                {/* Timer display */}
                <div className="mb-4 flex justify-between items-center">
                  <span className="text-sm font-medium text-yellow-400 pixel-text">
                    QUESTION {currentQuestion + 1}/{csQuestions.length}
                  </span>
                  <span
                    className={`text-sm font-medium ${
                      timeRemaining < 60
                        ? "text-red-500 animate-pulse"
                        : "text-green-400"
                    } pixel-text`}
                  >
                    TIME: {formatTime(timeRemaining)}
                  </span>
                  <span className="text-sm font-medium text-green-400 pixel-text">
                    TEAM: {participant?.teamName}
                  </span>
                </div>
                <div className="pixel-divider mb-4"></div>
                <h3 className="text-xl font-semibold mb-6 text-green-400 pixel-text">
                  {csQuestions[currentQuestion].question}
                </h3>
                <div className="space-y-4">
                  {csQuestions[currentQuestion].options.map((option, index) => (
                    <div
                      key={index}
                      className={`p-4 border-2 cursor-pointer hover:bg-green-900 transition ${
                        answers[currentQuestion] === option
                          ? "border-yellow-400 bg-green-900"
                          : "border-green-500"
                      } pixel-option`}
                      onClick={() => handleAnswerSelect(option)}
                    >
                      <span className="text-yellow-400 mr-2">
                        [{String.fromCharCode(65 + index)}]
                      </span>{" "}
                      {option}
                    </div>
                  ))}
                </div>
                <div className="mt-8 text-center">
                  <button
                    onClick={handleNextQuestion}
                    disabled={!answers[currentQuestion]}
                    className="bg-green-600 text-black px-8 py-3 rounded-none hover:bg-green-400 transition disabled:opacity-50 disabled:cursor-not-allowed pixel-button"
                  >
                    {currentQuestion === csQuestions.length - 1
                      ? "SUBMIT"
                      : "NEXT >>"}
                  </button>
                </div>
              </div>
            )}

            {/* Quiz completion results */}
            {quizCompleted && (
              <div className="mt-8 pixel-container text-center">
                <h3 className="text-2xl font-semibold mb-4 text-yellow-400 pixel-text">
                  BREW COMPLETED!
                </h3>
                <div className="pixel-divider mb-6"></div>
                <div className="mb-6 pixel-art-trophy"></div>
                <p className="text-lg mb-4 text-green-400 pixel-text">
                  You can now <span className="text-yellow-400">BREW</span>{" "}
                  yourself a TEAPOT <br />
                  (or maybe code; we honestly don't care)
                </p>
                <div className="mb-4 space-y-2">
                  <p className="text-green-400 pixel-text">
                    <span className="text-yellow-400">NAME:</span>{" "}
                    {participant?.name}
                  </p>
                  <p className="text-green-400 pixel-text">
                    <span className="text-yellow-400">TEAM:</span>{" "}
                    {participant?.teamName}
                  </p>
                </div>
                <p className="text-2xl font-mediumtext-green-400 pixel-text">
                  <span className="text-yellow-400">YOUR SCORE: </span>
                  {score}/{csQuestions.length} (
                  {Math.round((score / csQuestions.length) * 100)}%)
                </p>
                <div className="pixel-divider my-6"></div>
                <p className="mt-4 text-green-400 pixel-text">
                  YOUR RESULTS HAVE BEEN RECORDED. YOU WILL BE INFORMED VIA
                  EMAIL IF YOUR TEAM IS SELECTED
                </p>
                <div className="mt-8">
                  <a
                    href="/"
                    className="bg-green-600 text-black px-8 py-3 rounded-none hover:bg-green-400 transition pixel-button"
                  >
                    RETURN HOME
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
