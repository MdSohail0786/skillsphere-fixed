export const formatCurrency = (amount, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount || 0);
export const timeAgo = (date) => {
  if (!date) return '';
  const s = Math.floor((Date.now() - new Date(date)) / 1000);
  for (const [n, l] of [[31536000,'year'],[2592000,'month'],[86400,'day'],[3600,'hour'],[60,'minute']]) {
    const c = Math.floor(s / n);
    if (c >= 1) return c + ' ' + l + (c > 1 ? 's' : '') + ' ago';
  }
  return 'just now';
};
export const formatDate = (date) => date ? new Intl.DateTimeFormat('en-IN',{dateStyle:'medium'}).format(new Date(date)) : '';
export const truncate = (str, n = 120) => str?.length > n ? str.substring(0, n) + '...' : str || '';
export const getInitials = (name = '') => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
export const getErrorMessage = (e) => e?.response?.data?.message || e?.message || 'Something went wrong';
export const CATEGORIES = ['Web Development','Mobile Development','UI/UX Design','Graphic Design','Content Writing','Digital Marketing','Video Editing','Data Science','Machine Learning','DevOps & Cloud'];
