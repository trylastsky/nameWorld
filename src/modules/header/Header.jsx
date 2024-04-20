import { ethers, BrowserProvider} from "ethers";
import { useCallback, useEffect } from "react";

export default function Header({
	provider,
	setProvider,
	signer,
	setSigner,
	privateCabSt,
	setPrivateCabSt,
    setMainSt,
}) {
	const onConnect = useCallback(async () => {
		if (window.ethereum) {
			let $provider = new BrowserProvider(window.ethereum);
			await window.ethereum.request({ method: "eth_requestAccounts" });
			let $signer = await $provider.getSigner();
			setProvider($provider);
			setSigner($signer);
		} else {
			alert("metamask not defined");
			onclick((document.location.href = "https://metamask.io/"));
		}
	});

	useEffect(() => {
        if(window.ethereum) window.ethereum.on('accountsChanged', () => {onConnect()})
	}, [signer]);
    
	return (
		<>
			<div className="header">
				<div className="logoDiv">
					<h1 className="logo">NameWorld</h1>
				</div>

				{!signer ? (
					<>
						<button className="connect" onClick={onConnect}>
							Вход
						</button>
					</>
				) : (
					<>
						<div id="buttons_div">
							{!privateCabSt ? (
								<>
									<button
										className="connect"
										id="lk"
										onClick={() => {setPrivateCabSt(true)
                                        setMainSt(false)}}
									>
										Личный Кабинет
									</button>
								</>
							) : (
								<>
									<button
										className="connect"
										id="lk"
										onClick={() => {setPrivateCabSt(false)
                                        setMainSt(true)}}
									>
										Главная
									</button>
								</>
							)}

							<button
								className="exit"
								onClick={() => window.location.reload()}
							>
								Выход
							</button>
						</div>
					</>
				)}
			</div>
		</>
	);
}
