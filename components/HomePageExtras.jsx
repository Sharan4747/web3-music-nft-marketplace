
import React from 'react';
import Bookmark from '../public/images/Bookmark.png';
import Upload from '../public/images/Paper-Upload.png';
import Wallet from '../public/images/Wallet.png';
import Image from 'next/image';

export default function HomePageExtras() {
  const steps = [
    {
      number: '01',
      title: 'Connect Your Wallet',
      description:
        'Connect your crypto wallet to NEONVERSE and access the world of music NFTs. Your wallet gives you access to create, collect and manage your digital assets.',
      image: Wallet,
      alt: 'Wallet Icon',
    },
    {
      number: '02',
      title: 'Upload Your Music',
      description:
        'Bring your creativity to life. Upload your music, add artwork and metadata, and transform your digital creation into a unique music NFT.',
      image: Upload,
      alt: 'Upload Icon',
    },
    {
      number: '03',
      title: 'List & Sell Your NFTs',
      description:
        'Set your price and list your music NFT on the marketplace. Let collectors discover your work and become part of your music journey.',
      image: Bookmark,
      alt: 'Sale Icon',
    },
  ];

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#020B09] px-5 py-24 text-white md:px-10">

      {/* BACKGROUND GLOW */}
      <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-emerald-500/10 blur-[130px]" />

      <div className="pointer-events-none absolute -right-40 bottom-10 h-96 w-96 rounded-full bg-emerald-300/10 blur-[130px]" />

      {/* BACKGROUND GRID */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(16,185,129,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl">

        {/* SECTION HEADING */}
        <div className="mb-16 text-center">

          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-4 py-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />

            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-emerald-300">
              Start Your Journey
            </span>
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Create & Sell Your
            <span className="block bg-gradient-to-r from-emerald-300 via-emerald-500 to-[#C8D4D0] bg-clip-text text-transparent">
              Music NFTs.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#8FA99F] md:text-base">
            Turn your creativity into digital ownership.
            Follow three simple steps to bring your music into NEONVERSE.
          </p>

        </div>

        {/* THREE STEPS */}
        <div className="grid grid-cols-1 gap-7 md:grid-cols-3">

          {steps.map((step, index) => (
            <div
              key={step.number}
              className="group relative overflow-hidden rounded-3xl border border-emerald-400/15 bg-gradient-to-b from-[#0D2920]/90 to-[#06130F]/90 p-8 backdrop-blur-xl transition-all duration-500 hover:-translate-y-3 hover:border-emerald-400/40 hover:shadow-[0_20px_55px_rgba(16,185,129,0.12)]"
            >

              {/* CARD GLOW */}
              <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-400/10 blur-[65px] opacity-0 transition duration-500 group-hover:opacity-100" />

              {/* STEP NUMBER */}
              <div className="relative flex items-center justify-between">

                <span className="text-sm font-bold tracking-[0.2em] text-emerald-400/70">
                  STEP {step.number}
                </span>

                <span className="text-4xl font-bold text-white/[0.06]">
                  {step.number}
                </span>

              </div>

              {/* ICON */}
              <div className="relative mt-8 flex h-20 w-20 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/5 shadow-[0_0_30px_rgba(16,185,129,0.05)] transition duration-500 group-hover:border-emerald-400/40 group-hover:bg-emerald-400/10 group-hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]">

                <Image
                  src={step.image}
                  width={40}
                  height={40}
                  alt={step.alt}
                  className="h-10 w-10 object-contain opacity-90 transition duration-500 group-hover:scale-110"
                />

              </div>

              {/* TEXT */}
              <h3 className="relative mt-8 text-xl font-bold text-[#E5EEEA] transition group-hover:text-emerald-300 md:text-2xl">
                {step.title}
              </h3>

              <p className="relative mt-4 text-sm leading-7 text-[#8FA99F]">
                {step.description}
              </p>

              {/* BOTTOM LINE */}
              <div className="relative mt-8 h-px w-full bg-gradient-to-r from-emerald-400/40 via-emerald-400/10 to-transparent transition duration-500 group-hover:from-emerald-300" />

              <div className="relative mt-5 flex items-center justify-between">

                <span className="text-[10px] uppercase tracking-[0.2em] text-[#71877D]">
                  NEONVERSE
                </span>

                <span className="text-lg text-emerald-400 transition duration-300 group-hover:translate-x-1">
                  ↗
                </span>

              </div>

            </div>
          ))}

        </div>

        {/* BOTTOM MESSAGE */}
        <div className="mt-16 text-center">

          <p className="text-sm tracking-wide text-[#8FA99F]">
            Your creativity deserves to be owned.
            <span className="ml-1 font-semibold text-emerald-300">
              Make it happen with NEONVERSE.
            </span>
          </p>

        </div>

      </div>
    </section>
  );
}
