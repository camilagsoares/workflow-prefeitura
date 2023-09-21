import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import Paper from '@mui/material/Paper';
import MenuOpen from '@mui/icons-material/MenuOpenOutlined';
import Visibility from '@mui/icons-material/VisibilityOutlined';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import { Skeleton } from '@mui/material';
import { useApiRequestGet } from '../../../../services/api';
import React, { useState, useContext,useEffect } from 'react';
import EditOutlined from '@mui/icons-material/EditOutlined';
import Pagination from '@mui/material/Pagination'
const Lista = (props) => {
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  const TableRowsLoaderSkeleton = ({ rowsNum }) => {
    return [...Array(rowsNum)].map((row, index) => (
      <TableRow key={index.id}>
        <StyledTableCell component='th' scope='row'>
          <Skeleton animation='wave' variant='text' height={36} />
        </StyledTableCell>
        <StyledTableCell>
          <Skeleton animation='wave' variant='text' height={36} />
        </StyledTableCell>
        <StyledTableCell>
          <Skeleton animation='wave' variant='text' height={36} />
        </StyledTableCell>
        <StyledTableCell>
          <Skeleton animation='wave' variant='text' height={36} />
        </StyledTableCell>
        <StyledTableCell>
          <Skeleton animation='wave' variant='text' height={36} />
        </StyledTableCell>
      </TableRow>
    ));
  };

  const { data, error, loading } = useApiRequestGet(`/processos-licitatorios`);
  
  console.log('licitacoes', data);
  
  const { searchTerm } = props;

  const [pageNumber, setPageNumber] = useState(0);
  const projectsPerPage = 6;
  const pagesVisited = pageNumber * projectsPerPage;

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  useEffect(() => {
    setPageNumber(0);
  }, [data]);

  const dataIsValid = Array.isArray(data) && !isNaN(projectsPerPage);

  return (
    <React.Fragment>
      {error && (
        <Box display='flex' flexDirection='row' gap={4} color='red' fontSize={14}>
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </Box>
      )}
      <Box marginY={1} paddingY={2}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label='customized table'>
            <TableHead>
              <StyledTableRow>
                <StyledTableCell align='left' width={256}>
                  Desc.Resum.
                </StyledTableCell>
                <StyledTableCell width={256}>N° licitação</StyledTableCell>
                <StyledTableCell width={256}>N°  Compras</StyledTableCell>
                <StyledTableCell align='left' width={256}>
                  Departamento
                </StyledTableCell>
                <StyledTableCell align='center' width={96}>
                Detalhes
                </StyledTableCell>
                <StyledTableCell align='center' width={256}>
                 Atualizar Projeto
                </StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRowsLoaderSkeleton rowsNum={5} />
              ) : (
                data?.slice(pagesVisited, pagesVisited + projectsPerPage).map((row) => {
                  // if (
                  //   (!searchTerm ||
                  //     row.licinome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  //     row.idSonner.toString().includes(searchTerm) || 
                  //     row.numeroCompras.toString().includes(searchTerm) || 
                  //     row.depNome.toLowerCase().includes(searchTerm.toLowerCase()))
                  // )  
                  {
                    return (
                      <StyledTableRow key={row?.id}>
                        <StyledTableCell align='left'>{row.titulo}</StyledTableCell>
                        <StyledTableCell component='th' scope='row'>
                          {row.idSonner}
                        </StyledTableCell>
                        <StyledTableCell component='th' scope='row'>
                          {row.descricao}
                        </StyledTableCell>
                        <StyledTableCell align='left'>{row.etapa[0]?.departamento?.nome}</StyledTableCell>
                        <StyledTableCell align='center'>
                          <Tooltip title='Detalhes' arrow>
                            <IconButton
                              edge='start'
                              color='inherit'
                              aria-label='open modal details'
                              onClick={() => {
                                props.handleAbrirDrawerView(row?.id);
                              }}
                            >
                              <Visibility color='action' />
                            </IconButton>
                          </Tooltip>
                        </StyledTableCell>
                        <StyledTableCell align='center'>
                          <Tooltip title='Detalhes' arrow>
                            <IconButton
                              edge='start'
                              color='inherit'
                              aria-label='open modal details'
                              onClick={() => {
                                props.handleAbrirEditarProjeto(row?.id);
                              }}
                            >
                              <EditOutlined color='action' />
                            </IconButton>
                          </Tooltip>
                        </StyledTableCell>
                      </StyledTableRow>
                    );
                  }
                  return null;
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      {!loading  && dataIsValid && data.length > 0 && (
       <Box display="flex" justifyContent="end" mt={2} >
       <Pagination
        color="primary"
         count={Math.ceil(data?.length / projectsPerPage)}
         page={pageNumber + 1}
         onChange={(event, page) => {
           changePage({ selected: page - 1 });
         }}
         variant="outlined"
         shape="rounded"
       />
     </Box>
      )}
    </React.Fragment>
  );
};

Lista.propTypes = {
  handleAbrirDrawerView: PropTypes.func.isRequired,
  handleAbrirEditarProjeto: PropTypes.func.isRequired,
  searchTerm: PropTypes.string,
};

Lista.defaultProps = {
  searchTerm: undefined,
};

export default Lista;
