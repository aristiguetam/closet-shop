
import useSWR from "swr";

import { IUser } from "@/interfaces";

export const useUsers = () => {

    const { data, error } = useSWR<IUser[]>('/api/admin/users');
    
    return {
        data: data || [],
        error ,
    }

}
