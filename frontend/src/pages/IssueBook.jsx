import React, { useState, useEffect } from "react";
import axios from "axios";
import '../styles/IssueBookStyle.css';
import ManagerNavbar from "../components/ManagerNavbar"
import { useContext } from 'react';
import { LmsContext } from '../context/LmsContext';
import {toast} from "react-toastify"
const IssueBook = () => {
    const [borrowerId, setBorrowerId] = useState("");
    const [bookTitle, setBookTitle] = useState("");
    const [titleSuggestions, setTitleSuggestions] = useState([]);
    const [allBookTitles, setAllBookTitles] = useState([]);
    const [copyList, setCopyList] = useState([]);
    const [selectedCopyDetails, setSelectedCopyDetails] = useState(null);
    const [copyId, setCopyId] = useState("");
    const [message, setMessage] = useState("");
     const {token,id}=useContext(LmsContext)


    useEffect(() => {
        const fetchAllTitles = async () => {
            try {
                const res = await axios.get("http://localhost:8081/lms/book/getAllTitles", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAllBookTitles(res.data); // assume array of titles
            } catch (error) {
                console.error("Error fetching all book titles:", error);
            }
        };
        fetchAllTitles();
    }, []);

    const calculateDueDate = () => {
        const today = new Date();
        const nextMonth = new Date(today.setMonth(today.getMonth() + 1));
        const mm = String(nextMonth.getMonth() + 1).padStart(2, "0");
        const dd = String(nextMonth.getDate()).padStart(2, "0");
        const yyyy = nextMonth.getFullYear();
        return `${mm}/${dd}/${yyyy}`;
    };
    // Fetch matching book titles for suggestions (without auth headers)
    const handleBookTitleChange = (e) => {
        const newTitle = e.target.value;
        setBookTitle(newTitle);

        if (newTitle.trim().length === 0) {
            setTitleSuggestions([]);
            setCopyList([]); // Clear copies if title is empty
            return;
        }

        const filtered = allBookTitles.filter(title =>
            title.toLowerCase().includes(newTitle.toLowerCase())
        );
        setTitleSuggestions(filtered);
    };

    // Fetch all available copies for selected title (without auth headers)
    const fetchAvailableCopies = async (title) => {
        try {
            const res = await axios.get(
                `http://localhost:8081/lms/bookissue/getAvailableCopies?title=${encodeURIComponent(title)}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setCopyList(res.data);
            setCopyId("");
        } catch (err) {
            console.error(err);
            setCopyList([]);
        }
    };

    const handleTitleSelect = (title) => {
        setBookTitle(title);
        setTitleSuggestions([]);
        fetchAvailableCopies(title);
    };
    const handleCopySelect = async (selectedCopyId) => {
        setCopyId(selectedCopyId);
        if (!selectedCopyId) {
            setSelectedCopyDetails(null);
            return;
        }

        try {
            // 2. Call the backend API to get full copy details
            const res = await axios.get(
                `http://localhost:8081/lms/bookissue/getCopyDetails?copy=${encodeURIComponent(Number(selectedCopyId))}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // 3. Update the state with the fetched details
            setSelectedCopyDetails(res.data);
        } catch (err) {
            console.error("Error fetching copy details:", err);
            setSelectedCopyDetails(null); // Clear details on error
        }
    };
     const resetForm = () => {
        setBorrowerId("");
        setBookTitle("");
        setCopyId("");
        setCopyList([]);
        setSelectedCopyDetails(null);
        setMessage("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

                try {

                    const res = await axios.post(
                        "http://localhost:8081/lms/bookissue/issueBook",
                        {},
                        {
                            params: {
                                borrowerId,
                                bookTitle,
                                copyId,
                                managerId: id,
                                token:token
                            },
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            }
                        }
                    );
                    console.log(res)
                    setMessage(res.data);
                    toast.success("Book Issued Successfully")
                    resetForm();
                }

                catch (err) {
                    console.error(err);
                    toast.error(err.response.data.message || "An error occurred while issuing the book.");
                }
            
        
        
    

};

return (
    <div className="issue-book">
        <ManagerNavbar />
    <div className="container1 pt-3 mt-5">
       
        <h2 className="title1 text-center mb-4">Issue Books</h2>
        <div className="issue-layout1">
            {/* Left side: Search & Loan Details */}
            <div className="left-column1">
                <div className="card search-card1">
                    <h3 className="card-title1">Search</h3>
                    <div className="form-floating mb-3">
                        <input
                            type="text"
                            className="form-control"
                            id="bookTitleInput"
                            value={bookTitle}
                            onChange={handleBookTitleChange}
                            placeholder="Book Title"
                        />
                        <label htmlFor="bookTitleInput">Book Title</label>
                        {titleSuggestions.length > 0 && (
                            <ul className="list-group1">
                                {titleSuggestions.map((title, index) => (
                                    <li
                                        key={index}
                                        className="list-group-item1"
                                        onClick={() => handleTitleSelect(title)} >
                                        {title}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className="form-floating mb-3">
                        <input
                            type="number"
                            className="form-control"
                            id="borrowerIdInput"
                            value={borrowerId}
                            onChange={(e) => setBorrowerId(e.target.value)}
                            placeholder="Borrower ID"
                        />
                        <label htmlFor="borrowerIdInput">Borrower ID</label>
                    </div>
                    <div className="form-floating mb-3">
                        <select
                            className="form-control"
                            id="copyIdSelect"
                            value={copyId}
                            onChange={(e) => handleCopySelect(e.target.value)}
                            disabled={copyList.length === 0}
                            placeholder="Select a Copy"
                        >
                            <option value="">-- Select a Copy --</option>
                            {copyList.map((copy) => (
                                <option key={copy.copyId} value={copy.copyId}>
                                    Copy ID: {copy.copyId}
                                </option>
                            ))}
                        </select>
                        <label htmlFor="copyIdSelect">Select Copy</label>
                    </div>
                    <form onSubmit={handleSubmit} className="loan-details-form1">
                        <div className="form-floating mb-3">
                            <input
                                type="text"
                                className="form-control"
                                id="dueDateInput"
                                value={calculateDueDate()}
                                readOnly
                                placeholder="Due Date"
                            />
                            <label htmlFor="dueDateInput">Due Date</label>
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={!bookTitle || !borrowerId || !copyId}>
                            Issue Book
                        </button>
                    </form>
                </div>
            </div>

            {/* Right side: Selected Copy Details Card */}
            <div className="right-column1">
                <div className="card selected-books-card1">
                    <h3 className="card-title1 text-center">Selected Copy Details</h3>
                    {!selectedCopyDetails ? (
                        <div className="no-selection-box1">
                            <i className="bi bi-book"></i>
                            <p>No copy selected</p>
                            <span>Search for books and select a copy to view details.</span>
                        </div>
                    ) : (
                        <div className="selected-copy-details-wrapper1">
                            <div className="card-image-wrapper1">
                                <img
                                    src={`data:image/jpeg;base64,${selectedCopyDetails.bookImage}`}
                                    alt={selectedCopyDetails.bookTitle}
                                />
                            </div>
                            <div className="card-details-scrollable1">
                                <table className="details-table1">
                                    <tbody>
                                        <tr>
                                            <td><strong>Copy ID:</strong></td>
                                            <td>{copyId}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Book ID:</strong></td>
                                            <td>{selectedCopyDetails.bookId}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Title:</strong></td>
                                            <td>{selectedCopyDetails.bookTitle}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Type:</strong></td>
                                            <td>{selectedCopyDetails.bookType}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Author:</strong></td>
                                            <td>{selectedCopyDetails.author}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Language:</strong></td>
                                            <td>{selectedCopyDetails.bookLanguage}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Total Copies:</strong></td>
                                            <td>{selectedCopyDetails.totalCopies}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Available Copies:</strong></td>
                                            <td>{selectedCopyDetails.availableCopies}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Created At:</strong></td>
                                            <td>{new Date(selectedCopyDetails.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
    </div>
);
};
export default IssueBook;