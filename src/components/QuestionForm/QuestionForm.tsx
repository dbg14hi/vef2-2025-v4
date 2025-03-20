"use client";

import { useState } from "react";
import { QuestionsApi } from "@/api";
import styles from "./QuestionForm.module.css";

type CategoryOption = { id: string; name: string };
type Answer = { text: string; correct: boolean };
type Props = {
  onSuccess: () => void;
  categories: CategoryOption[];
};

export default function QuestionForm({ onSuccess, categories }: Props) {
  const [text, setText] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Answer[]>(Array(4).fill({ text: "", correct: false }));
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!text.trim()) newErrors.text = "Spurning má ekki vera tóm";
    if (!categoryId) newErrors.category = "Þú verður að velja flokk";
    if (answers.some(a => !a.text.trim())) newErrors.answers = "Öll svör verða að vera útfyllt";
    if (answers.filter(a => a.correct).length !== 1) newErrors.answers = "Það þarf nákvæmlega eitt rétt svar";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const api = new QuestionsApi();
    const result = await api.createQuestion(text, Number(categoryId), answers);

    if (result) {
      setText("");
      setCategoryId(null);
      setAnswers(Array(4).fill({ text: "", correct: false }));
      setErrors({});
      onSuccess();
    } else {
      setErrors({ general: "Villa við að búa til spurningu" });
    }
  };

  const updateAnswer = (index: number, field: keyof Answer, value: string | boolean) => {
    const updatedAnswers = answers.map((answer, i) =>
      i === index ? { ...answer, [field]: value } : answer
    );
    if (field === "correct" && value === true) updatedAnswers.forEach((a, i) => (i !== index ? (a.correct = false) : null));
    setAnswers(updatedAnswers);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <h2 className={styles.title}>Búa til spurningu</h2>
      {errors.general && <p className={styles.error}>{errors.general}</p>}

      <label>Spurning:</label>
      <input type="text" value={text} onChange={(e) => setText(e.target.value)} className={errors.text ? styles.errorInput : ""} />

      <label>Flokkur:</label>
      <select value={categoryId ?? ""} onChange={(e) => setCategoryId(e.target.value)} className={errors.category ? styles.errorInput : ""}>
        <option value="">Veldu flokk</option>
        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
      </select>

      <h3>Svör</h3>
      {answers.map((answer, index) => (
        <div key={index} className={styles.answerItem}>
          <input type="text" value={answer.text} onChange={(e) => updateAnswer(index, "text", e.target.value)} />
          <label>
            <input type="checkbox" checked={answer.correct} onChange={(e) => updateAnswer(index, "correct", e.target.checked)} />
            Rétt svar
          </label>
        </div>
      ))}
      {errors.answers && <p className={styles.error}>{errors.answers}</p>}

      <button type="submit" className={styles.submitButton}>Búa til spurningu</button>
    </form>
  );
}
