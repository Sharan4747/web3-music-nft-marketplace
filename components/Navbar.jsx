
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "../public/images/MNFTlogo.png";
import Web3Modal from "web3modal";
import useweb3store from "../store/web3store";
import { getProviderOrSigner } from "../store/util";
import { Transition } from "@headlessui/react";

const shortAddr = (a) => (a ? `${a.slice(0, 6)}…${a.slice(-4)}` : "");

export default function Navbar() {
  const web3ModalRef = useRef();
  const [isOpen, setIsOpen] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [account, setAccount] = useState(null);
  const [connecting, setConnecting] = useState(false);

  const { addAddress, addweb3Modal } = useweb3store((state) => ({
    addAddress: state.addAddress,
    addweb3Modal: state.addweb3Modal,
  }));

  // CONNECT WALLET
  const connectWallet = async () => {
    if (connecting) return;

    try {
      setConnecting(true);

      const signer = await getProviderOrSigner(web3ModalRef, true);
      const address = await signer.getAddress();

      addAddress(address);
      setAccount(address);
      setWalletConnected(true);
      setIsOpen(false);
    } catch (err) {
      console.error("Wallet connect error:", err);
    } finally {
      setConnecting(false);
    }
  };

  // DISCONNECT WALLET
  const disconnectWallet = async () => {
    try {
      if (web3ModalRef.current?.clearCachedProvider) {
        await web3ModalRef.current.clearCachedProvider();
      }
    } catch (e) {
      console.error("Disconnect error:", e);
    } finally {
      setWalletConnected(false);
      setAccount(null);
      setIsOpen(false);
    }
  };

  // INITIALIZE WEB3MODAL
  useEffect(() => {
    web3ModalRef.current = new Web3Modal({
      cacheProvider: true,
      providerOptions: {},
      disableInjectedProvider: false,
    });

    addweb3Modal(web3ModalRef);

    if (web3ModalRef.current.cachedProvider) {
      connectWallet();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navLinks = [
    { name: "Marketplace", href: "/marketplace" },
    { name: "Create", href: "/create" },
  ];

  return (
    <nav className="relative z-50 px-4 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* MAIN NAVBAR */}
        <div className="flex min-h-[76px] items-center justify-between rounded-2xl border border-emerald-400/15 bg-[#071C18]/80 px-5 shadow-[0_8px_40px_rgba(0,0,0,0.25)] backdrop-blur-2xl sm:px-7">

          {/* LOGO */}
          <Link
            href="/"
            className="group flex items-center gap-3"
            aria-label="NEONVERSE Home"
          >
            <div className="relative transition duration-300 group-hover:scale-105">
              <div className="absolute inset-0 rounded-full bg-emerald-400/20 blur-xl opacity-0 transition group-hover:opacity-100" />
              <Image
                height={65}
                width={65}
                src={logo}
                alt="NEONVERSE Logo"
                className="relative object-contain"
                priority
              />
            </div>

            <div className="hidden sm:block">
              <p className="font-semibold tracking-[0.18em] text-[#E2EBE6]">
                NEONVERSE
              </p>
              <p className="mt-0.5 text-[9px] tracking-[0.28em] text-emerald-400/70">
                OWN THE SOUND
              </p>
            </div>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <div className="hidden items-center gap-8 md:flex">

            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="nav-link text-sm font-medium tracking-wide text-[#A8B8B0]"
              >
                {link.name}
              </Link>
            ))}

            {walletConnected && (
              <Link
                href="/profile"
                className="nav-link text-sm font-medium tracking-wide text-[#A8B8B0]"
              >
                Profile
              </Link>
            )}
          </div>

          {/* DESKTOP WALLET */}
          <div className="hidden items-center gap-3 md:flex">

            {walletConnected ? (
              <>
                <span className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-xs font-medium text-emerald-300">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                  Polygon Amoy
                </span>

                <a
                  href={`https://amoy.polygonscan.com/address/${account}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-[#D0DAD5] transition hover:border-emerald-400/40 hover:text-emerald-300"
                >
                  {shortAddr(account)}
                  <span className="ml-2 text-emerald-400">↗</span>
                </a>

                <button
                  onClick={disconnectWallet}
                  className="rounded-xl border border-white/10 px-4 py-2 text-sm text-[#A8B8B0] transition hover:border-red-400/40 hover:bg-red-400/10 hover:text-red-300"
                >
                  Disconnect
                </button>
              </>
            ) : (
              <button
                onClick={connectWallet}
                disabled={connecting}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-400 px-5 py-3 text-sm font-bold text-[#03140D] shadow-[0_0_22px_rgba(16,185,129,0.16)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(16,185,129,0.35)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="relative z-10">
                  {connecting ? "Connecting..." : "Connect Wallet"}
                </span>
              </button>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/5 text-xl text-emerald-300 transition hover:bg-emerald-400/15 md:hidden"
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* MOBILE NAVIGATION */}
        <Transition
          show={isOpen}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 -translate-y-2"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 -translate-y-2"
        >
          <div className="mt-3 space-y-2 rounded-2xl border border-emerald-400/15 bg-[#071C18]/95 p-4 shadow-2xl backdrop-blur-2xl md:hidden">

            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="block rounded-xl px-4 py-3 text-sm text-[#C8D4D0] transition hover:bg-emerald-400/10 hover:text-emerald-300"
            >
              Home
            </Link>

            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block rounded-xl px-4 py-3 text-sm text-[#C8D4D0] transition hover:bg-emerald-400/10 hover:text-emerald-300"
              >
                {link.name}
              </Link>
            ))}

            {walletConnected && (
              <>
                <Link
                  href="/profile"
                  onClick={() => setIsOpen(false)}
                  className="block rounded-xl px-4 py-3 text-sm text-[#C8D4D0] transition hover:bg-emerald-400/10 hover:text-emerald-300"
                >
                  Profile
                </Link>

                <div className="mx-2 flex items-center justify-between rounded-xl border border-emerald-400/15 bg-emerald-400/5 px-4 py-3">
                  <span className="text-xs text-emerald-300">
                    Polygon Amoy
                  </span>
                  <a
                    href={`https://amoy.polygonscan.com/address/${account}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-[#C8D4D0] hover:text-emerald-300"
                  >
                    {shortAddr(account)} ↗
                  </a>
                </div>

                <button
                  onClick={disconnectWallet}
                  className="w-full rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm text-red-300 transition hover:bg-red-400/10"
                >
                  Disconnect Wallet
                </button>
              </>
            )}

            {!walletConnected && (
              <button
                onClick={connectWallet}
                disabled={connecting}
                className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-400 px-4 py-3 text-sm font-bold text-[#03140D] transition hover:shadow-lg hover:shadow-emerald-500/20 disabled:opacity-60"
              >
                {connecting ? "Connecting..." : "Connect Wallet"}
              </button>
            )}
          </div>
        </Transition>
      </div>
    </nav>
  );
}
