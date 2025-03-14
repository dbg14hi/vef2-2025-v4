'use client';

import { useState } from 'react';
import { QuestionsApi } from '@/api';
import styles from './CategoryForm.module.css';

type Props = {
  initialName?: string;
  categoryId?: string;
  onSuccess: () => void;
  onCancel?: () => void;
};

export default function CategoryForm({ initialName = '', categoryId, onSuccess, onCancel }: Props) {
  const [name, setName] = useState(initialName);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const api = new QuestionsApi();
    const response = categoryId
      ? await api.updateCategory(categoryId, name) // Edit existing category
      : await api.createCategory(name); // Create new category

    setLoading(false);

    if (response) {
      onSuccess();
    } else {
      setError('Villa við að vista flokk');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nafn flokks"
        required
        className={styles.input}
      />
      <div className={styles.buttonGroup}>
        <button type="submit" className={styles.submitButton} disabled={loading}>
          {categoryId ? 'Uppfæra flokk' : 'Búa til flokk'}
        </button>
        {onCancel && <button type="button" className={styles.cancelButton} onClick={onCancel}>Hætta við</button>}
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </form>
  );
}
