import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Pair } from '@pancakeswap/sdk'
import { Text, Flex, CardBody, CardFooter, Button, AddIcon } from '@pancakeswap/uikit'
import { Link } from 'react-router-dom'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { ToastDescriptionWithTx } from 'components/Toast'
import useToast from 'hooks/useToast'
import { getExchangeContract, getMasterchefContract } from 'utils/contractHelpers'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { BIG_ZERO } from 'utils/bigNumber'

// import { useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks'
import BigNumber from 'bignumber.js'
import { EnableStatus } from 'views/Ifos/components/IfoFoldableCard/types'
import useTokenBalance, { FetchStatus } from 'hooks/useTokenBalance'
import { useTranslation } from 'contexts/Localization'
import useIfoApprove from 'views/Ifos/hooks/useIfoApprove'
import { useTokenContract } from 'hooks/useContract'
import { getExchangeAddress } from 'utils/addressHelpers'
import useIfoAllowance from 'views/Ifos/hooks/useIfoAllowance'
import { getBalanceAmount } from 'utils/formatBalance'
import { AppHeader, AppBody } from '../../components/App'
import Dots from '../../components/Loader/Dots'
import Page from '../Page'

const Body = styled(CardBody)`
  background-color: ${({ theme }) => theme.colors.dropdownDeep};
`

const NewTokenExchange = () => {
  const { t } = useTranslation()
  const { account, library } = useActiveWeb3React()
  const [enableStatus, setEnableStatus] = useState(EnableStatus.DISABLED)

  const oldTokenAddress = '0x233729E6A3A5DA3Cf6ee5c2B85C56ab3997FD001'

  const oldTokenBalanceState = useTokenBalance(oldTokenAddress)
  console.log('oldTokenBalance: ', oldTokenBalanceState?.balance?.toJSON())
  const oldTokenContract = useTokenContract(oldTokenAddress, true)

  const exchangeContract = getExchangeContract(library?.getSigner())
  const onApprove = useIfoApprove(oldTokenContract, getExchangeAddress())

  const { callWithGasPrice: onSwap } = useCallWithGasPrice()
  const { toastSuccess, toastWarning } = useToast()

  const handleApprove = async () => {
    try {
      setEnableStatus(EnableStatus.IS_ENABLING)

      const receipt = await onApprove()

      setEnableStatus(EnableStatus.ENABLED)
      toastSuccess(
        t('Successfully Enabled!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('You approved old token successfully.')}
        </ToastDescriptionWithTx>,
      )
    } catch (error) {
      setEnableStatus(EnableStatus.DISABLED)
    }
  }

  useEffect(() => {
    const checkAllowance = async () => {
      try {
        const response = await oldTokenContract.allowance(account, exchangeContract.address)
        const currentAllowance = new BigNumber(response.toString())
        console.log('currentAllowance: ', currentAllowance.toJSON())
        setEnableStatus(currentAllowance.lte(0) ? EnableStatus.DISABLED : EnableStatus.ENABLED)
      } catch (error) {
        setEnableStatus(EnableStatus.DISABLED)
      }
    }

    if (account) {
      checkAllowance()
    }
  }, [account, oldTokenContract, exchangeContract, setEnableStatus])

  const handleSwap = async () => {
    if (oldTokenBalanceState.balance.lte(0)) {
      toastWarning('You have no old token')
      return
    }

    try {
      setEnableStatus(EnableStatus.IS_ENABLING)

      const tx = await onSwap(exchangeContract, 'swap', [oldTokenBalanceState.balance.toString()])
      const status = await tx.wait()

      setEnableStatus(EnableStatus.ENABLED)
      toastSuccess(
        t('Successfully Enabled!'),
        <ToastDescriptionWithTx txHash={status.transactionHash}>
          {t('You swapped old token successfully.')}
        </ToastDescriptionWithTx>,
      )
    } catch (error) {
      setEnableStatus(EnableStatus.DISABLED)
    }
  }

  const renderBody = () => {
    if (!account) {
      return (
        <Text color="textSubtle" textAlign="center">
          {t('Connect to a wallet to view your old $AGS.')}
        </Text>
      )
    }

    if (enableStatus === EnableStatus.IS_ENABLING) {
      return (
        <Text color="textSubtle" textAlign="center">
          <Dots>{t('Loading')}</Dots>
        </Text>
      )
    }
    if (enableStatus === EnableStatus.DISABLED) {
      return (
        <Flex justifyContent="center" flexDirection="column">
          <Text mb="10px">{getBalanceAmount(oldTokenBalanceState?.balance, 18).toString()}</Text>
          <Button onClick={handleApprove}>Approve</Button>
        </Flex>
      )
    }

    // if (allowance > BIG_ZERO) {
    return (
      <Flex justifyContent="center" flexDirection="column">
        <Text mb="10px">{getBalanceAmount(oldTokenBalanceState?.balance, 18).toString()}</Text>
        <Button onClick={handleSwap}>Exchange</Button>
      </Flex>
    )
    // }
  }

  return (
    <Page>
      <AppBody>
        <AppHeader title="Token Exchange" subtitle="Please exchange old AGS token with new one" />
        <Body>{renderBody()}</Body>
      </AppBody>
    </Page>
  )
}

export default NewTokenExchange
