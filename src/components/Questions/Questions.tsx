"use client";

import { useEffect, useState } from "react";
import { QuestionsApi } from "@/api";
import { Paginated, Question, UiState } from "@/types";
import styles from "./Questions.module.css";

type Props = {
  slug: string;
};

export default function Questions({ slug }: Props) {
  const [uiState, setUiState] = useState<UiState>("initial");
  const [questions, setQuestions] = useState<Paginated<Question> | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number | null>>({});
  const [answered, setAnswered] = useState<Record<number, boolean>>({});

  useEffect(() => {
    async function fetchData() {
      setUiState("loading");

      const api = new QuestionsApi();
      const questionsResponse = await api.getQuestionsByCategory(slug);

      if (!questionsResponse) {
        setUiState("error");
      } else {
        setUiState("data");
        setQuestions(questionsResponse);
      }
    }
    fetchData();
  }, [slug]);

  const handleAnswerSelect = (questionId: number, answerId: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answerId,
    }));
  };

  const handleSubmit = (questionId: number) => {
    if (selectedAnswers[questionId] !== undefined) {
      setAnswered((prev) => ({
        ...prev,
        [questionId]: true,
      }));
    }
  };

  return (
    <div className={styles.questions}>
      <h2>Spurningar ({questions?.total ?? 0})</h2>

      {uiState === "loading" && <p>🔄 Sæki spurningar...</p>}
      {uiState === "error" && <p>❌ Villa við að sækja spurningar</p>}
      {uiState === "data" && (
        <ul className={styles.questionList}>
          {questions?.data.map((question) => (
            <li key={question.id} className={styles.question}>
              <h3>{question.text}</h3>
              <ul className={styles.answerList}>
                {question.answers.map((answer) => (
                  <li key={answer.id} className={styles.answerItem}>
                    <label className={styles.answerLabel}>
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={answer.id}
                        checked={selectedAnswers[question.id] === answer.id}
                        onChange={() => handleAnswerSelect(question.id, answer.id)}
                        disabled={answered[question.id]}
                      />
                      {answer.text}
                    </label>
                  </li>
                ))}
              </ul>
              {!answered[question.id] ? (
                  <button className={styles.submitButton} onClick={() => handleSubmit(question.id)}>
                    Senda svar
                  </button>
                ) : (
                  <p
                    className={`${styles.feedback} ${
                      selectedAnswers[question.id] === question.answers.find((a) => a.correct)?.id
                        ? styles.correct
                        : styles.incorrect
                    }`}
                  >
                    {selectedAnswers[question.id] === question.answers.find((a) => a.correct)?.id
                      ? "Rétt svar!"
                      : "Rangt svar!"}
                  </p>
                )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
