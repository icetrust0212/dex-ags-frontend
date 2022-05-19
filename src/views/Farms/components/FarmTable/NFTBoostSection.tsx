import React, { useState, useEffect } from 'react'
import { Flex, Text, useModal } from '@pancakeswap/uikit'
import { mainnetTokens } from 'config/constants/tokens'
import styled from 'styled-components'
import { getAGSNFTContract } from 'utils/contractHelpers'
import axios from 'axios'
import NFTModal from '../NFTModal'

interface Props {
  farm: any
}

const Slot = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 12px;
  border: 3px solid ${({ theme }) => theme.colors.primary};
  padding: 2px;
  cursor: pointer;
  :hover {
    box-shadow: 0px 0px 5px 4px #d2a1ed;
  }
  img {
    border-radius: 10px;
  }
`

const CustomFlex = styled(Flex)`
  width: 100%;
  ${({ theme }) => theme.mediaQueries.xl} {
    width: 70%;
  }
`

const NFTBoostSection = ({ farm }: Props) => {
  const nfts = farm?.userData?.nfts
  const poolId = farm?.pid

  console.log('nfts: ', nfts)
  const [arts, setArts] = useState<any[]>([])

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    const nftContract = getAGSNFTContract()

    const getNFTArts = async () => {
      let tokenIds = nfts.tokenIds && nfts.tokenIds !== {} ? nfts.tokenIds : []
      if (tokenIds === {}) tokenIds = []
      console.log('tokenIDs: ', tokenIds)
      const metadatas = await Promise.all(
        tokenIds.map(async (tokenId) => {
          if (tokenId && tokenId !== '0') {
            const uri = await nftContract.tokenURI(tokenId)
            return uri
          }
          return ''
        }),
      )

      const _arts = await Promise.all(
        metadatas?.map(async (metadata: any) => {
          const img = metadata ? (await axios.get(metadata)).data.image : '/images/farms/unknown-nft.png'
          return img
        }),
      )

      setArts(_arts)
    }

    getNFTArts()
  }, [])

  const [slotNum, setSlotNum] = useState(0)
  const [isShow, setShow] = useState(false)

  // const [onPresentDeposit] = useModal(
  // )

  const handleSlotClick = (slotId: number) => {
    setSlotNum(slotId)
    // onPresentDeposit()
    setShow(true)
  }

  return (
    <>
      <CustomFlex width="fit-content" mt="20px" flexWrap="wrap" justifyContent="space-between" style={{ gap: '30px' }}>
        <Flex flexDirection="column">
          <Text>Stake AGS NFTs to increase {mainnetTokens.cake.symbol} earnings</Text>
          <Flex alignItems="center">
            <Text>Current Boost Rate: </Text>
            <Text ml="15px" fontSize="28px">
              +{nfts.boosts.toJSON()}%
            </Text>
          </Flex>
        </Flex>
        <Flex justifyContent="space-between" style={{ gap: '20px' }}>
          {arts.map((art, index) => (
            /* eslint-disable react/no-array-index-key */
            <Slot key={`nftslot-${index}`} onClick={() => handleSlotClick(index)}>
              <img src={art} alt="slot" />
            </Slot>
          ))}
        </Flex>
      </CustomFlex>
      <NFTModal nfts={nfts} slotNumber={slotNum} poolId={poolId} isShow={isShow} onDismiss={() => setShow(false)} />
    </>
  )
}

export default NFTBoostSection
