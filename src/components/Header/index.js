import { AddIcon, ChevronDownIcon, CloseIcon, HamburgerIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Collapse,
  Flex,
  Grid,
  Icon,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import React from 'react';
import { NavLink as ReachLink, useHistory } from 'react-router-dom';
import { ReactComponent as ConnectImg } from '../../assets/images/icons/connect.svg';
import * as RoutePaths from '../../utils/constants/routings';
import { TOKEN_NAME } from '../../utils/constants/variables';
import UserContext from '../../utils/contexts/User';
import { shortAddress } from '../../utils/helper';
import { metamaskEnabled } from '../../utils/web3Utils';
import Logo from './Logo';
import SearchField from './search';

export default function Header() {
  const { isOpen, onToggle } = useDisclosure();
  const data = React.useContext(UserContext);
  const { address, updateUserData } = data.account;
  const history = useHistory();

  const handleLogout = () => {
    data.account.setAccount({
      address: null,
      ethBalance: 0,
      updateUserData: updateUserData,
    });
  };

  return (
    <Box>
      <Flex
        bg={'#191D1C'}
        color={'white'}
        minH={'74px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={'solid'}
        borderColor={'#191D1C'}
        align={'center'}
      >
        <Flex display={{ base: 'flex', md: 'none' }} pr={5}>
          <IconButton
            onClick={onToggle}
            icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
            variant={'ghost'}
            aria-label={'Toggle Navigation'}
            bgColor="#282828"
            _hover="#282828"
            _focus="#282828"
            _active="#282828"
          />
        </Flex>

        <Flex flex={{ base: 1 }} justify={{ base: 'start', md: 'start' }}>
          <Box textAlign={useBreakpointValue({ base: 'start', md: 'left' })} fontFamily={'heading'}>
            <Logo />
          </Box>
          <Box flex={{ base: 1 }} display={{ base: 'none', md: 'flex' }} pr={5} ml={5}>
            <SearchField />
          </Box>
        </Flex>

        <Flex display={{ base: 'none', md: 'flex' }} alignItems="center" pr={6}>
          <DesktopNav address={address} history={history} />
        </Flex>

        <Stack flex={{ base: 1, md: 0 }} justify={'flex-end'} direction={'row'} spacing={6}>
          {!address ? (
            <>
              {window.ethereum ? (
                <Button
                  leftIcon={<ConnectImg />}
                  variant="outline"
                  colorScheme="black"
                  color="teal.200"
                  onClick={() => {
                    if (window.ethereum) {
                      metamaskEnabled();
                      if (updateUserData) {
                        updateUserData();
                      }
                    }
                  }}
                >
                  Connect to wallet
                </Button>
              ) : (
                <Box minW="150px">
                  <Link
                    href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn"
                    isExternal
                  >
                    Install Metamask
                  </Link>
                </Box>
              )}
            </>
          ) : (
            <>
              <Menu bg="gray.700">
                <MenuButton as={Button} bg="gray.700" colorScheme="black" variant="solid">
                  <AddIcon color="teal.200" />
                </MenuButton>
                <MenuList bg="gray.700">
                  <MenuItem
                    bg="gray.700"
                    _hover={{ bg: 'gray.600' }}
                    _focus={{ bg: 'gray.700' }}
                    onClick={() => history.push(RoutePaths.CREATE_NFT)}
                  >
                    New NFT
                  </MenuItem>
                </MenuList>
              </Menu>
              <Menu>
                <MenuButton>
                  <Box color="teal.200" fontWeight={600}>
                    {shortAddress(address)}
                  </Box>
                </MenuButton>
                <MenuList
                  minW={{ lg: '486px', base: '200px' }}
                  mt={8}
                  padding={6}
                  bg={'#282828'}
                  opacity="0.87"
                  color="white"
                >
                  <Text fontSize={'2xl'} fontWeight={700}>
                    Available balance
                  </Text>

                  <Grid gap={8} pt={4}>
                    <Flex justify="space-between">
                      <Text pr={4}>Available {TOKEN_NAME} balance</Text>
                      <Text fontWeight={600}>
                        {data.account.ethBalance} {TOKEN_NAME}
                      </Text>
                    </Flex>
                    <Button
                      variant="outline"
                      color="teal.200"
                      colorScheme="black"
                      mt={2}
                      onClick={() => handleLogout()}
                    >
                      Log out
                    </Button>
                  </Grid>
                </MenuList>
              </Menu>
            </>
          )}
        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav address={address} />
      </Collapse>
    </Box>
  );
}

const DesktopNav = ({ address, history }) => {
  const linkHoverColor = 'teal.200';

  return (
    <Stack direction={'row'} spacing={4}>
      {NAV_ITEMS.map((navItem) => {
        if (navItem.href === RoutePaths.PROFILE && !address) return false;

        return (
          <Menu isLazy key={navItem.label}>
            <Link
              as={ReachLink}
              exact
              p={2}
              to={{
                pathname:
                  navItem.href === RoutePaths.PROFILE ? `${RoutePaths.PROFILE_PAGE}/${address}` : navItem.href ?? '#',
              }}
              fontSize={'sm'}
              fontWeight={600}
              target={navItem.target}
              // color={linkColor}
              _hover={{
                textDecoration: 'none',
                color: linkHoverColor,
              }}
              activeClassName="active"
              activeStyle={{
                color: '#00FFD1',
              }}
            >
              {navItem.label}
            </Link>
          </Menu>
        );
      })}
    </Stack>
  );
};

const MobileNav = ({ address }) => {
  return (
    <Stack bg="#282828" p={4} display={{ md: 'none' }}>
      {NAV_ITEMS.map((navItem) => {
        if (navItem.href === RoutePaths.PROFILE && !address) return false;
        return <MobileNavItem key={navItem.label} {...navItem} address={address} href={navItem.href} />;
      })}
    </Stack>
  );
};

const MobileNavItem = ({ label, target, children, href, address }: NavItem) => {
  const { isOpen, onToggle } = useDisclosure();
  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={ReachLink}
        target={target}
        to={{ pathname: href === RoutePaths.PROFILE ? `${RoutePaths.PROFILE_PAGE}/${address}` : href }}
        justify={'space-between'}
        align={'center'}
        _hover={{
          textDecoration: 'none',
        }}
      >
        <Text color="white" fontWeight={600}>
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={'all .25s ease-in-out'}
            transform={isOpen ? 'rotate(180deg)' : ''}
            w={6}
            h={6}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={'solid'}
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          align={'start'}
        >
          {children &&
            children.map((child) => (
              <Link key={child.label} py={2} href={child.href}>
                {child.label}
              </Link>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

interface NavItem {
  label: string;
  subLabel?: string;
  children?: Array<NavItem>;
  href?: string;
}

const NAV_ITEMS: Array<NavItem> = [
  {
    label: 'Home',
    href: RoutePaths.HOME,
    target: '_self',
  },
  {
    label: 'My profile',
    href: RoutePaths.PROFILE,
    target: '_self',
  },
  {
    label: 'FAQ',
    href: 'https://lib.moonrabbit.com/',
    target: '_blank',
  },
];
