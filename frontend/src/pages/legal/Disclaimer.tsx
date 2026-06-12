import { ArrowLeft, AlertTriangle } from 'lucide-react';

interface DisclaimerProps {
  onBack: () => void;
}

export function Disclaimer({ onBack }: DisclaimerProps) {
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
          <span className="text-xs font-bold uppercase tracking-wider text-clay-pink mb-2 block">Legal Compliance</span>
          <h1 className="font-rubik text-3xl md:text-5xl font-medium tracking-[-0.04em] text-clay-ink mb-4">
            Legal & Medical Disclaimer
          </h1>
          <p className="text-clay-muted text-xs md:text-sm">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric', day: 'numeric' })}
          </p>
        </div>

        {/* Warning Callout */}
        <div className="bg-clay-ochre/10 border border-clay-ochre rounded-clay-md p-4 mb-8 flex gap-3 items-start text-clay-ink">
          <AlertTriangle className="w-5 h-5 text-clay-ochre shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm leading-relaxed font-medium">
            <strong>CRITICAL NOTICE:</strong> OpenMedQ is a simulated study practice tool. It is NOT clinical advice, medical diagnosis, or diagnostic protocol. Never use this platform for active patient management or real-life clinical decision-making.
          </div>
        </div>

        {/* Legal sections */}
        <div className="space-y-8 text-clay-body text-xs sm:text-sm md:text-base leading-relaxed">
          
          <section>
            <h2 className="font-bold text-clay-ink text-sm sm:text-base md:text-lg mb-3">1. Educational and Study Purposes Only</h2>
            <p>
              OpenMedQ is designed exclusively as an academic study resource for students preparing for Indian medical post-graduate entrance examinations (NEET PG, FMGE, INI-CET, NEXT). The information, multiple-choice questions, and reference explanations provided on this platform are for simulated testing, training, and self-assessment purposes only.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-clay-ink text-sm sm:text-base md:text-lg mb-3">2. No Provider-Patient or Educational Relationship</h2>
            <p>
              Your use of OpenMedQ, including answering clinical vignettes, reviewing reference sheets, or submitting content corrections, does not establish a physician-patient relationship, an educational consulting contract, or a formal academic enrollment with the developer or the host platform.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-clay-ink text-sm sm:text-base md:text-lg mb-3">3. Verification of Clinical Guidelines</h2>
            <p>
              Medical guidelines, drug dosages, diagnostic algorithms, and standard clinical protocols evolve rapidly. While the platform runs checks and processes peer corrections, the content may contain typographical errors, outdated statistics, or inaccuracies. 
            </p>
            <p className="mt-3">
              You must always cross-reference drug dosages, side effects, contraindications, and treatment steps with official standard textbooks (e.g., Harrison's Principles of Internal Medicine, Robbins & Cotran Pathologic Basis of Disease, Bailey & Love's Short Practice of Surgery) or current peer-reviewed hospital practice directives.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-clay-ink text-sm sm:text-base md:text-lg mb-3">4. Trademark and Affiliation Disclosure</h2>
            <p>
              The names and logos of examinations, including NEET PG, FMGE, INI-CET, NEXT, and external applications or algorithms (such as Anki, ts-fsrs), are registered trademarks of their respective governing boards, organizations, and copyright owners. 
            </p>
            <p className="mt-3">
              OpenMedQ is an independent, student-led open-source project. It has <strong>no official affiliation, endorsement, sponsorship, or partnership</strong> with the National Board of Examinations (NBE), All India Institute of Medical Sciences (AIIMS), Hugging Face, or any corporate prep platform.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-clay-ink text-sm sm:text-base md:text-lg mb-3">5. Exclusion of Warranties and Limitation of Liability</h2>
            <p>
              This platform is provided "as is" and "as available" without any warranty of any kind, either express or implied, including but not limited to the implied warranties of merchantability, fitness for a particular purpose, or non-infringement.
            </p>
            <p className="mt-3 font-semibold text-clay-ink">
              In no event shall the solo developer, open-source contributors, or hosting servers be liable for any direct, indirect, incidental, special, exemplary, or consequential damages (including, but not limited to, medical malpractice claims, incorrect diagnostics in practice, clinical errors during hospital duty, or failure to secure specific rank outcomes on exam days) arising in any way out of the use of this software.
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
