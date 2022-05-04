import React from 'react'
import { Text, TooltipText, useTooltip } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import Balance from 'components/Balance'
import { mainnetTokens } from 'config/constants/tokens'

interface RecentCakeProfitBalanceProps {
  cakeToDisplay: number
  dollarValueToDisplay: number
  dateStringToDisplay: string
}

const RecentCakeProfitBalance: React.FC<RecentCakeProfitBalanceProps> = ({
  cakeToDisplay,
  dollarValueToDisplay,
  dateStringToDisplay,
}) => {
  const { t } = useTranslation()

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      <Balance fontSize="16px" value={cakeToDisplay} decimals={3} bold unit={` ${mainnetTokens.cake.symbol}`} />
      <Balance fontSize="16px" value={dollarValueToDisplay} decimals={2} bold prefix="~$" />
      {t('Earned since your last action')}
      <Text>{dateStringToDisplay}</Text>
    </>,
    {
      placement: 'bottom-end',
    },
  )

  return (
    <>
      {tooltipVisible && tooltip}
      <TooltipText ref={targetRef} small>
        <Balance fontSize="14px" value={cakeToDisplay} />
      </TooltipText>
    </>
  )
}

export default RecentCakeProfitBalance
