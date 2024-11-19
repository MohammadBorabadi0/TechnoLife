export interface Favorites {
    products: string[];
}

export interface Banner {
    _id: string;
    name: string;
    imageUrl: string;
    mobileImageUrl: string;
    url: string;
    selectedLocationBanner: string;
    isActive: boolean;
    createdAt: string;
    updateAt: string;
}

export interface Cart {
    _id: number;
    productId: string;
    quantity: number;
    colorId: string;
    discount: number;
    price: number;
}

export interface Brand {
    _id: string;
    name: string;
    categories: {
        _id: string;
        category: string;
        imageUrl: string;
        isActive: boolean;
    }[];
    createdAt: string;
    updatedAt: string;
}

export interface Category {
    _id: string;
    name: string;
    imageUrl: string;
    iconUrl: string;
    subCategories: SubCategory[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface SubCategory {
    name: string;
    items: string[];
}

export interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
    mobile?: string;
    isAdmin: boolean;
    nationalCode?: string;
    cardNumber?: number;
    createdAt: string;
    updatedAt: string;
}

export interface Image {
    _id: string;
    file: string;
    color: string;
    price: number;
}

export interface Specifications {
    fiveG: boolean;
    gaming: boolean;
    flagship: boolean;
    simplePhone: boolean;
    cpu: string;
    gpu: string;
    ram: string;
    os: string;
    memory: string;
    screenSize: string;
    screenType: string;
    mainCamera: string;
    selfieCamera: string;
    battery: string;
    sensors: string;
    connectionType: string;
    bluetooth: string;
    weight: string;
    dimensions: string;
    outputPower: string;
}

interface Review {
    _id: string;
    name: string;
    rating: number;
    comment: string;
    positivePoints: string;
    negativePoints: string;
    createdAt: string;
    updatedAt: string;
}

export interface Product {
    _id: string;
    name: string;
    category: string;
    brand: string;
    isActive: boolean;
    description: string;
    orderCount?: number;
    discount: number;
    discountTime: number;
    countInStock: number;
    rating: number;
    images: Image[];
    specifications: Specifications;
    reviews: Review[];
    createdAt: string;
    updatedAt: string;
}

export interface Order {
    _id: string;
    user: {
        _id: string;
    };
    shippingAddress: {
        province: string;
        city: string;
        postalAddress: string;
        postalCode: string;
        quarter: string;
        houseNumber: number;
        phoneNumber: string;
    };
    paymentResult: {
        email_address: string;
        status: string;
    };
    orderItems: Array<{
        _id: string;
        name: string;
        quantity: number;
        image: string;
        price: number;
        color: string;
        product: string;
    }>;
    orderCode: string;
    trackingNumber: number;
    paymentMethod: string;
    sendCompany: string;
    totalPrices: number;
    totalPricesAfterDiscount: number;
    shippingCost: number;
    totalDiscountAmount: number;
    isPaid: boolean;
    isDelivered: boolean;
    createdAt: string;
    updatedAt: string;
    paidAt: string;
}

export interface AddressFormValues {
    firstname: string;
    lastname: string;
    phonenumber: string;
    province: string;
    city: string;
    quarter: string;
    postalAddress: string;
    housenumber: string;
    postalCode: string;
}
