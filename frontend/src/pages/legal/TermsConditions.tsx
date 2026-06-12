import { ArrowLeft, Scale } from 'lucide-react';

interface TermsConditionsProps {
  onBack: () => void;
}

export function TermsConditions({ onBack }: TermsConditionsProps) {
  return (
    <div className="min-h-screen bg-clay-canvas text-clay-ink flex flex-col font-sans selection:bg-clay-pink/20 selection:text-clay-pink relative overflow-x-hidden p-6 md:p-12">
      <div className="absolute top-0 left-0 w-[50%] h-[50%] bg-clay-lavender/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-3xl mx-auto w-full relative z-10 text-left">
        {/* Back navigation */}
        <button 
          onClick={onBack}
          className="inline-flex items-center gap-2 text-clay-muted hover:text-clay-ink font-semibold text-sm mb-8 transition-colors duration-200 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        {/* Header */}
        <div className="border-b border-clay-hairline pb-6 mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-clay-pink mb-2 block">Acceptable Usage</span>
          <h1 className="font-rubik text-3xl md:text-5xl font-medium tracking-[-0.04em] text-clay-ink mb-4">
            Terms & Conditions
          </h1>
          <p className="text-clay-muted text-xs md:text-sm">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric', day: 'numeric' })}
          </p>
        </div>

        {/* Highlight Callout */}
        <div className="bg-clay-peach/10 border border-clay-peach rounded-clay-md p-4 mb-8 flex gap-3 items-start text-clay-ink">
          <Scale className="w-5 h-5 text-clay-pink shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm leading-relaxed font-medium">
            <strong>OPEN TERMS:</strong> OpenMedQ is a student-led educational platform. Code is licensed under MIT, and questions are sourced from open datasets. By using this service, you agree to play fair, avoid scraping and abusing our servers, and use the platform solely for study.
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-8 text-clay-body text-xs sm:text-sm md:text-base leading-relaxed">
          
          <section>
            <h2 className="font-bold text-clay-ink text-sm sm:text-base md:text-lg mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing OpenMedQ (either through Guest Mode or with a Clerk Sync Account), you agree to be bound by these Terms & Conditions, all applicable laws and regulations, and agree that you are responsible for compliance with any local laws. If you do not agree with any of these terms, you are prohibited from using this site.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-clay-ink text-sm sm:text-base md:text-lg mb-3">2. License Grant & Open Source Assets</h2>
            <p>
              The materials and intellectual properties of OpenMedQ are split under different open licensing guidelines:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1.5">
              <li>
                <strong>Software Codebase:</strong> The application UI, React components, and Hono backend code are open-source and licensed under the <strong>MIT License</strong>. You are free to inspect, fork, or host local copies on GitHub.
              </li>
              <li>
                <strong>Question Bank Data:</strong> Medical questions and explanation packs are derived from Hugging Face public academic datasets (MedMCQA) and are subject to the <strong>Creative Commons Attribution-ShareAlike 4.0 International (CC-BY-SA 4.0)</strong> license. You may share and adapt this content, provided you attribute it and license derivatives under the same terms.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-clay-ink text-sm sm:text-base md:text-lg mb-3">3. Acceptable Use Policy</h2>
            <p>
              To keep the platform free and operational for all medical students, you agree not to:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1.5">
              <li>
                Engage in automated web scraping, crawling, or bulk downloading of the hosted question packs from our Cloudflare R2 bucket.
              </li>
              <li>
                Attempt to disrupt, overload, or DDOS the Hono sync endpoints.
              </li>
              <li>
                Redistribute or sell question indices or answers commercially under paid paywalls.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-clay-ink text-sm sm:text-base md:text-lg mb-3">4. Disclaimer of Warranties & Solo Dev Notice</h2>
            <p>
              OpenMedQ is maintained by a 3rd year MBBS student as a solo project for the medical community. The service is provided "as is" and "as available". We do not warrant that the website will run uninterrupted, serve error-free explanations, or meet specific exam schedule deadlines. We reserve the right to modify, suspend, or prune sync features based on Cloudflare free tier limitations.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-clay-ink text-sm sm:text-base md:text-lg mb-3">5. Governing Law</h2>
            <p>
              Any claim, dispute, or legal proceeding relating to OpenMedQ shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions, and shall be subject to the exclusive jurisdiction of the courts located in India.
            </p>
          </section>

        </div>

        {/* Footer info */}
        <div className="mt-12 pt-6 border-t border-clay-hairline flex justify-between text-xs text-clay-muted">
          <span>© {new Date().getFullYear()} OpenMedQ</span>
          <span>Open Source MIT License</span>
        </div>
      </div>
    </div>
  );
}
