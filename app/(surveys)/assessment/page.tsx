import type { Metadata } from 'next'
import AssessmentShell from '@/components/marketing/assessment/AssessmentShell'

export const metadata: Metadata = {
  title: 'Take the Marchitect Assessment',
  description:
    "Answer 7 questions and find out what's breaking your marketing ROI. Takes 5 minutes. Ends with an option to book a free call.",
}

export default function AssessmentPage() {
  return <AssessmentShell />
}
