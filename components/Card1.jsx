
import { useState } from "react";
import { Contract, utils, BigNumber } from "ethers";
import { abi, NFT_CONTRACT_ADDRESS } from "../constants";
import { getProviderOrSigner } from "../store/util";
import useweb3store from "../store/web3store";

export default function Card1({ nft, onDeleted }) {
  const [busy, setBusy] = useState(false);
  const [imageError, setImageError] = useState(false);

  const { web3modalRef } = useweb3store((s) => ({
    web3modalRef: s.web3Modal,
  }));

  const handleBuy = async () => {
    try {
      setBusy(true);

      const signer = await getProviderOrSigner(web3modalRef, true);
      const network = await signer.provider.getNetwork();

      if (network.chainId !== 80002) {
        alert("Please switch to Polygon Amoy network");
        return;
      }

      const contract = new Contract(
        NFT_CONTRACT_ADDRESS,
        abi,
        signer
      );

      const value = BigNumber.from(nft.price.toString());

      const tx = await contract.createMarketSale(nft.tokenId, {
        value,
      });

      await tx.wait();

      alert("🎉 Purchase successful");
      if (onDeleted) await onDeleted();
    } catch (e) {
      console.error("Buy error:", e);

      alert(
        e?.error?.data?.message ||
        e?.reason ||
        e?.message ||
        "Buy failed"
      );
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Remove this NFT from the marketplace?")) return;

    try {
      setBusy(true);

      const signer = await getProviderOrSigner(web3modalRef, true);
      const network = await signer.provider.getNetwork();

      if (network.chainId !== 80002) {
        alert("Please switch to Polygon Amoy network");
        return;
      }

      const contract = new Contract(
        NFT_CONTRACT_ADDRESS,
        abi,
        signer
      );

      const tx = await contract.removeFromMarket(nft.tokenId);

      await tx.wait();

      alert("🗑 NFT removed");
      if (onDeleted) await onDeleted();
    } catch (e) {
      console.error("Delete error:", e);
      alert(e?.reason || e?.message || "Delete failed");
    } finally {
      setBusy(false);
    }
  };

  const handleDownload = async () => {
    let url;

    try {
      if (!nft.animation_url) {
        alert("No downloadable content available");
        return;
      }

      const res = await fetch(nft.animation_url);

      if (!res.ok) {
        throw new Error("Unable to fetch NFT content");
      }

      const blob = await res.blob();
      url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = nft.name || "NEONVERSE-content";

      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e) {
      console.error("Download error:", e);
      alert("Download failed");
    } finally {
      if (url) {
        setTimeout(() => window.URL.revokeObjectURL(url), 1000);
      }
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-emerald-400/15 bg-gradient-to-b from-[#0D2920] to-[#06130F] p-3 text-white shadow-xl transition-all duration-500 hover:-translate-y-2 hover:border-emerald-400/50 hover:shadow-[0_15px_45px_rgba(16,185,129,0.15)]">

      {/* Background glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-400/10 blur-[65px] opacity-0 transition duration-500 group-hover:opacity-100" />

      {/* NFT artwork */}
      <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#020B09]">

        {nft.image && !imageError ? (
          <img
            src={nft.image}
            alt={nft.name || "Music NFT"}
            onError={() => setImageError(true)}
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

        {nft.isOwned && (
          <div className="absolute right-3 top-3 rounded-full border border-emerald-300/30 bg-emerald-500/20 px-3 py-1.5 backdrop-blur-md">
            <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-200">
              Owned
            </span>
          </div>
        )}

        <div className="absolute bottom-3 left-3">
          <span className="text-xs font-medium text-white/80">
            #{nft.tokenId}
          </span>
        </div>
      </div>

      {/* NFT information */}
      <div className="relative z-10 px-1 pb-1 pt-4">

        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3
              title={nft.name}
              className="truncate text-base font-bold tracking-wide text-[#E5EEEA] transition group-hover:text-emerald-300"
            >
              {nft.name || `Music NFT #${nft.tokenId}`}
            </h3>

            <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-[#78958A]">
              Digital collectible
            </p>
          </div>

          <div className="shrink-0 text-right">
            <p className="text-[9px] uppercase tracking-wider text-[#78958A]">
              Price
            </p>

            <p className="mt-1 text-sm font-bold text-emerald-300">
              {utils.formatEther(nft.price)}
              <span className="ml-1 text-[10px] font-medium text-[#A8B8B0]">
                POL
              </span>
            </p>
          </div>
        </div>

        <div className="my-4 h-px bg-gradient-to-r from-emerald-400/30 via-white/10 to-transparent" />

        {/* Marketplace actions */}
        <div className="flex gap-2">

          <button
            type="button"
            onClick={handleBuy}
            disabled={busy}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-400 py-3 text-xs font-bold text-[#03140D] shadow-[0_4px_18px_rgba(16,185,129,0.12)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_5px_25px_rgba(16,185,129,0.3)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? (
              <>
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-[#03140D]/30 border-t-[#03140D]" />
                Processing
              </>
            ) : (
              <>
                Buy NFT <span>↗</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={busy}
            title="Remove from marketplace"
            className="flex h-11 w-12 items-center justify-center rounded-xl border border-red-400/20 bg-red-400/5 text-red-300 transition duration-300 hover:border-red-400/50 hover:bg-red-400/15 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span className="text-lg">⌫</span>
          </button>
        </div>

        {/* Download purchased content */}
        {nft.isOwned && nft.animation_url && (
          <button
            type="button"
            onClick={handleDownload}
            disabled={busy}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/5 py-3 text-xs font-semibold tracking-wide text-emerald-300 transition duration-300 hover:border-emerald-400/40 hover:bg-emerald-400/10 disabled:opacity-50"
          >
            <span>↓</span>
            Download Your Content
          </button>
        )}

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
