export type GiftResponse = {
    id: number;
    name: string;
    description: string;
    price: number;
    image_url?: string;
    payment_url: string;
    external_reference: string;
    quantity: number;
    quantity_gifted: number;
    is_available: boolean;
    created_at: string;
    updated_at: string;
}