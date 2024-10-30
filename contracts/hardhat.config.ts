import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    ganache: {
      // rpc url, change it according to your ganache configuration
      url: 'HTTP://127.0.0.1:8545',
      // the private key of signers, change it according to your ganache user
      accounts: [
        '0x70f752c12c82348a166aef8a5b910abd9c3616810ed99de783abe55d114a7fa8',
        '0x88508ca06a94eb4a63e5dfc137bd288094adfcbdda18547221c3eb118be03053',
        '0xa94fd8af2027bb677f6c4a4ad2b42b195bb8c8e1016c94d628e08e6a2f0f95a4',
        '0xdafb3fd0288d2492708fa24d11ef551b580769c03a6e44bef6e8c3782227640f'
      ]
    },
  },
};

export default config;
