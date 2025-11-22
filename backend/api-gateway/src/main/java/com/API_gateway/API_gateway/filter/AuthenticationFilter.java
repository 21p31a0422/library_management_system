//package com.API_gateway.API_gateway.filter;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.autoconfigure.AutoConfiguration;
//import org.springframework.cloud.gateway.filter.GatewayFilter;
//import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
//import org.springframework.http.HttpEntity;
//import org.springframework.http.HttpHeaders;
//import org.springframework.http.HttpMethod;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.http.server.reactive.ServerHttpRequest;
//import org.springframework.stereotype.Component;
//import org.springframework.web.client.RestTemplate;
//import org.springframework.web.reactive.function.client.WebClient;
//
//import reactor.core.publisher.Mono;
//
//
//@Component
//public class AuthenticationFilter extends AbstractGatewayFilterFactory<AuthenticationFilter.Config>
//{
//	
//	public AuthenticationFilter() {
//		super(Config.class);
//	}
//
//	@Autowired
//	RoutingValidator routingValidator;
//	@Autowired
//	RestTemplate restTemplate;
//	@Autowired
//    private WebClient.Builder webClientBuilder;
//
//	public static class Config {
//	}
//
//	@Override
//	public GatewayFilter apply(Config config) {
//		
//		// TODO Auto-generated method stub
//		System.out.println("In gateway");
//		
//		return ((exchange,chain)->{
//			ServerHttpRequest request=exchange.getRequest();
//			String Path=request.getPath().toString();
//			System.out.println(Path);
//			System.out.println("from filter");
//			if(routingValidator.isSecured.test(request))
//			{
//				System.out.println(routingValidator.isSecured.test(request) + " TRUE");
//				if(!request.getHeaders().containsKey(HttpHeaders.AUTHORIZATION))
//				{
//					System.out.println("No AUTHORIZATION");
//					throw new RuntimeException("Missing Authorization....................");
//				}
//				String authHeader=request.getHeaders().get(HttpHeaders.AUTHORIZATION).get(0);
//				System.out.println(authHeader);
//				if(authHeader!=null && authHeader.startsWith("Bearer "))
//				{
//					authHeader=authHeader.substring(7);
//					System.out.println(" Token" +authHeader);
//				}
//				try 
//				{
//					
//				
//					String finalAuthHeader = authHeader;
//		            return webClientBuilder.build()
//		                    .get()
//		                    .uri("http://AuthenticationApplication/lms/borrower/Validatetoken?Authorization=" + finalAuthHeader)
//		                    .retrieve()
//		                    .bodyToMono(String.class)
//		                    .flatMap(role -> {
//		                        System.out.println("Role: " + role);
//
//		                        // Role-based access logic
//		                        if ((Path.startsWith("/lms/book") || Path.startsWith("/lms/bookissue") || Path.startsWith("/lms/manager"))
//		                                && "ADMIN".equals(role)) {
//		                            return chain.filter(exchange);
//		                        } 
//		                        else if((Path.startsWith("/lms/bookissue/getHistory") || Path.startsWith("/lms/bookissue/updateFines")) && "USER".equals(role)) {
//		                        	return chain.filter(exchange);
//		                        }
//		                        else if (Path.startsWith("/lms/borrower")) {
//		                            if ((Path.contains("/updateAccount") || Path.contains("/changePassword") || (Path.contains("/getBorrowerByBorrowerId")) || Path.contains("/updateBorrowerProfile")) && "USER".equals(role)) {
//		                                return chain.filter(exchange);
//		                            } else if (!Path.contains("/updateAccount") && "ADMIN".equals(role)) {
//		                                return chain.filter(exchange);
//		                            } else {
//		                                exchange.getResponse().setStatusCode(HttpStatus.BAD_REQUEST);
//		                                return exchange.getResponse().setComplete();
//		                            }
//		                        } else if (Path.startsWith("/lms/wishlist") && "USER".equals(role)) {
//		                        	return chain.filter(exchange);
//		                        }  else {
//		                            exchange.getResponse().setStatusCode(HttpStatus.BAD_REQUEST);
//		                            return exchange.getResponse().setComplete();
//		                        }
//		                    })
//		                    .onErrorResume(error -> {
//		                        System.out.println("Error validating token: " + error.getMessage());
//		                        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
//		                        return exchange.getResponse().setComplete();
//		                    });
//		        }
//				catch(Exception e)
//				{
//					
//					throw new RuntimeException("Unauthorised Access to Application" + e.getMessage());
//				}
//			}
//			
//			System.out.println("access not required");
//			return chain.filter(exchange);
//		});
//	}
//
//	
//	
//}
//
//
//

