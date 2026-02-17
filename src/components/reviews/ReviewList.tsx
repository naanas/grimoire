'use client';

import { useEffect, useState } from 'react';
import { Star, Loader2 } from 'lucide-react';
import axios from 'axios';

const API = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
});

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
            const res = await API.get(`/reviews?categorySlug=${categorySlug}`);
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
                    className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 hover:border-neutral-700 transition-colors"
                >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                        <div>
                            <p className="font-semibold text-white">
                                {review.user.name || review.user.email.split('@')[0]}
                            </p>
                            <div className="flex items-center gap-1 mt-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        size={16}
                                        className={`${star <= review.rating
                                                ? 'fill-yellow-500 text-yellow-500'
                                                : 'text-neutral-700'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                        <p className="text-xs text-neutral-500">
                            {new Date(review.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                            })}
                        </p>
                    </div>

                    {/* Comment */}
                    {review.comment && (
                        <p className="text-neutral-300 leading-relaxed">{review.comment}</p>
                    )}
                </div>
            ))}
        </div>
    );
}
