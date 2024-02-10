
const XLSX = require('xlsx')
const {sheetFormatter} = require('../formatters')


const exportXlsxSheets = async ({ list, mapper, sheetName })=>{
    const formattedList = mapper ? sheetFormatter(list, mapper) : list;
    const wb = { SheetNames: [], Sheets: {} };
    wb.SheetNames.push(sheetName);

    wb.Sheets[`${sheetName}`] = XLSX.utils.json_to_sheet(formattedList);
    const file = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
    return file;

}

module.exports ={
    exportXlsxSheets
}