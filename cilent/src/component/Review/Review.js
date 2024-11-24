import React, { useState, useContext, useEffect } from 'react';
import { Star } from 'lucide-react';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import axios from 'axios';
import AuthContext from '../../Context/AuthContext';

const Review = () => {
    const { user } = useContext(AuthContext);
    const [reviews, setReviews] = useState([]);
    const [ratingStats, setRatingStats] = useState({
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0
    });
    const [currentPage, setCurrentPage] = useState(1);
    const reviewsPerPage = 2;
    const [averageRating, setAverageRating] = useState(0);


    console.log('user', user)

    // Hàm render sao
    const renderStars = (count) => {
        return Array(5)
            .fill(0)
            .map((_, index) => (
                <span key={index}>
                    {index < count ? (
                        <AiFillStar className="w-6 h-6 text-yellow-400" />
                    ) : (
                        <AiOutlineStar className="w-6 h-6 text-gray-300" />
                    )}
                </span>
            ));
    };


    // States for rating and review input
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isReviewing, setIsReviewing] = useState(false);
    const [loading, setLoading] = useState(false);

    // Tính toán thống kê đánh giá
    const calculateRatingStats = (reviewsData) => {
        const stats = {
            5: 0,
            4: 0,
            3: 0,
            2: 0,
            1: 0
        };

        reviewsData.forEach(review => {
            stats[review.rating] = (stats[review.rating] || 0) + 1;
        });

        // Tính trung bình đánh giá
        const total = reviewsData.reduce((acc, review) => acc + review.rating, 0);
        const avg = reviewsData.length > 0 ? (total / reviewsData.length).toFixed(1) : 0;

        setRatingStats(stats);
        setAverageRating(avg);
    };

    // Hàm lấy dữ liệu review từ server
    const fetchReviews = async () => {
        try {
            const response = await axios.get('http://localhost:3002/review/getReviews');
            if (response.status === 200) {
                setReviews(response.data);
                calculateRatingStats(response.data);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
            alert('Failed to fetch reviews');
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleStarClick = (star) => {
        setRating(star);
    };

    const handleReviewChange = (e) => {
        setComment(e.target.value);
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (rating === 0 || comment.trim() === '') {
            alert('Please select a rating and write a review');
            return;
        }

        try {
            setLoading(true);

            const reviewData = {
                rating,
                comment,
                userId: user.id,
            };

            const response = await axios.post('http://localhost:3002/review/reviews', reviewData);

            if (response.status === 201) {
                setIsReviewing(false);
                fetchReviews();
                setRating(0);
                setComment('');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Failed to submit review');
        } finally {
            setLoading(false);
        }
    };

    // Tính toán reviews cho trang hiện tại
    const indexOfLastReview = currentPage * reviewsPerPage;
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
    const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
    const totalPages = Math.ceil(reviews.length / reviewsPerPage);

    // Hàm điều hướng trang
    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="bg-[#f5f5f5] text-black py-6">
            <div className="bg-white max-w-6xl mx-auto p-6 rounded-lg shadow-none">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column: Average Rating & Rating Bars */}
                    <div className="flex flex-col items-center mt-8">
                        <div className="flex flex-col items-center">
                            <h3 className="text-lg font-semibold mb-2">Average Rating</h3>
                            <div className="flex items-center mb-4">
                                {renderStars(averageRating)}
                                <span className="ml-2 text-2xl font-bold">{averageRating}</span>
                            </div>
                        </div>

                        <div className="flex flex-col items-center space-y-3 mb-8">
                            {[5, 4, 3, 2, 1].map((stars) => (
                                <div key={stars} className="flex items-center">
                                    <div className="flex space-x-1">
                                        {renderStars(stars)}
                                    </div>
                                    <div className="ml-4 text-sm text-gray-600">
                                        ({ratingStats[stars]})
                                    </div>
                                </div>
                            ))}
                        </div>

                      
                    </div>
                    {/* Right Column: Review Form */}
                    <div>
                        <h3 className="text-2xl font-semibold text-center mb-6">Phản Hồi Khách Hàng</h3>
                        {isReviewing ? (
                            <form onSubmit={handleSubmitReview} className="mt-8 border-t pt-6">
                                <div className="flex items-center mb-4">
                                    <div className="flex space-x-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`w-6 h-6 cursor-pointer ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 fill-gray-300'}`}
                                                onClick={() => handleStarClick(star)}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <textarea
                                    value={comment}
                                    onChange={handleReviewChange}
                                    rows="4"
                                    placeholder="Viết đánh giá của bạn tại đây..."
                                    className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                                />
                                <div className="flex justify-end space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsReviewing(false)}
                                        className="text-gray-600 hover:text-gray-800"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
                                    >
                                        {loading ? 'Đang gửi...' : 'Gửi Đánh Giá'}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div>
                                {currentReviews.map((review) => (
                                    <div key={review.id} className="mt-8 border-t pt-2">
                                        <div className="flex items-center mb-4">
                                            <div className="flex items-center">
                                                <div>
                                                    <div className="flex items-center">
                                                        <h4 className="font-medium mr-2">{review.user.username}</h4>
                                                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded">
                                                            Xác Thực
                                                        </span>
                                                    </div>
                                                    <div className="flex mt-1">{renderStars(review.rating)}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-gray-600">{review.comment}</p>
                                    </div>
                                ))}

                                <div className="flex justify-center space-x-4 mt-6">
                                    <button
                                        onClick={prevPage}
                                        disabled={currentPage === 1}
                                        className={`p-2 rounded-full ${currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
                                    >
                                        <div className="w-6 h-6 flex items-center justify-center">←</div>
                                    </button>
                                    <button
                                        onClick={nextPage}
                                        disabled={currentPage === totalPages}
                                        className={`p-2 rounded-full ${currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-orange-500 text-white hover:bg-indigo-700'} transition-colors`}
                                    >
                                        <div className="w-6 h-6 flex items-center justify-center">→</div>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Review;