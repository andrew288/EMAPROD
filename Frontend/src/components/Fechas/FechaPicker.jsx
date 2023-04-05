import React, { useState } from "react";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { FormatDateTimeMYSQL } from "../../utils/functions/FormatDate";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const FechaPicker = ({ onNewfecEntSto, disabled = false }) => {
  const [value, setValue] = useState();

  const formatFechaMYSQL = (newValue) => {
    setValue(newValue);
    onNewfecEntSto(FormatDateTimeMYSQL(newValue._d));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        disabled={disabled}
        value={value}
        inputFormat="DD/MM/yyyy HH:mm:ss"
        onChange={formatFechaMYSQL}
        renderInput={(params) => <TextField {...params} readOnly={true} />}
      />
    </LocalizationProvider>
  );
};

export default FechaPicker;
