import { useState } from 'react';
import { Contract, utils } from 'ethers';
import Navbar from '../components/Navbar';
import axios from 'axios';
import Router from 'next/router';
import Link from 'next/link';
import { abi, NFT_CONTRACT_ADDRESS } from '../constants';
import { getProviderOrSigner, getReadProvider } from '../store/util';
import useweb3store from '../store/web3store';

export default function Create() {
  // ---------- Form state ----------
  const [albumName, setAlbumName] = useState('');
  const [creatorName, setCreatorName] = useState('');
  const [typeofSong, setTypeofSong] = useState('');
  const [language, setLanguage] = useState('');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [musicUrl, setMusicUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loadingState, setLoadingState] = useState('Upload');
  const [loader, setLoader] = useState(false);

  const { web3modalRef } = useweb3store((s) => ({ web3modalRef: s.web3Modal }));

  // ---------- Helpers ----------
  const pinataHeaders = (isJson = false) => {
    const jwt = process.env.NEXT_PUBLIC_PINATA_JWT;
    const headers = jwt
      ? { Authorization: `Bearer ${jwt}` }
      : {
          pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY || '',
          pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_API_SECRET || '',
        };
    if (isJson) headers['Content-Type'] = 'application/json';
    return headers;
  };

  const errMsg = (error, fallback = 'Request failed') => {
    if (error?.response) {
      const d = error.response.data;
      if (typeof d === 'string') return `HTTP ${error.response.status}: ${d}`;
      if (typeof d?.message === 'string')
        return `HTTP ${error.response.status}: ${d.message}`;
    }
    return (
      error?.error?.data?.message ||
      error?.data?.message ||
      error?.reason ||
      error?.message ||
      fallback
    );
  };

  const uploadFileToIpfs = async (e, isMusic) => {
    setLoader(true);
    const file = e?.target?.files?.[0];
    if (!file) return setLoader(false);

    try {
      const formData = new FormData();
      formData.append('file', file);
      const resFile = await axios.post(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        formData,
        { headers: pinataHeaders(false) }
      );
      const cid = resFile?.data?.IpfsHash;
      const gatewayUrl = `https://gateway.pinata.cloud/ipfs/${cid}`;
      if (isMusic) setMusicUrl(gatewayUrl);
      else setImageUrl(gatewayUrl);
    } catch (error) {
      alert(`IPFS upload failed: ${errMsg(error, 'Upload failed')}`);
    } finally {
      setLoader(false);
    }
  };

  const isBrokenNode = (e) => {
    const m = (e?.message || '').toLowerCase();
    return (
      m.includes('missing trie node') ||
      m.includes('could not detect network') ||
      m.includes('header not found') ||
      m.includes('state unavailable') ||
      m.includes('unknown block')
    );
  };

  // ---------- Mint NFT ----------
  const mintNft = async (e) => {
    e.preventDefault();

    const qty = Number.parseInt(String(amount), 10);
    if (!albumName.trim()) return alert('Album name is required.');
    if (!creatorName.trim()) return alert('Creator name is required.');
    if (!typeofSong.trim()) return alert('Type of song is required.');
    if (!language.trim()) return alert('Language is required.');
    if (!imageUrl) return alert('Upload a thumbnail image first.');
    if (!musicUrl) return alert('Upload a music file first.');
    if (!Number.isFinite(qty) || qty <= 0)
      return alert('Amount must be a positive integer.');
    if (!(Number(price) > 0))
      return alert('Price per NFT must be greater than 0.');

    setLoadingState('Uploading data to IPFS!');
    setLoader(true);

    let tokenURI;
    try {
      const metadata = {
        name: albumName,
        image: imageUrl,
        animation_url: musicUrl,
        description: `${albumName} by ${creatorName}`,
        attributes: [
          { trait_type: 'Creator', value: creatorName },
          { trait_type: 'Language', value: language },
          { trait_type: 'Type', value: typeofSong },
        ],
      };
      const res = await axios.post(
        'https://api.pinata.cloud/pinning/pinJSONToIPFS',
        metadata,
        { headers: pinataHeaders(true) }
      );
      const cid = res?.data?.IpfsHash;
      tokenURI = `https://gateway.pinata.cloud/ipfs/${cid}`;
    } catch (error) {
      alert(`Metadata upload failed: ${errMsg(error, 'JSON upload failed')}`);
      setLoader(false);
      setLoadingState('Upload');
      return;
    }

    // 2) On-chain mint
    setLoadingState('Minting your NFT!');
    try {
      const signer = await getProviderOrSigner(web3modalRef, true);
      const from = await signer.getAddress();

      const readProvider = getReadProvider();
      const readC = new Contract(NFT_CONTRACT_ADDRESS, abi, readProvider);
      const writeC = new Contract(NFT_CONTRACT_ADDRESS, abi, signer);

      let unitPrice = utils.parseEther(String(price));

      try {
        await readC.callStatic.mintToken(tokenURI, qty, unitPrice, { from });
      } catch (e) {
        if (!isBrokenNode(e)) throw e;
      }

      let gasLimit;
      try {
        gasLimit = await readC.estimateGas.mintToken(tokenURI, qty, unitPrice, { from });
        gasLimit = gasLimit.mul(120).div(100);
      } catch {
        gasLimit = 500_000;
      }

      const tx = await writeC.mintToken(tokenURI, qty, unitPrice, { gasLimit });
      await tx.wait();

      setLoadingState('Done!');
      Router.push('/marketplace');
    } catch (error) {
      alert(`Mint failed: ${errMsg(error, 'Transaction failed')}`);
    } finally {
      setLoader(false);
      setLoadingState('Upload');
    }
  };

  // ---------- UI ----------
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#020617] via-[#0a0f2c] to-[#010414] text-white overflow-hidden">
      <Navbar />

      {/* Floating Home Button (top-right corner) */}
      <div className="absolute top-6 right-8 z-20">
        <Link
          href="/"
          className="px-5 py-2 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 text-white font-semibold shadow-md hover:scale-105 transition-transform"
        >
          🏠 Home
        </Link>
      </div>

      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.2),transparent_70%)]"></div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-8 py-12">
        <h1 className="text-center text-3xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 mb-10">
          Mint Your Music NFT
        </h1>

        <form
          onSubmit={mintNft}
          className="glass-panel p-8 rounded-2xl shadow-2xl backdrop-blur-lg border border-white/10"
        >
          <div className="grid md:grid-cols-2 gap-8">
            <InputField label="Album Name" value={albumName} setter={setAlbumName} placeholder="Echoes of Time" />
            <InputField label="Creator Name" value={creatorName} setter={setCreatorName} placeholder="Lewis" />
            <InputField label="Type of Song" value={typeofSong} setter={setTypeofSong} placeholder="Pop, Jazz..." />
            <InputField label="Language" value={language} setter={setLanguage} placeholder="English, Hindi..." />
            <InputField label="Amount to Mint" type="number" value={amount} setter={setAmount} placeholder="10" />
            <InputField label="Price per NFT (POL)" type="number" value={price} setter={setPrice} placeholder="0.01" />

            <FileInput label="Upload Music (.mp3)" onChange={(e) => uploadFileToIpfs(e, true)} disabled={loader || !!musicUrl} accept=".mp3,audio/*" />
            <FileInput label="Upload Thumbnail" onChange={(e) => uploadFileToIpfs(e, false)} disabled={loader || !!imageUrl} accept="image/*" />
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between mt-10 gap-4">
            <button
              type="submit"
              disabled={loader}
              className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-cyan-400 to-purple-500 text-white rounded-full font-semibold hover:scale-105 transition-transform"
            >
              {loadingState}
            </button>

            {/* Secondary Home Button under form */}
            <Link
              href="/"
              className="w-full md:w-auto px-8 py-3 border border-cyan-400 text-cyan-300 rounded-full font-semibold hover:bg-cyan-400/10 transition"
            >
              ← Back to Home
            </Link>
          </div>
        </form>

        {loader && (
          <div className="flex justify-center mt-8">
            <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Reusable Components ---------- */
function InputField({ label, value, setter, placeholder, type = 'text' }) {
  return (
    <div>
      <label className="block text-sm text-gray-300 mb-1">{label}</label>
      <input
        value={value}
        onChange={(e) => setter(e.target.value)}
        type={type}
        placeholder={placeholder}
        className="w-full px-4 py-2 rounded-lg bg-[#0b1121] border border-white/10 focus:ring-2 focus:ring-cyan-400 outline-none transition"
        required
      />
    </div>
  );
}

function FileInput({ label, onChange, disabled, accept }) {
  return (
    <div>
      <label className="block text-sm text-gray-300 mb-1">{label}</label>
      <input
        onChange={onChange}
        disabled={disabled}
        type="file"
        accept={accept}
        className="w-full text-sm text-gray-200 border border-white/10 rounded-lg cursor-pointer bg-[#0b1121] focus:outline-none focus:ring-2 focus:ring-cyan-400 p-2"
      />
    </div>
  );
}
