export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount / 100);
}

export function calculateDateRange(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}