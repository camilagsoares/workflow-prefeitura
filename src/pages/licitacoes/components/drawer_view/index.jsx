import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Close from '@mui/icons-material/CloseOutlined';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import Paper from '@mui/material/Paper';
import MenuOpen from '@mui/icons-material/MenuOpenOutlined';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import { useApiRequestGet } from '../../../../services/api';
import { format, parseISO } from 'date-fns';
import AddCircle from '@mui/icons-material/AddCircleOutline';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Pagination from '@mui/material/Pagination';
import React, { useState, useContext, useEffect } from 'react';
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';
const DrawerView = (props) => {
  const { liciSelecionadoVisualizar } = props;
  const { projetosSelecionadoVisualizar } = props;

  const { data, error, loading } = useApiRequestGet(`/etapas/processo-licitatorio/${liciSelecionadoVisualizar}`);

  console.log("etapas processo licitatorio",data)
  const {
    data: processosLicitatorios,
    error: errorProcessosLicitatorios,
    loading: loadingProcessosLicitatorios,
  } = useApiRequestGet(`/processos-licitatorios/${liciSelecionadoVisualizar}`);
  // console.log("processos licitatorios drawerView",processosLicitatorios.projeto)

  console.log('processo', liciSelecionadoVisualizar); // la em baixo

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

  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const [pageNumber, setPageNumber] = useState(0);
  const projectsPerPage = 6;
  const pagesVisited = pageNumber * projectsPerPage;

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  useEffect(() => {
    setPageNumber(0);
  }, [data]);

  return (
    <Drawer anchor='right' open={true} onClose={props.handleFecharDrawerView}>
      <Box width='60vw'>
        <Stack
          direction='row'
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          padding={1.5}
        >
          <Grid container justifyContent='space-between'>
            <Grid item>
              <Typography component='h6' marginBottom={1}>
                Detalhes Licitatório
              </Typography>
            </Grid>
            <Grid item>
              <Button variant='outlined' sx={{ marginRight: 3 }} onClick={handleOpenDialog}>
                Visualizar projeto incluído
              </Button>
            </Grid>
          </Grid>
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
        <Dialog
          maxWidth='lg'
          PaperProps={{ style: { width: '100%', height: '40%' } }}
          open={openDialog}
          onClose={handleCloseDialog}
        >
          <DialogTitle>Visualizar Projeto incluído</DialogTitle>
          <DialogContent>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 700 }} size='small' aria-label='customized table'>
                <TableHead>
                  <StyledTableRow>
                    <StyledTableCell>Descrição resumida</StyledTableCell>

                    <StyledTableCell align='left' width={256}>
                      Departamento
                    </StyledTableCell>
                    <StyledTableCell align='left' width={256}>
                      ID Sonner
                    </StyledTableCell>
                    <StyledTableCell align='left' width={256}>
                      Atualização
                    </StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {!loadingProcessosLicitatorios &&
                    processosLicitatorios &&
                    processosLicitatorios.length &&
                    processosLicitatorios.map((row) => (
                      <StyledTableRow key={row.id}>
                        <StyledTableCell align='left' width={256}>
                          {`${row.criadoEm.slice(8, 10)}-${row.criadoEm.slice(5, 7)}-${row.criadoEm.slice(0, 4)}`}
                        </StyledTableCell>
                        <StyledTableCell align='left' width={256}>
                          {row.titulo}
                        </StyledTableCell>
                        <StyledTableCell align='left' width={256}>
                          {row.idSonner}
                        </StyledTableCell>
                        <StyledTableCell align='left' width={256}>
                          {row.etapa[0]?.departamento?.nome}
                        </StyledTableCell>
                        <StyledTableCell align='center' width={96}>
                          <MenuOpen />
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                </TableBody>
                {/* <TableBody>
                  <StyledTableRow>
                    <StyledTableCell align='left' width={256}>
                     {!loadingProcessosLicitatorios && processosLicitatorios?.titulo}
                    </StyledTableCell>
                    <StyledTableCell align='left' width={256}>
                      {!loadingProcessosLicitatorios && processosLicitatorios.idSonner}
                    </StyledTableCell>
                    <StyledTableCell align='left' width={256}>
                      {!loadingProcessosLicitatorios && processosLicitatorios?.etapa[0]?.departamento?.nome}
                    </StyledTableCell>
                    <StyledTableCell align='left' width={256}> 
                      -
                    </StyledTableCell>
                  </StyledTableRow>
                </TableBody> */}
              </Table>
            </TableContainer>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color='primary'>
              Fechar
            </Button>
          </DialogActions>
        </Dialog>

        {/* {error && (
          <Box display='flex' flexDirection='row' gap={4} color='red' fontSize={14}>
            <pre>{JSON.stringify(error, null, 2)}</pre>
          </Box>
        )} */}

        <Box marginY={1} paddingY={2} paddingX={3}>
          <Typography component='h6' marginBottom={1}>
            Detalhes Licitatório
            {/* <Button variant="outlined" color="success">Visualizar projeto incluído</Button> */}
          </Typography>
          <TableContainer component={Paper}>
            <Table size='small'>
              <TableRow>
                <StyledTableCell width={96} variant='head'>
                  Número compras
                </StyledTableCell>
                <StyledTableCell>
                  {!loadingProcessosLicitatorios && processosLicitatorios?.numeroCompras}
                </StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell width={96} variant='head'>
                  Data
                </StyledTableCell>
                <StyledTableCell>
                  {' '}
                  {processosLicitatorios?.criadoEm &&
                    `${processosLicitatorios.criadoEm.slice(8, 10)}-${processosLicitatorios.criadoEm.slice(
                      5,
                      7,
                    )}-${processosLicitatorios.criadoEm.slice(0, 4)}`}
                </StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell width={96} variant='head'>
                  N° Sonner
                </StyledTableCell>
                <StyledTableCell>{!loadingProcessosLicitatorios && processosLicitatorios?.idSonner}</StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell width={96} variant='head'>
                  Observação
                </StyledTableCell>
                <StyledTableCell>
                  {!loadingProcessosLicitatorios && processosLicitatorios?.etapa[0].observacao}
                </StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell width={96} variant='head'>
                  Valor
                </StyledTableCell>
                <StyledTableCell>{!loadingProcessosLicitatorios && processosLicitatorios?.valor}</StyledTableCell>
              </TableRow>
            </Table>
          </TableContainer>
          <Stack
            direction='row'
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            paddingY={1.5}
          >
            <Typography component='h6' marginBottom={1}>
              Etapas do Licitatório
            </Typography>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Button
                startIcon={<DoneOutlinedIcon />}
                variant='outlined'
                color='primary'
                sx={{ marginRight: 1 }}
                onClick={() => props.handleAbrirModalAtualizarEtapaProjeto(projetosSelecionadoVisualizar)}
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
                  <StyledTableCell>Início</StyledTableCell>
                  <StyledTableCell align='left' width={256}>
                    Departamento
                  </StyledTableCell>
                  <StyledTableCell align='left' width={256}>
                    Status
                  </StyledTableCell>
                  <StyledTableCell align='left' width={256}>
                    Observação
                  </StyledTableCell>
                  <StyledTableCell align='left' width={256}>
                    Usuário
                  </StyledTableCell>
                  <StyledTableCell align='center' width={96}>
                    <MenuOpen />
                  </StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {data?.slice(pagesVisited, pagesVisited + projectsPerPage).map((row) => (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell align='left' width={256}>
                      {`${row.criadoEm.slice(8, 10)}-${row.criadoEm.slice(5, 7)}-${row.criadoEm.slice(0, 4)}`}
                    </StyledTableCell>
                    <StyledTableCell align='left' width={256}>
                      {row.departamento.nome}
                    </StyledTableCell>
                    <StyledTableCell align='left' width={256}>
                      {row.status.nome}
                    </StyledTableCell>
                    <StyledTableCell align='left' width={256}>
                      {row.observacao}
                    </StyledTableCell>
                    <StyledTableCell align='left' width={256}>
                      {row.usuario.nome}
                    </StyledTableCell>
                    <StyledTableCell align='center' width={96}>
                      <MenuOpen />
                    </StyledTableCell>
                  </StyledTableRow>
                  // <StyledTableRow key={row.idprocessos_licitatorios}>
                  //   <StyledTableCell align='left'>{row.etpdata}</StyledTableCell>
                  //   <StyledTableCell component='th' scope='row'>
                  //     {row.depNome}
                  //   </StyledTableCell>
                  //   <StyledTableCell align='left'>{row.etpobs}</StyledTableCell>
                  //   <StyledTableCell align='right'>{row.etpstatus}</StyledTableCell>
                  //   <StyledTableCell align='right'>Usuario</StyledTableCell>
                  //   <StyledTableCell align='center'>vfjofjo</StyledTableCell>
                  // </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        {!loading && (
          <Box display='flex' justifyContent='end' mt={2} mr={2}>
            <Pagination
              color='primary'
              count={Math.ceil(data?.length / projectsPerPage)}
              page={pageNumber + 1}
              onChange={(event, page) => {
                changePage({ selected: page - 1 });
              }}
              variant='outlined'
              shape='rounded'
            />
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

DrawerView.propTypes = {
  handleFecharDrawerView: PropTypes.func.isRequired,
  liciSelecionadoVisualizar: PropTypes.number,
  projetosSelecionadoVisualizar: PropTypes.number,
  handleAbrirModalAtualizarEtapaProjeto: PropTypes.func.isRequired,
};

DrawerView.defaultProps = {
  liciSelecionadoVisualizar: null,
  projetosSelecionadoVisualizar: null,
};

export default DrawerView;
