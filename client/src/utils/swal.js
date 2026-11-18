import Swal from 'sweetalert2';

// Custom SweetAlert2 instance with Beacon Bridge Academics branding
const BrandSwal = Swal.mixin({
  customClass: {
    popup: 'rounded-3xl shadow-2xl border border-slate-200/80 p-6 sm:p-7 font-sans bg-white',
    title: 'text-lg sm:text-xl font-black text-[#001f3f] tracking-tight',
    htmlContainer: 'text-xs sm:text-sm text-slate-600 leading-relaxed mt-2',
    confirmButton: 'px-6 py-2.5 rounded-xl bg-[#050167] hover:bg-[#001f3f] text-[#f0faff] font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer mx-1.5 focus:outline-none focus:ring-2 focus:ring-[#40ffa7]',
    cancelButton: 'px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition-all active:scale-95 cursor-pointer mx-1.5 focus:outline-none',
    actions: 'flex items-center justify-center gap-2 mt-5',
    input: 'rounded-xl border border-slate-300 text-xs px-3 py-2 focus:ring-2 focus:ring-[#050167] focus:border-transparent outline-none'
  },
  buttonsStyling: false,
  showClass: {
    popup: 'swal2-show animate-in fade-in zoom-in-95 duration-200'
  },
  hideClass: {
    popup: 'swal2-hide animate-out fade-out zoom-out-95 duration-150'
  }
});

/**
 * Display an error dialog
 */
export const showError = (title, text) => {
  return BrandSwal.fire({
    icon: 'error',
    title: title || 'Action Could Not Complete',
    text: text || 'An unexpected error occurred. Please try again.',
    iconColor: '#e11d48',
    confirmButtonText: 'Understood'
  });
};

/**
 * Display a success dialog
 */
export const showSuccess = (title, text) => {
  return BrandSwal.fire({
    icon: 'success',
    title: title || 'Success!',
    text: text || 'Operation was completed successfully.',
    iconColor: '#059669',
    confirmButtonText: 'Continue'
  });
};

/**
 * Display a warning / validation dialog
 */
export const showWarning = (title, text) => {
  return BrandSwal.fire({
    icon: 'warning',
    title: title || 'Attention Required',
    text: text || 'Please check the required information and try again.',
    iconColor: '#f59e0b',
    confirmButtonText: 'Review Form'
  });
};

/**
 * Display an information dialog
 */
export const showInfo = (title, text) => {
  return BrandSwal.fire({
    icon: 'info',
    title: title || 'Notice',
    text: text || '',
    iconColor: '#050167',
    confirmButtonText: 'OK'
  });
};

/**
 * Display an interactive network error alert with optional retry
 */
export const showNetworkError = ({ title = 'Network Connection Interrupted', text, onRetry }) => {
  return BrandSwal.fire({
    icon: 'error',
    title,
    text: text || 'Your request timed out or the network connection was interrupted. Please check your internet connection.',
    iconColor: '#e11d48',
    showCancelButton: Boolean(onRetry),
    confirmButtonText: onRetry ? 'Retry Upload' : 'Close',
    cancelButtonText: 'Cancel'
  }).then((res) => {
    if (res.isConfirmed && typeof onRetry === 'function') {
      onRetry();
    }
  });
};

/**
 * Display a confirmation prompt (returns Promise<boolean>)
 */
export const showConfirm = async ({ title, text, confirmText = 'Confirm', cancelText = 'Cancel', icon = 'question' }) => {
  const result = await BrandSwal.fire({
    icon,
    title: title || 'Are you sure?',
    text: text || '',
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    iconColor: icon === 'warning' ? '#f59e0b' : '#050167'
  });
  return result.isConfirmed;
};

/**
 * Non-blocking toast notification
 */
export const showToast = (title, icon = 'success') => {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3500,
    timerProgressBar: true,
    customClass: {
      popup: 'rounded-2xl shadow-xl border border-slate-200 p-3 bg-white text-xs font-semibold'
    }
  });
  return Toast.fire({
    icon,
    title
  });
};

export default BrandSwal;
