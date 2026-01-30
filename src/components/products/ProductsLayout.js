
import { ProductsHeader } from './ProductsHeader';
import { ProductsTable } from './ProductsTable';
import { ProductFormModal } from './ProductFormModal';

export const ProductsLayout = ({
  isLoading,
  searchQuery,
  setSearchQuery,
  openModal,
  filteredProducts,
  handleDelete,
  isModalOpen,
  isEditMode,
  formData,
  setFormData,
  closeModal,
  handleSubmit,
}) => {
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
};
