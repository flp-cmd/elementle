export const getStatusColor = (status: string) => {
  switch (status) {
    case "correct":
      return "#22c55e";
    case "partial":
      return "#eab308";
    case "wrong":
      return "#ef4444";
    default:
      return "#6b7280";
  }
};

export const formatProperty = (property: string) => {
  switch (property) {
    case "group_name":
      return "Grupo";
    case "state_ntp":
      return "Estado Físico";
    case "atomic_number":
      return "Número Atômico";
    case "discovery_year":
      return "Ano de Descoberta";
    default:
      return property;
  }
};

export const formatValue = (property: string, value: string | number) => {
  switch (property) {
    case "group_name":
      // Return the group name as is since they're already in Portuguese
      return value.toString();
    case "state_ntp":
      // Return state as is since they're already in Portuguese
      return value.toString();
    case "discovery_year":
      if (value === "Antiguidade" || value === "Pré-história") {
        return value.toString();
      }
      const year = typeof value === "string" ? parseInt(value) : value;
      return typeof year === "number" && year < 0
        ? `${Math.abs(year)} a.C.`
        : year.toString();
    default:
      return value.toString();
  }
};
