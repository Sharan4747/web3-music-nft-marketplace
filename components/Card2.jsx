
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ethers } from "ethers";

export default function Card2({ nft }) {
  const [nftData, setNftData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    const getNftData = async () => {
      try {
        const res = await fetch(nft.tokenUri);

        if (!res.ok) {
          throw new Error("Unable to load NFT metadata");
        }

        const data = await res.json();

        if (active) {
          setNftData(data);
        }
      } catch (e) {
        console.error("NFT metadata error:", e);
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    };

    getNftData();

    return () => {
      active = false;
    };
  }, [nft.tokenUri]);

  return (
    <div className="group relative flex min-h-[420px] w-full flex-col overflow-hidden rounded-2xl border border-emerald-400/15 bg-gradient-to-b from-[#0D2920] to-[#06130F] p-4 text-white shadow-xl transition-all duration-500 hover:-translate-y-2 hover:border-emerald-400/50 hover:shadow-[0_15px_45px_rgba(16,185,129,0.15)]">

      {/* Background glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-400/10 blur-[65px] opacity-0 transition duration-500 group-hover:opacity-100" />

      {/* NFT artwork */}
      <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#020B09]">

        {nftData.image ? (
          <Image
            src={nftData.image}
            width={400}
            height={300}
            alt={nftData.name || "Music NFT"}
            unoptimized
            className="h-52 w-full object-cover transition duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-52 w-full flex-col items-center justify-center bg-gradient-to-br from-[#0C3024] to-[#020B09]">
            <span className="text-5xl text-emerald-400">♫</span>
            <span className="mt-3 text-xs tracking-widest text-[#8FA99F]">
              NEONVERSE
            </span>
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#020B09]/70 via-transparent to-transparent" />

        <div className="absolute left-3 top-3 rounded-full border border-emerald-300/25 bg-[#04150F]/80 px-3 py-1.5 backdrop-blur-md">
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-300">
            Music NFT
          </span>
        </div>
      </div>

      {/* NFT details */}
      <div className="relative z-10 flex flex-1 flex-col px-1 pt-4">

        <h3 className="truncate text-lg font-bold tracking-wide text-[#E5EEEA] transition group-hover:text-emerald-300">
          {loading
            ? "Loading NFT..."
            : nftData.name || "Untitled Music NFT"}
        </h3>

        {error && (
          <p className="mt-1 text-xs text-red-300">
            Could not load NFT metadata.
          </p>
        )}

        <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-[#78958A]">
          Digital music collectible
        </p>

        <div className="my-4 h-px bg-gradient-to-r from-emerald-400/30 via-white/10 to-transparent" />

        {/* Metadata */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-4">

          <div className="min-w-0">
            <p className="text-[9px] uppercase tracking-wider text-[#78958A]">
              Creator
            </p>
            <p className="mt-1 truncate text-xs font-medium text-[#D5E3DC]">
              {nftData.creatorName || "Unknown"}
            </p>
          </div>

          <div className="min-w-0 text-right">
            <p className="text-[9px] uppercase tracking-wider text-[#78958A]">
              Language
            </p>
            <p className="mt-1 truncate text-xs font-medium text-[#D5E3DC]">
              {nftData.language || "Not specified"}
            </p>
          </div>

          <div className="min-w-0">
            <p className="text-[9px] uppercase tracking-wider text-[#78958A]">
              Music Type
            </p>
            <p className="mt-1 truncate text-xs font-medium text-[#D5E3DC]">
              {nftData.typeofSong || "Not specified"}
            </p>
          </div>

          <div className="min-w-0 text-right">
            <p className="text-[9px] uppercase tracking-wider text-[#78958A]">
              Price
            </p>
            <p className="mt-1 text-xs font-bold text-emerald-300">
              {nft.price
                ? ethers.utils.formatEther(nft.price)
                : "0"}{" "}
              POL
            </p>
          </div>

        </div>

        {/* Music player */}
        <div className="mt-auto pt-5">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-emerald-300">
              <span className="mr-1">♫</span>
              Listen to Music
            </span>

            <span className="text-[9px] text-[#78958A]">
              NEONVERSE PLAYER
            </span>
          </div>

          {nftData.music ? (
            <audio
              controls
              preload="none"
              className="h-10 w-full accent-emerald-500"
              src={nftData.music}
            >
              Your browser does not support audio playback.
            </audio>
          ) : (
            <div className="rounded-xl border border-emerald-400/10 bg-[#020B09]/70 px-3 py-3 text-center text-xs text-[#78958A]">
              {loading ? "Loading audio..." : "Audio unavailable"}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-[9px] uppercase tracking-[0.16em] text-[#647F73]">
            Secured by Polygon
          </span>

          <span className="flex items-center gap-1.5 text-[9px] text-emerald-400/80">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            On-chain
          </span>
        </div>

      </div>
    </div>
  );
}
