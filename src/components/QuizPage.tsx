import { useState } from "react";

import { LogIntervalStrip } from "./LogIntervalStrip";

type ReviewPage = "what" | "why" | "simulations";

type QuizOption = {
  id: string;
  label: string;
  feedback: string;
};

type QuizQuestion = {
  id: string;
  concept: string;
  prompt: string;
  options: QuizOption[];
  correctOptionId: string;
  followUp?: string;
  reviewPage: ReviewPage;
  reviewTarget: string;
  reviewLabel: string;
};

type QuizPageProps = {
  onReview?: (page: ReviewPage) => void;
};

const questions: QuizQuestion[] = [
  {
    id: "first-digit",
    concept: "First nonzero digit",
    prompt: "What is the first digit of 0.0314?",
    options: [
      {
        id: "zero",
        label: "0, because it appears first",
        feedback: "Leading zeros locate the decimal point; they are not the first significant digit. The first digit is 3."
      },
      {
        id: "three",
        label: "3, because leading zeros do not count",
        feedback: "Correct. The first nonzero digit is 3, whether the value is 0.0314, 3.14, or 3140."
      },
      {
        id: "one",
        label: "1, because it is the first digit after the 3",
        feedback: "The first digit is the leftmost nonzero digit, not the next digit. Here that is 3."
      },
      {
        id: "four",
        label: "4, because it is the last nonzero digit",
        feedback: "Benford uses the first nonzero digit from the left, not the last. Here that is 3."
      }
    ],
    correctOptionId: "three",
    reviewPage: "what",
    reviewTarget: "what-title",
    reviewLabel: "What it is"
  },
  {
    id: "negative-fractional-log",
    concept: "Fractional logs below zero",
    prompt: "For a positive value X, log₁₀(X) = −1.6. What is its fractional log?",
    options: [
      {
        id: "negative-point-six",
        label: "−0.6, the signed digits after the decimal point",
        feedback: "The floor(−1.6) is −2, not −1. The fractional part is −1.6 − (−2) = 0.4."
      },
      {
        id: "point-six",
        label: "0.6, the digits after the decimal point without the minus sign",
        feedback: "Dropping the minus sign does not give the fractional part. Subtract floor(−1.6) = −2, leaving 0.4."
      },
      {
        id: "point-four",
        label: "0.4, because the floor of −1.6 is −2",
        feedback: "Correct. −1.6 − floor(−1.6) = 0.4. The significand is 10⁰·⁴ ≈ 2.51, so X begins with 2."
      },
      {
        id: "one-point-six",
        label: "1.6, the distance from zero",
        feedback: "The fractional part must lie in [0, 1). Subtract the floor, −2, from −1.6 to get 0.4."
      }
    ],
    correctOptionId: "point-four",
    reviewPage: "why",
    reviewTarget: "benford-condition-title",
    reviewLabel: "Why it happens"
  },
  {
    id: "log-intervals",
    concept: "Unequal first-digit intervals",
    prompt: "Fractional logs are uniform on [0, 1). Why is first digit 1 more common than 9?",
    options: [
      {
        id: "longer",
        label: "Digit 1 occupies a longer interval on the fractional-log scale",
        feedback: "Correct. Uniform fractional logs land more often in 1's longer log interval than in 9's shorter one."
      },
      {
        id: "same-width",
        label: "The intervals have equal width, but 1 is chosen first",
        feedback: "The significand intervals [1, 2) and [9, 10) have equal ordinary width, but unequal log widths. Digit 1's log interval is longer."
      },
      {
        id: "more-decades",
        label: "Digit 1 appears in more orders of magnitude than 9",
        feedback: "Both digits can begin values in every order of magnitude. Digit 1 is more common because its fractional-log interval is longer."
      },
      {
        id: "more-small-values",
        label: "A uniform log scale samples more small values",
        feedback: "Uniform here means equal probability per unit of fractional-log length, not equal probability per unit of X. Digit 1 gets a longer interval."
      }
    ],
    correctOptionId: "longer",
    reviewPage: "why",
    reviewTarget: "benford-condition-title",
    reviewLabel: "Why it happens"
  },
  {
    id: "sample-size-model",
    concept: "Sample size versus model shape",
    prompt: "A model produces mostly values beginning with 1. You sample ten times as many values without changing the model. Must the digit frequencies approach Benford's Law?",
    options: [
      {
        id: "yes-less-noise",
        label: "Yes; less sampling noise forces Benford frequencies",
        feedback: "Less noise reveals the model's own digit probabilities more clearly. It cannot turn a non-Benford model into a Benford one."
      },
      {
        id: "yes-more-digits",
        label: "Yes; a larger sample eventually contains all nine first digits",
        feedback: "Seeing all nine digits does not set their proportions. A larger sample estimates the unchanged model's proportions more precisely."
      },
      {
        id: "maybe-range",
        label: "Yes, provided the sampled values span several orders of magnitude",
        feedback: "Wide range alone is not enough. Increasing sample size does not change the model's underlying first-digit probabilities."
      },
      {
        id: "no-model",
        label: "No; the larger sample estimates the model's own digit probabilities more precisely",
        feedback: "Correct. More observations reduce sampling noise, but they do not change the distribution generating the values."
      }
    ],
    correctOptionId: "no-model",
    reviewPage: "simulations",
    reviewTarget: "lab-title",
    reviewLabel: "Simulations"
  },
  {
    id: "multiply-by-ten",
    concept: "Power-of-ten scaling",
    prompt: "You multiply every positive observation by 10. What happens to each first digit?",
    options: [
      {
        id: "changes",
        label: "It usually changes because every value is ten times larger",
        feedback: "Multiplying by 10 moves the decimal point without changing the leading digit. On the log scale it adds 1, leaving the fractional part unchanged."
      },
      {
        id: "same",
        label: "The first digit stays the same; the logarithm gains 1",
        feedback: "Correct. log₁₀(10X) = log₁₀(X) + 1, so the fractional log and first digit stay the same."
      },
      {
        id: "one",
        label: "It becomes 1 because the multiplier starts with 1",
        feedback: "The leading digit of the multiplier does not replace the leading digit of X. Multiplying by 10 only shifts the decimal point."
      },
      {
        id: "next",
        label: "It becomes the next digit in the original value",
        feedback: "The decimal point moves, but the order of significant digits does not. The same digit stays first."
      }
    ],
    correctOptionId: "same",
    reviewPage: "why",
    reviewTarget: "benford-condition-title",
    reviewLabel: "Why it happens"
  },
  {
    id: "expected-count",
    concept: "Expected count versus observed count",
    prompt: "You draw 1,000 independent values from a Benford distribution. Must exactly 301 begin with 1?",
    options: [
      {
        id: "exact",
        label: "Yes; 30.1% of 1,000 fixes the count at 301",
        feedback: "30.1% gives an expected count, not a fixed count. Independent draws vary, so the observed count need not be 301."
      },
      {
        id: "at-least",
        label: "Yes; at least 301 must begin with 1",
        feedback: "An expected count is not a minimum. A sample can have fewer or more than about 301 ones."
      },
      {
        id: "varies",
        label: "No; about 301 is expected, while the observed count varies",
        feedback: "Correct. The expected count is about 301, but random samples fluctuate around it."
      },
      {
        id: "unpredictable",
        label: "No; Benford gives no prediction for a sample of 1,000",
        feedback: "Benford does predict an expected count of about 301. It just does not guarantee the exact count in a finite sample."
      }
    ],
    correctOptionId: "varies",
    followUp: "Finite-sample digit bars can differ from the Benford probabilities even when the values follow Benford's Law.",
    reviewPage: "what",
    reviewTarget: "what-title",
    reviewLabel: "What it is"
  },
  {
    id: "powers-of-ten",
    concept: "Wide range is not a guarantee",
    prompt: "Does spanning many orders of magnitude guarantee Benford behavior?",
    options: [
      {
        id: "yes-wide",
        label: "Yes; a wide range alone is sufficient",
        feedback: "Range alone is not sufficient. Powers of ten span many orders of magnitude yet all begin with 1."
      },
      {
        id: "yes-all-digits",
        label: "Yes, if the sample contains every possible first digit",
        feedback: "Including all nine digits does not determine their frequencies. Width and digit coverage alone do not guarantee Benford behavior."
      },
      {
        id: "yes-log",
        label: "Yes, because any wide set has uniform fractional logs",
        feedback: "A wide set need not fill the fractional-log scale evenly. Powers of ten all have fractional log 0."
      },
      {
        id: "no-powers",
        label: "No; powers of ten span widely but always begin with 1",
        feedback: "Correct. Width makes Benford behavior plausible in some processes, but it is not a guarantee."
      }
    ],
    correctOptionId: "no-powers",
    reviewPage: "why",
    reviewTarget: "wide-range-title",
    reviewLabel: "Why it happens"
  },
  {
    id: "multiplicative-process",
    concept: "Multiplication as a possible mechanism",
    prompt: "What does the add-versus-multiply simulation illustrate?",
    options: [
      {
        id: "can-spread",
        label: "Multiplication can spread values in log space; Benford-like digits may emerge",
        feedback: "Correct. Products become sums in log space. Sufficient mixing can make fractional logs nearly uniform, but multiplication alone does not guarantee that outcome."
      },
      {
        id: "always",
        label: "Any multiplicative process must produce Benford digits",
        feedback: "Multiplication is a possible mechanism, not a guarantee. The resulting log-scale distribution still matters."
      },
      {
        id: "normal-required",
        label: "The product must have a perfectly Normal log distribution",
        feedback: "A Normal log distribution is one teaching model, not a requirement for Benford-like first digits."
      },
      {
        id: "addition-impossible",
        label: "An additive process can never produce Benford-like digits",
        feedback: "The simulation compares two particular processes. It does not prove that every additive dataset fails Benford."
      }
    ],
    correctOptionId: "can-spread",
    reviewPage: "simulations",
    reviewTarget: "avm-title",
    reviewLabel: "Simulations"
  }
];

