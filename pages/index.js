
import Navbar from '../components/Navbar';
import RegularButton from '../components/RegularButton';
import StrokeButton from '../components/StrokeButton';
import newHomeImage from '../public/images/newHomeImage.svg';
import Image from 'next/image';
import Link from 'next/link';
import HomePageExtras from '../components/HomePageExtras';

export default function Home() {
  return (
    <div className="neon-home min-h-screen text-white relative overflow-hidden">

      {/* ANIMATED BACKGROUND */}
      <div className="neon-background" aria-hidden="true">
        <div className="neon-orb neon-orb-one" />
        <div className="neon-orb neon-orb-two" />
        <div className="neon-orb neon-orb-three" />

        <div className="neon-grid" />

        <div className="particle particle-one" />
        <div className="particle particle-two" />
        <div className="particle particle-three" />
        <div className="particle particle-four" />
        <div className="particle particle-five" />
        <div className="particle particle-six" />
      </div>

      {/* NAVBAR */}
      <div className="relative z-20">
        <Navbar />
      </div>

      {/* HERO SECTION */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-16 md:pt-24 pb-20">

        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* HERO CONTENT */}
          <div className="hero-content">

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 text-emerald-200 text-xs tracking-widest uppercase mb-7">
              <span className="live-dot" />
              The Future of Music Ownership
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight">

              Music Has
              <br />

              <span className="neon-gradient-text">
                No Limits.
              </span>

              <br />

              <span className="text-white/90">
                Own The Sound.
              </span>

            </h1>

            <p className="mt-7 text-gray-300 text-base md:text-lg leading-8 max-w-xl">
              Discover a new universe of music. Create, collect and trade
              exclusive music NFTs while empowering artists through
              decentralized ownership.
            </p>

            {/* HERO BUTTONS */}
            <div className="flex flex-wrap gap-4 mt-9">

              <Link href="/marketplace">
                <div className="hero-primary-button">
                  <RegularButton text="Explore Marketplace" />
                </div>
              </Link>

              <Link href="/create">
                <div className="hero-secondary-button">
                  <StrokeButton>Create NFT</StrokeButton>
                </div>
              </Link>

            </div>

            {/* PLATFORM HIGHLIGHTS */}
            <div className="flex flex-wrap gap-8 mt-14">

              <div>
                <p className="text-2xl font-bold text-white">
                  Web3
                </p>
                <p className="text-xs text-[#8FA99F] mt-1 tracking-wider">
                  DECENTRALIZED
                </p>
              </div>

              <div className="w-px bg-white/10" />

              <div>
                <p className="text-2xl font-bold text-white">
                  NFT
                </p>
                <p className="text-xs text-[#8FA99F] mt-1 tracking-wider">
                  DIGITAL OWNERSHIP
                </p>
              </div>

              <div className="w-px bg-white/10" />

              <div>
                <p className="text-2xl font-bold text-white">
                  POL
                </p>
                <p className="text-xs text-[#8FA99F] mt-1 tracking-wider">
                  POLYGON AMOY
                </p>
              </div>

            </div>
          </div>

          {/* ANIMATED HERO VISUAL */}
          <div className="hero-visual">

            <div className="sound-ring sound-ring-one" />
            <div className="sound-ring sound-ring-two" />
            <div className="sound-ring sound-ring-three" />

            <div className="music-orbit orbit-one" />
            <div className="music-orbit orbit-two" />

            <div className="hero-art-glow" />

            <div className="hero-artwork">
              <Image
                src={newHomeImage}
                alt="NEONVERSE music universe"
                priority
                className="w-full h-auto"
              />
            </div>

            <div className="floating-label floating-label-top">
              <span className="text-emerald-300">✦</span>
              DIGITAL MUSIC
            </div>

            <div className="floating-label floating-label-bottom">
              <span className="live-dot" />
              THE SOUND UNIVERSE
            </div>

          </div>
        </div>
      </main>

      {/* ANIMATED SOUND VISUALIZER */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 mb-24">

        <div className="visualizer-panel">

          <div className="flex items-center justify-between mb-5">

            <div>
              <p className="text-white font-semibold tracking-wide">
                Feel The Frequency
              </p>

              <p className="text-[#8FA99F] text-xs mt-1">
                A new dimension of music ownership
              </p>
            </div>

            <span className="text-emerald-300 text-xs tracking-widest">
              NEONVERSE
            </span>

          </div>

          <div className="sound-visualizer" aria-hidden="true">
            {Array.from({ length: 48 }).map((_, index) => (
              <span
                key={index}
                style={{ '--bar-index': index }}
              />
            ))}
          </div>

        </div>
      </section>

      {/* PLATFORM PILLARS */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-24">

        <div className="text-center mb-12">

          <p className="text-emerald-300 text-xs tracking-[0.35em] uppercase mb-4">
            Explore The Ecosystem
          </p>

          <h2 className="text-3xl md:text-5xl font-bold">
            One Universe.
            <span className="neon-gradient-text">
              {' '}Two Worlds.
            </span>
          </h2>

          <p className="text-gray-400 mt-4 max-w-xl mx-auto">
            A platform connecting music creators and collectors through
            blockchain-powered digital ownership.
          </p>

        </div>

        <div className="grid md:grid-cols-2 gap-7">

          {/* ARTIST CARD */}
          <div className="neon-feature-card creator-card">

            <div className="feature-icon">
              ♫
            </div>

            <p className="text-emerald-300 text-xs tracking-widest uppercase mb-3">
              For Artists
            </p>

            <h3 className="text-2xl font-bold mb-4">
              Create Your Legacy.
            </h3>

            <p className="text-gray-400 leading-7 mb-6">
              Turn your music into digital assets. Upload your songs and
              artwork, set your price and quantity, and share your work
              with collectors.
            </p>

            <ul className="space-y-3 text-sm text-gray-300">
              <li>✦ Upload music and album artwork</li>
              <li>✦ Mint music NFTs</li>
              <li>✦ List your creations on the marketplace</li>
            </ul>

            <Link href="/create" className="feature-link">
              Start Creating <span>↗</span>
            </Link>

          </div>

          {/* COLLECTOR CARD */}
          <div className="neon-feature-card collector-card">

            <div className="feature-icon">
              ◈
            </div>

            <p className="text-emerald-200 text-xs tracking-widest uppercase mb-3">
              For Collectors
            </p>

            <h3 className="text-2xl font-bold mb-4">
              Own The Next Sound.
            </h3>

            <p className="text-gray-400 leading-7 mb-6">
              Explore digital music collectibles, discover independent
              artists and purchase NFTs through Polygon blockchain
              transactions.
            </p>

            <ul className="space-y-3 text-sm text-gray-300">
              <li>✦ Discover music NFTs</li>
              <li>✦ Collect digital music assets</li>
              <li>✦ Trade through the marketplace</li>
            </ul>

            <Link href="/marketplace" className="feature-link">
              Explore Collection <span>↗</span>
            </Link>

          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-24">

        <div className="neon-cta text-center">

          <p className="text-emerald-300 text-xs tracking-[0.3em] uppercase mb-4">
            Your Sound. Your Universe.
          </p>

          <h2 className="text-3xl md:text-5xl font-bold mb-5">
            Ready to Enter
            <br />

            <span className="neon-gradient-text">
              NEONVERSE?
            </span>
          </h2>

          <p className="text-gray-400 max-w-lg mx-auto mb-8">
            Discover music without boundaries and experience the future
            of digital music ownership.
          </p>

          <Link href="/marketplace">
            <RegularButton text="Enter Marketplace" />
          </Link>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-emerald-400/10 py-7 text-center">

        <p className="text-[#8FA99F] text-xs tracking-wider">
          © 2026 NEONVERSE · Powered by Polygon Amoy
        </p>

        <p className="text-[#71877D] text-xs mt-2">
          Music without boundaries.
        </p>

      </footer>

      {/* EXISTING HOME PAGE EXTRAS */}
      <HomePageExtras />

    </div>
  );
}
