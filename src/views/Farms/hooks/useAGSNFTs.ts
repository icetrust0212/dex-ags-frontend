import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useEffect, useState } from 'react'
import { getAgsNFTAddress } from 'utils/addressHelpers'
import { getAGSNFTContract } from 'utils/contractHelpers'
import multicall, { multicallv2 } from 'utils/multicall'
import agsNFTAbi from 'config/abi/AgsNFT.json'

const useAGSNFTs = () => {
  const { library, account } = useActiveWeb3React()
  const [ownedNFTs, setOwnedNFTs] = useState([])

  useEffect(() => {
    const nftContract = getAGSNFTContract()
    const getOwnedNFTs = async () => {
      try {
        const totalCount = await nftContract.totalSupply()
        const ids = []
        const totalIds = []
        for (let i = 1; i <= totalCount; i++) {
          totalIds.push(i)
        }

        const calls = totalIds.map((i) => ({
          address: getAgsNFTAddress(),
          name: 'ownerOf',
          params: [i],
        }))

        const owners = await multicallv2(agsNFTAbi, calls)
        /* eslint-disable array-callback-return */
        owners.map((owner, index) => {
          if (owner[0] === account) {
            ids.push(index + 1)
          }
        })

        const metadataCalls = ids.map((i) => ({
          address: getAgsNFTAddress(),
          name: 'tokenURI',
          params: [i],
        }))

        const metadatas = await multicallv2(agsNFTAbi, metadataCalls)

        const _ownedNFTs = ids.map((id, index) => ({
          id,
          metadata: metadatas?.[index]?.[0],
        }))
        setOwnedNFTs(_ownedNFTs)
      } catch (e) {
        setOwnedNFTs([])
      }
    }

    getOwnedNFTs()
  }, [account])

  return ownedNFTs
}

export default useAGSNFTs
