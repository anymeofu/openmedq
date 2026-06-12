import { ArrowLeft, Shield } from 'lucide-react';

interface PrivacyPolicyProps {
  onBack: () => void;
}

export function PrivacyPolicy({ onBack }: PrivacyPolicyProps) {
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
          <span className="text-xs font-bold uppercase tracking-wider text-clay-pink mb-2 block">Privacy Statement</span>
          <h1 className="font-rubik text-3xl md:text-5xl font-medium tracking-[-0.04em] text-clay-ink mb-4">
            Privacy Policy
          </h1>
          <p className="text-clay-muted text-xs md:text-sm">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric', day: 'numeric' })}
          </p>
        </div>

        {/* Highlight Callout */}
        <div className="bg-clay-teal/10 border border-clay-mint rounded-clay-md p-4 mb-8 flex gap-3 items-start text-clay-ink">
          <Shield className="w-5 h-5 text-clay-mint shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm leading-relaxed font-medium">
            <strong>PRIVACY-FIRST PHILOSOPHY:</strong> OpenMedQ is built Local-First. By default, your cards, solved history, bookmarks, and streaks stay inside your browser (IndexedDB). They never touch our servers unless you opt to sign up and sync them across devices.
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-8 text-clay-body text-xs sm:text-sm md:text-base leading-relaxed">
          
          <section>
            <h2 className="font-bold text-clay-ink text-sm sm:text-base md:text-lg mb-3">1. Information We Collect (Local-First Model)</h2>
            <p>
              By default in <strong>Guest Mode</strong>, OpenMedQ does not require credentials, emails, or personal profiles.
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1.5">
              <li>
                <strong>Local Application Progress:</strong> Your solved questions, card stability weights, rating logs (Again, Hard, Good, Easy), and bookmarks are stored client-side in your browser via <strong>IndexedDB</strong>.
              </li>
              <li>
                <strong>Session Preferences:</strong> Your selected theme preference (light/dark mode) and daily streak indicators are cached in your browser's local storage.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-clay-ink text-sm sm:text-base md:text-lg mb-3">2. Cloud Syncing and Clerk Authentication</h2>
            <p>
              If you choose to create an account or sign in to sync study history across devices (e.g., laptop and phone):
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1.5">
              <li>
                <strong>Authentication:</strong> We use <strong>Clerk</strong> to handle sign-ins, sign-ups, and sessions securely. Clerk may collect email addresses, usernames, and profile metadata.
              </li>
              <li>
                <strong>Essential Cookies:</strong> Clerk sets essential security and session cookies in your browser. These cookies are strictly necessary to maintain your authenticated session, verify requests, and prevent cross-site request forgery (CSRF). We do not use tracking pixels or advertising cookies.
              </li>
              <li>
                <strong>Lightweight Sync Data:</strong> When logged in, your local progress states are encrypted and merged with our secure backend database (Cloudflare D1) using compressed JSON payloads. We do not inspect individual answers or responses for commercial profiling.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-clay-ink text-sm sm:text-base md:text-lg mb-3">3. How We Use and Share Information</h2>
            <p>
              OpenMedQ has <strong>zero commercial interest</strong>. We have no corporate parent company, no sales quotas, and no advertisements.
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1.5">
              <li>
                <strong>No Selling of Data:</strong> We do not sell, rent, license, or share your email addresses, study schedules, or performance details with pharmaceutical companies, coaching institutes, or data brokers.
              </li>
              <li>
                <strong>Open Source Integrity:</strong> Only compressed database values required for sync and streak leaderboards are processed. No tracking pixels or advertising cookies are integrated.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-clay-ink text-sm sm:text-base md:text-lg mb-3">4. Indian DPDPA & GDPR Compliance</h2>
            <p>
              We respect your rights under the Digital Personal Data Protection Act (DPDPA, India) and General Data Protection Regulation (GDPR, EU):
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1.5">
              <li>
                <strong>Right to Erase:</strong> You can completely wipe your local IndexedDB and localStorage cache at any time via your browser settings.
              </li>
              <li>
                <strong>Right to Delete Account:</strong> If you signed up, you can request account deletion. Once requested, your Clerk profile and associated Cloudflare D1 database rows are purged completely.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-clay-ink text-sm sm:text-base md:text-lg mb-3">5. Data Retention</h2>
            <p>
              We retain sync data only as long as you maintain an active account. If an account remains inactive for over twelve (12) consecutive months, we reserve the right to delete the backend sync copy to conserve free-tier Cloudflare resources, while your local browser copy will remain unaffected.
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
