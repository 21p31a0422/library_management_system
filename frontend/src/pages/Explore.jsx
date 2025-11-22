import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import "../styles/Explore.css"
import Books from '../components/Books.jsx'
import Bookdescription from '../components/Bookdescription.jsx';
import NewReleases from '../components/NewReleases.jsx';
import Footer from '../components/Footer.jsx';
import Nav from "../components/Nav.jsx"
const Explore = () => {

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

    const [showBookDescription, setShowBookDescription] = useState(false);
  const [sampletitle, setSampleTitle] = useState([]);
   const [pageNumber, setPageNumber] = useState(0);
    const [bookDataCache, setBookDataCache] = useState({});
      const [searchTitle, setSearchTitle] = useState('');
      const [results, setResults] = useState(false)
  const [titles, setTitles] = useState([]);
  
 const handleSearch = async (e) => {
    setSearchTitle(e.target.innerText);
    setSampleTitle('');
    setResults(true);
    try{
      const response = await axios.get(`http://localhost:8081/lms/book/getBook?bookTitle=${e.target.innerText}`);
      if(response.data) {   
        console.log(response.data);
        setBookdata(response.data);
      }
    }
    catch(e)
    {
      console.log(e);
    }
   
  }
const handleSearchTitle = (e) => {
 
    setSampleTitle(e.target.value);
    setSearchTitle(e.target.value);
    setResults(false);  
    if( e.target.value.length === 0) {
      setBookdata([]);
      
    }
  }
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
    <div className='explore-page p-0'>
       <Nav />
         <div className="container-fluid d-flex flex-column align-items-start justify-content-between px-5 py-3">
        <h1 className="text-center my-4">Explore Books</h1>
        <p className='fs-5'>Discover a wide range of books across various genres.</p>
        
        </div>
        
        <div className='row   search' >
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

{showBookDescription && 
<div
  className="modal fade show d-block"
  tabIndex="-1"
  role="dialog"
  style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
>
  <div
    className= "modal-dialog modal-xl"
    role="document"
  >
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title">
          Book Description 
        </h5>
        <button
          type="button"
          className="btn-close"
          aria-label="Close"
          onClick={()=>setShowBookDescription(false)}
        ></button>
      </div>
      <div className="modal-body p-0 m-0 textOverflow-ellipsis">
        {showBookDescription && (
          <Bookdescription bookData={bookdata} />
        )}
      </div>
    </div>
  </div>
</div>
}
            <div className='container-fluid px-5'>
        {results &&  <div className="col col-sm-6 col-md-6 col-lg-4 col-xl-3 col-xxl-2 mb-4" >
          <div className="card result" onClick={() => setShowBookDescription(true)}>
            <img
              src={`data:image/png;base64,${bookdata.bookImage}`}
              className="card-img-top"
              alt="Book Cover"
              height="200"
              style={{ objectFit: 'fill' }}
            />
            <div className="card-body">
              <h4 className="card-title">{bookdata.bookTitle}</h4>
            </div>
          </div>
        </div>
}
<div className='container-fluid ' >
      <div className='container-fluid   m-0 h-100 w-100 p-0' >
        <NewReleases />
        </div>
      </div>

        </div >


        <div className='mx-5  border-0 'style={{ backgroundColor: 'white',borderRadius: '10px', marginBottom: '10px' }}  >
      <div className='.booksall mx-4   h-100 mb-4  ' style={{ backgroundColor: 'white' }} >
        <Books />
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Explore
