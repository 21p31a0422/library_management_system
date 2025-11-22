// WishList.java
import React from 'react'
import { useState, useEffect } from "react"
import '../styles/WishList.css'
import axios from 'axios';
import Bookdescription from '../components/Bookdescription';
import Nav from '../components/Nav';
import { useContext } from 'react';
import { LmsContext } from '../context/LmsContext';
import { toast } from "react-toastify"
const WishList = () => {

    const [titles, setTitles] = useState([]);
    const [sampletitle, setSampleTitle] = useState([]);
    const [searchTitle, setSearchTitle] = useState('');
    const [showbutton, setShowButton] = useState(false);
    const [showBookDescription, setShowBookDescription] = useState(false);
    const [index, setIndex] = useState(0);
    const { token, id } = useContext(LmsContext)
    const [bookdata, setBookdata] = useState([
        {
            bookId: 0,
            bookTitle: '',
            bookType: '',
            author: '',
            bookLanguage: '',
            availableCopies: 0,
            bookImage: '',
            createdAt: '',
            description: '',
            totalCopies: 0
        }
    ]);
    const handleSearchTitle = (e) => {

        setSampleTitle(e.target.value);
        setSearchTitle(e.target.value);
       
    }
    const handleSearch = async (e) => {
        setSearchTitle(e.target.innerText);
        setSampleTitle('');
        setShowButton(true);
    }
    useEffect(() => {
        const fetchtitles = async () => {
            try {
                const titles = await axios.get('http://localhost:8081/lms/book/getAllTitles');
                if (titles.data) {
                    setTitles(titles.data);
                    console.log("Titles fetched from api", titles.data);
                }
            }
            catch (e) {
                console.log(e);
            }
        }
        fetchtitles();
    }, [])

   const fetchData = async () => {

        try {
            // Get wishlist book titles
            const wishlistRes = await axios.get(
                `http://localhost:8081/lms/wishlist/getBooksFromWishlist?borrowerId=${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const newTitles = wishlistRes.data;
            console.log("Fetched titles:", newTitles);
            if (!newTitles || newTitles.length === 0) {
                setBookdata([]);
                return;
            }

            // Fetch book details for each title
            const detailRequests = newTitles.map((title) =>
                axios.get(
                    `http://localhost:8081/lms/book/getBook?bookTitle=${title}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
            );

            // Wait for all book detail requests
            const detailResponses = await Promise.all(detailRequests);
            const books = detailResponses.map((r) => r.data);

            // Update state 
            setBookdata(books);

        } catch (e) {
            console.error("Error fetching wishlist or book details:", e);
            setBookdata([])
        }
    };
    useEffect(() => {
         

        fetchData();
    }, []);


    const handleAddToWishlist = async () => {
        if (searchTitle.trim() === '') {
            toast.error('Please enter a book title to add to your wishlist.');
            return;
        }

        if (bookdata.some(book => book.bookTitle === searchTitle.trim())) {
            toast.error('This book is already in your wishlist.');
            return;
        }

        try {
            const response = await axios.post(
                'http://localhost:8081/lms/wishlist/addToWishlist',
                { borrowerId: id, bookTitle: searchTitle },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                }
            );

            if (response.data) {
                fetchData();
                toast.success('Book added to wishlist successfully!');
                setSearchTitle('');
                setShowButton(false);
            } else {
                toast.error('Failed to add book to wishlist.');
            }
        } catch (error) {
            console.error('Error adding book to wishlist:', error);
            toast.error('An error occurred while adding the book to your wishlist.');
        }
    }

    const removeFromWishlist = async (bookTitle) => {
        try {
            const response = await axios.delete(
                `http://localhost:8081/lms/wishlist/removeFromWishlist?borrowerId=${id}&bookTitle=${bookTitle}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.data) {
                fetchData(); // Refresh the wishlist
                toast.success('Book removed successfully!');
            } else {
                toast.error('Failed to remove book from wishlist.');
            }
        } catch (error) {
            console.error('Error removing book from wishlist:', error);
            toast.error('Book Not Removed');
        }
    }

    return (

        <div className="wish-list">
            <Nav />
            <div className=" wishlist-wrapper">
                <div className="title">
                    <h2>My Wishlist</h2>
                </div>

                <div className='container search mt-5' >
                    <div className='col'>
                        <input type="text" className='form-control fs-5' placeholder='Search by Book Name' value={searchTitle} onChange={handleSearchTitle} />
                        <div className='search-results mt-3 overflow-scroll'>
                            {sampletitle.length > 0 && (
                                <ul className='list-group'>
                                    {titles.filter(title => title.toLowerCase().includes(sampletitle.toLowerCase())).map((title, index) => (
                                        <li key={index} className='list-group-item custom-list-item' onClick={handleSearch}>{title}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                    <div>
                        <button className='btn wishlist-button' onClick={handleAddToWishlist} disabled={!showbutton} >Add To Wishlist</button>
                    </div>
                </div>

                <div className="wishlist-books">
                    {bookdata[0]?.bookId>0 && bookdata.map((book) => (

                        <div key={book.bookId} className="wishlist-card" onClick={() => {
                            setShowBookDescription(true);
                            setIndex(index);
                        }}>
                            <img src={`data:image/png;base64,${book.bookImage}`} />
                            <div className="card-body">
                                <h5 className="card-title">{book.bookTitle}</h5>

                            </div>
                           <button
    onClick={(e) => {
        e.stopPropagation(); // Prevents triggering parent card click
        removeFromWishlist(book.bookTitle);
    }}
>
    Remove
</button>
                        </div>
                    ))}
                </div>



                {showBookDescription && (
                    <div
                        className="modal fade show d-block"
                        tabIndex="-1"
                        role="dialog"
                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                    >
                        <div className="modal-dialog modal-xl" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Book Description</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        aria-label="Close"
                                        onClick={() => setShowBookDescription(false)}
                                    ></button>
                                </div>
                                <div className="modal-body p-0 m-0 textOverflow-ellipsis">
                                    {showBookDescription && (
                                        <Bookdescription bookData={bookdata[index]} />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default WishList