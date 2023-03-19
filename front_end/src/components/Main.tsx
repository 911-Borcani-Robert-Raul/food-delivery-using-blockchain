import { useEtherBalance, useEthers } from "@usedapp/core"
import { formatEther } from "ethers/lib/utils";
import helperConfig from "../helper-config.json";
import { useNumberOfRestaurants } from "../hooks/RestaurantHooks";

export const Main = () => {
    const { account, chainId, error } = useEthers()
    const networkName = chainId ? helperConfig[chainId] : "dev"
    const etherBalance = useEtherBalance(account)

    const res = useNumberOfRestaurants("0x2feE3746B7a530Fca9AF3AE94a4734790B151052", "0x7887fBECC18Dcb05A4Ac2e30DD40688B2cfA8A58");

    // console.log(chainId);
    // console.log(networkName);
    // console.log(account);
    // console.log(etherBalance);

    console.log(res);

    return (
        <div>
            <div>
                Hi! Your ether balance is {formatEther(etherBalance ? etherBalance : 0)}!
            </div>
            <div>
                {res}
            </div>
        </div>
    )
}