export const addMonths = (date, months) => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

export const getUsedPercentage = (startedAt, expiresAt) => {
  const now = new Date();
  const total = new Date(expiresAt) - new Date(startedAt);
  const used = now - new Date(startedAt);
  return used / total;
};
