import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, CheckCircle, Clock, Zap, Users, ThumbsUp } from 'lucide-react';

interface RoadmapProps {
  onBack: () => void;
}

export function Roadmap({ onBack }: RoadmapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activePathRef = useRef<SVGPathElement>(null);
  const trackPathRef = useRef<SVGPathElement>(null);
  const runnerRef = useRef<HTMLDivElement>(null);
  const runnerPulseRef = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState(true);
  const [nodeY, setNodeY] = useState<number[]>([100, 300, 500]);
  const [containerHeight, setContainerHeight] = useState(600);
  const [containerWidth, setContainerWidth] = useState(600);
  const [activeNodes, setActiveNodes] = useState<boolean[]>([false, false, false]);
  const prevActiveNodes = useRef<boolean[]>([false, false, false]);

  // Dimensions of the snake path wave column based on viewport size
  const midX = isMobile ? 20 : containerWidth / 2;
  const leftX = isMobile ? 14 : midX - 48;
  const rightX = isMobile ? 26 : midX + 48;

  // Generate cubic Bézier winding path ("snake path")
  const pathD = nodeY.length >= 3 
    ? `M ${midX} 0 
       C ${midX} ${nodeY[0] / 2}, ${rightX} ${nodeY[0] / 2}, ${rightX} ${nodeY[0]} 
       C ${rightX} ${(nodeY[0] + nodeY[1]) / 2}, ${leftX} ${(nodeY[0] + nodeY[1]) / 2}, ${leftX} ${nodeY[1]} 
       C ${leftX} ${(nodeY[1] + nodeY[2]) / 2}, ${rightX} ${(nodeY[1] + nodeY[2]) / 2}, ${rightX} ${nodeY[2]} 
       C ${rightX} ${(nodeY[2] + containerHeight) / 2}, ${midX} ${(nodeY[2] + containerHeight) / 2}, ${midX} ${containerHeight}`
    : `M ${midX} 0 L ${midX} ${containerHeight}`;

  // Binary search to find coordinates along the curved path for a given Y position
  const getPointForY = (pathElement: SVGPathElement, targetY: number) => {
    const totalLength = pathElement.getTotalLength();
    let low = 0;
    let high = totalLength;
    let bestLength = 0;
    let bestPoint = { x: 0, y: 0 };
    
    // 8 iterations yield sub-pixel coordinate alignment along the curve
    for (let i = 0; i < 8; i++) {
      const mid = (low + high) / 2;
      const pt = pathElement.getPointAtLength(mid);
      if (pt.y < targetY) {
        low = mid;
      } else {
        high = mid;
      }
      bestLength = mid;
      bestPoint = pt;
    }
    return { point: bestPoint, length: bestLength };
  };

  // Measure offsets and heights of timeline components
  const measurePositions = () => {
    if (!containerRef.current || !trackPathRef.current || !activePathRef.current) return;
    
    setIsMobile(window.innerWidth < 768);
    setContainerWidth(containerRef.current.offsetWidth);
    
    const nodes = containerRef.current.querySelectorAll('.timeline-node');
    const positions = Array.from(nodes).map((node) => {
      const element = node as HTMLElement;
      return element.offsetTop + 20; // 20px vertical offset for marker center
    });
    
    setNodeY(positions);
    
    const height = containerRef.current.offsetHeight;
    setContainerHeight(height);
    
    const totalLength = trackPathRef.current.getTotalLength();
    activePathRef.current.setAttribute('stroke-dasharray', String(totalLength));
    activePathRef.current.setAttribute('stroke-dashoffset', String(totalLength));
  };

  // Run measurements on mount and resize
  useEffect(() => {
    measurePositions();
    window.addEventListener('resize', measurePositions);
    
    const timer = setTimeout(measurePositions, 150);
    
    return () => {
      window.removeEventListener('resize', measurePositions);
      clearTimeout(timer);
    };
  }, []);

  // Journey timeline scroll listener & DOM updates (buttery smooth 60/120fps)
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || !activePathRef.current || !trackPathRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Traveler is tracked at 60% of the viewport height
      const triggerY = viewportHeight * 0.60;
      const relativeScroll = triggerY - rect.top;
      
      const startY = 16;
      const endY = containerHeight - 16;
      
      let currentTravelerY = relativeScroll;
      if (currentTravelerY < startY) {
        currentTravelerY = 0;
      } else if (currentTravelerY > endY) {
        currentTravelerY = endY;
      }
      
      const totalLength = trackPathRef.current.getTotalLength();
      
      if (currentTravelerY === 0) {
        if (runnerRef.current) runnerRef.current.style.opacity = '0';
        if (runnerPulseRef.current) runnerPulseRef.current.style.opacity = '0';
        activePathRef.current.setAttribute('stroke-dashoffset', String(totalLength));
      } else {
        const { point, length } = getPointForY(trackPathRef.current, currentTravelerY);
        
        activePathRef.current.setAttribute('stroke-dashoffset', String(totalLength - length));
        
        if (runnerRef.current) {
          runnerRef.current.style.opacity = '1';
          runnerRef.current.style.transform = `translate(${point.x}px, ${point.y}px) translate(-50%, -50%)`;
        }
        if (runnerPulseRef.current) {
          runnerPulseRef.current.style.opacity = '1';
          runnerPulseRef.current.style.transform = `translate(${point.x}px, ${point.y}px) translate(-50%, -50%)`;
        }
      }
      
      // Determine active status of milestone nodes
      const nodes = containerRef.current.querySelectorAll('.timeline-node');
      const updatedActiveNodes = Array.from(nodes).map((node) => {
        const element = node as HTMLElement;
        const nodeTop = element.offsetTop;
        const nodeCenterY = nodeTop + 20;
        return currentTravelerY >= nodeCenterY;
      });
      
      // Avoid React state updates unless node active status changes
      let changed = false;
      for (let i = 0; i < updatedActiveNodes.length; i++) {
        if (updatedActiveNodes[i] !== prevActiveNodes.current[i]) {
          changed = true;
          break;
        }
      }
      
      if (changed) {
        prevActiveNodes.current = updatedActiveNodes;
        setActiveNodes(updatedActiveNodes);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [nodeY, containerHeight]);

  // IntersectionObserver to fade items into view on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px -80px 0px',
      }
    );

    const elements = document.querySelectorAll('.reveal-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="min-h-screen bg-clay-canvas text-clay-ink flex flex-col font-sans selection:bg-clay-pink/20 selection:text-clay-pink relative overflow-x-hidden p-4 sm:p-6 md:p-12 text-left">
      {/* Decorative ambient background blur */}
      <div className="absolute top-0 left-0 w-[50%] h-[50%] bg-clay-lavender/5 rounded-full blur-[120px] pointer-events-none animate-ambient-drift" />
      <div className="absolute bottom-0 right-0 w-[50%] h-[50%] bg-clay-peach/5 rounded-full blur-[120px] pointer-events-none animate-ambient-drift" style={{ animationDelay: '-10s' }} />
      
      <div className="max-w-4xl mx-auto w-full relative z-10 text-left">
        {/* Back navigation */}
        <button 
          onClick={onBack}
          className="inline-flex items-center gap-2 text-clay-muted hover:text-clay-ink font-semibold text-sm mb-8 transition-colors duration-200 cursor-pointer animate-fade-in-up"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        {/* Header */}
        <div className="border-b border-clay-hairline pb-6 mb-8 animate-fade-in-up delay-75">
          <span className="text-xs font-bold uppercase tracking-wider text-clay-pink mb-2 block">Our Vision</span>
          <h1 className="font-rubik text-3xl md:text-5xl font-medium tracking-[-0.04em] text-clay-ink mb-4">
            Product Roadmap & Priority
          </h1>
          <p className="text-clay-muted text-xs md:text-sm leading-relaxed">
            OpenMedQ is a non-commercial, 100% free project. Our roadmap isn't dictated by boardrooms, monetization goals, or venture capitalists. We prioritize what helps medical students study efficiently and score higher. Below is where we have been, what we are building now, and where we are heading next—ranked by your priority.
          </p>
        </div>

        {/* Psychological Trigger Card: Community voice & voting */}
        <section className="bg-clay-surface-soft border border-clay-hairline rounded-clay-lg sm:rounded-clay-xl p-5 sm:p-6 md:p-8 mb-10 relative overflow-hidden animate-fade-in-up delay-100">
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            <div className="w-12 h-12 rounded-clay-md bg-clay-pink/10 text-clay-pink flex items-center justify-center shrink-0">
              <Users className="w-6 h-6 animate-pulse" />
            </div>
            <div className="flex-1 min-w-0 w-full text-left">
              <h2 className="font-rubik text-lg sm:text-xl font-semibold text-clay-ink tracking-tight mb-2">
                This is Your Project. You Vote the Priorities.
              </h2>
              <p className="text-clay-body text-xs sm:text-sm leading-relaxed mb-4">
                We use the <strong>IKEA Effect</strong> of product design—we believe you should help shape the tools you rely on daily. We pull feature suggestions directly from the student community and rearrange our building queue based on peer votes. If you want a future feature moved to "Immediate Priority," make your voice heard!
              </p>
              
              <a 
                href="https://t.me/openmedq" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-clay-ink hover:bg-neutral-800 text-white font-bold text-xs sm:text-sm rounded-clay-md transition-colors cursor-pointer"
              >
                <ThumbsUp className="w-4 h-4 fill-current" />
                <span>Vote & Suggest in Telegram</span>
              </a>
            </div>
          </div>
        </section>

        {/* TIMELINE SECTION CONTAINER */}
        <div ref={containerRef} className="relative ml-2 md:ml-0 space-y-16 pb-8 w-full">
          
          {/* Curved Timeline Track and Active Path */}
          <svg className="absolute left-0 top-0 h-full pointer-events-none w-full z-0">
            {/* Background Snake Path */}
            <path
              ref={trackPathRef}
              d={pathD}
              fill="none"
              stroke="var(--clay-hairline)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Active Pink Overlay Path */}
            <path
              ref={activePathRef}
              d={pathD}
              fill="none"
              stroke="var(--clay-pink)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={2000}
              strokeDashoffset={2000}
              className="transition-all duration-150 ease-out"
            />
          </svg>

          {/* Traveling glow dot (Runner) & outer pulse */}
          <div 
            ref={runnerPulseRef}
            className="absolute left-0 top-0 w-6 h-6 sm:w-7 sm:h-7 bg-clay-pink/20 rounded-full z-10 animate-ping pointer-events-none opacity-0 transition-opacity duration-300"
            style={{ 
              transform: 'translate(-50%, -50%)',
              animationDuration: '1.8s'
            }}
          />
          <div 
            ref={runnerRef}
            className="absolute left-0 top-0 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-clay-pink rounded-full z-20 shadow-[0_0_15px_#ff4d8b,0_0_6px_#ff4d8b] pointer-events-none opacity-0 border border-white/40 transition-opacity duration-300"
            style={{ 
              transform: 'translate(-50%, -50%)'
            }}
          />

          {/* Timeline Node 1: Completed / Shipped (Left side on Desktop) */}
          <div className="relative timeline-node reveal-on-scroll pl-14 md:pl-0 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">
            {/* Timeline Marker Icon - Centered on Curve */}
            <div 
              className={`absolute -translate-x-1/2 top-1 w-7 h-7 sm:w-9 sm:h-9 rounded-full border-4 border-clay-canvas flex items-center justify-center shadow-sm shrink-0 z-10 transition-all duration-500 transform ${
                activeNodes[0] 
                  ? 'bg-clay-mint text-clay-teal scale-110 shadow-md ring-4 ring-clay-mint/20 border-clay-mint/10' 
                  : 'bg-clay-surface-strong text-clay-muted scale-100'
              }`}
              style={{ left: `${rightX}px` }}
            >
              <CheckCircle className="w-4 h-4 sm:w-5 h-5" />
            </div>
            
            {/* Left Column content */}
            <div className="space-y-4 md:text-right pr-0 md:pr-12">
              <div className="text-left md:text-right">
                <span className="px-2.5 py-0.5 rounded bg-clay-mint/15 text-clay-teal text-[10px] font-bold uppercase tracking-wider mb-2 inline-block border border-clay-mint/30">
                  Phase 1: Completed & Shipped
                </span>
                <h3 className="font-rubik text-lg sm:text-xl font-semibold text-clay-ink tracking-tight">
                  The Foundations of Active Recall
                </h3>
              </div>
              
              <div className="grid grid-cols-1 gap-4 text-left">
                <div className={`bg-white border rounded-clay-lg p-4 transition-all duration-500 hover:shadow-md ${
                  activeNodes[0] 
                    ? 'border-clay-mint bg-clay-mint/5 shadow-sm translate-y-0 opacity-100' 
                    : 'border-clay-hairline opacity-60 translate-y-2'
                }`}>
                  <span className={`text-xs font-bold block mb-1 transition-colors duration-500 ${activeNodes[0] ? 'text-clay-teal' : 'text-clay-muted'}`}>100% Offline Study Mode</span>
                  <span className="text-xs text-clay-body">All clinical questions, answers, and study statistics run completely offline. You can practice in basement wards, library corners, or hospital corridors without needing an active internet connection.</span>
                </div>
                <div className={`bg-white border rounded-clay-lg p-4 transition-all duration-500 hover:shadow-md ${
                  activeNodes[0] 
                    ? 'border-clay-mint bg-clay-mint/5 shadow-sm translate-y-0 opacity-100' 
                    : 'border-clay-hairline opacity-60 translate-y-2'
                }`} style={{ transitionDelay: activeNodes[0] ? '100ms' : '0ms' }}>
                  <span className={`text-xs font-bold block mb-1 transition-colors duration-500 ${activeNodes[0] ? 'text-clay-teal' : 'text-clay-muted'}`}>Smart Spaced Repetition (FSRS)</span>
                  <span className="text-xs text-clay-body">Integrated a scientific study scheduler that learns how fast you forget clinical information, setting optimal review intervals to guarantee maximum long-term memory retention.</span>
                </div>
                <div className={`bg-white border rounded-clay-lg p-4 transition-all duration-500 hover:shadow-md ${
                  activeNodes[0] 
                    ? 'border-clay-mint bg-clay-mint/5 shadow-sm translate-y-0 opacity-100' 
                    : 'border-clay-hairline opacity-60 translate-y-2'
                }`} style={{ transitionDelay: activeNodes[0] ? '200ms' : '0ms' }}>
                  <span className={`text-xs font-bold block mb-1 transition-colors duration-500 ${activeNodes[0] ? 'text-clay-teal' : 'text-clay-muted'}`}>Vignette Symptom Formatting</span>
                  <span className="text-xs text-clay-body">Full layout formatting for clinical vignettes. Critical patient symptoms, physical exam findings, and lab values are cleanly formatted to help you scan long case studies.</span>
                </div>
                <div className={`bg-white border rounded-clay-lg p-4 transition-all duration-500 hover:shadow-md ${
                  activeNodes[0] 
                    ? 'border-clay-mint bg-clay-mint/5 shadow-sm translate-y-0 opacity-100' 
                    : 'border-clay-hairline opacity-60 translate-y-2'
                }`} style={{ transitionDelay: activeNodes[0] ? '300ms' : '0ms' }}>
                  <span className={`text-xs font-bold block mb-1 transition-colors duration-500 ${activeNodes[0] ? 'text-clay-teal' : 'text-clay-muted'}`}>Verified Clinical Disclaimers</span>
                  <span className="text-xs text-clay-body">Established clear guidelines verifying that all content is designed solely for educational MBBS/NEET-PG preparation, along with essential data privacy disclosures.</span>
                </div>
              </div>
            </div>

            {/* Right Column (Empty space on desktop, hidden on mobile) */}
            <div className="hidden md:block" />
          </div>

          {/* Timeline Node 2: Active / In Progress (Right side on Desktop) */}
          <div className="relative timeline-node reveal-on-scroll pl-14 md:pl-0 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">
            {/* Timeline Marker Icon with Active Radar Ping (Centered on Curve) */}
            <div 
              className={`absolute -translate-x-1/2 top-1 w-7 h-7 sm:w-9 sm:h-9 rounded-full border-4 border-clay-canvas flex items-center justify-center shadow-sm shrink-0 z-10 transition-all duration-500 transform ${
                activeNodes[1] 
                  ? 'bg-clay-pink text-white scale-110 shadow-md ring-4 ring-clay-pink/20 border-clay-pink/10' 
                  : 'bg-clay-surface-strong text-clay-muted scale-100'
              }`}
              style={{ left: `${leftX}px` }}
            >
              <Zap className={`w-4 h-4 sm:w-5 h-5 ${activeNodes[1] ? 'animate-pulse' : ''}`} />
            </div>
            {activeNodes[1] && (
              <div 
                className="absolute -translate-x-1/2 top-1 w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-clay-pink/20 animate-ping border border-clay-pink/30 pointer-events-none z-0" 
                style={{ animationDuration: '2s', left: `${leftX}px` }} 
              />
            )}
            
            {/* Left Column (Empty space on desktop, hidden on mobile) */}
            <div className="hidden md:block" />

            {/* Right Column content */}
            <div className="space-y-4 pl-0 md:pl-12 text-left">
              <div className="text-left">
                <span className="px-2.5 py-0.5 rounded bg-clay-pink/10 text-clay-pink text-[10px] font-bold uppercase tracking-wider mb-2 inline-block border border-clay-pink/20 animate-pulse">
                  Now Building
                </span>
                <h3 className="font-rubik text-lg sm:text-xl font-semibold text-clay-ink tracking-tight">
                  Seamless Cloud Sync & Peer Correction Hub
                </h3>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <div className={`bg-white border rounded-clay-lg p-4 transition-all duration-500 hover:shadow-md ${
                  activeNodes[1] 
                    ? 'border-clay-pink bg-clay-pink/5 shadow-sm translate-y-0 opacity-100' 
                    : 'border-clay-hairline opacity-60 translate-y-2'
                }`}>
                  <span className={`text-xs font-bold block mb-1 transition-colors duration-500 ${activeNodes[1] ? 'text-clay-pink' : 'text-clay-muted'}`}>Multi-Device Study Sync</span>
                  <span className="text-xs text-clay-body">Instantly synchronize your daily study streaks, exam statistics, bookmarked questions, and active recall records between your laptop and mobile device.</span>
                </div>
                <div className={`bg-white border rounded-clay-lg p-4 transition-all duration-500 hover:shadow-md ${
                  activeNodes[1] 
                    ? 'border-clay-pink bg-clay-pink/5 shadow-sm translate-y-0 opacity-100' 
                    : 'border-clay-hairline opacity-60 translate-y-2'
                }`} style={{ transitionDelay: activeNodes[1] ? '100ms' : '0ms' }}>
                  <span className={`text-xs font-bold block mb-1 transition-colors duration-500 ${activeNodes[1] ? 'text-clay-pink' : 'text-clay-muted'}`}>Textbook Peer Correction Flow</span>
                  <span className="text-xs text-clay-body">A peer-review submission hub. Suggest textbook corrections (citing guidelines from Standard MBBS books like Harrison's or Bailey & Love) to keep the question packs 100% accurate.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Node 3: Future Tiers (Left side on Desktop) */}
          <div className="relative timeline-node reveal-on-scroll pl-14 md:pl-0 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">
            {/* Timeline Marker Icon - Centered on Curve */}
            <div 
              className={`absolute -translate-x-1/2 top-1 w-7 h-7 sm:w-9 sm:h-9 rounded-full border-4 border-clay-canvas flex items-center justify-center shadow-sm shrink-0 z-10 transition-all duration-500 transform ${
                activeNodes[2] 
                  ? 'bg-clay-ochre text-white scale-110 shadow-md ring-4 ring-clay-ochre/20 border-clay-ochre/10' 
                  : 'bg-clay-surface-strong text-clay-muted scale-100'
              }`}
              style={{ left: `${rightX}px` }}
            >
              <Clock className="w-4 h-4 sm:w-5 h-5" />
            </div>
            
            {/* Left Column content */}
            <div className="space-y-6 md:text-right pr-0 md:pr-12">
              <div className="text-left md:text-right">
                <span className="px-2.5 py-0.5 rounded bg-clay-ochre/15 text-clay-ochre text-[10px] font-bold uppercase tracking-wider mb-2 inline-block border border-clay-ochre/30">
                  Future Pipeline
                </span>
                <h3 className="font-rubik text-lg sm:text-xl font-semibold text-clay-ink tracking-tight">
                  Planned Scopes (Priority Tiers)
                </h3>
                <p className="text-clay-muted text-xs sm:text-sm mt-1">
                  Features below are prioritized based on user feedback. Help us reshuffle them by upvoting in our community channels!
                </p>
              </div>
              
              <div className="space-y-6 text-left">
                
                {/* Priority Tier 1 */}
                <div 
                  className={`border rounded-clay-lg p-4 text-left transition-all duration-500 ${
                    activeNodes[2] 
                      ? 'border-clay-peach bg-clay-peach/5 opacity-100 translate-y-0 shadow-sm' 
                      : 'border-clay-hairline bg-clay-surface-soft/20 opacity-60 translate-y-2'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-0.5 rounded bg-clay-peach text-clay-ink text-[9px] font-bold uppercase tracking-wider">
                      Tier 1: Immediate Priority
                    </span>
                    <span className="text-[10px] text-clay-muted font-medium">Scheduled next in pipeline</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-clay-body">
                    <div className="p-3 bg-clay-canvas/50 border border-clay-hairline/60 rounded">
                      <strong>🤖 Telegram Correction Shortcut</strong>
                      <p className="text-clay-muted mt-1 text-[11px]">Flag errors or suggest updates directly within the chat using a command like <code className="font-mono text-[9px] bg-clay-canvas px-1 py-0.5 rounded border border-clay-hairline">/correct</code> to automatically queue it for review.</p>
                    </div>
                    <div className="p-3 bg-clay-canvas/50 border border-clay-hairline/60 rounded">
                      <strong>📂 Personal Question Creator</strong>
                      <p className="text-clay-muted mt-1 text-[11px]">A simple interactive screen to write your own custom clinical vignettes, notes, and flashcards, letting you test yourself or share them with batchmates.</p>
                    </div>
                  </div>
                </div>

                {/* Priority Tier 2 */}
                <div 
                  className={`border rounded-clay-lg p-4 text-left transition-all duration-500 ${
                    activeNodes[2] 
                      ? 'border-clay-lavender bg-clay-lavender/5 opacity-100 translate-y-0 shadow-sm' 
                      : 'border-clay-hairline bg-clay-surface-soft/20 opacity-60 translate-y-2'
                  }`}
                  style={{ transitionDelay: activeNodes[2] ? '100ms' : '0ms' }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-0.5 rounded bg-clay-lavender text-clay-ink text-[9px] font-bold uppercase tracking-wider">
                      Tier 2: Planned for Future
                    </span>
                    <span className="text-[10px] text-clay-muted font-medium">Mid-term roadmap pipeline</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-clay-body">
                    <div className="p-3 bg-clay-canvas/50 border border-clay-hairline/60 rounded">
                      <strong>📊 MBBS Weak Spots Dashboard</strong>
                      <p className="text-clay-muted mt-1 text-[11px]">A visual chart tracking your performance and accuracy percentages across different medical subjects, helping you focus on weak topics before exams.</p>
                    </div>
                    <div className="p-3 bg-clay-canvas/50 border border-clay-hairline/60 rounded">
                      <strong>📅 Memory-Based Study Planner</strong>
                      <p className="text-clay-muted mt-1 text-[11px]">A calendar view that automatically schedules revision sessions for clinical cards based on the exact day your memory stability is predicted to fade.</p>
                    </div>
                  </div>
                </div>

                {/* Priority Tier 3 */}
                <div 
                  className={`border rounded-clay-lg p-4 text-left transition-all duration-500 ${
                    activeNodes[2] 
                      ? 'border-clay-hairline-strong bg-clay-surface-soft/40 opacity-100 translate-y-0 shadow-sm' 
                      : 'border-clay-hairline bg-clay-surface-soft/20 opacity-60 translate-y-2'
                  }`}
                  style={{ transitionDelay: activeNodes[2] ? '200ms' : '0ms' }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-0.5 rounded bg-clay-surface-strong text-clay-ink text-[9px] font-bold uppercase tracking-wider border border-clay-hairline">
                      Tier 3: Long-Term / Wishlist
                    </span>
                    <span className="text-[10px] text-clay-muted font-medium">Not planned soon unless highly requested</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-clay-body">
                    <div className="p-3 bg-clay-canvas/50 border border-clay-hairline/60 rounded opacity-75">
                      <strong>🧠 AI Clinical Reasoning Tutor</strong>
                      <p className="text-clay-muted mt-1 text-[11px]">An on-demand AI assistant to break down complex medical case histories, explain differential diagnoses, and help interpret clinical imaging.</p>
                    </div>
                    <div className="p-3 bg-clay-canvas/50 border border-clay-hairline/60 rounded opacity-75">
                      <strong>🏫 Batch Leaderboards & Portals</strong>
                      <p className="text-clay-muted mt-1 text-[11px]">Shared study portals for medical batches or college class monitors to coordinate study schedules and run group streaks anonymously.</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Right Column (Empty space on desktop, hidden on mobile) */}
            <div className="hidden md:block" />
          </div>

        </div>

        {/* Footer info */}
        <div className="mt-16 pt-6 border-t border-clay-hairline flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0 text-xs text-clay-muted">
          <span>© {new Date().getFullYear()} OpenMedQ</span>
          <span>Community Driven • Peer Verified</span>
        </div>
      </div>
    </div>
  );
}
