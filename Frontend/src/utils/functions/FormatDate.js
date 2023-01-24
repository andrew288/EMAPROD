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

const esBisiesto  = (year) => {
    const yearValue = parseInt(year, 10);
    return (yearValue % 400 === 0) ? true : 
  			(yearValue % 100 === 0) ? false : 
              yearValue % 4 === 0;
}

const DiaJuliano = (fecha) => {
    const fechaExtraida = fecha.split(" ",1)[0].split("-");
    const anio = fechaExtraida[0];
    const mes = parseInt(fechaExtraida[1], 10);
    const dia = parseInt(fechaExtraida[2], 10);

    // Comprobamos si es año bisiesto
    const feb = 28;
    if(esBisiesto(anio)){
        feb = 29;
    }

    const meses = [31,feb,31,30,31,30,31,31,30,31,30,31];
    let diaJuliano = 0;
    for(let i=1; i<=mes; i++){
        if(i == mes){
            diaJuliano += dia;
        }
        else{
            diaJuliano += meses[i-1];
        }
    }

    const diaJulianoToString = diaJuliano.toString();
    
    return (
        (diaJulianoToString.length == 1)
        ? `00${diaJulianoToString}` 
        : (diaJulianoToString.length == 2) 
            ? `0${diaJulianoToString}`
            : `${diaJulianoToString}`);

}

export {FormatDateTimeMYSQL, FormatDateTimeMYSQLNow, DiaJuliano};