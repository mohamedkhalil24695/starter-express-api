const allReportsXlsxSheetFormatter = (data) => {
  return data.map((ele) => ({
    id: ele.id,
    createdAt: ele.createdAt,
    updatedAt: ele.updatedAt,
    assistorName: ele.assistorName,
    creatorName: ele.creator.fullName,
    DepartmentName: ele.Department.name,
    DepartmentNameAr: ele.Department.nameAr,
  }));
};

module.exports = {
  allReportsXlsxSheetFormatter,
};
