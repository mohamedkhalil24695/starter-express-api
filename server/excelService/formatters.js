const sheetFormatter = (list, mapper) => {
    return list.map(po => {
      const mappedPO = {};
      Object.entries(po).forEach(([key, value]) => {
        if (Object.prototype.hasOwnProperty.call(mapper, key)) {
          const mappedKey = mapper[key];
          mappedPO[mappedKey] = value;
        }
      });
      return mappedPO;
    });
  };
  

  module.exports ={
    sheetFormatter
}