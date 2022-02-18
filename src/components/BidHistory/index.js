import { TimeIcon } from '@chakra-ui/icons';
import { Avatar, Box, Flex, Table, TableCaption, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import Web3 from 'web3';
import Pagination from '../../ui-kit/Pagination/index';
import * as RoutePaths from '../../utils/constants/routings';
import { rpcUrl, TOKEN_NAME } from '../../utils/constants/variables';
import { shortAddress } from '../../utils/helper';

const web3 = new Web3(rpcUrl);

const BidsHistory = ({ bidsProps, account }) => {
  const [pagination, setPagination] = useState({
    currentBids: bidsProps,
    currentPage: null,
    totalPages: null,
    totalCount: bidsProps.length,
  });
  const [bidsInfo, setBidsInfo] = useState({ bids: null, totalBids: 0 });
  const pageLimit = 8;
  let history = useHistory();

  useEffect(() => {
    if (bidsProps.length > 0) {
      setBidsInfo({ bids: bidsProps, totalBids: bidsProps.length });
    }
  }, [bidsProps]);

  useEffect(() => {
    onPageChanged({ currentPage: 1 });
  }, [bidsInfo]);

  const onPageChanged = (data) => {
    const { currentPage, totalPages } = data;
    const offset = (currentPage - 1) * pageLimit;
    const currentBids = bidsProps.slice(offset, offset + pageLimit);
    const totalCount = bidsProps.length;

    setPagination({
      currentBids,
      currentPage,
      totalPages,
      totalCount,
    });
  };

  if (pagination.currentBids.length === 0) return null;

  return (
    <>
      <Box bg={'#282828'} borderRadius="12px" overflow="hidden">
        <Table size="sm">
          <Thead bgColor="gray.50" height="40px" bg="#191d1c">
            <Tr>
              <Th borderColor="transparent">
                <Flex justifyItems="center" color="white">
                  <Box pr={1}>
                    <TimeIcon color="gray.700" />{' '}
                  </Box>
                  PREVIOUS BIDS
                </Flex>
              </Th>
              <Th borderColor="transparent"></Th>
            </Tr>
          </Thead>
          <Tbody bg={'#282828'} opacity="0.87" color="white">
            {pagination.currentBids.map((bid) => (
              <Tr key={bid.id}>
                <Td borderColor="gray.700">
                  <Box display="flex" alignItems="center">
                    <Avatar size="md" src="https://bit.ly/broken-link" />
                    <Box ml="3">
                      <Text
                        fontWeight={500}
                        fontSize={10}
                        cursor="pointer"
                        onClick={() => history.push(`${RoutePaths.PROFILE_PAGE}/${bid.returnValues.bidder}`)}
                      >
                        {shortAddress(bid.returnValues.bidder)}
                        {bid.returnValues.bidder === account && '(YOU)'}
                      </Text>
                      <Text color="gray.400" fontSize="sm">
                        {bid.returnValues.date}
                      </Text>
                    </Box>
                  </Box>
                </Td>
                <Td textAlign="end" borderColor="gray.700">
                  {web3.utils.fromWei(bid.returnValues.amount)} {TOKEN_NAME}
                </Td>
              </Tr>
            ))}
          </Tbody>
          {pagination.totalCount > pageLimit && (
            <TableCaption height="55px" width="100%">
              <Pagination
                totalRecords={pagination.totalCount}
                pageLimit={pageLimit}
                pageNeighbours={0}
                onPageChanged={onPageChanged}
              />
            </TableCaption>
          )}
        </Table>
      </Box>
    </>
  );
};

export default BidsHistory;
