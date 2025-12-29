import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "../public/images/MNFTlogo.png";
import RegularButton from "./RegularButton";
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

  const { addAddress, addweb3Modal } = useweb3store((state) => ({
    addAddress: state.addAddress,
    addweb3Modal: state.addweb3Modal,
  }));

  // CONNECT
  const connectWallet = async () => {
    try {
      const signer = await getProviderOrSigner(web3ModalRef, true);
      const address = await signer.getAddress();

      addAddress(address); // ✅ store globally
      setAccount(address);
      setWalletConnected(true);
    } catch (err) {
      console.error("Wallet connect error:", err);
    }
  };

  // DISCONNECT
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
    }
  };

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

  return (
    <nav className="bg-transparent mb-3">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* LOGO */}
          <Link href="/">
            <Image height={100} width={80} src={logo} alt="Logo" />
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/marketplace" className="nav-link">
              Marketplace
            </Link>

            <Link href="/create" className="nav-link">
              Create
            </Link>

            {walletConnected ? (
              <>
                <Link href="/profile" className="nav-link">
                  Profile
                </Link>

                <span className="px-2 py-1 text-xs rounded-full bg-green-700 text-white">
                  Amoy
                </span>

                <a
                  href={`https://amoy.polygonscan.com/address/${account}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm underline"
                >
                  {shortAddr(account)}
                </a>

                <button
                  onClick={disconnectWallet}
                  className="px-3 py-2 rounded-md text-sm bg-gray-700 text-white hover:bg-gray-600"
                >
                  Disconnect
                </button>
              </>
            ) : (
              <RegularButton
                text="Connect Wallet"
                clickFunction={connectWallet}
              />
            )}
          </div>

          {/* MOBILE BUTTON */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-400 hover:text-white"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      <Transition
        show={isOpen}
        enter="transition ease-out duration-100"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <div className="md:hidden bg-black/90 p-3 space-y-2">
          <Link href="/" className="mobile-link">
            Home
          </Link>
          <Link href="/marketplace" className="mobile-link">
            Marketplace
          </Link>
          <Link href="/create" className="mobile-link">
            Create
          </Link>

          {walletConnected && (
            <Link href="/profile" className="mobile-link">
              Profile
            </Link>
          )}

          {walletConnected ? (
            <button
              onClick={disconnectWallet}
              className="w-full bg-gray-700 text-white py-2 rounded"
            >
              Disconnect
            </button>
          ) : (
            <RegularButton
              text="Connect Wallet"
              clickFunction={connectWallet}
            />
          )}
        </div>
      </Transition>
    </nav>
  );
}
