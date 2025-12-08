
import Logo from "@/components/Logo";
import Link from "next/link";

export default function Home() {
    return (
        <main className='relative h-screen overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0b0b0f] via-[#0e0f17] to-[#05070d] flex flex-col'>
            {/* Header */}
            <nav className='relative z-50 container mx-auto px-6 py-6 flex-none'>
                <Logo />
            </nav>

            {/* Blue Spotlight Glow */}
            <div className='absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse-slow' />

            {/* Hero Section */}
            <div className='relative z-10 container mx-auto px-6 flex-grow flex flex-col items-center justify-center text-center'>
                <div className='max-w-4xl'>
                    {/* Glass Panel wrapper (optional, but requested for enhancement) */}
                    <div className='backdrop-blur-sm rounded-3xl p-8 lg:p-12 transition-all duration-500 hover:bg-white/5 border border-transparent hover:border-white/10'>
                        <h1 className='text-6xl md:text-8xl font-extrabold tracking-tight text-white mb-8 animate-fade-in-up drop-shadow-lg opacity-0' style={{ animationDelay: '0.1s' }}>
                            Job <span className='bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 text-transparent bg-clip-text drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]'>Tracking</span>
                        </h1>

                        <p className='text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed opacity-0 animate-fade-in' style={{ animationDelay: '0.4s' }}>
                            Streamline your job hunt with our advanced tracking suite.
                            Manage applications, analyze progress, and land your dream role faster.
                        </p>

                        <div className='opacity-0 animate-fade-in' style={{ animationDelay: '0.6s' }}>
                            <Link
                                href='/login'
                                className='group relative inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-500 text-white px-10 py-4 rounded-xl text-lg font-semibold shadow-lg shadow-blue-500/30 overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-blue-500/50'
                            >
                                <span className='relative z-10'>Get Started Now</span>
                                {/* Shine Effect */}
                                <div className='absolute inset-0 -translate-x-full group-hover:animate-[shine_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent' />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
