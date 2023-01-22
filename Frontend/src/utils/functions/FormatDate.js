const FormatDateTimeMYSQL = (newDate) => {
    let fecha = newDate.toISOString().split("T",1)[0];
    let hora = newDate.toLocaleTimeString();
    return fecha + " " + hora;
}

const FormatDateTimeMYSQLNow = () => {
    let nowDate = new Date();
    let fecha = nowDate.toISOString().split("T",1)[0];
    let hora = nowDate.toLocaleTimeString();
    return fecha + " " + hora;
}

export {FormatDateTimeMYSQL, FormatDateTimeMYSQLNow};