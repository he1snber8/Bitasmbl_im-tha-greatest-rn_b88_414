export interface GetRecruiterSubtaskFeedback {
  submittedSubTaskId: number;
  summary: string;
  riskLevel: string;
  confidence: number;
  feedback: string[];
}
