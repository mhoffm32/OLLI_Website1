import React, { useState, useEffect } from 'react';

function DeleteReviews() {
    const [reviews, setReviews] = useState([]);
    const [selectedReview, setSelectedReview] = useState(null);
    const [text, setText] = useState('');

    useEffect(() => {
        fetch('/getReviews')
            .then(response => response.json())
            .then(data => {
                setReviews(data);
            })
            .catch(error => console.error('Error fetching reviews:', error));
    }, []);
    
   const selectReview = (event) => {
        setSelectedReview(JSON.parse(event.target.value));
    }

    const deleteReview = async () => {
        setText('');
        if (!selectedReview) {
            setText('Please select a review to delete');
            return;
        }
        try {
            const response = await fetch('/deleteReview', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(selectedReview),
            });
            const res = await response.json();
            if (response.ok) {
                console.log("Review successfully deleted");
                setText("Review successfully deleted");
                fetch('/getReviews')
                    .then(response => response.json())
                    .then(data => {
                        setReviews(data);
                    })
                    .catch(error => console.error('Error fetching reviews:', error));
                setSelectedReview(null);
            } else {
                setText("Error occurred while deleting review");
                console.log("error occurred: ", res);
            }
        } catch(error) {
            console.log(error);
        }
    };

    return (
        <div className="deleteReviews">
            <h1>Delete Reviews</h1>
            <select onChange={selectReview}>
                <option value="">Select a review to delete</option>
                {reviews.map(review => (
                    <option key={review._id} value={JSON.stringify(review)}>
                        {review.username} - {review.date} - {review.rating} - {review.content}
                    </option>
                ))}
            </select>
            <button id='delete-review-btn' onClick={deleteReview}>Delete</button>
            <p>{text}</p>   
        </div>
    );
}

export default DeleteReviews;
