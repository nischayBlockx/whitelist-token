import React, { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";
import { CONTRACT_ADDRESS } from "../../constant";
import fromExponential from "from-exponential";
import contractABI from "../../ABI/contractABI.json";
import { currentGasPrice } from "../commonFunctions";

const Home = () => {
  const { account, provider, connector } = useWeb3React();
  const lib = provider;
  const web3 = new Web3(lib?.provider);
  const [userAmount, setUserAmount] = useState("");

  const handleCOnnect = () => {
    connector
      .activate()
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };


  useEffect(() => {
    console.log({account, provider})
  }, [provider, account])

  const buyToken = async () => {
    console.log("buy token called ")
    try {
      const user = account;
      const amount = web3.utils.toBN(
        fromExponential(+(userAmount) * Math.pow(10,18))
      );
      const instance = new web3.eth.Contract(contractABI, CONTRACT_ADDRESS);
      const gasFee = await instance.methods
        .buy(amount)
        .estimateGas({ from: user });
      const encodedAbi = await instance.methods
        .buy(amount)
        .encodeABI();
      const CurrentgasPrice = await currentGasPrice(web3);
      await web3.eth
        .sendTransaction({
          from: user,
          to: CONTRACT_ADDRESS,
          gas: (parseFloat(gasFee) + 20000).toString(),
          gasPrice: CurrentgasPrice,
          data: encodedAbi,
        })
        .on("transactionHash", async (res) => {
          console.log(res, "hash");
        })
        .on("receipt", (res) => {
          console.log(res, "receipt");
        })
        .on("error", (res) => {
          console.log(res, "error test 1");
        });
    } catch (error) {
      console.log(error);
    }
  };

  console.log({account})

  return (
    <div className="maindiv">
      {!account ? (
        <div>
          <button className="appbuttons" onClick={() => handleCOnnect()}>
            connect metamask
          </button>
        </div>
      ) : (
        <div className="flex-row">
          <input placeholder="enter token amount" className="inputBox" 
          value={userAmount}
          onChange={(e) => setUserAmount(e.target.value)}
          />
          <button className="appbuttons" onClick={() => buyToken()}>buy token</button>
        </div>
      )}
    </div>
  );
};

export default Home;
