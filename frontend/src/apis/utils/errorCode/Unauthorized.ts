const Unauthorized = {
  INVALID_LOGIN: "M0002",
  INVALID_TOKEN: "S0001",
  ACCESS_DENIED: "S0002",
  ACCESS_DENIED_03: "S0003",
  EXPIRED_TOKEN: "S0004",
  MALFORMED_TOKEN: "S0005",
  UNSUPPORTED_TOKEN: "S0006",
  ILLEFAL_TOKEN: "S0007",
} as const;

export default Unauthorized;
