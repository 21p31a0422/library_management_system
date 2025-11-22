import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/HistoryStyle.css';
import Nav from '../components/Nav';
import { useContext } from 'react';
import { LmsContext } from '../context/LmsContext';

// A complete, self-contained React component to display a borrower's loan history.
const BorrowHistory = () => {
    // State to hold the fetched loan history data.
    const [loanHistory, setLoanHistory] = useState([]);
    // State to manage the loading status while data is being fetched.
    const [loading, setLoading] = useState(true);
    // State to store any error messages that occur during the fetch.
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchField, setSearchField] = useState("issueId");
    const [dateField, setDateField] = useState(""); // issueDate / dueDate / returnDate
    const [dateTerm, setDateTerm] = useState("");   // actual date in yyyy-mm-dd format
    const [statusTerm, setStatusTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
     const {token,id}=useContext(LmsContext)
    const booksPerPage = 5;
    // Hardcoded borrowerId and token as provided by the user for testing.
    const borrowerId = 5;
    

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page after search
    };
    const filteredBooks = loanHistory.filter((loan) => {
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
                case "copyId":
                    matchesText = Number(loan.copyId) === Number(term);
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
    // useEffect hook to fetch data when the component mounts.
    useEffect(() => {
        const fetchHistory = async () => {
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
                if (!borrowerId) {
                    setError('Borrower ID is missing.');
                    setLoading(false);
                    return;
                }

                // API endpoint for fetching loan history, using the provided path.
                const response = await axios.get(
                    `http://localhost:8081/lms/bookissue/getHistory?borrowerId=${id}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );

                setLoanHistory(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch loan history. Please try again.');
                setLoading(false);
                console.error('Error fetching data:', err);
            }
        };

        fetchHistory();
    }, []); // Empty dependency array means this effect runs once on mount.

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

   

    return (
        <div className='mybooks-container'>
            <Nav />
        <div className="container3">
            
            <h1 className="title3">Loan History</h1>
            <p className="subtitle3">Track and manage all book loans, past and present.</p>

            {/* Search and filter bar, styled to match the provided layout. */}
                <div className="search-bar3">
                    {/* Left group */}
                    <h5 style={{ margin: 0 }}>SEARCH FILTERS: </h5>
                    <div className="filter-bar3 start">
                        <select className="filter-dropdown3" value={searchField} onChange={(e) => setSearchField(e.target.value)}>
                            <option value="issueId">Issue ID</option>
                            <option value="bookTitle">Book Title</option>
                            <option value="author">Author</option>
                            <option value="copyId">Copy ID</option>
                        </select>

                        <input
                            type="text"
                            className='search-input3'
                            placeholder={`Search by ${searchField}`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Middle group */}
                    <div className="filter-bar3 center">
                        <select className='filter-dropdown3' value={dateField} onChange={(e) => setDateField(e.target.value)}>
                            <option value="">Filter by Date</option>
                            <option value="issueDate">Issue Date</option>
                            <option value="dueDate">Due Date</option>
                            <option value="returnDate">Return Date</option>
                        </select>

                        <input
                            type="date"
                            value={dateTerm}
                            className='filter-date3'
                            onChange={(e) => setDateTerm(e.target.value)}
                        />
                    </div>

                    {/* Right group */}
                    <div className="filter-bar3 end">
                        <select className='filter-dropdown3' value={statusTerm} onChange={(e) => setStatusTerm(e.target.value)}>
                            <option value="">All Statuses</option>
                            <option value="issued">Issued</option>
                            <option value="returned">Returned</option>
                            <option value="overdue">Overdue</option>
                            <option value="renewed">Renewed</option>
                        </select>
                    </div>
                </div>

            <div className="table-container3">
                {
                    <table className="loan-table3">
                        <thead>
                            <tr>
                                <th>ISSUE ID</th>
                                <th>BOOK TITLE</th>
                                <th>COPY ID</th>
                                <th>MANAGER ID ISSUED</th>
                                <th>ISSUE DATE</th>
                                <th>DUE DATE</th>
                                <th>RETURN DATE</th>
                                <th>FINE AMOUNT</th>
                                <th>STATUS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentBooks.map((loan) => (
                                <tr key={loan.issueId}>
                                    <td>{loan.issueId}</td>
                                    <td>
                                        <div className="book-info3">
                                            <span className="book-title-cell3">{loan.bookTitle}</span>
                                            <span className="book-author-cell3">by {loan.author}</span>
                                        </div>
                                    </td>
                                    <td>{loan.copyId}</td>
                                    <td>{loan.managerId}</td>
                                    <td>{formatDate(loan.issueDate)}</td>
                                    <td>{formatDate(loan.dueDate)}</td>
                                    <td>{formatDate(loan.returnDate)}</td>
                                    <td>{loan.fineAmount}</td>
                                    <td>
                                        <span className={`status-badge3 status3-${loan.status.toLowerCase()}`}>
                                            {loan.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                }
            </div>

            {filteredBooks.length > booksPerPage && (
                <div className="pagination-controls3">
                    <button
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        className="pagination-button3"
                    >
                        &larr; Previous
                    </button>
                    <span className="pagination-info3">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="pagination-button3"
                    >
                        Next &rarr;
                    </button>
                </div>
            )}
        </div>
        </div>
    );
};

export default BorrowHistory;
