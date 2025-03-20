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
    // Handle specific HTTP status codes
    switch (response.status) {
      case 400:
        console.error(`Bad request: ${url}`);
        break;
      case 404:
        console.error(`Not found: ${url}`);
        return null;
      case 500:
        console.error(`Server error at ${url}`);
        break;
      default:
        console.error(`Unexpected response (${response.status}) from ${url}`);
      }
      return null;
    }

    if (response.status === 204) {
      return null; // No JSON to parse
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

  
  // api.ts
async getCategories(limit?: number, offset?: number): Promise<Paginated<Category> | null> {
  let url = BASE_URL + '/categories';
  if (limit !== undefined && offset !== undefined) {
      url += `?limit=${limit}&offset=${offset}`;
  }
  
  const response = await this.fetchFromApi<Paginated<Category>>(url);
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
    const response = await this.fetchFromApi<boolean>(`${BASE_URL}/categories/${slug}`, {
      method: 'DELETE',
    });
  
    return response === null; 
  }

  async getQuestionsByCategory(slug: string): Promise<Paginated<Question> | null> {
    const url = `${BASE_URL}/questions?category=${slug}`;
    console.log("🔍 Fetching questions for category:", slug);
  
    const response = await this.fetchFromApi<Paginated<Question> | null>(url);
  
    return response;
  }

  async createQuestion(
    text: string,
    categoryId: number,
    answers: { text: string; correct: boolean }[]
  ): Promise<Question | null> {
    return this.fetchFromApi<Question>(`${BASE_URL}/questions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, categoryId, answers }),
    });
  }
  
}
