import ProductsView from "@/features/products/_components/products-view";
import { requireAuth } from "@/lib/auth-utils";

const ProductsPage = async() => {
  await requireAuth();
  return <ProductsView />;
};

export default ProductsPage;
