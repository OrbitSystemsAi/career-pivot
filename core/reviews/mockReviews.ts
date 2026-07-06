import type {
  CreditTransaction,
  PeerReviewFeedback,
  PeerReviewer,
  PeerReviewRequest,
} from "./reviewTypes";

export const mockReviewers: PeerReviewer[] = [
  {
    id: "reviewer-1",
    name: "Vanessa Rivera",
    title: "Healthcare Operations Leader",
    industry: "Healthcare",
    isReviewer: true,
    creditsAvailable: 6,
  },
  {
    id: "reviewer-2",
    name: "Peter Rivera-Pierola",
    title: "Technology Strategy Advisor",
    industry: "Technology",
    isReviewer: true,
    creditsAvailable: 4,
  },
  {
    id: "reviewer-3",
    name: "Stephen Morgan",
    title: "Finance Executive",
    industry: "Finance",
    isReviewer: false,
    creditsAvailable: 0,
  },
];

export const mockReviewRequests: PeerReviewRequest[] = [];

export const mockReviewFeedback: PeerReviewFeedback[] = [];

export const mockCreditTransactions: CreditTransaction[] = [];