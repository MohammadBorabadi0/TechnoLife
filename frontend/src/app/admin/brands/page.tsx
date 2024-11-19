import { getBrands } from "@/actions/brands";
import BrandScreen from "@/screens/admin/brands/BrandsScreen";

const BrandsPage = async ({
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
        data: brands,
        success,
        totalPages,
    } = await getBrands(+page, +limit, search);

    if (!success) {
        return <div>مشکلی در هنگام بارگذاری صفحه به وجود آمد.</div>;
    }

    return (
        <BrandScreen
            brands={brands}
            page={+page}
            limit={+limit}
            totalPages={totalPages}
        />
    );
};

export default BrandsPage;
