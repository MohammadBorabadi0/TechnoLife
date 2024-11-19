import { getCategories } from "@/actions/categories";
import AddBrandScreen from "@/screens/admin/brands/AddBrandScreen";

const AddBrandPage = async () => {
    const { data: categories } = await getCategories();
    return <AddBrandScreen categories={categories} />;
};

export default AddBrandPage;
