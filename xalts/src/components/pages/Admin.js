import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { CONTRACT_ADDRESS } from "../../constant";
import fromExponential from "from-exponential";
import contractABI from "../../ABI/contractABI.json";
import { currentGasPrice } from "../commonFunctions";
import { useWeb3React } from "@web3-react/core";

const Admin = () => {
  const { account, provider, connector } = useWeb3React();
  const [userInput, setUserInput] = useState("");

  const lib = provider;
  const web3 = new Web3(lib?.provider);

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
    console.log({ account, provider });
  }, [provider, account]);

  const Whitelist = async () => {
    console.log("Whitelist called ");
    try {
      const user = account;
      const instance = new web3.eth.Contract(contractABI, CONTRACT_ADDRESS);
      const gasFee = await instance.methods
        .whitelist(user)
        .estimateGas({ from: user });
      const encodedAbi = await instance.methods
        .whitelist(user)
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
  const blacklist = async () => {
    console.log("blacklist called ");
    try {
      const user = account;
      const instance = new web3.eth.Contract(contractABI, CONTRACT_ADDRESS);
      const gasFee = await instance.methods
        .blacklist(user)
        .estimateGas({ from: user });
      const encodedAbi = await instance.methods
        .blacklist(user)
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
          <input
            placeholder="Enter wallet address"
            className="inputBox"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          <button className="appbuttons" onClick={() => Whitelist()}>Whitelist token</button>
          <button className="appbuttons" onClick={() => blacklist()}>blacklist token</button>
        </div>
      )}
    </div>
  );
};

export default Admin;
