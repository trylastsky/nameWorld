import { useState,useEffect} from 'react'
//modules
import Header from './modules/header/Header'
import PrivateCab from './modules/privateCab/PrivateCab';
import SalePage from './modules/salePage/SalePage';
//contract ABI
import { ethers } from 'ethers';
import NameWorld from './artifacts/contracts/NameWorld.sol/NameWorld.json';
import contractAddress from '../contractAddress.json';

import './App.css'

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
        nameWorld = new ethers.Contract(contractAddress, NameWorld.abi, provider);
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
      {mainSt && (<><SalePage nameWorld={nameWorld} signer={signer}/></>)}
      {privateCabSt && (<><PrivateCab 
        nameWorld={nameWorld}
        signer={signer}/></>)}
      
      </>)}
    </>
  )
}
