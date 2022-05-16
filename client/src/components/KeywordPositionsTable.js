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
import React, { useCallback, useEffect, useRef, useState } from 'react';
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
}) {
  const [filteredValues, setFilteredValues] = useState(keywordPositions);
  const [sortDirection, setSortDirection] = useState(false);
  const { values, handleChange } = useFormHook({ filter: '' });
  const [startIndex, setStartIndex] = useState(0);
  const [slicedData, setSlicedData] = useState([
    ...filteredValues.slice(startIndex, startIndex + 100),
  ]);
  const pages = extractPages(filteredValues);
  const keywords = extractKeywords(slicedData);
  const matrix = createMatrix(filteredValues, pages, keywords);

  const observer = useRef(null);

  const lastElement = useCallback(el => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        console.log('seen...');
        setStartIndex(prev => (prev += 100));
        setSlicedData(prev => {
          return [
            ...prev,
            ...filteredValues.slice(startIndex, startIndex + 100),
          ];
        });
      }
    });
    if (el) observer.current.observe(el);
  });

  useEffect(() => {
    setFilteredValues([...filterValues(keywordPositions, values.filter)]);
    setSlicedData(() => {
      return [...filteredValues.slice(startIndex, startIndex + 100)];
    });
  }, [values.filter, sortDirection, startIndex]);

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
                          setFilteredValues([
                            ...sortNumbers(filteredValues, sortDirection, page),
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
                  <>
                    {keywords.length === index + 1 ? (
                      <Td key={index} ref={lastElement} sx={{ width: 225 }}>
                        {kw}
                      </Td>
                    ) : (
                      <Td key={index} sx={{ width: 225 }}>
                        {kw}
                      </Td>
                    )}
                  </>
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
