import useSWR from "swr";
import { IOrder } from "@/interfaces";

export const useOrders = () => {
    const { data, error } = useSWR<IOrder[]>('/api/admin/orders');

    return {
        data: data || [],
        error,
    }

}
