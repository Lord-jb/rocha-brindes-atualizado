// ==========================================
// UTILITÁRIOS GERAIS
// Funções auxiliares para formatação, validação, etc.
// ==========================================

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// ==========================================
// CLASSES (TAILWIND)
// ==========================================

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ==========================================
// FORMATAÇÃO
// ==========================================

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(price);
}

export function formatDate(timestamp: number, includeTime: boolean = false): string {
  const date = new Date(timestamp * 1000);

  if (includeTime) {
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(date);
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
  }).format(date);
}

export function formatDateLong(timestamp: number): string {
  const date = new Date(timestamp * 1000);

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'long',
  }).format(date);
}

export function formatDateRelative(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 7) {
    return formatDate(timestamp);
  }

  if (days > 0) {
    return `há ${days} dia${days > 1 ? 's' : ''}`;
  }

  if (hours > 0) {
    return `há ${hours} hora${hours > 1 ? 's' : ''}`;
  }

  if (minutes > 0) {
    return `há ${minutes} minuto${minutes > 1 ? 's' : ''}`;
  }

  return 'agora';
}

export function formatWhatsAppNumber(number: string): string {
  // Remove tudo que não é número
  const cleaned = number.replace(/\D/g, '');

  // Formata: (XX) XXXXX-XXXX
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  }

  // Formata: (XX) XXXX-XXXX
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  }

  return number;
}

export function formatCNPJ(cnpj: string): string {
  const cleaned = cnpj.replace(/\D/g, '');

  if (cleaned.length === 14) {
    return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}/${cleaned.slice(8, 12)}-${cleaned.slice(12)}`;
  }

  return cnpj;
}

// ==========================================
// SLUGS
// ==========================================

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9]+/g, '-') // Substitui não alfanuméricos por -
    .replace(/^-+|-+$/g, ''); // Remove - do início e fim
}

export function generateUniqueSlug(text: string, existingSlugs: string[] = []): string {
  let slug = generateSlug(text);
  let counter = 1;

  while (existingSlugs.includes(slug)) {
    slug = `${generateSlug(text)}-${counter}`;
    counter++;
  }

  return slug;
}

// ==========================================
// VALIDAÇÃO
// ==========================================

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidWhatsApp(number: string): boolean {
  const cleaned = number.replace(/\D/g, '');
  // Valida números brasileiros: 10 ou 11 dígitos
  return cleaned.length >= 10 && cleaned.length <= 11;
}

export function isValidCNPJ(cnpj: string): boolean {
  const cleaned = cnpj.replace(/\D/g, '');
  return cleaned.length === 14;
}

export function isValidURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// ==========================================
// NÚMEROS E PEDIDOS
// ==========================================

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `RB-${timestamp}-${random}`;
}

export function generateUUID(): string {
  return crypto.randomUUID();
}

// ==========================================
// WHATSAPP
// ==========================================

export function generateWhatsAppLink(
  number: string,
  message: string = '',
  baseUrl: string = 'https://wa.me'
): string {
  const cleanedNumber = number.replace(/\D/g, '');
  const encodedMessage = encodeURIComponent(message);

  if (message) {
    return `${baseUrl}/${cleanedNumber}?text=${encodedMessage}`;
  }

  return `${baseUrl}/${cleanedNumber}`;
}

export function generateCheckoutWhatsAppMessage(
  orderNumber: string,
  customerName: string,
  items: Array<{ name: string; quantity: number; price: number }>,
  total: number,
  trackingUrl: string
): string {
  let message = `🛍️ *Novo Pedido - ${orderNumber}*\n\n`;
  message += `👤 *Cliente:* ${customerName}\n\n`;
  message += `📦 *Itens:*\n`;

  items.forEach((item) => {
    message += `• ${item.quantity}x ${item.name} - ${formatPrice(item.price)}\n`;
  });

  message += `\n💰 *Total:* ${formatPrice(total)}\n\n`;
  message += `🔗 *Acompanhe seu pedido:*\n${trackingUrl}`;

  return message;
}

// ==========================================
// ARRAYS E OBJETOS
// ==========================================

export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce(
    (groups, item) => {
      const groupKey = String(item[key]);
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(item);
      return groups;
    },
    {} as Record<string, T[]>
  );
}

// ==========================================
// STRINGS
// ==========================================

export function truncate(text: string, length: number, suffix: string = '...'): string {
  if (text.length <= length) return text;
  return text.substring(0, length).trim() + suffix;
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export function capitalizeWords(text: string): string {
  return text
    .split(' ')
    .map((word) => capitalize(word))
    .join(' ');
}

// ==========================================
// DEBOUNCE E THROTTLE
// ==========================================

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// ==========================================
// CLIPBOARD
// ==========================================

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback para navegadores mais antigos
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch {
      return false;
    }
  }
}

// ==========================================
// LOCAL STORAGE (com tipos)
// ==========================================

export function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;

  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function saveToStorage<T>(key: string, value: T): boolean {
  if (typeof window === 'undefined') return false;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function removeFromStorage(key: string): boolean {
  if (typeof window === 'undefined') return false;

  try {
    window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

export function clearStorage(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    window.localStorage.clear();
    return true;
  } catch {
    return false;
  }
}
