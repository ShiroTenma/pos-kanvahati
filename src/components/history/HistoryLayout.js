
import { HistoryHeader } from './HistoryHeader';
import { HistoryTable } from './HistoryTable';
import { Toast } from '../pos/Toast';

export const HistoryLayout = ({
  toast,
  searchQuery,
  setSearchQuery,
  filteredTransactions,
  showToast,
  loading,
}) => {
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
};
