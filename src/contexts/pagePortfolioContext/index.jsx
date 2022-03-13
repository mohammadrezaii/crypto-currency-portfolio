import React, { useState } from "react";
import { useEffect } from "react";
import { getAllCryptoCurrencyData } from "../../adapters/pagePortfolioAdapter";
import http from "../../adapters/httpService";

export const coinsContext = React.createContext();

const CoinsProvider = ({ children }) => {
  const [trendingCoins, setTrendingCoins] = useState(null);
  const [allCryptoCurrency, setAllCryptoCurrency] = useState([]);
  const [userCoins, setUserCoins] = useState([]);
  const [coinsIdData, setCoinsIdData] = useState([]);

  useEffect(() => {
    const defaultCurrency = [
      { id: "bitcoin", count: 0 },
      { id: "ethereum", count: 0 },
      { id: "binancecoin", count: 0 },
      { id: "tether", count: 0 },
      { id: "cardano", count: 0 },
    ];

    if (localStorage.getItem("userCoinsId")) {
      const localStorageCoinData = JSON.parse(
        localStorage.getItem("userCoinsId")
      );
      setUserCoins(localStorageCoinData);
    } else {
      setUserCoins(defaultCurrency);
    }

    const myPromise = new Promise((resolve, reject) => {
      getAllCryptoCurrencyData()
        .then((response) => {
          resolve(response);
          setAllCryptoCurrency(response.data);
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
    myPromise.then((res) => {
      setInterval(() => {
        console.log("interval executed");
        getAllCryptoCurrencyData()
          .then((response) => {
            setAllCryptoCurrency(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      }, 60000);
    });
  }, []);

  useEffect(() => {
    localStorage.setItem("userCoinsId", JSON.stringify(userCoins));

    const array = [...userCoins];
    let userCoinData = [];
    let promises = [];
    for (let i = 0; i < array.length; i++) {
      promises.push(
        http.get(`/coins/${array[i].id}`).then((response) => {
          userCoinData.push(response.data);
        })
      );
    }

    Promise.all(promises).then(() => setCoinsIdData(userCoinData));
  }, [userCoins]);

  return (
    <coinsContext.Provider
      value={{
        trendingCoins,
        setTrendingCoins,
        allCryptoCurrency,
        setAllCryptoCurrency,
        userCoins,
        setUserCoins,
        coinsIdData,
        setCoinsIdData,
      }}
    >
      {children}
    </coinsContext.Provider>
  );
};

export default CoinsProvider;
