import { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  Send, 
  Code, 
  Bot, 
  CheckCircle, 
  GitPullRequest, 
  FileText, 
  AlertTriangle, 
  Download, 
  ChevronLeft, 
  ChevronRight,
  Eye
} from 'lucide-react';
import { MarkdownRenderer } from '../../components/MarkdownRenderer';
import { LocalImage } from '../../components/LocalImage';

interface ContributeProps {
  onBack: () => void;
}

interface RawQuestion {
  id: number;
  questionText: string;
  opa: string;
  opb: string;
  opc: string;
  opd: string;
  correctOption: number;
  subjectId: number;
  topicId: number;
  examType?: string;
  examYear?: number;
  explanation?: string;
  imageUrl?: string;
  explanationImageUrl?: string;
  opaImageUrl?: string;
  opbImageUrl?: string;
  opcImageUrl?: string;
  opdImageUrl?: string;
}

interface SchemaError {
  index: number;
  field: string;
  message: string;
}

const DEFAULT_SAMPLE_JSON = `[
  {
    "id": 10001,
    "questionText": "A 45-year-old male presents with high fever, jaundice, and right upper quadrant pain (**Charcot's triad**). Which of the following is the most likely diagnosis?",
    "opa": "Acute Cholecystitis",
    "opb": "Acute Cholangitis",
    "opc": "Choledocholithiasis",
    "opd": "Biliary Colic",
    "correctOption": 1,
    "subjectId": 7,
    "topicId": 245,
    "examType": "NEET_PG",
    "examYear": 2025,
    "explanation": "**Charcot's triad** (fever, jaundice, RUQ pain) is highly specific for **acute cholangitis**, typically caused by biliary tract obstruction and bacterial infection. If altered mental status and hypotension are added, it becomes *Reynolds' pentad*.",
    "imageUrl": "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80"
  },
  {
    "id": 10002,
    "questionText": "An ECG shows ST-segment elevation in leads II, III, and aVF with reciprocal changes in I and aVL. Which coronary artery is most likely occluded?",
    "opa": "Left Anterior Descending (LAD)",
    "opb": "Right Coronary Artery (RCA)",
    "opc": "Left Circumflex (LCX)",
    "opd": "Left Main Coronary Artery",
    "correctOption": 1,
    "subjectId": 3,
    "topicId": 89,
    "examType": "INICET",
    "examYear": 2024,
    "explanation": "ST-segment elevation in inferior leads (II, III, aVF) is diagnostic of an inferior wall MI, most commonly caused by occlusion of the **Right Coronary Artery (RCA)**. Reciprocal ST depression is seen in lateral leads I and aVL.",
    "imageUrl": "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&w=600&q=80"
  },
  {
    "id": 10003,
    "questionText": "A patient presents with weakness in wrist extension ('wrist drop') after sleeping with their arm over the back of a chair. Which nerve structure is injured, and what is its typical cross-sectional anatomy?",
    "opa": "Radial nerve in the spiral groove",
    "opb": "Ulnar nerve at the medial epicondyle",
    "opc": "Median nerve in the carpal tunnel",
    "opd": "Axillary nerve at the surgical neck of the humerus",
    "correctOption": 0,
    "subjectId": 1,
    "topicId": 42,
    "examType": "NEET_PG",
    "examYear": 2024,
    "explanation": "Wrist drop is classic for **radial nerve compression** in the spiral groove (also known as 'Saturday night palsy'). The radial nerve arises from the posterior cord of the brachial plexus and innervates the triceps and wrist extensors.",
    "imageUrl": "https://images.unsplash.com/photo-1530210124550-912dc1381cb8?auto=format&fit=crop&w=600&q=80",
    "explanationImageUrl": "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80",
    "opaImageUrl": "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=300&q=80"
  }
]`;

