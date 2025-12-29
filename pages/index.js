import Navbar from '../components/Navbar';
import RegularButton from '../components/RegularButton';
import StrokeButton from '../components/StrokeButton';
import newHomeImage from '../public/images/newHomeImage.svg';
import Image from 'next/image';
import Link from 'next/link';
import HomePageExtras from '../components/HomePageExtras';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020617] via-[#0a0f2c] to-[#010414] text-white overflow-hidden relative">
      {/* === Navbar === */}
      <Navbar />

      {/* === Background glow + grid === */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.15),transparent_70%)] opacity-80"></div>
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.05] bg-repeat"></div>

      {/* === Main content === */}
      <main className="relative z-10 flex flex-col md:flex-row justify-between items-center px-8 md:px-16 py-10 md:py-20">
        {/* Left Section */}
        <div className="w-full md:w-3/5 space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold gradient-text leading-tight">
            Smart Music Infrastructure <br />
            <span className="text-cyan-300">for a Decentralized Future</span>
          </h1>

          <p className="text-gray-300 md:text-lg max-w-xl">
            Empowering <span className="text-cyan-400 font-medium">Creators</span> to mint, share, 
            and earn from their music while giving <span className="text-violet-400 font-medium">Collectors</span> 
            ownership of the next wave of sound.
          </p>

          <div className="flex space-x-4">
            <Link href="/marketplace">
              <RegularButton text={'Explore Marketplace'} />
            </Link>
            <Link href="/create">
              <StrokeButton>Create NFT</StrokeButton>
            </Link>
          </div>
        </div>

        {/* Right Section (Image + Futuristic Glow) */}
        <div className="relative w-full md:w-2/5 flex justify-center items-center mt-12 md:mt-0">
          <div className="absolute w-[400px] h-[400px] bg-cyan-500 rounded-full blur-[180px] opacity-20"></div>
          <Image
            src={newHomeImage}
            alt="Home illustration"
            className="relative z-10 w-[85%] hover:scale-105 transition-transform duration-500"
          />
        </div>
      </main>

      {/* === Section: Two Pillars (like your ref image) === */}
      <section className="relative z-10 grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mt-10 mb-20 px-6 md:px-0">
        {/* Pillar 1 */}
        <div className="glass-panel p-6 md:p-8">
          <h2 className="text-2xl font-semibold text-cyan-400 mb-3">Pillar 1 — Living Music (Creators)</h2>
          <p className="text-gray-400 mb-4">
            Mint your sound NFTs using self-healing smart contracts that evolve over time. 
            Enhance your reach and longevity of creative assets.
          </p>
          <ul className="text-sm text-gray-400 space-y-1 list-disc ml-5">
            <li>Upload songs and album art</li>
            <li>Set price and amount</li>
            <li>Earn from every resale</li>
          </ul>
        </div>

        {/* Pillar 2 */}
        <div className="glass-panel p-6 md:p-8">
          <h2 className="text-2xl font-semibold text-violet-400 mb-3">Pillar 2 — AI-Driven Collecting (Buyers)</h2>
          <p className="text-gray-400 mb-4">
            AI-powered discovery helps collectors find rare music NFTs and track 
            market trends in real-time.
          </p>
          <ul className="text-sm text-gray-400 space-y-1 list-disc ml-5">
            <li>View verified creators and drops</li>
            <li>Secure Polygon transactions</li>
            <li>Predictive NFT recommendations</li>
          </ul>
        </div>
      </section>

      {/* === Footer === */}
      <footer className="relative z-10 text-center text-gray-500 text-sm pb-6">
        © 2025 MNFTs — Powered by Polygon Amoy | Built for Sustainable Music
      </footer>

      <HomePageExtras />
    </div>
  );
}
