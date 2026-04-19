import { Question, QuestionType } from './Question';

/**
 * DescriptiveQuestion — returns 0 by default (requires manual grading).
 * The evaluate() method is a placeholder for future NLP/manual grading.
 */
export class DescriptiveQuestion extends Question {
  constructor(
    id: string,
    examId: string,
    text: string,
    marks: number,
    keywords: string | null = null
  ) {
    super(id, examId, text, QuestionType.DESCRIPTIVE, marks, keywords);
  }

  /**
   * Brain Evaluation Logic:
   * Counts how many unique keywords are present in the student's answer.
   * Keyword matching is case-insensitive.
   * Score = (Matched Keywords / Total Keywords) * Max Marks.
   */
  evaluate(answer: string): number {
    if (!this.keywords || this.keywords.trim() === '') {
      // If no keywords set, award 50% for any meaningful answer, else 0
      return answer.trim().length > 10 ? this.marks * 0.5 : 0;
    }

    const keywordList = this.keywords
      .split(',')
      .map((k) => k.trim().toLowerCase())
      .filter((k) => k.length > 0);

    if (keywordList.length === 0) return this.marks * 0.5;

    const lowerAnswer = answer.toLowerCase();
    let matchedCount = 0;

    keywordList.forEach((keyword) => {
      // Use word boundary to avoid partial matches (optional, but smarter)
      const regex = new RegExp(`\\b${keyword}\\b`, 'i');
      if (regex.test(lowerAnswer)) {
        matchedCount++;
      }
    });

    const score = (matchedCount / keywordList.length) * this.marks;
    return Number(score.toFixed(2));
  }

  getMaxMarks(): number {
    return this.marks;
  }
}
