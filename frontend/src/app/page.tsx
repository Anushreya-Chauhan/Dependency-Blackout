import Hero from '@/components/landing/Hero';
import ProblemSection from '@/components/landing/ProblemSection';
import PipelineSteps from '@/components/landing/PipelineSteps';
import StatsBar from '@/components/landing/StatsBar';
import CTASection from '@/components/landing/CTASection';

export default function Home() {
  return (
    <>
      <Hero />
      <ProblemSection />
      <PipelineSteps />
      <StatsBar />
      <CTASection />
    </>
  );
}
