package com.lms.authentication.models.dao.services;

import java.util.Map;

import com.lms.authentication.models.dto.LoginDTO;

public interface LoginService {

	Map<String,String>validateLogin(LoginDTO logindto);
}
