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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchCategories();
  }, [currentPage]);

  async function fetchCategories() {
    setUiState('loading');
    const api = new QuestionsApi();
    
    let categoriesResponse;
    if (currentPage === 1) {
      // For page 1, use the default endpoint without parameters
      categoriesResponse = await api.getCategories();
    } else {
      // For subsequent pages, calculate offset
      const offset = (currentPage - 1) * itemsPerPage;
      categoriesResponse = await api.getCategories(itemsPerPage, offset);
    }

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

  const totalPages = categories?.total ? Math.ceil(categories.total / itemsPerPage) : 1;

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

          {/* Pagination Controls - Only show if total > itemsPerPage */}
          {categories.total > itemsPerPage && (
            <div className={styles.pagination}>
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className={styles.paginationButton}
              >
                Fyrri
              </button>
              <span className={styles.pageInfo}>
                Síða {currentPage} af {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages || categories.data.length < itemsPerPage}
                className={styles.paginationButton}
              >
                Næsta
              </button>
            </div>
          )}

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