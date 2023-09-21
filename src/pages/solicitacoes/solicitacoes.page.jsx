import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import AddCircle from '@mui/icons-material/AddCircleOutline';
import FilterAlt from '@mui/icons-material/FilterAltOutlined';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import Lista from './components/lista';
import ModalForm from './components/modal_form';
import { useState, useContext } from 'react';
import DrawerView from './components/drawer_view';
import ModalAtualizarEtapasProjeto from './components/modal_atualizarEtapasProjeto';
import ModalAdicionarProcessoLicitatorio from './components/modal_adicionar_processo_licitatorio';
import ModalEditarProjeto from './components/modal_editar_projeto';
import InputAdornment from '@mui/material/InputAdornment';
import { AuthContext } from "../../contexts/auth.context"
import ModalConcluirProjeto from "./components/modal_concluir_projeto"

const SolicitacoesPage = () => {
  const [modalFormAberto, abrirFecharModalForm] = useState(false);
  const [modalFormAtualizarEtapa, abrirFecharModalFormAtualizarEtapa] = useState(false);
  const [modalFormConcluir, abrirFecharModalConcluir] = useState(false);
  const [modalFormAdicionarProcessoLicitatorio, abrirFecharModalFormAdicionarProcessoLicitatorio] = useState(false);
  const [drawerViewAberto, abrirFecharDrawerView] = useState(false);
  const [projetosSelecionadoVisualizar, setProjetosSelecionadoVisualizar] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editarProjetoAberto, abrirFecharEditarProjeto] = useState(false);
  const [concluirProjetoAberto, abrirFecharConcluirProjeto] = useState(false)

  const handleFecharModalForm = () => abrirFecharModalForm(false);
  const handleAbrirModalForm = () => abrirFecharModalForm(true);

  const handleAbrirDrawerView = (idProjeto) => {
    abrirFecharDrawerView(true);
    setProjetosSelecionadoVisualizar(idProjeto);
  };
  const handleFecharDrawerView = () => abrirFecharDrawerView(false);

  const handleFecharEditarProjeto = () => abrirFecharEditarProjeto(false);

  const handleFecharConcluirProjeto = () => abrirFecharConcluirProjeto(false);


  const handleFecharModalConcluirProjeto = () => abrirFecharModalConcluir(false);

  const handleFecharModalAtualizarEtapaProjeto = () => abrirFecharModalFormAtualizarEtapa(false);

  const handleAbrirModalAtualizarEtapaProjeto = (idProjeto) => {
    setProjetosSelecionadoVisualizar(idProjeto);
    abrirFecharModalFormAtualizarEtapa(true);
  };

  const handleFecharAdcPLic = () => abrirFecharModalFormAdicionarProcessoLicitatorio(false);
  const handleAbrirAdcPLic = () => abrirFecharModalFormAdicionarProcessoLicitatorio(true);

  const handleSearchTermChange = (term) => {
    setSearchTerm(term);
  };

  const handleAbrirEditarProjeto = (idProjeto) => {
    abrirFecharEditarProjeto(true);
    setProjetosSelecionadoVisualizar(idProjeto);
  };

  //
  const handleAbrirModalConcluirProjeto = (idProjeto) => {
    setProjetosSelecionadoVisualizar(idProjeto);
    abrirFecharModalConcluir(true);
    console.log("projeto clicado", idProjeto)
  };

  const [clickedProjectIds, setClickedProjectIds] = useState([]);

  const handleIncluirClick = (projetoId) => {
    if (clickedProjectIds.includes(projetoId)) {
      setClickedProjectIds((prevClickedProjectIds) =>
        prevClickedProjectIds.filter((id) => id !== projetoId)
      );
    } else {
      setClickedProjectIds((prevClickedProjectIds) => [
        ...prevClickedProjectIds,
        projetoId,
      ]);
    }
  };


  // TESTE ocultar botão alterar
  const [mostrarBotaoAlterar, setMostrarBotaoAlterar] = useState(true);
  const [statusId, setStatusId] = useState('');
  //
  const { session, token } = useContext(AuthContext);
  // console.log("session", session.permissao.id) 

  const [projetosConcluidos, setProjetosConcluidos] = useState([]);


