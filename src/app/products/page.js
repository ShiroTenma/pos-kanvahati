"use client"
import { useProductsCRUD } from '@/hooks/useProductsCRUD';
import { ProductsHeader } from '@/components/products/ProductsHeader';
import { ProductsTable } from '@/components/products/ProductsTable';
import { ProductFormModal } from '@/components/products/ProductFormModal';

export default function ProductManagement() {
  const {
    isLoading,
    searchQuery,
    setSearchQuery,
    isModalOpen,
    isEditMode,
    formData,
    setFormData,
    openModal,
    closeModal,
    handleSubmit,
    handleDelete,
    filteredProducts
  } = useProductsCRUD();

  return (
    <div className="p-6 bg-base-200 min-h-screen text-neutral font-sans">
      <ProductsHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onAddClick={() => openModal('add')}
      />
      <ProductsTable
        isLoading={isLoading}
        products={filteredProducts}
        onEditClick={(product) => openModal('edit', product)}
        onDeleteClick={handleDelete}
      />
      <ProductFormModal
        isOpen={isModalOpen}
        isEditMode={isEditMode}
        formData={formData}
        setFormData={setFormData}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
