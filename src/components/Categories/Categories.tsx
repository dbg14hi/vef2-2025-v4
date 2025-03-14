'use client';

import { useEffect, useState } from 'react';
import { QuestionsApi } from '@/api';
import { Category, Paginated, UiState } from '@/types';
import Link from 'next/link';
import CategoryForm from '@/components/CategoryForm/CategoryForm';
import styles from './Categories.module.css';

type Props = {
  title: string;
};

export default function Categories({ title }: Props) {
  const [uiState, setUiState] = useState<UiState>('initial');
  const [categories, setCategories] = useState<Paginated<Category> | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    setUiState('loading');
    const api = new QuestionsApi();
    const categoriesResponse = await api.getCategories();

    if (!categoriesResponse) {
      setUiState('error');
    } else {
      setUiState('data');
      setCategories(categoriesResponse);
    }
  }

  async function handleDelete(slug: string) {
    const api = new QuestionsApi();
    const success = await api.deleteCategory(slug);
    if (success) fetchCategories();
  }

  return (
    <div className={styles.categoriesContainer}>
      <h2 className={styles.title}>{title}</h2>

      {uiState === 'loading' && <p className={styles.loading}>Sæki flokka...</p>}
      {uiState === 'error' && <p className={styles.error}>Villa við að sækja flokka</p>}

      {uiState === 'data' && categories && (
        <>
          <ul className={styles.categoryList}>
            {categories.data.map((category) => (
              <li key={category.id} className={styles.categoryItem}>
                <Link href={`/categories/${category.slug}`} className={styles.categoryLink}>
                  {category.name}
                </Link>
                <div className={styles.buttonGroup}>
                  <button onClick={() => setEditingCategory(category)} className={styles.editButton}>
                    Breyta
                  </button>
                  <button onClick={() => handleDelete(category.slug)} className={styles.deleteButton}>
                    Eyða
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {!editingCategory && (
            <button onClick={() => setShowForm(true)} className={styles.newCategoryButton}>
              Búa til flokk
            </button>
          )}

          {showForm && !editingCategory && (
            <CategoryForm onSuccess={() => { setShowForm(false); fetchCategories(); }} onCancel={() => setShowForm(false)} />
          )}

          {editingCategory && (
            <CategoryForm
              categoryId={editingCategory.slug}
              initialName={editingCategory.name}
              onSuccess={() => { setEditingCategory(null); fetchCategories(); }}
              onCancel={() => setEditingCategory(null)}
            />
          )}
        </>
      )}
    </div>
  );
}
