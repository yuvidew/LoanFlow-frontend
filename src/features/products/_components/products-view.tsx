"use client";

import { PencilIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { EntityContainer } from "@/components/common/entity-components/entity-container";
import { EntityEmptyView } from "@/components/common/entity-components/entity-empty-view";
import { EntityHeader } from "@/components/common/entity-components/entity-header";
import {
  EntityList,
  type EntityListColumn,
} from "@/components/common/entity-components/entity-list";
import { EntityPagination } from "@/components/common/entity-components/entity-pagination";
import { EntitySearch } from "@/components/common/entity-components/entity-search";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/features/auth/hooks/use-auth";
import type { Product } from "@/features/products/types";
import { formatCurrency, formatToken } from "@/lib/utils";
import { EditAndAddDialog } from "../../../components/common/edit-add-dialog";
import {
  useCreateProduct,
  useProductList,
  useUpdateProduct,
} from "../hooks/use-products";
import { ProductForm, type ProductFormValues } from "./product-form";

const PAGE_SIZE = 5;

const getErrorMessage = (error: unknown, fallback: string) => {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "data" in error.response &&
    typeof error.response.data === "object" &&
    error.response.data !== null &&
    "message" in error.response.data &&
    typeof error.response.data.message === "string"
  ) {
    return error.response.data.message;
  }

  return fallback;
};

export const ProductsView = () => {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const { data: currentUser } = useCurrentUser();
  const canManageProducts = currentUser?.data.role === "ADMIN";
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const { data, isError, isLoading } = useProductList({
    page,
    limit: PAGE_SIZE,
    search: query.trim() || undefined,
  });

  const apiProducts = data?.data.products ?? [];
  const totalPages = data?.data.pagination.totalPages ?? 1;

  const handleSearchChange = (value: string) => {
    setQuery(value);
    setPage(1);
  };

  const handleAddProduct = async (values: ProductFormValues) => {
    try {
      await createProduct.mutateAsync(values);
      toast.success("Product created successfully");
      setIsOpenDialog(false);
      setPage(1);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to create product"));
    }
  };

  const handleEditProduct = async (values: ProductFormValues) => {
    if (!editingProduct) {
      return;
    }

    try {
      await updateProduct.mutateAsync({
        productId: editingProduct.id,
        payload: values,
      });
      toast.success("Product updated successfully");
      setEditingProduct(null);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to update product"));
    }
  };

  // Define the columns for the EntityList component, specifying how each product property should be displayed in the table.
  const productColumns: EntityListColumn<Product>[] = [
    {
      key: "name",
      header: "Product Name",
      cell: (product) => (
        <div className="min-w-40">
          <p className="font-medium">{product.name}</p>
        </div>
      ),
    },
    {
      key: "description",
      header: "Description",
      cell: (product) => (
        <p className="max-w-72 whitespace-normal text-muted-foreground">
          {product.description}
        </p>
      ),
    },
    {
      key: "ageRange",
      header: "Age Range",
      cell: (product) => (
        <Badge variant="outline">
          {product.minAge}-{product.maxAge}
        </Badge>
      ),
    },
    {
      key: "creditScore",
      header: "Credit Score",
      cell: (product) => (
        <Badge variant="outline">{product.minCreditScore}+</Badge>
      ),
    },
    {
      key: "employmentType",
      header: "Employment Type",
      cell: (product) => (
        <div className="flex max-w-56 flex-wrap gap-1">
          {product.allowedEmploymentTypes.map((type) => (
            <Badge key={type} variant="secondary">
              {formatToken(type)}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      key: "salaryType",
      header: "Salary Type",
      cell: (product) => (
        <div className="flex max-w-48 flex-wrap gap-1">
          {product.allowedSalaryTypes.map((type) => (
            <Badge key={type} variant="secondary">
              {formatToken(type)}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      key: "minimumSalary",
      header: "Minimum Salary",
      cell: (product) => formatCurrency(product.minSalary),
    },
    {
      key: "actions",
      header: "Actions",
      headerClassName: "text-right",
      className: "text-right",
      cell: (product) =>
        canManageProducts ? (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setEditingProduct(product)}
          >
            <PencilIcon className="size-4" />
            Edit
          </Button>
        ) : (
          <span className="text-muted-foreground text-xs">View only</span>
        ),
    },
  ];

  return (
    <>
      <EntityContainer
        header={
          canManageProducts ? (
            <EntityHeader
              title="Products"
              description="Manage loan products and eligibility criteria."
              newButtonLabel="Add Product"
              onNew={() => setIsOpenDialog(true)}
            />
          ) : (
            <EntityHeader
              title="Products"
              description="Manage loan products and eligibility criteria."
            />
          )
        }
        search={
          <EntitySearch
            value={query}
            onChange={handleSearchChange}
            placeholder="Search products"
          />
        }
        pagination={
          apiProducts.length > 0 ? (
            <EntityPagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          ) : undefined
        }
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-10 text-muted-foreground">
            Loading products...
          </div>
        ) : isError ? (
          <div className="flex items-center justify-center py-10 text-destructive">
            Failed to load products.
          </div>
        ) : (
          <EntityList
            items={apiProducts}
            columns={productColumns}
            getKey={(product) => product.id}
            emptyView={
              <EntityEmptyView
                empty_label={query ? "No products found" : "No products"}
                label="Add Product"
                message={
                  query
                    ? "Try a different product name or description."
                    : "Create your first loan product to define eligibility rules."
                }
                onNew={
                  !query && canManageProducts
                    ? () => setIsOpenDialog(true)
                    : undefined
                }
              />
            }
          />
        )}
      </EntityContainer>

      {/* Add Product Dialog */}
      <EditAndAddDialog
        title="Add Product"
        description="Create a loan product and define its eligibility criteria."
        open={isOpenDialog}
        onOpenChange={setIsOpenDialog}
        formComponent={
          <ProductForm
            onCancel={() => setIsOpenDialog(false)}
            onSubmit={handleAddProduct}
            submitLabel={createProduct.isPending ? "Saving..." : "Save Product"}
          />
        }
      />

      {/* Edit Product Dialog */}
      <EditAndAddDialog
        title="Edit Product"
        description="Update the loan product and its eligibility criteria."
        open={!!editingProduct}
        onOpenChange={(open) => {
          if (!open) {
            setEditingProduct(null);
          }
        }}
        formComponent={
          <ProductForm
            defaultValues={editingProduct ?? undefined}
            onCancel={() => setEditingProduct(null)}
            onSubmit={handleEditProduct}
            submitLabel={
              updateProduct.isPending ? "Updating..." : "Update Product"
            }
          />
        }
      />
    </>
  );
};

export default ProductsView;
