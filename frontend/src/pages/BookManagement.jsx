import React, { use, useContext } from 'react'
import '../styles/BookManagement.css'
import { useState, useEffect } from 'react'
import { FaEdit } from 'react-icons/fa';
import axios from 'axios'
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import AddBook from '../components/AddBook';
import AddCopy from '../components/AddCopy';
import DeleteBook from '../components/DeleteBook';
import DeleteCopy from '../components/DeleteCopy';
import Bookdescription from '../components/Bookdescription';
import EditBook from '../components/EditBook';
import { LmsContext } from '../context/LmsContext';
import ViewCopy from '../components/ViewCopy';
import Footer from '../components/Footer';
import ManagerNavbar from "../components/ManagerNavbar"
const BookManagement = () => {
 const [pageNumber, setPageNumber] = useState(0);
  const [bookDataCache, setBookDataCache] = useState({});

  const[displayAddBookForm, setDisplayAddBookForm] = useState(false);
  const [showAddCopyForm, setShowAddCopyForm] = useState(false);
  const [showDeleteBookForm, setShowDeleteBookForm] = useState(false);
  const [showDeleteCopyForm, setShowDeleteCopyForm] = useState(false);
  const [showEditBookForm, setShowEditBookForm] = useState(false);
  const [showBookDescription, setShowBookDescription] = useState(false);
  const [showCopyForm, setShowCopyForm] = useState(false);

  const [titles, setTitles] = useState([]);
  const [searchTitle, setSearchTitle] = useState('');
  const[sampletitle, setSampleTitle] = useState('');
  const [showEditOptions, setShowEditOptions] = useState(null);
  const { reload, setReload } = useContext(LmsContext);
  const[formIndex, setFormIndex] = useState(null);
  const [action, setAction] = useState('');

  const [bookdata, setBookdata] = useState([{
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
  }])

  const handleAllFormsClose = () => {
    console.log("All forms closed");
    console.log(reload);
    setDisplayAddBookForm(false);
    setShowAddCopyForm(false);
    setShowDeleteBookForm(false);
    setShowDeleteCopyForm(false);
    setShowEditBookForm(false);
    setShowBookDescription(false);
    setShowCopyForm(false);
    setFormIndex(null);
    reload?fetchdata():null;
    setReload(false);
    
  }

  const handleSearch = async (e) => {
    setSearchTitle(e.target.innerText);
    setSampleTitle('');
    try{
      const response = await axios.get(`http://localhost:8081/lms/book/getBook?bookTitle=${e.target.innerText}`);
      if(response.data) {   
        console.log(response.data);
        setBookdata([response.data]);
      }
      
    }
    catch(e)
    {
      console.log(e);
    }
   
  }

  const editOptions = (index) => {
    setShowEditOptions(prev => prev === index ? null : index);
  }
  
  const handleSearchTitle = (e) => {
    setSearchTitle(e.target.value);
    setSampleTitle(e.target.value);

    if( e.target.value.length === 0) {
      setBookdata(bookDataCache[pageNumber] || []);
    }
  }
useEffect(() => {
  const handleClickOutside = (e) => {
    if (!e.target.closest('.edit-options-popup') && !e.target.closest('.fa-edit')) {
      setShowEditOptions(null);
    }
  };
  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);

const fetchdata =async()=>{

      if(bookDataCache[pageNumber] && !reload) {
        setBookdata(bookDataCache[pageNumber]);
      }
      else{
    try {
      const response =await axios.get(`http://localhost:8081/lms/book/getAllBooks?pageNumber=${pageNumber}&size=10`);
      console.log("hi")
      if (response.data) {
        setBookdata(response.data);
        setBookDataCache((prev) => ({ ...prev, [pageNumber]: response.data })); // optional: limit to 5
        console.log(response.data);
      }
    }
    catch (e) {
      console.log(e);
    }
  }
}


  useEffect(() => {
    
fetchdata();
  }, [pageNumber,]);

    useEffect(() => {
    const fetchtitles = async () => {
      try{
        const titles= await axios.get('http://localhost:8081/lms/book/getAllTitles');
        if(titles.data) {
          setTitles(titles.data);
          console.log(titles.data);
        }
      }
      catch (e) {
        console.log(e);
      }
    }
    fetchtitles();
  },[])

  return (
    <div className="book-management-wrapper" >
        <ManagerNavbar />
      <div className='book-management-container m-4' >
        <div className="container-fluid  d-flex flex-row align-items-center justify-content-between px-5 py-3">
        <h1 className="text-center my-4">Book Management</h1>
        <div className="d-flex flex-direction-row align-items-center justify-content-between">
        <button className="btn m-3" style={{backgroundColor:'#8c61b5', color: 'white'}} onClick={() => {setDisplayAddBookForm(true);setAction('Add New Book')}}>Add New Book+</button>
        <button className="btn" style={{backgroundColor:'#8c61b5', color: 'white'}} onClick={() => {setShowCopyForm(true);setAction('View Copies')}}>View Copies</button>
        </div>
        </div>
        
        <div className='row px-4 py-3 mx-5 mt-5 search' >
          <div className='col'>
            <input type="text" className='form-control fs-5' placeholder='Search by Book Name' value={searchTitle} onChange= {handleSearchTitle} />
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
        </div>

        {(displayAddBookForm || showAddCopyForm || showDeleteBookForm || showDeleteCopyForm|| showEditBookForm || showBookDescription ||showCopyForm) && (
<div
  className="modal fade show d-block"
  tabIndex="-1"
  role="dialog"
  style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
>
  <div
    className={`modal-dialog ${showBookDescription ? "modal-xl" : "modal-md"}`}
    role="document"
  >
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title">
          {showBookDescription ? "Book Description" : action}
        </h5>
        <button
          type="button"
          className="btn-close"
          aria-label="Close"
          onClick={handleAllFormsClose}
        ></button>
      </div>
      <div className="modal-body p-0 m-0 textOverflow-ellipsis">
        {showAddCopyForm && (
          <AddCopy bookId={bookdata[formIndex].bookId} />
        )}
        {displayAddBookForm && <AddBook />}
        {showDeleteBookForm && (
          <DeleteBook bookId={bookdata[formIndex].bookId} />
        )}
        {showDeleteCopyForm && <DeleteCopy bookId={bookdata[formIndex].bookId} />}
        {showEditBookForm && <EditBook bookData={bookdata[formIndex]} />}
        {showBookDescription && (
          <Bookdescription bookData={bookdata[formIndex]} />
        )}
        {showCopyForm && <ViewCopy />}
      </div>
    </div>
  </div>
</div>

)}



        <div className='row mx-5 mt-5 data' >
           
        <table className="table  rounded-2">
          <thead className="table-light m-0 p-0">
            <tr>
              <th>BOOK ID</th>
              <th>TITLE</th>
              <th>AUTHOR</th>
              <th>TOTAL COPIES</th>
              <th>AVAILABILITY</th>
              <th>AVAILABLE COPIES</th>
              <th>ACTIONS</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
           {bookdata.map((item,index) => (
             <tr key={index}>
              <td>{item.bookId}</td>
               <td>{item.bookTitle}</td>
               <td className='text-secondary'>{item.author}</td>
       
               <td  className='text-secondary'>{item.totalCopies}</td>
               <td className={item.available? 'text-success' : 'text-danger' } >{item.available? 'Available' : 'Not Available' }</td>
               <td className='text-secondary'>{item.availableCopies}</td>
               <td style={{ position: 'relative' }}>{showEditOptions===index && (
    <ul className='list-group edit-options-popup'>
      <li className='list-group-item custom-edit-item' onClick={() => { setShowAddCopyForm(true); setFormIndex(index); setAction('Add New Copies'); }}>Add New Copies</li>
      <li className='list-group-item custom-edit-item'  onClick={() => { setShowEditBookForm(true); setFormIndex(index); setAction('Edit Book'); }}>Edit Book</li>
      <li className='list-group-item custom-edit-item' onClick={() => { setShowDeleteBookForm(true); setFormIndex(index); setAction('Delete Book'); }}>Delete Book</li>
      <li className='list-group-item custom-edit-item' onClick={() => { setShowDeleteCopyForm(true); setFormIndex(index); setAction('Delete Copy'); }}>Delete Copy</li>
    </ul>
  )}  <FaEdit style={{ cursor: 'pointer', marginRight: '10px' ,color: '#8c61b5'}} onClick={()=>editOptions(index)} /> </td>
               <td>  <FaEye style={{ cursor: 'pointer' }} onClick={() => { setShowBookDescription(true); setFormIndex(index); }} /></td>
             </tr>
           ))}

          </tbody>
        </table>
           
        </div>
          <div className="d-flex justify-content-center mt-3 gap-3">
          <button className="btn next" onClick={()=>setPageNumber(pageNumber - 1)} style={{backgroundColor:'#8c61b5', color: 'white'}} disabled={pageNumber === 0}>
            Previous
          </button>
          <button className="btn next" onClick={()=>setPageNumber(pageNumber + 1)} style={{backgroundColor:'#8c61b5', color: 'white'}} disabled={bookdata.length < 10}>
            Next
          </button>
          </div>
        </div>
      <Footer />
    </div>
  )
}

export default BookManagement;
