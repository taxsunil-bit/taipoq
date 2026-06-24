export type UpcomingExam = {
  id: string;
  examName: string;
  department: string;
  qualification: string;
  notificationWindow: string;
  examWindow: string;
  typingRequired: string;
  status: string;
  officialSourceLabel: string;
  officialSourceUrl: string;
  prepareLink: string;
  preparationFocus: string;
  lastChecked: string;
  active: boolean;
};

export type UpcomingExamsPayload = {
  exams: UpcomingExam[];
  lastUpdated?: string;
};
