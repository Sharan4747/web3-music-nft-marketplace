
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
  const [albumName, setAlbumName] = useState('');
  const [creatorName, setCreatorName] = useState('');
  const [typeofSong, setTypeofSong] = useState('');
  const [language, setLanguage] = useState('');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [musicUrl, setMusicUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loadingState, setLoadingState] = useState('Create Music NFT');
  const [loader, setLoader] = useState(false);

  const { web3modalRef } = useweb3store((s) => ({
    web3modalRef: s.web3Modal,
  }));

  // Pinata authentication (restored from the earlier working version).
  // Supports the older API key/secret variables and the JWT variable.
  const pinataHeaders = (isJson = false) => {
    const jwt = process.env.NEXT_PUBLIC_PINATA_JWT;
    const headers = jwt
      ? { Authorization: `Bearer ${jwt}` }
      : {
          pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY || '',
          pinata_secret_api_key:
            process.env.NEXT_PUBLIC_PINATA_API_SECRET ||
            process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY ||
            '',
        };

    if (isJson) headers['Content-Type'] = 'application/json';
    return headers;
  };

  const errMsg = (error, fallback = 'Request failed') => {
    if (error?.response) {
      const data = error.response.data;
      if (typeof data === 'string') {
        return `HTTP ${error.response.status}: ${data}`;
      }
      if (typeof data?.message === 'string') {
        return `HTTP ${error.response.status}: ${data.message}`;
      }
    }

    return (
      error?.error?.data?.message ||
      error?.data?.message ||
      error?.reason ||
      error?.message ||
      fallback
    );
  };

  const isBrokenNode = (error) => {
    const message = (error?.message || '').toLowerCase();
    return (
      message.includes('missing trie node') ||
      message.includes('could not detect network') ||
      message.includes('header not found') ||
      message.includes('state unavailable') ||
      message.includes('unknown block')
    );
  };

  // Upload music and artwork directly to Pinata, as in the earlier version.
  const uploadFileToIpfs = async (e, isMusic) => {
    const file = e?.target?.files?.[0];
    if (!file) return;

    setLoader(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        formData,
        { headers: pinataHeaders(false) }
      );

      const cid = response?.data?.IpfsHash;
      if (!cid) {
        throw new Error('Pinata did not return an IPFS hash.');
      }

      const gatewayUrl = `https://gateway.pinata.cloud/ipfs/${cid}`;
      if (isMusic) setMusicUrl(gatewayUrl);
      else setImageUrl(gatewayUrl);
    } catch (error) {
      alert(`IPFS upload failed: ${errMsg(error, 'Upload failed')}`);
    } finally {
      setLoader(false);
      if (e?.target) e.target.value = '';
    }
  };

  // Mint NFT using the earlier working transaction flow.
  const mintNft = async (e) => {
    e.preventDefault();
    if (loader) return;

    const qty = Number.parseInt(String(amount), 10);
    if (!albumName.trim()) return alert('Album name is required.');
    if (!creatorName.trim()) return alert('Creator name is required.');
    if (!typeofSong.trim()) return alert('Type of song is required.');
    if (!language.trim()) return alert('Language is required.');
    if (!imageUrl) return alert('Upload a thumbnail image first.');
    if (!musicUrl) return alert('Upload a music file first.');
    if (!Number.isSafeInteger(qty) || qty <= 0) {
      return alert('Amount must be a positive integer.');
    }
    if (!(Number(price) > 0)) {
      return alert('Price per NFT must be greater than 0.');
    }

    setLoadingState('Uploading metadata to IPFS...');
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

      const metadataResponse = await axios.post(
        'https://api.pinata.cloud/pinning/pinJSONToIPFS',
        metadata,
        { headers: pinataHeaders(true) }
      );

      const cid = metadataResponse?.data?.IpfsHash;
      if (!cid) {
        throw new Error('Pinata did not return a metadata IPFS hash.');
      }
      tokenURI = `https://gateway.pinata.cloud/ipfs/${cid}`;
    } catch (error) {
      alert(`Metadata upload failed: ${errMsg(error, 'JSON upload failed')}`);
      setLoader(false);
      setLoadingState('Create Music NFT');
      return;
    }

    setLoadingState('Connecting wallet...');

    try {
      const signer = await getProviderOrSigner(web3modalRef, true);
      const from = await signer.getAddress();

      const readProvider = getReadProvider();
      const readContract = new Contract(
        NFT_CONTRACT_ADDRESS,
        abi,
        readProvider
      );
      const writeContract = new Contract(
        NFT_CONTRACT_ADDRESS,
        abi,
        signer
      );

      const unitPrice = utils.parseEther(String(price));

      // Simulate through the read provider. Some public RPC nodes can fail
      // simulation because of historical-state issues; preserve the earlier
      // fallback behavior for those specific RPC errors.
      setLoadingState('Checking NFT transaction...');
      try {
        await readContract.callStatic.mintToken(
          tokenURI,
          qty,
          unitPrice,
          { from }
        );
      } catch (error) {
        if (!isBrokenNode(error)) throw error;
        console.warn('Read RPC simulation unavailable; continuing to gas estimation.', error);
      }

      setLoadingState('Estimating transaction gas...');
      let gasLimit;
      try {
        gasLimit = await readContract.estimateGas.mintToken(
          tokenURI,
          qty,
          unitPrice,
          { from }
        );
        gasLimit = gasLimit.mul(120).div(100);
      } catch (error) {
        console.warn('Gas estimation failed; using the earlier fallback limit.', error);
        gasLimit = Contract.getContractAddress ? utils.parseUnits('500000', 0) : utils.parseUnits('500000', 0);
      }

      setLoadingState('Waiting for wallet confirmation...');
      const transaction = await writeContract.mintToken(
        tokenURI,
        qty,
        unitPrice,
        { gasLimit }
      );

      setLoadingState('Transaction submitted. Waiting for confirmation...');
      await transaction.wait();

      alert('Your Music NFT was created successfully!');
      setLoadingState('NFT created successfully!');
      Router.push('/marketplace');
    } catch (error) {
      console.error('NFT minting error:', error);
      alert(`Mint failed: ${errMsg(error, 'Transaction failed')}`);
    } finally {
      setLoader(false);
      setLoadingState('Create Music NFT');
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020B09] text-white">
      <Navbar />

      {/* Emerald background effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-emerald-500/10 blur-[140px]" />
        <div className="absolute right-[-150px] top-[35%] h-[400px] w-[400px] rounded-full bg-emerald-400/10 blur-[130px]" />
        <div className="absolute bottom-[-180px] left-[-100px] h-[400px] w-[400px] rounded-full bg-teal-500/10 blur-[130px]" />

        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(52,211,153,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,0.25) 1px, transparent 1px)',
            backgroundSize: '65px 65px',
          }}
        />
      </div>

      <section className="relative z-10 mx-auto max-w-6xl px-4 pb-20 pt-12 md:px-8 md:pt-16">

        {/* Page heading */}
        <div className="mb-10 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-4 py-2 text-xs font-semibold tracking-[0.22em] text-emerald-300">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            NEONVERSE CREATOR STUDIO
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-6xl">
            Create Your
            <span className="block bg-gradient-to-r from-emerald-300 via-[#C8D4D0] to-emerald-500 bg-clip-text text-transparent">
              Music NFT
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#8FA99F] md:text-base">
            Turn your music into a digital collectible. Upload your sound,
            add your details, set your price and publish it on NEONVERSE.
          </p>

          <div className="mt-7">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-[#C8D4D0] transition-all duration-300 hover:border-emerald-400/40 hover:bg-emerald-400/10 hover:text-emerald-300"
            >
              <span>←</span> Back to Home
            </Link>
          </div>
        </div>

        {/* Creator form */}
        <form
          onSubmit={mintNft}
          className="relative overflow-hidden rounded-3xl border border-emerald-300/15 bg-[#071C18]/80 p-5 shadow-[0_0_80px_rgba(16,185,129,0.07)] backdrop-blur-2xl md:p-10"
        >
          <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-emerald-400/70 to-transparent" />

          <div className="mb-9 flex flex-col gap-3 border-b border-white/[0.07] pb-7 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-emerald-400">
                STEP 01 — NFT DETAILS
              </p>
              <h2 className="mt-2 text-2xl font-bold text-white">
                Your music collection
              </h2>
              <p className="mt-1 text-sm text-[#8FA99F]">
                Enter the details that will appear with your NFT.
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-2xl text-emerald-300">
              ♬
            </div>
          </div>

          <div className="grid gap-x-8 gap-y-7 md:grid-cols-2">
            <InputField
              label="Album / Track Name"
              value={albumName}
              setter={setAlbumName}
              placeholder="Echoes of Time"
            />

            <InputField
              label="Creator Name"
              value={creatorName}
              setter={setCreatorName}
              placeholder="Your artist name"
            />

            <InputField
              label="Type of Song"
              value={typeofSong}
              setter={setTypeofSong}
              placeholder="Pop, Jazz, Classical..."
            />

            <InputField
              label="Language"
              value={language}
              setter={setLanguage}
              placeholder="English, Hindi, Kannada..."
            />
          </div>

          <div className="mb-9 mt-11 border-b border-white/[0.07] pb-7">
            <p className="text-xs font-semibold tracking-[0.2em] text-emerald-400">
              STEP 02 — COLLECTION SETTINGS
            </p>
            <h2 className="mt-2 text-2xl font-bold text-white">
              Set your NFT value
            </h2>
            <p className="mt-1 text-sm text-[#8FA99F]">
              Choose how many copies to mint and the price of each NFT.
            </p>
          </div>

          <div className="grid gap-x-8 gap-y-7 md:grid-cols-2">
            <InputField
              label="Number of NFTs to Mint"
              type="number"
              value={amount}
              setter={setAmount}
              placeholder="10"
            />

            <InputField
              label="Price per NFT (POL)"
              type="number"
              value={price}
              setter={setPrice}
              placeholder="0.01"
            />
          </div>

          {/* Upload section */}
          <div className="mb-9 mt-11 border-b border-white/[0.07] pb-7">
            <p className="text-xs font-semibold tracking-[0.2em] text-emerald-400">
              STEP 03 — DIGITAL ASSETS
            </p>
            <h2 className="mt-2 text-2xl font-bold text-white">
              Upload your sound and artwork
            </h2>
            <p className="mt-1 text-sm text-[#8FA99F]">
              Your files will be stored on IPFS through Pinata.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <FileInput
              label="Music File"
              description="Upload your MP3 or supported audio file."
              onChange={(e) => uploadFileToIpfs(e, true)}
              disabled={loader || !!musicUrl}
              accept=".mp3,audio/*"
              uploaded={!!musicUrl}
            />

            <FileInput
              label="NFT Thumbnail"
              description="Upload the artwork for your music NFT."
              onChange={(e) => uploadFileToIpfs(e, false)}
              disabled={loader || !!imageUrl}
              accept="image/*"
              uploaded={!!imageUrl}
            />
          </div>

          {/* Upload status */}
          {(musicUrl || imageUrl) && (
            <div className="mt-6 rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.05] p-4">
              <p className="mb-3 text-xs font-semibold tracking-wider text-emerald-300">
                UPLOAD STATUS
              </p>

              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2 text-[#C8D4D0]">
                  <span className={musicUrl ? 'text-emerald-400' : 'text-gray-500'}>
                    {musicUrl ? '✓' : '○'}
                  </span>
                  Music file {musicUrl ? 'uploaded to IPFS' : 'not uploaded'}
                </p>

                <p className="flex items-center gap-2 text-[#C8D4D0]">
                  <span className={imageUrl ? 'text-emerald-400' : 'text-gray-500'}>
                    {imageUrl ? '✓' : '○'}
                  </span>
                  Thumbnail {imageUrl ? 'uploaded to IPFS' : 'not uploaded'}
                </p>
              </div>
            </div>
          )}

          {/* Submit buttons */}
          <div className="mt-11 flex flex-col-reverse gap-4 border-t border-white/[0.07] pt-8 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/marketplace"
              className="inline-flex items-center justify-center rounded-full border border-white/10 px-7 py-3.5 text-sm font-semibold text-[#C8D4D0] transition-all duration-300 hover:border-emerald-400/40 hover:bg-emerald-400/[0.06] hover:text-emerald-300"
            >
              Explore Marketplace
            </Link>

            <button
              type="submit"
              disabled={loader}
              className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 px-9 py-4 text-sm font-bold text-[#02110C] shadow-[0_0_30px_rgba(16,185,129,0.2)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(16,185,129,0.4)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {loader ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#02110C] border-t-transparent" />
                  {loadingState}
                </>
              ) : (
                <>
                  {loadingState}
                  <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Bottom note */}
        <p className="mt-7 text-center text-xs leading-6 text-[#8FA99F]">
          By creating an NFT, you confirm that you have the rights to the
          music and artwork you upload.
        </p>
      </section>
    </main>
  );
}

