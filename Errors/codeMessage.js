const getMessageForCode = (code) => {
  switch (code) {
    case "100":
      return "Request already filled";
    case "101":
      return "Cannot accept your own request";
    case "102":
      return "Request already accepted";
    case "103":
      return "Could not accept request";
    case "200":
      return "Report successfully submitted";
    default:
      return "Unknown error";
  }
};

module.exports = { getMessageForCode };
