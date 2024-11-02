export type ReviewCommentAiDto = {
  postTitle: string;
  postMetaDescription?: string;
  comment: string;
};

export type CommentReviewResponse = {
  responseText?: string;
  score?: CommentScore;
};

export enum CommentScore {
  Good = 'Good',
  Unknown = 'Unknown',
  Bad = 'Bad',
  VeryBad = 'VeryBad',
}
