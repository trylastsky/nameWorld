import { ethers} from "ethers";
import { useEffect, useState } from "react";

export default function PrivateCab({ nameWorld, signer }) {
  const [tokenBal, setTokenBal] = useState(0);
  const [nftBal, setNftBal] = useState(0);
  const [statusOwner, setStatusOwner] = useState(false);
  const [totalSupply, setTotalSupply] = useState(0);
  const [myNftMas, setMyNftMas] = useState([]);

  useEffect(() => {
    const setStates = async () => {
      const $tokenBal = await nameWorld.connect(signer).balanceNC(signer); //nc token
      console.log($tokenBal)
      const $owner = await nameWorld.connect(signer).owner();
      console.log($owner)
      if ($owner == signer.address) {
        setStatusOwner(true);
        const $totalSuply = await nameWorld.connect(signer).totalSupplyNC();
        setTotalSupply(Number($totalSuply));
      } else setStatusOwner(false);

      const $nftBal = await nameWorld.connect(signer).balanceNNFT(signer); //nft token
      const newNames = [];
      for (let i = 0; i < Number($nftBal); i++) {
        const $nftId = await nameWorld.connect(signer).userNft(signer, i);
        const $nft = await nameWorld.connect(signer).idNftMap($nftId);
        newNames.push($nft);
      }
      setMyNftMas(newNames);
      setTokenBal(Number($tokenBal));
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
        {statusOwner && (<><h4>Общее количество NC: {totalSupply}</h4></>)}
        <div className="buttonCont">
        {statusOwner ? (
          <>
              <button
                className="connect"
                onClick={async () => {
                  const $promptVal = window.prompt(
                    "Введите число токенов которое хотите выпустить"
                  );
                  if ($promptVal.length != 0 && $promptVal > 0)

                    await nameWorld.connect(signer).mintNC($promptVal);
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
                        await nameWorld
                          .connect(signer)
                          .transferNC($promptAdr, $promptVal);
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
              
            
          </>
        ) : (
          <>
            <button className='connect' onClick={async () => {
                alert('На нашей платформе - Вы сами выбираете сколько вам внести.')
                const $promptVal = window.prompt('Введите число отправляемого ETH, 1 ETH = 1000 CN');
                if ($promptVal !== null) {
                    const inputValue = parseFloat($promptVal);
                    if (!isNaN(inputValue) && inputValue > 0) {
                      
                      await nameWorld.connect(signer).buyNC({value: ethers.parseEther(String(inputValue))})
                    } else {
                        // Если введенное значение не является числом или меньше или равно нулю
                        window.alert('Введенное значение некорректно или меньше или равно нулю');
                    }
                } else {
                    return
                }

                
            }}>Пополнить Баланс</button>
          
          </>
        )}
        <button className="connect" onClick={async () => {
          const $promptVal = window.prompt('Введите Выпускаемое Имя');
          if($promptVal) {
            if($promptVal.length > 0) {
              const $stName = await nameWorld.connect(signer).statusName(String($promptVal));
              if($stName) alert('Данное имя уже зарезервированно, Введите другое имя');
              else if(!$stName) {
                  
                  
              } 
            } else if(!$promptVal) alert('Введите хоть что-то XD')
          }
          else return
        }}>Выпустить NNFT</button>
        </div>
      </div>
      <div className="privateNicks">
        <h2>Куплено {nftBal} NNFT</h2>
      </div>
      <div className="namesList" key={"namesList"}>
        {myNftMas.map((name, index) => (
          <>
            <div className="nameContainer" key={"name_" + name}>
             
              <h3>{name}</h3>
              <p>index {index}</p>
              <button
                className="sale"
                onClick={async () => {
                  const $promptVal = window.prompt("Введите цену в CN");
                  if ($promptVal > 0) {
                    alert("good");
                  } else if (!$promptVal)
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
