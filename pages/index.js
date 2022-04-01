import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useEffect, useState } from 'react';
import { ethers, providers } from "ethers";
import QRCode from "react-qr-code";
import { useForm } from "react-hook-form";

const tempFriends = [
  {"name": "Scalanis Magharice", "pubkey": "0x389BE126c3500e9eaC4d0596Ae1C84a39AD91288"},
  {"name": "Bellas Farbella", "pubkey": "0x85A52a4084ad1384C79a387406Efb7D1bF4FA404"},
  {"name": "Paeris Miraric", "pubkey": "0x0e77b5d4EA1BE383D597CFf66D6A710eba7f6893"},
  {"name": "Jandar Ravawarin", "pubkey": "0x0ABD28902B4577880031E664F1A0B39d9E259769"},
  {"name": "Laiex Krisgwyn", "pubkey": "0x4B44703de91c6e81b97Ea2eF2ce9d203b7877B01"},
  {"name": "Folmer Erxidor", "pubkey": "0xf2c3Ca4B7a970D92466C3a47849B760C6840477b"},
  {"name": "Ailre Torrona", "pubkey": "0x6B8B38B8Cc006d282E442f34Af48266916C3bEc1"},
]

import contractAbi from '../utils/Frens.json';
const CONTRACT_ADDRESS = "0x950EEf2c71c85F0015FC01c1540632DeeF2b8fA1";

export default function Home() {  
  const { register, handleSubmit, watch, resetField, formState: { errors } } = useForm();
  const [currentAccount, setCurrentAccount] = useState(null);
  const [friends, setFriends] = useState(tempFriends);
  const [loading, setLoading] = useState(false);

  const onSubmit = async newFriend => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);

    console.log("adding fren");
    let tx = await contract.addfren(newFriend.address, newFriend.name);
    const rc = await tx.wait();
    const frenList = rc.events.find(event => event.event === "FrenListUpdated")
    console.log(frenList.args._frenlist)
    setFriends(frenList.args._frenlist)

    resetField("name")
    resetField("address")
  };

  const deleteFriend = async address => {
    // setFriends(friends.filter(friend => friend.address != address));
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);

    console.log("removing fren");
    let tx = await contract.removefren(address);
    const rc = await tx.wait();
    const frenList = rc.events.find(event => event.event === "FrenListUpdated");
    // filter out zeroed out frens
    frenList = frenList.args._frenlist.filter(fren => fren.pubkey != '0x0000000000000000000000000000000000000000');
    console.log(frenList)
    setFriends(frenList)
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("you need metamask for this to work");
        return;
      }

      const chainId = await ethereum.request({ method: 'eth_chainId' })
      console.log(chainId)

      if (chainId !== '0x4') {
        alert("i only works on rinkeby")
        // switch user to rinkeby
        await switchNetwork();
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts"});

      console.log("Connected to", accounts[0]);
      setCurrentAccount(accounts[0]);

      // load friends
      setLoading(true);
      loadFriends();
      setLoading(false);

    } catch (error) {
      console.log(error)
    }
  }

  const loadFriends = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);

        console.log("Creating a record for this user if they're new...");
        let tx = await contract.createOrFindNewUser();
        const rc = await tx.wait();
        const frenList = rc.events.find(event => event.event === "FrenListUpdated")
        console.log(frenList.args._frenlist)

        setFriends(frenList.args._frenlist)
      }
    } catch(error) {
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
        console.log(error);
      }
    }
  }

  return (
    <div>
      <Head>
        <title>Frens</title>
        <meta name="description" content="Together on chain 4ever" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main 
        style={{background: 'hsl(328deg 58% 94%)' }}
        className="w-screen min-h-full h-screen box-border flex flex-col pt-4 font-kiddie"
        >
        <h1 className="m-0 text-6xl text-center mb-10">
          frens🐸
        </h1>


        <div className="grow flex justify-center align-center max-w-full">
          { !currentAccount ?
              <button 
                className="rounded bg-red-200 hover:bg-slate-100 h-10 px-2 self-center"
                // onClick={() => setCurrentAccount("Whatever")}
                onClick={() => connectWallet()}
              >
                click 2 sign in fam
              </button>
            : 
            <div 
              style={{background: '#f8e7f1',
              boxShadow: '20px 20px 60px #d3c4cd, -20px -20px 60px #ffffff, 0 0 2vh 2vh hsl(328deg 58% 94%)',	
              padding: '1em',	
              borderRadius: '20px'}}
              className = "sm:w-3/4 m:w-1/2 max-w-2xl mb-6"
            >
              {/* "handleSubmit" will validate your inputs before invoking "onSubmit" */}
              <form 
                className="flex flex-col sm:flex-row justify-around mb-6"
                onSubmit={handleSubmit(onSubmit)}
                >
                {/* register your input into the hook by invoking the "register" function */}
                <input 
                  className="rounded pl-2 mb-2 sm:mb-0"
                  placeholder="wat name" 
                  {...register("name", {required: true})} 
                />
                
                {/* include validation with required or other standard HTML validation rules */}
                <input 
                  className="rounded pl-2 mb-2 sm:mb-0"
                  placeholder="wallet address" 
                  {...register("address", { required: true, minLength: 42, maxLength: 42 })} 
                />
                {/* errors will return when field validation fails  */}
                {errors.exampleRequired && <span>This field is required</span>}

                <input 
                  className="rounded-full p-2 bg-rose-500 hover:text-white hover:bg-rose-700 cursor-pointer"
                  type="submit" 
                  value="add fren"
                  />
              </form>
              {friends.map((friend) =>
                <div 
                  className="flex mb-6 p-4 rounded bg-white/[.4]"
                  key={friend.pubkey}
                  >
                  <QRCode size={150} value={friend.pubkey} />
                  <div className="flex flex-col items-center justify-around grow">
                    <h2 
                      className="text-l sm:text-xl mb-2 font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-br bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500"
                    >
                      {friend.name}
                    </h2>
                    <div className="flex items-center px-4">
                      <h6 className="mr-4">
                        {friend.pubkey.substring(0, 4) + '..' + friend.pubkey.substring(40, 42)}
                      </h6>
                      <button 
                        className="bg-white rounded px-1 sm:p-1 border-2 border-black hover:bg-slate-100"
                        onClick={() =>  navigator.clipboard.writeText(friend.pubkey)}
                      >
                        👈 copy
                      </button>
                    </div>
                    <button 
                      className="bg-rose-500 hover:bg-red-700 text-white text-center py-2 px-4 rounded-full"
                      onClick={() => deleteFriend(friend.pubkey)}
                    >
                      remove fren
                    </button>
                  </div>
                </div>
                )
              }
            </div>
          }
        </div>
      </main>
    </div>
  )
}
