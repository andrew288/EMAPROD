import React, { useState } from "react";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

const FechaPicker = ( {onNewFechaEntrada} ) => {

    const [value, setValue] = useState();

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <DatePicker
        label="Fecha"
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
          onNewFechaEntrada(newValue);
        }}
        renderInput={(params) => <TextField {...params} />}
      />
    </LocalizationProvider>
  );
};

export default FechaPicker;
