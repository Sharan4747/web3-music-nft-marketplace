import { useState } from "react";
import { Contract, utils, BigNumber } from "ethers";
import { abi, NFT_CONTRACT_ADDRESS } from "../constants";
import { getProviderOrSigner } from "../store/util";
import useweb3store from "../store/web3store";

export default function Card1({ nft, onDeleted }) {
  const [busy, setBusy] = useState(false);
  const { web3modalRef } = useweb3store((s) => ({ web3modalRef: s.web3Modal }));

  // ---------------- BUY ----------------
  const handleBuy = async () => {
    try {
      setBusy(true);

      const signer = await getProviderOrSigner(web3modalRef, true);

      // ✅ Network check
      const network = await signer.provider.getNetwork();
      if (network.chainId !== 80002) {
        alert("Please switch to Polygon Amoy network");
        setBusy(false);
        return;
      }

      const contract = new Contract(NFT_CONTRACT_ADDRESS, abi, signer);

      // ✅ Ensure correct BigNumber value
      const value = BigNumber.from(nft.price.toString());

      const tx = await contract.createMarketSale(nft.tokenId, {
        value,
      });

      await tx.wait();

      alert("🎉 Purchase successful");
      onDeleted();
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

  // ---------------- DELETE ----------------
  const handleDelete = async () => {
    if (!confirm("Delete this NFT from marketplace?")) return;

    try {
      setBusy(true);
      const signer = await getProviderOrSigner(web3modalRef, true);

      const network = await signer.provider.getNetwork();
      if (network.chainId !== 80002) {
        alert("Please switch to Polygon Amoy network");
        setBusy(false);
        return;
      }

      const contract = new Contract(NFT_CONTRACT_ADDRESS, abi, signer);
      const tx = await contract.removeFromMarket(nft.tokenId);
      await tx.wait();

      alert("🗑 NFT removed");
      onDeleted();
    } catch (e) {
      console.error("Delete error:", e);
      alert("Delete failed");
    } finally {
      setBusy(false);
    }
  };

  // ---------------- DOWNLOAD ----------------
  const handleDownload = async () => {
    try {
      const res = await fetch(nft.animation_url);
      const blob = await res.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = nft.name || "content";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert("Download failed");
    }
  };

  return (
    <div className="bg-[#0a0d1d] p-4 rounded-xl text-white">
      <img
        src={nft.image}
        alt={nft.name}
        className="rounded mb-2 w-full h-48 object-cover"
      />

      <h3 className="font-bold truncate">{nft.name}</h3>

      <p className="text-sm text-gray-400 mb-2">
        {utils.formatEther(nft.price)} POL
      </p>

      <div className="flex gap-2">
        <button
          onClick={handleBuy}
          disabled={busy}
          className="flex-1 bg-blue-600 hover:bg-blue-700 rounded py-2"
        >
          Buy
        </button>

        <button
          onClick={handleDelete}
          disabled={busy}
          className="bg-red-600 hover:bg-red-700 px-4 rounded"
        >
          🗑
        </button>
      </div>

      {nft.isOwned && nft.animation_url && (
        <button
          onClick={handleDownload}
          className="mt-3 w-full bg-green-600 hover:bg-green-700 rounded py-2 text-sm"
        >
          ⬇ Download
        </button>
      )}
    </div>
  );
}
