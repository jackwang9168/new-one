package com.example.springboot.controller;

import cn.hutool.core.util.StrUtil;
import com.example.springboot.common.AuthAccess;
import com.example.springboot.common.Result;
import com.example.springboot.entity.User;
import com.example.springboot.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
public class WebController {

    @Autowired
    UserService userService;

    @AuthAccess
    @GetMapping("/test")
    public Result hello() {
        return Result.success("success");
    }

    @PostMapping("/login")
    public Result login(@RequestBody User user) {
        //手机号或密码为空
        if(StrUtil.isBlank(user.getPhone()) || StrUtil.isBlank(user.getPassword())) {
            return Result.error("输入不合法");
        }
        user = userService.login(user);
        return Result.success(user);
    }

    @AuthAccess
    @PostMapping("/register")
    public Result register(@RequestBody User user) {
        //用户名或密码为空
        /*if(StrUtil.isBlank(user.getUsername()) || StrUtil.isBlank(user.getPassword())) {
            return Result.error("输入不合法");
        }
        if (user.getUsername().length() < 5 || user.getUsername().length() > 12) {
            return Result.error("输入不合法");
        }*/
        if (user.getPhone().length() != 11) {
            return Result.error("输入不合法");
        }
        // 密码长度为8-16
        if (user.getPassword().length() < 8 || user.getPassword().length() > 16) {
            return Result.error("输入不合法");
        }
        user = userService.register(user);
        return Result.success(user);
    }

    @AuthAccess
    @PutMapping("/password")
    public Result password(@RequestBody User user) {
        if (StrUtil.isBlank(user.getUsername()) || StrUtil.isBlank(user.getPhone()) || StrUtil.isBlank(user.getPassword())) {
            return Result.error("数据输入不能为空");
        }
        userService.resetPassword(user);
        return Result.success();
    }
}
