import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { QuizPage } from "./QuizPage";

const correctAnswers = [
  /3, because leading zeros do not count/i,
  /0\.4, because the floor of −1\.6 is −2/i,
  /digit 1 occupies a longer interval/i,
  /no; the larger sample estimates the model's own digit probabilities/i,
  /the first digit stays the same/i,
  /no; about 301 is expected/i,
  /no; powers of ten span widely but always begin with 1/i,
  /multiplication can spread values in log space/i
];

async function answerAndAdvance(user: ReturnType<typeof userEvent.setup>, answer: RegExp, last = false) {
  await user.click(screen.getByRole("radio", { name: answer }));
  await user.click(screen.getByRole("button", { name: /check answer/i }));
  await user.click(screen.getByRole("button", { name: last ? /see results/i : /next question/i }));
}

describe("QuizPage", () => {
  it("waits for submission, then names and highlights the correct choice", async () => {
    const user = userEvent.setup();
    render(<QuizPage />);

    expect(screen.getByRole("heading", { name: /benford quiz/i })).toBeInTheDocument();
    expect(screen.getByText(/question 1 of 8/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /check answer/i })).toBeDisabled();

    const wrongAnswer = screen.getByRole("radio", { name: /0, because it appears first/i });
    await user.click(wrongAnswer);
    await user.click(screen.getByRole("button", { name: /check answer/i }));

    expect(wrongAnswer).toBeChecked();
    expect(wrongAnswer).toBeDisabled();
    expect(screen.getByRole("status")).toHaveTextContent(/leading zeros locate the decimal point/i);
    const correctRow = screen.getByText(/3, because leading zeros do not count/i).closest("label");
    expect(correctRow).toHaveClass("quiz-option-correct");
    expect(correctRow).toHaveTextContent(/correct answer/i);
    expect(wrongAnswer.closest("label")).not.toHaveClass("quiz-option-correct");
  });

  it("explains the selected misconception about negative fractional logs", async () => {
    const user = userEvent.setup();
    render(<QuizPage />);

    await answerAndAdvance(user, correctAnswers[0]);
    expect(screen.getByText(/log₁₀\(X\) = −1\.6/i)).toBeInTheDocument();

    await user.click(screen.getByRole("radio", { name: /−0\.6/i }));
    await user.click(screen.getByRole("button", { name: /check answer/i }));

    expect(screen.getByRole("status")).toHaveTextContent(/floor\(−1\.6\) is −2/i);
    expect(screen.getByRole("status")).toHaveTextContent(/0\.4/i);
  });

  it("connects the log-interval answer to the existing interval strip", async () => {
    const user = userEvent.setup();
    render(<QuizPage />);

    await answerAndAdvance(user, correctAnswers[0]);
    await answerAndAdvance(user, correctAnswers[1]);
    expect(screen.queryByRole("img", { name: /first digit intervals on the fractional log scale/i })).not.toBeInTheDocument();

    await user.click(screen.getByRole("radio", { name: correctAnswers[2] }));
    await user.click(screen.getByRole("button", { name: /check answer/i }));
    expect(screen.getByRole("img", { name: /first digit intervals on the fractional log scale/i })).toBeInTheDocument();
  });

  it("connects expected counts to sampling error in the digit bars", async () => {
    const user = userEvent.setup();
    render(<QuizPage />);

    for (const answer of correctAnswers.slice(0, 5)) {
      await answerAndAdvance(user, answer);
    }
    await user.click(screen.getByRole("radio", { name: /yes; 30\.1% of 1,000 fixes the count/i }));
    await user.click(screen.getByRole("button", { name: /check answer/i }));

    expect(screen.getByRole("status")).toHaveTextContent(/finite.sample digit bars can differ from the Benford probabilities/i);
  });

  it("scores all eight core questions and can restart the full quiz", async () => {
    const user = userEvent.setup();
    render(<QuizPage />);

    const correctPositions = [0, 0, 0, 0];
    for (const [index, answer] of correctAnswers.entries()) {
      const position = screen.getAllByRole("radio").findIndex((radio) =>
        answer.test(radio.closest("label")?.textContent ?? "")
      );
      correctPositions[position] += 1;
      await answerAndAdvance(user, answer, index === correctAnswers.length - 1);
    }

    expect(correctPositions).toEqual([2, 2, 2, 2]);
    expect(screen.getByRole("heading", { name: /quiz complete/i })).toBeInTheDocument();
    expect(screen.getByText(/8 out of 8/i)).toBeInTheDocument();
    expect(screen.queryByText(/missed concepts/i)).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /try again/i }));
    expect(screen.getByText(/question 1 of 8/i)).toBeInTheDocument();
  });

  it("links missed concepts to explanations and retries only misses", async () => {
    const user = userEvent.setup();
    const onReview = vi.fn();
    render(<QuizPage onReview={onReview} />);

    await answerAndAdvance(user, /0, because it appears first/i);
    for (const [index, answer] of correctAnswers.slice(1).entries()) {
      await answerAndAdvance(user, answer, index === correctAnswers.length - 2);
    }

    expect(screen.getByText(/7 out of 8/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /missed concepts/i })).toBeInTheDocument();
    expect(screen.getByText(/first nonzero digit/i)).toBeInTheDocument();
    const reviewLink = screen.getByRole("link", { name: /review what it is/i });
    expect(reviewLink).toHaveAttribute("href", "#what-title");
    await user.click(reviewLink);
    expect(onReview).toHaveBeenCalledWith("what");

    await user.click(screen.getByRole("button", { name: /retry missed questions/i }));
    expect(screen.getByText(/question 1 of 1/i)).toBeInTheDocument();
    await answerAndAdvance(user, correctAnswers[0], true);
    expect(screen.getByText(/1 out of 1/i)).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /missed concepts/i })).not.toBeInTheDocument();
  });
});
