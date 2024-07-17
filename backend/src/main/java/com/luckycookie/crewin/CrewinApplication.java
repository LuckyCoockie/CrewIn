package com.luckycookie.crewin;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class CrewinApplication {

	public static void main(String[] args) {
		SpringApplication.run(CrewinApplication.class, args);
	}

}
