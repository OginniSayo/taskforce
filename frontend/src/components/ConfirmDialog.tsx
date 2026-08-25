import { useEffect, type JSX } from 'react';
import { assets } from '../assets/assets';

type ConfirmDialogProps = {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'default';
  onConfirm: () => void;
  onCancel: () => void;
};

const ConfirmDialog = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  onConfirm,
  onCancel,
}: ConfirmDialogProps): JSX.Element | null => {

  // Close on Escape, lock background scroll — same pattern as TaskModal
  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = 'hidden';

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = 'auto';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 backdrop-blur-sm bg-black/20 z-80 flex items-center justify-center p-4 m-0'
      onClick={onCancel}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-message"
        onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => e.stopPropagation()}
        className='bg-base-100 dark:bg-base-200 border border-primary/20 p-6 rounded-xl w-full max-w-sm shadow-lg animate-fade-in'
      >
        <div className='flex items-center gap-3 mb-3'>
          <div className={`p-2 rounded-full ${variant === 'danger' ? 'bg-error/20 text-error' : 'bg-primary/20 text-primary'}`}>
            <assets.AlertTriangleIcon className='size-5' />
          </div>
          <h2 id="confirm-dialog-title" className='text-lg font-bold text-neutral/80 dark:text-neutral-content/80'>
            {title}
          </h2>
        </div>

        <p id="confirm-dialog-message" className='text-sm text-neutral/60 dark:text-neutral-content/60 mb-6'>
          {message}
        </p>

        <div className='flex justify-end gap-3'>
          <button
            type='button'
            onClick={onCancel}
            className='px-4 py-2 rounded-lg text-sm font-medium text-neutral/70 dark:text-neutral-content/70 hover:bg-primary/10 transition-colors duration-200 cursor-pointer'
          >
            {cancelLabel}
          </button>
          <button
            type='button'
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg text-sm font-medium text-base-100 transition-colors duration-200 cursor-pointer ${
              variant === 'danger' ? 'bg-error hover:bg-error/90' : 'bg-primary hover:bg-primary/90'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;