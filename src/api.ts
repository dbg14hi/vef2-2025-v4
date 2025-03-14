import { Category, Paginated, Question } from './types';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:8000';

export class QuestionsApi {
  async fetchFromApi<T>(url: string, options?: RequestInit): Promise<T | null> {
    let response: Response | undefined;
    try {
      response = await fetch(url, options);
    } catch (e) {
      console.error('error fetching from api', url, e);
      return null;
    }

    if (!response.ok) {
      console.error('non 2xx status from API', url);
      return null;
    }

    let json: unknown;
    try {
      json = await response.json();
    } catch (e) {
      console.error('error parsing json', url, e);
      return null;
    }

    return json as T;
  }

  async getCategories(): Promise<Paginated<Category> | null> {
    const url = BASE_URL + '/categories';

    const response = await this.fetchFromApi<Paginated<Category>>(url);

    // TODO hér gæti ég staðfest gerð gagna

    return response;
  }

  async getCategory(slug: string): Promise<Category | null> {
    const url = BASE_URL + `/categories/${slug}`;

    const response = await this.fetchFromApi<Category | null>(url);

    return response;
  }

  async createCategory(name: string): Promise<Category | null> {
    return this.fetchFromApi<Category>(`${BASE_URL}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
  }

  async updateCategory(slug: string, name: string): Promise<Category | null> {
    return this.fetchFromApi<Category>(`${BASE_URL}/categories/${slug}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
  }

  async deleteCategory(slug: string): Promise<boolean> {
    const response = await fetch(`${BASE_URL}/categories/${slug}`, { method: 'DELETE' });
    return response.ok;
  }

  async getQuestionsByCategory(slug: string): Promise<Paginated<Question> | null> {
    const url = `${BASE_URL}/questions?category=${slug}`;
    console.log("🔍 Fetching questions for category:", slug);
  
    const response = await this.fetchFromApi<Paginated<Question> | null>(url);
  
    return response;
  }
}
