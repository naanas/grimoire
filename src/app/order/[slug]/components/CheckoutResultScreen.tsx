import { useState } from 'react';
import { Loader2, CheckCircle, XCircle, Clock, Eye, EyeOff } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useRouter } from 'next/navigation';

import api from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

export type CheckoutResult = {
    id?: string;
    status: string;
    invoice: string;
    productName: string;
    basePrice: string | number;
    amount: string | number;
    adminFee?: number;
    discountAmount?: number;
    paymentName?: string;
    paymentNo?: string;
    paymentUrl?: string;
    product?: { price_sell: number; name?: string };
    targetId?: string;
    zoneId?: string;
    createdAt?: string;
};

type Props = {
    result: CheckoutResult;
    urlTrxId?: string;
    onUpdateResult?: (newResult: any) => void;
};

export default function CheckoutResultScreen({ result, urlTrxId, onUpdateResult }: Props) {
    const router = useRouter();
    const { user } = useAuth();
    const [showPaymentNo, setShowPaymentNo] = useState(false);
    const [checkingStatus, setCheckingStatus] = useState(false);
    const [showGuestReceipt, setShowGuestReceipt] = useState(false);

    return (
        <div className="min-h-[60vh] pt-4 pb-12 px-4 flex items-start justify-center relative">
            <div className="text-center space-y-8 animate-in fade-in zoom-in duration-500 max-w-md w-full relative z-10">
                {/* Status Icon */}
                <div className="flex justify-center mb-6">
                    {result.status === 'SUCCESS' ? (
                        <div className="relative flex items-center justify-center p-4 w-32 h-32 mx-auto">
                            {/* Satanic Pentagram Background Glowing */}
                            <div className="absolute inset-0 flex items-center justify-center animate-[spin_15s_linear_infinite] opacity-50 text-green-500">
                                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(34,197,94,0.8)]">
                                    <polygon points="50,5 20,95 95,35 5,35 80,95" fill="none" stroke="currentColor" strokeWidth="1.5" />
                                    <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="1" />
                                </svg>
                            </div>
                            <div className="absolute inset-0 bg-green-500 blur-3xl opacity-20 animate-pulse"></div>
                            <CheckCircle size={64} className="text-green-400 relative z-20 drop-shadow-[0_0_10px_rgba(34,197,94,1)]" />
                        </div>
                    ) : result.status === 'PROCESSING' ? (
                        <div className="relative flex items-center justify-center p-4 w-32 h-32 mx-auto">
                            {/* Alchemic Transfer Circle */}
                            <div className="absolute inset-0 flex items-center justify-center animate-[spin_4s_linear_infinite] opacity-50 text-blue-500">
                                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]">
                                    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="20 10 5 10" />
                                    <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="10 5" className="animate-[spin_3s_linear_infinite_reverse]" style={{ transformOrigin: 'center' }} />
                                </svg>
                            </div>
                            <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 animate-pulse"></div>
                            <Loader2 size={48} className="text-blue-400 relative z-20 animate-spin drop-shadow-[0_0_10px_rgba(59,130,246,1)]" />
                        </div>
                    ) : result.status === 'FAILED' ? (
                        <div className="relative flex items-center justify-center p-4 w-32 h-32 mx-auto">
                            {/* Shattered Blood Circle */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-60 text-red-600">
                                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_20px_rgba(220,38,38,0.9)] animate-pulse">
                                    <path d="M 20 20 L 80 80 M 80 20 L 20 80" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                                    <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="5 5" />
                                </svg>
                            </div>
                            <div className="absolute inset-0 bg-red-600 blur-3xl opacity-30 animate-pulse"></div>
                            <XCircle size={64} className="text-red-500 relative z-20 drop-shadow-[0_0_15px_rgba(239,68,68,1)]" />
                        </div>
                    ) : (
                        <div className="relative flex items-center justify-center p-4 w-32 h-32 mx-auto">
                            {/* Awaiting Eye/Diamond */}
                            <div className="absolute inset-0 flex items-center justify-center animate-[spin_10s_linear_infinite] opacity-50 text-yellow-500">
                                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(234,179,8,0.8)]">
                                    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1" />
                                    <polygon points="50,10 90,50 50,90 10,50" fill="none" stroke="currentColor" strokeWidth="1" />
                                </svg>
                            </div>
                            <div className="absolute inset-0 bg-yellow-500 blur-3xl opacity-20 animate-pulse"></div>
                            <Clock size={48} className="text-yellow-400 relative z-20 drop-shadow-[0_0_10px_rgba(234,179,8,1)] animate-pulse" />
                        </div>
                    )}
                </div>

                <h2 className={`text-2xl md:text-3xl font-[family-name:var(--font-cinzel)] font-bold uppercase tracking-widest ${
                    result.status === 'SUCCESS' ? 'text-green-400 drop-shadow-[0_0_15px_rgba(34,197,94,0.5)] glitch-text' : 
                    result.status === 'PROCESSING' ? 'text-blue-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]' :
                    result.status === 'FAILED' ? 'text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.8)] glitch-text' :
                    'text-yellow-400 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)] animate-pulse'
                }`} data-text={
                    result.status === 'SUCCESS' ? 'RITUAL COMPLETE' : 
                    result.status === 'FAILED' ? 'OFFERING REJECTED' : ''
                }>
                    {result.status === 'SUCCESS' ? 'Ritual Complete' :
                        result.status === 'PROCESSING' ? 'Soul Transferring...' :
                            result.status === 'FAILED' ? 'Offering Rejected' :
                                'Awaiting Tribute'}
                </h2>

                {/* Receipt Card */}
                <div className="bg-black border border-gray-800 p-8 relative overflow-hidden group text-left" style={{ clipPath: "polygon(5% 0, 95% 0, 100% 5%, 100% 95%, 95% 100%, 5% 100%, 0 95%, 0 5%)" }}>
                    <div className="absolute top-0 left-0 w-full h-1 bg-[var(--blood-red)] shadow-[0_0_10px_red]"></div>

                    <div className="flex justify-between items-center py-4 border-b border-gray-900 border-dashed">
                        <span className="text-gray-500 text-xs uppercase tracking-widest">Invoices</span>
                        <span className="font-mono text-white text-sm">{result.invoice}</span>
                    </div>
                    <div className="flex justify-between items-start py-4 border-b border-gray-900 border-dashed">
                        <span className="text-gray-500 text-xs uppercase tracking-widest">Item</span>
                        <span className="text-white font-bold text-sm text-right flex-1 ml-4">{result.productName || result.product?.name}</span>
                    </div>
                    <div className="flex justify-between items-center py-4 border-b border-gray-900 border-dashed">
                        <span className="text-gray-500 text-xs uppercase tracking-widest">Item Price</span>
                        <span className="text-white font-mono text-sm">
                            Rp {(Number(result.basePrice) || (Number(result.amount || 0) - (Number(result.adminFee || 0)) + (Number(result.discountAmount || 0)))).toLocaleString('id-ID')}
                        </span>
                    </div>

                    {result.discountAmount && result.discountAmount > 0 ? (
                        <div className="flex justify-between items-center py-4 border-b border-gray-900 border-dashed text-green-500">
                            <span className="text-xs uppercase tracking-widest">Voucher Discount</span>
                            <span className="font-mono text-sm">- Rp {result.discountAmount.toLocaleString()}</span>
                        </div>
                    ) : null}

                    <div className="flex justify-between items-center py-4 border-b border-gray-900 border-dashed text-blue-400">
                        <span className="text-xs uppercase tracking-widest">Admin Fee ({result.paymentName || 'Gateway'})</span>
                        <span className="font-mono text-sm">+ Rp {(result.adminFee || 0).toLocaleString()}</span>
                    </div>

                    {/* PAYMENT DETAILS (EMBEDDED) */}
                    {(result.status === 'PENDING' || !result.status) && (
                        <div className="py-6 space-y-4">
                            {result.paymentNo ? (
                                <div className="bg-gray-900/50 p-4 border border-gray-800 rounded text-center">
                                    <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">{result.paymentName || 'Payment Code'}</p>

                                    {(result.paymentName?.toLowerCase().includes('qris') || result.paymentName?.toLowerCase().includes('shopeepay') || (result.paymentNo && result.paymentNo.length > 50)) ? (
                                        <div className="flex justify-center my-4 flex-col items-center">
                                            {/* Render QRIS QR Code using Tripay's QR string */}
                                            {result.paymentNo?.startsWith('http') ? (
                                                <img
                                                    src={result.paymentNo}
                                                    className="w-48 h-48 bg-white p-2 rounded"
                                                    alt="QRIS Code"
                                                />
                                            ) : (
                                                <div className="bg-white p-4 rounded">
                                                    <QRCodeSVG
                                                        value={result.paymentNo}
                                                        size={200}
                                                        level="M"
                                                        includeMargin={false}
                                                    />
                                                </div>
                                            )}
                                            <p className="text-[10px] text-gray-500 mt-2">Scan QRIS above to pay</p>
                                        </div>
                                    ) : (
                                        <div className="relative">
                                            {/* Show/Hide Toggle Button */}
                                            <button
                                                onClick={() => setShowPaymentNo(!showPaymentNo)}
                                                className="absolute -top-8 right-0 flex items-center gap-1 text-xs text-gray-400 hover:text-[var(--blood-red)] transition-colors"
                                            >
                                                {showPaymentNo ? (
                                                    <>
                                                        <EyeOff className="w-3 h-3" />
                                                        <span>Hide</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Eye className="w-3 h-3" />
                                                        <span>Show</span>
                                                    </>
                                                )}
                                            </button>

                                            {/* VA Number Display with Copy */}
                                            <div className="group cursor-pointer" onClick={() => {
                                                navigator.clipboard.writeText(result.paymentNo || '');
                                                alert('VA Number Copied!');
                                            }}>
                                                <p className="text-xl md:text-2xl font-mono font-bold text-white tracking-widest break-all">
                                                    {showPaymentNo
                                                        ? result.paymentNo
                                                        : result.paymentNo?.replace(/./g, '•')}
                                                </p>
                                                <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-[var(--blood-red)] opacity-0 group-hover:opacity-100 transition-opacity">
                                                    CLICK TO COPY
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                result.paymentUrl && (
                                    <div className="text-center">
                                        <p className="text-xs text-gray-400 mb-2">Redirect Required</p>
                                        <a href={result.paymentUrl} target="_self" className="block w-full bg-[var(--blood-red)] hover:bg-red-700 text-black font-bold py-3 px-4 text-xs uppercase tracking-widest rounded transition-all">
                                            PAY NOW
                                        </a>
                                    </div>
                                )
                            )}
                        </div>
                    )}

                    <div className="flex justify-between items-center py-4 border-t border-gray-900 border-dashed">
                        <span className="text-gray-500 text-xs uppercase tracking-widest">Total Payable</span>
                        <span className="text-[var(--blood-red)] font-black text-xl tracking-wide">
                            Rp {(Number(result.amount) || 0).toLocaleString('id-ID')}
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-4">
                    <button
                        id="btn-check-status"
                        onClick={async () => {
                            if (!onUpdateResult) return;
                            setCheckingStatus(true);
                            try {
                                const checkRes = await api.post(`/check-status/${urlTrxId || result.id}`);
                                if (checkRes.data.success && checkRes.data.data.status) {
                                    const trx = checkRes.data.data;
                                    onUpdateResult({
                                        ...result,
                                        ...trx,
                                        basePrice: trx.basePrice || trx.product?.price_sell || result.basePrice
                                    });
                                } else {
                                    alert('Status Unchanged');
                                }
                            } catch (e) {
                                alert('Failed to check');
                            } finally {
                                setCheckingStatus(false);
                            }
                        }}
                        disabled={checkingStatus || !onUpdateResult}
                        className="block w-full border border-gray-800 text-gray-500 hover:text-white hover:border-gray-500 py-3 text-xs uppercase tracking-widest transition-all disabled:opacity-50"
                    >
                        {checkingStatus ? 'SYNCING...' : 'SYNC STATUS'}
                    </button>
                </div>

                {/* Return Buttons */}
                <div className="flex gap-4 mt-8">
                    <button
                        onClick={() => {
                            if (user) {
                                router.push('/profile/transactions');
                            } else {
                                setShowGuestReceipt(true);
                            }
                        }}
                        className="flex-1 py-3 border border-[var(--blood-red)] text-[var(--blood-red)] hover:bg-[var(--blood-red)] hover:text-black font-bold uppercase tracking-widest text-sm transition-all text-center"
                    >
                        HISTORY
                    </button>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="flex-1 py-3 bg-[var(--blood-red)] hover:bg-red-700 text-black font-bold uppercase tracking-widest text-sm transition-all text-center"
                    >
                        NEW ORDER
                    </button>
                </div>
            </div>

            {/* Guest Receipt Modal */}
            {showGuestReceipt && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-[#0a0a0a] border border-[var(--blood-red)] max-w-sm w-full relative shadow-[0_0_30px_rgba(220,38,38,0.2)] overflow-hidden">
                        {/* Receipt Header */}
                        <div className="bg-gradient-to-b from-[#1a0505] to-[#0a0a0a] p-6 text-center border-b border-dashed border-red-900/50">
                            <h2 className="text-[var(--blood-red)] font-[family-name:var(--font-cinzel)] text-2xl font-bold tracking-widest mb-1">GRIMOIRE COINS</h2>
                            <p className="text-gray-500 text-xs font-mono uppercase tracking-widest">Official Invoice Struk</p>
                        </div>

                        {/* Receipt Body - WhatsApp style monospace */}
                        <div className="p-6 font-mono text-sm text-gray-300 space-y-4 relative">
                            <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
                                <svg viewBox="0 0 100 100" className="w-48 h-48 drop-shadow-[0_0_15px_rgba(220,38,38,0.8)]">
                                    <polygon points="50,5 20,95 95,35 5,35 80,95" fill="none" stroke="currentColor" strokeWidth="1.5" />
                                    <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="1" />
                                </svg>
                            </div>

                            <div className="space-y-1 relative z-10">
                                <p className="flex justify-between border-b border-dashed border-gray-800 pb-2">
                                    <span className="text-gray-500">STATUS</span>
                                    <span className={result.status === 'SUCCESS' ? 'text-green-500 font-bold' : result.status === 'PROCESSING' ? 'text-blue-500 font-bold' : 'text-yellow-500 font-bold'}>{result.status}</span>
                                </p>
                                <p className="flex justify-between py-1">
                                    <span className="text-gray-500">TRX ID</span>
                                    <span className="text-white">{result.invoice}</span>
                                </p>
                                <p className="flex justify-between py-1">
                                    <span className="text-gray-500">DATE</span>
                                    <span className="text-white">{result.createdAt ? new Date(result.createdAt).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }) : new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}</span>
                                </p>
                            </div>

                            <div className="space-y-1 pt-2 border-t border-dashed border-gray-800 relative z-10">
                                <p className="flex justify-between py-1">
                                    <span className="text-gray-500">ITEM</span>
                                    <span className="text-white text-right max-w-[150px] truncate">{result.productName || result.product?.name}</span>
                                </p>
                                <p className="flex justify-between py-1">
                                    <span className="text-gray-500">TARGET</span>
                                    <span className="text-white">{result.targetId}{result.zoneId ? ` (${result.zoneId})` : ''}</span>
                                </p>
                                <p className="flex justify-between py-1">
                                    <span className="text-gray-500">PAYMENT</span>
                                    <span className="text-white">{result.paymentName || 'Balance'}</span>
                                </p>
                            </div>

                            <div className="pt-4 mt-2 border-t-2 border-dashed border-[var(--blood-red)] relative z-10">
                                <p className="flex justify-between items-center bg-red-950/20 p-2 rounded">
                                    <span className="text-[var(--blood-red)] font-bold">TOTAL</span>
                                    <span className="text-white font-bold tracking-wider">Rp {Number(result.amount).toLocaleString('id-ID')}</span>
                                </p>
                            </div>
                            
                            <p className="text-center text-[10px] text-gray-500 pt-4 relative z-10 italic">
                                "Terima kasih telah bersekutu dengan Grimoire."
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex border-t border-gray-900 bg-[#050505]">
                            <button
                                onClick={() => {
                                    const text = `*GRIMOIRE COINS - INVOICE*\n\nStatus: ${result.status}\nInvoice: ${result.invoice}\nDate: ${new Date().toLocaleString('id-ID')}\n\nItem: ${result.productName || result.product?.name}\nTarget: ${result.targetId}${result.zoneId ? ` (${result.zoneId})` : ''}\nPayment: ${result.paymentName || 'Balance'}\n\n*Total: Rp ${Number(result.amount).toLocaleString('id-ID')}*\n\nTerima kasih telah topup di Grimoire!`;
                                    navigator.clipboard.writeText(text);
                                    alert('Struk tersalin ke clipboard!');
                                }}
                                className="flex-1 py-4 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white hover:bg-gray-900 transition-colors border-r border-gray-900"
                            >
                                COPY TEXT
                            </button>
                            <button
                                onClick={() => setShowGuestReceipt(false)}
                                className="flex-1 py-4 text-xs font-bold uppercase tracking-widest text-[var(--blood-red)] hover:text-red-400 hover:bg-red-950/30 transition-colors"
                            >
                                CLOSE
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
