
import { useEffect, useState } from "react";
import { Contract, utils } from "ethers";
import Navbar from "../components/Navbar";
import Link from "next/link";
import { abi, NFT_CONTRACT_ADDRESS } from "../constants";
import { getProviderOrSigner } from "../store/util";
import useweb3store from "../store/web3store";

export default function Profile() {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { web3modalRef } = useweb3store((s) => ({
    web3modalRef: s.web3Modal,
  }));

  // Load NFTs belonging to connected wallet
  const loadMyNFTs = async () => {
    try {
      setLoading(true);
      setError("");

      const signer = await getProviderOrSigner(web3modalRef, true);

      const network = await signer.provider.getNetwork();

      if (network.chainId !== 80002) {
        setError("Please switch your wallet to Polygon Amoy.");
        return;
      }

      const contract = new Contract(
        NFT_CONTRACT_ADDRESS,
        abi,
        signer
      );

      const data = await contract.fetchMyNFTs();

      const items = await Promise.all(
        data.map(async (i) => {
          const response = await fetch(i.tokenUri);

          if (!response.ok) {
            throw new Error("Unable to load NFT metadata.");
          }

          const meta = await response.json();

          return {
            tokenId: i.tokenId.toString(),
            creator: i.creator,
            price: i.price,
            name: meta.name || "Untitled Music NFT",
            image: meta.image || "",
            animation_url: meta.animation_url || "",
          };
        })
      );

      setNfts(items);
    } catch (err) {
      console.error("Profile load error:", err);
      setError(
        err?.reason ||
        err?.message ||
        "Unable to load your NFTs. Please reconnect your wallet and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMyNFTs();
  }, []);

  // Download music NFT
  const handleDownload = async (nft) => {
    try {
      if (!nft.animation_url) {
        alert("Music file is not available for this NFT.");
        return;
      }

      const res = await fetch(nft.animation_url);

      if (!res.ok) {
        throw new Error("Music download failed.");
      }

      const blob = await res.blob();

      const safeName = nft.name
        ? nft.name.replace(/[^a-z0-9]/gi, "_").toLowerCase()
        : "music_nft";

      const creatorShort = nft.creator
        ? nft.creator.slice(2, 6)
        : "creator";

      const fileName = `${safeName}_${creatorShort}.mp3`;

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.href = url;
      a.download = fileName;

      document.body.appendChild(a);
      a.click();
      a.remove();

      window.setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);
    } catch (err) {
      console.error("Download error:", err);
      alert("Download failed. Please try again.");
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020B09] text-white">

      <Navbar />

      {/* Emerald background effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-20 h-[450px] w-[450px] rounded-full bg-emerald-500/10 blur-[140px]" />
        <div className="absolute -right-40 top-[40%] h-[450px] w-[450px] rounded-full bg-teal-400/10 blur-[140px]" />
        <div className="absolute bottom-0 left-1/3 h-[300px] w-[300px] rounded-full bg-emerald-400/[0.07] blur-[120px]" />

        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(52,211,153,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,0.25) 1px, transparent 1px)",
            backgroundSize: "65px 65px",
          }}
        />
      </div>

      <section className="relative z-10 mx-auto max-w-7xl px-5 pb-20 pt-14 md:px-10">

        {/* Header */}
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-4 py-2 text-xs font-semibold tracking-[0.2em] text-emerald-300">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              NEONVERSE COLLECTION
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl">
              My <span className="bg-gradient-to-r from-emerald-300 via-[#C8D4D0] to-emerald-500 bg-clip-text text-transparent">Collection</span>
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-[#8FA99F] md:text-base">
              Your music NFTs, all in one place. Explore your collection
              and download the music you own.
            </p>
          </div>

          <Link
            href="/marketplace"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/[0.06] px-6 py-3 text-sm font-semibold text-emerald-300 transition-all duration-300 hover:-translate-y-1 hover:bg-emerald-400/15"
          >
            Explore Marketplace <span>→</span>
          </Link>
        </div>

        {/* Collection stats */}
        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-emerald-300/15 bg-[#071C18]/75 p-6 backdrop-blur-xl">
            <p className="text-xs font-semibold tracking-[0.18em] text-[#8FA99F]">
              TOTAL NFTs
            </p>

            <div className="mt-3 flex items-center justify-between">
              <h2 className="text-4xl font-bold text-white">
                {loading ? "—" : nfts.length}
              </h2>
              <span className="text-3xl text-emerald-300">♬</span>
            </div>
            <p className="mt-2 text-xs text-[#8FA99F]">
              NFTs returned by your connected wallet
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#071C18]/75 p-6 backdrop-blur-xl">
            <p className="text-xs font-semibold tracking-[0.18em] text-[#8FA99F]">
              NETWORK
            </p>

            <div className="mt-3 flex items-center gap-3">
              <span className="h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.8)]" />
              <h2 className="text-2xl font-bold text-[#C8D4D0]">
                Polygon Amoy
              </h2>
            </div>
            <p className="mt-2 text-xs text-[#8FA99F]">
              Chain ID: 80002
            </p>
          </div>
        </div>

        {/* Collection content */}
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Your Music NFTs
            </h2>
            <p className="mt-1 text-sm text-[#8FA99F]">
              Discover the music in your digital collection.
            </p>
          </div>

          <button
            onClick={loadMyNFTs}
            disabled={loading}
            className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-[#C8D4D0] transition hover:border-emerald-400/40 hover:text-emerald-300 disabled:opacity-50"
          >
            {loading ? "Loading..." : "↻ Refresh Collection"}
          </button>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-white/10 bg-[#071C18]/60">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-400/20 border-t-emerald-400" />
            <p className="mt-5 text-sm text-[#8FA99F]">
              Loading your music collection...
            </p>
          </div>

        ) : error ? (
          <div className="rounded-3xl border border-red-400/20 bg-red-400/[0.05] px-6 py-12 text-center">
            <div className="text-4xl">⚠</div>
            <h3 className="mt-4 text-xl font-bold text-white">
              Unable to load collection
            </h3>
            <p className="mx-auto mt-3 max-w-lg break-words text-sm text-[#8FA99F]">
              {error}
            </p>
            <button
              onClick={loadMyNFTs}
              className="mt-6 rounded-full bg-emerald-400 px-6 py-3 text-sm font-bold text-[#02110C] transition hover:bg-emerald-300"
            >
              Try Again
            </button>
          </div>

        ) : nfts.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-[#071C18]/60 px-6 py-16 text-center backdrop-blur-xl">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] text-4xl text-emerald-300">
              ♬
            </div>

            <h3 className="mt-6 text-2xl font-bold text-white">
              Your collection is waiting
            </h3>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#8FA99F]">
              You don't have any NFTs displayed here yet. Visit the
              marketplace to discover music or create your own NFT.
            </p>

            <Link
              href="/marketplace"
              className="mt-7 inline-flex rounded-full bg-gradient-to-r from-emerald-500 to-emerald-300 px-7 py-3 font-bold text-[#02110C] transition hover:-translate-y-1"
            >
              Explore Music NFTs →
            </Link>
          </div>

        ) : (
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {nfts.map((nft) => (
              <div
                key={nft.tokenId}
                className="group overflow-hidden rounded-2xl border border-emerald-300/10 bg-[#071C18]/80 shadow-[0_10px_40px_rgba(0,0,0,0.2)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-emerald-300/40 hover:shadow-[0_15px_45px_rgba(16,185,129,0.12)]"
              >
                {/* NFT artwork */}
                <div className="relative h-56 overflow-hidden bg-[#020B09]">
                  {nft.image ? (
                    <img
                      src={nft.image}
                      alt={nft.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-6xl text-emerald-300">
                      ♬
                    </div>
                  )}

                  <div className="absolute left-4 top-4 rounded-full border border-emerald-300/30 bg-[#020B09]/80 px-3 py-1 text-[10px] font-bold tracking-wider text-emerald-300 backdrop-blur-md">
                    OWNED NFT
                  </div>

                  <div className="absolute bottom-3 right-3 rounded-full bg-[#020B09]/80 px-3 py-1 text-xs text-[#C8D4D0] backdrop-blur-md">
                    #{nft.tokenId}
                  </div>
                </div>

                {/* NFT details */}
                <div className="p-5">
                  <h3 className="truncate text-lg font-bold text-white transition-colors group-hover:text-emerald-300">
                    {nft.name}
                  </h3>

                  <p className="mt-2 truncate text-xs text-[#8FA99F]">
                    Creator: {nft.creator}
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t border-white/[0.07] pt-4">
                    <div>
                      <p className="text-[10px] font-semibold tracking-wider text-[#8FA99F]">
                        LISTED PRICE
                      </p>
                      <p className="mt-1 text-lg font-bold text-emerald-300">
                        {utils.formatEther(nft.price)} POL
                      </p>
                    </div>

                    <span className="text-2xl text-[#8FA99F]">♫</span>
                  </div>

                  <button
                    onClick={() => handleDownload(nft)}
                    disabled={!nft.animation_url}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 py-3 text-sm font-bold text-[#02110C] transition-all duration-300 hover:shadow-[0_0_25px_rgba(16,185,129,0.25)] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    ↓ Download Music
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-16 border-t border-white/[0.07] pt-7 text-center">
          <p className="text-xs tracking-widest text-[#557269]">
            NEONVERSE · OWN THE SOUND · POLYGON AMOY
          </p>
        </div>
      </section>
    </main>
  );
}
