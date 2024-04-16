
import { useEffect, useState } from "react"

export default function PrivateCab({nameCoin, signer}) {
    const [tokenBal, setTokenBal] = useState(0);
    const [statusOwner, setStatusOwner] = useState(false);
    const [totalSupply, setTotalSupply] = useState(0);
    
    useEffect(() => {
        const setStates = async() => {
            const $tokenBal = await nameCoin.connect(signer).balanceOf(signer);
            setTokenBal(Number($tokenBal));
            let $owner = await nameCoin.connect(signer).owner();
            if($owner == signer.address) {
                setStatusOwner(true);
                const $totalSuply = await nameCoin.connect(signer).totalSupply();
                setTotalSupply(Number($totalSuply));
            }
            else setStatusOwner(false);
        }
        setStates()
    },[signer])

    return(<>
    <div className="infoPrivateCab">
        {statusOwner && (<><h2>Владелец</h2></>)}
    <h3>Адресс: {signer.address}</h3>
    <h3>Баланс: {tokenBal} NC</h3>
    {statusOwner ? (<>
    <h3>Общее количество NC: {totalSupply}</h3>

    <div>
        <button className='connect' onClick={async () => {
            const $promptVal = window.prompt('Введите число токенов которое хотите выпустить');
            if($promptVal.length != 0 && $promptVal > 0) await nameCoin.connect(signer).mint($promptVal);
            else alert('Введите корректное число')
        }}>Выпустить NC</button>
        <button className='connect' onClick={async () => {
            const $promptAdr = window.prompt('Введите адресс получателя ethereum');
            if($promptAdr.length != 42) alert('Введите корректный адресс ethereum');
            else {
                try{
                    const $promptVal = window.prompt('Введите число токенов которое хотите перевести');
                    if($promptVal.length != 0, $promptVal > 0) await nameCoin.connect(signer).transfer($promptAdr, $promptVal);
                    else alert('Введите корректное число');
                    
                }
                catch(e) {
                    console.log(e);
                    alert(e);
                }
            }
        }}>Перевести NC</button>
        </div>
    </>) : (<>
        <button>Пополнить Баланс</button>
    </>)}
    </div>
    <div className="privateNicks">
        <h2>Куплено</h2>
    </div>
    </>)
}