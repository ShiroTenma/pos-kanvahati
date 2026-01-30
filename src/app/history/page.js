"use client"
import { useHistory } from '@/hooks/useHistory';
import { HistoryHeader } from '@/components/history/HistoryHeader';
import { HistoryTable } from '@/components/history/HistoryTable';
import { Toast } from '@/components/pos/Toast'; // Reusing the toast component

export default function HistoryPage() {
  const {
    loading,
    searchQuery,
    setSearchQuery,
    toast,
    showToast,
    filteredTransactions
  } = useHistory();

  return (
    <div className="p-6 h-screen overflow-y-auto bg-base-200 text-neutral font-sans relative">
      <Toast toast={toast} />

      <HistoryHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filteredTransactions={filteredTransactions}
        showToast={showToast}
        loading={loading}
      />

      <HistoryTable
        loading={loading}
        transactions={filteredTransactions}
      />
    </div>
  );
}
