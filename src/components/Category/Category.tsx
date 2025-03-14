'use client';

import { QuestionsApi } from '@/api';
import { Category as CategoryType } from '@/types';
import { useEffect, useState } from 'react';
import Questions from '../Questions/Questions';
import styles from './Category.module.css';

export function Category({ slug }: { slug: string }) {
  const [category, setCategory] = useState<CategoryType | null>(null);

  useEffect(() => {
    async function fetchData() {
      const api = new QuestionsApi();
      const response = await api.getCategory(slug);
      setCategory(response);
    }
    fetchData();
  }, [slug]);

  if (!category) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorMessage}> Flokkur fannst ekki!</p>
      </div>
    );
  }

  return (
    <div className={styles.categoryContainer}>
      <h1 className={styles.categoryTitle}>{category.name}</h1>
      <Questions slug={slug} />
    </div>
  );
}
