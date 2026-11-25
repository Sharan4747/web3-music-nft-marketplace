
import { useEffect, useState } from "react";
import { Contract } from "ethers";
import Navbar from "../components/Navbar";
import Card1 from "../components/Card1";
import { abi, NFT_CONTRACT_ADDRESS } from "../constants";
import { getReadProvider } from "../store/util";

export default function Marketplace() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");

  const normalize = (r) => ({
    tokenId: r.tokenId.toString(),
    creator: r.creator,
    price: r.price,
    amount: r.amount,
    tokenUri: r.tokenUri,
    isActive: r.isActive,
  });

  // FETCH MARKETPLACE NFTs
  const fetchAll = async () => {
    setLoading(true);
    setError("");

    try {
      const provider = getReadProvider();
      const contract = new Contract(
        NFT_CONTRACT_ADDRESS,
        abi,
        provider
      );

      const marketItems = await contract.fetchMarketItems();

      let ownedIds = new Set();

      try {
        const myNFTs = await contract.fetchMyNFTs();
        ownedIds = new Set(
          myNFTs.map((n) => n.tokenId.toString())
        );
      } catch (err) {
        console.warn("Could not fetch owned NFTs:", err);
      }

      const itemsWithMeta = await Promise.all(
        marketItems.map(async (i) => {
          try {
            const response = await fetch(i.tokenUri);

            if (!response.ok) {
              throw new Error("Metadata request failed");
            }

            const meta = await response.json();

            return {
              ...normalize(i),
              name: meta.name || `Music NFT #${i.tokenId}`,
              description: meta.description || "",
              image: meta.image || "",
              animation_url: meta.animation_url || "",
              isOwned: ownedIds.has(i.tokenId.toString()),
            };
          } catch (metadataError) {
            console.error(
              `Metadata error for NFT ${i.tokenId}:`,
              metadataError
            );

            return {
              ...normalize(i),
              name: `Music NFT #${i.tokenId}`,
              description: "",
              image: "",
              animation_url: "",
              isOwned: ownedIds.has(i.tokenId.toString()),
            };
          }
        })
      );

      setItems(itemsWithMeta);
    } catch (err) {
      console.error("Marketplace load error:", err);
      setError("Unable to load the marketplace. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // SEARCH AND FILTER
  const filteredItems = items.filter((nft) => {
    const searchTerm = search.toLowerCase();

    const matchesSearch =
      (nft.name || "").toLowerCase().includes(searchTerm) ||
      (nft.creator || "").toLowerCase().includes(searchTerm) ||
      nft.tokenId.includes(searchTerm);

    const matchesFilter =
      filter === "all" ||
      (filter === "owned" && nft.isOwned) ||
      (filter === "available" && !nft.isOwned);

    return matchesSearch && matchesFilter;
  });

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020B09] text-[#C8D4D0]">

      {/* ANIMATED BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="absolute -left-40 top-20 h-[450px] w-[450px] rounded-full bg-emerald-600/15 blur-[130px]" />

        <div className="absolute -right-40 top-[35%] h-[500px] w-[500px] rounded-full bg-emerald-300/10 blur-[150px]" />

        <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-teal-500/10 blur-[130px]" />

        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(16,185,129,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.35) 1px, transparent 1px)",
            backgroundSize: "65px 65px",
          }}
        />

        <div className="absolute left-[12%] top-[25%] h-2 w-2 animate-pulse rounded-full bg-emerald-300 shadow-[0_0_20px_5px_rgba(16,185,129,0.4)]" />

        <div className="absolute right-[15%] top-[55%] h-2 w-2 animate-pulse rounded-full bg-emerald-200 shadow-[0_0_20px_5px_rgba(16,185,129,0.4)]" />

        <div className="absolute bottom-[20%] left-[65%] h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
      </div>

      {/* NAVBAR */}
      <div className="relative z-20">
        <Navbar />
      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-10 mx-auto max-w-7xl px-5 pb-24 pt-12 sm:px-8">

        {/* PAGE INTRO */}
        <section className="mb-12">

          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-4 py-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-emerald-300">
              Discover the extraordinary
            </span>
          </div>

          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">

            <div className="max-w-2xl">
              <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                Explore the
                <span className="block bg-gradient-to-r from-emerald-300 via-emerald-500 to-[#D1DAD6] bg-clip-text text-transparent">
                  Music Universe.
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-sm leading-7 text-[#8FA99F] sm:text-base">
                Discover unique music NFTs, collect exclusive sounds,
                and own a piece of the music you love.
              </p>
            </div>

            {/* MARKETPLACE STATS */}
            <div className="grid grid-cols-2 gap-3 sm:min-w-[300px]">

              <div className="rounded-2xl border border-emerald-400/15 bg-white/[0.035] p-5 backdrop-blur-xl">
                <p className="text-xs text-[#8FA99F]">
                  Listed NFTs
                </p>
                <p className="mt-2 text-3xl font-bold text-emerald-300">
                  {items.length}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl">
                <p className="text-xs text-[#8FA99F]">
                  Your Collection
                </p>
                <p className="mt-2 text-3xl font-bold text-[#D1DAD6]">
                  {items.filter((item) => item.isOwned).length}
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* SEARCH AND FILTERS */}
        <section className="mb-10 rounded-2xl border border-emerald-400/15 bg-white/[0.035] p-4 backdrop-blur-xl sm:p-5">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            {/* SEARCH */}
            <div className="relative w-full lg:max-w-md">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-emerald-400">
                ⌕
              </span>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search music, creator or NFT ID..."
                className="w-full rounded-xl border border-white/10 bg-[#071C18]/80 py-3.5 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-[#71877D] focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/10"
              />
            </div>

            {/* FILTER BUTTONS */}
            <div className="flex flex-wrap gap-2">

              {[
                { label: "All NFTs", value: "all" },
                { label: "My NFTs", value: "owned" },
                { label: "Available", value: "available" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFilter(option.value)}
                  className={`rounded-xl px-4 py-3 text-xs font-semibold transition duration-300 ${
                    filter === option.value
                      ? "bg-emerald-500 text-[#03140D] shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                      : "border border-white/10 bg-white/[0.03] text-[#A8B8B0] hover:border-emerald-400/30 hover:text-emerald-300"
                  }`}
                >
                  {option.label}
                </button>
              ))}

            </div>
          </div>
        </section>

        {/* COLLECTION HEADER */}
        <div className="mb-7 flex items-center justify-between">

          <div>
            <h2 className="text-2xl font-semibold text-white">
              Explore Collections
            </h2>
            <p className="mt-1 text-xs text-[#8FA99F]">
              Discover music created by the community
            </p>
          </div>

          <button
            onClick={fetchAll}
            disabled={loading}
            className="rounded-xl border border-emerald-400/20 bg-emerald-400/5 px-4 py-2.5 text-xs font-medium text-emerald-300 transition hover:bg-emerald-400/10 disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "↻ Refresh"}
          </button>

        </div>

        {/* LOADING STATE */}
        {loading ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center">

            <div className="relative h-16 w-16">
              <div className="absolute inset-0 rounded-full border-2 border-emerald-400/15" />
              <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-emerald-400" />
              <div className="absolute inset-3 animate-pulse rounded-full bg-emerald-400/20 blur-md" />
            </div>

            <p className="mt-6 text-sm font-medium text-emerald-300">
              Discovering music NFTs...
            </p>

            <p className="mt-2 text-xs text-[#71877D]">
              Connecting to the Polygon marketplace
            </p>

          </div>
        ) : error ? (

          /* ERROR STATE */
          <div className="rounded-2xl border border-red-400/20 bg-red-400/5 p-10 text-center">

            <p className="text-sm text-red-300">{error}</p>

            <button
              onClick={fetchAll}
              className="mt-5 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-[#03140D] transition hover:bg-emerald-400"
            >
              Try Again
            </button>

          </div>

        ) : filteredItems.length === 0 ? (

          /* EMPTY STATE */
          <div className="relative overflow-hidden rounded-3xl border border-emerald-400/15 bg-white/[0.025] px-6 py-20 text-center backdrop-blur-xl">

            <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[80px]" />

            <div className="relative z-10">

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-emerald-400/20 bg-emerald-400/5 text-4xl">
                ♫
              </div>

              <h3 className="mt-7 text-2xl font-semibold text-white">
                {search || filter !== "all"
                  ? "No matching NFTs found"
                  : "The marketplace is waiting"}
              </h3>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#8FA99F]">
                {search || filter !== "all"
                  ? "Try changing your search or selecting another filter."
                  : "Be among the first creators to bring music into the NFT universe."}
              </p>

              {search || filter !== "all" ? (
                <button
                  onClick={() => {
                    setSearch("");
                    setFilter("all");
                  }}
                  className="mt-7 rounded-xl border border-emerald-400/30 px-6 py-3 text-sm text-emerald-300 transition hover:bg-emerald-400/10"
                >
                  Clear Filters
                </button>
              ) : null}

            </div>
          </div>

        ) : (

          /* NFT COLLECTION GRID */
          <>
            <p className="mb-5 text-xs text-[#8FA99F]">
              Showing{" "}
              <span className="font-semibold text-emerald-300">
                {filteredItems.length}
              </span>{" "}
              {filteredItems.length === 1 ? "NFT" : "NFTs"}
            </p>

            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

              {filteredItems.map((nft) => (
                <div
                  key={nft.tokenId}
                  className="group relative rounded-2xl border border-emerald-400/10 bg-[#071C18]/50 p-1 transition duration-500 hover:-translate-y-2 hover:border-emerald-400/40 hover:shadow-[0_20px_55px_rgba(16,185,129,0.12)]"
                >
                  <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br from-emerald-400/10 via-transparent to-silver/10 opacity-0 blur-xl transition duration-500 group-hover:opacity-100" />

                  <div className="relative z-10">
                    <Card1
                      nft={nft}
                      onDeleted={fetchAll}
                    />
                  </div>
                </div>
              ))}

            </div>
          </>
        )}

        {/* BOTTOM CTA */}
        <section className="relative mt-24 overflow-hidden rounded-3xl border border-emerald-400/20 bg-gradient-to-br from-[#0C3024] via-[#071C18] to-[#020B09] px-7 py-14 text-center sm:px-12">

          <div className="pointer-events-none absolute -right-20 -top-32 h-72 w-72 rounded-full bg-emerald-400/10 blur-[100px]" />

          <div className="relative z-10">

            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-400">
              Create something extraordinary
            </span>

            <h2 className="mt-5 text-3xl font-bold text-white sm:text-4xl">
              Your Music. Your Ownership.
            </h2>

            <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-[#A8B8B0]">
              Turn your creativity into digital collectibles and
              share your music with the world.
            </p>

            <a
              href="/create"
              className="mt-8 inline-flex rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-400 px-7 py-3.5 text-sm font-bold text-[#03140D] transition hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(16,185,129,0.3)]"
            >
              Create Your NFT →
            </a>

          </div>
        </section>

      </div>
    </main>
  );
}
