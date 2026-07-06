export type PeerReviewStatus =
  | "requested"
  | "accepted"
  | "declined"
  | "completed";

export type PeerReviewer = {
  id: string;
  name: string;
  title: string;
  industry: string;
  isReviewer: boolean;
  creditsAvailable: number;
};

export type PeerReviewRequest = {
  id: string;
  resumeId: string;
  requesterId: string;
  reviewerId: string;
  status: PeerReviewStatus;
  createdDate: string;
};

export type PeerReviewFeedback = {
  id: string;
  requestId: string;
  strengths: string[];
  improvements: string[];
  rating: number;
  comments: string;
  completedDate: string;
};

export type CreditTransaction = {
  id: string;
  userId: string;
  amount: number;
  reason: string;
  createdDate: string;
};