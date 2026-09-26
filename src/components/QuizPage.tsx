import { useState } from "react";

import { QuizDistributionSketch, type DistributionSketch } from "./charts/QuizDistributionSketch";
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
  sketch?: DistributionSketch;
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
    reviewLabel: "How it works"
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
    reviewLabel: "How it works"
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
    reviewLabel: "Why it happens"
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
    reviewLabel: "How it works"
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
    reviewPage: "simulations",
    reviewTarget: "wide-range-title",
    reviewLabel: "Why it happens"
  },
  {
    id: "multiplicative-process",
    concept: "Percentage growth and first digits",
    prompt: "What does the city-growth simulation illustrate when comparing adding newcomers with percentage growth?",
    options: [
      {
        id: "can-spread",
        label: "Varying percentage growth can spread populations across scales, allowing Benford-like digits to emerge",
        feedback: "Correct. Percentage growth multiplies each population by a factor. In this model, different growth histories can spread populations across scales and make fractional logs nearly uniform. Adding similar numbers of newcomers keeps populations more clustered. Percentage growth alone is not a guarantee of Benford digits."
      },
      {
        id: "always",
        label: "Any percentage-growth rule must produce Benford population digits",
        feedback: "Percentage growth is a possible mechanism, not a guarantee. For example, if every city starts at the same size and follows the same growth history, their populations stay identical."
      },
      {
        id: "normal-required",
        label: "City populations must have perfectly Normal logarithms to show Benford digits",
        feedback: "A Normal log distribution is one teaching model, not a requirement. Check the fractional logs of the simulated populations rather than requiring perfectly Normal logarithms."
      },
      {
        id: "addition-impossible",
        label: "Adding newcomers can never produce Benford-like population digits",
        feedback: "The simulation compares two specific growth rules. Adding newcomers keeps populations clustered in this model; it does not establish that every additive growth process must fail to produce Benford-like digits."
      }
    ],
    correctOptionId: "can-spread",
    reviewPage: "simulations",
    reviewTarget: "avm-title",
    reviewLabel: "Why it happens"
  },
{
  "id": "raw-range",
  "concept": "Uniform values versus Benford",
  "prompt": "X is uniformly distributed from 1 to 10. Does this model have Benford first-digit probabilities?",
  "sketch": {
    "scale": "X",
    "shape": "uniform"
  },
  "options": [
    {
      "id": "wrong-0",
      "label": "Yes; covering all nine first digits is sufficient",
      "feedback": "Seeing all nine digits does not determine their probabilities. Benford gives unequal probabilities."
    },
    {
      "id": "correct",
      "label": "No; each first digit is equally likely, with probability 1/9",
      "feedback": "Each digit corresponds to an interval of length 1: [1, 2), [2, 3), …, [9, 10). A uniform X assigns each interval probability 1/9, about 11.1%, rather than Benford probabilities."
    },
    {
      "id": "wrong-2",
      "label": "No; values confined to one decade can never follow Benford",
      "feedback": "This model is not Benford because X is uniform, not because its range is one decade. A different distribution within 1 to 10 can follow Benford."
    },
    {
      "id": "wrong-3",
      "label": "Yes; a flat distribution always gives Benford probabilities",
      "feedback": "The scale matters. Uniform X is different from uniform fractional logs."
    }
  ],
  "correctOptionId": "correct",
  "followUp": "Uniform X does not give uniform fractional logs. The next question changes which quantity is uniform.",
  "reviewPage": "why",
  "reviewTarget": "benford-condition-title",
  "reviewLabel": "How it works"
},
{
  "id": "log-range",
  "concept": "Uniform log values give Benford",
  "prompt": "Now log₁₀(X) is uniformly distributed from 0 to 1, so X still lies between 1 and 10. Does this model have Benford first-digit probabilities?",
  "sketch": {
    "scale": "log₁₀(X)",
    "shape": "uniform"
  },
  "options": [
    {
      "id": "wrong-0",
      "label": "No; X still spans only one decade",
      "feedback": "One decade is sufficient. Here the fractional logs are uniform, which gives Benford probabilities."
    },
    {
      "id": "wrong-1",
      "label": "No; the flat curve makes all first digits equally likely",
      "feedback": "The flat curve is on the log scale. Digit intervals have unequal log lengths, so their probabilities are unequal."
    },
    {
      "id": "correct",
      "label": "Yes; uniform fractional logs give Benford probabilities",
      "feedback": "On [0, 1), the log values are their own fractional parts. These uniform fractional logs assign each digit probability log₁₀((1+d)/d): about 30.1% for digit 1, down to 4.6% for digit 9."
    },
    {
      "id": "wrong-3",
      "label": "The exact model is insufficient; a larger sample is needed to decide",
      "feedback": "The specified uniform log distribution determines the theoretical probabilities. A finite sample can fluctuate around them."
    }
  ],
  "correctOptionId": "correct",
  "followUp": "This is an exact distributional result, not a guarantee that every finite sample matches the PMF exactly.",
  "reviewPage": "why",
  "reviewTarget": "benford-condition-title",
  "reviewLabel": "How it works"
},
{
  "id": "bell-log",
  "concept": "Bell-shaped logs are not a guarantee",
  "prompt": "This log₁₀(X) distribution is bell-shaped. Could its first digits be approximately Benford?",
  "sketch": {
    "scale": "log₁₀(X)",
    "shape": "bell-shaped"
  },
  "options": [
    {
      "id": "wrong-0",
      "label": "Certain; any bell-shaped log distribution is Benford",
      "feedback": "A narrow bell-shaped log distribution can concentrate fractional positions. Shape alone is not enough."
    },
    {
      "id": "wrong-1",
      "label": "Impossible; Benford requires the original values to be bell-shaped",
      "feedback": "Benford does not require a bell shape for the original values or their logarithms."
    },
    {
      "id": "wrong-2",
      "label": "Certain; having values at both ends of the axis is sufficient",
      "feedback": "Tails or endpoints do not establish how probability is distributed across fractional positions."
    },
    {
      "id": "possible",
      "label": "Possible; a bell shape can be compatible, but fractional logs need checking",
      "feedback": "A sufficiently broad, smooth bell-shaped log distribution can give nearly uniform fractional logs. A bell shape alone does not establish enough spread or mixing."
    }
  ],
  "correctOptionId": "possible",
  "followUp": "Inspect the fractional logs on [0, 1). Approximately uniform fractional logs support Benford-like probabilities; compare the first-digit frequencies as well.",
  "reviewPage": "why",
  "reviewTarget": "benford-condition-title",
  "reviewLabel": "How it works"
},
{
  "id": "skew-log",
  "concept": "Skewed logs can be compatible",
  "prompt": "This log₁₀(X) distribution is right-skewed. Does that rule out Benford-like first digits?",
  "sketch": {
    "scale": "log₁₀(X)",
    "shape": "right-skewed"
  },
  "options": [
    {
      "id": "possible",
      "label": "Possible; skewness does not rule it out, so inspect fractional logs",
      "feedback": "Symmetry is not required. Contributions from different integer parts of the logs may still combine into a nearly uniform fractional-log distribution."
    },
    {
      "id": "wrong-0",
      "label": "Impossible; log₁₀(X) must be symmetric",
      "feedback": "Symmetry is not a requirement for Benford-like digits."
    },
    {
      "id": "wrong-1",
      "label": "Certain; a long right tail guarantees Benford",
      "feedback": "A tail may extend the range without spreading fractional logs evenly."
    },
    {
      "id": "wrong-2",
      "label": "Impossible; every non-Normal log distribution fails Benford",
      "feedback": "Normality is one model, not a requirement. Non-Normal log distributions can have uniform fractional logs."
    }
  ],
  "correctOptionId": "possible",
  "followUp": "Inspect the fractional logs on [0, 1). Approximately uniform fractional logs support Benford-like probabilities; compare the first-digit frequencies as well.",
  "reviewPage": "why",
  "reviewTarget": "benford-condition-title",
  "reviewLabel": "How it works"
},
{
  "id": "two-peaks-log",
  "concept": "Multiple log peaks are not decisive",
  "prompt": "This log₁₀(X) distribution has two peaks. Could its first digits still be approximately Benford?",
  "sketch": {
    "scale": "log₁₀(X)",
    "shape": "two-peaked"
  },
  "options": [
    {
      "id": "wrong-0",
      "label": "Impossible; two peaks necessarily produce two dominant first digits",
      "feedback": "Peaks on the full log scale do not map one-to-one to digits. Their fractional positions and widths matter."
    },
    {
      "id": "possible",
      "label": "Possible; two peaks do not decide the result—check fractional logs",
      "feedback": "When integer parts are removed, peaks may reinforce the same fractional positions or their contributions may overlap more evenly. Their widths and positions matter."
    },
    {
      "id": "wrong-1",
      "label": "Certain; two peaks automatically balance each other",
      "feedback": "Two peaks may reinforce the same fractional region rather than balance it."
    },
    {
      "id": "wrong-2",
      "label": "Certain; a mixture of distributions is always Benford",
      "feedback": "Combining distributions can help in some cases, but a mixture alone provides no guarantee."
    }
  ],
  "correctOptionId": "possible",
  "followUp": "Inspect the fractional logs on [0, 1). Approximately uniform fractional logs support Benford-like probabilities; compare the first-digit frequencies as well.",
  "reviewPage": "why",
  "reviewTarget": "benford-condition-title",
  "reviewLabel": "How it works"
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
            ? `Answer ${questions.length} questions about the app's central ideas, including five distribution charts.`
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
          {currentQuestion.sketch && <QuizDistributionSketch {...currentQuestion.sketch} />}
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
