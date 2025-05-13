export interface DailyTemperatureDTO {
    dia: string;
    media_temperatura: number;
  }
  
  export interface AverageTemperatureResponseDTO {
    inversor_id: number;
    data_inicio: string;
    data_fim: string;
    temperaturas: DailyTemperatureDTO[];
  }
  