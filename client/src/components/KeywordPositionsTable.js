import { Button, IconButton } from '@chakra-ui/button';
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
import React, { useEffect, useState } from 'react';
import createMatrix from '../utils/createMatrix';
import extractKeywords from '../utils/extractKeywords';
import extractPages from '../utils/extractPages';
import { flexStyles } from '../utils/flex';
import getUrlPath from '../utils/getUrlPath';
import sortNumbers from '../utils/sortNumbers';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';
import FilterInput from './FilterInput';
import useFormHook from '../hooks/useFormHook';
import filterValues from '../utils/filterValues';

export default function KeywordPositionsTable({
  keywordPositions,
  setToggleTable,
  setKeywordPositions,
}) {
  const [filteredValues, setFilteredValues] = useState(keywordPositions);
  const pages = extractPages(filteredValues);
  const keywords = extractKeywords(filteredValues);
  const matrix = createMatrix(filteredValues, pages, keywords);
  const [sortDirection, setSortDirection] = useState(false);
  const { values, handleChange } = useFormHook({ filter: '' });

  useEffect(() => {
    setFilteredValues(filterValues(keywordPositions, values.filter));
  }, [values.filter]);

  return (
    <Box
      sx={{
        ...flexStyles,
        overflow: 'auto',
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
          <FilterInput
            name={'filter'}
            value={values.filter}
            onChange={handleChange}
            placeholder={'Filter...'}
          />
        </Box>
        <Table>
          <TableCaption>{'Keywords & Positions'}</TableCaption>
          <Thead>
            <Tr>
              <Th>Keyword</Th>
              {pages.map((page, index) => (
                <React.Fragment key={index}>
                  <Th>
                    <Box
                      sx={{
                        ...flexStyles,
                        height: '100%',
                        flexDirection: 'row',
                        gap: 4,
                      }}
                    >
                      {getUrlPath(page)}
                      <IconButton
                        aria-label="Sort"
                        size={'xs'}
                        colorScheme={sortDirection ? 'red' : 'teal'}
                        onClick={() => {
                          setSortDirection(prev => !prev);
                          setKeywordPositions([
                            ...sortNumbers(
                              keywordPositions,
                              sortDirection,
                              page
                            ),
                          ]);
                        }}
                        icon={
                          sortDirection ? <FaChevronUp /> : <FaChevronDown />
                        }
                      />
                    </Box>
                  </Th>
                </React.Fragment>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {keywords.map((kw, index) => (
              <React.Fragment key={index}>
                <Tr>
                  <Td sx={{ width: 350 }}>{kw}</Td>
                  {matrix[index].map((pos, idx) => (
                    <Td key={idx} sx={{ width: 225 }}>
                      {pos}
                    </Td>
                  ))}
                </Tr>
              </React.Fragment>
            ))}
          </Tbody>
          <Tfoot>
            <Tr>
              <Th>Keyword</Th>
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
