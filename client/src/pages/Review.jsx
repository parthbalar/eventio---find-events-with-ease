import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Review = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch('http://localhost:4000/api/review');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setReviews(data);
            } catch (error) {
                console.error('Error fetching reviews:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    const groupByEventId = (reviews) => {
        return reviews.reduce((acc, review) => {
            if (!acc[review.eventid]) {
                acc[review.eventid] = [];
            }
            acc[review.eventid].push(review);
            return acc;
        }, {});
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }).map((_, i) => (
            <motion.span
                key={i}
                className={i < rating ? "text-yellow-500" : "text-gray-300"}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.05, type: 'spring', stiffness: 300 }}
            >
                {i < rating ? '★' : '☆'}
            </motion.span>
        ));
    };

    if (loading) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-screen gap-4 bg-gray-100"
            >
                <motion.div
                    animate={{
                        rotate: 360,
                        scale: [1, 1.2, 1]
                    }}
                    transition={{
                        rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                        scale: { duration: 1, repeat: Infinity, repeatType: "reverse" }
                    }}
                    className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full"
                />
                <motion.p
                    className="text-lg font-semibold text-gray-700"
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    Loading reviews...
                </motion.p>
            </motion.div>
        );
    }

    if (error) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center h-screen bg-gray-100"
            >
                <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-lg">
                    <motion.div
                        className="text-red-500 text-4xl mb-4 text-center"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 0.5 }}
                    >
                        ⚠️
                    </motion.div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Reviews</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        onClick={() => window.location.reload()}
                    >
                        Try Again
                    </motion.button>
                </div>
            </motion.div>
        );
    }

    const groupedReviews = groupByEventId(reviews);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6 md:p-8"
        >
            <motion.div
                className="max-w-5xl mx-auto"
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <motion.h1
                    className="text-4xl font-bold text-center text-blue-800 mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    Customer Reviews
                </motion.h1>
                <motion.p
                    className="text-center text-gray-600 mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    Hear what our customers have to say about our events
                </motion.p>

                <AnimatePresence>
                    {Object.keys(groupedReviews).length > 0 ? (
                        Object.entries(groupedReviews).map(([eventid, reviews], index) => (
                            <motion.div
                                key={eventid}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 + 0.4 }}
                                className="mb-12"
                            >
                                <h2 className="text-2xl font-semibold text-blue-700 mb-4 pb-2 border-b border-gray-300">
                                    {reviews[0].eventname || "Unknown Event"}
                                </h2>

                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {reviews.map((review, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: i * 0.1 + index * 0.05 }}
                                            className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition duration-200"
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <p className="font-medium text-gray-800">
                                                    {review.name || "Anonymous"}
                                                </p>
                                                <div className="flex items-center gap-1 text-xl">
                                                    {renderStars(review.rating)}
                                                </div>
                                            </div>
                                            <motion.p
                                                className="text-gray-600 italic pl-2 border-l-4 border-blue-300"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.3 }}
                                            >
                                                "{review.comment}"
                                            </motion.p>
                                            <motion.div
                                                className="mt-4 text-right text-sm text-gray-400"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.4 }}
                                            >
                                                {new Date(review.date || Date.now()).toLocaleDateString()}
                                            </motion.div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-center py-12"
                        >
                            <div className="inline-block p-6 bg-white rounded-full shadow-md mb-4">
                                <span className="text-4xl">📝</span>
                            </div>
                            <h3 className="text-xl font-medium text-gray-700 mb-2">No Reviews Yet</h3>
                            <p className="text-gray-500">Be the first to share your experience!</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
};

export default Review;
