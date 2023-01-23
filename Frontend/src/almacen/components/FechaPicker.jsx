import React, { useState } from "react";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { FormatDateTimeMYSQL } from "../../utils/functions/FormatDate";

const FechaPicker = ( {onNewFechaEntrada} ) => {

    const [value, setValue] = useState();

    const formatFechaMYSQL = (newValue) => {
      setValue(newValue);
      onNewFechaEntrada(FormatDateTimeMYSQL(newValue._d));
    }

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <DatePicker
        label="Fecha"
        value={value}
        inputFormat="DD/MM/YYYY HH:mm:ss"
        onChange={formatFechaMYSQL}
        renderInput={(params) => <TextField disabled={false} {...params} />}
      />
    </LocalizationProvider>
  );
};

export default FechaPicker;
