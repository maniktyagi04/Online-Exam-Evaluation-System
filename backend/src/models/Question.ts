export enum QuestionType {
  MCQ = 'MCQ',
  DESCRIPTIVE = 'DESCRIPTIVE',
}

export interface OptionData {
  id: string;
  optionText: string;
  isCorrect: boolean;
}

/**
 * Abstract Question class — defines the evaluate() contract.
 * MCQQuestion and DescriptiveQuestion implement this (Polymorphism).
 */
export abstract class Question {
  protected readonly id: string;
  protected readonly examId: string;
  protected readonly text: string;
  protected readonly type: QuestionType;
  protected readonly marks: number;
  protected readonly keywords: string | null;

  constructor(
    id: string,
    examId: string,
    text: string,
    type: QuestionType,
    marks: number,
    keywords: string | null = null
  ) {
    this.id = id;
    this.examId = examId;
    this.text = text;
    this.type = type;
    this.marks = marks;
    this.keywords = keywords;
  }

  getId(): string { return this.id; }
  getExamId(): string { return this.examId; }
  getText(): string { return this.text; }
  getType(): QuestionType { return this.type; }
  getMarks(): number { return this.marks; }
  getKeywords(): string | null { return this.keywords; }

  /**
   * Evaluates the student's answer and returns awarded marks.
   * Each subclass implements this differently (Polymorphism).
   */
  abstract evaluate(answer: string): number;
}
