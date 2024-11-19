import { getBrand } from "@/actions/brands";
import { getCategories } from "@/actions/categories";
import EditBrandScreen from "@/screens/admin/brands/EditBrandScreen";

const EditBrandPage = async ({ params }: { params: { id: string } }) => {
    const { id } = await params;
    const { data: brand } = await getBrand(id);
    const { data: categories } = await getCategories();

    return <EditBrandScreen brand={brand} categories={categories} />;
};

export default EditBrandPage;
