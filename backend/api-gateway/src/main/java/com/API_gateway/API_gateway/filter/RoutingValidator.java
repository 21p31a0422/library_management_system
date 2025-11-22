//package com.API_gateway.API_gateway.filter;
//import java.util.List;
//import java.util.function.Predicate;
//
//import org.springframework.http.server.reactive.ServerHttpRequest;
//import org.springframework.stereotype.Component;
//
//@Component
//public class RoutingValidator {
//	public static final List<String> openEndPoints=List.of("/lms/book/getBook","lms/book/getAllBooks","/lms/borrower/Validate","lms/book/getAllBookss"
//			,"/lms/manager/Validate","/lms/book/getAllTitles","/lms/book/getBookType","/lms/book/getAllBookType","/lms/book/newReleases");
//	
//	//
//	public Predicate<ServerHttpRequest> isSecured=
//			i->openEndPoints.stream().noneMatch(uri->i.getURI().getPath().contains(uri));
//			
//			
//			
//}
// RoutingVAlidator


package com.API_gateway.API_gateway.filter;
import java.util.List;
import java.util.function.Predicate;

import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;

@Component
public class RoutingValidator {
	public static final List<String> openEndPoints=List.of("/lms/book/getBook","lms/book/getAllBooks","/lms/borrower/Validate","/lms/book/getAllBookss"
			,"/lms/manager/Validate","/lms/book/getAllTitles","/lms/book/getBookType","/lms/book/getAllBookType","/lms/book/newReleases", "/lms/borrower/updatePassword", "/lms/borrower/getSecurityCredentials");
	
	//
	public Predicate<ServerHttpRequest> isSecured=
			i->openEndPoints.stream().noneMatch(uri->i.getURI().getPath().contains(uri));
			
			
			
}