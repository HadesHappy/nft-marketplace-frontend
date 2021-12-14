import React from 'react';
import './style.css';

const MarketplaceHeader = () => {
  return (
    <div className="banner">
      <div className="left-block">
        <div className="rabbit"></div>
      </div>
      <div className="center-block">
        <div className="title">
          <h1>
            Moon Rabbit
            <br /> NFT Marketplace
          </h1>
          <p>Your one-stop shop to enter the Metaverse!</p>
        </div>
      </div>

      <div className="right-list"></div>
    </div>
  );
};

export default MarketplaceHeader;
