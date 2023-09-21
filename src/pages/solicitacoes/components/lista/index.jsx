import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import EditOutlined from '@mui/icons-material/EditOutlined';
import MenuOpen from '@mui/icons-material/MenuOpenOutlined';
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined';
import { Stack } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import { useApiRequestGet } from '../../../../services/api';
import { formatarValorToMonetario } from '../../../../utils';
import { Button } from '@mui/material';
import { AuthContext } from '../../../../contexts/auth.context';
import Pagination from '@mui/material/Pagination';
import "./styles.css"

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
      <TableRow key={index}>
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
        <StyledTableCell>
          <Skeleton animation='wave' variant='text' height={36} />
        </StyledTableCell>
      </TableRow>
    ));
  };
  const { clickedProjectIds } = props;
  const { projetosConcluidos } = props;
  const { searchTerm } = props;
  const {    setConcludedProjects } = props;
  const { data, loading } = useApiRequestGet('/projetos');
  // console.log('projetos do useApiRequestGet', data);

  const { token, session } = useContext(AuthContext);
  // console.log(session?.permissao.id);
  const permissaoId = session?.permissao.id;

  const isUsuarioCompras = session?.permissao.id === 2;

  // statusId === 2

  const { projetosSelecionadoVisualizar } = props;
  const { projetosComBordaVerde } = props;
  // console.log('projeto selecionado', projetosSelecionadoVisualizar);

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

  const [filteredData, setFilteredData] = useState(data);
  useEffect(() => {
    if (searchTerm) {
      const filtered = data.filter((projeto) => {
        const valor = String(projeto.valor); // Convert to string if it's not
        return (
          projeto.idSonner.toString().includes(searchTerm) ||
          projeto?.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          projeto?.etapa[0]?.departamento?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          projeto?.tipoProjeto?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          valor.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [data, searchTerm]);

  //TESTE BORDA VERDE


  return (
    <React.Fragment>
      <Box marginY={1} paddingY={2}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label='customized table'>
            <TableHead>
              <StyledTableRow>
                {session?.permissao.id === 2 && (
                  <StyledTableCell align='left' width={112}>
                    Incluir
                  </StyledTableCell>
                )}

                <StyledTableCell align='left' width={112}>
                  N° Sonner
                </StyledTableCell>
                <StyledTableCell width={192}>Descrição resumida</StyledTableCell>
                <StyledTableCell align='left' width={180}>
                  Departamento
                </StyledTableCell>
                <StyledTableCell align='left' width={96}>
                  Tipo Solicitação
                </StyledTableCell>
                <StyledTableCell align='right' width={96}>
                  Valor
                </StyledTableCell>
                <StyledTableCell align='center' width={128}>
                  <MenuOpen />
                </StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody
            >
              {loading ? (
                <TableRowsLoaderSkeleton rowsNum={5} />
              ) : (
                filteredData
                  ?.slice(pagesVisited, pagesVisited + projectsPerPage)
                  .map((projeto) => (
                    <StyledTableRow key={projeto?.id} >
                      {session?.permissao.id === 2 && (
                        <StyledTableCell align='left'   >
                          <Button variant='contained' onClick={() => props.handleIncluirClick(projeto?.idSonner, 'incluir')}>
                            {clickedProjectIds.includes(projeto?.idSonner) ? 'Remover' : 'Incluir'}
                          </Button>
                        </StyledTableCell>
                      )}
                      <StyledTableCell align='left' className="first-column">{projeto?.idSonner}</StyledTableCell>
                      <StyledTableCell component='th' scope='row' >
                        {projeto?.titulo}
                      </StyledTableCell>
                      <StyledTableCell align='left'>{projeto?.etapa[0]?.departamento?.nome}</StyledTableCell>
                      <StyledTableCell align='left'>{projeto?.tipoProjeto?.nome}</StyledTableCell>
                      <StyledTableCell align='right'>{formatarValorToMonetario(projeto?.valor)}</StyledTableCell>
                      <StyledTableCell align='center'>
                        <Stack direction='row' spacing={1} flex alignItems='center' justifyContent='flex-end'>
                          <Tooltip title='Detalhes' arrow>
                            <IconButton
                              edge='start'
                              color='inherit'
                              aria-label='open modal details'
                              onClick={() => {
                                props.handleAbrirDrawerView(projeto?.id);
                              }}
                            >
                              <VisibilityOutlined fontSize='small' color='action' />
                            </IconButton>
                          </Tooltip>
                          {projeto?.etapa[0]?.statusId !== 2 && (
                            <Tooltip title='Editar' arrow>
                              <IconButton
                                edge='start'
                                color='inherit'
                                aria-label='open modal edit register'
                                onClick={() => {
                                  props.handleAbrirEditarProjeto(projeto?.id);
                                }}
                              >
                                <EditOutlined fontSize='small' color='action' />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Stack>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      {!loading && dataIsValid && data.length > 0 && (
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
  handleIncluirClick: PropTypes.func.isRequired,
  handleAbrirEditarProjeto: PropTypes.func.isRequired,
  searchTerm: PropTypes.string,
  // setSelectedStatus: PropTypes.string,
};

Lista.defaultProps = {
  searchTerm: undefined,
  // setSelectedStatus: undefined,
};
export default Lista;
