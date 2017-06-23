// BTC-SEQ => seq
exports.parseMarketName = (marketName) => {
  return marketName.split('-')[1].toLowerCase();
}
