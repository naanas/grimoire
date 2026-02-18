'use client';

import { useState, useEffect } from 'react';
import { Star, CheckCircle, Trash2, Loader2, MessageSquare } from 'lucide-react';
import axios from 'axios';

const API = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
});

type Review = {
    id: string;
    rating: number;
    comment: string | null;
    isApproved: boolean;
    createdAt: string;
    user: {
        name: string | null;
        email: string;
    };
    category: {
        name: string;
        slug: string;
    };
};

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'pending'>('pending');
    const [processing, setProcessing] = useState<string | null>(null);

    useEffect(() => {
        fetchReviews();
    }, [filter]);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const url = filter === 'pending' ? '/admin/reviews?pending=true' : '/admin/reviews';
            const res = await API.get(url, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReviews(res.data.data);
        } catch (error) {
            console.error('Failed to fetch reviews', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: string) => {
        setProcessing(id);
        try {
            const token = localStorage.getItem('token');
            await API.patch(`/admin/reviews/${id}/approve`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Remove from list after approval
            setReviews(prev => prev.filter(r => r.id !== id));
        } catch (error) {
            console.error('Failed to approve review', error);
            alert('Failed to approve review');
        } finally {
            setProcessing(null);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this review?')) return;

        setProcessing(id);
        try {
            const token = localStorage.getItem('token');
            await API.delete(`/admin/reviews/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setReviews(prev => prev.filter(r => r.id !== id));
        } catch (error) {
            console.error('Failed to delete review', error);
            alert('Failed to delete review');
        } finally {
            setProcessing(null);
        }
    };

    const pendingCount = reviews.filter(r => !r.isApproved).length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <MessageSquare className="text-red-600" size={32} />
                        Review Management
                    </h1>
                    <p className="text-neutral-400 mt-1">Moderate user-submitted reviews</p>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0">
                    <button
                        onClick={() => setFilter('pending')}
                        className={`whitespace-nowrap px-6 py-2 rounded-lg font-semibold transition-colors flex-1 lg:flex-none text-center ${filter === 'pending'
                            ? 'bg-red-600 text-white'
                            : 'bg-neutral-800 text-neutral-400 hover:text-white'
                            }`}
                    >
                        Pending ({pendingCount})
                    </button>
                    <button
                        onClick={() => setFilter('all')}
                        className={`whitespace-nowrap px-6 py-2 rounded-lg font-semibold transition-colors flex-1 lg:flex-none text-center ${filter === 'all'
                            ? 'bg-red-600 text-white'
                            : 'bg-neutral-800 text-neutral-400 hover:text-white'
                            }`}
                    >
                        All Reviews
                    </button>
                </div>
            </div>

            {/* Reviews List */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-red-600" size={40} />
                </div>
            ) : reviews.length === 0 ? (
                <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-20 text-center">
                    <p className="text-neutral-500 text-lg">
                        {filter === 'pending' ? 'No pending reviews' : 'No reviews yet'}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <div
                            key={review.id}
                            className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 md:p-6 hover:border-neutral-700 transition-colors"
                        >
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                {/* Review Content */}
                                <div className="flex-1">
                                    {/* Header */}
                                    <div className="flex flex-col md:flex-row md:items-start justify-between mb-3 gap-2">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-semibold text-white">
                                                    {review.user.name || review.user.email.split('@')[0]}
                                                </h3>
                                                <span className="text-xs text-neutral-500 hidden md:inline">
                                                    {review.user.email}
                                                </span>
                                                {review.isApproved && (
                                                    <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded-full border border-green-500/30">
                                                        Approved
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="flex gap-0.5">
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
                                                <span className="text-sm text-neutral-500">
                                                    {new Date(review.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Game */}
                                    <p className="text-sm text-neutral-400 mb-2">
                                        Game: <span className="text-white font-semibold">{review.category.name}</span>
                                    </p>

                                    {/* Comment */}
                                    {review.comment && (
                                        <p className="text-neutral-300 bg-neutral-800/50 rounded-lg p-4 leading-relaxed">
                                            "{review.comment}"
                                        </p>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex flex-row md:flex-col gap-2 mt-4 md:mt-0 justify-end">
                                    {!review.isApproved && (
                                        <button
                                            onClick={() => handleApprove(review.id)}
                                            disabled={processing === review.id}
                                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-neutral-700 text-white rounded-lg transition-colors disabled:cursor-not-allowed text-sm font-medium"
                                        >
                                            {processing === review.id ? (
                                                <Loader2 className="animate-spin" size={16} />
                                            ) : (
                                                <CheckCircle size={16} />
                                            )}
                                            Approve
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(review.id)}
                                        disabled={processing === review.id}
                                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-neutral-700 text-white rounded-lg transition-colors disabled:cursor-not-allowed text-sm font-medium"
                                    >
                                        {processing === review.id ? (
                                            <Loader2 className="animate-spin" size={16} />
                                        ) : (
                                            <Trash2 size={16} />
                                        )}
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
