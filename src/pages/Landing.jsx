import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="bg-[#f8f9fc] font-sans text-gray-900">
      
      {/* ================= SECTION 1: HEADER & OPENING ================= */}
      <div>
        <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between relative z-50">
          <div className="flex items-center gap-3">
            <div className="bg-[#5B3DF5] p-2 rounded-full flex items-center justify-center">
               <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20C16.42 20 20 16.42 20 12C20 7.58 16.42 4 12 4Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                  <path d="M15 15L20 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
            </div>
            <span className="text-xl font-extrabold tracking-tight">Qalm Tek</span>
          </div>
          <div className="flex gap-3">
            <Link to="/login" className="text-sm font-bold text-gray-700 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 px-6 py-2.5 rounded-full transition-all active:scale-95">
              Log in
            </Link>
            <Link to="/auth" className="text-sm font-bold text-white bg-[#5B3DF5] hover:bg-[#4a2ee0] px-6 py-2.5 rounded-full transition-all shadow-sm active:scale-95">
              Get started
            </Link>
          </div>
        </header>

        <section className="max-w-4xl mx-auto px-6 pt-16 pb-12 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 leading-[1.1] mb-6">
            Talk to someone <br/>
            <span className="text-[#5B3DF5]">who gets it.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-8">
            Find a verified therapist, book a session in a few taps, and keep a private journal. Built for young people, in plain language, on any screen.
          </p>
          <Link to="/auth" className="inline-block bg-[#5B3DF5] text-white font-bold text-lg px-10 py-4 rounded-full hover:bg-[#4a2ee0] transition-all hover:shadow-lg active:scale-95">
            Find your match today
          </Link>
        </section>
      </div>

      {/* ================= SECTION 2: THE UNTANGLE BREAKER (With Animated Auth Shapes) ================= */}
      <section className="relative bg-[#5b3df5] flex flex-col items-center justify-center overflow-hidden py-16 min-h-[60vh]">
        
        {/* Animated Background Shapes from Auth Page */}
        <style>
          {`
            @keyframes float-slow {
              0%, 100% { transform: translate(0, 0) scale(1); }
              50% { transform: translate(-30px, 40px) scale(1.05); }
            }
            @keyframes float-medium {
              0%, 100% { transform: translate(0, 0) rotate(12deg); }
              50% { transform: translate(40px, -40px) rotate(25deg); }
            }
            @keyframes float-fast {
              0%, 100% { transform: translate(0, 0) scale(1); }
              50% { transform: translate(-20px, -30px) scale(0.95); }
            }
            .animate-float-slow { animation: float-slow 15s ease-in-out infinite; }
            .animate-float-medium { animation: float-medium 12s ease-in-out infinite; }
            .animate-float-fast { animation: float-fast 18s ease-in-out infinite; }
          `}
        </style>

        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="animate-float-slow absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#3ddba7] opacity-90 blur-sm" />
          <div className="animate-float-fast absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-[#ff5fa2] opacity-90 blur-sm" />
          <div className="animate-float-medium absolute top-1/4 left-10 h-24 w-24 rounded-3xl bg-[#ffa23a] opacity-90 blur-sm" />
        </div>

        {/* Top Text */}
        <div className="relative z-20 text-center px-6 shrink-0 mb-6">
          <h2 className="text-white text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] drop-shadow-lg">
            Let's untangle<br />your life.
          </h2>
        </div>

        {/* The SVG Tangle Line */}
        <div className="relative w-full h-64 md:h-96 pointer-events-none z-10">
          <svg 
            className="w-full h-full text-white/60" 
            viewBox="0 0 1000 400" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            {/* Horizontal line stretching edge to edge */}
            <path 
              d="
                M 0 200 
                L 300 200 
                C 320 200, 330 160, 350 160 
                C 380 160, 390 280, 410 280 
                C 430 280, 440 120, 460 120 
                C 490 120, 480 300, 500 300 
                C 520 300, 510 100, 540 100 
                C 570 100, 560 280, 580 280 
                C 600 280, 590 140, 620 140 
                C 650 140, 640 260, 660 260 
                C 680 260, 690 200, 720 200 
                L 1000 200
              " 
              stroke="currentColor" 
              strokeWidth="4" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
            
            {/* Tangle loops */}
            <path d="M 450 120 C 380 60, 320 250, 400 300 C 470 340, 520 150, 450 120" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
            <path d="M 550 100 C 620 50, 680 230, 610 290 C 550 330, 470 200, 550 100" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
            <path d="M 410 280 C 350 340, 460 400, 500 300" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
            <path d="M 580 280 C 660 350, 540 390, 500 300" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>

      </section>

    </div>
  );
}