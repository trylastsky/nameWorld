import { ethers} from "ethers";
import { useEffect, useState } from "react";

export default function PrivateCab({ nameWorld, signer }) {
  const [tokenBal, setTokenBal] = useState(0);
  const [nftBal, setNftBal] = useState(0);
  const [statusOwner, setStatusOwner] = useState(false);
  const [totalSupply, setTotalSupply] = useState(0);
  const [myNftMas, setMyNftMas] = useState([]);
  const [isPricelessClicked, setIsPricelessClicked] = useState(false);

  useEffect(() => {
    const setStates = async () => {
      const $tokenBal = await nameWorld.connect(signer).balanceNC(signer); //nc token
      const $owner = await nameWorld.connect(signer).owner();
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
                  if ($promptVal.length != 0 && $promptVal > 0) {
                    await nameWorld.connect(signer).mintNC(Number($promptVal));
                    const $balanceToken = await nameWorld.connect(signer).balanceNC(signer);
                    setTokenBal($balanceToken);
                  }

                  
                  else alert("Введите корректное число");
                }}
              >
                Выпустить NC
              </button>
              
            
          </>
        ) : (
          <>
            <button className='connect' onClick={async () => {
                alert('На нашей платформе - Вы сами выбираете сколько вам внести.')
                const $promptVal = window.prompt('Введите число отправляемого ETH, 1 ETH = 1000 NC');
                if ($promptVal !== null) {
                    const inputValue = parseFloat($promptVal);
                    if (!isNaN(inputValue) && inputValue > 0) {
                      
                      await nameWorld.connect(signer).buyNC({value: ethers.parseEther(String(inputValue))})
                      const $balanceToken = await nameWorld.connect(signer).balanceNC(signer);
                      setTokenBal($balanceToken);
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
         <button
                className="connect"
                onClick={async () => {
                  if(tokenBal == 0) alert('У вас нет NC')
                  else {
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
                    if (($promptVal.length != 0, $promptVal > 0)) {
                      await nameWorld
                        .connect(signer)
                        .transferNC($promptAdr, $promptVal);

                        const $balanceToken = await nameWorld.connect(signer).balanceNC(signer);
                        setTokenBal($balanceToken);
                    }
                        
                    else alert("Введите корректное число");
                  } catch (e) {
                    console.log(e);
                    alert(e);
                  }
                }
                }
                }}
              >
                Перевести NC
              </button>
        <button className="connect" onClick={async () => {
          if(tokenBal < 100) alert ('Пополните баланс, услуга стоит 100 NC')
          else {
        let $promptVal;
        if(!statusOwner) {
          $promptVal = window.prompt('Введите Выпускаемое Имя, Учтите - Цена Выпуска 1 NNFT = 100 токенов NC');
        }
        if(statusOwner) {
          $promptVal = window.prompt('Введите Выпускаемое Имя');
        }
        if($promptVal) {
          if($promptVal.length > 0) {
            const $stName = await nameWorld.connect(signer).statusName(String($promptVal));
            if($stName) alert('Данное имя уже зарезервированно, Введите другое имя');
            else if(!$stName) {
                await nameWorld.connect(signer).mintNNFT(String($promptVal));
                const $balanceToken = await nameWorld.connect(signer).balanceNC(signer);
                const $balanceNFT = await nameWorld.connect(signer).balanceNNFT(signer);
                setTokenBal($balanceToken);
                setNftBal($balanceNFT);
                
            } 
          } else if(!$promptVal) alert('Введите хоть что-то XD')
        }
        else return
        
          }
        }}>Выпустить NNFT</button>
        <button
                className="connect"
                onClick={async () => {
                  if(nftBal == 0) alert('Нет выпущенных NNFT')
                  else {
                
                const $promptAdr = window.prompt(
                  "Введите адресс получателя ethereum"
                );
                if ($promptAdr) {

                  if ($promptAdr.length !== 42)
                    alert("Введите корректный адресс ethereum");
                  else {
                    if (String($promptAdr) === signer.address) alert('Введите адрес другого пользователя, вы пытаетесь отправить NNFT себе');
                    else {
                      try {
                        const $promptVal = window.prompt(
                          "Введите Имя , Владение над которым, Вы хотите передать другому пользователю"
                        );
                        if (($promptVal)) {
                          const $tokenId = await nameWorld.connect(signer).idForString(String($promptVal));
                          if(!$tokenId){
                            if ($promptVal == 'trylastsky') alert('нет уж')
                            else alert('Введите Существующее имя ')
                          } 
                          else {
                            if($tokenId) {
                              console.clear();
                              console.log(Number($tokenId));
                              await nameWorld.connect(signer).safeTransferFrom($promptAdr, Number($tokenId))
                              const $balanceNFT = await nameWorld.connect(signer).balanceNNFT(signer);
                              setNftBal($balanceNFT);
  
                            }
                            else alert('Введите существующее имя')
                          }
                        }
                        else  return;
                      } catch (e) {
                        console.log(e);
                        alert(e);
                      }

                    }
                  }
                } 
                else return
                  }
                }}
              >
                Перевести NNFT
              </button>
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
              {name != 'trylastsky' && !isPricelessClicked  ? (<>
              <button
                className="sale"
                onClick={async () => {
                  const $promptVal = window.prompt("Введите цену в NC");
                  if ($promptVal > 0) {
                    alert("good");
                  } else if (!$promptVal)
                    alert("Введите корректную цену в NC");
                }}
              >
                продать
              </button>
              
              </>) : (<><button className="sale" onClick={() => {
                alert('Имя разработчика этого проекта')
                setIsPricelessClicked(true);
                onclick(document.location.href = 'https://github.com/trylastsky')
              }}> Бесценный</button></>)}
            </div>
          </>
        ))}
      </div>
    </>
  );
}
