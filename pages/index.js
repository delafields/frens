import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useEffect, useState } from 'react';
import { ethers, providers } from "ethers";
import toast, { Toaster } from 'react-hot-toast';
import FrenForm from '../components/FrenForm';
import FrenList from '../components/FrenList';


import contractAbi from '../utils/Frens.json';
const CONTRACT_ADDRESS = "0x73CC775dfc0bE809595C4c970C82d7d96cA4Ef41";

export default function Home() {  
  const [currentAccount, setCurrentAccount] = useState(null);
  const [frens, setFrens] = useState([]);
  const [fetchingFrens, setFetchingFrens] = useState(false);

  // filters out zero addressed wallets (these are "removed" frens)
  const filterFrens = (receipt) => {
    const frenList = receipt.events.find(event => event.event === "FrenListUpdated").args._frenlist;
    frenList = frenList.filter(fren => fren.pubkey != '0x0000000000000000000000000000000000000000');
    console.log('filtered frens', frenList);
    return frenList;
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      // check for injected provider
      if (!ethereum) {
        toast("you need metamask for this to work", { icon: "🦊" });
        return;
      }

      // ensure user is on rinkeby
      let chainId = await ethereum.request({ method: 'eth_chainId' })
      console.log('chainId', chainId)

      if (chainId !== '0x4') {
        toast("i only works on rinkeby", { icon: "🐸" })
        // switch user to rinkeby
        await switchNetwork();
      }

      // only load frens if the user is on rinkeby
      chainId = await ethereum.request({ method: 'eth_chainId' })
      if (chainId === "0x4") {
        const accounts = await ethereum.request({ method: "eth_requestAccounts"});
        setCurrentAccount(accounts[0]);
        console.log("Connected to", accounts[0]);

        // load frens
        await loadFrens();
      }

    } catch (error) {
      console.log(error);
    }
  }

  const loadFrens = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        setFetchingFrens(true);

        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);

        console.log("creating a record for this user if they're new...");
        let tx = await contract.createOrFindNewUser();
        const toastId = toast.loading('grabbin ur frens..one sec');
        const rc = await tx.wait();

        let frenList = filterFrens(rc);
        toast.dismiss(toastId);

        setFetchingFrens(false);
        setFrens(frenList)
      }
    } catch(error) {
      setCurrentAccount(null);
      console.error(error);
    }
  }

  const switchNetwork = async () => {
  	if (window.ethereum) {
  		try {
  			// Try to switch to the rinkeby testnet
  			await window.ethereum.request({
  				method: 'wallet_switchEthereumChain',
  				params: [{ chainId: '0x4' }], // Check networks.js for hexadecimal network ids
  			});
  		} catch (error) {
        console.error('didnt wanna use rinkeby :(', error);
      }
    }
  }

  return (
    <div>
      <Head>
        <title>Frens</title>
        <meta name="description" content="Together on chain 4ever" />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🐸</text></svg>"
        />
      </Head>

      <main 
        style={{ background: 'hsl(328deg 58% 94%)' }}
        className="w-screen min-h-full h-screen box-border flex flex-col pt-4 font-kiddie"
        >

        <h1 className="m-0 text-6xl text-center mb-10">frens🐸</h1>


        <div className="grow flex justify-center align-center max-w-full">
          { !currentAccount
            ? 
            <button 
              className="rounded bg-red-200 hover:bg-slate-100 h-10 px-2 self-center"
              onClick={() => connectWallet()}>
              click 2 sign in fam
            </button>
            : 
            ( fetchingFrens
              ? 
              <div className="text-center">
                <p>confirm this transaction</p>
                <p>so I can fetch your frens</p>
                <p className="text-xs">(if u have any)</p>
              </div>
            :
            <div 
              style={{
                background: '#f8e7f1',
                boxShadow: '20px 20px 60px #d3c4cd, -20px -20px 60px #ffffff, 0 0 2vh 2vh hsl(328deg 58% 94%)',	
                padding: '1em',	
                borderRadius: '20px'
              }}
              className = "sm:w-3/4 m:w-1/2 max-w-2xl mb-6"
            >
              <FrenForm
                frens={frens} 
                setFrens={setFrens} 
                filterFrens={filterFrens} 
                contractAddress={CONTRACT_ADDRESS}
                contractAbi={contractAbi}
              />
              <FrenList
                frens={frens} 
                setFrens={setFrens} 
                filterFrens={filterFrens} 
                contractAddress={CONTRACT_ADDRESS} 
                contractAbi={contractAbi}
              />
            </div>)
          }
        </div>
      </main>
      <Toaster 
        toastOptions={{ className: "font-kiddie" }}
        position="bottom-center"
        />
    </div>
  )
}
