import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Upload, FileSpreadsheet, Loader2, Check } from 'lucide-react';
import { CategoryType, TransactionType, CATEGORY_CONFIG, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/types/finance';
import { useTransactions } from '@/hooks/useTransactions';
import { toast } from 'sonner';

interface ParsedRow {
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: CategoryType;
}

export default function FileUpload() {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedRow[]>([]);
  const [columnMapping, setColumnMapping] = useState({
    date: '',
    description: '',
    amount: '',
  });
  const [headers, setHeaders] = useState<string[]>([]);
  const [step, setStep] = useState<'upload' | 'mapping' | 'preview' | 'done'>('upload');
  
  const { addBulkTransactions } = useTransactions();

  const parseCSV = (text: string): { headers: string[]; rows: string[][] } => {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const rows = lines.slice(1).map(line => {
      const values: string[] = [];
      let current = '';
      let inQuotes = false;
      
      for (const char of line) {
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.trim());
      return values;
    });
    
    return { headers, rows };
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    
    const text = await selectedFile.text();
    const { headers: fileHeaders } = parseCSV(text);
    setHeaders(fileHeaders);
    setStep('mapping');
  };

  const guessCategory = (description: string, amount: number): { type: TransactionType; category: CategoryType } => {
    const desc = description.toLowerCase();
    
    // Income patterns
    if (desc.includes('salary') || desc.includes('payroll') || desc.includes('direct deposit')) {
      return { type: 'income', category: 'salary' };
    }
    if (desc.includes('freelance') || desc.includes('consulting')) {
      return { type: 'income', category: 'freelance' };
    }
    if (desc.includes('dividend') || desc.includes('interest')) {
      return { type: 'income', category: 'investments' };
    }
    
    // Expense patterns
    if (desc.includes('restaurant') || desc.includes('uber eats') || desc.includes('doordash') || desc.includes('grubhub')) {
      return { type: 'expense', category: 'food' };
    }
    if (desc.includes('uber') || desc.includes('lyft') || desc.includes('gas') || desc.includes('fuel')) {
      return { type: 'expense', category: 'transport' };
    }
    if (desc.includes('netflix') || desc.includes('spotify') || desc.includes('hulu') || desc.includes('disney')) {
      return { type: 'expense', category: 'subscriptions' };
    }
    if (desc.includes('amazon') || desc.includes('walmart') || desc.includes('target')) {
      return { type: 'expense', category: 'shopping' };
    }
    if (desc.includes('rent') || desc.includes('mortgage')) {
      return { type: 'expense', category: 'rent' };
    }
    if (desc.includes('electric') || desc.includes('water') || desc.includes('internet') || desc.includes('utility')) {
      return { type: 'expense', category: 'bills' };
    }
    
    // Default based on amount sign
    if (amount >= 0) {
      return { type: 'income', category: 'other_income' };
    }
    return { type: 'expense', category: 'other_expense' };
  };

  const processMapping = async () => {
    if (!file || !columnMapping.date || !columnMapping.description || !columnMapping.amount) {
      toast.error('Please map all required columns');
      return;
    }

    const text = await file.text();
    const { headers: fileHeaders, rows } = parseCSV(text);
    
    const dateIdx = fileHeaders.indexOf(columnMapping.date);
    const descIdx = fileHeaders.indexOf(columnMapping.description);
    const amountIdx = fileHeaders.indexOf(columnMapping.amount);

    const parsed: ParsedRow[] = rows
      .filter(row => row.length >= Math.max(dateIdx, descIdx, amountIdx) + 1)
      .map(row => {
        const rawAmount = parseFloat(row[amountIdx].replace(/[$,]/g, ''));
        const amount = Math.abs(rawAmount);
        const description = row[descIdx];
        const { type, category } = guessCategory(description, rawAmount);
        
        return {
          date: row[dateIdx],
          description,
          amount,
          type,
          category,
        };
      })
      .filter(row => !isNaN(row.amount) && row.amount > 0);

    setParsedData(parsed);
    setStep('preview');
  };

  const handleImport = async () => {
    const transactions = parsedData.map(row => ({
      amount: row.amount,
      description: row.description,
      category: row.category,
      transaction_type: row.type,
      transaction_date: new Date(row.date).toISOString().split('T')[0],
    }));

    await addBulkTransactions.mutateAsync(transactions);
    setStep('done');
    
    setTimeout(() => {
      setOpen(false);
      setStep('upload');
      setFile(null);
      setParsedData([]);
      setColumnMapping({ date: '', description: '', amount: '' });
    }, 2000);
  };

  const updateRowCategory = (index: number, category: CategoryType) => {
    setParsedData(prev => prev.map((row, i) => 
      i === index ? { 
        ...row, 
        category,
        type: INCOME_CATEGORIES.includes(category) ? 'income' : 'expense'
      } : row
    ));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="h-4 w-4 mr-2" />
          Import CSV
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">Import Transactions</DialogTitle>
        </DialogHeader>

        {step === 'upload' && (
          <div className="mt-4">
            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FileSpreadsheet className="w-10 h-10 mb-3 text-muted-foreground" />
                <p className="mb-2 text-sm text-muted-foreground">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">CSV files only</p>
              </div>
              <input
                type="file"
                className="hidden"
                accept=".csv"
                onChange={handleFileChange}
              />
            </label>
          </div>
        )}

        {step === 'mapping' && (
          <div className="space-y-4 mt-4">
            <p className="text-sm text-muted-foreground">
              Map the columns from your CSV file to the required fields:
            </p>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <Label>Date Column</Label>
                <Select value={columnMapping.date} onValueChange={(v) => setColumnMapping(prev => ({ ...prev, date: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select date column" />
                  </SelectTrigger>
                  <SelectContent>
                    {headers.map(h => (
                      <SelectItem key={h} value={h}>{h}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Description Column</Label>
                <Select value={columnMapping.description} onValueChange={(v) => setColumnMapping(prev => ({ ...prev, description: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select description column" />
                  </SelectTrigger>
                  <SelectContent>
                    {headers.map(h => (
                      <SelectItem key={h} value={h}>{h}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Amount Column</Label>
                <Select value={columnMapping.amount} onValueChange={(v) => setColumnMapping(prev => ({ ...prev, amount: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select amount column" />
                  </SelectTrigger>
                  <SelectContent>
                    {headers.map(h => (
                      <SelectItem key={h} value={h}>{h}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={processMapping} className="w-full gradient-primary text-primary-foreground">
              Process File
            </Button>
          </div>
        )}

        {step === 'preview' && (
          <div className="space-y-4 mt-4">
            <p className="text-sm text-muted-foreground">
              Review the {parsedData.length} transactions below. You can adjust categories if needed:
            </p>
            
            <div className="max-h-[300px] overflow-y-auto space-y-2">
              {parsedData.slice(0, 20).map((row, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg text-sm">
                  <span className="w-20 text-muted-foreground truncate">{row.date}</span>
                  <span className="flex-1 truncate">{row.description}</span>
                  <span className={`w-20 text-right font-medium ${row.type === 'income' ? 'text-success' : 'text-destructive'}`}>
                    {row.type === 'income' ? '+' : '-'}${row.amount.toFixed(2)}
                  </span>
                  <Select value={row.category} onValueChange={(v) => updateRowCategory(idx, v as CategoryType)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <div className="text-xs font-medium text-muted-foreground px-2 py-1">Income</div>
                      {INCOME_CATEGORIES.map(cat => (
                        <SelectItem key={cat} value={cat}>
                          {CATEGORY_CONFIG[cat].icon} {CATEGORY_CONFIG[cat].label}
                        </SelectItem>
                      ))}
                      <div className="text-xs font-medium text-muted-foreground px-2 py-1 mt-1">Expenses</div>
                      {EXPENSE_CATEGORIES.map(cat => (
                        <SelectItem key={cat} value={cat}>
                          {CATEGORY_CONFIG[cat].icon} {CATEGORY_CONFIG[cat].label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
              {parsedData.length > 20 && (
                <p className="text-center text-sm text-muted-foreground py-2">
                  ...and {parsedData.length - 20} more transactions
                </p>
              )}
            </div>

            <Button 
              onClick={handleImport} 
              className="w-full gradient-primary text-primary-foreground"
              disabled={addBulkTransactions.isPending}
            >
              {addBulkTransactions.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Import {parsedData.length} Transactions
            </Button>
          </div>
        )}

        {step === 'done' && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-success" />
            </div>
            <p className="text-lg font-medium">Import Complete!</p>
            <p className="text-muted-foreground">Your transactions have been added.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
