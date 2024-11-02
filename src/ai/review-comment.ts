import {
  GenerateContentResult,
  HarmProbability,
  SafetyRating,
} from '@google/generative-ai';

import {
  CommentReviewResponse,
  CommentScore,
  ReviewCommentAiDto,
} from '@/ai/dto/review-comment.ai.dto';
import { genAi } from '@/lib/gen-ai';

export async function reviewComment(
  dto: ReviewCommentAiDto,
): Promise<CommentReviewResponse> {
  const { postTitle, postMetaDescription, comment } = dto;

  const prompt = `Evaluate the user's comment based on the following criteria:

1. Assess whether the comment is generally appropriate (e.g., no offensive language, spam, or inappropriate content).

2. If the "subject" provides enough context, check the comment for relevance. Be lenient on relevance - only flag it as bad if the comment is clearly off-topic. If you're unsure about its relevance or appropriateness, choose "${
    CommentScore.Unknown
  }".

Return only one of the following values (exactly as shown):
- "${CommentScore.Good}" (if the comment is appropriate and possibly relevant),
- "${
    CommentScore.Bad
  }" (if the comment is inappropriate, regardless of relevance),
- "${
    CommentScore.VeryBad
  }" (if the comment is harmful or very inappropriate, regardless of relevance),
- "${
    CommentScore.Unknown
  }" (if you cannot confidently determine its appropriateness or relevance).

Subject: A blog post with title "${postTitle}"${
    postMetaDescription
      ? ' and meta description "' + postMetaDescription + '"'
      : ''
  }
User's comment: "${comment}"
    
Please respond with only one of the specified values: "${
    CommentScore.Good
  }", "${CommentScore.Bad}", "${CommentScore.VeryBad}", or "${
    CommentScore.Unknown
  }".`;

  return await reviewCommentWithAi(prompt);
}

async function reviewCommentWithAi(
  prompt: string,
): Promise<CommentReviewResponse> {
  const result: CommentReviewResponse = {
    score: CommentScore.Unknown,
    responseText: undefined,
  };

  // limit prompt/token size?
  if (!prompt || prompt.length > 5000) {
    return {};
  }

  try {
    const promprResult = await genAi().generateContent(prompt);

    const responseText = promprResult?.response.text().trim();

    if (responseText) {
      for (const value of Object.values(CommentScore)) {
        if (value === responseText) {
          result.score = value;
        }
      }
    }
  } catch (error: any) {
    result.score = getCommentScore(error);
  }

  return result;
}

function getCommentScore(error?: GenerateContentResult): CommentScore {
  let safetyRatings: SafetyRating[] = [];

  (error?.response?.candidates ?? []).forEach((c) => {
    if (c.safetyRatings && c.safetyRatings.length > 0) {
      safetyRatings = [...safetyRatings, ...c.safetyRatings];
    }
  });

  let score = CommentScore.Unknown;

  for (const r of safetyRatings) {
    if (
      r.probability === HarmProbability.MEDIUM ||
      r.probability === HarmProbability.HIGH
    ) {
      score = CommentScore.VeryBad;

      break;
    }
  }

  return score;
}
