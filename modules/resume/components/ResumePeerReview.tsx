"use client";

import ActionRow from "@/core/ui/ActionRow";
import PanelCard from "@/core/ui/PanelCard";
import { useReviews } from "@/core/reviews/ReviewProvider";
import { useUser } from "@/core/user/UserProvider";

export default function ResumePeerReview() {
  const { user, activeResumeId } = useUser();
  const {
    reviewers,
    reviewRequests,
    creditTransactions,
    requestReview,
    completeReview,
  } = useReviews();

  const activeResume =
    user.resumes.find((resume) => resume.id === activeResumeId) ??
    user.resumes[0];

  const activeResumeRequests = reviewRequests.filter(
    (request) => request.resumeId === activeResume?.id
  );

  function handleRequestReview(reviewerId: string) {
    if (!activeResume) {
      return;
    }

    requestReview(activeResume.id, user.id, reviewerId);
  }

  function getReviewerCredits(reviewerId: string) {
    return creditTransactions
      .filter((transaction) => transaction.userId === reviewerId)
      .reduce((total, transaction) => total + transaction.amount, 0);
  }

  return (
    <PanelCard title="Peer Review">
      <div className="mb-3 text-xs text-slate-500">
        Request feedback for {activeResume?.name ?? "selected resume"}.
      </div>

      <div className="mb-4">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Available Reviewers
        </div>

        {reviewers
          .filter((reviewer) => reviewer.isReviewer)
          .map((reviewer) => (
            <button
              key={reviewer.id}
              onClick={() => handleRequestReview(reviewer.id)}
              className="flex w-full justify-between rounded-xl px-3 py-2 text-left text-xs font-medium text-slate-500 hover:bg-blue-50 hover:text-blue-600"
            >
              <span className="truncate pr-2">
                {reviewer.name}
                <span className="ml-1 text-slate-400">
                  · {reviewer.industry}
                </span>
              </span>

              <span className="text-blue-600">
                {getReviewerCredits(reviewer.id)} credits
              </span>
            </button>
          ))}
      </div>

      <div className="mb-4">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Invite to Review
        </div>

        {reviewers
          .filter((reviewer) => !reviewer.isReviewer)
          .map((reviewer) => (
            <button
              key={reviewer.id}
              onClick={() => handleRequestReview(reviewer.id)}
              className="flex w-full justify-between rounded-xl px-3 py-2 text-left text-xs font-medium text-slate-500 hover:bg-blue-50 hover:text-blue-600"
            >
              <span className="truncate pr-2">
                {reviewer.name}
                <span className="ml-1 text-slate-400">· Not a reviewer</span>
              </span>

              <span className="text-blue-600">Invite</span>
            </button>
          ))}
      </div>

      <div className="border-t border-slate-100 pt-3">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Requests
        </div>

        {activeResumeRequests.length === 0 ? (
          <ActionRow label="No requests yet" value="0" />
        ) : (
          activeResumeRequests.map((request) => {
            const reviewer = reviewers.find(
              (item) => item.id === request.reviewerId
            );

            return (
              <button
                key={request.id}
                onClick={() => completeReview(request.id)}
                className="flex w-full justify-between rounded-xl px-3 py-2 text-xs font-medium text-slate-500 hover:bg-blue-50 hover:text-blue-600"
              >
                <span>{reviewer?.name ?? "Reviewer"}</span>
                <span className="text-blue-600">
                  {request.status === "completed" ? "completed" : "complete"}
                </span>
              </button>
            );
          })
        )}
      </div>
    </PanelCard>
  );
}