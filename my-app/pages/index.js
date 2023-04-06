import Head from 'next/head'
import Web3Modal from "web3modal";
import { ethers, providers } from "ethers";
import { useEffect, useRef, useState } from "react";
import styles from '@/styles/Home.module.css'

export default function Home() {
const [walletconnected,setWalletconnected]=useState(false);
const web3modalRef=useRef();  
  // ENS
  const [ens, setENS] = useState("");
  // Save the address of the currently connected account
  const [address, setAddress] = useState("");
async function setENSorAddress(web3Provider,address){
  const ens=await web3Provider.lookupAddress(address);
  if(ens){
    setENS(ens);
  }
  else{
    setAddress(address);
  }
}
async function getProviderOrSigner(){
  const provider=await web3modalRef.current.connect();
  const web3Provider = new providers.Web3Provider(provider);
  const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 5) {
      window.alert("Change the network to Goerli");
      throw new Error("Change network to Goerli");
    }
    const signer = web3Provider.getSigner();
    const address = await signer.getAddress();
    setENSorAddress(web3Provider,address);

}

async function connectWallet(){
  try{
    await getProviderOrSigner(true);
    setWalletconnected(true);
  }catch(e){
    console.error(e.stack);
  }
}


  useEffect(() => {
    web3modalRef.current=new Web3Modal({
      network:"goerli",
      providerOptions:{},
      disableInjectedProvider:false,
    });
    connectWallet();
  },walletconnected);





  const renderButton = () => {
    if (walletconnected) {
      <div>Wallet connected</div>;
    } else {
      return (
        <button onClick={connectWallet} className={styles.button}>
          Connect your wallet
        </button>
      );
    }
  };


  return (
    <>
     
    <div>
      <Head>
        <title>ENS Dapp</title>
        <meta name="description" content="ENS-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>
            Welcome to Artists Collection {ens ? ens : address}!
          </h1>
          <div className={styles.description}>
            {/* Using HTML Entities for the apostrophe */}
            It&#39;s an NFT collection of a artist.
          </div>
          {renderButton()}
        </div>
        <div>
          <img className={styles.image} src="./learnweb3punks.png" />
        </div>
      </div>

      <footer className={styles.footer}>
        Made with &#10084; by laveshDEVs
      </footer>
    </div>
  );
    </>
  )
}
