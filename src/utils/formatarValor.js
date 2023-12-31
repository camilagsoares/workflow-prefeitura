const formatarValorToMonetario = (value = 0) => {
  const money = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

  return money;
};

export default formatarValorToMonetario;
