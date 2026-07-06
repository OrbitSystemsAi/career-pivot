"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  mockCreditTransactions,
  mockReviewFeedback,
  mockReviewRequests,
  mockReviewers,
} from "./mockReviews";
import type {
  CreditTransaction,
  PeerReviewFeedback,
  PeerReviewer,
  PeerReviewRequest,
} from "./reviewTypes";

type ReviewContextType = {
  reviewers: PeerReviewer[];
  reviewRequests: PeerReviewRequest[];
  reviewFeedback: PeerReviewFeedback[];
  creditTransactions: CreditTransaction[];
  requestReview: (
    resumeId: string,
    requesterId: string,
    reviewerId: string
  ) => void;
};

const ReviewContext = createContext<ReviewContextType | null>(null);

const REVIEW_REQUESTS_STORAGE_KEY = "osai.reviewRequests";

export function ReviewProvider({ children }: { children: React.ReactNode }) {
  const [reviewers] = useState<PeerReviewer[]>(mockReviewers);
  const [reviewRequests, setReviewRequests] =
    useState<PeerReviewRequest[]>(mockReviewRequests);
  const [reviewFeedback] = useState<PeerReviewFeedback[]>(mockReviewFeedback);
  const [creditTransactions] = useState<CreditTransaction[]>(
    mockCreditTransactions
  );
  const [hasLoadedStorage, setHasLoadedStorage] = useState(false);

  useEffect(() => {
    const storedRequests = window.localStorage.getItem(
      REVIEW_REQUESTS_STORAGE_KEY
    );

    if (storedRequests) {
      try {
        setReviewRequests(JSON.parse(storedRequests) as PeerReviewRequest[]);
      } catch {
        setReviewRequests(mockReviewRequests);
      }
    }

    setHasLoadedStorage(true);
  }, []);

  function persistReviewRequests(nextRequests: PeerReviewRequest[]) {
    setReviewRequests(nextRequests);
    window.localStorage.setItem(
      REVIEW_REQUESTS_STORAGE_KEY,
      JSON.stringify(nextRequests)
    );
  }

  function requestReview(
    resumeId: string,
    requesterId: string,
    reviewerId: string
  ) {
    const newRequest: PeerReviewRequest = {
      id: `review-request-${Date.now()}`,
      resumeId,
      requesterId,
      reviewerId,
      status: "requested",
      createdDate: new Date().toISOString(),
    };

    persistReviewRequests([...reviewRequests, newRequest]);
  }

  if (!hasLoadedStorage) {
    return null;
  }

  return (
    <ReviewContext.Provider
      value={{
        reviewers,
        reviewRequests,
        reviewFeedback,
        creditTransactions,
        requestReview,
      }}
    >
      {children}
    </ReviewContext.Provider>
  );
}

export function useReviews() {
  const context = useContext(ReviewContext);

  if (!context) {
    throw new Error("useReviews must be used inside ReviewProvider");
  }

  return context;
}