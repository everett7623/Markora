import { Button } from './Button';
import { Dialog } from './Dialog';

interface ConfirmDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  variant?: 'default' | 'destructive';
}

export function ConfirmDialog({
  open,
  onConfirm,
  onCancel,
  title,
  description,
  confirmLabel,
  cancelLabel,
  variant = 'default'
}: ConfirmDialogProps) {
  const confirmClassName =
    variant === 'destructive'
      ? 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500'
      : undefined;

  return (
    <Dialog open={open} onClose={onCancel} title={title}>
      <div className="space-y-5">
        <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button type="button" onClick={onConfirm} className={confirmClassName}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
