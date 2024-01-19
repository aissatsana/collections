import { format } from 'date-fns';

export function formatDate(dateString) {
  const formattedDate = format(new Date(dateString), "HH:mm dd/MM/yyyy");
  return formattedDate;
}
