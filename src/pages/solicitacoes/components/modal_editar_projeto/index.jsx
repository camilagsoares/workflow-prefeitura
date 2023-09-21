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
import { useApiRequestGet, useApiRequestSubmit,axiosApi } from '../../../../services/api';
import React, { useState, useContext } from 'react'
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { AuthContext } from "../../../../contexts/auth.context"
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

const requiredField = 'Campo obrigatorio';

const schema = yup
  .object({
    idSonner: yup.number().required(),
    titulo: yup.string().max(45, 'Máximo de 45 caracteres').required(requiredField),
    descricao: yup.string().max(5000, 'Máximo de 5000 caracteres').required(requiredField),
    observacao: yup.string().max(128, 'Máximo de 128 caracteres').required(requiredField),
    valor: yup.number().required(requiredField),
    tipoProjetoId: yup.number().required(requiredField),
    ata: yup.boolean()
  })
  .required();

const ModalEditarProjeto = (props) => {
  const { projetosSelecionadoVisualizar } = props;
  const [loading, setLoading] = useState(false);

  const { handleFecharAdcPLic } = props;
  const { session } = useContext(AuthContext);
  const { register, handleSubmit, formState, control, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      idSonner: null,
      titulo: '',
      descricao: '',
      observacao: '',
      valor: 0,
      tipoProjetoId: '',
      ata: false
    },
  });

  const { errors } = formState;

  // const { handleSubmitData, loadingData, error } = useApiRequestSubmit('put', `/projeto/${projetosSelecionadoVisualizar}`);

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const {
    data: listaTipoProjeto,
    loading: loadingTipoProjeto,
    error: errorTipoProjeto,
  } = useApiRequestGet('/tipos-projeto');
  console.log("lista tipo projeto", listaTipoProjeto)

  const handleCriarSecretaria = (data) => {


    if ((data.ata === true && data.tipoProjetoId !== 3) || (data.ata === false && data.tipoProjetoId === 3)) {
      toast("Projeto não pode ser ATA com o tipo de projeto diferente de Situação ATA.", {
        type: "error",
      });
      return;
    }
  
  
    setLoading(true);
    axiosApi
      .put(`/projeto/${projetosSelecionadoVisualizar}`, data)
      .then(() => {
        toast('Projeto criado com sucesso', {
          type: 'success',
        });
        console.log("data",handleCriarSecretaria)
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
  };



  return (
    <Dialog disableEscapeKeyDown fullWidth open={true} onClose={props.handleFecharEditarProjeto} maxWidth='sm'>
      <DialogTitle>
        <Stack direction='row' sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography component='h5'>Atualizar Projeto</Typography>
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
            <Grid item xs={12} sm={10} md={10}>
              <TextField
                {...register('idSonner')}
                required
                fullWidth
                autoFocus
                label='Nº Sonner'
                type='text'
                error={!!errors.idSonner}
                helperText={errors.idSonner?.message}
              />
            </Grid>
            <Grid item xs={2} sm={1} md={2}>
              {/* Use Checkbox component for 'ata' */}
              {/* <p>Ata</p>
              <Controller
                name='ata'
                control={control}
                render={({ field }) => (
                  <Checkbox
                    {...field}
                    color='primary'
                  />
                )}
              /> */}
                <FormControlLabel
                control={
                  <Controller
                    name='ata'
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        {...field}
                        color='primary'
                      />
                    )}
                  />
                }
                label='Ata'
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <TextField
                {...register('titulo')}
                fullWidth
                required
                label='Descrição do Projeto'
                name='Título'
                type='text'
                error={!!errors.titulo}
                helperText={errors.titulo?.message}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={12}>
              <TextField
                {...register('descricao')}
                fullWidth
                required
                label='Descrição Resumida'
                name='descricao'
                type='text'
                error={!!errors.descricao}
                helperText={errors.descricao?.message}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <TextField
                {...register('observacao')}
                fullWidth
                required
                label='Observação'
                type='text'
                error={!!errors.observacao}
                helperText={errors.observacao?.message}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <TextField
                {...register('valor')}
                fullWidth
                required
                label='Valor estimado'
                type='number'
                error={!!errors.valor}
                helperText={errors.valor?.message}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Controller
                name='tipoprojeto'
                control={control}
                render={({ field }) => {
                  const { onChange, name, onBlur, value, ref } = field;
                  return (
                    <TextField
                      required
                      ref={ref}
                      disabled={loadingTipoProjeto}
                      InputProps={{
                        endAdornment: loadingTipoProjeto && (
                          <InputAdornment position='start'>
                            <CircularProgress color='info' size={28} sx={{ marginRight: 2 }} />
                          </InputAdornment>
                        ),
                      }}
                      select
                      fullWidth
                      key='secretaria'
                      variant='outlined'
                      onBlur={onBlur}
                      name={name}
                      label='Tipo Projeto'
                      value={value}
                      onChange={onChange}
                      error={!!errors.Secretaria_Id}
                      helperText={errors.Secretaria_Id?.message}
                    >
                      <MenuItem disabled value=''>
                        <em>Nenhuma</em>
                      </MenuItem>
                      {!loadingTipoProjeto &&
                        listaTipoProjeto &&
                        listaTipoProjeto.length &&
                        listaTipoProjeto.map((tipoprojeto) => (
                          <MenuItem key={tipoprojeto.id} value={tipoprojeto.id}>
                            {tipoprojeto.nome}
                          </MenuItem>
                        ))}
                    </TextField>
                  );
                }}
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
                Atualização realizada com sucesso!
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
            {!loading ? 'Atualizar' : <CircularProgress color='success' size={23} />}
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
