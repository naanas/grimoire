'use client';

import { useEffect, useState } from 'react';
import { Star, Loader2 } from 'lucide-react';
import axios from 'axios';

const API = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
});

type ReviewStatsProps = {
    categorySlug: string;
};

type Stats = {
    avgRating: number;
    totalReviews: number;
    distribution: {
        5: number;
        4: number;
        3: number;
        2: number;
        1: number;
    };
};

export default function ReviewStats({ categorySlug }: ReviewStatsProps) {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, [categorySlug]);

    const fetchStats = async () => {
        try {
            const res = await API.get(`/reviews/stats?categorySlug=${categorySlug}`);
            setStats(res.data.data);
        } catch (error) {
            console.error('Failed to fetch review stats', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-8">
                <Loader2 className="animate-spin text-red-600" size={24} />
            </div>
        );
    }

    if (!stats || stats.totalReviews === 0) {
        return (
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 text-center">
                <p className="text-neutral-500">No ratings yet</p>
            </div>
        );
    }

    const maxCount = Math.max(...Object.values(stats.distribution));

    return (
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
            {/* Average Rating */}
            <div className="flex items-center gap-6 mb-6 pb-6 border-b border-neutral-800">
                <div className="text-center">
                    <div className="text-5xl font-bold text-white mb-2">
                        {stats.avgRating.toFixed(1)}
                    </div>
                    <div className="flex items-center justify-center gap-1 mb-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                size={20}
                                className={`${star <= Math.round(stats.avgRating)
                                        ? 'fill-yellow-500 text-yellow-500'
                                        : 'text-neutral-700'
                                    }`}
                            />
                        ))}
                    </div>
                    <p className="text-sm text-neutral-500">
                        {stats.totalReviews} {stats.totalReviews === 1 ? 'review' : 'reviews'}
                    </p>
                </div>

                {/* Rating Distribution */}
                <div className="flex-1 space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => {
                        const count = stats.distribution[rating as keyof typeof stats.distribution];
                        const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;

                        return (
                            <div key={rating} className="flex items-center gap-2 text-sm">
                                <div className="flex items-center gap-1 w-12">
                                    <span className="text-neutral-400">{rating}</span>
                                    <Star size={14} className="fill-yellow-500 text-yellow-500" />
                                </div>
                                <div className="flex-1 bg-neutral-800 rounded-full h-2 overflow-hidden">
                                    <div
                                        className="bg-yellow-500 h-full rounded-full transition-all"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                                <span className="text-neutral-500 w-12 text-right">
                                    {count}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
