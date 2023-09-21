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
import React,{useState, useContext} from 'react'
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { AuthContext } from "../../../../contexts/auth.context"
  

const schema = yup
  .object({
    licinome: yup.string().required('Campo obrigatorio'),
    numeroCompras: yup.number().required('Campo obrigatorio'),
    licinumero: yup.number().required('Campo obrigatorio'),
    licstatus: yup.string().required('Campo obrigatorio'),
    Usuario_id: yup.number().required('Campo obrigatorio'),
    licobsfinal: yup.string().required('Campo obrigatorio'),
    licvalor: yup.number().required('Campo obrigatorio'),
  })
  .required();

  const ModalEditarProjeto = (props) => {
    const { projetosSelecionadoVisualizar } = props;

    const { handleFecharAdcPLic } = props;
    const { session } = useContext(AuthContext);
  const { register, handleSubmit, formState, control, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { licinome: '', licinumero: '', licstatus: '',  
    Usuario_id: session.idUsuaros,
     licobsfinal: '',licvalor: '', numeroCompras: ''},
  });

  const { errors } = formState;

  const { handleSubmitData, loading, error } = useApiRequestSubmit('put', `/processolicitatorio/${projetosSelecionadoVisualizar}`);
  
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);


  const handleCriarSecretaria = (data) => {
    handleSubmitData(data)
      .then(() => {
        reset();
        setShowSuccessMessage(true); 
        setTimeout(() => {
          setShowSuccessMessage(false); 
          handleFecharAdcPLic();
        }, 3000); 
      })
      .catch((error) => {
        console.error('Error submitting form:', error);
      });
  };
  // console.log(data)


  return (
    <Dialog disableEscapeKeyDown fullWidth open={true} onClose={props.handleFecharEditarProjeto} maxWidth='sm'>
      <DialogTitle>
        <Stack direction='row' sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography component='h5'>Atualizar Processo</Typography>
          <IconButton
            edge='start'
            color='inherit'
            aria-label='clos modal create project'
            onClick={props.handleFecharEditarProjeto}
          >
            <Close color='action' />
          </IconButton>
        </Stack>
      </DialogTitle>
      <Box component='form' noValidate onSubmit={handleSubmit(handleCriarSecretaria)} >
        <DialogContent dividers>
          <Grid container columnSpacing={2} rowSpacing={2}>
            <Grid item xs={12} sm={12} md={12}>
            <TextField
                {...register('licinome')}
                required
                fullWidth
                autoFocus
                label='Nome processo licitatório'
                type='text'
                error={!!errors.licinome}
                helperText={errors.licinome?.message}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
            <TextField
                {...register('numeroCompras')}
                fullWidth
                required
                label='Número compras'
                name='numeroCompras'
                type='number'
                error={!!errors.numeroCompras}
                helperText={errors.numeroCompras?.message}
              />
            </Grid>
           
            <Grid item xs={12} sm={12} md={12}>
            <TextField
                {...register('licinumero')}
                fullWidth
                required
                label='N° do Processo'
                name='licinumero'
                type='number'
                error={!!errors.licinumero}
                helperText={errors.licinumero?.message}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
            <TextField
                {...register('licstatus')}
                fullWidth
                required
                label='Status'
                name='licstatus'
                type='text'
                error={!!errors.licstatus}
                helperText={errors.licstatus?.message}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
            <TextField
                {...register('licobsfinal')}
                fullWidth
                required
                label='Observação final'
                name='licobsfinal'
                type='text'
                error={!!errors.licobsfinal}
                helperText={errors.licobsfinal?.message}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
            <TextField
                {...register('licvalor')}
                fullWidth
                required
                label='Valor'
                name='licvalor'
                type='number'
                error={!!errors.licvalor}
                helperText={errors.licvalor?.message}
              />
            </Grid>
          
          
          </Grid>
          {/* {error && (
            <Box display='flex' flexDirection='row' gap={4} color='red' fontSize={14}>
              <pre>{JSON.stringify(error, null, 2)}</pre>
            </Box>
          )}
          {error && (
            <Box display='flex' flexDirection='row' gap={4} color='red' fontSize={14}>
              <pre>{JSON.stringify(errorTipoProjeto, null, 2)}</pre>
            </Box>
          )}
          {showSuccessMessage && (
            <Box mt={2} display='flex' justifyContent='center' alignItems='center'>
              <Alert severity='success'>
                <AlertTitle>Successo</AlertTitle>
                Projeto criado com sucesso
              </Alert>
            </Box>
          )} */}
          {showSuccessMessage && (
            <Box mt={2} display='flex' justifyContent='center' alignItems='center'>
              <Alert severity='success'>
                <AlertTitle>Successo</AlertTitle>
                Processo Atualizado com sucesso!
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            disabled={loading}
            startIcon={<Close width={24} />}
            variant='outlined'
            color='info'
            onClick={props.handleFecharEditarProjeto}
            sx={{ minWidth: 156, height: '100%' }}
          >
            Cancelar
          </Button>
          <Button
            type='submit'
            disabled={loading}
            startIcon={<Save width={24} />}
            variant='outlined'
            color='success'
            sx={{ minWidth: 156, height: '100%' }}
          >
            {!loading ? 'Salvar' : <CircularProgress color='success' size={23} />}
          </Button>
        </DialogActions>

      </Box>
    </Dialog>
  );
};

ModalEditarProjeto.propTypes = {
  handleFecharAdcPLic: PropTypes.func.isRequired,
};

export default ModalEditarProjeto;
