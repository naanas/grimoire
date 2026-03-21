'use client';

import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import api from '@/lib/api';

type ReviewFormProps = {
    categorySlug: string;
    onReviewSubmitted?: () => void;
};

export default function ReviewForm({ categorySlug, onReviewSubmitted }: ReviewFormProps) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) setUser(JSON.parse(storedUser));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            setMessage('Please login to submit a review');
            return;
        }

        if (rating === 0) {
            setMessage('Please select a rating');
            return;
        }

        setSubmitting(true);
        setMessage('');

        try {
            // Get category ID from slug
            const categoryRes = await api.get(`/categories/${categorySlug}`);
            const categoryId = categoryRes.data.data.id;

            await api.post('/reviews',
                { categoryId, rating, comment: comment.trim() || null }
            );

            setMessage('✅ Review submitted! Awaiting admin approval.');
            setRating(0);
            setComment('');

            if (onReviewSubmitted) onReviewSubmitted();
        } catch (error: any) {
            setMessage(error.response?.data?.message || 'Failed to submit review');
        } finally {
            setSubmitting(false);
        }
    };

    if (!user) {
        return (
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 text-center">
                <p className="text-neutral-400">
                    <a href="/login" className="text-red-500 hover:underline">Login</a> to write a review
                </p>
            </div>
        );
    }

    return (
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4">Write a Review</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Star Rating */}
                <div>
                    <label className="block text-sm text-neutral-400 mb-2">Your Rating</label>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                className="transition-transform hover:scale-110"
                            >
                                <Star
                                    size={32}
                                    className={`${star <= (hoverRating || rating)
                                            ? 'fill-yellow-500 text-yellow-500'
                                            : 'text-neutral-700'
                                        } transition-colors`}
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Comment */}
                <div>
                    <label className="block text-sm text-neutral-400 mb-2">
                        Your Review (Optional)
                    </label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Share your experience with this game..."
                        rows={4}
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-red-500"
                        maxLength={500}
                    />
                    <p className="text-xs text-neutral-500 mt-1">{comment.length}/500</p>
                </div>

                {/* Message */}
                {message && (
                    <div className={`text-sm p-3 rounded-lg ${message.includes('✅')
                            ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                            : 'bg-red-500/10 text-red-400 border border-red-500/30'
                        }`}>
                        {message}
                    </div>
                )}

                {/* Submit */}
                <button
                    type="submit"
                    disabled={submitting || rating === 0}
                    className="w-full bg-red-600 hover:bg-red-700 disabled:bg-neutral-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                    {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
            </form>
        </div>
    );
}
