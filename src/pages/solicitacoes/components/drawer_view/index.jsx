import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Close from '@mui/icons-material/CloseOutlined';
import { useApiRequestGet,axiosApi } from '../../../../services/api';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import Paper from '@mui/material/Paper';
import MenuOpen from '@mui/icons-material/MenuOpenOutlined';
import AddCircle from '@mui/icons-material/AddCircleOutline';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Pagination from '@mui/material/Pagination';
import React, { useState, useContext,useEffect } from 'react';
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';
import Dialog from '@mui/material/Dialog';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

const DrawerView = (props) => {
  const { projetosSelecionadoVisualizar } = props;
  // const {handleAbrirModalAtualizarEtapaProjeto} = props;
  const { data: listaEtapasProjeto, loading: loadingProjetoSelecionado } = useApiRequestGet(
    `/projetos/${projetosSelecionadoVisualizar}`,
  );

//   console.log("projeto",listaEtapasProjeto)

// console.log("projeto",listaEtapasProjeto?.situacao)
// console.log("projeto", listaEtapasProjeto?.concluidoEm) //inicialmente vem como nullo


  const { data: listaTiposProjeto, loading: loadingTiposProjeto } = useApiRequestGet(
    `/etapas/projeto/${projetosSelecionadoVisualizar}`,
  );
  // console.log('detalhes projeto', listaEtapasProjeto);

  // console.log('ETAPAS PROJETO', listaTiposProjeto);

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

  const [pageNumber, setPageNumber] = useState(0);
  const projectsPerPage = 4;
  const pagesVisited = pageNumber * projectsPerPage;

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  useEffect(() => {
    setPageNumber(0);
  }, [listaTiposProjeto]);

  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const {
    data: status,
  } = useApiRequestGet('/status');


  const { data, loading } = useApiRequestGet('/projetos');
  // console.log('projetos do useApiRequestGet', data);
//concluidoEm


///Concluir projeto
const [concluidoEm, setConcluidoEm] = useState(null);



const dataIsValid = Array.isArray(data) && !isNaN(projectsPerPage);

const concluirProjeto = () => {
 
  console.log("Button clicado em concluir")
};

  return (
    <Drawer anchor='right' open={true} onClose={props.handleFecharDrawerView}>
      <Box width='70vw'>
        <Stack
          direction='row'
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          padding={1.5}
        >
          <Typography component='h5'>Visualizar projeto</Typography>
          <IconButton
            edge='start'
            color='inherit'
            aria-label='close drawer view project'
            onClick={props.handleFecharDrawerView}
          >
            <Close color='action' />
          </IconButton>
        </Stack>
        <Divider />
        {/* 
        {error && (
          <Box display='flex' flexDirection='row' gap={4} color='red' fontSize={14}>
            <pre>{JSON.stringify(error, null, 2)}</pre>
          </Box>
        )} */}

        <Box marginY={1} paddingY={2} paddingX={3}>
          <Typography component='h6' marginBottom={1}>
            Detalhes do Projeto
          </Typography>
          <TableContainer component={Paper}>
            <Table size='small'>
              <TableBody>
                <TableRow>
                {/* <StyledTableCell width={144} variant='head' height={90}>  */}
                  <StyledTableCell width={144} variant='head'>
                    Desc. Resumida
                  </StyledTableCell>
                  <StyledTableCell>{!loadingProjetoSelecionado && listaEtapasProjeto?.titulo}</StyledTableCell>
                </TableRow>
                <TableRow>
                  <StyledTableCell width={144} variant='head'>
                    N° da Solicitação
                  </StyledTableCell>
                  <StyledTableCell>{!loadingProjetoSelecionado && listaEtapasProjeto?.idSonner}</StyledTableCell>
                </TableRow>
                {/* <TableRow>
                  <StyledTableCell width={144} variant='head'>
                    Departamento
                  </StyledTableCell>
                  <StyledTableCell>{!loadingProjetoSelecionado && listaEtapasProjeto?.departamento}</StyledTableCell>
                </TableRow> */}
                <TableRow>
                  <StyledTableCell width={144} variant='head'>
                    Descrição
                  </StyledTableCell>
                  <StyledTableCell>{!loadingProjetoSelecionado && listaEtapasProjeto?.descricao}</StyledTableCell>
                </TableRow>
                <TableRow>
                  <StyledTableCell width={144} variant='head'>
                    Valor
                  </StyledTableCell>
                  <StyledTableCell>{!loadingProjetoSelecionado && listaEtapasProjeto?.valor}</StyledTableCell>
                </TableRow>
                <TableRow>
                  <StyledTableCell width={144} variant='head'>
                    Data
                  </StyledTableCell>
                  <StyledTableCell>{!loadingProjetoSelecionado && listaEtapasProjeto?.observacao}</StyledTableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Stack
            direction='row'
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            paddingY={1.5}
          >
            <Typography component='h6' marginBottom={1}>
              Etapas do projeto
            </Typography>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Button
                startIcon={<DoneOutlinedIcon />}
                variant='outlined'
                color='primary'
                sx={{ marginRight: 1 }}
                // onClick={() => props.handleAbrirModalConcluirProjeto(projetosSelecionadoVisualizar)}

                // onClick={() => {
                //   props.handleAbrirModalConcluirProjeto(projetosSelecionadoVisualizar);
                //   // Adicione o projeto concluído ao estado projetosConcluidos
                //   setProjetosConcluidos([...projetosConcluidos, projetosSelecionadoVisualizar]);
                // }}
                onClick={() => {
                  props.handleAbrirModalConcluirProjeto(projetosSelecionadoVisualizar);
                  // Adicione o projeto concluído ao estado projetosConcluidos
                  // setProjetosConcluidos([...projetosConcluidos, projetosSelecionadoVisualizar]);
                  // setProjetoClicado(projetosSelecionadoVisualizar);
                }}
              >
                Concluir
              </Button>
              <Button
                startIcon={<AddCircle />}
                variant='outlined'
                color='success'
                onClick={() => props.handleAbrirModalAtualizarEtapaProjeto(projetosSelecionadoVisualizar)}
              >
                Nova etapa
              </Button>
            </div>
          </Stack>

          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} size='small' aria-label='customized table'>
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell align='left' width={256}>
                    Data
                  </StyledTableCell>
                  <StyledTableCell align='left' width={256}>
                    Dias corridos
                  </StyledTableCell>
                  <StyledTableCell align='left' width={256}>
                    Departamento
                  </StyledTableCell>
                  <StyledTableCell align='right' width={128}>
                    Status
                  </StyledTableCell>
                  <StyledTableCell align='right' width={128}>
                    Observação
                  </StyledTableCell>
                  <StyledTableCell align='left' width={128}>
                    Usuario
                  </StyledTableCell>
                  <StyledTableCell align='center' width={96}>
                    <MenuOpen />
                  </StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {listaTiposProjeto?.slice(pagesVisited, pagesVisited + projectsPerPage).map((row) => (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell component='th' scope='row'>
                      {`${row.criadoEm.slice(8, 10)}/${row.criadoEm.slice(5, 7)}/${row.criadoEm.slice(0, 4)}`}
                    </StyledTableCell>
                    {/* <StyledTableCell align='left'>{row.criadoEm}</StyledTableCell> */}
                    <StyledTableCell align='left'>-</StyledTableCell>
                    <StyledTableCell align='left'>{row.departamento.nome}</StyledTableCell>
                    <StyledTableCell align='right'>{row.status.nome}</StyledTableCell>
                    <StyledTableCell align='right'>{row.observacao}</StyledTableCell>
                    <StyledTableCell align='left'>{row.usuario.nome}</StyledTableCell>
                    <StyledTableCell align='center'></StyledTableCell>
                  </StyledTableRow>
                ))}

                {/* MAP CONCLUIDO EM */}
                {/* {data?.map((row) => (
                  <StyledTableRow key={row.id}>
            {`${row.concluidoEm.slice(8, 10)}-${row.concluidoEm.slice(5, 7)}-${row.concluidoEm.slice(0, 4)}`}
                  </StyledTableRow>
                ))} */}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        {!loadingTiposProjeto && dataIsValid && data.length > 0 &&  (
       <Box display="flex" justifyContent="end" mt={2} mr={2}>
       <Pagination
        color="primary"
         count={Math.ceil(listaTiposProjeto?.length / projectsPerPage)}
         page={pageNumber + 1}
         onChange={(event, page) => {
           changePage({ selected: page - 1 });
         }}
         variant="outlined"
         shape="rounded"
       />
     </Box>
      )}
      </Box>
    </Drawer>
  );
};

DrawerView.propTypes = {
  handleFecharDrawerView: PropTypes.func.isRequired,
  projetosSelecionadoVisualizar: PropTypes.number,

  handleAbrirModalAtualizarEtapaProjeto: PropTypes.func.isRequired,
  handleAbrirModalConcluirProjeto: PropTypes.func.isRequired,

};

DrawerView.defaultProps = {
  projetosSelecionadoVisualizar: null,
};

export default DrawerView;
