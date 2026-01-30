export type PaymentChannel = {
    code: string;
    name: string;
    method: 'va' | 'qris' | 'cstore' | 'ewallet';
    fee?: number;
    logo?: string;
    group: 'Virtual Account' | 'Retail' | 'QRIS' | 'E-Wallet';
    minAmount?: number;
};

export const PAYMENT_CHANNELS: PaymentChannel[] = [
    // QRIS
    {
        code: 'qris',
        name: 'QRIS',
        method: 'qris',
        group: 'QRIS',
        logo: '/payment/qris.png',
        minAmount: 1000
    },
    // Virtual Accounts
    {
        code: 'bca',
        name: 'BCA Virtual Account',
        method: 'va',
        group: 'Virtual Account',
        logo: '/payment/bca.png',
        minAmount: 10000
    },
    {
        code: 'mandiri',
        name: 'Mandiri Virtual Account',
        method: 'va',
        group: 'Virtual Account',
        logo: '/payment/mandiri.png',
        minAmount: 10000
    },
    {
        code: 'bni',
        name: 'BNI Virtual Account',
        method: 'va',
        group: 'Virtual Account',
        logo: '/payment/bni.png',
        minAmount: 10000
    },
    {
        code: 'bri',
        name: 'BRI Virtual Account',
        method: 'va',
        group: 'Virtual Account',
        logo: '/payment/bri.png',
        minAmount: 10000
    },
    {
        code: 'cimb',
        name: 'CIMB Niaga VA',
        method: 'va',
        group: 'Virtual Account',
        logo: '/payment/cimb.png',
        minAmount: 10000
    },
    {
        code: 'permata',
        name: 'Permata Virtual Account',
        method: 'va',
        group: 'Virtual Account',
        logo: '/payment/permata.png',
        minAmount: 10000
    },
    // Retail
    {
        code: 'indomaret',
        name: 'Indomaret',
        method: 'cstore',
        group: 'Retail',
        logo: '/payment/indomaret.png',
        minAmount: 10000
    },
    {
        code: 'alfamart',
        name: 'Alfamart',
        method: 'cstore',
        group: 'Retail',
        logo: '/payment/alfamart.png',
        minAmount: 10000
    },
    // E-Wallets
    {
        code: 'dana',
        name: 'DANA',
        method: 'ewallet',
        group: 'E-Wallet',
        logo: '/payment/dana.png',
        minAmount: 10000
    },
    {
        code: 'ovo',
        name: 'OVO',
        method: 'ewallet',
        group: 'E-Wallet',
        logo: '/payment/ovo.png',
        minAmount: 10000
    },
    {
        code: 'shopeepay',
        name: 'ShopeePay',
        method: 'ewallet',
        group: 'E-Wallet',
        logo: '/payment/shopeepay.png',
        minAmount: 10000
    },
    {
        code: 'linkaja',
        name: 'LinkAja',
        method: 'ewallet',
        group: 'E-Wallet',
        logo: '/payment/linkaja.png',
        minAmount: 10000
    }
];
