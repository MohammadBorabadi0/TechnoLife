import { getColors } from "@/actions/colors";
import ColorsScreen from "@/screens/admin/colors/ColorsScreen";

const ColorsPage = async ({
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
        data: colors,
        success,
        totalPages,
    } = await getColors(+page, +limit, search);

    if (!success) {
        return <div>مشکلی در هنگام بارگذاری صفحه به وجود آمد.</div>;
    }

    return (
        <ColorsScreen
            colors={colors}
            page={+page}
            limit={+limit}
            totalPages={totalPages}
        />
    );
};

export default ColorsPage;
