import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import AddCircle from '@mui/icons-material/AddCircleOutline';
import FilterAlt from '@mui/icons-material/FilterAltOutlined';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Lista from '../licitacoes/components/lista';
import ModalForm from '../licitacoes/components/modal_form';
import { useState } from 'react';
import DrawerView from '../licitacoes/components/drawer_view';
import ModalAtualizarEtapasProjeto from '../licitacoes/components/modal_atualizarEtapasProjeto';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import ModalEditarProjeto from './components/modal_editar_projeto';

const LicitacoesPage = () => {
  const [modalFormAberto, abrirFecharModalForm] = useState(false);
  const [modalFormAtualizarEtapa, abrirFecharModalFormAtualizarEtapa] = useState(false);
  const [drawerViewAberto, abrirFecharDrawerView] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [liciSelecionadoVisualizar, setLiciSelecionadoVisualizar] = useState(null);
  const [editarProjetoAberto, abrirFecharEditarProjeto] = useState(false);
  const [projetosSelecionadoVisualizar, setProjetosSelecionadoVisualizar] = useState(null);

  const handleSearchTermChange = (term) => {
    setSearchTerm(term);
  };

  const handleFecharModalForm = () => abrirFecharModalForm(false);
  const handleAbrirModalForm = () => abrirFecharModalForm(true);

  const handleAbrirDrawerView = (idProjeto) => {
    abrirFecharDrawerView(true);
    setLiciSelecionadoVisualizar(idProjeto);
  };
  const handleFecharDrawerView = () => abrirFecharDrawerView(false);
  const handleFecharModalAtualizarEtapaProjeto = () => abrirFecharModalFormAtualizarEtapa(false);
  const handleAbrirModalAtualizarEtapaProjeto = (idProjeto) => {
    setProjetosSelecionadoVisualizar(idProjeto);

    abrirFecharModalFormAtualizarEtapa(true);
  };

  const handleFecharEditarProjeto = () => abrirFecharEditarProjeto(false);

  const handleAbrirEditarProjeto = (idProjeto) => {
    abrirFecharEditarProjeto(true);
    setProjetosSelecionadoVisualizar(idProjeto);
  };

  return (
    <Box>
      <Typography component='h2' variant='h5' fontWeight={700} color='text.primary'>
        Processos Licitatórios
      </Typography>
      <Divider />
      <Box display='flex' flexDirection='row' gap={2} paddingY={2}>
        {/* <Button startIcon={<FilterAlt />} variant='outlined' color='primary' sx={{ marginLeft: 'auto' }}>
          Filtrar
        </Button> */}

        <TextField
          variant='outlined'
          color='primary'
          value={searchTerm}
          onChange={(e) => handleSearchTermChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <FilterAlt color='primary' />
              </InputAdornment>
            ),
          }}
          placeholder='Filtrar'
          sx={{
            marginLeft: 'auto',
            width: '190px',
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#1976D2',
              },
              '&:hover fieldset': {
                borderColor: '#1976D2',
              },
              '& input': {
                color: 'gray',
                textTransform: 'none',
                fontWeight: '100',
              },
              '& input::placeholder': {
                color: '#1976D2',
                textTransform: 'uppercase',
                fontWeight: '400',
              },
            },
          }}
        />
      </Box>
      <Lista
        searchTerm={searchTerm}
        handleAbrirDrawerView={handleAbrirDrawerView}
        handleAbrirEditarProjeto={handleAbrirEditarProjeto}
      />

      {modalFormAberto && (
        <ModalForm
          handleFecharModalForm={handleFecharModalForm}
          liciSelecionadoVisualizar={liciSelecionadoVisualizar}
        />
      )}

      {modalFormAtualizarEtapa && (
        <ModalAtualizarEtapasProjeto
          handleFecharModalAtualizarEtapaProjeto={handleFecharModalAtualizarEtapaProjeto}
          projetosSelecionadoVisualizar={projetosSelecionadoVisualizar}
          liciSelecionadoVisualizar={liciSelecionadoVisualizar}
          handleFecharModalForm={handleFecharModalForm}
        />
      )}
      {drawerViewAberto && (
        <DrawerView
          handleFecharDrawerView={handleFecharDrawerView}
          liciSelecionadoVisualizar={liciSelecionadoVisualizar}
          handleAbrirModalAtualizarEtapaProjeto={handleAbrirModalAtualizarEtapaProjeto}
          projetosSelecionadoVisualizar={projetosSelecionadoVisualizar}
        />
      )}

      {editarProjetoAberto && (
        <ModalEditarProjeto
          handleFecharEditarProjeto={handleFecharEditarProjeto}
          projetosSelecionadoVisualizar={projetosSelecionadoVisualizar}
          handleAbrirModalAtualizarEtapaProjeto={handleAbrirModalAtualizarEtapaProjeto}
        />
      )}
    </Box>
  );
};

LicitacoesPage.propTypes = {
  changeTheme: PropTypes.func.isRequired,
};

export default LicitacoesPage;
