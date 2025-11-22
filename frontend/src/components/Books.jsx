import React from 'react'
import '../styles/Books.css'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Bookdescription from './Bookdescription'
const Books = () => {

  const [pageNumber, setPageNumber] = useState(0);
  const [bookDataCache, setBookDataCache] = useState({});
  const [showBookDescription, setShowBookDescription] = useState(false); 
  const [index, setIndex] = useState(0);
  const [category,setCategory] = useState('ALL');

  const [bookType,setBookType] = useState([]);

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

  useEffect(()=>{
    const fetchBookTypes = async () => {
      try {
        const response = await axios.get('http://localhost:8081/lms/book/getBookType');
        const types=response.data;
        types.unshift('ALL'); // Add 'ALL' category at the beginning
        setBookType(types);
      } catch (error) {
        console.error('Error fetching book types:', error);
      }
    };
    fetchBookTypes();
  }, []);

 useEffect(() => {
  // console.log("hii")
  const fetchData = async () => {
    if (bookDataCache[category]?.[pageNumber]) {
      setBookdata(bookDataCache[category][pageNumber]);
      return;
    }

    try {
      var url = '';
      if ((category == "ALL")) {
         url = `http://localhost:8081/lms/book/getAllBooks?pageNumber=${pageNumber}&size=6`;
      }
      else
      {
         url = `http://localhost:8081/lms/book/getAllBookType?pageNumber=${pageNumber}&size=6&bookType=${category}`;

      }
      console.log(url);
      const response = await axios.get(url);

      if (response.data) {
        console.log("requestsent")
        console.log(response.data);
        setBookdata(response.data);
        setBookDataCache((prev) => {
          const genrePages = prev[category]
            ? [...prev[category]]
            : [];
          genrePages[pageNumber] = response.data;
          return { ...prev, [category]: genrePages };
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  fetchData();
}, [pageNumber,category]);
const handleCategory = (category) => {
  console.log(category);
  setCategory(category);
  setPageNumber(0);
  
};
 return (
 <div className="books-wrapper mt-5">
  <div className="container-fluid">
    <h2 className="title">Categories</h2>
    
    <div className='row categories'> 
      <div className='col-md-12 d-flex justify-content-start flex-wrap gap-3  '>
        {bookType.map((category, index) => (
          <div className="card " onClick={() => handleCategory(category)} key={index}>
               <p className="category-card-title">{category}</p>

          </div>
        ))}
      </div>
    </div>
   
    <h2 className="title">Featured Books</h2>
    <div className="row allbooks">
      {bookdata[0]?.bookTitle && bookdata.map((item, index) => (
        <div className="col col-sm-6 col-md-6 col-lg-4 col-xl-3 col-xxl-2 mb-4 " key={index}>
          <div className="card p-0" onClick={() => {
            setShowBookDescription(true);
            setIndex(index);
          }}>

            <img
              src={`data:image/png;base64,${item.bookImage}`}
              className="card-img-top border-radius-0 border-0"
              alt="Book Cover"
              height="200"
              style={{ objectFit: 'fill' ,height:"300px",width:"100%",borderTopLeftRadius:"10px",borderTopRightRadius:"10px"}}
            />
            <div className="card-body">
              <h4 className="card-title">{item.bookTitle}</h4>
              
            </div>
          </div>
        </div>
      ))}
    </div>
    <div></div>
  </div>
  <div className="d-flex justify-content-center mt-3 gap-3">
          <button className="btn" onClick={()=>setPageNumber(pageNumber - 1)}  disabled={pageNumber === 0}>
            Previous
          </button>
          <button className="btn" onClick={()=>setPageNumber(pageNumber + 1)} disabled={bookdata.length < 6}>
            Next
          </button>
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
          <Bookdescription bookData={bookdata[index]} />
        )}
      </div>
    </div>
  </div>
</div>
}
</div>
  );
  
}

export default Books
