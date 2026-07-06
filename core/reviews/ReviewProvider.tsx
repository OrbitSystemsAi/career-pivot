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
  completeReview: (requestId: string) => void;
};

const ReviewContext = createContext<ReviewContextType | null>(null);

const REVIEW_REQUESTS_STORAGE_KEY = "osai.reviewRequests";
const CREDIT_TRANSACTIONS_STORAGE_KEY = "osai.creditTransactions";

export function ReviewProvider({ children }: { children: React.ReactNode }) {
  const [reviewers] = useState<PeerReviewer[]>(mockReviewers);

  const [reviewRequests, setReviewRequests] =
    useState<PeerReviewRequest[]>(mockReviewRequests);

  const [reviewFeedback] =
    useState<PeerReviewFeedback[]>(mockReviewFeedback);

  const [creditTransactions, setCreditTransactions] =
    useState<CreditTransaction[]>(mockCreditTransactions);

  const [hasLoadedStorage, setHasLoadedStorage] = useState(false);

  useEffect(() => {
    const storedRequests = window.localStorage.getItem(
      REVIEW_REQUESTS_STORAGE_KEY
    );

    const storedCredits = window.localStorage.getItem(
      CREDIT_TRANSACTIONS_STORAGE_KEY
    );

    if (storedRequests) {
      try {
        setReviewRequests(JSON.parse(storedRequests));
      } catch {
        setReviewRequests(mockReviewRequests);
      }
    }

    if (storedCredits) {
      try {
        setCreditTransactions(JSON.parse(storedCredits));
      } catch {
        setCreditTransactions(mockCreditTransactions);
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

  function persistCreditTransactions(nextCredits: CreditTransaction[]) {
    setCreditTransactions(nextCredits);

    window.localStorage.setItem(
      CREDIT_TRANSACTIONS_STORAGE_KEY,
      JSON.stringify(nextCredits)
    );
  }

  function requestReview(
    resumeId: string,
    requesterId: string,
    reviewerId: string
  ) {
    const existingRequest = reviewRequests.find(
      (request) =>
        request.resumeId === resumeId &&
        request.reviewerId === reviewerId &&
        request.status !== "completed" &&
        request.status !== "declined"
    );

    if (existingRequest) {
      return;
    }

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

  function completeReview(requestId: string) {
    const request = reviewRequests.find((item) => item.id === requestId);

    if (!request || request.status === "completed") {
      return;
    }

    const nextRequests: PeerReviewRequest[] = reviewRequests.map((item) =>
      item.id === requestId
        ? {
            ...item,
            status: "completed",
          }
        : item
    );

    const newCredit: CreditTransaction = {
      id: `credit-${Date.now()}`,
      userId: request.reviewerId,
      amount: 1,
      reason: "Completed resume peer review",
      createdDate: new Date().toISOString(),
    };

    persistReviewRequests(nextRequests);
    persistCreditTransactions([...creditTransactions, newCredit]);
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
        completeReview,
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