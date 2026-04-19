import { Question, QuestionType, OptionData } from './Question';

/**
 * MCQQuestion — auto-evaluates by matching answered option to correct option.
 */
export class MCQQuestion extends Question {
  private readonly options: OptionData[];

  constructor(
    id: string,
    examId: string,
    text: string,
    marks: number,
    options: OptionData[]
  ) {
    super(id, examId, text, QuestionType.MCQ, marks);
    this.options = options;
  }

  /**
   * Returns full marks if the answered option ID matches the correct option.
   * Returns 0 otherwise.
   */
  evaluate(answer: string): number {
    const correctOption = this.options.find((opt) => opt.isCorrect);
    if (!correctOption) return 0;
    return correctOption.id === answer ? this.marks : 0;
  }

  getOptions(): OptionData[] {
    return this.options;
  }
}
