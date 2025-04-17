package com.example.springboot.entity;

import lombok.Data;

@Data
public class User {

    private Integer id;

    private String username;//用户名

    private String password;//密码

    private String phone;//手机号

    private String date;//注册日期

    private String avatar;//头像

    private String token;//密钥
}
