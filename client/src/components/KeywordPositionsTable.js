import { Button } from '@chakra-ui/button';
import { Box } from '@chakra-ui/layout';
import {
  Table,
  TableCaption,
  Tbody,
  Th,
  Thead,
  Tr,
  Td,
  Tfoot,
} from '@chakra-ui/table';
import React from 'react';
import createMatrix from '../utils/createMatrix';
import extractKeywords from '../utils/extractKeywords';
import extractPages from '../utils/extractPages';
import { flexStyles } from '../utils/flex';
import getUrlPath from '../utils/getUrlPath';

export default function KeywordPositionsTable({
  keywordPositions,
  setToggleTable,
}) {
  const pages = extractPages(keywordPositions);
  const keywords = extractKeywords(keywordPositions);
  const matrix = createMatrix(keywordPositions, pages, keywords);
  return (
    <Box
      sx={{
        ...flexStyles,
        overflow: 'auto',
        width: '80vw',
        flexDirection: 'row',
      }}
    >
      <Box
        sx={{
          ...flexStyles,
        }}
      >
        <Box
          sx={{
            ...flexStyles,
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'flex-end',
            gap: 2.5,
          }}
        >
          <Button
            variant="outline"
            color="blue"
            onClick={() => setToggleTable()}
          >
            {'Return to Search'}
          </Button>
        </Box>
        <Table>
          <TableCaption>{'Keywords & Positions'}</TableCaption>
          <Thead>
            <Tr>
              {pages.map((page, index) => (
                <React.Fragment key={index}>
                  <Th>{getUrlPath(page)}</Th>
                </React.Fragment>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {keywords.map((_, index) => (
              <React.Fragment key={index}>
                <Tr>
                  <Td sx={{ width: 225 }}>{matrix[index]}</Td>
                </Tr>
              </React.Fragment>
            ))}
          </Tbody>
          <Tfoot>
            <Tr>
              {pages.map((page, index) => (
                <React.Fragment key={index}>
                  <Th>{getUrlPath(page)}</Th>
                </React.Fragment>
              ))}
            </Tr>
          </Tfoot>
        </Table>
      </Box>
    </Box>
  );
}