export function Contribute({ onBack }: ContributeProps) {
  const [activeTab, setActiveTab] = useState<'validator' | 'preview'>('validator');
  const [jsonContent, setJsonContent] = useState<string>(DEFAULT_SAMPLE_JSON);
  const [previewIndex, setPreviewIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // Validate the QBank JSON schema on modification
  const validationResult = useMemo(() => {
    if (!jsonContent.trim()) {
      return { isValid: false, parsedData: [], errors: [], syntaxError: "JSON content is empty." };
    }
    
    try {
      const data = JSON.parse(jsonContent);
      if (!Array.isArray(data)) {
        return { isValid: false, parsedData: [], errors: [], syntaxError: "Root must be a JSON array of questions: [ { ... } ]" };
      }
      
      const errors: SchemaError[] = [];
      data.forEach((item: any, index: number) => {
        // Validate ID
        if (typeof item.id !== 'number') {
          errors.push({ index, field: 'id', message: "Must be a unique number." });
        }
        
        // Validate questionText
        if (typeof item.questionText !== 'string' || item.questionText.trim() === '') {
          errors.push({ index, field: 'questionText', message: "Required. Must be a non-empty string." });
        }
        
        // Validate options
        ['opa', 'opb', 'opc', 'opd'].forEach((op) => {
          if (typeof item[op] !== 'string' || item[op].trim() === '') {
            errors.push({ index, field: op, message: `Option ${op.toUpperCase()} is required and must be a string.` });
          }
        });
        
        // Validate correctOption
        if (typeof item.correctOption !== 'number' || ![0, 1, 2, 3].includes(item.correctOption)) {
          errors.push({ index, field: 'correctOption', message: "Must be a number between 0 and 3 (0=A, 1=B, 2=C, 3=D)." });
        }
        
        // Validate subjectId
        if (typeof item.subjectId !== 'number') {
          errors.push({ index, field: 'subjectId', message: "Required. Must be a number corresponding to the subject." });
        }
        
        // Validate topicId
        if (typeof item.topicId !== 'number') {
          errors.push({ index, field: 'topicId', message: "Required. Must be a number corresponding to the sub-topic." });
        }
        
        // Validate explanation (optional)
        if (item.explanation !== undefined && typeof item.explanation !== 'string') {
          errors.push({ index, field: 'explanation', message: "If provided, must be a valid string." });
        }
        
        // Validate imageUrl (optional)
        if (item.imageUrl !== undefined && typeof item.imageUrl !== 'string') {
          errors.push({ index, field: 'imageUrl', message: "If provided, must be a valid string path." });
        }
        
        // Validate explanationImageUrl (optional)
        if (item.explanationImageUrl !== undefined && typeof item.explanationImageUrl !== 'string') {
          errors.push({ index, field: 'explanationImageUrl', message: "If provided, must be a valid string path." });
        }

        // Validate option image urls (optional)
        ['opaImageUrl', 'opbImageUrl', 'opcImageUrl', 'opdImageUrl'].forEach((opImg) => {
          if (item[opImg] !== undefined && typeof item[opImg] !== 'string') {
            errors.push({ index, field: opImg, message: `If provided, ${opImg} must be a valid string path.` });
          }
        });
      });
      
      return {
        isValid: errors.length === 0,
        parsedData: data as RawQuestion[],
        errors
      };
    } catch (err: any) {
      return {
        isValid: false,
        parsedData: [],
        errors: [],
        syntaxError: err.message || "Invalid JSON syntax."
      };
    }
  }, [jsonContent]);

  // Handle downloading validated JSON
  const handleDownload = () => {
    if (!validationResult.isValid) return;
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `openmedq_pack_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrevQuestion = () => {
    setSelectedOption(null);
    setPreviewIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setPreviewIndex((prev) => Math.min(validationResult.parsedData.length - 1, prev + 1));
  };

  const currentPreviewQuestion = validationResult.parsedData[previewIndex] || null;

  return (
    <div className="min-h-screen bg-clay-canvas text-clay-ink flex flex-col font-sans selection:bg-clay-pink/20 selection:text-clay-pink relative overflow-x-hidden p-4 sm:p-6 md:p-12">
      {/* Ambient background decorative blur */}
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
          <span className="text-xs font-bold uppercase tracking-wider text-clay-pink mb-2 block">Let's Build Together</span>
          <h1 className="font-rubik text-3xl md:text-5xl font-medium tracking-[-0.04em] text-clay-ink mb-4">
            Built in the Trenches. Perfected by You.
          </h1>
          <p className="text-clay-muted text-xs md:text-sm leading-relaxed">
            OpenMedQ is 100% free, forever. No corporate paywalls, no predatory subscription pricing. We are medical students and clinical doctors co-building the resource we actually need. Every correction you submit and every question you contribute saves a peer from studying outdated guidelines at 3 AM. Step up, join us, and leave your mark.
          </p>
        </div>

        <div className="space-y-10">
          {/* Section 1: Telegram Submissions */}
          <section className="bg-white border border-clay-hairline rounded-clay-lg sm:rounded-clay-xl p-4 sm:p-6 md:p-8 relative overflow-hidden transition-all duration-300 hover-clay-card">
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <div className="w-10 h-10 rounded-clay-md bg-[#229ED9]/10 text-[#229ED9] flex items-center justify-center shrink-0">
                <Send className="w-5 h-5 fill-current" />
              </div>
              <div className="flex-1 min-w-0 w-full">
                <h2 className="font-rubik text-xl font-semibold text-clay-ink tracking-tight mb-2">
                  Protect Your Peers: Report Errors & Submit Vignettes
                </h2>
                <p className="text-clay-body text-xs sm:text-sm leading-relaxed mb-4">
                  Clinical guidelines shift, and textbooks have typos. If you spot a wrong answer key or clinical bug while practicing, reporting it takes exactly 15 seconds. Don't let another student memorize an incorrect fact. Join our active Telegram group and keep our community database clinical-grade.
                </p>
                
                <div className="bg-clay-canvas border border-clay-hairline rounded-clay-md p-4 mb-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-clay-ink block mb-2">Recommended Submission Formats:</span>
                  <ul className="space-y-3 text-xs sm:text-sm text-clay-body">
                    <li className="flex gap-2 items-start">
                      <CheckCircle className="w-4.5 h-4.5 text-clay-mint shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0 text-left">
                        <strong>For Corrections:</strong> Simply post the Question ID (found on the card) or a screenshot in our Telegram group. Tell us what is wrong, and drop a quick textbook reference (e.g., Robbins 10th Ed, Page 45) so we can verify and push the live update instantly.
                      </div>
                    </li>
                    <li className="flex gap-2 items-start">
                      <CheckCircle className="w-4.5 h-4.5 text-clay-mint shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0 text-left">
                        <strong>For New Questions:</strong> Submit exam recall questions or custom clinical vignettes using this zero-friction format:
                        <code className="block bg-clay-surface-soft border border-clay-hairline p-2 rounded mt-1.5 text-xs text-clay-ink font-mono whitespace-pre overflow-x-auto w-full max-w-full">
{`[Subject] Pediatrics
[Question] A 3-year-old child presents with...
[Options] A) Option A | B) Option B | C) Option C | D) Option D
[Correct] A
[Explanation] Under normal conditions, the...
[Reference] Ghai Essential Pediatrics, 9th Ed, Page 124`}
                        </code>
                      </div>
                    </li>
                  </ul>
                </div>

                <a 
                  href="https://t.me/openmedq" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#229ED9] hover:bg-[#1e8ec3] text-white font-bold text-xs sm:text-sm rounded-clay-md transition-colors"
                >
                  <Send className="w-4 h-4 fill-current" />
                  <span>Join t.me/openmedq</span>
                </a>
              </div>
            </div>
          </section>

          {/* Section 2: Codebase Contributions */}
          <section className="bg-white border border-clay-hairline rounded-clay-lg sm:rounded-clay-xl p-4 sm:p-6 md:p-8 relative overflow-hidden transition-all duration-300 hover-clay-card">
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <div className="w-10 h-10 rounded-clay-md bg-neutral-100 text-neutral-900 flex items-center justify-center shrink-0">
                <Code className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0 w-full">
                <h2 className="font-rubik text-xl font-semibold text-clay-ink tracking-tight mb-2">
                  Co-Author the Core App on GitHub
                </h2>
                <p className="text-clay-body text-xs sm:text-sm leading-relaxed mb-4">
                  Are you a medical student who writes code, or an open-source developer looking to build something with massive societal value? OpenMedQ is built entirely in the open. Claim feature requests, optimize the spaced repetition scheduler, resolve mobile Expo bugs, and get credited directly as a verified builder in our production release.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="border border-clay-hairline rounded-clay-md p-4 text-left">
                    <span className="text-xs font-bold uppercase tracking-wider text-clay-pink block mb-1">Frontend Stack</span>
                    <span className="text-xs text-clay-muted">Vite, React 19, TypeScript, Tailwind CSS, Dexie (IndexedDB), Lucide Icons</span>
                  </div>
                  <div className="border border-clay-hairline rounded-clay-md p-4 text-left">
                    <span className="text-xs font-bold uppercase tracking-wider text-clay-pink block mb-1">Backend & Mobile</span>
                    <span className="text-xs text-clay-muted">Hono API, Cloudflare Workers, Drizzle ORM, SQLite (D1 & Expo SQLite), React Native & Expo</span>
                  </div>
                </div>

                <a 
                  href="https://github.com/openmedq/openmedq" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs sm:text-sm rounded-clay-md transition-colors"
                >
                  <GitPullRequest className="w-4 h-4" />
                  <span>Explore GitHub Repository</span>
                </a>
              </div>
            </div>
          </section>

          {/* Section 3: Interactive MCQ Playground & Schema Validator */}
          <section className="bg-white border border-clay-hairline rounded-clay-lg sm:rounded-clay-xl p-4 sm:p-6 md:p-8 relative overflow-hidden transition-all duration-300 hover-clay-card text-left">
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <div className="w-10 h-10 rounded-clay-md bg-clay-mint/15 text-clay-mint flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0 w-full">
                <h2 className="font-rubik text-xl font-semibold text-clay-ink tracking-tight mb-2">
                  Interactive QBank Playground & Schema Validator
                </h2>
                <p className="text-clay-body text-xs sm:text-sm leading-relaxed mb-6">
                  Build custom question packs and validate them instantly against our clinical schema. Click the <strong>Live Preview</strong> tab to test exactly how your vignette, options, and explanation render to students practicing on our suite.
                </p>

                {/* Tab Switcher */}
                <div className="flex border-b border-clay-hairline mb-5 gap-4">
                  <button 
                    onClick={() => setActiveTab('validator')}
                    className={`pb-2.5 font-bold text-xs uppercase tracking-wider transition-colors duration-200 relative cursor-pointer ${
                      activeTab === 'validator' ? 'text-clay-pink border-b-2 border-clay-pink' : 'text-clay-muted hover:text-clay-ink'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <Code className="w-3.5 h-3.5" />
                      JSON Schema Editor
                    </span>
                  </button>
                  <button 
                    onClick={() => {
                      if (validationResult.parsedData.length > 0) {
                        setActiveTab('preview');
                        setPreviewIndex(0);
                        setSelectedOption(null);
                      }
                    }}
                    disabled={validationResult.parsedData.length === 0}
                    className={`pb-2.5 font-bold text-xs uppercase tracking-wider transition-colors duration-200 relative cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                      activeTab === 'preview' ? 'text-clay-pink border-b-2 border-clay-pink' : 'text-clay-muted hover:text-clay-ink'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5" />
                      Live Render Preview ({validationResult.parsedData.length})
                    </span>
                  </button>
                </div>

                {/* TAB 1: JSON Schema Editor */}
                {activeTab === 'validator' && (
                  <div className="space-y-4 animate-fade-in-up">
                    <div className="relative">
                      <textarea
                        value={jsonContent}
                        onChange={(e) => setJsonContent(e.target.value)}
                        placeholder="Paste your JSON question pack array here..."
                        spellCheck={false}
                        className="w-full h-80 bg-clay-canvas border border-clay-hairline rounded-clay-lg p-4 font-mono text-xs text-clay-ink focus:border-clay-pink focus:outline-none leading-relaxed resize-y overflow-auto"
                      />
                      
                      {/* Floating actions */}
                      <div className="absolute right-3 bottom-3 flex gap-2">
                        <button
                          onClick={() => setJsonContent(DEFAULT_SAMPLE_JSON)}
                          className="px-3 py-1.5 bg-clay-surface-strong hover:bg-neutral-200 text-clay-ink font-bold text-[10px] uppercase tracking-wider rounded-clay-md border border-clay-hairline transition-colors cursor-pointer"
                        >
                          Load Valid Example
                        </button>
                        <button
                          onClick={handleDownload}
                          disabled={!validationResult.isValid}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-clay-pink hover:bg-rose-600 disabled:bg-clay-surface-strong disabled:text-clay-muted disabled:border-transparent text-white font-bold text-[10px] uppercase tracking-wider rounded-clay-md transition-colors cursor-pointer"
                        >
                          <Download className="w-3 h-3" />
                          <span>Export Pack</span>
                        </button>
                      </div>
                    </div>

                    {/* Validation Panel */}
                    <div className="mt-4">
                      {validationResult.syntaxError && (
                        <div className="bg-clay-pink/10 border border-clay-pink/20 rounded-clay-md p-4 text-xs flex gap-2.5 items-start text-left">
                          <AlertTriangle className="w-4.5 h-4.5 text-clay-pink shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-clay-pink block mb-1">JSON Syntax Error</span>
                            <span className="text-clay-body font-mono block whitespace-pre-wrap">{validationResult.syntaxError}</span>
                          </div>
                        </div>
                      )}

                      {!validationResult.syntaxError && validationResult.errors.length > 0 && (
                        <div className="bg-clay-ochre/10 border border-clay-ochre/20 rounded-clay-md p-4 text-xs flex gap-2.5 items-start text-left max-h-60 overflow-y-auto">
                          <AlertTriangle className="w-4.5 h-4.5 text-clay-ochre shrink-0 mt-0.5" />
                          <div className="w-full">
                            <span className="font-bold text-clay-ochre block mb-1">Schema Validation Mismatch ({validationResult.errors.length} errors found)</span>
                            <ul className="space-y-1.5 list-disc pl-4 mt-2 font-mono text-[11px] text-clay-body">
                              {validationResult.errors.slice(0, 10).map((err, i) => (
                                <li key={i}>
                                  Question [{err.index}] field <code className="bg-clay-canvas px-1 rounded font-bold text-clay-ink">{err.field}</code>: {err.message}
                                </li>
                              ))}
                              {validationResult.errors.length > 10 && (
                                <li className="list-none italic pt-1 text-clay-muted">...and {validationResult.errors.length - 10} more errors.</li>
                              )}
                            </ul>
                          </div>
                        </div>
                      )}

                      {!validationResult.syntaxError && validationResult.errors.length === 0 && (
                        <div className="bg-clay-mint/15 border border-clay-mint/30 rounded-clay-md p-4 text-xs flex gap-2.5 items-start text-left">
                          <CheckCircle className="w-4.5 h-4.5 text-clay-teal shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-clay-teal block mb-1">Question Pack Verified!</span>
                            <span className="text-clay-body">0 errors detected. Feel free to preview how this renders in the <strong>Live Render Preview</strong> tab, or click <strong>Export Pack</strong> to save it as a JSON file to submit via Telegram/GitHub.</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Metadata property table */}
                    <div className="bg-clay-surface-soft border border-clay-hairline rounded-clay-lg p-4 mt-6">
                      <span className="text-xs font-bold uppercase tracking-wider text-clay-ink block mb-3">Field Dictionary & Types:</span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-xs leading-relaxed text-clay-body">
                        <div>
                          <p>• <strong>id</strong> <code className="font-mono text-clay-ink bg-clay-canvas px-1 rounded">number</code>: Unique identifier (no collisions).</p>
                          <p>• <strong>questionText</strong> <code className="font-mono text-clay-ink bg-clay-canvas px-1 rounded">string</code>: Clinical case vignette (supports <strong>markdown</strong>).</p>
                          <p>• <strong>opa, opb, opc, opd</strong> <code className="font-mono text-clay-ink bg-clay-canvas px-1 rounded">string</code>: Core options A, B, C, and D.</p>
                          <p>• <strong>correctOption</strong> <code className="font-mono text-clay-ink bg-clay-canvas px-1 rounded">number</code>: <strong>0-indexed</strong> answer (<code className="font-mono text-clay-ink bg-clay-canvas px-1.5 py-0.5 rounded">0</code>=A, <code className="font-mono text-clay-ink bg-clay-canvas px-1.5 py-0.5 rounded">1</code>=B, etc.).</p>
                          <p>• <strong>explanation</strong> <code className="font-mono text-clay-ink bg-clay-canvas px-1 rounded">string (opt)</code>: Rationale for differential diagnosis (supports <strong>markdown</strong>).</p>
                        </div>
                        <div>
                          <p>• <strong>subjectId</strong> <code className="font-mono text-clay-ink bg-clay-canvas px-1 rounded">number</code>: Subject index (Anatomy=1, Surgery=7, etc.).</p>
                          <p>• <strong>topicId</strong> <code className="font-mono text-clay-ink bg-clay-canvas px-1 rounded">number</code>: Sub-topic category index.</p>
                          <p>• <strong>imageUrl</strong> <code className="font-mono text-clay-ink bg-clay-canvas px-1 rounded">string (opt)</code>: Vignette main illustration path.</p>
                          <p>• <strong>explanationImageUrl</strong> <code className="font-mono text-clay-ink bg-clay-canvas px-1 rounded">string (opt)</code>: Explanation illustration path.</p>
                          <p>• <strong>opaImageUrl, opbImageUrl, opcImageUrl, opdImageUrl</strong> <code className="font-mono text-clay-ink bg-clay-canvas px-1 rounded">string (opt)</code>: Option specific illustrations.</p>
                        </div>
                      </div>

                      {/* Image URL Guide / Examples */}
                      <div className="mt-4 pt-4 border-t border-clay-hairline text-xs">
                        <span className="text-xs font-bold uppercase tracking-wider text-clay-ink block mb-2 font-semibold">Image URL & Path Examples:</span>
                        <div className="space-y-3">
                          <div>
                            <span className="font-semibold text-clay-pink block mb-1">1. Absolute Remote Web URLs (Recommended for initial draft uploads):</span>
                            <p className="text-clay-muted mb-1">Direct web links from a public server or image host. Perfect for testing vignettes with external assets.</p>
                            <code className="block bg-clay-canvas border border-clay-hairline p-1.5 rounded text-[10px] text-clay-ink font-mono whitespace-pre overflow-x-auto">
                              "imageUrl": "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80"
                            </code>
                          </div>
                          <div>
                            <span className="font-semibold text-clay-pink block mb-1">2. Relative CDN/Storage Paths (Recommended for production integration):</span>
                            <p className="text-clay-muted mb-1">Paths within the OpenMedQ Cloudflare R2 bucket. Rebuilt automatically and downloaded for local offline caching in IndexedDB.</p>
                            <code className="block bg-clay-canvas border border-clay-hairline p-1.5 rounded text-[10px] text-clay-ink font-mono whitespace-pre overflow-x-auto">
                              "imageUrl": "images/cardio/inferior_mi_ecg.png"
                            </code>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: Live Render Preview */}
                {activeTab === 'preview' && currentPreviewQuestion && (
                  <div className="space-y-6 animate-fade-in-up">
                    {/* Index Navigator */}
                    <div className="flex justify-between items-center bg-clay-canvas border border-clay-hairline rounded-clay-md px-4 py-2 text-xs">
                      <span className="font-bold text-clay-muted">
                        PREVIEWING QUESTION {previewIndex + 1} OF {validationResult.parsedData.length}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={handlePrevQuestion}
                          disabled={previewIndex === 0}
                          className="p-1 rounded hover:bg-clay-surface-strong disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={handleNextQuestion}
                          disabled={previewIndex === validationResult.parsedData.length - 1}
                          className="p-1 rounded hover:bg-clay-surface-strong disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Practice Suite MCQ Card Mockup */}
                    <div className="bg-clay-canvas border border-clay-hairline rounded-clay-lg p-5 sm:p-6 text-left relative">
                      {/* Meta header */}
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        <span className="px-2 py-0.5 bg-clay-surface-strong text-clay-muted rounded font-bold text-[9px] uppercase tracking-wider">
                          Subject ID: {currentPreviewQuestion.subjectId}
                        </span>
                        <span className="px-2 py-0.5 bg-clay-surface-strong text-clay-muted rounded font-bold text-[9px] uppercase tracking-wider">
                          Topic ID: {currentPreviewQuestion.topicId}
                        </span>
                        {(currentPreviewQuestion.examType || currentPreviewQuestion.examYear) && (
                          <span className="px-2 py-0.5 bg-clay-pink/10 text-clay-pink rounded font-bold text-[9px] uppercase tracking-wider border border-clay-pink/20">
                            {currentPreviewQuestion.examType || 'EXAM'} {currentPreviewQuestion.examYear || ''}
                          </span>
                        )}
                        <span className="px-2 py-0.5 bg-clay-mint/15 text-clay-teal rounded font-bold text-[9px] uppercase tracking-wider border border-clay-mint/25 ml-auto">
                          ID: #{currentPreviewQuestion.id}
                        </span>
                      </div>

                      {/* Clinical Vignette text */}
                      <div className="font-sans text-sm md:text-base leading-relaxed text-clay-ink mb-6">
                        <MarkdownRenderer content={currentPreviewQuestion.questionText} />
                      </div>

                      {/* Question image illustration if specified */}
                      {currentPreviewQuestion.imageUrl && (
                        <div className="mb-6 rounded-clay-lg overflow-hidden border border-clay-hairline bg-clay-surface-soft max-h-[300px] flex justify-center items-center">
                          <LocalImage 
                            srcPath={currentPreviewQuestion.imageUrl} 
                            alt="Question illustration" 
                            className="max-h-[300px] object-contain" 
                          />
                        </div>
                      )}

                      {/* Options */}
                      <div className="space-y-3">
                        {[
                          { key: 'a', text: currentPreviewQuestion.opa, idx: 0, img: currentPreviewQuestion.opaImageUrl },
                          { key: 'b', text: currentPreviewQuestion.opb, idx: 1, img: currentPreviewQuestion.opbImageUrl },
                          { key: 'c', text: currentPreviewQuestion.opc, idx: 2, img: currentPreviewQuestion.opcImageUrl },
                          { key: 'd', text: currentPreviewQuestion.opd, idx: 3, img: currentPreviewQuestion.opdImageUrl }
                        ].map((opt) => {
                          const isCorrect = opt.idx === currentPreviewQuestion.correctOption;
                          const isSelected = opt.idx === selectedOption;

                          let borderClass = "border-clay-hairline";
                          let bgClass = "bg-white";
                          let textClass = "text-clay-body";
                          
                          if (selectedOption === null) {
                            borderClass += " hover:bg-clay-surface-soft";
                          } else {
                            if (isCorrect) {
                              borderClass = "border-clay-mint ring-2 ring-clay-mint/10";
                              bgClass = "bg-clay-mint/15";
                              textClass = "text-clay-teal font-medium";
                            } else if (isSelected) {
                              borderClass = "border-clay-coral ring-2 ring-clay-coral/10";
                              bgClass = "bg-clay-coral/15";
                              textClass = "text-clay-coral font-medium";
                            }
                          }

                          return (
                            <button
                              key={opt.key}
                              disabled={selectedOption !== null}
                              onClick={() => {
                                if (selectedOption === null) setSelectedOption(opt.idx);
                              }}
                              className={`w-full border rounded-clay-md text-left transition-all duration-200 flex flex-col gap-2 p-3 ${
                                selectedOption === null ? 'cursor-pointer' : 'cursor-default'
                              } ${borderClass} ${bgClass}`}
                            >
                              <div className={`w-full text-left text-xs sm:text-sm flex items-center gap-3 ${textClass}`}>
                                <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center shrink-0 text-[10px] font-bold font-mono">
                                  {opt.key.toUpperCase()}
                                </span>
                                <span className="flex-1">
                                  <MarkdownRenderer content={opt.text} inline />
                                </span>
                              </div>
                              {opt.img && (
                                <div className="ml-8 rounded-clay-md overflow-hidden border border-clay-hairline max-h-[120px] flex justify-start bg-clay-surface-soft max-w-[200px]">
                                  <LocalImage 
                                    srcPath={opt.img} 
                                    alt={`Option ${opt.key.toUpperCase()} illustration`} 
                                    className="max-h-[120px] object-contain" 
                                  />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Reset answer button */}
                      {selectedOption !== null && (
                        <button
                          onClick={() => setSelectedOption(null)}
                          className="mt-4 text-xs font-semibold text-clay-pink hover:text-rose-600 transition-colors cursor-pointer"
                        >
                          Clear selection and try again
                        </button>
                      )}

                      {/* Explanation Segment */}
                      {selectedOption !== null && currentPreviewQuestion.explanation && (
                        <div className="mt-6 pt-5 border-t border-clay-hairline animate-fade-in-up">
                          <span className="text-xs font-bold uppercase tracking-wider text-clay-pink block mb-2">Clinical Explanation:</span>
                          <div className="bg-clay-surface-soft border border-clay-hairline rounded-clay-md p-4 text-xs sm:text-sm text-clay-body leading-relaxed flex flex-col gap-3">
                            <MarkdownRenderer content={currentPreviewQuestion.explanation} />
                            
                            {currentPreviewQuestion.explanationImageUrl && (
                              <div className="mt-2 rounded-clay-md overflow-hidden border border-clay-hairline bg-clay-canvas max-h-[200px] flex justify-start max-w-[300px]">
                                <LocalImage 
                                  srcPath={currentPreviewQuestion.explanationImageUrl} 
                                  alt="Explanation illustration" 
                                  className="max-h-[200px] object-contain" 
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Section 4: Telegram Bot Integration */}
          <section className="bg-clay-peach/10 border border-clay-peach rounded-clay-lg sm:rounded-clay-xl p-4 sm:p-6 md:p-8 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <div className="w-10 h-10 rounded-clay-md bg-clay-peach/20 text-clay-pink flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0 w-full">
                <h2 className="font-rubik text-xl font-semibold text-clay-ink tracking-tight mb-2">
                  Zero-Friction Submission Queue (Upcoming Bot)
                </h2>
                <p className="text-clay-body text-xs sm:text-sm leading-relaxed">
                  We believe contributing should be as easy as sending a chat message. We're building a Cloudflare Worker-powered moderation bot. Once active, you can send commands like <code className="font-mono text-clay-ink bg-clay-canvas px-1.5 py-0.5 rounded text-[11px] border border-clay-hairline">/correct &lt;question_id&gt; &lt;description&gt;</code> or <code className="font-mono text-clay-ink bg-clay-canvas px-1.5 py-0.5 rounded text-[11px] border border-clay-hairline">/submit</code> directly in our Telegram group. 
                </p>
                <p className="text-clay-body text-xs sm:text-sm leading-relaxed mt-2">
                  The bot will automatically parse the message, write it to D1, and trigger a private review prompt for moderators. Approved corrections instantly rebuild and update our global Cloudflare R2 CDN packs.
                </p>
              </div>
            </div>
          </section>

        </div>

        {/* Footer info */}
        <div className="mt-12 pt-6 border-t border-clay-hairline flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0 text-xs text-clay-muted">
          <span>© {new Date().getFullYear()} OpenMedQ</span>
          <span>Open Source MIT License</span>
        </div>
      </div>
    </div>
  );
}
