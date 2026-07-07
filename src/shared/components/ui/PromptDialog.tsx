import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { Button } from './Button';
import { Dialog } from './Dialog';

interface PromptDialogProps {
  open: boolean;
  onConfirm: (value: string) => void;
  onCancel: () => void;
  title: string;
  defaultValue?: string;
  placeholder?: string;
  confirmLabel: string;
  cancelLabel: string;
}

export function PromptDialog({
  open,
  onConfirm,
  onCancel,
  title,
  defaultValue = '',
  placeholder,
  confirmLabel,
  cancelLabel
}: PromptDialogProps) {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    if (open) setValue(defaultValue);
  }, [defaultValue, open]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onConfirm(value);
  };

  return (
    <Dialog open={open} onClose={onCancel} title={title}>
      <form className="space-y-5" onSubmit={submit}>
        <input
          autoFocus
          value={value}
          placeholder={placeholder}
          onChange={(event) => setValue(event.target.value)}
          className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
        />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button type="submit">{confirmLabel}</Button>
        </div>
      </form>
    </Dialog>
  );
}
