import React from 'react'
import { useTranslation } from 'contexts/Localization'
import { Route, useRouteMatch, Link } from 'react-router-dom'
import { ButtonMenu, ButtonMenuItem, Flex, Text } from '@pancakeswap/uikit'
import Container from 'components/Layout/Container'
import styled from 'styled-components'
import Hero from './components/Hero'
import CurrentIfo from './CurrentIfo'
import PastIfo from './PastIfo'

const Ifos = () => {
  const { t } = useTranslation()
  const { path, url, isExact } = useRouteMatch()

  return (
    <Wrapper>
      {/* <Hero /> */}
      <Flex justifyContent="center" alignItems="center" mb="32px" mt="32px">
        <ButtonMenu activeIndex={!isExact ? 1 : 0} scale="sm" variant="subtle">
          <ButtonMenuItem as={Link} to={`${url}`}>
            {t('Next IDO')}
          </ButtonMenuItem>
          <ButtonMenuItem id="past-ifos-button" as={Link} to={`${url}/history`}>
            {t('Past IDO')}
          </ButtonMenuItem>
        </ButtonMenu>
      </Flex>
      <Flex justifyContent="center" alignItems="center" mb="10px" flexWrap="wrap">
        <Text bold fontSize="24px" mr="8px">
          {t('Launchpad')}
        </Text>
        <Text fontSize="18px">Participate In Upcoming Protocols On Astar.</Text>
      </Flex>
      <Route exact path={`${path}`}>
        <CurrentIfo />
      </Route>
      <Route path={`${path}/history`}>
        <PastIfo />
      </Route>
    </Wrapper>
  )
}

const Wrapper = styled.div``

export default Ifos
