import { format } from 'date-fns';

export function formatDate(dateString) {
  const formattedDate = format(new Date(dateString), "HH:mm dd/MM/yyyy");
  return formattedDate;
}


export const primaryColor = '#1a237e';
export const primaryDarkColor = '#0d47a1';
export const backgroundColor = '#ffffff';
