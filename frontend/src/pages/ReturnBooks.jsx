import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ReturnBooksStyle.css';
import ManagerNavbar from "../components/ManagerNavbar"
import { useContext } from 'react';
import { LmsContext } from '../context/LmsContext';


const ReturnBooks = () => {
    // State to hold the fetched issued books data.
    const [issuedBooks, setIssuedBooks] = useState([]);
    // State to manage the loading status.
    const [loading, setLoading] = useState(true);
    // State to store any error messages.
    const [error, setError] = useState(null);
     const {token}=useContext(LmsContext)
    // State to provide user feedback on the return action.
    const [returnMessage, setReturnMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState("");
    const [searchField, setSearchField] = useState("issueId");
    const [dateField, setDateField] = useState(""); // issueDate / dueDate / returnDate
    const [dateTerm, setDateTerm] = useState("");   // actual date in yyyy-mm-dd format
    const [statusTerm, setStatusTerm] = useState(""); // status value
    // State for pagination
    const [currentPage, setCurrentPage] = useState(1);
    const booksPerPage = 5; // You can adjust this number

    // Hardcoded manager token and ID for demonstration.
    const managerId = 1;
    

    useEffect(() => {
        setCurrentPage(1); // whenever filters/search changes, go back to page 1
    }, [searchTerm, searchField, dateField, dateTerm, statusTerm]);
    const filteredBooks = issuedBooks.filter((loan) => {
        let matchesText = true;
        let matchesDate = true;
        let matchesStatus = true;

        // Text search
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            switch (searchField) {
                case "bookTitle":
                    matchesText = loan.bookTitle?.toLowerCase().includes(term);
                    break;
                case "author":
                    matchesText = loan.author?.toLowerCase().includes(term);
                    break;
                case "borrowerId":
                    matchesText = Number(loan.borrowerId) === Number(term);
                    break;
                case "issueId":
                    matchesText = Number(loan.issueId) === Number(term);
                    break;
                default:
                    matchesText = true;
            }
        }

        // Date filter
        if (dateField && dateTerm) {
            const formattedLoanDate = loan[dateField]
                ? new Date(loan[dateField]).toISOString().split("T")[0] // yyyy-mm-dd
                : "";
            matchesDate = formattedLoanDate === dateTerm;
        }

        // Status filter
        if (statusTerm) {
            matchesStatus = loan.status?.trim().toLowerCase() === statusTerm.trim().toLowerCase();
        }

        return matchesText && matchesDate && matchesStatus;
    });

    // Helper function to format the date string to a readable format (dd-mm-yyyy).
    const formatDate = (dateString) => {
        if (!dateString) {
            return '--';
        }
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };
    useEffect(() => {
        const fetchIssuedBooks = async () => {
            try {
                await axios.put(
                    `http://localhost:8081/lms/bookissue/updateFines`,
                    null, // PUT request with no body
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
            } catch (err) {
                setError('Failed to fetch issued books. Please check the backend service.');
                setLoading(false);
                console.error('Error fetching data:', err);
            }
        };

        fetchIssuedBooks();
    }, []);
    // Function to fetch all currently issued books for a specific manager.
    const fetchIssuedBooks = async () => {
        try {
            const response = await axios.get(
                `http://localhost:8081/lms/bookissue/getManagerIssuedBooks`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setIssuedBooks(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch issued books. Please check the backend service.');
            setLoading(false);
            console.error('Error fetching data:', err);
        }
    };

    // Function to handle the book return API call, sending only the loanId.
    const handleReturn = async (issueId) => {
        try {
            await axios.put(
                `http://localhost:8081/lms/bookissue/returnBook?issueId=${issueId}`,
                null, // PUT request with no body
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setReturnMessage(`Book for Loan ID ${issueId} returned successfully!`);
            // Refresh the list to reflect the change.
            fetchIssuedBooks();
        } catch (err) {
            setReturnMessage(`Failed to return book for Loan ID ${issueId}. Please try again.`);
            console.error('Error returning book:', err);
        }
    };
    const handleRenew = async (issueId) => {
        try {
            await axios.put(
                `http://localhost:8081/lms/bookissue/renewBook?issueId=${issueId}`,
                null, // PUT request with no body
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setReturnMessage(`Book for Loan ID ${issueId} renewedsuccessfully!`);
            // Refresh the list to reflect the change.
            fetchIssuedBooks();
        } catch (err) {
            setReturnMessage(`Failed to renew book for Loan ID ${issueId}. Please try again.`);
            console.error('Error returning book:', err);
        }
    };

    // Pagination logic
    const indexOfLastBook = currentPage * booksPerPage;
    const indexOfFirstBook = indexOfLastBook - booksPerPage;
    const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
    const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    // useEffect hook to fetch data when the component mounts.
    useEffect(() => {
        fetchIssuedBooks();
    }, []);

  

    return (
        <div className='return-books'>
            <ManagerNavbar />
        <div className="container2 mt-5">
            
            <h1 className="title2">Return Books</h1>
            <p className="subtitle2">Efficiently process book returns.</p>

            <div className="search-bar2">
                {/* Left group */}
                <h5 style={{ margin: 0 }}>SEARCH FILTERS: </h5>
                <div className="filter-bar2 start">
                    <select className="filter-dropdown2" value={searchField} onChange={(e) => setSearchField(e.target.value)}>
                        <option value="issueId">Issue ID</option>
                        <option value="bookTitle">Book Title</option>
                        <option value="author">Author</option>
                        <option value="borrowerId">Borrower ID</option>
                    </select>

                    <input
                        type="text"
                        className='search-input2'
                        placeholder={`Search by ${searchField}`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Middle group */}
                <div className="filter-bar2 center">
                    <select className='filter-dropdown2' value={dateField} onChange={(e) => setDateField(e.target.value)}>
                        <option value="">Filter by Date</option>
                        <option value="issueDate">Issue Date</option>
                        <option value="dueDate">Due Date</option>
                        <option value="returnDate">Return Date</option>
                    </select>

                    <input
                        type="date"
                        value={dateTerm}
                        className='filter-date2'
                        onChange={(e) => setDateTerm(e.target.value)}
                    />
                </div>

                {/* Right group */}
                <div className="filter-bar2 end">
                    <select className='filter-dropdown2' value={statusTerm} onChange={(e) => setStatusTerm(e.target.value)}>
                        <option value="">All Statuses</option>
                        <option value="issued">On-Time</option>
                        <option value="returned">Returned</option>
                        <option value="overdue">Overdue</option>
                        <option value="renewed">Renewed</option>
                    </select>
                </div>
            </div>



            <div className="loan-details-section2">
                {returnMessage && <div className="return-message2">{returnMessage}</div>}
                {currentBooks.length === 0 ? (
                    <div className="no-books-message2">No books are currently on loan for this page.</div>
                ) : (
                    <table className="loan-table2">
                        <thead>
                            <tr>
                                <th>ISSUE ID</th>
                                <th>BOOK TITLE</th>
                                <th>COPY ID</th>
                                <th>BORROWER</th>
                                <th>ISSUE DATE</th>
                                <th>DUE DATE</th>
                                <th>RETURN DATE</th>
                                <th>STATUS</th>
                                <th>FINE</th>
                                <th>ACTION1</th>
                                <th>ACTION2</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentBooks.map((loan) => (
                                <tr key={loan.issueId}>
                                    <td>{loan.issueId}</td>
                                    <td>
                                        <div className="book-info2">
                                            <span className="book-title-cell2">{loan.bookTitle}</span>
                                            <span className="book-author-cell2">by {loan.author}</span>
                                        </div>
                                    </td>
                                    <td>{loan.copyId}</td>
                                    <td>{loan.borrowerId}</td>
                                    <td>{formatDate(loan.issueDate)}</td>
                                    <td>{formatDate(loan.dueDate)}</td>
                                    <td>{formatDate(loan.returnDate)}</td>
                                    <td>
                                        <span className={`status-badge2 status2-${loan.status.toLowerCase()}`}>
                                            {loan.status?.toLowerCase() === 'issued' ? 'ON-TIME' : loan.status || 'Unknown'}
                                        </span>
                                    </td>
                                    <td>${loan.fineAmount ? loan.fineAmount.toFixed(2) : '0.00'}</td>
                                    <td>
                                        {loan.status.toLowerCase() !== 'returned' && (
                                            <button
                                                className="return-button2"
                                                onClick={() => handleReturn(loan.issueId)}
                                            >
                                                Mark as Returned
                                            </button>
                                        )}
                                    </td>
                                    <td>
                                        {(Number(loan.fineAmount || 0) === 0) && (loan.status.toLowerCase() === 'issued') && (
                                            <button
                                                className="renew-button2"
                                                onClick={() => handleRenew(loan.issueId)}
                                            >
                                                Renew
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Pagination Controls */}
            {filteredBooks.length > booksPerPage && (
                <div className="pagination-controls2">
                    <button
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        className="pagination-button2"
                    >
                        &larr; Previous
                    </button>
                    <span className="pagination-info2">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="pagination-button2"
                    >
                        Next &rarr;
                    </button>
                </div>
            )}
        </div>
        </div>
    );
};

export default ReturnBooks;
