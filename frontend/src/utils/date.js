import { format, formatDistanceToNow, parseISO, startOfDay } from 'date-fns';

export const toDateKey = (value) => format(startOfDay(parseISO(value)), 'yyyy-MM-dd');
export const prettyDate = (value) => format(parseISO(value), 'EEE, MMM d');
export const prettyFullDate = (value) => format(parseISO(value), 'PPP');
export const relativeDate = (value) => formatDistanceToNow(parseISO(value), { addSuffix: true });
