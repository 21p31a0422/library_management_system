import React, { useState, useEffect } from 'react';
import '../styles/NewReleases.css';
import axios from 'axios';
import Bookdescription from './Bookdescription';

const NewReleases = () => {
  const [pageNumber, setPageNumber] = useState(0);
  const [bookDataCache, setBookDataCache] = useState({});
  const [showBookDescription, setShowBookDescription] = useState(false);
  const [index, setIndex] = useState(0);

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

  useEffect(() => {
    const fetchData = async () => {
      if (bookDataCache[pageNumber]) {
        setBookdata(bookDataCache[pageNumber]);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8081/lms/book/newReleases?pageNumber=${pageNumber}&size=6`
        );

        if (response.data) {
          setBookdata(response.data);
          setBookDataCache((prev) => ({
            ...prev,
            [pageNumber]: response.data
          }));
        }
      } catch (e) {
        console.error(e);
      }
    };

    fetchData();
  }, [pageNumber]);

  return (
    <div className="new-releases-wrapper row allbooks">
      <div className="container-fluid ">
        <h2 className="title">New Releases</h2>
        <div className="row allbooks">
          {bookdata.map((item, index) => (
            <div
              className="col col-sm-6 col-md-6 col-lg-4 col-xl-3 col-xxl-2 mb-4"
              key={index}
            >
              <div
                className="card p-0"
                onClick={() => {
                  setShowBookDescription(true);
                  setIndex(index);
                }}
              >
                <img
                  src={`data:image/png;base64,${item.bookImage}`}
                  alt="Book Cover"
                  style={{ objectFit: 'fill' ,height:"300px",width:"100%",borderTopLeftRadius:"10px",borderTopRightRadius:"10px"}}
                />
                <div className="card-body">
                  <h4 className="card-title">{item.bookTitle}</h4>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="d-flex justify-content-center mt-3 gap-3">
        <button
          className="btn"
          onClick={() => setPageNumber(pageNumber - 1)}
          disabled={pageNumber === 0}
        >
          Previous
        </button>
        <button
          className="btn"
          onClick={() => setPageNumber(pageNumber + 1)}
          disabled={bookdata.length < 6}
        >
          Next
        </button>
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
  );
};

export default NewReleases;
