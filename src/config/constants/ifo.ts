import { Token, ChainId } from '@pancakeswap/sdk'
import tokens, { mainnetTokens } from './tokens'
import farms from './farms'
import { Ifo } from './types'

const cakeBnbLpToken = new Token(ChainId.MAINNET, farms[1].lpAddresses[ChainId.MAINNET], 18, farms[1].lpSymbol)
const WASTR_USDT = new Token(ChainId.MAINNET, farms[2].lpAddresses[ChainId.MAINNET], 18, farms[2].lpSymbol)

const ifos: Ifo[] = [
  {
    id: 'AGS',
    address: '0xC52b54A4900c38Eb3c3f1e260E2321c3901900C1',
    isActive: true,
    name: 'AGS Token Sale',
    poolBasic: {
      saleAmount: '1,000,000 AGS',
      raiseAmount: '$2,100,000',
      cakeToBurn: '$2,100,000',
      distributionRatio: 0.3,
    },
    poolUnlimited: {
      saleAmount: '5,000,000 AGS',
      raiseAmount: '$500,000',
      cakeToBurn: '$0',
      distributionRatio: 1,
    },
    currency: mainnetTokens.wbnb,
    token: tokens.cake,
    releaseBlockNumber: 867810,
    campaignId: '0',
    articleUrl: 'https://ags.finance/',
    tokenOfferingPrice: 0.1,
    version: 2,
  },
]

export default ifos
