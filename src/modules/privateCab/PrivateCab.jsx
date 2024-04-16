import { toNumber } from "ethers";
import { useEffect, useState } from "react";

export default function PrivateCab({ nameCoin, nameWorld, signer }) {
  const [tokenBal, setTokenBal] = useState(0);
  const [nftBal, setNftBal] = useState(0);
  const [statusOwner, setStatusOwner] = useState(false);
  const [totalSupply, setTotalSupply] = useState(0);
  const [myNftMas, setMyNftMas] = useState([]);

  useEffect(() => {
    const setStates = async () => {
      const $tokenBal = await nameCoin.connect(signer).balanceOf(signer); //nc token
      setTokenBal(Number($tokenBal));
      let $owner = await nameCoin.connect(signer).owner();
      if ($owner == signer.address) {
        setStatusOwner(true);
        const $totalSuply = await nameCoin.connect(signer).totalSupply();
        setTotalSupply(Number($totalSuply));
      } else setStatusOwner(false);

      const $nftBal = await nameWorld.connect(signer).balanceOf(signer); //nft token
      const newNames = [];
      for (let i = 0; i < Number($nftBal); i++) {
        const $nftId = await nameWorld.connect(signer).userNft(signer, i);
        const $nft = await nameWorld.connect(signer).idNftMap($nftId);
        newNames.push($nft);
      }
      setMyNftMas(newNames);
      setNftBal(Number($nftBal));
    };
    setStates();
  }, [signer]);

  return (
    <>
      <div className="infoPrivateCab">
        {statusOwner && (
          <>
            <h2>Владелец</h2>
          </>
        )}
        <h3>Адресс: {signer.address}</h3>
        <h4>Баланс: {tokenBal} NC</h4>
        {statusOwner ? (
          <>
            <h4>Общее количество NC: {totalSupply}</h4>

            <div>
              <button
                className="connect"
                onClick={async () => {
                  const $promptVal = window.prompt(
                    "Введите число токенов которое хотите выпустить"
                  );
                  if ($promptVal.length != 0 && $promptVal > 0)
                    await nameCoin.connect(signer).mint($promptVal);
                  else alert("Введите корректное число");
                }}
              >
                Выпустить NC
              </button>
              <button
                className="connect"
                onClick={async () => {
                  const $promptAdr = window.prompt(
                    "Введите адресс получателя ethereum"
                  );
                  if ($promptAdr.length != 42)
                    alert("Введите корректный адресс ethereum");
                  else {
                    try {
                      const $promptVal = window.prompt(
                        "Введите число токенов которое хотите перевести"
                      );
                      if (($promptVal.length != 0, $promptVal > 0))
                        await nameCoin
                          .connect(signer)
                          .transfer($promptAdr, $promptVal);
                      else alert("Введите корректное число");
                    } catch (e) {
                      console.log(e);
                      alert(e);
                    }
                  }
                }}
              >
                Перевести NC
              </button>
            </div>
          </>
        ) : (
          <>
            <button onClick={async () => {
                alert('На нашей платформе - Вы сами выбираете сколько вам внести. ')
                const $promptVal = window.prompt('Введите количество ETH, 1ETH = 1000 NC')
                // if($promptVal > 0 && toNumber($promptVal)) await nameCoin.connect(signer).buyToken($promptVal);
                // else {
                //     alert('Введите корректное число отправляемых ETH')
                // }
                console.log($promptVal)
                
            }}>Пополнить Баланс</button>
          </>
        )}
      </div>
      <div className="privateNicks">
        <h2>Куплено {nftBal}</h2>
      </div>
      <div className="namesList" key={"namesList"}>
        {myNftMas.map((name) => (
          <>
            <div className="nameContainer" key={"name_" + name}>
              <h3>{name}</h3>
              <button
                className="sale"
                onClick={async () => {
                  const $promptVal = window.prompt("Введите цену в CN");
                  if ($promptVal > 0) {
                    alert("good");
                  } else if (!$promptVal || typeof $promptVal != Number)
                    alert("Введите корректную цену в CN");
                }}
              >
                продать
              </button>
            </div>
          </>
        ))}
      </div>
    </>
  );
}
