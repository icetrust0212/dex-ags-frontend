import React, { useEffect, useState } from 'react'
import axios from 'axios'
import styled from 'styled-components'
import { Card, CardRibbon } from '@pancakeswap/uikit'

const NFTViewer = ({ nft, handleClick, isSelected }: PropsType) => {
  const [imgUrl, setImgUrl] = useState('')

  const getRibbon = () => {
    if (!isSelected) return null

    return (
      <CardRibbon variantColor="primary" ribbonPosition="left" style={{ textTransform: 'uppercase' }} text="Selected" />
    )
  }
  const ribbon = getRibbon()
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    axios.get(nft.metadata).then((res) => setImgUrl(res.data.image))
  }, [])

  return (
    <NFTViewerWrapper ribbon={ribbon}>
      <Img src={imgUrl} alt="nftviewer" onClick={() => handleClick(nft.id)} />
    </NFTViewerWrapper>
  )
}

interface PropsType {
  nft: {
    id: number
    metadata: string
  }
  handleClick: (id: number) => void
  isSelected: boolean
}

const Img = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 24px;
  border-width: 2px;
  border-color: #1d6db5;
  border-style: solid;
  :hover {
    box-shadow: 0px 0px 5px 4px #d2a1ed;
  }
`

const NFTViewerWrapper = styled(Card)``

export default NFTViewer
