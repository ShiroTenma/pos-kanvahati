"use client";
import { useHistory } from "@/hooks/useHistory";
import { HistoryLayout } from "@/components/history/HistoryLayout";

export default function HistoryPage() {
  const {
    loading,
    searchQuery,
    setSearchQuery,
    toast,
    showToast,
    filteredTransactions,
  } = useHistory();

  return (
    <HistoryLayout
      loading={loading}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      toast={toast}
      showToast={showToast}
      filteredTransactions={filteredTransactions}
    />
  );
}
