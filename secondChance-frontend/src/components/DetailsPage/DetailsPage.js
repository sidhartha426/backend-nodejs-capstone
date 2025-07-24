import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { urlConfig } from "../../config"
import { useAppContext } from '../../context/AppContext';

import './DetailsPage.css';

function DetailsPage() {
    const navigate = useNavigate();
    const { itemId } = useParams();
    const [gift, setGift] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [commentLoading, setCommentLoading] = useState(false);
    const [comment, setComment] = useState('');
    const { isLoggedIn } = useAppContext();

    const fetchItem = useCallback(async () => {
        try {
            const response = await fetch(`${urlConfig.backendUrl}/api/secondchance/items/${itemId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setGift(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, [itemId]);

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/app/login')
        }
        // Scroll to top on component mount
        window.scrollTo(0, 0);
        fetchItem();
        window.scrollTo(0, 0);
    }, [itemId, isLoggedIn, navigate, fetchItem]);

    const handleBackClick = () => {
        navigate(-1); // Navigates back to the previous page
    };

    const handleAddComment = async () => {
        if (!comment.trim()) return;

        try {
            setCommentLoading(true);
            const res = await fetch(`${urlConfig.backendUrl}/api/secondchance/items/${gift.id}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    author: `${sessionStorage.getItem('name')} ${sessionStorage.getItem('surname')}`,
                    comment: comment.trim(),
                }),
            });

            if (!res.ok) {
                throw new Error('Failed to post comment');
            }

            await res.json();
            await fetchItem();
            setComment('');

        } catch (err) {
            console.error(err);
        } finally {
            setCommentLoading(false);
        }

    };

    const handleDeleteClick = async () => {
        setDeleteLoading(true);
        const response = await fetch(`${urlConfig.backendUrl}/api/secondchance/items/${itemId}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        await response.json();
        setDeleteLoading(false);
        navigate(-1); // Navigates back to the previous page
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!gift) return <div className="container mt-5">Gift not found</div>;

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between mb-3">
                <button className="btn btn-secondary" onClick={handleBackClick}>Back</button>
                <button disabled={deleteLoading} className="btn btn-danger" onClick={handleDeleteClick}>
                    {
                        deleteLoading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Deleting...
                            </>
                        ) : ("Delete")

                    }
                </button>
            </div>
            <div className="card product-details-card">
                <div className="card-header text-white">
                    <h2 className="details-title">{gift.name}</h2>
                </div>
                <div className="card-body">
                    <div className="image-placeholder-large">
                        {gift.image ? (
                            <img src={urlConfig.backendUrl + gift.image} alt={gift.name} className="product-image-large" />
                        ) : (
                            <div className="no-image-available-large">No Image Available</div>
                        )}
                    </div>
                    {/* Product details */}
                    <p><strong>Category:</strong> {gift.category}</p>
                    <p><strong>Condition:</strong> {gift.condition}</p>
                    <p><strong>Date Added:</strong> {gift.date_added}</p>
                    <p><strong>Age (Years):</strong> {gift.age_years}</p>
                    <p><strong>Description:</strong> {gift.description}</p>
                </div>
            </div>
            <div className="comments-section mt-4">
                <h3 className="mb-3">Comments</h3>
                {gift.comments.length > 0 && gift.comments.map((comment, index) => (
                    <div key={index} className="card mb-3">
                        <div className="card-body">
                            <p className="comment-author"><strong>{comment.author}:</strong></p>
                            <p className="comment-text">{comment.comment}</p>
                        </div>
                    </div>
                ))}
                <div className="card mt-4">
                    <div className="card-body">
                        <div className="mb-3">
                            <label htmlFor="comment" className="form-label">Comment</label>
                            <textarea
                                id="comment"
                                cols="2"
                                className="form-control"
                                placeholder="Enter the comment"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                        </div>

                        <button
                            disabled={commentLoading}
                            className="btn btn-primary w-100 mb-3"
                            onClick={handleAddComment}
                        >
                            {commentLoading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Adding Comment...
                                </>
                            ) : 'Add Comment'}
                        </button>
                    </div>
                </div>

            </div>

        </div>
    );
}

export default DetailsPage;