//
const [conclusionText, setConclusionText] = useState("");
const [concludedProjects, setConcludedProjects] = useState([]);


  return (
    <Box>
      <Typography component='h2' variant='h5' fontWeight={700} color='text.primary'>
        Solicitações
      </Typography>
      <Typography>{conclusionText}</Typography>

      <Divider />
      <Box display='flex' flexDirection='row' gap={2} paddingY={2}>
        <Button startIcon={<AddCircle />} variant='outlined' color='primary' onClick={handleAbrirModalForm}>
          Adicionar solicitação
        </Button>
        {session && (session.permissao.id === 1 || session.permissao.id === 2) && (
          <Button
            startIcon={<AddCircle />}
            variant='outlined'
            color='primary'
            onClick={handleAbrirAdcPLic}
          >
            Adicionar Processo Licitatório
          </Button>
        )}
        {/* <Button startIcon={<AddCircle />} variant='outlined' color='primary' onClick={handleAbrirAdcPLic}>
          Adicionar Processo Licitatorio
        </Button> */}
        <TextField
          size='small'
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
        handleIncluirClick={handleIncluirClick}
        clickedProjectIds={clickedProjectIds}
        projetosSelecionadoVisualizar={projetosSelecionadoVisualizar}
        projetosConcluidos={projetosConcluidos}

        //
        setConcludedProjects={setConcludedProjects} 
      />

      {modalFormAberto && <ModalForm handleFecharModalForm={handleFecharModalForm}
      //  handleFecharModalAtualizarEtapaProjeto={handleFecharModalAtualizarEtapaProjeto}
      />}

      {modalFormAtualizarEtapa && (
        <ModalAtualizarEtapasProjeto
          handleFecharModalForm={handleFecharModalForm}
          handleFecharModalAtualizarEtapaProjeto={handleFecharModalAtualizarEtapaProjeto}
          projetosSelecionadoVisualizar={projetosSelecionadoVisualizar}
        // handleAbrirEditarProjeto={handleAbrirEditarProjeto}
        // handleAbrirModalAtualizarEtapaProjeto={handleAbrirModalAtualizarEtapaProjeto}

        //Teste ocultar
        // setSelectedStatus={setSelectedStatus}

        />
      )}

      {modalFormAdicionarProcessoLicitatorio && (
        <ModalAdicionarProcessoLicitatorio
          clickedProjectIds={clickedProjectIds}
          handleFecharAdcPLic={handleFecharAdcPLic}
          handleIncluirClick={handleIncluirClick}
        />
      )}

      {drawerViewAberto && (
        <DrawerView
          handleFecharDrawerView={handleFecharDrawerView}
          projetosSelecionadoVisualizar={projetosSelecionadoVisualizar}
          handleAbrirModalAtualizarEtapaProjeto={handleAbrirModalAtualizarEtapaProjeto}
          handleAbrirModalConcluirProjeto={handleAbrirModalConcluirProjeto}
        />
      )}

      {editarProjetoAberto && (
        <ModalEditarProjeto
          handleFecharEditarProjeto={handleFecharEditarProjeto}
          projetosSelecionadoVisualizar={projetosSelecionadoVisualizar}
          handleAbrirModalAtualizarEtapaProjeto={handleAbrirModalAtualizarEtapaProjeto}
          handleAbrirModalConcluirProjeto={handleAbrirModalConcluirProjeto}
        />
      )}

      {modalFormConcluir && (
        <ModalConcluirProjeto
          handleFecharConcluirProjeto={handleFecharConcluirProjeto}
          projetosSelecionadoVisualizar={projetosSelecionadoVisualizar}
          handleAbrirModalAtualizarEtapaProjeto={handleAbrirModalAtualizarEtapaProjeto}
          handleAbrirModalConcluirProjeto={handleAbrirModalConcluirProjeto}
          handleFecharModalConcluirProjeto={handleFecharModalConcluirProjeto}

          //teste para deixar borda verde
          setConclusionText={setConclusionText}
          setConcludedProjects={setConcludedProjects}
        />
      )}
    </Box>
  );
};

SolicitacoesPage.propTypes = {
  changeTheme: PropTypes.func.isRequired,
};

export default SolicitacoesPage;
// ModalAtualizarEtapasProjeto


// quando o status for retorno mas aparece para o usuario,para quem abriu a solicitacao,nunca para o compras
