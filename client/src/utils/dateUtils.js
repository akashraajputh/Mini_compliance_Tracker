export const isOverdue = (dueDate, status) => {
  if (status !== 'pending') return false;
  const due = new Date(dueDate);
  const today = new Date();
  today.setHours(0,0,0,0);
  return due < today;
}

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString();
}
