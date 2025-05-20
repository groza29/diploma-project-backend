import openai from '../config/openaiClient';

/**
 * Uses OpenAI to generate a refined score based on feedback and numeric rating.
 */
export const getAiScoreFromFeedback = async (rating: number, feedback: string): Promise<number> => {
  const prompt = `A user received a rating of ${rating}/5 and the following feedback:\n\n"${feedback}"\n\nBased on both the number and the tone of the feedback, give a fair score between 1000 and 10000. Respond only with the number.`;

  const chat = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: 'You are an evaluator that gives fair, balanced scores based on rating and feedback.',
      },
      { role: 'user', content: prompt },
    ],
  });

  const rawContent = chat.choices[0]?.message?.content?.trim();

  if (!rawContent) {
    throw new Error('No score returned by AI');
  }

  const score = parseFloat(rawContent);

  if (isNaN(score) || score < 1000 || score > 10000) {
    throw new Error(`Invalid score returned by AI: "${rawContent}"`);
  }

  return score;
};
