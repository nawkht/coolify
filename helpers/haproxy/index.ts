import got from "got";
import { NewTransaction, RawHaproxyConfiguration } from "Helpers/types";

function haproxyInstance() {
    return got.extend({
        prefixUrl: 'http://localhost:5555',
        username: 'haproxy-dataplaneapi',
        password: 'adminpwd'
    });
}
async function getNextTransactionVersion(): Promise<number> {
    const raw: RawHaproxyConfiguration = await haproxyInstance().get(`v2/services/haproxy/configuration/raw`).json()
    if (raw?._version) {
        return raw._version
    }
    return 1
}

async function getNextTransactionId(): Promise<string> {
    const version = await getNextTransactionVersion()
    const newTransaction: NewTransaction = await haproxyInstance().post('v2/services/haproxy/transactions', {
        searchParams: {
            version
        }
    }).json()
    return newTransaction.id
}

async function completeTransaction(transactionId): Promise<void> {
    await haproxyInstance().put(`v2/services/haproxy/transactions/${transactionId}`)
}

export { haproxyInstance, getNextTransactionId, completeTransaction }
