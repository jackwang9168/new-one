package com.example.springboot.service;

import com.example.springboot.common.Result;
import com.example.springboot.entity.User;
import com.example.springboot.exception.ServiceException;
import com.example.springboot.mapper.UserMapper;
import com.example.springboot.utils.TokenUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    UserMapper userMapper;

    public void insertUser(User user) {
        userMapper.insert(user);
    }

    public void deleteUser(Integer id) {
        userMapper.delete(id);
    }

    //批量删除(可能有用)
    /*public void batchdeleteUser(List<Integer> ids) {
        for (Integer id : ids) {
            userMapper.delete(id);
        }
    }*/

    //id查询
    public User selectUser(Integer id) {
        return userMapper.selectByUserId(id);
    }

    public List<User> selectAllUser() {
        return userMapper.selectAll();
    }

    public void updateUser(User user) {
        userMapper.update(user);
    }


    public User login(User user) {
        User dbUser = userMapper.selectByPhone(user.getPhone());
        if (dbUser == null) {
            throw new ServiceException("手机号或密码错误");
        }
        if(!user.getPassword().equals(dbUser.getPassword())) {
            throw new ServiceException("手机号或密码错误");
        }
        //生成token
        String token = TokenUtils.createToken(dbUser.getId().toString(), user.getPassword());
        dbUser.setToken(token);
        return dbUser;
    }

    //注册验证
    public User register(User user) {
        /*User selectUsername = userMapper.selectByUsername(user.getUsername());
        if (selectUsername != null) {
            throw new ServiceException("用户名存在");
        }
        user.setUsername(user.getUsername());*/
        userMapper.insert(user);
        return user;
    }

    //修改密码
    public void resetPassword(User user) {
        User dbUser = userMapper.selectByUsername(user.getUsername());
        if (dbUser == null) {
            // 抛出一个自定义的异常
            throw new ServiceException("用户名不存在");
        }
        if (!user.getPhone().equals(dbUser.getPhone())) {
            throw new ServiceException("手机号不存在");
        }
        userMapper.updatepass(user);
    }
}
