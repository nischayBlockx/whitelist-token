export const useEgarConnect = (connector) => {
  // you can get connecter from the above example
  connector
    .connectEagerly()
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
};



// connect eagrly is function of provider which helps to cpnnect automatically
