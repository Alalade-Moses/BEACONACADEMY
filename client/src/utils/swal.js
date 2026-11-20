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

/**
 * Display device permission guidance with instant retry
 */
export const showPermissionBlockedAlert = ({ isMobile, onRetry }) => {
  const htmlContent = isMobile
    ? `
      <div style="text-align: left; font-size: 13px; line-height: 1.6; color: #334155;">
        <p style="font-weight: 700; margin-bottom: 8px; color: #0f172a;">Camera / Microphone access is blocked on your phone.</p>
        <p style="margin-bottom: 6px; font-weight: 600; color: #050167;">To enable it in Chrome (Android):</p>
        <ol style="margin-left: 18px; margin-bottom: 12px; padding: 0;">
          <li style="margin-bottom: 4px;">Tap the <b>3 vertical dots (⋮)</b> at top right of Chrome.</li>
          <li style="margin-bottom: 4px;">Tap <b>Settings ⚙️</b>, then scroll to <b>Site settings</b>.</li>
          <li style="margin-bottom: 4px;">Tap <b>Camera</b> (and Microphone).</li>
          <li style="margin-bottom: 4px;">Under <b>Blocked</b>, tap <b>beaconbridgeacademics.co.uk</b>.</li>
          <li style="margin-bottom: 4px;">Tap <b>Camera</b> and select <b>"Allow"</b>.</li>
        </ol>
        <p style="font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 8px;">After allowing, tap <b>Retry Camera</b> below to start immediately!</p>
      </div>
    `
    : `
      <div style="text-align: left; font-size: 13px; line-height: 1.6; color: #334155;">
        <p style="font-weight: 700; margin-bottom: 8px; color: #0f172a;">Camera / Microphone access is blocked by your browser.</p>
        <ol style="margin-left: 18px; margin-bottom: 12px; padding: 0;">
          <li style="margin-bottom: 4px;">Click the <b>lock or tune icon (🔒)</b> on the left of your browser address bar.</li>
          <li style="margin-bottom: 4px;">Switch <b>Camera</b> and <b>Microphone</b> to <b>Allow</b>.</li>
        </ol>
        <p style="font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 8px;">Once enabled, click <b>Retry Camera</b> below.</p>
      </div>
    `;

  return BrandSwal.fire({
    icon: 'warning',
    title: 'Permission Blocked',
    html: htmlContent,
    iconColor: '#f59e0b',
    showCancelButton: true,
    confirmButtonText: 'Retry Camera',
    cancelButtonText: 'Dismiss'
  }).then((res) => {
    if (res.isConfirmed && typeof onRetry === 'function') {
      onRetry();
    }
  });
};

/**
 * Display Tutor Approval & Provisioned Account Confirmation modal with login credentials
 */
export const showTutorApprovedModal = ({ applicantName, email, tempPassword }) => {
  return BrandSwal.fire({
    icon: 'success',
    title: 'Tutor Approved & Provisioned!',
    iconColor: '#059669',
    html: `
      <div style="text-align: left; font-size: 13px; line-height: 1.6; color: #334155;">
        <p style="margin-bottom: 8px;">Faculty account for <b>${applicantName || 'Educator'}</b> has been provisioned. An automatic congratulation email with login instructions has been dispatched to their email address.</p>
        <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 14px; padding: 14px; margin: 14px 0;">
          <div style="margin-bottom: 8px;">
            <span style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Login Email:</span>
            <div style="font-weight: 700; color: #0f172a; font-size: 13px; word-break: break-all;">${email}</div>
          </div>
          <div>
            <span style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Temporary Password:</span>
            <div style="font-family: monospace; font-size: 14px; font-weight: 800; color: #050167; background: #e0f2fe; padding: 4px 10px; border-radius: 6px; display: inline-block; margin-top: 4px; border: 1px solid #bae6fd;">${tempPassword}</div>
          </div>
        </div>
        <p style="font-size: 11px; color: #64748b; margin: 0;">The tutor can immediately log in at <b>beaconbridgeacademics.co.uk/login</b> to view assigned classes and resources.</p>
      </div>
    `,
    confirmButtonText: 'Done'
  });
};

export default BrandSwal;