const allQuestionIds = questions.map((question) => question.id);

export function QuizPage({ onReview }: QuizPageProps) {
  const [activeQuestionIds, setActiveQuestionIds] = useState(allQuestionIds);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  const activeQuestions = activeQuestionIds.map((id) => questions.find((question) => question.id === id)!);
  const quizComplete = questionIndex === activeQuestions.length;
  const currentQuestion = activeQuestions[questionIndex];
  const submitted = currentQuestion ? answers[currentQuestion.id] !== undefined : false;
  const score = activeQuestions.filter((question) => answers[question.id] === question.correctOptionId).length;
  const missedQuestions = activeQuestions.filter(
    (question) => answers[question.id] !== undefined && answers[question.id] !== question.correctOptionId
  );

  function submitAnswer() {
    if (!currentQuestion || selectedOptionId === null || submitted) return;
    setAnswers((currentAnswers) => ({ ...currentAnswers, [currentQuestion.id]: selectedOptionId }));
  }

  function advance() {
    if (!submitted) return;
    setQuestionIndex((currentIndex) => currentIndex + 1);
    setSelectedOptionId(null);
  }

  function startRound(questionIds: string[]) {
    setActiveQuestionIds(questionIds);
    setAnswers({});
    setQuestionIndex(0);
    setSelectedOptionId(null);
  }

  if (quizComplete) {
    return (
      <section className="quiz-page" aria-labelledby="quiz-results-title">
        <div className="intro-band quiz-intro">
          <p className="eyebrow">Knowledge check</p>
          <h2 id="quiz-results-title">Quiz Complete</h2>
          <p>
            You answered <strong>{score} out of {activeQuestions.length}</strong> questions correctly.
          </p>
        </div>
        <div className="quiz-results">
          {missedQuestions.length > 0 ? (
            <section className="quiz-missed" aria-labelledby="quiz-missed-title">
              <h3 id="quiz-missed-title">Missed concepts</h3>
              <p>Review these explanations, then return to this tab. Your results will be here.</p>
              <ul>
                {missedQuestions.map((question) => (
                  <li key={question.id}>
                    <strong>{question.concept}</strong>
                    <a href={`#${question.reviewTarget}`} onClick={() => onReview?.(question.reviewPage)}>
                      Review {question.reviewLabel}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ) : (
            <p>You connected the first-digit pattern to the log-scale reasoning behind it.</p>
          )}
          <div className="quiz-result-actions">
            {missedQuestions.length > 0 ? (
              <button className="secondary-action" type="button" onClick={() => startRound(missedQuestions.map((question) => question.id))}>
                Retry missed questions
              </button>
            ) : null}
            <button className="secondary-action" type="button" onClick={() => startRound(allQuestionIds)}>
              Try again
            </button>
          </div>
        </div>
      </section>
    );
  }

  const selectedOption = currentQuestion.options.find((option) => option.id === selectedOptionId);

  return (
    <section className="quiz-page" aria-labelledby="quiz-title">
      <div className="intro-band quiz-intro">
        <p className="eyebrow">Knowledge check</p>
        <h2 id="quiz-title">Benford Quiz: Check Your Intuition</h2>
        <p>
          {activeQuestionIds.length === questions.length
            ? "Answer eight short questions about the app's central ideas."
            : `Revisit ${activeQuestionIds.length} missed ${activeQuestionIds.length === 1 ? "question" : "questions"}.`}
        </p>
      </div>

      <article className="quiz-panel">
        <header className="quiz-progress">
          <span>Question {questionIndex + 1} of {activeQuestions.length}</span>
          <span>{score} correct so far</span>
        </header>

        <fieldset className="quiz-question">
          <legend>{currentQuestion.prompt}</legend>
          <div className="quiz-options">
            {currentQuestion.options.map((option) => (
              <label
                className={`quiz-option${submitted && option.id === currentQuestion.correctOptionId ? " quiz-option-correct" : ""}`}
                key={option.id}
              >
                <input
                  checked={selectedOptionId === option.id}
                  disabled={submitted}
                  name={`question-${currentQuestion.id}`}
                  onChange={() => setSelectedOptionId(option.id)}
                  type="radio"
                  value={option.id}
                />
                <span>
                  {option.label}
                  {submitted && option.id === currentQuestion.correctOptionId ? (
                    <strong className="quiz-correct-label">Correct answer</strong>
                  ) : null}
                  {submitted && option.id === selectedOptionId && option.id !== currentQuestion.correctOptionId ? (
                    <strong className="quiz-selected-label">Your answer</strong>
                  ) : null}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {!submitted ? (
          <button
            className="secondary-action quiz-action"
            disabled={selectedOptionId === null}
            type="button"
            onClick={submitAnswer}
          >
            Check answer
          </button>
        ) : (
          <div className="quiz-response">
            <div className="quiz-feedback" role="status">
              <strong>{selectedOptionId === currentQuestion.correctOptionId ? "Correct." : "Not quite."}</strong>{" "}
              {selectedOption?.feedback} {currentQuestion.followUp}
            </div>
            {currentQuestion.id === "log-intervals" ? <LogIntervalStrip /> : null}
            <button className="secondary-action quiz-action" type="button" onClick={advance}>
              {questionIndex === activeQuestions.length - 1 ? "See results" : "Next question"}
            </button>
          </div>
        )}
      </article>
    </section>
  );
}
