import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { useApiRequestGet } from '../../src/services/api';
import { CSVLink } from 'react-csv';

const DownloadTable = () => {
  // Use o hook de estado para armazenar os dados da API
  const [data, setData] = useState([]);

 useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await useApiRequestGet("get", '/projetos/relatorios');
        setData(response.data);
        // console.log("data",data)
      } catch (error) {
        console.error("Erro ao buscar dados da API:", error);
      }
    };

    fetchData();
  }, []); 

//   const { dataRelatorio, error, loading } = useApiRequestGet('/projetos/relatorios');
// console.log("dataRelatorio",dataRelatorio)
  return (
    <div>
      <Button variant="outlined">Baixar Tabela CSV</Button>
      {data.length > 0 && (
        <CSVLink data={data} filename="tabela.csv" separator=";">
          Baixar CSV
        </CSVLink>
      )}
    </div>
  );
};

export default DownloadTable;