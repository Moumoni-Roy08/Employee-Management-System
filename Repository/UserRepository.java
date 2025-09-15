package com.project.demo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.demo.Entity.User;

public interface UserRepository extends JpaRepository<User, Long>{

}