// AuthenticationFilter
package com.API_gateway.API_gateway.filter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.reactive.function.client.WebClient;

import reactor.core.publisher.Mono;


@Component
public class AuthenticationFilter extends AbstractGatewayFilterFactory<AuthenticationFilter.Config>
{
	
	public AuthenticationFilter() {
		super(Config.class);
	}

	@Autowired
	RoutingValidator routingValidator;
	@Autowired
	RestTemplate restTemplate;
	@Autowired
    private WebClient.Builder webClientBuilder;

	public static class Config {
	}

	@Override
	public GatewayFilter apply(Config config) {
		
		// TODO Auto-generated method stub
		System.out.println("In gateway");
		
		return ((exchange,chain)->{
			ServerHttpRequest request=exchange.getRequest();
			String Path=request.getPath().toString();
			System.out.println(Path);
			System.out.println("from filter");
			if(routingValidator.isSecured.test(request))
			{
				System.out.println(routingValidator.isSecured.test(request) + " TRUE");
				if(!request.getHeaders().containsKey(HttpHeaders.AUTHORIZATION))
				{
					System.out.println("No AUTHORIZATION");
					throw new RuntimeException("Missing Authorization....................");
				}
				String authHeader=request.getHeaders().get(HttpHeaders.AUTHORIZATION).get(0);
				System.out.println(authHeader);
				if(authHeader!=null && authHeader.startsWith("Bearer "))
				{
					authHeader=authHeader.substring(7);
					System.out.println(" Token" +authHeader);
				}
				try 
				{
					
				
					String finalAuthHeader = authHeader;
		            return webClientBuilder.build()
		                    .get()
		                    .uri("http://AuthenticationApplication/lms/borrower/Validatetoken?Authorization=" + finalAuthHeader)
		                    .retrieve()
		                    .bodyToMono(String.class)
		                    .flatMap(role -> {
		                        System.out.println("Role: " + role);

		                        // Role-based access logic
		                        if ((Path.startsWith("/lms/book") || Path.startsWith("/lms/bookissue") || Path.startsWith("/lms/manager"))
		                                && "ADMIN".equals(role)) {
		                            return chain.filter(exchange);
		                        } 
		                        else if((Path.startsWith("/lms/bookissue/getHistory") || Path.startsWith("/lms/bookissue/updateFines")) && "USER".equals(role)) {
		                        	return chain.filter(exchange);
		                        }
		                        else if (Path.startsWith("/lms/borrower")) {
		                        	System.out.print("Line 86 in Authentication Filter");
		                            if ((Path.contains("/updateAccount") || Path.contains("/changePassword") || (Path.contains("/getBorrowerByBorrowerId")) || Path.contains("/updateBorrowerProfile") || Path.contains("/getSecurityCredentials") || Path.contains("/updatePassword"))
		                            		&& "USER".equals(role)) {
		                            	System.out.print("Line 89 in Authentication Filter");
		                                return chain.filter(exchange);
		                            } else if (!Path.contains("/updateAccount") && "ADMIN".equals(role)) {
		                                return chain.filter(exchange);
		                            } else {
		                                exchange.getResponse().setStatusCode(HttpStatus.BAD_REQUEST);
		                                return exchange.getResponse().setComplete();
		                            }
		                        } else if (Path.startsWith("/lms/wishlist") && "USER".equals(role)) {
		                        	return chain.filter(exchange);
		                        }  else {
		                            exchange.getResponse().setStatusCode(HttpStatus.BAD_REQUEST);
		                            return exchange.getResponse().setComplete();
		                        }
		                    })
		                    .onErrorResume(error -> {
		                        System.out.println("Error validating token: " + error.getMessage());
		                        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
		                        return exchange.getResponse().setComplete();
		                    });
		        }
				catch(Exception e)
				{
					
					throw new RuntimeException("Unauthorised Access to Application" + e.getMessage());
				}
			}
			
			System.out.println("access not required");
			return chain.filter(exchange);
		});
	}

	
	
}