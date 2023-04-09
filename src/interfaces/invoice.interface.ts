export interface Invoice {
  id: string;
  user_id: string;
  amount: number;
  description: string;
  status: 'pending' | 'paid' | 'cancelled';
  created_at: Date;
  updated_at: Date;
  due_date: Date; //data de vencimento da fatura
  items: InvoiceItem[];
}

export interface InvoiceItem {
  description: string;
  amount: number;
  quantity: number;
}
