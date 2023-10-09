
export const currentGasPrice = async (web3) => {
  let value;
  await web3.eth
    .getGasPrice()
    .then((res) => {
      value = parseInt(res * 1.1);
    })
    .catch((err) => {});
  return value;
};

