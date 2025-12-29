import { useEffect, useState } from "react";
import { providers, Contract } from "ethers";
import Navbar from "../components/Navbar";
import Card1 from "../components/Card1";
import { abi, NFT_CONTRACT_ADDRESS } from "../constants";
import { getProviderOrSigner } from "../store/util";
import useweb3store from "../store/web3store";

export default function Marketplace() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { web3modalRef } = useweb3store((s) => ({ web3modalRef: s.web3Modal }));

  const normalize = (r) => ({
    tokenId: r.tokenId.toString(),
    creator: r.creator,
    price: r.price,
    amount: r.amount,
    tokenUri: r.tokenUri,
    isActive: r.isActive,
  });

  const fetchAll = async () => {
    setLoading(true);
    try {
      const provider = await getProviderOrSigner(web3modalRef, false);
      const contract = new Contract(NFT_CONTRACT_ADDRESS, abi, provider);

      // fetch all market items
      const marketItems = await contract.fetchMarketItems();

      // fetch user's owned NFTs
      let ownedIds = new Set();
      try {
        const myNFTs = await contract.fetchMyNFTs();
        ownedIds = new Set(myNFTs.map((n) => n.tokenId.toString()));
      } catch {}

      const itemsWithMeta = await Promise.all(
        marketItems.map(async (i) => {
          const meta = await fetch(i.tokenUri).then((r) => r.json());
          return {
            ...normalize(i),
            name: meta.name,
            image: meta.image,
            animation_url: meta.animation_url,
            isOwned: ownedIds.has(i.tokenId.toString()),
          };
        })
      );

      setItems(itemsWithMeta);
    } catch (err) {
      console.error("Marketplace load error:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <div className="bg-bgBlue min-h-screen p-8">
      <Navbar />
      <h1 className="text-4xl text-white mb-8">NFT Marketplace</h1>

      {loading ? (
        <p className="text-gray-400">Loading NFTs...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((nft) => (
            <Card1 key={nft.tokenId} nft={nft} onDeleted={fetchAll} />
          ))}
        </div>
      )}
    </div>
  );
}
