import { DefaultAzureCredential } from '@azure/identity';

export class AzureAdmin {
    private credential: DefaultAzureCredential;

    constructor() {
        this.credential = new DefaultAzureCredential();
    }

    public getCredential(): DefaultAzureCredential {
        return this.credential;
    }
}

export default AzureAdmin;