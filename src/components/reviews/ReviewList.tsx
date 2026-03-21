'use client';

import { useEffect, useState } from 'react';
import { Star, Loader2 } from 'lucide-react';
import api from '@/lib/api';

type Review = {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    user: {
        name: string | null;
        email: string;
    };
};

type ReviewListProps = {
    categorySlug: string;
};

export default function ReviewList({ categorySlug }: ReviewListProps) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
    }, [categorySlug]);

    const fetchReviews = async () => {
        try {
            const res = await api.get(`/reviews?categorySlug=${categorySlug}`);
            setReviews(res.data.data);
        } catch (error) {
            console.error('Failed to fetch reviews', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 className="animate-spin text-red-600" size={32} />
            </div>
        );
    }

    if (reviews.length === 0) {
        return (
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-12 text-center">
                <p className="text-neutral-500">No reviews yet. Be the first to review!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {reviews.map((review) => (
                <div
                    key={review.id}
                    className="bg-[#050202] border border-dashed border-red-900/40 rounded-sm p-6 hover:border-red-900/80 hover:bg-[#0a0202] hover:shadow-[0_0_15px_rgba(187,10,30,0.1)] transition-all relative group"
                >
                    {/* Subtle red glow corner */}
                    <div className="absolute top-0 right-0 w-16 h-16 bg-[var(--blood-red)] opacity-0 group-hover:opacity-10 blur-2xl transition-opacity"></div>

                    {/* Header */}
                    <div className="flex items-start justify-between mb-4 relative z-10">
                        <div>
                            <p className="font-bold text-red-500 font-mono tracking-wider drop-shadow-[0_0_2px_rgba(220,38,38,0.5)]">
                                {review.user.name || review.user.email.split('@')[0]}
                            </p>
                            <div className="flex items-center gap-1 mt-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        size={14}
                                        className={`${star <= review.rating
                                                ? 'fill-yellow-600 text-yellow-600 drop-shadow-[0_0_5px_rgba(202,138,4,0.5)]'
                                                : 'text-neutral-800'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                        <p className="text-[10px] text-stone-600 font-mono uppercase tracking-widest border border-stone-800 px-2 py-1 rounded-sm bg-black/50">
                            {new Date(review.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                            })}
                        </p>
                    </div>

                    {/* Comment */}
                    {review.comment && (
                        <p className="text-stone-300 leading-relaxed font-[family-name:var(--font-cinzel)] text-md italic tracking-wide relative z-10 border-l-2 border-red-900/30 pl-4 mt-2">
                            "{review.comment}"
                        </p>
                    )}
                </div>
            ))}
        </div>
    );
}
