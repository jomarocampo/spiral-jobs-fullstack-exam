

export interface UserSearchOptionsDef {
    field: string;
    label: string;
}

export interface UserListDataDef {
    id: number; 
    name: number;
    email: string;
    created_by: string;
    created_date: string;
}
export interface UserListDataResponseDef {
    error: string;
    result: UserListDataDef[];
    count: number;
}

export interface UserListPayloadDef {
    pagination_start: number;
    pagination_end: number;
    filter_by: string;
    filter_value: string;
    is_deleted: boolean;
    order_id: 'ASC' | 'DESC' | '';
    order_name: 'ASC' | 'DESC' | '';
    order_email: 'ASC' | 'DESC' | '';
    order_created_by: 'ASC' | 'DESC' | '';
    order_created_date: 'ASC' | 'DESC' | '';
    is_fetching: boolean
}