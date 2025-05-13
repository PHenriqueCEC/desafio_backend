export interface GetMaximumPowerDayParams {
    inversor_id: string;
    data_inicio: string;
    data_fim: string;
  }
  
  export interface MaximumPowerDayDTO {
    inversor_id: number;
    data_inicio: string;
    data_fim: string;
    maximas_diarias: {
      dia: string;
      potencia: number;
    }[];
    soma_maximas: number;
  }
  