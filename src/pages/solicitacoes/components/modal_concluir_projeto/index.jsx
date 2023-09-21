import PropTypes from 'prop-types';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import TextArea from '@mui/material/TextareaAutosize';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Close from '@mui/icons-material/CloseOutlined';
import Save from '@mui/icons-material/SaveAltOutlined';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';
import { useApiRequestGet, useApiRequestSubmit } from '../../../../services/api';
import React, { useState, useContext } from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { AuthContext } from '../../../../contexts/auth.context';
import { axiosApi } from '../../../../services/api';
import { toast } from 'react-toastify';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
const schema = yup
  .object({
    departamentoId: yup.number().required('Campo obrigatorio'),
    statusId: yup.number().required('Campo obrigatorio'),
    observacao: yup.string().required('Campo obrigatorio'),
    projetoId: yup.number(),
  })
  .required();

const ModalConcluirProjeto = (props) => {
  const { handleFecharModalConcluirProjeto } = props;
  const { handleFecharModalForm } = props;
  const  {setConclusionText} = props;
  const { setConcludedProjects} = props;
  const { projetosSelecionadoVisualizar } = props;
  console.log('etapa do projeto Selecionado', projetosSelecionadoVisualizar);
  // const { session } = useContext(AuthContext);

  const { register, handleSubmit, formState, control, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      departamentoId: '',
      projetoId: projetosSelecionadoVisualizar,
      statusId: '',
      observacao: '',
    },
  });

  const { errors } = formState;
  const {
    data: listaDepartamento,
    loading: loadingDepartamento,
    error: errorDepartamento,
  } = useApiRequestGet('/departamentos');
  console.log('departamentos', listaDepartamento);

  const {
    data: status,
    loading: loadingStatus,
  } = useApiRequestGet('/status');


  console.log('departamentos', listaDepartamento);

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCriarSecretaria = (data) => {
    setLoading(true);
    axiosApi
      .post('/etapas', data)
      .then(() => {
        toast('Nova etapa criado com sucesso', {
          type: 'success',
        });
        reset();
        handleFecharModalForm();
      })
      .catch((error) => {
        toast(error.message, {
          type: 'error',
        });
      })
      .finally(() => {
        setLoading(false);
      });
    console.log('OQ mandei', data);
  };


  const handleConcluirProjeto = () => {
    // Update the project's status to "Concluido"
    projetosSelecionadoVisualizar.situacao = 'Concluido';

    // Add the project to the concluded projects state
    props.handleFecharModalConcluirProjeto();
    props.setProjetosConcluidos([...props.projetosConcluidos, projetosSelecionadoVisualizar]);
  };

  //
  return (
    <Dialog disableEscapeKeyDown fullWidth open={true} onClose={handleFecharModalConcluirProjeto} maxWidth='sm'>
      <DialogTitle>
        <Stack direction='row' sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography component='h5'>Deseja concluir o projeto?</Typography>
          <IconButton
            edge='start'
            color='inherit'
            aria-label='clos modal create project'
            onClick={handleFecharModalConcluirProjeto}
          >
            <Close color='action' />
          </IconButton>
        </Stack>
      </DialogTitle>
      <Box component='form' noValidate onSubmit={handleSubmit(handleCriarSecretaria)}>
        <DialogContent sx={{ paddingTop: 1 }}>
          {/* <Grid container columnSpacing={2} rowSpacing={2} marginTop={0.5}></Grid> */}
        </DialogContent>
        <DialogActions>
          <Button
            disabled={loading}
            startIcon={<Close width={24} />}
            variant='outlined'
            color='info'
            onClick={handleFecharModalConcluirProjeto}
            sx={{ minWidth: 156, height: '100%' }}
          >
            Cancelar
          </Button>
          <Button
            type='submit'
            disabled={loading}
            startIcon={<CheckOutlinedIcon width={24} />}
            variant='outlined'
            color='success'
            sx={{ minWidth: 156, height: '100%' }}
            // onClick={() => {
            //   // Atualiza a situação para "Inativo"
            //   // projetosSelecionadoVisualizar.situacao = 'Inativo';
            //   handleFecharModalConcluirProjeto();
            //   props.setConclusionText("Projeto concluído com sucesso!");
            //   props.setConcludedProjects([...props.concludedProjects, projetosSelecionadoVisualizar.id]); 
            //   toast.success("Projeto concluído com sucesso!");
            // }}
            onClick={handleConcluirProjeto}
          >
            {!loading ? 'Concluir' : <CircularProgress color='success' size={23} />}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

ModalConcluirProjeto.propTypes = {
    handleFecharModalConcluirProjeto: PropTypes.func.isRequired,
  handleFecharModalForm: PropTypes.func.isRequired,

  // setSelectedStatus: PropTypes.string,
};

export default ModalConcluirProjeto;
