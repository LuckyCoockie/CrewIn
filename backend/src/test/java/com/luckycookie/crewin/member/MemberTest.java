package com.luckycookie.crewin.member;

import io.restassured.RestAssured;
import io.restassured.path.json.JsonPath;
import io.restassured.response.ExtractableResponse;
import io.restassured.response.Response;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertAll;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class MemberTest {

    @LocalServerPort
    int port;

    @BeforeEach
    void setPort() {
        RestAssured.port = port;
    }

    @Test
    void 이메일_중복체크() {
        ExtractableResponse<Response> response = RestAssured.given().log().all()
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .param("email", "realmadrid777@portugal.com")
                .when()
                .get("/member/check-email")
                .then().log().all()
                .extract();

        System.out.println(response.body());
    }

    @Test
    @Transactional
    void 회원가입() {
        // given
        final Map<String, Object> params = Map.of(
                "name", "포트거스",
                "nickname", "에이스",
                "email", "ace1234@ace.com",
                "password", "ace12345"
        );

        // when
        final ExtractableResponse<Response> response = RestAssured.given().log().all()
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .body(params)
                .when().post("/member/signup")
                .then().log().all()
                .extract();

        // then
        final JsonPath result = response.jsonPath();
        assertAll(
                () -> assertThat(response.statusCode()).isEqualTo(HttpStatus.OK.value()),
                () -> assertThat(result.getString("message")).isEqualTo("회원가입 되었습니다.")
        );

    }

}
