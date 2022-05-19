import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Flex, Text, Button, LinkExternal, CalculateIcon, IconButton, ModalBody, ModalTitle } from '@pancakeswap/uikit'
import { ModalActions, ModalInput } from 'components/Modal'
import { useTranslation } from 'contexts/Localization'
import useToast from 'hooks/useToast'
import { getAGSNFTContract, getMasterchefContract } from 'utils/contractHelpers'
import { getAgsNFTAddress, getMasterChefAddress } from 'utils/addressHelpers'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import Modal from 'react-modal'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import NFTViewer from './NFTViewer'
import useAGSNFTs from '../hooks/useAGSNFTs'

Modal.setAppElement('#root')

const CustomModal = styled(Modal)`
  ${({ theme }) => theme.mediaQueries.xl} {
    min-width: 700px;
  }
  max-width: 800px;
  width: 80%;
`

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    margin: '250px auto',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '1px 1px 10px #786b6b',
    padding: '20px',
  },
  overlay: {
    background: '#452a7a66',
  },
}

const CustomModalTitle = styled(ModalTitle)`
  font-size: 24px;
`

const CustomFlex = styled(Flex)`
  gap: 20px;
  flex-wrap: wrap;
`

interface NFTModalProps {
  onDismiss?: () => void
  nfts: {
    boosts: BigNumber
    slots: any
    tokenIds: any
  }
  slotNumber: number
  poolId: number
  isShow: boolean
}

const NFTModal: React.FC<NFTModalProps> = ({ onDismiss, nfts, slotNumber, poolId, isShow }) => {
  const [val, setVal] = useState('')
  const { toastSuccess, toastError } = useToast()
  const [pendingTx, setPendingTx] = useState(false)
  const { t } = useTranslation()
  console.log('nfts: ', nfts)
  const isDeposit =
    !nfts.slots?.[slotNumber] || nfts.slots?.[slotNumber] === '0x0000000000000000000000000000000000000000'
  const label = isDeposit ? 'Deposit NFT' : 'Withdraw NFT'
  const nftBalances = useAGSNFTs()
  const [isApproved, setApproved] = useState(false)
  const { library, account } = useActiveWeb3React()
  const { callWithGasPrice } = useCallWithGasPrice()

  const [selectedNFT, setSelectedNFT] = useState<number>()

  const handleNFTClick = (id: number) => {
    setSelectedNFT(id)
  }

  const onApprove = async () => {
    const nftContract = getAGSNFTContract(library.getSigner())
    const tx = await callWithGasPrice(nftContract, 'approve', [getMasterChefAddress(), selectedNFT])
    // const tx = await nftContract.approve(getMasterChefAddress(), selectedNFT);
    const receipt = await tx.wait()
    if (receipt.status) {
      toastSuccess(t('Approved!'), t('Your NFT has beed approved successfully.'))
      setApproved(true)
      setPendingTx(false)
    }
  }

  const onDeposit = async () => {
    const masterChef = getMasterchefContract(library.getSigner())
    const tx = await callWithGasPrice(masterChef, 'depositNFT', [
      getAgsNFTAddress(),
      selectedNFT,
      slotNumber + 1,
      poolId,
    ])
    // const tx = await masterChef.depositNFT(getAgsNFTAddress(), selectedNFT, slotNumber + 1, poolId)
    const receipt = await tx.wait()
    if (receipt.status) {
      toastSuccess(t('Deposited!'), t('Your NFT has beed deposited successfully.'))
      onDismiss()
      setPendingTx(false)
    }
  }

  const onWithdraw = async () => {
    const masterChef = getMasterchefContract(library.getSigner())
    const tx = await callWithGasPrice(masterChef, 'withdrawNFT', [slotNumber + 1, poolId])
    console.log('withdraw: ', slotNumber, poolId, library.getSigner())
    // const tx = await masterChef.withdrawNFT(slotNumber + 1, poolId, {
    //   from: account
    // })
    const receipt = await tx.wait()
    if (receipt.status) {
      toastSuccess(t('Withdrawed!'), t('Your NFT has beed withdrawed successfully.'))
      onDismiss()
      setPendingTx(false)
    }
  }

  return (
    <CustomModal
      title={t(`${label} ${slotNumber + 1}`)}
      onDismiss={onDismiss}
      isOpen={isShow}
      style={customStyles}
      onRequestClose={onDismiss}
    >
      <CustomModalTitle>{t(`${label} ${slotNumber + 1}`)}</CustomModalTitle>
      {isDeposit && (
        <ModalBody minHeight="100px" alignItems="center" justifyContent="center">
          <CustomFlex>
            {nftBalances.map((nft, index) => (
              /* eslint-disable react/no-array-index-key */
              <NFTViewer
                nft={nft}
                key={`nftViewer-${index}`}
                handleClick={handleNFTClick}
                isSelected={selectedNFT === nft.id}
              />
            ))}
          </CustomFlex>
        </ModalBody>
      )}
      <ModalActions>
        <Button variant="secondary" onClick={onDismiss} width="100%" disabled={pendingTx}>
          {t('Cancel')}
        </Button>
        <Button
          width="100%"
          disabled={pendingTx || (isDeposit && !selectedNFT)}
          onClick={async () => {
            setPendingTx(true)
            try {
              if (isDeposit) {
                if (!isApproved) {
                  await onApprove()
                } else {
                  await onDeposit()
                }
              } else {
                await onWithdraw()
              }
              // toastSuccess(t('Deposited!'), t('Your NFT has beed deposited successfully.'))
              // onDismiss()
            } catch (e) {
              toastError(
                t('Error'),
                t('Please try again. Confirm the transaction and make sure you are paying enough gas!'),
              )
              setPendingTx(false)
              console.error(e)
            }
          }}
        >
          {isDeposit ? (isApproved ? t('Deposit') : t('Approve')) : t('Withdraw')}
        </Button>
      </ModalActions>
    </CustomModal>
  )
}

export default NFTModal
