"use client";

import ActionRow from "@/core/ui/ActionRow";
import PanelCard from "@/core/ui/PanelCard";
import { useReviews } from "@/core/reviews/ReviewProvider";
import { useUser } from "@/core/user/UserProvider";

type ResumePeerReviewProps = {
  onBack?: () => void;
};

export default function ResumePeerReview({ onBack }: ResumePeerReviewProps) {
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
      {onBack && (
        <div className="mb-3">
          <ActionRow label="Back to Actions" action="Back" onClick={onBack} />
        </div>
      )}

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
            <ActionRow
              key={reviewer.id}
              label={`${reviewer.name} · ${reviewer.industry}`}
              value={`${getReviewerCredits(reviewer.id)} credits`}
              onClick={() => handleRequestReview(reviewer.id)}
            />
          ))}
      </div>

      <div className="mb-4">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Invite to Review
        </div>

        {reviewers
          .filter((reviewer) => !reviewer.isReviewer)
          .map((reviewer) => (
            <ActionRow
              key={reviewer.id}
              label={`${reviewer.name} · Not a reviewer`}
              action="Invite"
              onClick={() => handleRequestReview(reviewer.id)}
            />
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
              <ActionRow
                key={request.id}
                label={reviewer?.name ?? "Reviewer"}
                action={request.status === "completed" ? "completed" : "complete"}
                onClick={() => completeReview(request.id)}
              />
            );
          })
        )}
      </div>
    </PanelCard>
  );
}