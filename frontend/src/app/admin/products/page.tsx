import { getBrands } from "@/actions/brands";
import { getProducts } from "@/actions/products";
import { getCategories } from "@/actions/categories";
import { Brand, Category, Product } from "@/utils/types";
import ProductsScreen from "@/screens/admin/products/ProductsScreen";

const ProductsPage = async ({
    searchParams,
}: {
    searchParams?: {
        page?: string;
        limit?: string;
        search?: string;
    };
}) => {
    const params = await searchParams;

    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const search = params?.search || "";

    const {
        data: products,
        success: productsSuccess,
        totalPages,
    } = await getProducts(+page, +limit, search);
    const { data: categories, success: categoriesSuccess } =
        await getCategories();
    const { data: brands, brands: brandsSuccess } = await getBrands();

    const categoryMap = Object.fromEntries(
        categories.map((category: Category) => [category._id, category.name])
    );

    const brandMap = Object.fromEntries(
        brands.map((brand: Brand) => [brand._id, brand.name])
    );

    const productsWithCategoryNames = products.map((product: Product) => ({
        ...product,
        category: categoryMap[product.category],
        brand: brandMap[product.brand],
    }));

    if (!(brandsSuccess || productsSuccess || categoriesSuccess)) {
        return <div>مشکلی در گرفتن اطلاعات این صفحه به وجود آمد.</div>;
    }

    return (
        <ProductsScreen
            products={productsWithCategoryNames}
            page={+page}
            limit={+limit}
            totalPages={totalPages}
        />
    );
};

export default ProductsPage;
