import { Component, type ErrorInfo, type ReactNode } from 'react';
import { db } from '@/lib/db';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  resetting: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    resetting: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null, resetting: false };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error caught by ErrorBoundary:", error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleHardReset = async () => {
    if (confirm("This will erase all locally saved mock exams, question progress, and theme settings. If you are logged in, your progress will restore on your next sync. Are you sure you want to clear your local database and cache?")) {
      try {
        this.setState({ resetting: true });
        
        // Wipe IndexedDB tables
        await db.transaction('rw', [db.progress, db.reviewLogs, db.userStats, db.questions, db.cachedImages], async () => {
          await db.progress.clear();
          await db.reviewLogs.clear();
          await db.userStats.clear();
          await db.questions.clear();
          await db.cachedImages.clear();
        });

        // Clear local storage and session storage
        localStorage.clear();
        sessionStorage.clear();

        // Reload
        window.location.reload();
      } catch (err) {
        console.error("Failed to reset application state:", err);
        alert("Reset failed. Please clear your browser site data manually.");
        this.setState({ resetting: false });
      }
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#fffaf0] text-[#0a0a0a] flex flex-col items-center justify-center p-6 font-sans relative selection:bg-[#ff1a7d]/20 selection:text-[#ff1a7d]">
          {/* Decorative gradients */}
          <div className="absolute top-0 left-0 w-[50%] h-[50%] bg-[#a394f0]/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-[50%] h-[50%] bg-[#ff7a5c]/5 rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-md w-full bg-white border border-[#e5e5e5] rounded-[16px] p-6 md:p-8 text-center shadow-sm relative z-10">
            {/* Warning indicator */}
            <div className="w-12 h-12 bg-rose-50 border border-rose-200 rounded-[12px] flex items-center justify-center mx-auto mb-6 text-rose-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <h1 className="font-rubik text-2xl md:text-3xl font-medium tracking-[-0.04em] text-neutral-900 mb-3">
              Something went wrong
            </h1>
            
            <p className="text-neutral-500 text-xs sm:text-sm leading-relaxed mb-6">
              OpenMedQ encountered an unexpected rendering error. Your local database is intact, but the current screen failed to load.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
              <button
                onClick={this.handleReload}
                className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs sm:text-sm rounded-[10px] transition-colors cursor-pointer flex-1"
              >
                Reload Page
              </button>
              
              <button
                onClick={this.handleHardReset}
                disabled={this.state.resetting}
                className="px-4 py-2.5 bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 font-bold text-xs sm:text-sm rounded-[10px] transition-all cursor-pointer flex-1 disabled:opacity-50"
              >
                {this.state.resetting ? "Resetting..." : "Wipe & Hard Reset"}
              </button>
            </div>

            {/* Error details details/summary */}
            {this.state.error && (
              <details className="text-left bg-neutral-50 border border-neutral-200 rounded-[10px] p-3 mt-4">
                <summary className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider cursor-pointer hover:text-neutral-700 select-none">
                  Technical Details
                </summary>
                <div className="mt-2 font-mono text-[10px] text-neutral-700 max-h-[150px] overflow-y-auto whitespace-pre-wrap leading-relaxed select-all">
                  {this.state.error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
