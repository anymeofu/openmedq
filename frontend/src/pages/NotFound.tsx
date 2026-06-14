import { AlertCircle, Home, BookOpen, Download, HelpCircle } from 'lucide-react';

interface NotFoundProps {
  onBack: () => void;
  onGoToDashboard: () => void;
  onViewDownload: () => void;
  onViewBlog: () => void;
}

export function NotFound({ onBack, onGoToDashboard, onViewDownload, onViewBlog }: NotFoundProps) {
  return (
    <div className="min-h-screen bg-clay-canvas text-clay-ink flex flex-col items-center justify-center p-6 font-sans selection:bg-clay-pink/20 selection:text-clay-pink relative overflow-hidden">
      {/* Decorative ambient blurs */}
      <div className="absolute top-0 left-0 w-[50%] h-[50%] bg-clay-lavender/5 rounded-full blur-[120px] pointer-events-none animate-ambient-drift" />
      <div className="absolute bottom-0 right-0 w-[50%] h-[50%] bg-clay-peach/5 rounded-full blur-[120px] pointer-events-none animate-ambient-drift" style={{ animationDelay: '-10s' }} />

      <div className="w-full max-w-lg bg-clay-canvas border border-clay-hairline rounded-clay-xl p-8 sm:p-10 text-center shadow-sm relative z-10 animate-fade-in-up">
        {/* Warning Icon Badge */}
        <div className="w-16 h-16 rounded-clay-lg bg-clay-coral/10 text-clay-coral flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8" />
        </div>

        {/* Clinical Case Title */}
        <span className="text-[10px] font-bold uppercase tracking-widest text-clay-pink mb-2 block">
          Clinical Case Error
        </span>
        <h1 className="font-rubik text-2xl sm:text-3xl font-medium tracking-[-0.03em] mb-4 text-clay-ink">
          Diagnosis: 404 Not Found
        </h1>

        {/* Clinical Note Description */}
        <div className="bg-clay-surface-soft border border-clay-hairline rounded-clay-md p-4 text-left mb-8 text-xs sm:text-sm text-clay-body leading-relaxed">
          <p className="font-semibold text-clay-ink mb-1">Subject: Patient Route Missing</p>
          <p className="mb-2">
            The clinical pathway you are searching for does not exist in the OpenMedQ database. It may have been deprecated, relocated, or removed during peer updates.
          </p>
          <div className="border-t border-clay-hairline pt-2 mt-2 flex justify-between text-[11px] text-clay-muted">
            <span>Code: ERR_PATH_NOT_FOUND</span>
            <span>Status: Discharged</span>
          </div>
        </div>

        {/* Quick Recovery Pathways */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8">
          <button
            onClick={onBack}
            className="flex items-center justify-center gap-2 bg-clay-ink hover:bg-neutral-800 text-white font-bold py-3 px-4 rounded-clay-md text-xs sm:text-sm transition-all cursor-pointer shadow-sm"
          >
            <Home className="w-4 h-4" />
            <span>Go to Home Page</span>
          </button>
          
          <button
            onClick={onGoToDashboard}
            className="flex items-center justify-center gap-2 bg-clay-canvas border border-clay-hairline hover:bg-clay-surface-soft text-clay-ink font-semibold py-3 px-4 rounded-clay-md text-xs sm:text-sm transition-all cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-clay-pink" />
            <span>Enter Practice Suite</span>
          </button>
        </div>

        {/* Other helpful pathways */}
        <div className="border-t border-clay-hairline pt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-clay-muted">
          <button
            onClick={onViewBlog}
            className="hover:text-clay-pink transition-colors font-medium flex items-center gap-1 cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Read Study Blog</span>
          </button>
          <button
            onClick={onViewDownload}
            className="hover:text-clay-pink transition-colors font-medium flex items-center gap-1 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Mobile App</span>
          </button>
        </div>
      </div>
      
      <div className="mt-8 text-center text-xs text-clay-muted select-none relative z-10">
        <span>© {new Date().getFullYear()} OpenMedQ • Student Built & Peer Supported</span>
      </div>
    </div>
  );
}
