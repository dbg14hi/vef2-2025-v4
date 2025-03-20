// pages/questions/create.tsx
"use client";

import { useEffect, useState } from "react";
import QuestionForm from "@/components/QuestionForm/QuestionForm";
import { QuestionsApi } from "@/api";
import { Category } from "@/types";

export default function CreateQuestionPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      setLoading(true);
      setError(null);

      try {
        const api = new QuestionsApi();
        const response = await api.getCategories();
        if (response) {
          setCategories(response.data);
        } else {
          setError("Ekki tókst að sækja flokka.");
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Villa við að sækja flokka. Vinsamlegast reyndu aftur.");
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        Búa til spurningu
      </h1>

      {loading && <p style={{ textAlign: "center" }}>Sæki flokka...</p>}

      {error && (
        <p style={{ textAlign: "center", color: "#e74c3c", marginBottom: "20px" }}>
          {error}
        </p>
      )}

      {!loading && !error && (
        <QuestionForm
          categories={categories}
          onSuccess={() => (window.location.href = "/categories")}
        />
      )}
    </div>
  );
}