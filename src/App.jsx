import { useState,useEffect, useCallback } from 'react'
//modules
import Header from './modules/header/Header'
import PrivateCab from './modules/privateCab/PrivateCab';
import Main from './modules/main/Main';
//contract ABI
import { ethers } from 'ethers';
import NameCoin from './artifacts/contracts/NameCoin.sol/NameCoin.json';
import NCAddress from '../NCAddress.json';


import './App.css'


let nameCoin = null;
let nameWorld = null;

export default function App() {

  //ethereum
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);

  const [privateCabSt, setPrivateCabSt] = useState(false);
  const [mainSt, setMainSt] = useState(true);


  useEffect(() => {
    if(provider) {
    const useContract = async () => {
      try {
        nameCoin = new ethers.Contract(NCAddress, NameCoin.abi, provider);
      }
      catch(e) {
        console.log(e);
      }
    }
    useContract();
    }
  },[provider])
  return (
    <>
      <Header 
      provider={provider} setProvider={setProvider}
      signer={signer} setSigner={setSigner}
      privateCabSt={privateCabSt} setPrivateCabSt={setPrivateCabSt}
      setMainSt={setMainSt}
      />
      {!provider ? (<>
      <p>Пожалуйста совершите вход</p></>) : (<>
      {mainSt && (<><Main/></>)}
      {privateCabSt && (<><PrivateCab nameCoin={nameCoin} signer={signer}/></>)}
      
      </>)}
    </>
  )
}
