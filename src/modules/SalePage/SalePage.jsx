import { useEffect, useState } from "react";

export default function SalePage({nameWorld, signer}) {

    const [saleNFTMas, setSaleNftMas] = useState([]);

    useEffect(() => {
        const setState = async () => {
            const newMas = [];
            const $saleNftMasLength = await nameWorld.connect(signer).saleNFTMasLength();
            for(let i = 0; i < Number($saleNftMasLength); i++) {
                const $tokenId = await nameWorld.connect(signer).saleNFTMas(i);
                const $nft = await nameWorld.connect(signer).idNftMap(Number($tokenId));
                const $ownerNft = await nameWorld.connect(signer).ownerNNFT(Number($tokenId));
                const $nftPrice = await nameWorld.connect(signer).priceToken(Number($tokenId))
                const NFT = {
                    name: String($nft),
                    owner: String($ownerNft),
                    price: Number($nftPrice)
                }
                newMas.push(NFT);
            }
        setSaleNftMas(newMas);
        }
        setState()
    }, [])

    return(<>
    <div id="nadodd">
    <h3>Торговая площадка</h3>
    </div>
    <div className="namesList" key={'salePage'}>
    {saleNFTMas.map((NFT, index) => (<>
        <div className="nameContainer" key={"SaleName_" + NFT.name}>
        <h3>{NFT.name}</h3>
        <p>index {index}</p>
        <p>Владелец:</p>
        <p>{NFT.owner}</p>
        <p>Цена: {NFT.price}</p>
        {NFT.owner !== signer.address ? (<>
            <button  className="sale" onClick={async() => {
                const $userBalance = await nameWorld.connect(signer).balanceNC(signer);
                const $nftId = await nameWorld.connect(signer).idForString(String(NFT.name));
                if(Number($userBalance) >= NFT.price ) {
                    await nameWorld.connect(signer).buyNNFT($nftId);
                }
                else alert('недостаточно средств NC');
            }}>Купить</button>
        
        </>) : (<>
        <button className="sale" onClick={() => {
            alert('Этот лот выставлен вами')
        }}>
        Это ваш лот
        </button>
        
        </>)}

        </div>

    </>))}
    </div>
    </>)
}