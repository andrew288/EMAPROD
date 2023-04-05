import React, { useState } from "react";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { YearPicker } from "@mui/x-date-pickers/YearPicker";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { FormatDateTimeMYSQL } from "../../utils/functions/FormatDate";

const FechaPickerYear = ({ onNewfecEntSto }) => {
  const [value, setValue] = useState(null);

  const formatFechaMYSQL = (newValue) => {
    setValue(newValue);
    onNewfecEntSto(FormatDateTimeMYSQL(newValue._d));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <DatePicker
        value={value}
        openTo={"year"}
        inputFormat="DD/MM/yyyy"
        onChange={formatFechaMYSQL}
        renderInput={(params) => <TextField disabled={true} {...params} />}
      />
    </LocalizationProvider>
  );
};

export default FechaPickerYear;
