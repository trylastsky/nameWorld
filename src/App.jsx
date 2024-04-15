import { useState,useEffect } from 'react'
//modules
import Header from './modules/header/Header'
import PrivateCab from './modules/privateCab/PrivateCab';
import Main from './modules/main/Main';

import './App.css'

function App() {

  //ethereum
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);

  const [privateCabSt, setPrivateCabSt] = useState(false);
  const [mainSt, setMainSt] = useState(true);


  useEffect(() => {
    
  },[])
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
      {privateCabSt && (<><PrivateCab signer={signer}/></>)}
      
      </>)}
    </>
  )
}

export default App
