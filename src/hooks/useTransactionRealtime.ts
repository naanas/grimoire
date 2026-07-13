'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import api from '@/lib/api';

const TERMINAL_STATUSES = new Set(['SUCCESS', 'FAILED', 'EXPIRED', 'PROVIDER_FAILED']);

const getSocketUrl = () =>
    (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000').replace(/\/api\/?$/, '');

/** Read-only status fetch — no side effects unlike POST /check-status */
async function fetchTransaction(id: string) {
    const res = await api.get(`/check/${id}`);
    if (res.data.success) return res.data.data;
    return null;
}

/** Normalize API / DB transaction into checkout result shape */
export function mapTrxToCheckoutResult(trx: Record<string, any>, fallback?: Record<string, any> | null) {
    if (!trx) return fallback ?? null;
    return {
        ...fallback,
        id: trx.id ?? fallback?.id,
        invoice: trx.invoice ?? fallback?.invoice,
        productName: trx.product?.name ?? trx.productName ?? fallback?.productName,
        amount: trx.amount ?? fallback?.amount,
        paymentUrl: trx.paymentUrl ?? fallback?.paymentUrl,
        paymentNo: trx.paymentNo ?? fallback?.paymentNo,
        paymentName: trx.paymentChannel || trx.paymentMethod || trx.paymentName || fallback?.paymentName,
        status: trx.status || fallback?.status || 'PENDING',
        basePrice: trx.basePrice ?? trx.product?.price_sell ?? fallback?.basePrice ?? 0,
        adminFee: trx.adminFee ?? fallback?.adminFee ?? 0,
        discountAmount: trx.discountAmount ?? fallback?.discountAmount ?? 0,
        sn: trx.sn ?? fallback?.sn,
        expired: trx.expired ?? trx.expiredTime ?? fallback?.expired,
        targetId: trx.targetId ?? fallback?.targetId,
        zoneId: trx.zoneId ?? fallback?.zoneId,
        product: trx.product ?? fallback?.product,
        providerStatus: trx.providerStatus ?? fallback?.providerStatus,
        createdAt: trx.createdAt ?? fallback?.createdAt,
    };
}

export function useTransactionRealtime(id: string | null) {
    const [trx, setTrx] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [connected, setConnected] = useState(false);
    const trxRef = useRef<any>(null);

    const refresh = useCallback(async () => {
        if (!id) return null;
        try {
            const data = await fetchTransaction(id);
            if (data) {
                setTrx(data);
                trxRef.current = data;
            }
            return data;
        } catch (err) {
            console.error('Failed to fetch transaction:', err);
            return null;
        } finally {
            setLoading(false);
        }
    }, [id]);

    // Initial load
    useEffect(() => {
        if (!id) {
            setLoading(false);
            return;
        }
        setLoading(true);
        refresh();
    }, [id, refresh]);

    // Socket: instant push when backend emits transaction_update
    useEffect(() => {
        if (!id) return;

        const socket: Socket = io(getSocketUrl(), {
            transports: ['websocket', 'polling'],
            reconnection: true,
        });

        socket.on('connect', () => {
            setConnected(true);
            socket.emit('join_session', id);
        });

        socket.on('disconnect', () => setConnected(false));

        socket.on('transaction_update', (data: { status?: string; transactionId?: string }) => {
            if (data.transactionId && data.transactionId !== id) return;
            if (data.status && trxRef.current) {
                setTrx((prev: any) => (prev ? { ...prev, status: data.status } : prev));
            }
            refresh();
        });

        return () => {
            socket.disconnect();
            setConnected(false);
        };
    }, [id, refresh]);

    // Fallback poll (read-only GET) — safety net if socket/callback misses an update
    useEffect(() => {
        if (!id) return;
        const status = trx?.status;
        if (status && TERMINAL_STATUSES.has(status)) return;

        const interval = setInterval(() => {
            refresh();
        }, 12000);

        return () => clearInterval(interval);
    }, [id, trx?.status, refresh]);

    return { trx, loading, connected, refresh };
}
