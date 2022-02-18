import { Box } from '@chakra-ui/layout';
import { Avatar, Badge, Flex, Image, Skeleton, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useHistory, useParams } from 'react-router';
import AvatarSrc from '../../assets/images/avatar-1.png';
import BackgroundSrc1280 from '../../assets/images/header-1280.png';
import BackgroundSrc1920 from '../../assets/images/header-1920.png';
import BackgroundSrc2560 from '../../assets/images/header-2560.png';
import TokenList from '../../components/TokenList/index';
import * as RoutePaths from '../../utils/constants/routings';
import { rabbitsCollectionContractAddress } from '../../utils/constants/variables';
import { shortAddress } from '../../utils/helper';
import useTokenCollectionList from '../../utils/hooks/useTokenCollectionList';
import { ipfsUrl } from '../../utils/ipfs';
import { InfoWrapper } from '../NFT/styled-ui';

const CollectionDetails = () => {
  let history = useHistory();
  const { address } = useParams();

  const [imageLoaded, setImageLoaded] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [query, setQuery] = useState('');
  const { tokens, count, collection, hasMore, loading, error } = useTokenCollectionList({ query, pageNumber, address });

  const handleSortMenu = async (value) => {
    setQuery(value);
    setPageNumber(1);
  };

  const isRabbitCollection = rabbitsCollectionContractAddress === address;

  const rabbitCollection = {
    name: 'Rad Rabbits',
    description:
      'Rad Rabbits is an exclusive collection of 8888 AI-Generated NFT Avatars living on the Moon Rabbit Metachain. Each Rabbit sports it’s own unique personality and is cursed with a limited lifespan. Care for them and deliver them from old age, or let them wither away and perish for your own amusement. Let’s get Radical!',
    symbol: 'RRC',
    avatarImg: AvatarSrc,
    backgraundImg:
      collection && !isRabbitCollection && collection.BackgroundURI !== ''
        ? ipfsUrl + collection.BackgroundURI.replace('ipfs://', '')
        : {
            md: BackgroundSrc1280,
            xl: BackgroundSrc1920,
            '2xl': BackgroundSrc2560,
          },
  };

  return (
    <>
      {collection && (
        <>
          <Helmet>
            <title>
              {!isRabbitCollection
                ? collection.Name + ' Moon Rabbit NFT Marketplace'
                : rabbitCollection.name + ' Moon Rabbit NFT Marketplace'}
            </title>
            <meta name="description" content={collection.Description} />
            <meta property="og:title" content={collection.Name + ' Moon Rabbit NFT Marketplace'} />
            <meta property="og:description" content={collection.Description} />

            <meta
              property="og:image"
              content={
                !isRabbitCollection && collection.BackgroundURI !== ''
                  ? ipfsUrl + collection.BackgroundURI.replace('ipfs://', '')
                  : rabbitCollection.backgraundImg
              }
            />
          </Helmet>
          <Box position="relative">
            {!imageLoaded && !isRabbitCollection && <Skeleton h={280} borderRadius="4px" justifySelf="center" />}
            <Box
              display={imageLoaded || isRabbitCollection ? 'grid' : 'none'}
              bgSize="cover"
              h={280}
              bgPosition="center"
              bgImage={
                !isRabbitCollection && collection.BackgroundURI !== ''
                  ? ipfsUrl + collection.BackgroundURI.replace('ipfs://', '')
                  : rabbitCollection.backgraundImg
              }
            ></Box>
            <Image
              bgPosition="center"
              display={'none'}
              src={
                !isRabbitCollection && collection.BackgroundURI !== ''
                  ? ipfsUrl + collection.BackgroundURI.replace('ipfs://', '')
                  : rabbitCollection.backgraundImg
              }
              layout={'fill'}
              onLoad={() => setImageLoaded(true)}
            />

            <Box maxW="1536px" margin="0 auto" p={10} position="absolute" left={0} right={0} bottom={-120}>
              <Box display="flex" justifyContent="center">
                <Flex maxW="588px" minW={{ base: '100%', lg: '588px' }} pr={4} pl={4}>
                  <InfoWrapper>
                    <Avatar
                      size="xl"
                      src={
                        !isRabbitCollection && collection.AvatarURI !== ''
                          ? ipfsUrl + collection.AvatarURI.replace('ipfs://', '')
                          : rabbitCollection.avatarImg
                      }
                    />
                    <Box ml="3">
                      <Text fontWeight={800} fontSize={24} color="white">
                        {!isRabbitCollection ? collection.Name : rabbitCollection.name}
                      </Text>
                      {tokens && tokens[0] && (
                        <Badge
                          cursor={!isRabbitCollection ? 'pointer' : 'default'}
                          onClick={(e) =>
                            !isRabbitCollection
                              ? history.push({
                                  pathname: `${RoutePaths.PROFILE_PAGE}/${tokens[0].CreatorAddress}`,
                                  state: {
                                    tab: 'nfts',
                                    page: 'home',
                                  },
                                })
                              : e.preventDefault()
                          }
                        >
                          Collection by {!isRabbitCollection ? shortAddress(tokens[0].CreatorAddress) : 'Moon Rabbit'}
                        </Badge>
                      )}

                      <Text color="gray.200" fontSize={12}>
                        {!isRabbitCollection ? collection.Description : rabbitCollection.description}
                      </Text>
                    </Box>
                  </InfoWrapper>
                </Flex>
              </Box>
            </Box>
          </Box>

          <Box pt={{ base: 140, sm: 340, md: 240, lg: 120 }}>
            <Box minH={'300px'} maxW="1536" margin="0 auto" pr={10} pl={10} pb={150}>
              <TokenList
                tokens={tokens}
                handleSort={handleSortMenu}
                loading={loading}
                setPageNumber={setPageNumber}
                hasMore={hasMore}
                address={address}
                error={error}
                headerTitle={`NFTs ${tokens && `(${count})`}`}
                headerVisability
              />
            </Box>
          </Box>
        </>
      )}
    </>
  );
};

export default CollectionDetails;
