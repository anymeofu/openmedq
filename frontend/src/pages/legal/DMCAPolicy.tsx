import { ArrowLeft, Copyright } from 'lucide-react';

interface DMCAPolicyProps {
  onBack: () => void;
}

export function DMCAPolicy({ onBack }: DMCAPolicyProps) {
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
          <span className="text-xs font-bold uppercase tracking-wider text-clay-pink mb-2 block">Safe Harbor Compliance</span>
          <h1 className="font-rubik text-3xl md:text-5xl font-medium tracking-[-0.04em] text-clay-ink mb-4">
            DMCA & Copyright Policy
          </h1>
          <p className="text-clay-muted text-xs md:text-sm">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric', day: 'numeric' })}
          </p>
        </div>

        {/* Highlight Callout */}
        <div className="bg-clay-teal/10 border border-clay-mint rounded-clay-md p-4 mb-8 flex gap-3 items-start text-clay-ink">
          <Copyright className="w-5 h-5 text-clay-mint shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm leading-relaxed font-medium">
            <strong>INTELLECTUAL PROPERTY COMPLIANCE:</strong> We respect intellectual property rights. If you are a copyright owner (or represent one) and believe that any questions, explanations, or medical reference materials on this platform infringe your copyright, please report them using our takedown procedure below.
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-8 text-clay-body text-xs sm:text-sm md:text-base leading-relaxed">
          
          <section>
            <h2 className="font-bold text-clay-ink text-sm sm:text-base md:text-lg mb-3">1. Safe Harbor Framework</h2>
            <p>
              OpenMedQ functions as a public educational indexing platform under Section 512(c) of the Digital Millennium Copyright Act (DMCA, United States) and Section 79 of the Information Technology Act (India). 
            </p>
            <p className="mt-2">
              Since all questions are compiled automatically from public academic datasets (Hugging Face MedMCQA splitting) and index corrections are contributed by the medical student community, we act as a service provider hosting third-party index items. We expeditiously remove disputed items upon receiving a valid notification.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-clay-ink text-sm sm:text-base md:text-lg mb-3">2. How to File an Infringement Notice</h2>
            <p>
              To file a valid copyright infringement claim, please submit a written notification containing the following details to our support email at <strong>support@openmedq.org</strong> (or open a formal issue on our GitHub repository):
            </p>
            <ol className="list-decimal pl-5 mt-3 space-y-2">
              <li>
                <strong>Identification of copyrighted work:</strong> Provide a detailed description of the copyrighted work you claim is infringed (e.g. name of the original medical textbook, chapter, or question bank identifier).
              </li>
              <li>
                <strong>Identification of infringing material:</strong> Specify the exact question text, subject ID, or topic title as rendered on OpenMedQ, along with screenshots or links so we can locate the item immediately.
              </li>
              <li>
                <strong>Contact Info:</strong> Your full legal name, professional email address, mailing address, and phone number.
              </li>
              <li>
                <strong>Good faith statement:</strong> Include the statement: <em>"I have a good faith belief that the use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law."</em>
              </li>
              <li>
                <strong>Accuracy statement:</strong> Include the statement: <em>"The information in this notification is accurate, and under penalty of perjury, I am the owner or authorized representative of the owner of the copyright that is allegedly infringed."</em>
              </li>
              <li>
                <strong>Signature:</strong> A physical or electronic signature of the copyright owner or authorized representative.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="font-bold text-clay-ink text-sm sm:text-base md:text-lg mb-3">3. Expeditious Takedown Action</h2>
            <p>
              Upon receiving a complete and valid DMCA notice, we will remove or disable access to the disputed question or reference explanation within <strong>48 hours</strong>. 
            </p>
            <p className="mt-2">
              Because OpenMedQ is client-side cached, once we update our main JSON question packs in R2, the changes will reflect on users' devices upon their next sync or application reload.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-clay-ink text-sm sm:text-base md:text-lg mb-3">4. Educational "Fair Use" (Indian Copyright Act)</h2>
            <p>
              Please note that under Section 52(1)(i) of the Indian Copyright Act 1957, the reproduction of work by a teacher or pupil in the course of instruction does not constitute copyright infringement. Since OpenMedQ is completely free, student-built, and designed purely for PG entrance self-assessment, many question references qualify under educational fair dealing exceptions.
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
