import { ethers } from "ethers";

import { useEffect, useState } from "react"

export default function PrivateCab({signer}) {
    const [signerAdr, setSignerAdr] = useState(null);
    
    useEffect(() => {
    },[signer])

    return(<>
    <div className="infoPrivateCab">

    <h3>Адресс: {signer.address}</h3>
    <h3>Баланс: 0 NC</h3>
    <button>Пополнить Баланс</button>
    </div>
    <div className="privateNicks">
        <h2>Куплено</h2>
    </div>
    </>)
}