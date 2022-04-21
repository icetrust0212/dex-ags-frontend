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
    name: 'AGS Token ICO',
    poolBasic: {
      saleAmount: '1,000,000 AGS',
      raiseAmount: '$2,100,000',
      cakeToBurn: '$2,100,000',
      distributionRatio: 0.3,
    },
    poolUnlimited: {
      saleAmount: '1,000,000 AGS',
      raiseAmount: '$2,100,000',
      cakeToBurn: '$2,100,000',
      distributionRatio: 1,
    },
    currency: mainnetTokens.wbnb,
    token: tokens.cake,
    releaseBlockNumber: 867810,
    campaignId: '0',
    articleUrl: 'https://ags.finance/',
    tokenOfferingPrice: 2.1,
    version: 2,
  },
  {
    id: 'AGS',
    address: '0x57Bc833798a2E1b60bc92e2396c985764Ed12971',
    isActive: false,
    name: 'AGS Token ICO',
    poolBasic: {
      saleAmount: '100,000 AGS',
      raiseAmount: '$750,000',
      cakeToBurn: '$750,000',
      distributionRatio: 0.3,
    },
    poolUnlimited: {
      saleAmount: '100,000 KALM',
      raiseAmount: '$750,000',
      cakeToBurn: '$750,000',
      distributionRatio: 0.7,
    },
    currency: mainnetTokens.wbnb,
    token: tokens.cake,
    releaseBlockNumber: 7707736,
    campaignId: '0',
    articleUrl: 'https://ags.finance/',
    tokenOfferingPrice: 2.0,
    version: 2,
  },
]

export default ifos