// Reusable form field
function InputField({ label, value, setter, placeholder, type = 'text' }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-[#C8D4D0]">
        {label}
      </label>

      <input
        value={value}
        onChange={(e) => setter(e.target.value)}
        type={type}
        placeholder={placeholder}
        min={type === 'number' ? '0' : undefined}
        step={type === 'number' ? 'any' : undefined}
        required
        className="w-full rounded-xl border border-white/10 bg-[#020B09]/80 px-4 py-3.5 text-sm text-white outline-none transition-all duration-300 placeholder:text-[#557269] hover:border-emerald-400/20 focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/10"
      />
    </div>
  );
}

// Reusable file upload field
function FileInput({
  label,
  description,
  onChange,
  disabled,
  accept,
  uploaded,
}) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-[#020B09]/60 p-5 transition-all duration-300 hover:border-emerald-400/30 hover:bg-emerald-400/[0.03]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-[#C8D4D0]">
            {label}
          </h3>
          <p className="mt-1 text-xs leading-5 text-[#8FA99F]">
            {description}
          </p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-lg text-emerald-300">
          {label === 'Music File' ? '♫' : '▧'}
        </div>
      </div>

      <label
        className={`flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed px-4 py-5 text-center transition-all duration-300 ${
          uploaded
            ? 'border-emerald-400/50 bg-emerald-400/[0.06]'
            : 'border-white/15 bg-white/[0.02] hover:border-emerald-400/50 hover:bg-emerald-400/[0.04]'
        } ${disabled && !uploaded ? 'cursor-not-allowed opacity-50' : ''}`}
      >
        <span className="mb-2 text-2xl text-emerald-300">
          {uploaded ? '✓' : '↑'}
        </span>

        <span className="text-sm font-semibold text-[#C8D4D0]">
          {uploaded ? 'File uploaded successfully' : 'Choose a file to upload'}
        </span>

        <span className="mt-1 text-xs text-[#8FA99F]">
          {uploaded ? 'Stored on IPFS' : 'Select from your device'}
        </span>

        <input
          onChange={onChange}
          disabled={disabled}
          type="file"
          accept={accept}
          className="hidden"
        />
      </label>
    </div>
  );
}
