package com.lms.book.models.dao.serviceimpl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lms.book.models.customexceptions.BookNotFoundException;
import com.lms.book.models.dao.services.CopyService;
import com.lms.book.models.dto.BookCopyDTO;
import com.lms.book.models.pojos.BookCopies;
import com.lms.book.models.pojos.BookDetails;
import com.lms.book.models.repositories.BookRepo;
import com.lms.book.models.repositories.CopyRepo;

import jakarta.transaction.Transactional;

@Service
public class CopyServiceImpl implements CopyService {

	@Autowired
	private CopyRepo copyrepo;
	
	@Autowired
	private BookRepo bookrepo;
	

	@Override
	public List<Long> addCopies(Long bookId, int bookCopies) {
		// TODO Auto-generated method stub
		Optional<BookDetails> op = bookrepo.findByBookIdAndDeletedFalse(bookId);

		if(op.isEmpty())
		{
			throw new BookNotFoundException("Book with title "+bookId+" does not exists");
		}
		try
		{
			
			
				List<BookCopies> copies = new ArrayList<BookCopies>();
				BookDetails book= op.get();
				for(int i=1;i<=bookCopies;i++)
				{
					BookCopies copy= new BookCopies();
					copy.setBookDetails(book);
					copy.setCopyStatus("Available");
					copies.add(copy);
				}
				copyrepo.saveAll(copies);
				book.setTotalCopies(book.getTotalCopies()+bookCopies);
				book.setAvailableCopies(book.getAvailableCopies()+bookCopies);
				book.setAvailable(book.getAvailableCopies()>0);
				bookrepo.save(book);
				return copies.stream().map(i->i.getCopyId()).toList();
			
			
		}
		catch(Exception e)
		{
			throw new RuntimeException("Error While Adding The copies");
		}
		
	}

	
	@Override
	@Transactional
	public String deleteCopy(Long copyId,Long bookId) {
		// TODO Auto-generated method stub
		Optional<BookCopies> op = copyrepo.findByCopyIdAndDeletedFalse(copyId);

		if(op.isEmpty())
		{
			throw new BookNotFoundException("Copy "+copyId+" does not exists");
		}
		try
		{
			
				BookCopies copy=op.get();
				if(!copy.getCopyStatus().equalsIgnoreCase("Available"))	
				{
					throw new BookNotFoundException("Copy "+copyId+" is issued.It can't be deleted");
				}
				BookDetails book=copy.getBookDetails();
				if(book.getBookId()!=bookId)
				{
					throw new BookNotFoundException("Copy "+copyId+" does not exists for this book");
				}
				book.setTotalCopies(book.getTotalCopies()-1);
				book.setAvailableCopies(book.getAvailableCopies()-1);
				book.setAvailable(book.getAvailableCopies()>0);
				
				copy.setDeleted(true);
				copyrepo.save(copy);
				if(book.getTotalCopies()==0)
				{
					book.setDeleted(true);
					bookrepo.save(book);  //If only one copy is available and that copy is deleted
				}
				else
				{
					bookrepo.save(book);
				}
				return "Copy "+copyId+" deleted succesfully";
			
		}
		catch(Exception e)
		{
			throw new RuntimeException(e.getMessage());
		}
		
		
	}


	@Override
	public List<BookCopyDTO> getBookCopies(Long bookId) {
		List<BookCopies> op=copyrepo.findByBookId(bookId);
		if(op.size()==0)
		{
			throw new BookNotFoundException("Copy with BookId "+bookId+" does not exists");
		}
		try
		{
			
			
			
				List<BookCopyDTO>copies=new ArrayList<BookCopyDTO>();
				List<BookCopies>copy=op;
				
				for(BookCopies i:copy)
				{
					BookCopyDTO dto = new BookCopyDTO();
					dto.setCopyId(i.getCopyId());
					dto.setCopyStatus(i.getCopyStatus());
					copies.add(dto);
				}
				return copies;
				
		}
		catch(Exception e)
		{
			throw new RuntimeException("Error while retrieving the copies");
		}
		
		
	}
}
