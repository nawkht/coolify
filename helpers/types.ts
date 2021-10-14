export type RawHaproxyConfiguration = {
    _version: number;
    data: string;
}

export type NewTransaction = {
    _version: number;
    id: string;
    status: string;
}


export type HttpRequestRuleForceSSL = {
    return_hdrs: null;
    cond: string;
    cond_test: string;
    index: number;
    redir_code: number;
    redir_type: string;
    redir_value: string;
    type: string;
}

// TODO: No any please
export type HttpRequestRule = {
    _version: number;
    data: Array<any>;
}

