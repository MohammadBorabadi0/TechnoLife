import { getCategories } from "@/actions/categories";
import CategoriesScreen from "@/screens/admin/CategoriesScreen";

const CategoriesPage = async ({
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
        data: categories,
        success,
        totalPages,
    } = await getCategories(+page, +limit, search);

    if (!success) {
        return <div>مشکلی در هنگام بارگذاری صفحه به وجود آمد.</div>;
    }

    return (
        <CategoriesScreen
            categories={categories}
            page={+page}
            limit={+limit}
            totalPages={totalPages}
        />
    );
};

export default CategoriesPage;
