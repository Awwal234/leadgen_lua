
type ToastSeverity = 'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast';

export interface ToastMessage {
    severity: ToastSeverity;
    summary: string;
    detail: string;
    life?: number;
}

type ToastListener = (msg: ToastMessage) => void;

let listener: ToastListener | null = null;

export const setToastListener = (fn: ToastListener) => {
    listener = fn;
}

export const showToast = (severity: ToastSeverity, summary: string, detail: string, life = 3000) => {
    if (listener) {
        listener({ severity, summary, detail, life });
    } else {
        console.warn(`[Toast ${severity}] ${summary}: ${detail}`);
    }
}

export const toast = {
    success: (summary: string, detail: string, life?: number) => showToast('success', summary, detail, life),
    error: (summary: string, detail: string, life?: number) => showToast('error', summary, detail, life),
    info: (summary: string, detail: string, life?: number) => showToast('info', summary, detail, life),
    warn: (summary: string, detail: string, life?: number) => showToast('warn', summary, detail, life),
}
