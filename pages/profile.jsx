import { useEffect, useState } from "react";
import { Contract, utils } from "ethers";
import Navbar from "../components/Navbar";
import { abi, NFT_CONTRACT_ADDRESS } from "../constants";
import { getProviderOrSigner } from "../store/util";
import useweb3store from "../store/web3store";

export default function Profile() {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { web3modalRef } = useweb3store((s) => ({ web3modalRef: s.web3Modal }));

  const loadMyNFTs = async () => {
    try {
      setLoading(true);

      // ✅ must use signer (msg.sender)
      const signer = await getProviderOrSigner(web3modalRef, true);

      const network = await signer.provider.getNetwork();
      if (network.chainId !== 80002) {
        alert("Please switch to Polygon Amoy network");
        setLoading(false);
        return;
      }

      const contract = new Contract(NFT_CONTRACT_ADDRESS, abi, signer);
      const data = await contract.fetchMyNFTs();

      const items = await Promise.all(
        data.map(async (i) => {
          const meta = await fetch(i.tokenUri).then((r) => r.json());
          return {
            tokenId: i.tokenId.toString(),
            creator: i.creator,
            price: i.price,
            name: meta.name,
            image: meta.image,
            animation_url: meta.animation_url,
          };
        })
      );

      setNfts(items);
    } catch (err) {
      console.error("Profile load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMyNFTs();
  }, []);

  // ⬇ DOWNLOAD WITH CLEAN FILE NAME
  const handleDownload = async (nft) => {
    try {
      const res = await fetch(nft.animation_url);
      const blob = await res.blob();

      // ✅ clean & teacher-friendly filename
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
      window.URL.revokeObjectURL(url);
    } catch {
      alert("Download failed");
    }
  };

  return (
    <div className="bg-bgBlue min-h-screen p-8">
      <Navbar />
      <h1 className="text-4xl text-white mb-8">My Purchased NFTs</h1>

      {loading ? (
        <p className="text-gray-400">Loading your NFTs...</p>
      ) : nfts.length === 0 ? (
        <p className="text-gray-400">You have not purchased any NFTs yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {nfts.map((nft) => (
            <div
              key={nft.tokenId}
              className="bg-[#0a0d1d] p-4 rounded-xl text-white"
            >
              <img
                src={nft.image}
                alt={nft.name}
                className="rounded mb-2 w-full h-48 object-cover"
              />

              <h3 className="font-bold truncate">{nft.name}</h3>

              <p className="text-sm text-gray-400 mb-2">
                {utils.formatEther(nft.price)} POL
              </p>

              <button
                onClick={() => handleDownload(nft)}
                className="w-full bg-green-600 hover:bg-green-700 rounded py-2 mt-2"
              >
                ⬇ Download
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
