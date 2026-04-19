import { MCQQuestion } from '../models/MCQQuestion';
import { DescriptiveQuestion } from '../models/DescriptiveQuestion';
import { Question } from '../models/Question';
import { QuestionType } from '@prisma/client';

interface AnswerInput {
  questionId: string;
  response: string;
}

interface EvaluatedAnswer {
  questionId: string;
  response: string;
  awardedMarks: number;
}

interface QuestionData {
  id: string;
  examId: string;
  text: string;
  type: string;
  marks: number;
  keywords: string | null;
  options: Array<{ id: string; optionText: string; isCorrect: boolean }>;
}

export class EvaluationService {
  evaluate(
    questions: QuestionData[],
    answers: AnswerInput[]
  ): { evaluated: EvaluatedAnswer[]; totalScore: number } {
    const answerMap = new Map(answers.map((a) => [a.questionId, a.response]));

    const evaluated: EvaluatedAnswer[] = questions.map((q) => {
      const response = answerMap.get(q.id) ?? '';

      let evaluator: Question;
      if (q.type === QuestionType.MCQ) {
        evaluator = new MCQQuestion(
          q.id,
          q.examId,
          q.text,
          q.marks,
          q.options.map((o) => ({
            id: o.id,
            optionText: o.optionText,
            isCorrect: o.isCorrect,
          }))
        );
      } else {
        evaluator = new DescriptiveQuestion(q.id, q.examId, q.text, q.marks, q.keywords);
      }

      const awardedMarks = evaluator.evaluate(response);
      return { questionId: q.id, response, awardedMarks };
    });

    const totalScore = evaluated.reduce((sum, a) => sum + a.awardedMarks, 0);
    return { evaluated, totalScore };
  }
}
