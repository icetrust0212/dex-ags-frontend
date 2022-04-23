import { mainnetTokens } from 'config/constants/tokens'
import { SalesSectionProps } from '.'

export const swapSectionData: SalesSectionProps = {
  headingText: 'Trade any crypto.',
  bodyText: 'Trade any token on Astra Chain in seconds, just by connecting your wallet.',
  reverse: false,
  primaryButton: {
    to: '/swap',
    text: 'Trade Now',
    external: false,
  },
  secondaryButton: {
    to: 'https://agsfinance.gitbook.io/docs//',
    text: 'Learn',
    external: true,
  },
  images: {
    path: '/images/home/trade/',
    attributes: [
      { src: 'ASTR', alt: 'ASTR token' },
      { src: 'BTC', alt: 'BTC token' },
      { src: 'AGS', alt: 'AGS token' },
    ],
  },
}

export const earnSectionData: SalesSectionProps = {
  headingText: `Earn passive income with $${mainnetTokens.cake.symbol}.`,
  bodyText: 'AGS Finance makes it easy to make your crypto work for you.',
  reverse: true,
  primaryButton: {
    to: '/farms',
    text: 'Explore',
    external: false,
  },
  secondaryButton: {
    to: 'https://agsfinance.gitbook.io/docs/products/yield-farming',
    text: 'Learn',
    external: true,
  },
  images: {
    path: '/images/home/earn/',
    attributes: [
      { src: 'pie', alt: 'Pie chart' },
      { src: 'stonks', alt: 'Stocks chart' },
      { src: 'AGS', alt: 'Folder with ags token' },
    ],
  },
}

export const cakeSectionData: SalesSectionProps = {
  headingText: `$${mainnetTokens.cake.symbol} makes our world go round.`,
  bodyText: `${mainnetTokens.cake.symbol} token is at the heart of the AGS Finance ecosystem. Buy it, farm it, spend it, stake it... heck, you can even vote with it!`,
  reverse: false,
  primaryButton: {
    to: `/swap?outputCurrency=${mainnetTokens.cake.address}`,
    text: `Buy ${mainnetTokens.cake.symbol}`,
    external: false,
  },
  secondaryButton: {
    to: 'https://agsfinance.gitbook.io/docs/tokenomics/usdags',
    text: 'Learn',
    external: true,
  },

  images: {
    path: '/images/home/cake/',
    attributes: [
      { src: 'bottom-right', alt: 'Small 3d ags' },
      { src: 'top-right', alt: 'Small 3d ags' },
      { src: 'AGS', alt: 'AGS token' },
      { src: 'top-left', alt: 'Small 3d ags' },
    ],
  },
}
