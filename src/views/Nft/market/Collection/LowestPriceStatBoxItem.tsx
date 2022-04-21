import React, { useEffect, useState } from 'react'
import { useTranslation } from 'contexts/Localization'
import { getLowestPriceInCollection } from 'state/nftMarket/helpers'
import { StatBoxItem, StatBoxItemProps } from '../components/StatBox'
import { NATIVE_CURRENCY } from 'config/constants/tokens'

interface LowestPriceStatBoxItemProps extends Omit<StatBoxItemProps, 'title' | 'stat'> {
  collectionAddress: string
}

const LowestPriceStatBoxItem: React.FC<LowestPriceStatBoxItemProps> = ({ collectionAddress, ...props }) => {
  const [lowestPrice, setLowestPrice] = useState<number>(null)
  const { t } = useTranslation()

  useEffect(() => {
    const fetchLowestPrice = async () => {
      const lowestCollectionPrice = await getLowestPriceInCollection(collectionAddress)
      setLowestPrice(lowestCollectionPrice)
    }

    fetchLowestPrice()
  }, [collectionAddress, setLowestPrice])

  const formattedLowestPrice =
    lowestPrice === null
      ? null
      : lowestPrice.toLocaleString(undefined, {
          minimumFractionDigits: 3,
          maximumFractionDigits: 3,
        })

  return (
    <StatBoxItem
      title={t('Lowest (%symbol%)', { symbol: NATIVE_CURRENCY.symbol })}
      stat={formattedLowestPrice}
      {...props}
    />
  )
}

export default LowestPriceStatBoxItem
