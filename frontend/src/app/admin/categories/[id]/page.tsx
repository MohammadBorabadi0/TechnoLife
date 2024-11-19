import { getCategory } from "@/actions/categories";
import EditCategoryScreen from "@/screens/admin/categories/EditCategoryScreen";

const EditCategoryPage = async ({ params }: { params: { id: string } }) => {
    const { id } = await params;
    const { data: category } = await getCategory(id);

    return <EditCategoryScreen category={category} />;
};

export default EditCategoryPage;
