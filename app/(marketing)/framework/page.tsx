import FrameworkHero from '@/components/marketing/framework/FrameworkHero';
import FrameworkOverview from '@/components/marketing/framework/FrameworkOverview';
import ProofPanel from '@/components/marketing/framework/ProofPanel';
import PositioningBlock from '@/components/marketing/framework/PositioningBlock';
import ExecutionBoundary from '@/components/marketing/framework/ExecutionBoundary';
import ClosingCta from '@/components/marketing/shared/ClosingCta';

export const metadata = {
  title: 'The Marchitect Framework | Five Pillars of Marketing Architecture',
  description:
    'Understand the five foundational pillars Marchitect uses to diagnose, install, and enable your marketing architecture.',
};

export default function FrameworkPage() {
  return (
    <>
      <FrameworkHero />
      <FrameworkOverview />
      <ProofPanel />
      <PositioningBlock />
      <ExecutionBoundary />
      <ClosingCta
        heading="Ready to Apply the Framework?"
        body="Take the 5-minute assessment to see exactly which pillars are broken in your marketing architecture."
      />
    </>
  );
}
