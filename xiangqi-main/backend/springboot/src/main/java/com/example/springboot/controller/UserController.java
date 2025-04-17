package com.example.springboot.controller;

import com.example.springboot.common.Result;
import com.example.springboot.entity.User;
import com.example.springboot.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    UserService userService;


    //增加信息
    @PostMapping("/add")
    public Result add(@RequestBody User user) {
        try {
            userService.insertUser(user);
        } catch (Exception e) {
            return Result.error("插入数据错误");
        }
        return Result.success();
    }

    //删除信息
    @DeleteMapping("/delete/{id}")
    public Result delete(@PathVariable Integer id) {
        userService.deleteUser(id);
        return Result.success();
    }

    //批量删除信息
    /*@DeleteMapping("/delete/batch")
    public Result batchdelete(@RequestBody List<Integer> ids) {
        userService.batchdeleteUser(ids);
        return Result.success();
    }*/

    //id查询信息
    @GetMapping("/select/{id}")
    public Result selectById(@PathVariable Integer id) {
        User user = userService.selectUser(id);
        return Result.success(user);
    }
    //查询所有
    @GetMapping("/select/All")
    public Result selectAll() {
        List<User> users = userService.selectAllUser();
        return Result.success(users);
    }

    //更改信息
    @PutMapping("/update")
    public Result update(@RequestBody User user) {
        userService.updateUser(user);
        return Result.success();
    }
}
