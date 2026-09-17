export interface SubnetResult {
  ip: string;
  cidr: number;
  netmask: string;
  wildcard: string;
  networkAddress: string;
  broadcastAddress: string;
  firstHost: string;
  lastHost: string;
  totalHosts: number;
  usableHosts: number;
  ipClass: string;
  isPrivate: boolean;
  binaryIp: string;
  binaryMask: string;
}

export function calculateSubnet(ipStr: string, cidr: number): SubnetResult | null {
  const parts = ipStr.trim().split('.').map(p => parseInt(p, 10));
  if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255)) {
    return null;
  }
  if (cidr < 0 || cidr > 32) {
    return null;
  }

  const ipInt = ((parts[0] << 24) >>> 0) + ((parts[1] << 16) >>> 0) + ((parts[2] << 8) >>> 0) + (parts[3] >>> 0);
  const maskInt = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
  const wildcardInt = (~maskInt) >>> 0;

  const netInt = (ipInt & maskInt) >>> 0;
  const broadInt = (netInt | wildcardInt) >>> 0;

  const intToIp = (num: number) => {
    return [
      (num >>> 24) & 255,
      (num >>> 16) & 255,
      (num >>> 8) & 255,
      num & 255
    ].join('.');
  };

  const toBinary = (num: number) => {
    return [
      ((num >>> 24) & 255).toString(2).padStart(8, '0'),
      ((num >>> 16) & 255).toString(2).padStart(8, '0'),
      ((num >>> 8) & 255).toString(2).padStart(8, '0'),
      (num & 255).toString(2).padStart(8, '0')
    ].join('.');
  };

  const totalHosts = Math.pow(2, 32 - cidr);
  const usableHosts = cidr >= 31 ? (cidr === 31 ? 2 : 1) : Math.max(0, totalHosts - 2);

  let firstHost = intToIp((netInt + 1) >>> 0);
  let lastHost = intToIp((broadInt - 1) >>> 0);
  if (cidr === 31) {
    firstHost = intToIp(netInt);
    lastHost = intToIp(broadInt);
  } else if (cidr === 32) {
    firstHost = intToIp(netInt);
    lastHost = intToIp(netInt);
  }

  // Determine IP Class
  let ipClass = 'C';
  const firstOctet = parts[0];
  if (firstOctet >= 1 && firstOctet <= 126) ipClass = 'A';
  else if (firstOctet === 127) ipClass = 'Loopback (A)';
  else if (firstOctet >= 128 && firstOctet <= 191) ipClass = 'B';
  else if (firstOctet >= 192 && firstOctet <= 223) ipClass = 'C';
  else if (firstOctet >= 224 && firstOctet <= 239) ipClass = 'D (Multicast)';
  else ipClass = 'E (Deneysel / Araştırma)';

  // RFC 1918 Private IP check
  let isPrivate = false;
  if (firstOctet === 10) isPrivate = true;
  else if (firstOctet === 172 && parts[1] >= 16 && parts[1] <= 31) isPrivate = true;
  else if (firstOctet === 192 && parts[1] === 168) isPrivate = true;

  return {
    ip: parts.join('.'),
    cidr,
    netmask: intToIp(maskInt),
    wildcard: intToIp(wildcardInt),
    networkAddress: intToIp(netInt),
    broadcastAddress: intToIp(broadInt),
    firstHost,
    lastHost,
    totalHosts,
    usableHosts,
    ipClass,
    isPrivate,
    binaryIp: toBinary(ipInt),
    binaryMask: toBinary(maskInt)
  };
}
